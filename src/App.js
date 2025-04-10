import { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import Catalog from "./pages/Catalog";

// Define constants at the top
const PRODUCTS_API_URL = "https://script.google.com/macros/s/AKfycbySEg5HEo20GIxGPA8izr9rhou1RCQzo3dgwVrhK63QGQZEI6WITwjKKHrJwHDtBQwQJg/exec";
const BLOG_API_URL = "https://script.google.com/macros/s/AKfycbxkg8aAA_zYiN4PXQOCmfCopTGAr98kIkbPARRpUyNT9xlneaNxqWW8nisLxBAAdeKq/exec";
const PRODUCTS_CACHE_KEY = "veertraders_products";
const BLOG_CACHE_KEY = "blog_posts_client";

const AboutUs = lazy(() => import("./pages/AboutUs"));
const Blog = lazy(() => import("./pages/Blog"));

function App() {
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
    // Combined prefetch function for both products and blog
    const prefetchData = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
          // Prefetch products
          fetch(PRODUCTS_API_URL)
            .then(res => res.json())
            .then(data => {
              localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data));
              localStorage.setItem(`${PRODUCTS_CACHE_KEY}_time`, Date.now());
            })
            .catch(console.error);

          // Prefetch blog
          fetch(BLOG_API_URL)
            .then(res => res.json())
            .then(data => {
              localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify(data));
              localStorage.setItem(`${BLOG_CACHE_KEY}_time`, Date.now());
            })
            .catch(console.error);
        });
      } else {
        // Fallback if requestIdleCallback isn't supported
        Promise.all([
          fetch(PRODUCTS_API_URL),
          fetch(BLOG_API_URL)
        ]).then(async ([productsRes, blogRes]) => {
          const productsData = await productsRes.json();
          const blogData = await blogRes.json();
          
          localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(productsData));
          localStorage.setItem(`${PRODUCTS_CACHE_KEY}_time`, Date.now());
          localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify(blogData));
          localStorage.setItem(`${BLOG_CACHE_KEY}_time`, Date.now());
        }).catch(console.error);
      }
    };

    // Prefetch when route changes or on mount
    const handleRouteChange = () => {
      if (window.location.pathname === "/") return;
      prefetchData();
    };

    window.addEventListener("popstate", handleRouteChange);
    prefetchData(); // Initial prefetch

    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Cart persistence
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      cartRef.current = cart;
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cart]);

  // Cart functions
  const addToCart = useCallback((productId, productName, productPrice) => {
    setCart(prevCart => ({
      ...prevCart,
      [productId]: {
        name: productName,
        price: productPrice,
        quantity: (prevCart[productId]?.quantity || 0) + 1
      }
    }));
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId].quantity -= 1;
        if (newCart[productId].quantity <= 0) {
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
          <Route path="/blog/:slug?" element={<Blog />} />
        </Routes>
      </Suspense>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Veer Traders. All Rights Reserved.
      </footer>
    </Router>
  );
}

export default App;