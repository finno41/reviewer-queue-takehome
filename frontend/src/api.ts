import type { ReviewItem, ReviewItemResponse, ReviewItemsResponse } from "./types";

const API_BASE_URL = "http://localhost:3001/api";

export async function getReviewItems(): Promise<ReviewItem[]> {
  const response = await fetch(`${API_BASE_URL}/review-items`);

  if (!response.ok) {
    throw new Error("Could not load review items.");
  }

  const data = (await response.json()) as ReviewItemsResponse;
  return data.items;
}

export async function getReviewItemById(id: string): Promise<ReviewItem> {
  const response = await fetch(`${API_BASE_URL}/review-items/${id}`);

  if (!response.ok) {
    throw new Error("Could not load the selected review item.");
  }

  const data = (await response.json()) as ReviewItemResponse;
  return data.item;
}
