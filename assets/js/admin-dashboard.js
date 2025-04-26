import { CategoryManager } from "./categoryManager.js";
import { ProductManager } from "./productManager.js";
import { ReviewManager } from "./reviewManager.js";
import { UserManager } from "./userManager.js";

document.addEventListener("DOMContentLoaded", () => {
  // Render dashboard
  function renderDashboard() {
    // Summary cards
    const products = ProductManager.getAllProducts();
    console.log("Rendering dashboard with products:", products);
    const totalProductsEl = document.getElementById("totalProducts");
    if (totalProductsEl) totalProductsEl.textContent = products.length;

    const categories = CategoryManager.getAllCategories();
    const totalCategoriesEl = document.getElementById("totalCategories");
    if (totalCategoriesEl) totalCategoriesEl.textContent = categories.length;

    const reviews = ReviewManager.getAllReviews();
    const totalReviewsEl = document.getElementById("totalReviews");
    if (totalReviewsEl) totalReviewsEl.textContent = reviews.length;

    const users = UserManager.getAllUsers();
    const totalUsersEl = document.getElementById("totalUsers");
    if (totalUsersEl) totalUsersEl.textContent = users.length;

    // Chart 1: Products per Category (Bar Chart)
    const productsPerCategory = categories.map((category) => ({
      name: category.name,
      count: products.filter((p) => p.categoryId === category.id).length,
    }));

    const barChartCanvas = document.getElementById("productsPerCategoryChart");
    if (barChartCanvas) {
      const barChartCtx = barChartCanvas.getContext("2d");
      new Chart(barChartCtx, {
        type: "bar",
        data: {
          labels: productsPerCategory.map((c) => c.name),
          datasets: [
            {
              label: "Number of Products",
              data: productsPerCategory.map((c) => c.count),
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Number of Products" },
            },
            x: {
              title: { display: true, text: "Category" },
            },
          },
        },
      });
    } else {
      console.warn("Products per Category chart canvas not found");
    }

    // Chart 2: Sales Distribution by Category (Pie Chart)
    const salesPerCategory = categories
      .map((category) => ({
        name: category.name,
        sold: products
          .filter((p) => p.categoryId === category.id)
          .reduce((sum, p) => sum + (p.soldCount || 0), 0),
      }))
      .filter((category) => category.sold > 0); // Filter categories with zero sales

    const pieChartCanvas = document.getElementById("salesPerCategoryChart");
    const pieChartContainer = pieChartCanvas?.parentElement;
    if (pieChartContainer && pieChartCanvas) {
      if (salesPerCategory.length === 0) {
        pieChartContainer.innerHTML = `
          <div class="text-center text-muted">
            <p>No sales data available yet.</p>
          </div>
        `;
      } else {
        const pieChartCtx = pieChartCanvas.getContext("2d");
        new Chart(pieChartCtx, {
          type: "pie",
          data: {
            labels: salesPerCategory.map((c) => c.name),
            datasets: [
              {
                label: "Sales by Category",
                data: salesPerCategory.map((c) => c.sold),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${context.label}: ${context.raw} units sold`,
                },
              },
            },
          },
        });
      }
    } else {
      console.warn("Sales per Category chart canvas or container not found");
    }

    // Chart 3: User Growth Over Time (Line Chart)
    const userRolesCanvas = document.getElementById("userRolesChart");
    const userRolesContainer = userRolesCanvas?.parentElement;
    if (userRolesContainer && userRolesCanvas) {
      const users = UserManager.getAllUsers(); // Define users here
      // Define months for the X-axis
      const months = [
        "Jan 2025",
        "Feb 2025",
        "Mar 2025",
        "Apr 2025",
        "May 2025",
        "Jun 2025",
        "Jul 2025",
        "Aug 2025",
        "Sep 2025",
        "Oct 2025",
        "Nov 2025",
        "Dec 2025",
      ];
      // Aggregate users by role and month (excluding admins)
      const userGrowth = {
        customer: months.map(
          (month, index) =>
            users.filter(
              (u) =>
                u.role === "customer" &&
                new Date(u.createdAt).getMonth() === index &&
                new Date(u.createdAt).getFullYear() === 2025
            ).length
        ),
        seller: months.map(
          (month, index) =>
            users.filter(
              (u) =>
                u.role === "seller" &&
                new Date(u.createdAt).getMonth() === index &&
                new Date(u.createdAt).getFullYear() === 2025
            ).length
        ),
      };
      const userGrowthData = [userGrowth.customer, userGrowth.seller];

      // Check if there's any data to display
      if (
        userGrowthData.every((dataset) => dataset.every((count) => count === 0))
      ) {
        userRolesContainer.innerHTML = `
          <div class="text-center text-muted">
            <p>No user growth data available yet.</p>
          </div>
        `;
      } else {
        const lineChartCtx = userRolesCanvas.getContext("2d");
        new Chart(lineChartCtx, {
          type: "line",
          data: {
            labels: months,
            datasets: [
              {
                label: "Customers",
                data: userGrowth.customer,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
                tension: 0.4,
              },
              {
                label: "Sellers",
                data: userGrowth.seller,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Number of New Users" },
              },
              x: {
                title: { display: true, text: "Month" },
              },
            },
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${context.dataset.label}: ${context.raw} new users`,
                },
              },
            },
          },
        });
      }
    } else {
      console.warn("User Growth chart canvas or container not found");
    }

    // Chart 4: Ratings Distribution (Polar Area Chart)
    const ratingsRanges = {
      "0-2": reviews.filter((r) => r.rating >= 0 && r.rating < 2).length,
      "2-3": reviews.filter((r) => r.rating >= 2 && r.rating < 3).length,
      "3-4": reviews.filter((r) => r.rating >= 3 && r.rating < 4).length,
      "4-5": reviews.filter((r) => r.rating >= 4 && r.rating <= 5).length,
    };
    const ratingsData = [
      ratingsRanges["0-2"],
      ratingsRanges["2-3"],
      ratingsRanges["3-4"],
      ratingsRanges["4-5"],
    ];
    const ratingsCanvas = document.getElementById("ratingsDistributionChart");
    const ratingsContainer = ratingsCanvas?.parentElement;
    if (ratingsContainer && ratingsCanvas) {
      if (ratingsData.every((count) => count === 0)) {
        ratingsContainer.innerHTML = `
          <div class="text-center text-muted">
            <p>No ratings data available yet.</p>
          </div>
        `;
      } else {
        const polarChartCtx = ratingsCanvas.getContext("2d");
        new Chart(polarChartCtx, {
          type: "polarArea",
          data: {
            labels: ["0-2 Stars", "2-3 Stars", "3-4 Stars", "4-5 Stars"],
            datasets: [
              {
                label: "Ratings Distribution",
                data: ratingsData,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              r: { beginAtZero: true },
            },
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${context.label}: ${context.raw} reviews`,
                },
              },
            },
          },
        });
      }
    } else {
      console.warn("Ratings Distribution chart canvas or container not found");
    }
  }

  // Initial render
  renderDashboard();
});

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  const navLinks = document.querySelectorAll(".sidebar .nav-link");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (currentPath.includes(linkPath) && linkPath !== "#") {
      link.classList.add("active");
    } else if (currentPath === "/" && linkPath.includes("index.html")) {
      link.classList.add("active");
    }
  });
});
