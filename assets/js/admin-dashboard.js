import { ProductManager } from './productManager.js';

document.addEventListener("DOMContentLoaded", () => {
  // Render dashboard
  function renderDashboard() {
    const products = ProductManager.getAllProducts();
    console.log("Rendering dashboard with products:", products);

    // Summary cards
    document.getElementById("totalProducts").textContent = products.length;
    const categories = [];
    products.forEach((product) => {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
      }
    });
    document.getElementById("totalCategories").textContent = categories.length;
    const avgPrice = products.length
      ? (
          products.reduce((sum, p) => sum + p.price, 0) / products.length
        ).toFixed(2)
      : 0;
    document.getElementById("avgPrice").textContent = `$${avgPrice}`;
    const totalStock = products.length
      ? products.reduce((sum, p) => sum + p.stock, 0)
      : 0;
    document.getElementById("totalStock").textContent = totalStock;
  }

  // Initial render
  renderDashboard();
});