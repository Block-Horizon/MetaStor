import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error";

// Import routes
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import confirmRoutes from "./routes/confirm";
import filesRoutes from "./routes/files";
import fileRoutes from "./routes/file";
import deleteRoutes from "./routes/delete";
import proxyRoutes from "./routes/proxy";
import subscriptionRoutes from "./routes/subscription";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/confirm", confirmRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/delete", deleteRoutes);
app.use("/api/proxy", proxyRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
