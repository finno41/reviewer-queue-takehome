import cors from "cors";
import express from "express";
import { listReviewItems } from "./seed/database";

export const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/api/hello", (_request, response) => {
  response.json({ message: "Hello world" });
});

app.get("/api/review-items", (_request, response) => {
  response.json({ items: listReviewItems() });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
