import { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Catalog from "./pages/Catalog";
import AboutUs from "./pages/AboutUs"; // Import About Us page

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
        <Helmet>
          <title>
            Veer Traders | Wholesale Toys Supplier in Delhi & India – Best
            Prices
          </title>
          <meta
            name="description"
            content="Veer Traders: Your top wholesale toy supplier in Delhi & India. Get bulk toys at best prices. Wide range: Centy, Annie, Intex. Serving retailers & businesses."
          />
          <meta
            name="keywords"
            content="wholesale toys Delhi, wholesale toy suppliers India, bulk toys, Centy toys wholesale, best toy wholesalers Delhi, Veer Traders"
          />
        </Helmet>
        <meta name="author" content="Veer Traders" />
      </Helmet>
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
      </Routes>

      {/* ✅ Optimized Copyright Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Veer Traders. All Rights Reserved.
      </footer>
    </Router>
  );
}

export default App;
