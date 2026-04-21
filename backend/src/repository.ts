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
      ORDER BY
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
