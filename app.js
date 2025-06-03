import express from "express";
import { errorHandler } from "./middleware/errorHandleMiddleware.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handler middleware (must be last)
app.use(errorHandler);

export default app;
