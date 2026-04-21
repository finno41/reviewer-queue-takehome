import { Router } from "express";
import {
  approveReviewItem,
  claimReviewItem,
  escalateReviewItem,
  getReviewItemById,
  listReviewItems,
  rejectReviewItem,
} from "./repository";

export const api = Router();

api.get("/review-items", (_request, response) => {
  response.json({ items: listReviewItems() });
});

api.get("/review-items/:id", (request, response) => {
  const item = getReviewItemById(request.params.id);

  if (!item) {
    response.status(404).json({ error: "Review item not found" });
    return;
  }

  response.json({ item });
});

api.post("/review-items/:id/claim", (request, response) => {
  const result = claimReviewItem(request.params.id);

  if ("error" in result && typeof result.statusCode === "number") {
    const { statusCode, error } = result;
    response.status(statusCode).json({ error });
    return;
  }

  response.json({ item: result.item });
});

api.post("/review-items/:id/approve", (request, response) => {
  const result = approveReviewItem(request.params.id);

  if ("error" in result && typeof result.statusCode === "number") {
    const { statusCode, error } = result;
    response.status(statusCode).json({ error });
    return;
  }

  response.json({ item: result.item });
});

api.post("/review-items/:id/reject", (request, response) => {
  const result = rejectReviewItem(request.params.id);

  if ("error" in result && typeof result.statusCode === "number") {
    const { statusCode, error } = result;
    response.status(statusCode).json({ error });
    return;
  }

  response.json({ item: result.item });
});

api.post("/review-items/:id/escalate", (request, response) => {
  const result = escalateReviewItem(request.params.id);

  if ("error" in result && typeof result.statusCode === "number") {
    const { statusCode, error } = result;
    response.status(statusCode).json({ error });
    return;
  }

  response.json({ item: result.item });
});
