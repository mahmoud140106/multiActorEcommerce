import { ProductManager } from "./productManager.js";
import { ReviewManager } from "./reviewManager.js";
import { OrderManager } from "./orderManager.js";
import { StorageManager } from "./storageManager.js";


document.addEventListener("DOMContentLoaded", () => {
    let sellerId;
    let sellerOrders =[];

  // Render dashboard
  function renderDashboard() {
    // Get current seller's ID (assuming it's available from auth context)
     sellerId = StorageManager.load('currentUser')?.id;

    // Summary cards
    const products = ProductManager.getProductsBySeller(sellerId);
    // console.log("Rendering seller dashboard with products:", products);
    const totalProductsEl = document.getElementById("totalProducts");
    if (totalProductsEl) totalProductsEl.textContent = products.length;

    const totalSales = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
    const totalSalesEl = document.getElementById("totalSales");
    if (totalSalesEl) totalSalesEl.textContent = totalSales;

    let totalReviewsEl= document.getElementById('totalReviews');
     const reviews=  ProductManager.getProductsBySeller(sellerId).reduce((sum, p) => sum + ReviewManager.getReviewsByProduct(p.id).length, 0)
     totalReviewsEl.textContent = reviews;

    const allOrders = OrderManager.getOrdersBySeller();
    const pendingOrders = allOrders.filter(order => order.status === "pending");
    pendingOrders.forEach((order)=>
      {
        let productFromStorage
          order.items.forEach((item)=>{
               productFromStorage=products.find(product=>product.id==item.productId)    //filter products from storage to get seller id
  
             if(productFromStorage != undefined){
  
                  if(productFromStorage.sellerId==sellerId ){
                    if(!sellerOrders.includes(order)){
                      sellerOrders.push(order);         //filter all orders to get the seller orders
  
                    }
                    
                }
            }
          })
         
      })
      
    // const sellerPendingOrders = pendingOrders.filter(order=>order)

    document.getElementById("pendingOrders").innerText=sellerOrders.length;
    // Chart 1:Total Products  (Bar Chart)
 

    const barChartCanvas = document.getElementById("TotalProducts");
    if (barChartCanvas) {
      const barChartCtx = barChartCanvas.getContext("2d");
      new Chart(barChartCtx, {
        type: "bar",
        data: {
          labels: products.map((c) => c.name),
          datasets: [
            {
              label: "Products Stock",
              data: products.map((c) => c.stock),
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
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
              title: { display: true, text: "Products Stock" },
            },
            x: {
              title: { display: true, text: "Products Name" },
            },
          },
        },
      });
    } else {
      console.warn("Products chart canvas not found");
    }

    // Chart 2: Total Sales 
    const Sales = products
      .map((product) => ({
        name: product.name,
        sold: products
          .filter((p) => p.id === product.id)
          .reduce((sum, p) => sum + (p.soldCount || 0), 0),
      }))
      .filter((product) => product.sold > 0);

    const pieChartCanvas = document.getElementById("TotalSales");
    const pieChartContainer = pieChartCanvas?.parentElement;
    if (pieChartContainer && pieChartCanvas) {
      if (Sales.length === 0) {
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
            labels: Sales.map((c) => c.name),
            datasets: [
              {
                label: "Total Sales",
                data: Sales.map((c) => c.sold),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
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
      console.warn("Total Sales chart canvas or container not found");
    }

    // Chart 3: Total Reviews (Line Chart)
    const TotalReviewsCanvas = document.getElementById("TotalReviews");
    const TotalReviewsContainer = TotalReviewsCanvas?.parentElement;
    if (TotalReviewsContainer && TotalReviewsCanvas) {
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
      const reviewsPerProduct = products.map((product) => {
        const productReviews = ReviewManager.getReviewsByProduct(product.id);
        return {
          name: product.name,
          count: productReviews.length,
        };
      }).filter(p => p.count > 0); // Remove products with 0 reviews if needed
    
      if (reviewsPerProduct.length === 0) {
        TotalReviewsContainer.innerHTML = `
          <div class="text-center text-muted">
            <p>No reviews data available yet.</p>
          </div>
        `;
      } else {
        const barChartCtx = TotalReviewsCanvas.getContext("2d");
        new Chart(barChartCtx, {
          type: "bar",
          data: {
            labels: reviewsPerProduct.map(p => p.name),
            datasets: [
              {
                label: "Total Reviews",
                data: reviewsPerProduct.map(p => p.count),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Number of Reviews",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Product Name",
                },
              },
            },
            plugins: {
              legend: { display: false },
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
    }
    
    // Chart 4: Pending Orders per Product (Bar Chart)
const pendingOrdersCanvas = document.getElementById("PendingOrders");
const pendingOrdersContainer = pendingOrdersCanvas?.parentElement;

if (pendingOrdersContainer && pendingOrdersCanvas) {
  const allOrders = OrderManager.getOrdersBySeller();
  const pendingOrders = allOrders.filter(order => order.status === "pending");

  const pendingPerProductMap = {};

  pendingOrders.forEach(order => {
    order.items?.forEach(item => {
      if (!pendingPerProductMap[item.productId]) {
        pendingPerProductMap[item.productId] = 0;
      }
      pendingPerProductMap[item.productId] += item.quantity || 1;
    });
  });

  const productLabels = [];
  const productCounts = [];

  for (const productId in pendingPerProductMap) {
    const product = products.find(p => p.id == productId);
    if (product) {
      productLabels.push(product.name);
      productCounts.push(pendingPerProductMap[productId]);
    }
  }

  if (productLabels.length === 0) {
    pendingOrdersContainer.innerHTML = `
      <div class="text-center text-muted">
        <p>No pending orders data available yet.</p>
      </div>
    `;
  } else {
    const pendingOrdersCtx = pendingOrdersCanvas.getContext("2d");
    new Chart(pendingOrdersCtx, {
      type: "bar",
      data: {
        labels: productLabels,
        datasets: [
          {
            label: "Pending Orders",
            data: productCounts,
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Order Quantity" },
          },
          x: {
            title: { display: true, text: "Product Name" },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.label}: ${context.raw} pending units`,
            },
          },
        },
      },
    });
  }
} else {
  console.warn("Pending Orders chart canvas or container not found");
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