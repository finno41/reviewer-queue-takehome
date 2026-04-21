import cors from "cors";
import express from "express";
import { api } from "./api";

export const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use("/api", api);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
