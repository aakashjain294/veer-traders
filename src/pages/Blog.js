import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles.css";

// Enhanced formatting function with better future-proofing
const formatBlogContent = (content) => {
  if (!content) return "";

  // First normalize line breaks and handle Windows/Mac/Unix line endings
  let formatted = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Convert multiple newlines into paragraph breaks
  formatted = formatted.split(/\n\n+/);

  // Process each block of content
  formatted = formatted.map((block) => {
    block = block.trim();
    if (!block) return "";

    // Handle bold text (marked with **text** in Google Sheets)
    block = block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Handle section headers (=== HEADER ===)
    if (/^===.+===$/g.test(block)) {
      const title = block.replace(/===/g, "").trim();
      return `<h3 class="section-header">${title}</h3>`;
    }

    // Handle lists (both bullet and numbered)
    if (/^(•|-|\d+\.)\s.+/gm.test(block)) {
      const isOrdered = /^\d+\./.test(block);
      const listItems = block
        .split("\n")
        .map((item) => {
          // Remove list markers and trim, while preserving bold formatting
          const text = item.replace(/^(•|-|\d+\.)\s+/, "").trim();
          return `<li>${text}</li>`;
        })
        .join("");
      return isOrdered ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
    }

    // Handle tables (with | separators)
    if (block.includes("|")) {
      const rows = block.split("\n").map((row) => {
        const cells = row
          .split("|")
          .map((cell) => {
            // Preserve bold formatting in table cells
            const cellContent = cell.trim();
            return `<td>${cellContent}</td>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      });
      return `<table class="content-table"><tbody>${rows.join(
        ""
      )}</tbody></table>`;
    }

    // Handle FAQ items (Q: and A:)
    if (block.startsWith("Q:")) {
      const question = block.substring(2).trim();
      return `<div class="faq-item"><div class="faq-question">${question}</div>`;
    }
    if (block.startsWith("A:")) {
      const answer = block.substring(2).trim();
      return `<div class="faq-answer">${answer}</div></div>`;
    }

    // Handle supplier information blocks
    if (/^SUPPLIER \d+:/i.test(block)) {
      return `<div class="supplier-block">${block.replace(
        /\n/g,
        "<br>"
      )}</div>`;
    }

    // Handle emphasized text (marked with _text_ in Google Sheets)
    block = block.replace(
      /_(.*?)_/g,
      "<em>$1</em>"
    );

    // Default case - regular paragraph with line breaks and preserved formatting
    return `<p>${block.replace(/\n/g, "<br>")}</p>`;
  });

  return formatted.join("");
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  // Static meta description and keywords
  const metaDescription =
    "Read the latest news and articles from Veer Traders, your trusted wholesale toy supplier in Delhi. Discover industry insights and product updates.";
  const metaKeywords =
    "toy wholesaler Delhi, toy supplier blog, wholesale toys news, Veer Traders updates, toy industry insights";

  const handleCloseModal = useCallback(() => {
    setSelectedPost(null);
    navigate("/blog");
  }, [navigate]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    navigate(`/blog/${post.slug || encodeURIComponent(post.title)}`);
  };

  useEffect(() => {
    const CACHE_KEY = "blog_posts_client";
    const CACHE_DURATION = 180000; // 30 min

    const fetchPosts = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(`${CACHE_KEY}_time`);

        if (cached && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
          const cachedPosts = JSON.parse(cached);
          setPosts(cachedPosts);

          // Check for slug match after setting cached posts
          if (slug) {
            const postFromSlug = cachedPosts.find(
              (post) =>
                post.slug === slug || encodeURIComponent(post.title) === slug
            );
            if (postFromSlug) {
              setSelectedPost(postFromSlug);
            }
          }

          setLoading(false);
          return;
        }

        // Fetch with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxkg8aAA_zYiN4PXQOCmfCopTGAr98kIkbPARRpUyNT9xlneaNxqWW8nisLxBAAdeKq/exec",
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

        // Ensure content has proper line breaks
        const formattedPosts = data.map((post) => ({
          ...post,
          content: post.content ? post.content.replace(/\\n/g, "\n") : "",
        }));

        // Update cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(formattedPosts));
        localStorage.setItem(`${CACHE_KEY}_time`, Date.now());

        setPosts(formattedPosts);

        // Check for slug match after setting new posts
        if (slug) {
          const postFromSlug = formattedPosts.find(
            (post) =>
              post.slug === slug || encodeURIComponent(post.title) === slug
          );
          if (postFromSlug) {
            setSelectedPost(postFromSlug);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [slug]);

  useEffect(() => {
    const prefetchLinkedPosts = () => {
      if (selectedPost?.content) {
        const links = selectedPost.content.match(/data-slug="(.*?)"/g);
        if (links) {
          links.forEach((link) => {
            const slug = link.match(/data-slug="(.*?)"/)[1];
            // Prefetch the JSON data for linked posts
            fetch(`/api/blog-posts/${slug}`);
          });
        }
      }
    };
    prefetchLinkedPosts();
  }, [selectedPost]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedPost &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedPost, handleCloseModal]);

  // Add this useEffect for link tracking
  useEffect(() => {
    const handleInternalLinkClick = (e) => {
      if (e.target.closest(".internal-link")) {
        e.preventDefault();
        const slug = e.target.dataset.slug;
        // Track in analytics
        window.ga("send", "event", "Internal Link", "Click", slug);
        // Navigate
        const linkedPost = posts.find((p) => p.slug === slug);
        if (linkedPost) {
          setSelectedPost(linkedPost);
          navigate(`/blog/${slug}`);
        }
      }
    };

    document.addEventListener("click", handleInternalLinkClick);
    return () => document.removeEventListener("click", handleInternalLinkClick);
  }, [posts, navigate]);

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
                onClick={handleCloseModal}
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
                  dangerouslySetInnerHTML={{
                    __html: formatBlogContent(selectedPost.content),
                  }}
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
