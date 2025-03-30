import React, { useState, useEffect, useRef, useMemo } from "react";
import "../styles.css";

const ProductDetail = ({
  product,
  onClose,
  addToCart,
  removeFromCart,
  cart,
}) => {
  const [mainImage, setMainImage] = useState(product.image);
  const [zoomedImage, setZoomedImage] = useState(null);
  const modalRef = useRef(null); // ✅ Reference for the modal

  // ✅ UseMemo to prevent unnecessary recalculations
  const additionalImages = useMemo(
    () =>
      Array.isArray(product.additionalImages) ? product.additionalImages : [],
    [product.additionalImages]
  );

  // const isInStock = product.quantity > 0;

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

  // ✅ Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="product-detail-overlay">
      <div className="product-detail-container" ref={modalRef}>
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
          {/* <p>Available Quantity: {product.quantity}</p> */}

          {
            <div className="product-quantity">
              <button
                className="quantity-btn decrease"
                onClick={() => removeFromCart(product.name)}
              >
                ➖
              </button>
              <span>{cart[product.name]?.quantity || 0}</span>
              <button
                className="quantity-btn increase"
                onClick={() => addToCart(product)}
              >
                ➕
              </button>
            </div>
          }

          {/* Additional Images Section */}
          {additionalImages.length > 0 && (
            <div className="additional-images">
              <h3>More Images</h3>
              <div className="image-thumbnails">
                {additionalImages.map((img, index) => (
                  <img
                    loading="lazy"
                    key={index}
                    src={img}
                    alt={`${product.name} - Additional View ${index + 1}`}
                    className="thumbnail"
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
        <div
          className="zoomed-image-overlay"
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt={product.name} className="zoomed-image" />
        </div>
      )}
      {/* Product Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.name,
          image: [mainImage, ...additionalImages], // Include main and additional images
          description: product.description || "Check product details",
          sku: product.id || "N/A", // If you have product ID or SKU
          brand: {
            "@type": "Brand",
            name: product.brand || "Veer Traders",
          },
          offers: {
            "@type": "Offer",
            url: window.location.href, // Current URL of the product detail page
            priceCurrency: "INR",
            price: product.price,
            availability: "https://schema.org/InStock", // Adjust based on product availability
          },
        })}
      </script>
    </div>
  );
};

export default ProductDetail;
