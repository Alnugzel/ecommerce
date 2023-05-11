const url = "https://ecommercebackend.fundamentos-29.repl.co/";

function loading() {
  const loadHTML = document.getElementById("loading");
  loadHTML &&
    setTimeout(() => {
      loadHTML.style.display = "none";
    }, 2000);
}

window.addEventListener("load", function () {
  loading();
});

function headerScroll() {
  const headerHTML = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 1) {
      headerHTML.classList.add("header_scroll");
    } else {
      headerHTML.classList.remove("header_scroll");
    }
  });
}

function mobileNavbar() {
  const navbarMenuHTML = document.querySelector("#navbarMenu")
    const handleIconNavbarHTML = document.querySelector(".handleIconNavbar");
  function classContains() {
    navbarMenuHTML.classList.contains("navbar_menu_show")
      ? (navbarMenuHTML.classList.remove("navbar_menu_show"),
        handleIconNavbarHTML.classList.remove("bx-x"),
        handleIconNavbarHTML.classList.add("bxs-dashboard"))
      : (navbarMenuHTML.classList.add("navbar_menu_show"),
        handleIconNavbarHTML.classList.add("bx-x"),
        handleIconNavbarHTML.classList.remove("bxs-dashboard"));
  }
  handleIconNavbarHTML.addEventListener("click", function() {
    classContains();
  }),
    navbarMenuHTML.addEventListener("click", function() {
      classContains();
    });
}

function navActive() {
  const linkHomeHTML = document.querySelector(".home_link")
  const linkProductsHTML = document.querySelector(".products_link")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      linkHomeHTML.classList.remove("link_active");
      linkProductsHTML.classList.add("link_active");
    } else {
      linkHomeHTML.classList.add("link_active");
      linkProductsHTML.classList.remove("link_active");
    }
  } )

}



function modifyLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function themeMode() {
  const iconThemeModeHTML = document.querySelector("#iconThemeMode");

  iconThemeModeHTML.addEventListener("click", function changeTheme () {
    if (window.document.body.classList.contains("dark_mode")) {
      window.document.body.classList.remove("dark_mode");
      iconThemeModeHTML.classList.remove("bx-sun");
      window.localStorage.removeItem("saveTheme");
    } else {
      window.document.body.classList.add("dark_mode");
      iconThemeModeHTML.classList.add("bx-sun");
      window.localStorage.setItem("saveTheme", "dark_mode");
    }
  });

        window.localStorage.getItem("saveTheme") ? 
        (window.document.body.classList.add("dark_mode"),
        iconThemeModeHTML.classList.add("bx-sun")) : "";

}

async function getData() {
  try {
    const data = await fetch(url);
    const res = await data.json();
    window.localStorage.setItem("products", JSON.stringify(res));

    modifyLocalStorage("products", res);

    return res;
  } catch (error) {
    console.log(error);
  }
}

function printProducts(req) {
  let html = "";

  req.products;

  req.products.forEach(({ image, name, price, quantity, id, category }) => {
    html += `
    <div class="product ${category}">
      <div class="product_img">
        <img src="${image}" alt="${name}" />
      </div>
      <div class="product_body">
      <div class="price_quantity">
      <h3>
      <b>$${price}.00</b>
      </h3>
      <p class="${quantity ? '' : "sold_out"}">
      <b> <span class="${quantity ? '' : "stock_disable"}">Stock:</span> ${quantity ?  quantity : "sold out" }</b>
      </p>
      </div>
        <h4>${name}</h4>
        ${
          quantity ? `<i class='bx bx-plus' id=${id}></i>`:"<div></div>"
        }
        
      </div>
    </div>
  `;
  });

  document.querySelector(".products").innerHTML = html;
}

function printProductsCart(req) {
  let html = "";

  Object.values(req.cart).forEach((item) => {
    html += `
    <div class="cartItem">
    <div class=cartItem_img>
    <img src="${item.image}" alt="${item.name}" />
     </div>
      <div class=".cartItem_body">
      <h4>${item.name}</h4>
      <p class="quantity_price_cart"><span>Stock: ${item.quantity}</span> | $${item.price}.00</p>
      <p>Subtotal: $${item.price * item.amount}.00</p>

        <div class="cartItem_options" data-id="${item.id}">
        <i class= 'bx bx-minus'></i>
        <span>${item.amount} units</span>
        <i class= 'bx bx-plus'></i>
          <i class= 'bx bx-trash'></i>
        </div>
      
      </div>   
      
    </div>
    `;
  });
  document.querySelector(".cart_products").innerHTML = html;
}

