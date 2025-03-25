import { useState, useEffect, useCallback, useRef } from "react";
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
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
      <Helmet>
        <link
          rel="preload"
          href="/products.csv"
          as="fetch"
          type="text/csv"
          crossOrigin="anonymous"
        />
        <title>Veer Traders | Wholesale Toys Supplier in India</title>
        <meta
          name="description"
          content="Veer Traders is a leading wholesale toy supplier in India, specializing in high-quality, affordable toys for retailers, resellers, and businesses. We offer a wide range of toys, including die-cast vehicles, educational toys, inflatable pools, dolls, and more from top brands like Centy, Annie, Intex, Toy Express, and Dolly, etc. Whether you run a toy shop, an online store, or a distribution business, we provide bulk toys at the best wholesale prices with attractive discounts."
        />
        <meta
          name="keywords"
          content="veer traders, Veer Traders, veer trader, Veer Trader, Veer traders, centy toys, intex toys, Annie Toys, Best toys, Best Wholesaler of Toys, best wholesaler in Delhi, Best wholesaler, Best Price, Wholesale toys, toys wholesale, buy toys, bulk toys supplier, kids toys, toy store, toys home, toyzhome, toyshome, Wholesale toys supplier in Delhi, Best toy wholesalers in India, wholesale toy supplier, bulk toy wholesaler, best toy wholesalers in delhi, buy toys in bulk, wholesale kids' toys, Centy toys wholesaler, Annie toys distributor, Intex pool wholesaler, Toy Express supplier, Dolly doll wholesaler, centy, toyzhome, toy express, doll house, die cast toys, metal toys, remote car, remote control car, building blocks, educational toys"
        />
        <meta name="author" content="Veer Traders" />
      </Helmet>
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
