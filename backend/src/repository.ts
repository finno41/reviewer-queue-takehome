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
      ORDER BY submitted_at ASC
    `)
    .all() as ReviewItem[];

  database.close();

  return rows;
}
