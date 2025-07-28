document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.querySelector('.product-grid');
  const cartIcon = document.querySelector('.cart-icon');
  const cartSidebar = document.querySelector('.cart');
  const cartCloseBtn = document.getElementById('cart-close');
  const cartContent = document.querySelector('.cart-content');
  const cartItemCountEl = document.querySelector('.cart-item-count');
  const subtotalEl = document.querySelector('.total-price');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const toastContainer = document.getElementById('toast-container');
  const menuIcon = document.getElementById('menu-icon');
  const navLinks = document.querySelector('.nav-links');
  const contactForm = document.getElementById('contact-form');

  const products = [
    { id: 1, name: 'Artisan Sourdough Bread', category: 'bakery', price: 269.00, image: './images/5.webp' },
    { id: 2, name: 'Wild Caught Salmon Fillet', category: 'meat', price: 2589.00, image: './images/3.webp' },
    { id: 3, name: 'Organic Spinach', category: 'vegetables', price: 159.00, image: './images/9.avif'},
    { id: 4, name: 'Blueberries (Pint)', category: 'fruits', price: 899.00, image: './images/4.jpeg'},
    { id: 5, name: 'Whole Wheat Bread', category: 'bakery', price: 259.00, image: './images/12.jpg' },
    { id: 6, name: 'Chicken Breast (1lb)', category: 'meat', price: 888.00, image: './images/13.webp'},
    { id: 7, name: 'Cheddar Cheese Block', category: 'dairy', price: 999.00, image: './images/16.jpg' },
    { id: 8, name: 'Avocados (Bag of 3)', category: 'fruits', price: 329.00, image: './images/10.jpeg' },
    { id: 9, name: 'Roma Tomatoes', category: 'vegetables', price: 412.00, image: './images/11.jpg'},
    { id: 10, name: 'Ground Beef (1lb)', category: 'meat', price: 1099.00, image: './images/14.webp'},
    { id: 11, name: 'Greek Yogurt (32oz)', category: 'dairy', price: 789.00, image: './images/15.jpeg'},
    { id: 12, name: 'Farm Fresh Eggs (Dozen)', category: 'dairy', price: 459.00, image: './images/6.jpg' },
    { id: 13, name: 'Fresh Strawberries', category: 'fruits', price: 1299.00, image: './images/2.jpg'},
    { id: 14, name: 'Organic Bananas', category: 'fruits', price: 299.00, image: './images/7.jpeg'},
    { id: 15, name: 'Milk', category: 'dairy', price: 899.00, image: './images/17.Webp' }, 
 ];

  let cart = [];

  const displayProducts = (productList) => {
    productGrid.innerHTML = productList.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <div class="product-info">
          <p class="product-category">${product.category}</p>
          <h3 class="product-title">${product.name}</h3>
          <div class="product-footer">
            <span class="product-price">RS ${product.price.toFixed(2)}</span>
            <button class="add-to-cart-btn">Add</button>
          </div>
        </div>
      </div>
    `).join('');
  };

  const updateCart = () => {
    cartContent.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-img">
        <div class="cart-item-detail">
          <span class="cart-item-title">${item.name}</span>
          <span class="cart-item-price">RS ${item.price.toFixed(2)}</span>
          <div class="cart-item-quantity-box">
            <button class="change-quantity" data-change="-1">-</button>
            <span class="cart-item-quantity">${item.quantity}</span>
            <button class="change-quantity" data-change="1">+</button>
          </div>
        </div>
        <i class='bx bx-trash cart-item-remove'></i>
      </div>
    `).join('');
    updateCartInfo();
  };

  const updateCartInfo = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartItemCountEl.textContent = totalItems;
    subtotalEl.textContent = `RS ${subtotal.toFixed(2)}`;
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `<i class='bx bx-check-circle'></i> ${message}`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  cartIcon.addEventListener('click', () => cartSidebar.classList.add('active'));
  cartCloseBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }

      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const category = e.target.dataset.category;
      const filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category);

      displayProducts(filteredProducts);
    });
  });

  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const card = e.target.closest('.product-card');
      const productId = parseInt(card.dataset.id);
      const product = products.find(p => p.id === productId);
      const existingItem = cart.find(item => item.id === productId);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      showToast(`${product.name} added to cart!`);
      updateCart();
    }
  });

  cartContent.addEventListener('click', (e) => {
    const cartItem = e.target.closest('.cart-item');
    if (!cartItem) return;

    const productId = parseInt(cartItem.dataset.id);
    const itemInCart = cart.find(item => item.id === productId);

    if (e.target.classList.contains('cart-item-remove')) {
      cart = cart.filter(item => item.id !== productId);
    }

    if (e.target.classList.contains('change-quantity')) {
      const change = parseInt(e.target.dataset.change);
      if (itemInCart) {
        itemInCart.quantity += change;
        if (itemInCart.quantity <= 0) {
          cart = cart.filter(item => item.id !== productId);
        }
      }
    }

    updateCart();
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Thank you! Your message has been sent.");
    contactForm.reset();
  });

  // NO initial product load
});
