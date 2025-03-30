import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import "../styles.css";

const blogPosts = [
  {
    title: "Toy Trends for 2024: What Retailers Need to Know",
    date: "November 20, 2023",
    image: "/toy-trends-2024.webp", // Replace with your image
    content:
      "The toy industry is constantly evolving, and retailers need to stay ahead of the curve. In 2024, we're seeing a rise in sustainable toys, educational toys, and interactive tech toys...",
  },
  {
    title: "How to Find the Best Wholesale Toy Suppliers in Delhi",
    date: "November 15, 2023",
    image: "/wholesale-toy-suppliers-delhi.webp", // Replace with your image
    content:
      "Finding the right wholesale toy supplier is crucial for your retail business. In Delhi, you'll want to look for suppliers that offer competitive prices, a wide range of products, and reliable delivery...",
  },
  // Add more blog posts
];
const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Veer Traders Blog | Wholesale Toy Industry Insights</title>
        <meta
          name="description"
          content="Read our blog for the latest toy trends, wholesale tips, and industry insights. Veer Traders is your trusted wholesale toy supplier in Delhi & India."
        />
        <meta
          name="keywords"
          content="toy trends, wholesale toys, toy suppliers Delhi, bulk toys, toy retail tips"
        />
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
        <div className="blog-content">
          <h1>Veer Traders Blog</h1>
          <div className="blog-posts">
            {blogPosts.map((post, index) => (
              <div className="blog-post" key={index}>
                <h2>{post.title}</h2>
                <p className="blog-date">{post.date}</p>
                <img loading="lazy" src={post.image} alt={post.title} />
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
        <footer className="footer">
          <p>📍 Address: Chota Bazar, Shahdara, Delhi-32</p>
          <p>
            📧 Email:{" "}
            <a href="mailto:veertraders244246@gmail.com">
              veertraders244246@gmail.com
            </a>
          </p>
          <p>
            📞 Contact: <a href="tel:+919910667810">+91 9910667810</a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Blog;
