import express from "express";
import { registerUser,authUser,allUsers } from "../controllers/userControllers.js";
import upload from "../middleware/uploadMiddleware.js";
import {protect} from "../middleware/authMiddleware.js"
const router = express.Router();

// Use Multer for the signup route
router.post("/", upload.single("pic"), registerUser);
router.post("/login", authUser);
router.route("/").get(protect, allUsers);
export default router;
