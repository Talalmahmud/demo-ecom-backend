import express, { json } from "express";
import { getUser, userRegistration } from "../controllers/userController.js";
const router = express.Router();
// Proper separation of concerns
router.post("/signup", userRegistration); // For account creation
router.get("/me", getUser);

export default router;
