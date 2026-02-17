// ZEBAISH JEWELLERS - COMPLETE JAVASCRIPT

// Data Management
let products = [];
let categories = [
    {id: "necklace", name: "Necklaces", icon: "📿"},
    {id: "earrings", name: "Earrings", icon: "💎"},
    {id: "maangtikka", name: "Maang Tikka", icon: "👑"},
    {id: "set", name: "Bridal Sets", icon: "💍"},
    {id: "bangles", name: "Bangles", icon: "⭕"},
    {id: "ring", name: "Rings", icon: "💍"},
    {id: "bracelet", name: "Bracelets", icon: "📿"}
];
let cart = [];
let currentFilter = 'all';
let editingId = null;
let allProducts = []; // For search functionality

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    restoreCart();
});

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        
        products = data.products || [];
        allProducts = [...products]; // Copy for search
        
        // Save to localStorage for offline use
        localStorage.setItem('zebaishProducts', JSON.stringify(products));
        
        renderProducts();
        renderCategories();
        
        console.log('✅ Data loaded from JSON');
        
    } catch (error) {
        console.log('⚠️ JSON load failed, using localStorage fallback');
        
        // Fallback to localStorage
        const saved = localStorage.getItem('zebaishProducts');
        if (saved) {
            products = JSON.parse(saved);
            allProducts = [...products];
        } else {
            // Use default data
            products = getDefaultProducts();
            allProducts = [...products];
        }
        renderProducts();
    }
}

// Default products if JSON not found
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: "Royal Bridal Necklace Set",
            price: 4500,
            category: "set",
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
            description: "Complete bridal set featuring intricate hand embroidery on rich velvet. Includes statement necklace, matching earrings and elegant headpiece.",
            featured: true,
            stock: 5
        },
        {
            id: 2,
            name: "Classic Red Velvet Bangles",
            price: 1200,
            category: "bangles",
            image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&auto=format&fit=crop&q=80",
            description: "Set of 12 handcrafted bangles with metallic thread embroidery on plush velvet. Perfect for weddings and festive celebrations.",
            featured: false,
            stock: 10
        },
        {
            id: 3,
            name: "Green Velvet Maang Tikka",
            price: 800,
            category: "maangtikka",
            image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop&q=80",
            description: "Elegant maang tikka with pearl drops and detailed hand embroidery on emerald green velvet.",
            featured: true,
            stock: 8
        },
        {
            id: 4,
            name: "Gold Thread Choker Necklace",
            price: 2800,
            category: "necklace",
            image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
            description: "Statement choker featuring floral patterns in traditional style with mirror work accents.",
            featured: false,
            stock: 3
        },
        {
            id: 5,
            name: "Bridal Earrings - Jhumka Style",
            price: 1500,
            category: "earrings",
            image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=600&auto=format&fit=crop&q=80",
            description: "Traditional bell-shaped earrings with metallic thread work and colorful detailing.",
            featured: true,
            stock: 12
        }
    ];
}

// Render categories dynamically
function renderCategories() {
    const container = document.querySelector('.filter-buttons');
    if (!container) return;
    
    container.innerHTML = `
        <button onclick="filterProducts('all')" class="filter-btn active" data-filter="all">All</button>
        ${categories.map(cat => `
            <button onclick="filterProducts('${cat.id}')" class="filter-btn" data-filter="${cat.id}">
                ${cat.name}
            </button>
        `).join('')}
    `;
}

// Render products
function renderProducts(productsToRender = null) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    const displayProducts = productsToRender || 
        (currentFilter === 'all' ? products : products.filter(p => p.category === currentFilter));
    
    if (displayProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #8D6E63;">
                <h3>No products found</h3>
                <p>Check back soon for new arrivals!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = displayProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.featured ? '<span class="badge-featured">Featured</span>' : ''}
                ${product.stock < 5 ? `<span class="badge-low">Only ${product.stock} left</span>` : ''}
                <button onclick="showProductDetails(${product.id})" class="quick-view-btn">Quick View</button>
                <button onclick="addToCart(${product.id})" class="add-cart-btn">+</button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">Rs. ${product.price.toLocaleString()}</p>
                <p class="product-desc">${product.description}</p>
                <div class="product-meta">
                    <span class="category-tag">${getCategoryName(product.category)}</span>
                    <span class="stock-status ${product.stock < 3 ? 'low' : ''}">
                        ${product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Get category name
function getCategoryName(catId) {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : catId;
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    
    if (!searchTerm) {
        renderProducts();
        return;
    }
    
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filtered);
}

