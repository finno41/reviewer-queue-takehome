import test from "node:test";
import assert from "node:assert/strict";
import { app } from "./index";
import { resetAndSeedDatabase } from "./seed/database";
import { seedReviewItems } from "./seed/seedData";

test("GET /api/review-items returns seeded review items", async () => {
  resetAndSeedDatabase();

  const server = app.listen(0);

  try {
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Test server did not provide a port.");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/review-items`);
    const body = (await response.json()) as { items: typeof seedReviewItems };
    const knownSeededItem = seedReviewItems.find((item) => item.id === "RV-1024");

    assert.equal(response.status, 200);
    assert.equal(body.items.length, seedReviewItems.length);
    assert.deepEqual(
      body.items.find((item) => item.id === "RV-1024"),
      knownSeededItem,
    );
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
});
