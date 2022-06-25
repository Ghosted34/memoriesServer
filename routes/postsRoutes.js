import express from "express";
import {
  getAllPosts,
  getPost,
  getPostBySearch,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
} from "../controllers/postController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.route("/").get(getAllPosts).post(auth, createPost);

router
  .route("/:id")
  .get(getPost)
  .patch(auth, updatePost)
  .delete(auth, deletePost);

router.get("/search", getPostBySearch);

router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);

export default router;
