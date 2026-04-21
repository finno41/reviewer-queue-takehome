export type ReviewItem = {
  id: string;
  title: string;
  submitted_at: string;
  risk_level: "low" | "medium" | "high";
  customer_tier: "standard" | "priority";
  status: "unassigned" | "in_review" | "approved" | "rejected" | "escalated";
  assigned_reviewer: string | null;
  notes_count: number;
  summary: string;
};

export type ReviewAction = "claim" | "approve" | "reject" | "escalate";

export type ReviewItemsResponse = {
  items: ReviewItem[];
};

export type ReviewItemResponse = {
  item: ReviewItem;
};
