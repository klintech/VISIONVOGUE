// Sample product data
const products = [
    {
      id: 1,
      name: "Classic Round",
      category: "medicated",
      style: "round",
      color: "black",
      price: 99.99,
      image: "images/Classic Round.jpg",
    },
    {
      id: 2,
      name: "Trendy Square",
      category: "fashion",
      style: "square",
      color: "brown",
      price: 129.99,
      image: "images/Trendy Square.jpg",
    },
    {
      id: 3,
      name: "Elegant Cat Eye",
      category: "fashion",
      style: "cat-eye",
      color: "black",
      price: 149.99,
      image: "images/Elegant Cat Eye.jpg",
    },
    {
      id: 4,
      name: "Modern Aviator",
      category: "sunglasses",
      style: "aviator",
      color: "gold",
      price: 119.99,
      image: "images/Modern Aviator.jpg",
    },
    {
      id: 5,
      name: "Kids Fun Frames",
      category: "kids",
      style: "round",
      color: "blue",
      price: 79.99,
      image: "images/Kids Fun Frames.jpg",
    },
    {
      id: 6,
      name: "Sporty Wraparound",
      category: "sunglasses",
      style: "wraparound",
      color: "red",
      price: 159.99,
      image: "images/Sporty Wraparound.jpg",
    },
    {
      id: 7,
      name: "Retro Wayfarer",
      category: "fashion",
      style: "wayfarer",
      color: "black",
      price: 109.99,
      image: "images/Retro Wayfarer.jpg",
    },
    {
      id: 8,
      name: "Rimless Elegance",
      category: "medicated",
      style: "rimless",
      color: "silver",
      price: 189.99,
      image: "images/Rimless Elegance.jpg",
    },
    {
      id: 9,
      name: "Oversized Glamour",
      category: "fashion",
      style: "oversized",
      color: "tortoise",
      price: 139.99,
      image: "images/Oversized Glamou.jpg",
    },
    {
      id: 10,
      name: "Kids Flexible",
      category: "kids",
      style: "rectangle",
      color: "green",
      price: 89.99,
      image: "images/Kids Flexible.png",
    },
  ]
  
  // Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || []
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0)
  }
}

function updateWishlistCount() {
  const wishlistCount = document.getElementById("wishlist-count")
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length
  }
}

function setupThemeSwitcher() {
  const lightThemeButton = document.getElementById("light-theme")
  const darkThemeButton = document.getElementById("dark-theme")

  if (lightThemeButton && darkThemeButton) {
    lightThemeButton.addEventListener("click", () => {
      document.body.classList.remove("dark-theme")
      localStorage.setItem("theme", "light")
    })

    darkThemeButton.addEventListener("click", () => {
      document.body.classList.add("dark-theme")
      localStorage.setItem("theme", "dark")
    })

    // Check for saved theme preference or use default light theme
    const savedTheme = localStorage.getItem("theme") || "light"
    document.body.classList.toggle("dark-theme", savedTheme === "dark")
  }
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showNotification("Product added to cart!")
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  displayCart()
}

function addToWishlist(productId) {
  const product = products.find((p) => p.id === productId)
  if (!wishlist.some((item) => item.id === productId)) {
    wishlist.push(product)
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
    updateWishlistCount()
    showNotification("Product added to wishlist!")
  } else {
    showNotification("Product is already in your wishlist!")
  }
}

function removeFromWishlist(productId) {
  wishlist = wishlist.filter((item) => item.id !== productId)
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  updateWishlistCount()
  displayWishlist()
}

// Product listing functionality
function displayProducts(productList = products) {
  const productGrid = document.getElementById("product-list")
  if (!productGrid) return

  productGrid.innerHTML = ""
  productList.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <button onclick="addToWishlist(${product.id})">Add to Wishlist</button>
        <a href="product-detail.html?id=${product.id}">View Details</a>
      </div>
    `
    productGrid.appendChild(productCard)
  })
}

// Filter functionality
let filteredProducts = [...products]

function setupFilters() {
  const categoryFilter = document.getElementById("category-filter")
  const styleFilter = document.getElementById("style-filter")
  const colorFilter = document.getElementById("color-filter")
  const priceRange = document.getElementById("price-range")
  const priceDisplay = document.getElementById("price-display")

  if (!categoryFilter || !styleFilter || !colorFilter || !priceRange || !priceDisplay) return

  function applyFilters() {
    const category = categoryFilter.value
    const style = styleFilter.value
    const color = colorFilter.value
    const maxPrice = Number.parseInt(priceRange.value)

    filteredProducts = products.filter(
      (product) =>
        (!category || product.category === category) &&
        (!style || product.style === style) &&
        (!color || product.color === color) &&
        product.price <= maxPrice,
    )

    displayProducts(filteredProducts)
  }

  categoryFilter.addEventListener("change", applyFilters)
  styleFilter.addEventListener("change", applyFilters)
  colorFilter.addEventListener("change", applyFilters)
  priceRange.addEventListener("input", () => {
    priceDisplay.textContent = priceRange.value
    applyFilters()
  })

  applyFilters()
}

// Product detail functionality
function displayProductDetail() {
  const productInfo = document.getElementById("product-info")
  const productDescription = document.getElementById("product-description")
  const productReviews = document.getElementById("product-reviews")
  if (!productInfo || !productDescription || !productReviews) return

  const urlParams = new URLSearchParams(window.location.search)
  const productId = Number.parseInt(urlParams.get("id"))
  const product = products.find((p) => p.id === productId)

  if (product) {
    productInfo.innerHTML = `
            <h1>${product.name}</h1>
            <img src="${product.image}" alt="${product.name}">
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>Category: ${product.category}</p>
            <p>Style: ${product.style}</p>
            <p>Color: ${product.color}</p>
        `

    productDescription.innerHTML = `
            <h2>Product Description</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        `

    productReviews.innerHTML = `
            <h2>Customer Reviews</h2><h2>Customer Reviews</h2>
            <div class="review">
                <div class="stars" data-rating="5"></div>
                <p>"These glasses are amazing! Perfect fit and great quality."</p>
                <span>- Alex T.</span>
            </div>
            <div class="review">
                <div class="stars" data-rating="4"></div>
                <p>"Very stylish and comfortable. Highly recommend!"</p>
                <span>- Jamie L.</span>
            </div>
        `

    const addToCartButton = document.getElementById("add-to-cart")
    const addToWishlistButton = document.getElementById("add-to-wishlist")

    if (addToCartButton) {
      addToCartButton.onclick = () => addToCart(product.id)
    }

    if (addToWishlistButton) {
      addToWishlistButton.onclick = () => addToWishlist(product.id)
    }
  } else {
    productInfo.innerHTML = "<p>Product not found</p>"
  }
}

// Cart page functionality
function displayCart() {
  const cartItems = document.getElementById("cart-items")
  const cartEmpty = document.getElementById("cart-empty")
  const cartSummary = document.getElementById("cart-summary")
  const totalAmount = document.getElementById("total-amount")
  if (!cartItems || !cartEmpty || !cartSummary || !totalAmount) return

  if (cart.length === 0) {
    cartItems.innerHTML = ""
    cartEmpty.classList.remove("hidden")
    cartSummary.classList.add("hidden")
    return
  }

  cartEmpty.classList.add("hidden")
  cartSummary.classList.remove("hidden")
  cartItems.innerHTML = ""
  let total = 0

  cart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="50">
      <div>
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `
    cartItems.appendChild(cartItem)
    total += item.price * item.quantity
  })

  totalAmount.textContent = total.toFixed(2)
}

