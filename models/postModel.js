import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  selectedFile: String,
  comments: { type: [String], default: [] },
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const postModel = mongoose.model("Posts", postSchema);

export default postModel;
