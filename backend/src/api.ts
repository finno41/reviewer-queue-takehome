import { Router } from "express";
import { listReviewItems } from "./reviewItemsRepository";

export const api = Router();

api.get("/review-items", (_request, response) => {
  response.json({ items: listReviewItems() });
});
