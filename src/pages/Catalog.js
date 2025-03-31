import React, { useState, useEffect, lazy, Suspense } from "react";
import "../styles.css";
import ProductDetail from "../components/ProductDetail";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const ProductGrid = lazy(() => import("../components/ProductGrid")); // Lazy load the grid
const PRODUCTS_CACHE_KEY = "veertraders_products";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product
  const [priceFilter, setPriceFilter] = useState("all");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brandFilter, setBrandFilter] = useState(""); // New Brand Filter State
  const API_URL =
    "https://script.google.com/macros/s/AKfycbyOCgFOtA16SVIJLahjPlGsPQPrG2ZV20FM_3SOWEqzkiaad_io4ITEulejjs4fBUuvjQ/exec";

  // const API_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // console.log("Fetching data from:", API_URL);
      // Check cache first
      const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
      const cacheTime = localStorage.getItem(`${PRODUCTS_CACHE_KEY}_time`);

      if (cached && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        setProducts(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // Fetch with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(API_URL, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      // console.log("Fetched Products Data:", data); // Debugging log
      // Update cache
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(`${PRODUCTS_CACHE_KEY}_time`, Date.now());

      if (!Array.isArray(data)) throw new Error("Invalid data format received");

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      const staleCache = localStorage.getItem(PRODUCTS_CACHE_KEY);
      if (staleCache) {
        setProducts(JSON.parse(staleCache));
      }
      // console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const uniqueBrands = [...new Set(products.map((product) => product.brand))];
    setBrands(uniqueBrands);
  }, [products]); // Run when products change

  useEffect(() => {
    fetchProducts();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowScrollButton(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart[product.name] || {
        ...product,
        quantity: 0,
      };
      return {
        ...prevCart,
        [product.name]: {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        },
      };
    });
  };

  const removeFromCart = (productName) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productName]?.quantity > 1) {
        updatedCart[productName].quantity -= 1;
      } else {
        delete updatedCart[productName];
      }
      return updatedCart;
    });
  };

  const updateQuantity = (product, quantity) => {
    //  const newQuantity = Math.max(1, Number(quantity) || 1);
    if (isNaN(quantity) || quantity < 1) return; // Prevent NaN and negative values

    setCart((prevCart) => {
      const fullProduct =
        products.find((p) => p.name === product.name) || product; // Ensure full product details

      return {
        ...prevCart,
        [product.name]: {
          ...fullProduct, // Ensure all details (name, price) are preserved
          quantity: quantity,
        },
      };
    });
  };

  const generateWhatsAppMessage = () => {
    if (Object.keys(cart).length === 0) return alert("Your cart is empty!");

    let message = "🛒 *Order Invoice*%0A%0A";
    let totalAmount = 0;

    Object.values(cart).forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      totalAmount += subtotal;
      message += `${index + 1}. *${item.name}*%0A   Quantity: ${
        item.quantity
      }%0A   Price: ₹${item.price} x ${item.quantity} = ₹${subtotal}%0A%0A`;
    });

    message += `🔹 *Total Amount: ₹${totalAmount}*%0A%0A`;
    message += `🏪 *Veer Traders*%0A`; // Business Name
    message += `📞 Call Us: %2B91 9910667810 / %2B91 9810853878%0A`; // Phone Numbers
    message += `📧 Email: veertraders244246@gmail.com%0A`; // Email ID

    const number1 = "+919910667810";
    window.open(`https://wa.me/${number1}?text=${message}`, "_blank");
  };

  const filteredProducts = products.filter((product) => {
    const productPrice = parseInt(product.price, 10); // Convert price to number

    // ✅ Apply Search Filter First
    if (!product.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    // ✅ Apply Brand Filter Second (Only filter if brandFilter is selected)
    if (brandFilter && product.brand !== brandFilter) return false;

    // ✅ Apply Price Filter Second
    if (priceFilter === "below-200") return productPrice < 200;
    if (priceFilter === "200-500")
      return productPrice >= 200 && productPrice <= 500;
    if (priceFilter === "above-500") return productPrice > 500;

    return true; // Show all products when no filter is applied
  });

  return (
    <div className="container">
      <img
        src="/logo.webp"
        alt="Veer Traders Wholesale Toy Supplier Delhi"
        className="logo"
        loading="eager"
        fetchPriority="high"
      />
      <h1>" Your Trusted Source For Bulk Toy Supplies "</h1>
      {/* <h2>Find Wholesale Toys in Delhi</h2> */}

      {/* ✅ Move Navbar Below the Heading */}
      <Navbar />

      <input
        type="text"
        placeholder="Search products..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="price-filter"
        value={priceFilter}
        onChange={(e) => setPriceFilter(e.target.value)}
      >
        <option value="all">All Prices</option>
        <option value="below-200">Below ₹200</option>
        <option value="200-500">₹200 - ₹500</option>
        <option value="above-500">Above ₹500</option>
      </select>

      <select
        className="brand-filter"
        value={brandFilter}
        onChange={(e) => setBrandFilter(e.target.value)}
      >
        <option value="">All Brands</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductGrid
          loading={loading}
          filteredProducts={filteredProducts}
          cart={cart}
          setSelectedProduct={setSelectedProduct}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      </Suspense>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          cart={cart}
        />
      )}

      <button
        aria-label="View Your Order"
        className="floating-summary-btn"
        onClick={() => setShowSummary(true)}
      >
        🛒 View Order
      </button>

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          aria-label="Scroll to Top"
          className="scroll-to-top"
          onClick={scrollToTop}
        >
          🔼
        </button>
      )}

      {showSummary && (
        <div className="modal-overlay">
          <div className="order-summary">
            <h2>📋 Order Summary</h2>
            {Object.values(cart).map((item, index) => (
              <div key={index} className="summary-item">
                <p>
                  <strong>{item.name}</strong>
                </p>
                <p>
                  ₹{item.price} x {item.quantity} = ₹
                  {item.price * item.quantity}
                </p>
                <div className="cart-quantity">
                  <button
                    aria-label="Decrease quantity"
                    className="quantity-btn decrease"
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                  >
                    ➖
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item, parseInt(e.target.value) || 1)
                    }
                  />
                  <button
                    aria-label="Increase quantity"
                    className="quantity-btn increase"
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                  >
                    ➕
                  </button>
                </div>
              </div>
            ))}

            <h3>
              💰 Grand Total: ₹
              {Object.values(cart).reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              )}
            </h3>
            <button
              aria-label="Order Now"
              className="order-btn"
              onClick={generateWhatsAppMessage}
            >
              📦 Order on WhatsApp
            </button>
            <button
              aria-label="Empty Cart"
              className="empty-cart-btn"
              onClick={() => setCart({})}
            >
              🗑️ Empty Cart
            </button>
            <button
              aria-label="close"
              className="close-btn"
              onClick={() => setShowSummary(false)}
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}

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
  );
};

export default Catalog;
