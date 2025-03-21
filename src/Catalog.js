import React, { useState, useEffect } from "react";
import "./styles.css";
import ProductDetail from "./components/ProductDetail";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product
  const [priceFilter, setPriceFilter] = useState("all");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL =
    "https://script.google.com/macros/s/AKfycbwjFznIlDd-Fq5ch0H0JU5LLUAkOwPY6QXnsPJJgtlYcZREZZHzBPTeh0Vo-WAt9NAEnQ/exec";

  const fetchProducts = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

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

  return (
    <div className="container">
      <img src="/logo.webp" alt="Veer Traders Logo" className="logo" />
      <h1>" Your Trusted Source For Bulk Toy Supplies "</h1>

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

      <div className="product-grid">
        {loading
          ? Array.from({ length: 6 }).map(
              (
                _,
                index // Skeleton for 6 products
              ) => (
                <div key={index} className="product-card skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text small"></div>
                  <div className="skeleton-btn"></div>
                </div>
              )
            )
          : products
              .filter((product) => {
                // Convert price from string to number
                const productPrice = parseInt(product.price);
                // console.log("Image URL:", product.image);
                // Apply the price filter logic
                if (priceFilter === "below-200") return productPrice < 200;
                if (priceFilter === "200-500")
                  return productPrice >= 200 && productPrice <= 500;
                if (priceFilter === "above-500") return productPrice > 500;

                return true; // Show all products if no filter is selected
              })
              .map((product, index) => (
                <div key={index} className="product-card">
                  <img
                    loading="lazy"
                    src={product.image}
                    alt={product.name}
                    onClick={() => setSelectedProduct(product)}
                  />
                  <h2>{product.name}</h2>
                  <p>₹{product.price}</p>
                  <div className="product-quantity">
                    <button
                      className="quantity-btn decrease"
                      onClick={() => removeFromCart(product.name)}
                    >
                      ➖
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={cart[product.name]?.quantity || ""}
                      onChange={(e) =>
                        updateQuantity(product, parseInt(e.target.value) || 1)
                      }
                    />
                    <button
                      className="quantity-btn increase"
                      onClick={() => addToCart(product)}
                    >
                      ➕
                    </button>
                  </div>
                </div>
              ))}
      </div>

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
        className="floating-summary-btn"
        onClick={() => setShowSummary(true)}
      >
        🛒 View Order
      </button>

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
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
            <button className="order-btn" onClick={generateWhatsAppMessage}>
              📦 Order on WhatsApp
            </button>
            <button className="empty-cart-btn" onClick={() => setCart({})}>
              🗑️ Empty Cart
            </button>
            <button className="close-btn" onClick={() => setShowSummary(false)}>
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