// Wishlist functionality
function displayWishlist() {
  const wishlistItems = document.getElementById("wishlist-items")
  if (!wishlistItems) return

  wishlistItems.innerHTML = ""

  wishlist.forEach((item) => {
    const wishlistItem = document.createElement("div")
    wishlistItem.className = "wishlist-item"
    wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="50">
            <div>
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
            </div>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
            <button onclick="removeFromWishlist(${item.id})">Remove</button>
        `
    wishlistItems.appendChild(wishlistItem)
  })
}

// Notification functionality
function showNotification(message) {
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.classList.add("show")
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 2000)
  }, 100)
}

// Initialize page-specific functionality
function initPage() {
  updateCartCount()
  updateWishlistCount()

  const path = window.location.pathname

  if (path.includes("index.html") || path === "/") {
    setupFeaturedProducts()
    setup3DViewer()
    setupSizeGuide()
    setupReviews()
    setupNewsletter()
  } else if (path.includes("products.html")) {
    displayProducts()
    setupFilters()
  } else if (path.includes("product-detail.html")) {
    displayProductDetail()
  } else if (path.includes("cart.html")) {
    displayCart()
  }

  setupThemeSwitcher()
  setupVirtualTryOn()
}

// Run initialization when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initPage)

// Additional functions (implement these based on your needs)
function setupFeaturedProducts() {
  const featuredProductsContainer = document.getElementById("featured-products-container")
  if (featuredProductsContainer) {
    const featuredProducts = products.slice(0, 4) // Display first 4 products
    featuredProducts.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>$${product.price.toFixed(2)}</p>
          <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
          <a href="product-detail.html?id=${product.id}">View Details</a>
        </div>
      `
      featuredProductsContainer.appendChild(productCard)
    })
  }
}

function setup3DViewer() {
  // Implement 3D viewer functionality
}

function setupSizeGuide() {
  // Implement size guide functionality
}

function setupReviews() {
  const reviewSlider = document.getElementById("review-slider")
  const prevReviewButton = document.getElementById("prev-review")
  const nextReviewButton = document.getElementById("next-review")

  if (reviewSlider && prevReviewButton && nextReviewButton) {
    const reviews = [
      {
        rating: 5,
        text: "Absolutely love my new glasses! The quality is outstanding.",
        author: "Sarah M.",
      },
      {
        rating: 4,
        text: "Great selection and excellent customer service.",
        author: "John D.",
      },
      {
        rating: 5,
        text: "The virtual try-on feature is a game-changer!",
        author: "Emily R.",
      },
    ]

    let currentReviewIndex = 0

    function showReview(index) {
      const review = reviews[index]
      reviewSlider.innerHTML = `
        <div class="review active">
          <div class="stars" data-rating="${review.rating}"></div>
          <p>"${review.text}"</p>
          <span>- ${review.author}</span>
        </div>
      `
    }

    function showNextReview() {
      currentReviewIndex = (currentReviewIndex + 1) % reviews.length
      showReview(currentReviewIndex)
    }

    function showPrevReview() {
      currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length
      showReview(currentReviewIndex)
    }

    showReview(currentReviewIndex)
    setInterval(showNextReview, 7000)

    nextReviewButton.addEventListener("click", showNextReview)
    prevReviewButton.addEventListener("click", showPrevReview)
  }
}

function setupNewsletter() {
  const newsletterForm = document.getElementById("newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = e.target.querySelector('input[type="email"]').value
      // Here you would typically send the email to your server
      console.log(`Subscribed email: ${email}`)
      showNotification("Thank you for subscribing to our newsletter!")
      e.target.reset()
    })
  }
}

function setupThemeSwitcher() {
  // Implement theme switching functionality
}

function setupVirtualTryOn() {
  // Implement virtual try-on functionality
}

