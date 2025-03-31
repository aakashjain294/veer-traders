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
          "https://script.google.com/macros/s/AKfycbxRiIivW8WsC-CoWWnrWroEo8YGAwv9un6_w0KAOcpR3ZX087l2lWb7PKb8BMOWQ2I7/exec"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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
        
        {/* Ensure h1 always has content */}
        <h1>{loading ? "Loading Blog Posts..." : "Latest Blog Posts"}</h1>

        {error ? (
          <div className="error-message">
            <p>Failed to load blog posts. Please try again later.</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <div className="blog-grid">
            {loading ? (
              Array(2).fill().map((_, index) => (
                <div key={`skeleton-${index}`} className="blog-card skeleton">
                  <div className="skeleton-image"></div>
                  {/* Ensure heading has accessible content */}
                  <h2>
                    <span className="sr-only">Loading post</span>
                    <span className="skeleton-text"></span>
                  </h2>
                  <p className="skeleton-date"></p>
                  <p className="skeleton-excerpt"></p>
                </div>
              ))
            ) : (
              posts.map((post) => (
                <div
                  key={post.slug || post.title}
                  className="blog-card"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.image && (
                    <img src={post.image} alt={post.title} loading="lazy" />
                  )}
                  {/* Ensure heading always has text content */}
                  <h2>{post.title || "Untitled Post"}</h2>
                  {post.date && <p className="post-date">{post.date}</p>}
                  {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal with accessible headings */}
        {selectedPost && (
          <div className="post-modal">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setSelectedPost(null)}
                aria-label="Close modal"
              >
                &times;
              </button>
              <h2>{selectedPost.title || "Post Details"}</h2>
              {selectedPost.date && (
                <p className="post-date">{selectedPost.date}</p>
              )}
              {selectedPost.image && (
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title || ""} 
                  aria-hidden={!selectedPost.title}
                />
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