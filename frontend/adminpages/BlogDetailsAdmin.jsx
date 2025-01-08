import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Alert,
} from "@mui/material";

function BlogDetailsAdmin() {
  const { id } = useParams(); // Extract blog ID from URL
  const navigate = useNavigate(); // For navigation
  const [blog, setBlog] = useState(null);
  const [creatorname, setCreatorname] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [updateError, setUpdateError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/blog/${id}`, {
          withCredentials: true,
        });
        setBlog(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
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

  const handleUpdate = async () => {
    try {
      setUpdateError(null);
      setSuccessMessage(null);

      const updatedBlog = { _id: id, title, content };
      await axios.post("http://localhost:3000/blog/update", updatedBlog, {
        withCredentials: true,
      });

      setSuccessMessage("Blog updated successfully.");
      setEditMode(false);
      setBlog({ ...blog, title, content }); // Update state to reflect changes
    } catch (err) {
      setUpdateError("Failed to update blog. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.post(
        "http://localhost:3000/blog/delete",
        { blogId: id },
        { withCredentials: true }
      );
      navigate("/adminhome"); // Navigate to admin home after deletion
    } catch (err) {
      setError("Failed to delete blog. Please try again.");
    }
  };

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
        {editMode ? (
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Blog Title"
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
        ) : (
          blog.title
        )}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Created by: {creatorname}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Published on: {new Date(blog.date).toLocaleDateString()}
      </Typography>
      {editMode ? (
        <TextField
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          label="Blog Content"
          variant="outlined"
          multiline
          rows={10}
          sx={{ marginBottom: 3 }}
        />
      ) : (
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          {blog.content}
        </Typography>
      )}
      {editMode ? (
        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setEditMode(true)}
          >
            Edit Blog
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Delete Blog
          </Button>
        </Box>
      )}
      {updateError && (
        <Alert severity="error" sx={{ marginTop: 3 }}>
          {updateError}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ marginTop: 3 }}>
          {successMessage}
        </Alert>
      )}
    </Box>
  );
}

export default BlogDetailsAdmin;
