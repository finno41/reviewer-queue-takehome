import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { seedReviewItems, type ReviewItem } from "./seed/seedData";

const dataDirectory = path.resolve(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "reviewer-queue.db");
export const createReviewItemsTableSql = `
  CREATE TABLE IF NOT EXISTS review_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    submitted_at TEXT NOT NULL,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    customer_tier TEXT NOT NULL CHECK (customer_tier IN ('standard', 'priority')),
    status TEXT NOT NULL CHECK (status IN ('unassigned', 'in_review', 'approved', 'rejected', 'escalated')),
    assigned_reviewer TEXT,
    notes_count INTEGER NOT NULL,
    summary TEXT NOT NULL
  )
`;

export function getDatabase() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  return new DatabaseSync(databasePath);
}

export function resetAndSeedDatabase(items: ReviewItem[] = seedReviewItems) {
  const database = getDatabase();

  database.exec(createReviewItemsTableSql);

  database.exec("DELETE FROM review_items");

  const insertStatement = database.prepare(`
    INSERT INTO review_items (
      id,
      title,
      submitted_at,
      risk_level,
      customer_tier,
      status,
      assigned_reviewer,
      notes_count,
      summary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of items) {
    insertStatement.run(
      item.id,
      item.title,
      item.submitted_at,
      item.risk_level,
      item.customer_tier,
      item.status,
      item.assigned_reviewer,
      item.notes_count,
      item.summary,
    );
  }

  database.close();

  return items.length;
}

export function getDatabasePath() {
  return databasePath;
}
