import express from "express";
import {
  addBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { authenticateToken } from "../utils/authorization.js";

const router = express.Router();

router.post("/add", authenticateToken, addBlog);
router.get("/view", authenticateToken, getAllBlogs);
router.get("/:id", authenticateToken, getBlogById);
router.post("/update", authenticateToken, updateBlog);
router.post("/delete", authenticateToken, deleteBlog);

export default router;
