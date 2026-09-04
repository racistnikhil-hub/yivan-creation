const cartCount = document.querySelector("#cartCount");
const favCount = document.querySelector("#favCount");
const form = document.querySelector("#ideaForm");
const formMessage = document.querySelector("#formMessage");
const cartButton = document.querySelector("#cartButton");
const wishlistButton = document.querySelector("#wishlistButton");
const drawer = document.querySelector("#shopDrawer");
const drawerTitle = document.querySelector("#drawerTitle");
const drawerEyebrow = document.querySelector("#drawerEyebrow");
const drawerList = document.querySelector("#drawerList");
const drawerTotal = document.querySelector("#drawerTotal");
const drawerTotalValue = document.querySelector("#drawerTotalValue");
const closeDrawer = document.querySelector("#closeDrawer");
const cartTab = document.querySelector("#cartTab");
const wishlistTab = document.querySelector("#wishlistTab");
const productDetail = document.querySelector("#productDetail");
const detailImage = document.querySelector("#detailImage");
const detailCategory = document.querySelector("#detailCategory");
const detailTitle = document.querySelector("#detailTitle");
const detailPrice = document.querySelector("#detailPrice");
const detailStock = document.querySelector("#detailStock");
const detailRating = document.querySelector("#detailRating");
const detailReviewCount = document.querySelector("#detailReviewCount");
const detailDescription = document.querySelector("#detailDescription");
const detailReviews = document.querySelector("#detailReviews");
const detailCartName = document.querySelector("#detailCartName");
const detailCartPrice = document.querySelector("#detailCartPrice");
const detailAddCart = document.querySelector("#detailAddCart");

const cart = new Map();
const wishlist = new Map();
let activeDrawer = "cart";
let activeProduct = null;

const productDetails = {
  "classic-tote-bag": {
    id: "classic-tote-bag",
    name: "Classic Tote Bag",
    price: 199,
    category: "Handmade bag",
    image: "assets/classic-tote-bag.webp",
    imageAlt: "Classic handmade denim tote bag with patchwork handles",
    stock: 12,
    rating: 4.8,
    reviewCount: 18,
    description: "A roomy handmade denim tote with patchwork fabric handles, side pockets and a soft recycled-textile finish for everyday carrying.",
    reviews: [
      {
        author: "Anaya",
        text: "The bag feels sturdy and the patchwork handles make it look special."
      },
      {
        author: "Meera",
        text: "Good size for books, craft items and daily shopping."
      }
    ]
  },
  "bow-keepsake-pouch": {
    id: "bow-keepsake-pouch",
    name: "Bow Keepsake Pouch",
    price: 299,
    category: "Fabric pouch",
    image: "",
    imageAlt: "Bow keepsake pouch illustration",
    stock: 8,
    rating: 4.6,
    reviewCount: 11,
    description: "A tiny fabric pouch for treasures, threads and notes.",
    reviews: [
      { author: "Riya", text: "Sweet and useful for small accessories." },
      { author: "Kavya", text: "The bow detail is very cute." }
    ]
  },
  "yarn-heart-charm": {
    id: "yarn-heart-charm",
    name: "Yarn Heart Charm",
    price: 149,
    category: "Bag charm",
    image: "",
    imageAlt: "Yarn heart charm illustration",
    stock: 20,
    rating: 4.7,
    reviewCount: 14,
    description: "Handmade charm for bags, keys or gift wrapping.",
    reviews: [
      { author: "Isha", text: "Lovely little handmade gift add-on." },
      { author: "Naina", text: "Lightweight and colorful." }
    ]
  },
  "mini-needle-art-kit": {
    id: "mini-needle-art-kit",
    name: "Mini Needle Art Kit",
    price: 349,
    category: "Craft kit",
    image: "",
    imageAlt: "Mini needle art kit illustration",
    stock: 6,
    rating: 4.5,
    reviewCount: 9,
    description: "Pastel thread, needle and fabric scraps for first stitches.",
    reviews: [
      { author: "Tara", text: "Nice starter kit for simple practice stitches." },
      { author: "Diya", text: "The colors are soft and pretty." }
    ]
  }
};

function formatPrice(value) {
  return `₹${value}`;
}

function getProduct(card) {
  const detail = productDetails[card.dataset.id];

  if (detail) {
    return {
      id: detail.id,
      name: detail.name,
      price: detail.price,
    };
  }

  return {
    id: card.dataset.id,
    name: card.dataset.name,
    price: Number(card.dataset.price),
  };
}

function readSavedList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function loadShopState() {
  readSavedList("yivanCart").forEach((item) => cart.set(item.id, item));
  readSavedList("yivanWishlist").forEach((item) => wishlist.set(item.id, item));
}

function saveShopState() {
  localStorage.setItem("yivanCart", JSON.stringify([...cart.values()]));
  localStorage.setItem("yivanWishlist", JSON.stringify([...wishlist.values()]));
}

function updateCounts() {
  const cartQuantity = [...cart.values()].reduce((total, item) => total + item.quantity, 0);

  if (cartCount) cartCount.textContent = cartQuantity;
  if (favCount) favCount.textContent = wishlist.size;
}

