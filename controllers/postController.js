import postModel from "../models/postModel.js";
import mongoose from "mongoose";

export const getAllPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await postModel.countDocuments({});
    const posts = await postModel
      .find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getPostBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  console.log(req.query);
  console.log(searchQuery, tags);
  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await postModel.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: `error.message` });
    console.log(error);
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new postModel({
    ...post,
    creator: req.userId,
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Post not found");
  }

  const updatedPost = await postModel.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  );

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("Post not found");
  }
  await postModel.findByIdAndRemove(_id);
  res.json({ message: "Post Deleted" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Not Authenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Post not found");
  }

  const post = await postModel.findById(id);
  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await postModel.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const post = await postModel.findById(id);
  post.comments.push(comment);

  const updatedPost = await postModel.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};
