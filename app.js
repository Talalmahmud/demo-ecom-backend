import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandleMiddleware.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Error handler middleware (must be last)
app.use(errorHandler);

export default app;
