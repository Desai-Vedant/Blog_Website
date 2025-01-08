import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";

function BlogDetails() {
  const { id } = useParams(); // Extract blog ID from URL
  const [blog, setBlog] = useState(null);
  const [creatorname, setCreatorname] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/blog/${id}`, {
          withCredentials: true,
        });
        setBlog(response.data);
        const userData = { userId: response.data.creatorid };
        const response2 = await axios.post(
          `http://localhost:3000/user/getname`,
          userData,
          { withCredentials: true }
        );
        setCreatorname(response2.data.creatorname);
      } catch (err) {
        setError("Failed to fetch blog details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        color="error"
        align="center"
        sx={{ mt: 5, fontWeight: "bold" }}
      >
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
        {blog.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Created by: {creatorname}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Published on: {new Date(blog.date).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
        {blog.content}
      </Typography>
    </Box>
  );
}

export default BlogDetails;
