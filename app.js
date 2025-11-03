
let cart = {};
let disCount = 0;
let balance = parseInt(localStorage.getItem("balance")) || 1000;

const cartBtn = document.getElementById("cartBtn");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const balanceTag = document.getElementById("tk");
const totalTag = document.getElementById("total");
const subtotalTag = document.getElementById("price");
const deliveryTag = document.getElementById("delivery");
const cartItems = document.getElementById("cartItems");
const themeBtn = document.getElementById("theme");
const bodyEl = document.documentElement;

balanceTag.textContent = balance.toFixed(2);


let isDark = localStorage.getItem("darkMode") === "true";
setTheme(isDark);

themeBtn.addEventListener("click", () => {
  isDark = !isDark;
  setTheme(isDark);
  localStorage.setItem("darkMode", isDark);
});

function setTheme(dark) {
  if (dark) {
    bodyEl.classList.add("dark");
    themeBtn.textContent = "Light Mode";
  } else {
    bodyEl.classList.remove("dark");
    themeBtn.textContent = "Dark Mode";
  }
}


const fetching = () => {
  const storage = localStorage.getItem("lcproducts");
  if (storage) {
    showAll(JSON.parse(storage));
  } else {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("lcproducts", JSON.stringify(data.products));
        showAll(data.products);
      });
  }
};