// Filter products
function filterProducts(category) {
    currentFilter = category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Clear search when filtering
    const searchInput = document.getElementById('product-search');
    if (searchInput) searchInput.value = '';
    
    renderProducts();
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) {
        showToast('Sorry, this item is out of stock!');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showToast('Maximum stock limit reached!');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showToast('Added to cart!');
    
    // Animate cart button
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!item || !product) return;
    
    const newQty = item.quantity + change;
    
    if (newQty <= 0) {
        removeFromCart(productId);
    } else if (newQty > product.stock) {
        showToast('Maximum stock available: ' + product.stock);
    } else {
        item.quantity = newQty;
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rs. ${item.price.toLocaleString()}</p>
                    <div class="cart-item-actions">
                        <button onclick="updateQuantity(${item.id}, -1)" class="qty-btn">-</button>
                        <span style="color: #5D4037; min-width: 20px; text-align: center; font-weight: 600;">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="qty-btn">+</button>
                        <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    localStorage.setItem('zebaishCart', JSON.stringify(cart));
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');
    
    body.innerHTML = `
        <div class="modal-grid">
            <div class="modal-image-container">
                <img src="${product.image}" alt="${product.name}" class="modal-image">
                ${product.featured ? '<span class="badge-featured" style="position: absolute; top: 20px; left: 20px;">Featured</span>' : ''}
            </div>
            <div class="modal-info">
                <span class="modal-category">${getCategoryName(product.category)}</span>
                <h2>${product.name}</h2>
                <p class="modal-price">Rs. ${product.price.toLocaleString()}</p>
                <p class="modal-desc">${product.description}</p>
                
                <div class="modal-stock">
                    <span class="${product.stock < 5 ? 'low-stock' : 'in-stock'}">
                        ${product.stock > 0 ? `✓ ${product.stock} items in stock` : '✗ Out of stock'}
                    </span>
                </div>
                
                <ul class="modal-features">
                    <li>Handmade with authentic craftsmanship</li>
                    <li>Lightweight and comfortable</li>
                    <li>Perfect for weddings and festivals</li>
                    <li>Comes in premium packaging</li>
                </ul>
                
                <button onclick="addToCart(${product.id}); closeModal();" 
                    class="btn-primary btn-full" 
                    ${product.stock === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function handleSubmit(e) {
    e.preventDefault();
    showToast('Thank you! We will contact you soon.');
    e.target.reset();
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    const total = document.getElementById('cart-total').textContent;
    
    const orderDetails = cart.map(item => 
        `${item.name} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    alert(`ORDER SUMMARY\n\n${orderDetails}\n\nTotal: ${total}\n\nThank you for shopping with Zebaish Jewellers!\n\nNote: This is a demo checkout.`);
    
    cart = [];
    updateCartUI();
    toggleCart();
    localStorage.removeItem('zebaishCart');
}

function restoreCart() {
    const saved = localStorage.getItem('zebaishCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Admin Panel Functions
function toggleAdmin() {
    const panel = document.getElementById('admin-panel');
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
        renderAdminList();
    }
}

function previewImage(input) {
    const preview = document.getElementById('image-preview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('prod-name').value;
    const price = parseInt(document.getElementById('prod-price').value);
    const category = document.getElementById('prod-category').value;
    const stock = parseInt(document.getElementById('prod-stock').value) || 10;
    const description = document.getElementById('prod-desc').value;
    const featured = document.getElementById('prod-featured').checked;
    const imageInput = document.getElementById('prod-image');
    
    let image = "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&auto=format&fit=crop&q=80";
    
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            image = evt.target.result;
            saveProduct(name, price, category, stock, description, featured, image);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else if (editingId) {
        const existing = products.find(p => p.id === editingId);
        if (existing) image = existing.image;
        saveProduct(name, price, category, stock, description, featured, image);
    } else {
        saveProduct(name, price, category, stock, description, featured, image);
    }
}

function saveProduct(name, price, category, stock, description, featured, image) {
    if (editingId) {
        const index = products.findIndex(p => p.id === editingId);
        if (index !== -1) {
            products[index] = { 
                ...products[index], 
                name, price, category, stock, description, featured, image 
            };
        }
        editingId = null;
    } else {
        const newProduct = {
            id: Date.now(),
            name,
            price,
            category,
            stock,
            description,
            featured,
            image
        };
        products.push(newProduct);
    }
    
    allProducts = [...products];
    localStorage.setItem('zebaishProducts', JSON.stringify(products));
    clearForm();
    renderProducts();
    renderAdminList();
    showToast('Product saved successfully!');
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('prod-name').value = product.name;
        document.getElementById('prod-price').value = product.price;
        document.getElementById('prod-category').value = product.category;
        document.getElementById('prod-stock').value = product.stock;
        document.getElementById('prod-desc').value = product.description;
        document.getElementById('prod-featured').checked = product.featured || false;
        
        const preview = document.getElementById('image-preview');
        preview.src = product.image;
        preview.classList.remove('hidden');
        
        editingId = id;
        window.scrollTo(0, 0);
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        allProducts = [...products];
        localStorage.setItem('zebaishProducts', JSON.stringify(products));
        renderProducts();
        renderAdminList();
        showToast('Product deleted!');
    }
}

function clearForm() {
    document.getElementById('product-form').reset();
    document.getElementById('image-preview').classList.add('hidden');
    editingId = null;
}

function renderAdminList() {
    const list = document.getElementById('admin-products-list');
    const count = document.getElementById('product-count');
    
    if (!list || !count) return;
    
    count.textContent = products.length;
    
    // Get search term
    const searchTerm = document.getElementById('admin-search')?.value.toLowerCase() || '';
    let displayProducts = products;
    
    if (searchTerm) {
        displayProducts = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    if (displayProducts.length === 0) {
        list.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #6D4C41; padding: 40px;">No products found</p>';
        return;
    }
    
    list.innerHTML = displayProducts.map(p => `
        <div class="admin-product-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="admin-product-info">
                <h4>${p.name}</h4>
                <p>Rs. ${p.price.toLocaleString()}</p>
                <span style="color: #8D6E63; font-size: 0.85rem; text-transform: capitalize;">
                    ${p.category} | Stock: ${p.stock}
                </span>
                ${p.featured ? '<span style="color: #D4A574; font-size: 0.8rem; display: block; margin-top: 5px;">⭐ Featured</span>' : ''}
                <div class="admin-product-actions">
                    <button onclick="editProduct(${p.id})" class="edit-btn">Edit</button>
                    <button onclick="deleteProduct(${p.id})" class="delete-btn">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function searchAdminProducts() {
    renderAdminList();
}

// Close modal on outside click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        document.getElementById('cart-sidebar').classList.remove('open');
        document.getElementById('admin-panel').classList.remove('active');
    }
});