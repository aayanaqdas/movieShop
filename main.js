const apiKey = "37d7e055234a0531d45416a1d56745eb";
const imgApi = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const form = document.getElementById("search-form");
const query = document.querySelector(".search-input");
const result = document.getElementById("result");

let page = 1;
let isSearching = false;

// Fetch JSON data from url
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

// Fetch and show results based on url
async function fetchAndShowResult(url) {
  const data = await fetchData(url);
  if (data && data.results) {
    showResults(data.results);
  }
}

// Create movie card html template
function createMovieCard(movie) {
  const { poster_path, original_title, release_date, overview, id } = movie;
  const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";
  const truncatedTitle =
    original_title.length > 15
      ? original_title.slice(0, 15) + "..."
      : original_title;
  const formattedDate =
    release_date.length > 4
      ? release_date.slice(0, 4)
      : release_date || "No release date";
  const year = formattedDate.slice(0, 4);
  const price = year >= 2023 ? "100" : year > 2000 ? "50" : "25";
  const escapedOverview = overview.replace(/['"]/g, "&apos;");
  const description =
    escapedOverview.length > 136
      ? escapedOverview.slice(0, 136) + "..."
      : escapedOverview;

  const cardTemplate = `

  <div class="card" data-id="${id}">
  <div class="card-media">
    <img
      src="${imagePath}"
      alt="${original_title}"
      width="100%"
    />
  </div>

  <div class="card-content">
    <div class="card-header">
      <div class="headerContent-wrapper">
        <div class="title-wrapper">
          <h3 class="movieTitle">${truncatedTitle}</h3>
          <div class="right-content">
            <span class="yearText">${year}</span>
              <a href="movieInfo.html" class="moreInfoBtn">More Info</a>
            </div>
          </div>
      </div>
    </div>
    <div class="price">
      Price: ${price + "Kr"}
      <button
        id="buy-btn"
        onclick="createCartItem(\`${imagePath}\`, \`${original_title}\`, \`${description}\`, \`${price}\`, \`${id}\`)"
      >
        Buy
      </button>
    </div>
  </div>
</div>
      
  `;

  return cardTemplate;
}



// Clear result element for search
function clearResults() {
  result.innerHTML = "";
}

// Show results in page
function showResults(item) {
  const newContent = item.map(createMovieCard).join("");
  result.innerHTML += newContent || "<p>No results found.</p>";
}

// Load more results
async function loadMoreResults() {
  if (isSearching) {
    return;
  }
  page++;
  const searchTerm = query.value;
  const url = searchTerm
    ? `${searchUrl}${searchTerm}&page=${page}`
    : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
  await fetchAndShowResult(url);
}

// Detect end of page and load more results
function detectEnd() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    loadMoreResults();
  }
}

// Handle search
async function handleSearch(e) {
  e.preventDefault();
  const searchTerm = query.value.trim();
  if (searchTerm) {
    isSearching = true;
    clearResults();
    const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
    await fetchAndShowResult(newUrl);
    query.value = "";
  }
}

// Event listeners
form.addEventListener("submit", handleSearch);
window.addEventListener("scroll", detectEnd);
window.addEventListener("resize", detectEnd);

// Initialize the page
async function init() {
  clearResults();
  const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
  isSearching = false;
  await fetchAndShowResult(url);
}

init();

//Cart functions
const cartIconEl = document.getElementById("cart-icon");
const closeIconEl = document.getElementById("close-icon");
const shoppingCartEl = document.getElementById("shopping-cart");
const cartEmptyText = document.getElementById("cart-empty-text");

let cartItemsArray = [];

const cartItemsEl = document.getElementById("cart-items");
const cartBottomSection = document.getElementById("cart-bottom-section");
const totalPriceEl = document.getElementById("cart-total-price");
const cartTitle = document.querySelector(".cart-title");
let cartItemsCount = 0;
const cartIconLabelEL = document.getElementById("count-label");
function openCart() {
  shoppingCartEl.style.width = "100%";
  document.body.style.overflow = "hidden";
  calculatePrice();
  checkCartIsEmpty();  
}
function closeCart() {
  shoppingCartEl.style.width = "0%";
  setTimeout(() => {
    document.body.style.overflow = "visible";
  }, 500);
  calculatePrice();
}

