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

  // Static meta description and keywords
  const metaDescription =
    "Read the latest news and articles from Veer Traders, your trusted wholesale toy supplier in Delhi. Discover industry insights and product updates.";
  const metaKeywords =
    "toy wholesaler Delhi, toy supplier blog, wholesale toys news, Veer Traders updates, toy industry insights";

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
        // Update URL when closing modal
        window.history.pushState(null, "", "/blog");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedPost]);

  // Update URL when opening modal
  const handlePostClick = (post) => {
    setSelectedPost(post);
    window.history.pushState(
      null,
      "",
      `/blog/${post.slug || encodeURIComponent(post.title)}`
    );
  };

  // Generate structured data for blog posts
  const generateStructuredData = () => {
    if (!posts.length) return null;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      headline: "Veer Traders Blog",
      description: metaDescription,
      publisher: {
        "@type": "Organization",
        name: "Veer Traders",
        logo: {
          "@type": "ImageObject",
          url: "https://veertraders.com/logo.webp",
        },
      },
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title || "Untitled Post",
        description: post.excerpt || metaDescription,
        datePublished: post.date || new Date().toISOString(),
        url: `https://veertraders.com/blog/${
          post.slug || encodeURIComponent(post.title)
        }`,
        image: post.image || "https://veertraders.com/default-blog-image.webp",
      })),
    };

    return (
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    );
  };

  return (
    <>
      <Helmet>
        <title>Veer Traders Blog - Wholesale Toy Supplier Insights</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta
          property="og:title"
          content="Veer Traders Blog - Wholesale Toy Supplier Insights"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://veertraders.com/logo.webp" />
        <meta property="og:site_name" content="Veer Traders" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Veer Traders Blog - Wholesale Toy Supplier Insights"
        />
        <meta name="twitter:description" content={metaDescription} />
        <meta
          name="twitter:image"
          content="https://veertraders.com/logo.webp"
        />
        <link rel="canonical" href={window.location.href} />
        {generateStructuredData()}
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

        <main>
          <div className="heading-container">
            <h1>{loading ? "Loading Blog Posts..." : "Latest Blog Posts"}</h1>
          </div>

          {error ? (
            <div className="error-message">
              <p>Failed to load blog posts. Please try again later.</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : (
            <div className="blog-grid" role="list">
              {loading
                ? Array(2)
                    .fill()
                    .map((_, index) => (
                      <article
                        key={`skeleton-${index}`}
                        className="blog-card skeleton"
                        role="listitem"
                      >
                        <div className="skeleton-image"></div>
                        <h2>
                          <span className="sr-only">Loading post</span>
                          <span className="skeleton-text"></span>
                        </h2>
                        <p className="skeleton-date"></p>
                        <p className="skeleton-excerpt"></p>
                      </article>
                    ))
                : posts.map((post) => (
                    <article
                      key={post.slug || post.title}
                      className="blog-card"
                      onClick={() => handlePostClick(post)}
                      role="listitem"
                      itemScope
                      itemType="https://schema.org/BlogPosting"
                    >
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          width="300"
                          height="200"
                          itemProp="image"
                        />
                      )}
                      <h2 itemProp="headline">
                        {post.title || "Untitled Post"}
                      </h2>
                      {post.date && (
                        <p className="post-date" itemProp="datePublished">
                          {post.date}
                        </p>
                      )}
                      {post.excerpt && (
                        <p className="post-excerpt" itemProp="description">
                          {post.excerpt}
                        </p>
                      )}
                      <button
                        className="read-more-btn"
                        aria-label={`Read more about ${post.title}`}
                      >
                        Read More
                      </button>
                    </article>
                  ))}
            </div>
          )}
        </main>

        {selectedPost && (
          <div className="post-modal" aria-modal="true">
            <div className="modal-content" ref={modalRef}>
              <button
                className="close-button"
                onClick={() => {
                  setSelectedPost(null);
                  window.history.pushState(null, "", "/blog");
                }}
                aria-label="Close modal"
              >
                &times;
              </button>
              <h1>{selectedPost.title || "Post Details"}</h1>
              {selectedPost.date && (
                <p className="post-date">{selectedPost.date}</p>
              )}
              {selectedPost.image && (
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title || ""}
                  loading="lazy"
                />
              )}
              {selectedPost.content && (
                <article
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  itemProp="articleBody"
                />
              )}
              <div className="social-share">
                <button aria-label="Share on Facebook">Facebook</button>
                <button aria-label="Share on Twitter">Twitter</button>
                <button aria-label="Share on LinkedIn">LinkedIn</button>
              </div>
            </div>
          </div>
        )}
        <footer className="footer">
          <p>📍 Address: Chhota Bazar, Shahdara, Delhi-32</p>
          <p>
            📧 Email:{" "}
            <a href="mailto:veertraders244246@gmail.com">
              veertraders244246@gmail.com
            </a>
          </p>
          <p>
            📞 Contact: <a href="tel:+919910667810">+91 9910667810</a>
            📞 Contact: <a href="tel:+918851308716">+91 8851308716</a>
            📞 Contact: <a href="tel:+919810853878">+91 9810853878</a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Blog;
