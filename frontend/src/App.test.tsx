import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import App from "./App";
import * as api from "./api";

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the selected review detail after clicking a review item", async () => {
    const reviewItems = [
      {
        id: "RV-1024",
        title: "Wire transfer limit increase",
        submitted_at: "2026-04-02T08:15:00Z",
        risk_level: "high" as const,
        customer_tier: "priority" as const,
        status: "unassigned" as const,
        assigned_reviewer: null,
        notes_count: 2,
        summary: "Customer requested a same-day increase to a large outgoing transfer limit.",
      },
      {
        id: "RV-1030",
        title: "Manual payout review for new destination country",
        submitted_at: "2026-04-02T11:55:00Z",
        risk_level: "high" as const,
        customer_tier: "priority" as const,
        status: "in_review" as const,
        assigned_reviewer: "alex",
        notes_count: 2,
        summary: "Large payout requested to a destination country not previously used by this account.",
      },
    ];

    vi.spyOn(api, "getReviewItems").mockResolvedValue(reviewItems);
    vi.spyOn(api, "getReviewItemById").mockImplementation(async (id: string) => {
      const item = reviewItems.find((reviewItem) => reviewItem.id === id);

      if (!item) {
        throw new Error("Review item not found");
      }

      return item;
    });

    render(<App />);

    expect(await screen.findByText("Wire transfer limit increase")).toBeInTheDocument();
    expect(await screen.findByText("Customer requested a same-day increase to a large outgoing transfer limit.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Manual payout review for new destination country/i }));

    await waitFor(() => {
      expect(screen.getByText("Large payout requested to a destination country not previously used by this account.")).toBeInTheDocument();
    });

    const detailSection = screen.getByText("Review detail").closest("section");

    if (!detailSection) {
      throw new Error("Could not find the review detail section.");
    }

    expect(within(detailSection).getByText("RV-1030")).toBeInTheDocument();
    expect(within(detailSection).getByText("in_review")).toBeInTheDocument();
  });
});