function handleShowCart() {
  const iconCartHTML = document.querySelector("#iconCart");
  const cartHTML = document.querySelector(".cart");
  const xIconHTML = document.querySelector(".bx-x");

  iconCartHTML.addEventListener("click", () => {
    cartHTML.classList.toggle("show_cart");
  });

  xIconHTML.addEventListener("click", () => {
    cartHTML.classList.toggle("show_cart");
  });
}

function addCartFromProducts(req) {
  const productsHTML = document.querySelector(".products");
  productsHTML.addEventListener("click", function (e) {
    if (e.target.closest(".bx-plus")) {
      const productId = Number(e.target.id);

      const productFind = req.products.find(function (product) {
        return product.id === productId;
      });

      if (req.cart[productId]) {
        if (req.cart[productId].amount === req.cart[productId].quantity)
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ya no tenemos disponibilidad!",
          });
        req.cart[productId].amount += 1;
      } else {
        req.cart[productId] = structuredClone(productFind);
        req.cart[productId].amount = 1;
      }

      modifyLocalStorage("cart", req.cart);
      printProductsCart(req);
      printTotal(req);
    }
  });
}

function printTotal(req) {
  const cartTotalInfoHTML = document.querySelector(".cart_total_info");
  const totalAmountProductsHTML = document.querySelector(".total_amount_products");

  let amountProducts = 0;
  let priceTotal = 0;

  Object.values(req.cart).forEach((item) =>{
    amountProducts += item.amount;
    priceTotal += item.amount * item.price;
  });

  let html = `
  <p><b>${amountProducts} items:</b></p>
  <p><b>$${priceTotal}.00</b></p>
  `;

  cartTotalInfoHTML.innerHTML = html;
  totalAmountProductsHTML.textContent = amountProducts;
}

function handleCartProducts (req) {
  const cartproductsHTML = document.querySelector(".cart_products");
  cartproductsHTML.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-minus")) {
      const productId = Number(e.target.parentElement.dataset.id);

      
      if (req.cart[productId].amount === 1) {
        const response = confirm("¿Deseas eliminar este producto?");
        if(!response) return;
        delete req.cart[productId];
      } else {
        req.cart[productId].amount -= 1;
      }
    }
    if (e.target.classList.contains("bx-plus")) {
      const productId = Number(e.target.parentElement.dataset.id);

      if (req.cart[productId].amount === req.cart[productId].quantity)
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ya no tenemos disponibilidad!",
        });

      req.cart[productId].amount += 1;
    }

    if (e.target.classList.contains("bx-trash")) {
      const productId = Number(e.target.parentElement.dataset.id);
      console.log(productId);
      const response = confirm("¿Deseas eliminar este producto?");
        if(!response) return;
      delete req.cart[productId];
    }

    printProductsCart(req);
    modifyLocalStorage("cart", req.cart);
    printTotal(req);
  });
}

function cartBuy (req) {
  document.querySelector(".btn_buy").addEventListener("click", function() {
    if(!Object.values(req.cart).length) return alert("El carrito esta vacio");

    const newProducts = [];

    for (const product of req.products) {
      const productCart = req.cart[product.id];
      
      if(product.id === productCart?.id) {
        newProducts.push({
          ...product,
          quantity: product.quantity - productCart.amount,
        });
      } else {
        newProducts.push(product)
      }
    }
    req.products = newProducts;
    req.cart = {};
    confirm("seguro que quieres hacer la compra?")
    modifyLocalStorage("products", req.products);
    modifyLocalStorage("cart", req.cart);

    printProducts(req);
    printProductsCart(req);
    printTotal(req);

    location.reload();
  });
}



function filterActive() {
  const classFilterHTML = document.querySelectorAll(".content_filter .filter");
  classFilterHTML.forEach((e) => {
    e.addEventListener("click", function (params) {
      classFilterHTML.forEach((search) => search.classList.remove("filter_active")),
      params.currentTarget.classList.add("filter_active");
    });
  });
};





async function initialize() {
  const req = {
    products: JSON.parse(localStorage.getItem("products")) || (await getData()),
    cart: JSON.parse(localStorage.getItem("cart")) || {},
  };
  headerScroll();
  mobileNavbar();
  navActive();
  filterActive();
  printProducts(req);
  handleShowCart();
  printProductsCart(req);
  addCartFromProducts(req);
  printTotal(req);
  themeMode();
  handleCartProducts(req);
  cartBuy(req);
  

  mixitup(".products", {
    selectors: { target: ".product" },
    animation: { duration: 300 },
  }).filter("all");

  
}

initialize();
