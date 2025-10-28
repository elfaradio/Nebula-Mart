let cart = {};
let balance = parseInt(localStorage.getItem("balance")) || 1000;

const balanceTag = document.getElementById("tk");
const totalTag = document.getElementById("total");
const subtotalTag = document.getElementById("subtotal");
const deliveryTag = document.getElementById("delivery");
const cartItems = document.getElementById("cartItems");

balanceTag.textContent = balance;

// Fetch products or use localStorage
const fetching = () => {
    const storage = localStorage.getItem("lcproducts");
    if (storage) {
        showAll(JSON.parse(storage));
    } else {
        fetch("https://dummyjson.com/products")
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("lcproducts", JSON.stringify(data.products));
                showAll(data.products);
            });
    }
};

// Show products
const showAll = (products) => {
    const div = document.getElementById("products");
    products.forEach(product => {
        const cd = document.createElement("div");
        cd.className = "bg-white rounded-lg shadow-md px-4 py-4 flex flex-col";

        cd.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}" class="w-full h-40 object-contain mb-2"/>
      <p class="text-gray-700 font-bold mb-2">$${product.price}</p>
      <h2 class="font-semibold text-lg mb-1">${product.title}</h2>
      <p class="text-gray-500 text-sm mb-2">${product.description}</p>
      <p class="text-sm font-bold mb-2">In Stock: ${product.stock}</p>
      <button class="addToCart bg-green-500 text-white px-2 py-2 mb-5 rounded hover:bg-black w-32">Add to Cart</button>
    `;

        div.appendChild(cd);

        cd.querySelector(".addToCart").addEventListener("click", () => {
            addToCart(product);
        });
    });
};

// Add to cart
function addToCart(product) {
    const subtotal = calculateSubtotal();
    const delivery = getDeliveryCharge(subtotal);
    const totalCost = subtotal + delivery + product.price;

    if (balance < totalCost) {
        alert("Apnar taka nai");
        return;
    }

    if (cart[product.id]) {
        cart[product.id].cnt++;
    } else {
        cart[product.id] = { product, cnt: 1 };
    }

    updateCart();
}

// Update cart UI
function updateCart() {
    cartItems.innerHTML = "";
    let subtotal = 0;

    Object.values(cart).forEach(({ product, cnt }) => {
        const totalItem = product.price * cnt;
        subtotal += totalItem;

        const div = document.createElement("div");
        div.className = "flex items-center justify-between bg-gray-100 p-2 rounded";
        div.innerHTML = `
      <img src="${product.images[0]}" class="w-10 h-10 object-contain"/>
      <span class="text-sm">${product.title} (${cnt}x)</span>
      <span class="text-sm font-bold">$${totalItem}</span>
      <button class="removeItem text-red-500 text-lg">&times;</button>
    `;

        div.querySelector(".removeItem").addEventListener("click", () => {
            removeFromCart(product.id);
        });

        cartItems.appendChild(div);
    });

    const delivery = getDeliveryCharge(subtotal);
    const total = subtotal + delivery;

    subtotalTag.textContent = subtotal;
    deliveryTag.textContent = delivery;
    totalTag.textContent = total;
}

// Remove item
function removeFromCart(id) {
    if (cart[id]) {
        delete cart[id];
        updateCart();
    }
}

function calculateTotal() {
    let subtotal = 0;
    Object.values(cart).forEach(({ product, cnt }) => {
        subtotal += product.price * cnt;
    });



    return subtotal;



}



// Delivery = 10% of subtotal
function getDeliveryCharge(subtotal) {
    return subtotal === 0 ? 0 : subtotal / 10;
}

// Checkout
document.getElementById("final").addEventListener("click", () => {
    const subtotal = calculateSubtotal();
    const delivery = getDeliveryCharge(subtotal);
    const totalCost = subtotal + delivery;

    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!");
        return;
    }

    if (balance < totalCost) {
        alert("Apnar taka nai");
        return;
    }

    balance -= totalCost;
    balanceTag.textContent = balance;
    localStorage.setItem("balance", balance);

    cart = {};
    updateCart();

    alert("Thank You for shopping with us!");
});

// Ratings helper
function ratings(rate) {
    if (rate >= 4) return `<h3><i class="fas fa-star"></i> ${rate}</h3>`;
    if (rate >= 3) return `<h3><i class="fas fa-star"></i><i class="fas fa-star"></i> ${rate}</h3>`;
    if (rate >= 2) return `<h3><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> ${rate}</h3>`;
    return `<h3><i class="fas fa-star"></i>${rate}</h3>`;
}

// Add money button
document.getElementById("addBtn").addEventListener("click", () => {
    balance += 1000;
    balanceTag.textContent = balance;
    localStorage.setItem("balance", balance);
});

// Cart toggle
const cartBtn = document.getElementById("cartBtn");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");

cartToggle.style.display = "none";
cartBtn.addEventListener("click", () => cartToggle.style.display = "block");
closeCart.addEventListener("click", () => cartToggle.style.display = "none");

// Initialize
fetching();