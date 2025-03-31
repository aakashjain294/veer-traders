import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import "../styles.css";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbwuiOiPWjyHMv4itq7xSpWszh5bdGWt5UmDAg6bgIiwaQnS1674yv-oSYZFzAy9_0Au/exec"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Debugging log - check your console
        console.log("Fetched posts:", data);

        if (!Array.isArray(data)) {
          throw new Error("Expected array but got: " + typeof data);
        }

        setPosts(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <Helmet>
        <title>Veer Traders Blog</title>
      </Helmet>

      <div className="blog-container">
        <img
          src="/logo.webp"
          alt="Veer Traders Wholesale Toy Supplier Delhi"
          className="logo"
          loading="eager"
          fetchPriority="high"
        />
        <Navbar />
        <h1>Latest Blog Posts</h1>

        {posts.length === 0 ? (
          <p>No blog posts found.</p>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <div
                key={post.slug || post.title}
                className="blog-card"
                onClick={() => setSelectedPost(post)}
              >
                {post.image && (
                  <img src={post.image} alt={post.title} loading="lazy" />
                )}
                <h2>{post.title}</h2>
                {post.date && <p className="post-date">{post.date}</p>}
                {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
              </div>
            ))}
          </div>
        )}

        {selectedPost && (
          <div className="post-modal">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setSelectedPost(null)}
              >
                &times;
              </button>
              <h2>{selectedPost.title}</h2>
              {selectedPost.date && (
                <p className="post-date">{selectedPost.date}</p>
              )}
              {selectedPost.image && (
                <img src={selectedPost.image} alt={selectedPost.title} />
              )}
              {selectedPost.content && (
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Blog;
