import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";

function UserHome() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/blog/view", {
          withCredentials: true,
        });
        setBlogs(response.data);
      } catch (err) {
        setError("Failed to fetch blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Main Content
  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Blog Posts
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography
          variant="h6"
          color="error"
          align="center"
          sx={{ mt: 5, fontWeight: "bold" }}
        >
          {error}
        </Typography>
      ) : blogs.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 5, fontStyle: "italic", color: "text.secondary" }}
        >
          No blogs available at the moment.
        </Typography>
      ) : (
        <Grid2
          container
          spacing={4}
          sx={{
            justifyContent: "center",
            alignItems: "stretch",
            maxWidth: 1200, // Maximum width of the grid
            margin: "0 auto", // Center the grid
          }}
        >
          {blogs.map((blog) => (
            <Grid2
              xs={12} // Full width on small screens
              sm={6} // Half width on medium screens
              md={6} // Explicitly set to half width on large screens
              key={blog._id}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Card
                sx={{
                  width: 500, // Fixed width for all cards
                  height: 350, // Fixed height for all cards
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: 3,
                  borderRadius: 2,
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ 
                      fontWeight: "bold", 
                      mb: 2, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical' 
                    }}
                  >
                    {blog.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Created on: {formatDate(blog.date)}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ 
                      color: "text.primary", 
                      fontSize: "1rem",
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 4, 
                      WebkitBoxOrient: 'vertical',
                      flexGrow: 1 
                    }}
                  >
                    {blog.content.length > 200
                      ? `${blog.content.substring(0, 200)}...`
                      : blog.content}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    sx={{ ml: 1, mb: 1 }}
                  >
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
}

export default UserHome;
