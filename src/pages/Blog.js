import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import "../styles.css";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const CACHE_KEY = "blog_posts_client";
    const CACHE_DURATION = 3600000; // 1 hour

    const fetchPosts = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(`${CACHE_KEY}_time`);

        if (cached && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
          setPosts(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // Fetch with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbzQE-j8fZcIPRIZUOieFmXGQD9-_yEpGx5fDYXr1U5VjKMlxVlb3sGj7B4_OJWzeKsq/exec",
          {
            signal: controller.signal,
            redirect: "follow",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        clearTimeout(timeout);

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Update cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(`${CACHE_KEY}_time`, Date.now());

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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedPost &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setSelectedPost(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedPost]);

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

        {/* Centered Heading */}
        <div className="heading-container">
          <h1>{loading ? "Loading Blog Posts..." : "Latest Blog Posts"}</h1>
        </div>

        {error ? (
          <div className="error-message">
            <p>Failed to load blog posts. Please try again later.</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <div className="blog-grid">
            {loading
              ? Array(2)
                  .fill()
                  .map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="blog-card skeleton"
                    >
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
              : posts.map((post) => (
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
                    {post.excerpt && (
                      <p className="post-excerpt">{post.excerpt}</p>
                    )}
                  </div>
                ))}
          </div>
        )}

        {/* Modal with accessible headings */}
        {selectedPost && (
          <div className="post-modal">
            <div className="modal-content" ref={modalRef}>
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
