import express from "express";
import connectDB from "./utils/database.js";
import User from "./models/User.js";
import Blog from "./models/Blog.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./utils/authorization.js";
import cors from "cors";
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

connectDB();

app.get("/", async (req, res) => {
  res.send("Home Page");
});

// Login
app.post("/user/login", async (req, res) => {
  try {
    // Destructure Input
    const { email, password, isadmin } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, isadmin });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    // Check Password
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ email: email, userId: user._id }, "ncircle", {
          expiresIn: "1h", // Token expiration (optional)
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        return res.status(200).json({ _id: user._id, isadmin: user.isadmin });
      } else {
        return res.status(401).json({ message: "Invalid Credentials!" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Register
app.post("/user/register", async (req, res) => {
  try {
    // Destructure Input
    const { name, email, password, isadmin } = req.body;

    // Check if user already Exist
    const existingUser = await User.findOne({ email: email, isadmin: isadmin });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({ name, email, password: hash, isadmin });

    // Create Token
    const token = jwt.sign({ email: email, userId: user._id }, "ncircle", {
      expiresIn: "1h",
    });

    // Add token to cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(201).json({ _id: user._id, isadmin: user.isadmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout
app.post("/user/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully." });
});

// Add a Blog
app.post("/blog/add", authenticateToken, async (req, res) => {
  // Add a Blog to database
  // Input - Blog Data
  // Output - Status
  try {
    // Destructure Input
    const { title, content } = req.body;
    // Convert blog in required format
    const blogData = {
      title,
      content,
      creatorid: req.user.userId,
      date: new Date(),
    };
    // Add to database
    const blog = await Blog.create(blogData);
    return res.status(200).json({ message: "Blog Added Sucessfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Error while Adding Blog!" });
  }
});

// Get All Blog Posts
app.get("/blog/view", authenticateToken, async (req, res) => {
  // Send data of all the blogs to user
  // Input - None
  // Output - blogs json
  try {
    const blogs = await Blog.find({});
    if (!blogs) {
      return res.status(500).json({ message: "Error while Fetching Blogs!" });
    }
    res.status(201).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: "Error while Fetching Blogs!" });
  }
});

// Get a Specific Blog
app.get("/blog/:id", async (req, res) => {
  // Send data of all the blogs to user
  // Input - Id of Blog
  // Output - blogs json
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(500).json({ message: "Error while Fetching Blog!" });
    }
    res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({ message: "Error while Fetching Blog!" });
  }
});

// Edit a Post
app.post("/blog/update", authenticateToken, async (req, res) => {
  // Edit a blog
  // Input - Blog Details
  // Output - Updated Blog details
  try {
    // Get New Blog Details
    const newBlogDetails = req.body;
    // Add userId to it (as creatorid)
    const userId = req.user.userId;
    newBlogDetails.creatorid = userId;
    // Update the Blog
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
    res.status(500).json({ message: "Error while Updating then Blog!" });
  }
});

app.post("/blog/delete", authenticateToken, async (req, res) => {
  // Delete a blog
  // Input - Id of blog to delete
  // Output - Status
  try {
    // Deconstruct Input
    const { blogId } = req.body;
    // Delete Blog
    const blogData = await Blog.findByIdAndDelete(blogId);
    if (!blogData) {
      res.status(500).json({ message: "Product Does not Exist!" });
    } else {
      res.status(200).json({ message: blogData });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error while Deleting Blog!" });
  }
});

app.listen(port, () => {
  console.log("Server Works!");
});
