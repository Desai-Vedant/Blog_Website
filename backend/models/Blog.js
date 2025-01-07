import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  creatorid: String,
  content: String,
  date: Date,
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
