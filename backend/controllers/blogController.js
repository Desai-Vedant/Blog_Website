import Blog from "../models/Blog.js";

export const addBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blogData = {
      title,
      content,
      creatorid: req.user.userId,
      date: new Date(),
    };

    const blog = await Blog.create(blogData);
    return res.status(200).json({ message: "Blog Added Successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Error while Adding Blog!" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    if (!blogs) {
      return res.status(500).json({ message: "Error while Fetching Blogs!" });
    }
    res.status(201).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: "Error while Fetching Blogs!" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(500).json({ message: "Error while Fetching Blog!" });
    }
    res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({ message: "Error while Fetching Blog!" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const newBlogDetails = req.body;
    newBlogDetails.creatorid = req.user.userId;

    const updatedBlog = await Blog.findByIdAndUpdate(
      newBlogDetails._id,
      newBlogDetails
    );
    if (!updatedBlog) {
      res.status(500).json({ message: "Blog Does not Exist!" });
    } else {
      res.status(200).json({ message: updatedBlog });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while Updating the Blog!" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.body;

    const blogData = await Blog.findByIdAndDelete(blogId);
    if (!blogData) {
      res.status(500).json({ message: "Blog Does not Exist!" });
    } else {
      res.status(200).json({ message: blogData });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error while Deleting Blog!" });
  }
};
