# NebulaMart Web App

## Overview

NebulaMart is a **responsive e-commerce web application** built using **HTML, Tailwind CSS, and JavaScript**. It simulates a simple online store with the following features:

- **Product Listing**: Fetches products from an API (`dummyjson.com`) or local storage and displays them dynamically.
- **Shopping Cart**: Users can add products, apply coupons, calculate totals including delivery charges, and confirm or cancel orders.
- **Dark Mode Toggle**: Users can switch between light and dark modes, with preference stored in `localStorage`.
- **Balance Management**: A virtual balance system where users can add funds and purchase items.
- **Customer Reviews**: Fetches reviews from the API and displays them in a slider.
- **Contact Form**: Captures user information and stores it locally in the browser.
- **Responsive Slider**: Smooth sliding animation for featured products.

---

## Tech Stack

- **HTML5**
- **Tailwind CSS v4**
- **JavaScript (ES6+)**
- **LocalStorage** for storing products, balance, form data, and theme preference
- **API Integration** with [DummyJSON](https://dummyjson.com)

---

## Project Structure

nebula-mart/
│
├─ index.html # Main HTML page
├─ src/
│ ├─ app.js # JavaScript logic
│ ├─ input.css # Tailwind input file (for CLI build)
│ └─ output.css # Compiled Tailwind CSS
├─ assets/
│ ├─ mainlogo.png # Logo image
│ └─ profile.png # Default review avatar
└─ README.md # Project documentation
