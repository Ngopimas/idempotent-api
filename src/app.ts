import express from "express";
import orderRoutes from "./routes/orderRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";

const app = express();

// Global middleware
app.use(requestLogger);
app.use(express.json());

// Routes
app.use("/api/v1", orderRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
