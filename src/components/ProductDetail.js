import React, { useState, useEffect, useMemo } from "react";
import "../styles.css";

const ProductDetail = ({ product, onClose, addToCart, removeFromCart, cart }) => {
  const [mainImage, setMainImage] = useState(product.image);
  const [zoomedImage, setZoomedImage] = useState(null);

  // ✅ UseMemo to prevent unnecessary recalculations
  const additionalImages = useMemo(
    () => (Array.isArray(product.additionalImages) ? product.additionalImages : []),
    [product.additionalImages]
  );

  const isInStock = product.quantity > 0;

  // ✅ Update Main Image When Product Changes
  useEffect(() => {
    setMainImage(product.image);
  }, [product]);

  // ✅ Preload images for smoother transitions
  useEffect(() => {
    if (additionalImages.length > 0) {
      additionalImages.forEach((img) => {
        const imgObj = new Image();
        imgObj.src = img;
      });
    }
  }, [additionalImages]);

  return (
    <div className="product-detail-overlay">
      <div className="product-detail-container">
        <button className="product-detail-close-btn" onClick={onClose}>
          ❌
        </button>

        {/* Left Side - Main Image with Zoom on Click */}
        <div className="product-image-container">
          <img
            loading="lazy"
            src={mainImage}
            alt={product.name}
            className="zoomable-image"
            onClick={() => setZoomedImage(mainImage)}
          />
        </div>

        {/* Right Side - Product Info & Add to Cart */}
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>Price: ₹{product.price}</p>
          <p>Available Quantity: {product.quantity}</p>

          {!isInStock ? (
            <p className="out-of-stock">❌ Out of Stock</p>
          ) : (
            <div className="product-quantity">
              <button className="quantity-btn decrease" onClick={() => removeFromCart(product.name)}>
                ➖
              </button>
              <span>{cart[product.name]?.quantity || 0}</span>
              <button className="quantity-btn increase" onClick={() => addToCart(product)}>
                ➕
              </button>
            </div>
          )}

          {/* Additional Images Section */}
          {additionalImages.length > 0 && (
            <div className="additional-images">
              <h3>More Images</h3>
              <div className="image-thumbnails">
                {additionalImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Additional view"
                    className="thumbnail"
                    loading="lazy"
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div className="zoomed-image-overlay" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="Zoomed Product" className="zoomed-image" />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