shoppingCartEl.addEventListener("transitionend", () => {
  calculatePrice();
});

function checkCartIsEmpty() {
  if (cartItemsEl.innerHTML === "") {
    cartEmptyText.innerHTML = "No items in cart";
    cartBottomSection.style.display = "none";
    document.querySelector("hr").style.display = "none";

  } else if (cartItemsEl.innerHTML !== "") {
    cartBottomSection.style.display = "block";
    cartEmptyText.innerHTML = "";
    document.querySelector("hr").style.display = "block";
  }
}
function createCartItem(image, title, description, price, id) {
  // Checking if an item with the same id is in the cart
  const existingItem = getCartItems().find((item) => item.dataset.id === id);
  if (existingItem) {
    alert(`${title} is already in the cart`);
  } else {
    // If an item with the same ID doesn't exist, add it to the cart
    const cartItemTemplate = `
  <div class="item" data-id= "${id}">
  <div class="item-content">
    <div class="item-img-text-wrapper">
      <img
        class="item-img"
        src="${image}"
        alt="${title}"
      />
      <div class="item-text-wrapper">
        <div class="title-removeBtn">
          <h4>${title}</h4>
          <i id="remove-item-btn" class="fa-solid fa-minus" onclick="removeCartItem('${id}')"></i>
        </div>

        <p class="item-description">${description}</p>
        <div class="item-price">${price},-</div>
      </div>
    </div>
  </div>
</div>
  `;

    addToCart(cartItemTemplate);
    calculatePrice();
  }
}
function addToCart(item) {
  cartItemsEl.innerHTML += item;
  cartItemsArray.push(item);
  cartItemsCount = cartItemsArray.length;
  cartTitle.innerHTML = `Your cart (${cartItemsCount} items)`;
  updateCartLabel();
  calculatePrice();
  checkCartIsEmpty();
}

function getCartItems() {
  const cartItems = Array.from(document.querySelectorAll(".item"));
  calculatePrice();
  return cartItems;
}

function removeCartItem(itemId) {
  const updatedCartItems = getCartItems().filter(
    (item) => String(item.dataset.id) !== String(itemId)
  );
  cartItemsArray.pop(updatedCartItems);
  cartItemsCount = cartItemsArray.length;
  cartTitle.innerHTML = `Your cart (${cartItemsCount} items)`;


  renderCartItems(updatedCartItems);
  updateCartLabel();  
  checkCartIsEmpty();   
  calculatePrice();
}

function renderCartItems(cartItems) { 
  cartItemsEl.innerHTML = "";
  cartItems.forEach((item) => {
    cartItemsEl.innerHTML += item.outerHTML;
  });
  calculatePrice();
  checkCartIsEmpty();
  updateCartLabel();
}

function calculatePrice() {
  const cartItems = document.querySelectorAll(".item");
  let totalPrice = 0;
  cartItems.forEach((item) => {
    const priceString = item.querySelector(".item-price").innerText;
    const priceNumber = Number(priceString.replace(/\D/g, ""));
    totalPrice += priceNumber;
    totalPriceEl.innerText = `${totalPrice},-`;
  });
}

function updateCartLabel(){
  if (cartItemsCount > 0) {
    cartIconLabelEL.style.display = "inline-block";
    cartIconLabelEL.innerHTML = cartItemsCount;
  }
  else{
    cartIconLabelEL.style.display = "none";
  }
}



// Function to clear the cart
function clearCart() {
  cartItemsArray.length = 0;
  cartItemsEl.innerHTML = "";
  cartItemsCount = 0;
  cartTitle.innerHTML = `Your cart (${cartItemsCount} items)`;
  totalPriceEl.innerText = `0,-`;
  checkCartIsEmpty();
  updateCartLabel();
}

//checkout button animation
const container = document.querySelector(".checkout_container");
container.addEventListener("click", () => {
  container.classList.add("active");
  // Remove the class after a short delay to allow the animation to complete
  setTimeout(() => {
    container.classList.remove("active");
    clearCart();
  }, 2500);
});

