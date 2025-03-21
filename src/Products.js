// import { useEffect, useState } from 'react';

// const API_URL = "https://script.google.com/macros/s/AKfycbwgPTONtVdn2CaH2yKZoTnvbtHEFld_3AamaRTSe4t6WCUXjD_BKFcsvcOAR2xQj-za5g/exec"; // Replace with your API URL

// function Products() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     console.log("Fetching data from API:", API_URL); // Check if API URL is correct

//     fetch(API_URL)
//       .then(response => {
//         console.log("Raw Response:", response);
//         return response.json();
//       })
//       .then(data => {
//         console.log("Fetched Data:", data); // Log API data
//         setProducts(data);
//       })
//       .catch(error => console.error("Error fetching data:", error));
//   }, []);

//   return (
//     <div className="product-list">
//       {products.length === 0 ? (
//         <p>No products found. Please check your API.</p>
//       ) : (
//         products.map((product) => (
//           <div key={product.id} className="product">
//             <h2>{product.name}</h2>
//             <p>₹{product.price}</p>
//             <img src={product.image} alt={product.name} />
//             <div className="additional-images">
//               {product.additionalImages.map((img, index) => (
//                 <img key={index} src={img} alt={`Additional ${index}`} />
//               ))}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default Products;
