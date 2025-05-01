import { ProductManager } from './productManager.js';
import { OrderManager } from './orderManager.js';
import { ReviewManager } from './reviewManager.js';
import { AuthManager } from './authManager.js';


const currentSeller = AuthManager.getCurrentSeller();

document.addEventListener('DOMContentLoaded', () => {
    if (!AuthManager.isSellerLoggedIn()) {
        window.location.href = '/login.html';
    }
    loadSellerData();
});

async function loadSellerData() {
    // جلب بيانات البائع
    const products = ProductManager.getProductsBySeller(currentSeller.id);
    const orders = OrderManager.getOrdersBySeller(currentSeller.id);
    const reviews = ReviewManager.getReviewsBySeller(currentSeller.id);
    
    // تحديث واجهة المستخدم
    updateSummaryCards(products, orders, reviews);
    initializeCharts(products, orders, reviews);
}

function updateSummaryCards(products, orders, reviews) {
    document.getElementById('sellerTotalProducts').textContent = products.length;
    document.getElementById('sellerMonthlySales').textContent = 
        calculateMonthlySales(orders).toFixed(2);
    document.getElementById('sellerPendingOrders').textContent = 
        orders.filter(o => o.status === 'pending').length;
    document.getElementById('sellerTotalReviews').textContent = reviews.length;
}

function initializeCharts(products, orders, reviews) {
    // تنفيذ الرسوم البيانية هنا

}


























// if (localStorage.getItem('sellerData')) {
//     sellerData = JSON.parse(localStorage.getItem('sellerData'));
// }
//        // Sample Data Storage (Replace with actual data source)
//         let sellerData = {
//             products: [],
//             orders: [
//                 { id: 1, date: '2023-08-01', status: 'Delivered', total: 149.99 },
//                 { id: 2, date: '2023-08-02', status: 'Processing', total: 89.99 }
//             ]
//         };

//         // Initialize Dashboard
//         document.addEventListener('DOMContentLoaded', () => {
//             loadProducts();
//             loadOrders();
//             updateStats();
//         });

//         // Product Management Functions
//         function toggleProductForm() {
//             const form = document.getElementById('productForm');
//             form.style.display = form.style.display === 'none' ? 'block' : 'none';
//         }

//         function addProduct() {
//             const name = document.getElementById('productName').value;
//             const price = parseFloat(document.getElementById('productPrice').value);

//             if (name && price) {
//                 const newProduct = {
//                     id: sellerData.products.length + 1,
//                     name: name,
//                     price: price,
//                     status: 'Active'
//                 };

//                 sellerData.products.push(newProduct);
//                 loadProducts();
//                 updateStats();
//                 clearForm();
//             }
//         }

//         function loadProducts() {
//             const container = document.getElementById('productsList');
//             container.innerHTML = sellerData.products.map(product => `
//                 <div class="product-item">
//                     <h4>${product.name}</h4>
//                     <p>Price: $${product.price.toFixed(2)}</p>
//                     <button onclick="editProduct(${product.id})">Edit</button>
//                 </div>
//             `).join('');
//         }

//         // Order Management Functions
//         function loadOrders() {
//             const tbody = document.getElementById('ordersBody');
//             tbody.innerHTML = sellerData.orders.map(order => `
//                 <tr>
//                     <td>#${order.id}</td>
//                     <td>${order.date}</td>
//                     <td>${order.status}</td>
//                     <td>$${order.total.toFixed(2)}</td>
//                 </tr>
//             `).join('');
//         }

//         // Statistics Functions
//         function updateStats() {
//             document.getElementById('active-products').textContent = 
//                 sellerData.products.length;
            
//             const totalSales = sellerData.orders.reduce((sum, order) => sum + order.total, 0);
//             document.getElementById('total-sales').textContent = `
//                 $${totalSales.toFixed(2)}`;
//         }

//         function clearForm() {
//             document.getElementById('productName').value = '';
//             document.getElementById('productPrice').value = '';
//             toggleProductForm();
//         }

//         // Edit Product (Sample Implementation)
//         function editProduct(productId) {
//             const product = sellerData.products.find(p => p.id === productId);
//             if (product) {
//                 document.getElementById('productName').value = product.name;
//                 document.getElementById('productPrice').value = product.price;
//                 toggleProductForm();
//             }
//         }