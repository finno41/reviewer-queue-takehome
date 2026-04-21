import { createReviewItemsTableSql, getDatabase } from "./database";
import type { ReviewItem } from "./seed/seedData";

const CURRENT_REVIEWER = "alex";
type WorkflowAction = "claim" | "approve" | "reject" | "escalate";

const actionToNextStatus: Record<Exclude<WorkflowAction, "claim">, ReviewItem["status"]> = {
  approve: "approved",
  reject: "rejected",
  escalate: "escalated",
};

export function listReviewItems() {
  const database = getDatabase();
  database.exec(createReviewItemsTableSql);

  const rows = database
    .prepare(`
      SELECT
        id,
        title,
        submitted_at,
        risk_level,
        customer_tier,
        status,
        assigned_reviewer,
        notes_count,
        summary
      FROM review_items
      WHERE status IN ('unassigned', 'in_review')
      ORDER BY
        CASE risk_level
          WHEN 'high' THEN 0
          WHEN 'medium' THEN 1
          ELSE 2
        END,
        CASE customer_tier
          WHEN 'priority' THEN 0
          ELSE 1
        END,
        submitted_at ASC
    `)
    .all() as ReviewItem[];

  database.close();

  return rows;
}

export function getReviewItemById(id: string) {
  const database = getDatabase();
  database.exec(createReviewItemsTableSql);

  const row = database
    .prepare(`
      SELECT
        id,
        title,
        submitted_at,
        risk_level,
        customer_tier,
        status,
        assigned_reviewer,
        notes_count,
        summary
      FROM review_items
      WHERE id = ?
    `)
    .get(id) as ReviewItem | undefined;

  database.close();

  return row ?? null;
}

function getReviewItemForUpdate(id: string) {
  const database = getDatabase();
  database.exec(createReviewItemsTableSql);

  const existingItem = database
    .prepare(`
      SELECT
        id,
        title,
        submitted_at,
        risk_level,
        customer_tier,
        status,
        assigned_reviewer,
        notes_count,
        summary
      FROM review_items
      WHERE id = ?
    `)
    .get(id) as ReviewItem | undefined;

  return { database, existingItem };
}

export function applyWorkflowAction(id: string, action: WorkflowAction) {
  const { database, existingItem } = getReviewItemForUpdate(id);

  if (!existingItem) {
    database.close();
    return { error: "Review item not found" as const, statusCode: 404 };
  }

  if (action === "claim") {
    if (existingItem.status !== "unassigned") {
      database.close();
      return { error: "Only unassigned review items can be claimed" as const, statusCode: 400 };
    }

    database
      .prepare(`
        UPDATE review_items
        SET status = 'in_review',
            assigned_reviewer = ?
        WHERE id = ?
      `)
      .run(CURRENT_REVIEWER, id);
  } else {
    if (existingItem.status !== "in_review") {
      database.close();
      return { error: `Only review items in review can be ${action}d` as const, statusCode: 400 };
    }

    database
      .prepare(`
        UPDATE review_items
        SET status = ?
        WHERE id = ?
      `)
      .run(actionToNextStatus[action], id);
  }

  const updatedItem = database
    .prepare(`
      SELECT
        id,
        title,
        submitted_at,
        risk_level,
        customer_tier,
        status,
        assigned_reviewer,
        notes_count,
        summary
      FROM review_items
      WHERE id = ?
    `)
    .get(id) as ReviewItem;

  database.close();

  return { item: updatedItem };
}

export function claimReviewItem(id: string) {
  return applyWorkflowAction(id, "claim");
}

export function approveReviewItem(id: string) {
  return applyWorkflowAction(id, "approve");
}

export function rejectReviewItem(id: string) {
  return applyWorkflowAction(id, "reject");
}

export function escalateReviewItem(id: string) {
  return applyWorkflowAction(id, "escalate");
}
