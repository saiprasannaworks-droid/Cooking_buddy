import express from "express";

import {
  createIngredient,
  getIngredients,
  bulkUploadIngredients,
} from "../controllers/ingredientController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  createIngredient
);

router.get("/", getIngredients);

router.post(
  "/bulk-upload",
  protect,
  adminOnly,
  upload.single("file"),
  bulkUploadIngredients
);

export default router;