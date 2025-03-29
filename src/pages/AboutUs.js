import React from "react";
import Navbar from "../components/Navbar"; // Ensure correct import path
import "../styles.css"; // Ensure global styles are applied

const AboutUs = () => {
  return (
    <>
      <img
        src="/logo.webp"
        alt="Veer Traders Wholesale Toy Supplier Delhi"
        className="logo"
        loading="eager"
        fetchPriority="high"
      />
      <Navbar />
      <div className="about-background">
        <div className="about-container">
          <h1>About Us</h1>
          <p>
            Welcome to <strong>Veer Traders</strong>, India’s trusted{" "}
            <strong>wholesale toy supplier</strong>. We are the leading
            wholesale toy supplier in India, specializing in high-quality,
            affordable toys for retailers, resellers, and businesses. We offer a
            wide range of toys, including die-cast vehicles, educational toys,
            inflatable pools, dolls, and more from top brands like Centy, Annie,
            Intex, Toy Express, and Dolly, etc. Whether you run a toy shop, an
            online store, or a distribution business, we provide{" "}
            <strong>bulk toys at the best wholesale prices.</strong>
          </p>

          <h2>Why Choose Veer Traders?</h2>
          <ul>
            <li>
              ✅ <strong>Best Wholesale Prices</strong> – Get toys at
              factory-direct rates.
            </li>
            <li>
              ✅ <strong>Top Brands</strong> – Centy, Annie, Intex, Toy Express,
              and more.
            </li>
            <li>
              ✅ <strong>Fast & Reliable Supply</strong> – Bulk toy orders
              fulfilled quickly.
            </li>
            <li>
              ✅ <strong>Wide Product Range</strong> – Die-cast toys, remote
              cars, dolls, etc.
            </li>
            <li>
              ✅ <strong>Trusted by 100+ Businesses</strong> – Serving
              wholesalers & resellers.
            </li>
          </ul>

          <h2>Contact Us</h2>
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
        </div>
      </div>
    </>
  );
};

export default AboutUs;
