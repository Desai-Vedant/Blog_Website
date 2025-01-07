import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = { title, content };
      await axios.post("http://localhost:3000/blog/add", blogData, {
        withCredentials: true,
      });
      navigate("/adminhome");
    } catch (err) {
      setError("Failed to add blog. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", marginBottom: 3 }}
      >
        Add New Blog
      </Typography>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} style={{ marginBottom: "3rem" }}>
        <TextField
          label="Blog Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Blog Content"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={15}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#115293",
            },
          }}
        >
          Add Blog
        </Button>
      </form>
    </Box>
  );
}
