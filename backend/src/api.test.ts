import test from "node:test";
import assert from "node:assert/strict";
import { app } from "./index";
import { resetAndSeedDatabase } from "./database";
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
    assert.ok(body.items.length < seedReviewItems.length);
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

test("GET /api/review-items excludes terminal review items", async () => {
  resetAndSeedDatabase();

  const server = app.listen(0);

  try {
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Test server did not provide a port.");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/review-items`);
    const body = (await response.json()) as { items: typeof seedReviewItems };

    assert.equal(response.status, 200);
    assert.ok(body.items.every((item) => item.status === "unassigned" || item.status === "in_review"));
    assert.equal(body.items.some((item) => item.status === "approved"), false);
    assert.equal(body.items.some((item) => item.status === "rejected"), false);
    assert.equal(body.items.some((item) => item.status === "escalated"), false);
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

test("GET /api/review-items returns the active queue in urgency order", async () => {
  resetAndSeedDatabase();

  const server = app.listen(0);

  try {
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Test server did not provide a port.");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/review-items`);
    const body = (await response.json()) as { items: typeof seedReviewItems };

    assert.equal(response.status, 200);
    assert.deepEqual(
      body.items.map((item) => item.id),
      ["RV-1024", "RV-1030", "RV-1025", "RV-1032", "RV-1035", "RV-1026", "RV-1028", "RV-1027", "RV-1031"],
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

test("GET /api/review-items/:id returns the matching review item", async () => {
  resetAndSeedDatabase();

  const server = app.listen(0);

  try {
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Test server did not provide a port.");
    }

    const expectedItem = seedReviewItems.find((item) => item.id === "RV-1030");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/review-items/RV-1030`);
    const body = (await response.json()) as { item: typeof seedReviewItems[number] };

    assert.equal(response.status, 200);
    assert.deepEqual(body.item, expectedItem);
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

test("GET /api/review-items/:id returns 404 for an unknown review item", async () => {
  resetAndSeedDatabase();

  const server = app.listen(0);

  try {
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Test server did not provide a port.");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/review-items/UNKNOWN-ID`);
    const body = (await response.json()) as { error: string };

    assert.equal(response.status, 404);
    assert.equal(body.error, "Review item not found");
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
