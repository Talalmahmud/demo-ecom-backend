import express from "express";
import { userRegistration } from "../controllers/userController.js";
const router = express.Router();

// Proper separation of concerns
router.post("/signup", userRegistration); // For account creation

export default router;
