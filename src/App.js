import { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import Catalog from "./pages/Catalog";

const AboutUs = lazy(() => import("./pages/AboutUs")); // Load About Us page lazil
const Blog = lazy(() => import("./pages/Blog")); // Load About Us page lazil

function App() {
  // 🛒 Load cart from localStorage efficiently
  const cartRef = useRef({});

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("Error loading cart from localStorage", error);
      return {};
    }
  });

  useEffect(() => {
    // Prefetch blog data when idle
    const prefetchBlogData = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
          fetch(
            "https://script.google.com/macros/s/AKfycbzQE-j8fZcIPRIZUOieFmXGQD9-_yEpGx5fDYXr1U5VjKMlxVlb3sGj7B4_OJWzeKsq/exec"
          )
            .then((res) => res.json())
            .then((data) => {
              localStorage.setItem("blog_posts_client", JSON.stringify(data));
              localStorage.setItem("blog_posts_client_time", Date.now());
            });
        });
      }
    };

    // Prefetch when route changes or on mount
    const handleRouteChange = () => {
      if (window.location.pathname === "/blog") return;
      prefetchBlogData();
    };

    window.addEventListener("popstate", handleRouteChange);
    prefetchBlogData();

    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // ✅ Save cart to localStorage efficiently
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      cartRef.current = cart;
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cart]);

  // 🛒 Function to add product to cart (optimized with `useCallback`)
  const addToCart = useCallback((productId, productName, productPrice) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId].quantity += 1;
      } else {
        newCart[productId] = {
          name: productName,
          price: productPrice,
          quantity: 1,
        };
      }
      return newCart;
    });
  }, []);

  // 🛒 Function to remove product from cart (optimized with `useCallback`)
  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId].quantity -= 1;
        if (newCart[productId].quantity === 0) {
          delete newCart[productId];
        }
      }
      return newCart;
    });
  }, []);

  return (
    <Router>
      <Helmet>
        <link
          rel="preload"
          href="/products.csv"
          as="fetch"
          type="text/csv"
          crossOrigin="anonymous"
        />
        <title>
          Veer Traders | Wholesale Toys Supplier in Delhi & India – Best Prices
        </title>
        <meta
          name="description"
          content="Veer Traders: Your top wholesale toy supplier in Delhi & India. Get bulk toys at best prices. Wide range: Centy, Annie, Intex. Serving retailers & businesses."
        />
        <meta
          name="keywords"
          content="wholesale toys Delhi, wholesale toy suppliers India, bulk toys, Centy toys wholesale, best toy wholesalers Delhi, Veer Traders"
        />
        <meta name="author" content="Veer Traders" />
      </Helmet>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <Catalog
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Suspense>

      {/* ✅ Optimized Copyright Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Veer Traders. All Rights Reserved.
      </footer>
    </Router>
  );
}

export default App;
