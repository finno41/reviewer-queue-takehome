import { Router } from "express";
import { getReviewItemById, listReviewItems } from "./repository";

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
