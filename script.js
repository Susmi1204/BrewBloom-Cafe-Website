// ==========================================
// BREWBLOOM AUTHENTICATION + WEBSITE
// ==========================================


// ==========================================
// SIGN UP
// ==========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("signupMessage");


        // Check password

        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match!";

            message.style.color = "red";

            return;
        }


        // Check password length

        if (password.length < 6) {

            message.textContent =
                "Password must contain at least 6 characters.";

            message.style.color = "red";

            return;
        }


        // Create user

        const user = {
            name: name,
            email: email,
            password: password
        };


        // Save user

        localStorage.setItem(
            "brewUser",
            JSON.stringify(user)
        );


        message.textContent =
            "Account created successfully! Please login.";

        message.style.color = "green";


        // Go to login page

        setTimeout(function() {

            window.location.href = "login.html";

        }, 1000);

    });

}



// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");


        // Get saved user

        const savedUser =
            JSON.parse(
                localStorage.getItem("brewUser")
            );


        // No account

        if (!savedUser) {

            message.textContent =
                "Account not found. Please Sign Up first.";

            message.style.color = "red";

            return;
        }


        // Check email and password

        if (
            email === savedUser.email &&
            password === savedUser.password
        ) {

            // Login successful

            localStorage.setItem(
                "brewLoggedIn",
                "true"
            );


            message.textContent =
                "Login successful! Welcome to BrewBloom.";

            message.style.color = "green";


            // ONLY AFTER LOGIN GO TO HOME

            setTimeout(function() {

                window.location.href = "index.html";

            }, 1000);

        }

        else {

            message.textContent =
                "Invalid email or password.";

            message.style.color = "red";

        }

    });

}



// ==========================================
// HOME PAGE PROTECTION
// ==========================================

// Check whether current page is index.html

const currentPage =
    window.location.pathname.split("/").pop();


// If user opens index.html

if (
    currentPage === "index.html" ||
    currentPage === ""
) {

    const loggedIn =
        localStorage.getItem("brewLoggedIn");


    // If NOT logged in

    if (loggedIn !== "true") {

        // Send user to login

        window.location.replace("login.html");

    }

}



// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", function() {


        // Remove login status

        localStorage.removeItem(
            "brewLoggedIn"
        );


        // Go back to login

        window.location.replace(
            "login.html"
        );

    });

}



// ==========================================
// SEARCH
// ==========================================

const searchInput =
    document.getElementById("searchInput");

const menuCards =
    document.querySelectorAll(".menu-card");


if (searchInput) {

    searchInput.addEventListener("input", function() {

        const searchValue =
            searchInput.value.toLowerCase();


        menuCards.forEach(function(card) {

            const name =
                card.dataset.name.toLowerCase();


            if (name.includes(searchValue)) {

                card.style.display = "block";

            }

            else {

                card.style.display = "none";

            }

        });

    });

}



// ==========================================
// CATEGORY FILTER
// ==========================================

const categoryFilter =
    document.getElementById("categoryFilter");


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        function() {

            const selected =
                categoryFilter.value;


            menuCards.forEach(function(card) {

                const category =
                    card.dataset.category;


                if (
                    selected === "all" ||
                    category === selected
                ) {

                    card.style.display = "block";

                }

                else {

                    card.style.display = "none";

                }

            });

        }
    );

}



// ==========================================
// CART
// ==========================================

let cart =
    JSON.parse(
        localStorage.getItem("brewCart")
    ) || [];


const cartCount =
    document.getElementById("cartCount");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");



// ==========================================
// ADD TO CART
// ==========================================

document
    .querySelectorAll(".add-cart")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const name =
                    button.dataset.name;

                const price =
                    Number(button.dataset.price);


                const existing =
                    cart.find(
                        item =>
                        item.name === name
                    );


                if (existing) {

                    existing.quantity++;

                }

                else {

                    cart.push({

                        name: name,

                        price: price,

                        quantity: 1

                    });

                }


                saveCart();

                updateCart();


                alert(
                    name +
                    " added to cart!"
                );

            }
        );

    });



// ==========================================
// SAVE CART
// ==========================================

function saveCart() {

    localStorage.setItem(
        "brewCart",
        JSON.stringify(cart)
    );

}



// ==========================================
// UPDATE CART
// ==========================================

function updateCart() {

    if (!cartCount) {

        return;

    }


    let count = 0;

    let total = 0;


    cartItems.innerHTML = "";


    cart.forEach(
        function(item, index) {

            count += item.quantity;

            total +=
                item.price *
                item.quantity;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "cart-item";


            div.innerHTML = `

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <br>

                    ₹${item.price}
                    ×
                    ${item.quantity}

                </div>

                <div class="cart-controls">

                    <button
                        onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <button
                        onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>

            `;


            cartItems.appendChild(div);

        }
    );


    cartCount.textContent =
        count;


    cartTotal.textContent =
        total;

}



// ==========================================
// CHANGE CART QUANTITY
// ==========================================

function changeQuantity(index, amount) {

    cart[index].quantity += amount;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();

}



// ==========================================
// OPEN CART
// ==========================================

const cartBtn =
    document.getElementById("cartBtn");

const cartModal =
    document.getElementById("cartModal");

const closeCart =
    document.getElementById("closeCart");


if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        function() {

            cartModal.style.display =
                "flex";

        }
    );

}


if (closeCart) {

    closeCart.addEventListener(
        "click",
        function() {

            cartModal.style.display =
                "none";

        }
    );

}



// ==========================================
// CLOSE CART WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener(
    "click",
    function(event) {

        if (
            event.target === cartModal
        ) {

            cartModal.style.display =
                "none";

        }

    }
);



// ==========================================
// CHECKOUT
// ==========================================

const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );


if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            alert(
                "Thank you for ordering from BrewBloom! ☕"
            );


            cart = [];


            saveCart();

            updateCart();


            cartModal.style.display =
                "none";

        }
    );

}



// ==========================================
// DARK MODE
// ==========================================

const themeBtn =
    document.getElementById(
        "themeBtn"
    );


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        function() {

            document.body.classList.toggle(
                "dark"
            );


            if (
                document.body.classList.contains(
                    "dark"
                )
            ) {

                themeBtn.textContent =
                    "☀️";

            }

            else {

                themeBtn.textContent =
                    "🌙";

            }

        }
    );

}



// ==========================================
// CONTACT FORM
// ==========================================

const contactForm =
    document.getElementById(
        "contactForm"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "contactName"
                ).value;


            const status =
                document.getElementById(
                    "contactStatus"
                );


            status.textContent =
                "Thank you " +
                name +
                "! Your message has been received. ☕";


            contactForm.reset();

        }
    );

}



// ==========================================
// INITIAL CART LOAD
// ==========================================

updateCart();