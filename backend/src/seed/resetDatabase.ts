import { getDatabasePath, resetAndSeedDatabase } from "../database";

const insertedCount = resetAndSeedDatabase();

console.log(`Reset database at ${getDatabasePath()}`);
console.log(`Inserted ${insertedCount} seeded review items`);
