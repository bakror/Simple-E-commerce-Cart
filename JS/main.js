// ====== Select DOM Elements for UI Toggles ======
let category_nav_list = document.querySelector(".category_nav_list");
let nav_links = document.querySelector(".nav_links");
var cart = document.querySelector(".cart");

// ====== Toggle Category List ======
function Open_Categ_list() {
  category_nav_list.classList.toggle("active");
}

// ====== Toggle Navigation Menu ======
function open_Menu() {
  nav_links.classList.toggle("active");
}

// ====== Toggle Cart Visibility ======
function open_close_cart() {
  cart.classList.toggle("active");
}

// ====== Fetch Products from JSON ======
fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    const addToCartButtons = document.querySelectorAll(".btn_add_cart");

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.getAttribute("data-id");
        const selcetedProduct = data.find((product) => product.id == productId);

        addToCart(selcetedProduct);

        // Update all buttons of the same product
        const allMatchingButtons = document.querySelectorAll(
          `.btn_add_cart[data-id="${productId}"]`
        );

        allMatchingButtons.forEach((btn) => {
          btn.classList.add("active");
          btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in cart`;
        });
      });
    });
  });

// ====== Add Product to Cart ======
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ ...product, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// ====== Update Cart UI ======
function updateCart() {
  const cartItemsContainer = document.getElementById("cart_items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  var total_Price = 0;
  var total_count = 0;

  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    let total_Price_item = item.price * item.quantity;
    total_Price += total_Price_item;
    total_count += item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="item_cart">
          <img src="${item.img}" alt="">
          <div class="content">
              <h4>${item.name}</h4>
              <p class="price_cart">$${total_Price_item}</p>
              <div class="quantity_control">
                  <button class="decrease_quantity" data-index=${index}>-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button class="Increase_quantity" data-index=${index}>+</button>
              </div>
          </div>
          <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;
  });

  // Update cart summary
  document.querySelector(".price_cart_toral").innerHTML = `$ ${total_Price}`;
  document.querySelector(".Count_item_cart").innerHTML = total_count;
  document.querySelector(".count_item_header").innerHTML = total_count;

  // Attach event listeners for quantity buttons
  document.querySelectorAll(".Increase_quantity").forEach((button) =>
    button.addEventListener("click", (event) => {
      const itemIndex = event.target.getAttribute("data-index");
      increaseQuantity(itemIndex);
    })
  );

  document.querySelectorAll(".decrease_quantity").forEach((button) =>
    button.addEventListener("click", (event) => {
      const itemIndex = event.target.getAttribute("data-index");
      decreaseQuantity(itemIndex);
    })
  );

  // Attach event listeners for delete buttons
  document.querySelectorAll(".delete_item").forEach((button) =>
    button.addEventListener("click", (event) => {
      const itemIndex = event.target
        .closest("button")
        .getAttribute("data-index");
      removeFromCart(itemIndex);
    })
  );
}

// ====== Increase Quantity ======
function increaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// ====== Decrease Quantity ======
function decreaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// ====== Remove Product from Cart ======
function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const removedProduct = cart.splice(index, 1)[0];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  updateButtonsState(removedProduct.id);
}

// ====== Reset Button State After Removal ======
function updateButtonsState(productId) {
  const allMatchingButtons = document.querySelectorAll(
    `.btn_add_cart[data-id="${productId}"]`
  );
  allMatchingButtons.forEach((button) => {
    button.classList.remove("active");
    button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> add to cart`;
  });
}

// ====== Initialize Cart on Page Load ======
updateCart();
