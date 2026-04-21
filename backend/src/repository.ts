import { createReviewItemsTableSql, getDatabase } from "./database";
import type { ReviewItem } from "./seed/seedData";

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
