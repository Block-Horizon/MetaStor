import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import uploadRouter from "./routes/upload";
import confirmRouter from "./routes/confirm";
import filesRouter from "./routes/files";
import proxyRouter from "./routes/proxy";
import deleteRouter from "./routes/delete"; // New
import fileRouter from "./routes/file"; // New
import { errorHandler } from "./middleware/error";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/confirm", confirmRouter);
app.use("/api/files", filesRouter);
app.use("/api/proxy", proxyRouter);
app.use("/api/delete", deleteRouter); // New
app.use("/api/file", fileRouter); // New

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
