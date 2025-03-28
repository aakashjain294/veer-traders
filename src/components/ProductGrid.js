import React from "react";

const ProductGrid = ({
  loading,
  filteredProducts,
  cart,
  setSelectedProduct,
  addToCart,
  removeFromCart,
  updateQuantity,
}) => {
  return (
    <div className="product-grid">
      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="product-card skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text small"></div>
              <div className="skeleton-btn"></div>
            </div>
          ))
        : filteredProducts.map((product, index) => (
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
  );
};

export default ProductGrid;
