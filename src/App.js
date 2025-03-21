import { useState, useEffect, useCallback, useRef } from "react";
import { lazy, Suspense } from "react";

// ✅ Lazy Load Catalog Component for Faster Load Time
const Catalog = lazy(() => import("./Catalog"));

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
    <div>
      {/* ✅ Suspense Wrapper for Lazy Loading */}
      <Suspense fallback={<div>Loading Catalog...</div>}>
        <Catalog
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      </Suspense>

      {/* ✅ Optimized Copyright Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Veer Traders. All Rights Reserved.
      </footer>
    </div>
  );
}

export default App;