function renderDrawer() {
  if (!drawerList) return;

  const isCart = activeDrawer === "cart";
  const items = [...(isCart ? cart : wishlist).values()];
  const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  drawerTitle.textContent = isCart ? "Cart" : "Wishlist";
  drawerEyebrow.textContent = isCart ? "Ready to buy" : "Saved with heart";
  drawerTotal.hidden = !isCart;
  drawerTotalValue.textContent = formatPrice(total);
  cartTab.classList.toggle("is-active", isCart);
  wishlistTab.classList.toggle("is-active", !isCart);

  if (!items.length) {
    drawerList.innerHTML = `<p class="empty-drawer">Your ${isCart ? "cart" : "wishlist"} is empty.</p>`;
    return;
  }

  drawerList.innerHTML = items.map((item) => `
    <article class="drawer-item">
      <div>
        <h3>${item.name}</h3>
        <p>${formatPrice(item.price)}${isCart ? ` × ${item.quantity}` : ""}</p>
      </div>
      <button class="remove-item" type="button" data-id="${item.id}">
        Remove
      </button>
    </article>
  `).join("");
}

function openDrawer(view) {
  activeDrawer = view;
  renderDrawer();
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  closeDrawer.focus();
}

function closeShopDrawer() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

function addProductToCart(product, button) {
  const saved = cart.get(product.id);

  cart.set(product.id, {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: saved ? saved.quantity + 1 : 1,
  });

  saveShopState();
  updateCounts();

  if (drawer.classList.contains("is-open") && activeDrawer === "cart") {
    renderDrawer();
  }

  if (!button) return;

  button.textContent = "Added";
  window.setTimeout(() => {
    button.textContent = "Add to Cart";
  }, 900);
}

function setupProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "classic-tote-bag";
  const product = productDetails[productId] || productDetails["classic-tote-bag"];

  activeProduct = product;
  document.title = `${product.name} | Yivan Creation`;
  detailCategory.textContent = product.category;
  detailTitle.textContent = product.name;
  detailPrice.textContent = formatPrice(product.price);
  detailStock.textContent = product.stock;
  detailRating.textContent = product.rating.toFixed(1);
  detailReviewCount.textContent = product.reviewCount;
  detailDescription.textContent = product.description;
  detailCartName.textContent = product.name;
  detailCartPrice.textContent = formatPrice(product.price);

  if (product.image) {
    detailImage.src = product.image;
    detailImage.alt = product.imageAlt;
    detailImage.hidden = false;
  } else {
    detailImage.hidden = true;
  }

  detailReviews.innerHTML = product.reviews.map((review) => `
    <article class="review-item">
      <strong>${review.author}</strong>
      <p>${review.text}</p>
    </article>
  `).join("");
}

loadShopState();
updateCounts();

document.querySelectorAll(".product-card .add-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const product = getProduct(button.closest(".product-card"));
    addProductToCart(product, button);
  });
});

document.querySelectorAll(".product-card").forEach((card) => {
  const openProduct = () => {
    window.location.href = `product.html?id=${encodeURIComponent(card.dataset.id)}`;
  };

  card.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    openProduct();
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("button")) return;
    event.preventDefault();
    openProduct();
  });
});

document.querySelectorAll(".favorite-button").forEach((button) => {
  const card = button.closest(".product-card");
  const product = getProduct(card);
  const isSaved = wishlist.has(product.id);

  button.textContent = isSaved ? "♥" : "♡";
  button.classList.toggle("is-active", isSaved);
  button.setAttribute("aria-pressed", String(isSaved));

  button.addEventListener("click", () => {
    const isActive = button.classList.toggle("is-active");

    button.textContent = isActive ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(isActive));

    if (isActive) {
      wishlist.set(product.id, product);
    } else {
      wishlist.delete(product.id);
    }

    saveShopState();
    updateCounts();

    if (drawer.classList.contains("is-open") && activeDrawer === "wishlist") {
      renderDrawer();
    }
  });
});

if (cartButton) cartButton.addEventListener("click", () => openDrawer("cart"));
if (wishlistButton) wishlistButton.addEventListener("click", () => openDrawer("wishlist"));
if (cartTab) {
  cartTab.addEventListener("click", () => {
    activeDrawer = "cart";
    renderDrawer();
  });
}
if (wishlistTab) {
  wishlistTab.addEventListener("click", () => {
    activeDrawer = "wishlist";
    renderDrawer();
  });
}
if (closeDrawer) closeDrawer.addEventListener("click", closeShopDrawer);

if (detailAddCart) {
  detailAddCart.addEventListener("click", () => {
    if (!activeProduct) return;
    addProductToCart(activeProduct, detailAddCart);
  });
}

if (drawer) {
  drawer.addEventListener("click", (event) => {
    if (event.target === drawer) {
      closeShopDrawer();
      return;
    }

    const removeButton = event.target.closest(".remove-item");
    if (!removeButton) return;

    const collection = activeDrawer === "cart" ? cart : wishlist;
    collection.delete(removeButton.dataset.id);
    saveShopState();

    if (activeDrawer === "wishlist") {
      const productCard = document.querySelector(`[data-id="${removeButton.dataset.id}"]`);
      const favoriteButton = productCard ? productCard.querySelector(".favorite-button") : null;

      if (favoriteButton) {
        favoriteButton.classList.remove("is-active");
        favoriteButton.textContent = "♡";
        favoriteButton.setAttribute("aria-pressed", "false");
      }
    }

    updateCounts();
    renderDrawer();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
    closeShopDrawer();
  }
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const idea = new FormData(form).get("idea").trim();

    if (!idea) {
      formMessage.textContent = "Please write your idea first.";
      return;
    }

    form.reset();
    formMessage.textContent = "Thank you. Your idea has been sent to Yivan.";
  });
}

if (productDetail) {
  setupProductPage();
}
