# Notes

## Assumptions

- I treated the active queue as items with status `unassigned` or `in_review`.
- I treated queue urgency as:
  - higher `risk_level` first
  - then `priority` customers before `standard`
  - then older `submitted_at` first
- I used a fixed current reviewer of `alex` for workflow actions.
- I assumed a local-only setup was acceptable, so I used SQLite rather than a separate database server.
- I assumed it was acceptable to focus on a clear local product slice rather than production infrastructure.

## Tradeoffs

- I kept the backend structure small:
  - `api.ts` for routes
  - `repository.ts` for review item reads and workflow updates
  - `database.ts` for SQLite setup helpers
  - `seed/` for reset and seed data
- I added a database reset command so the project can be returned to a known state quickly during local development.
- I prioritized backend workflow correctness and API coverage before adding richer frontend behavior.
- On the frontend, I kept the state model simple with `useState` and `useEffect` rather than introducing a more abstract state layer.
- I wired `Claim` as the main live end-to-end workflow in the UI and left the other buttons visually present but intentionally inert for now to avoid overstating frontend completeness.
- I added backend API tests and one frontend behavioral test to cover the core interaction shape without spending too much time on a larger test suite.

## What I Would Improve Next

- Fully wire `Approve`, `Reject`, and `Escalate` through the frontend instead of showing them as placeholders. A few bugs were introduced when I tried to add them and I unfortunately ran out of time
- Add clearer UI feedback around workflow transitions, especially when an item leaves the active queue after a terminal action.
- Add frontend tests for workflow actions, not just selection/detail behavior.
- Tighten the documentation so `README.md` reflects the current project instead of the original stripped-back scaffold.
- Add a small amount of request/response validation and centralize API error handling on the backend.
- Consider adding one or two focused repository-level tests if the data-access layer grows further.
- Clearer indications on priority sorting in the menu