const showAll = (products) => {
  const div = document.getElementById("products");
  div.innerHTML = "";

  products.forEach((product) => {
    const cd = document.createElement("div");
    cd.className =
      "bg-white dark:bg-gray-800 rounded-lg shadow-md duration-300 hover:scale-105 hover:shadow-lg flex flex-col px-4 py-4";

    cd.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}" class="w-full h-40 object-contain mb-2"/>
      <p class="text-gray-700 dark:text-white   font-bold mb-2">$${product.price}</p>
      <h2 class="font-semibold text-lg mb-1 dark:text--white">${product.title}</h2>
      <p class="text-gray-500 dark:text-gray-300 text-sm mb-2">${product.description}</p>
      <p class="text-sm font-bold mb-2 dark:text--white">In Stock: ${product.stock}</p>
      <button class="addToCart bg-green-500 text-white px-2 py-2 mb-5 rounded hover:bg-black w-32">${product.stock <= 0 ? "Out of Stock" : "Add to Cart"}</button>
    `;

    div.appendChild(cd);

    cd.querySelector(".addToCart").addEventListener("click", () => {
      if (product.stock > 0) {
        addToCart(product);
        cartToggle.classList.remove("hidden");
      }
    });
  });
};


function addToCart(product) {
  const subtotal = calculateTotal();
  const delivery = deliveryCharge(subtotal);
  const totalCost = subtotal + delivery + product.price;

  if (balance < totalCost) {
    alert("Not enough balance!");
    return;
  }

  if (cart[product.id]) cart[product.id].cnt++;
  else cart[product.id] = { product, cnt: 1 };

  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let subtotal = calculateTotal();

  Object.values(cart).forEach(({ product, cnt }) => {
    const totalItem = product.price * cnt;
    const div = document.createElement("div");
    div.className = "flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded";
    div.innerHTML = `
          <img src="${product.images[0]}" class="w-10 h-10 object-contain"/>
          <span class="text-sm text-black dark:text-gray-200">${product.title} (${cnt}x)</span>
          <span class="text-sm text-black font-bold dark:text-gray-200">$${totalItem}</span>
          <button class="removeItem text-red-500 text-lg">&times;</button>
        `;
    div.querySelector(".removeItem").addEventListener("click", () => removeFromCart(product.id));
    cartItems.appendChild(div);
  });

  const delivery = deliveryCharge(subtotal);
  let total = subtotal + delivery;
  if (disCount > 0) total = total - total * disCount;

  subtotalTag.textContent = subtotal.toFixed(2);
  deliveryTag.textContent = delivery.toFixed(2);
  totalTag.textContent = total.toFixed(2);
}

function calculateTotal() {
  return Object.values(cart).reduce((sum, { product, cnt }) => sum + product.price * cnt, 0);
}

function deliveryCharge(subtotal) {
  if (subtotal < 1000) return 0;
  return parseInt(subtotal / 1000) * 100;
}

function removeFromCart(id) {
  if (cart[id]) {
    cart[id].cnt--;
    if (cart[id].cnt === 0) delete cart[id];
    updateCart();
  }
}


document.getElementById("applycpn").addEventListener("click", () => {
  const binary = "1010101111001101";
  const hex = parseInt(binary, 2).toString(16);
  const hexx = hex[0] + hex[1].toUpperCase() + hex[2].toUpperCase() + hex[3];

  const cpnn = document.getElementById("cpn").value.trim();

  if (cpnn === hexx) {
    disCount = 0.1;
    document.getElementById("msg").textContent = "Congratulations! 10% off applied";
  } else {
    disCount = 0;
    document.getElementById("msg").textContent = "Invalid Coupon";
  }

  document.getElementById("cpn").value = "";
  updateCart();
});

document.getElementById("final").addEventListener("click", () => {
  const subtotal = calculateTotal();
  const delivery = deliveryCharge(subtotal);
  let totalCost = subtotal + delivery;

  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (balance < totalCost) {
    alert("Not enough balance!");
    return;
  }

  balance -= totalCost;
  balanceTag.textContent = balance.toFixed(2);
  localStorage.setItem("balance", balance.toFixed(2));

  let allproducts = JSON.parse(localStorage.getItem("lcproducts")) || [];
  allproducts = allproducts.map(p => {
    if (cart[p.id]) p.stock -= cart[p.id].cnt;
    if (p.stock < 0) p.stock = 0;
    return p;
  });
  localStorage.setItem("lcproducts", JSON.stringify(allproducts));

  cart = {};
  updateCart();
  showAll(allproducts);

  alert("Thank you for shopping!");
  cartToggle.classList.add("hidden");
});


document.getElementById("addBtn").addEventListener("click", () => {
  balance += 1000;
  balanceTag.textContent = balance.toFixed(2);
  localStorage.setItem("balance", balance.toFixed(2));
});


cartToggle.classList.add("hidden");
cartBtn.addEventListener("click", () => cartToggle.classList.toggle("hidden"));
closeCart.addEventListener("click", () => cartToggle.classList.add("hidden"));

//Nasif
document.getElementById("sndBtn").addEventListener("click", () => {
 
  const name = document.getElementById("nam").value;
  const phone = document.getElementById("phon").value;
  const email = document.getElementById("emai").value;
  const message = document.getElementById("messag").value;
  if (!name || !phone || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  

  const fData = JSON.parse(localStorage.getItem("formData")) || [];
  fData.push({ name, phone, email, message });
  localStorage.setItem("formData", JSON.stringify(fData));

  document.querySelector("form").reset();
  alert(`${name}, your message is submitted successfully.`);
});

const reviewsFetch = () => {
  fetch("https://dummyjson.com/comments")
    .then(res => res.json())
    .then(data => showReview(data.comments));
};

function showReview(comments) {
  const reviewTag = document.getElementById("reviewSlider");
  reviewTag.innerHTML = "";
  comments.forEach(el => {
    const allow = [7, 10, 12, 14, 24];
    if (allow.includes(el.id)) {
      const div = document.createElement("div");
      const rat = Math.min(5, Math.round(el.likes));
      let rr = "";
      for (let i = 0; i < 5; i++) rr += i < rat ? "★" : "☆";

      div.className = "w-1/3 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg flex flex-col p-4 items-center";
      div.innerHTML = `
                <div class="flex flex-col items-center gap-2">
                    <div class="flex items-center gap-2">
                        <img src="assets/profile.png" class="w-10 rounded-full"/>
                        <p class="font-bold">${el.user.fullName}</p>
                    </div>
                    <p class="text-center text-lg italic">"${el.body}"</p>
                    <p class="text-yellow-400 text-xl mt-2">${rr}</p>
                </div>
            `;
      reviewTag.appendChild(div);
    }
  });
}

fetching();
reviewsFetch();
