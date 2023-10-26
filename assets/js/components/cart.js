/**
 * Esta fundion resive los datos de productos y los productos a renderizar
 * @param {Array<String>} db la data de productos
 * @param {Callback} printProducts funcion para renderizar productos
 */
function cart(db, printProducts) {
  if (!db) throw new Error("no esta db");
  if (!printProducts) throw new Error("el callback no a sido llamado");

  let cart = [];
  // console.log(db)

  //elemntos del DOM
  const productsDOM = document.querySelector(".products__container");
  const notifyDOM = document.querySelector(".notify");
  const cartDOM = document.querySelector(".cart__body");
  const countDOM = document.querySelector(".cart__count--item");
  const totalDOM = document.querySelector(".cart__total--item");
  const checkoutDOM = document.querySelector(".btn--buy");
  const modal = document.getElementById("myModal");
  const closeModal = document.querySelector(".close");
  const localStorage = window.localStorage;
  const themeButton = document.getElementById("theme");
  const icon = themeButton.firstElementChild;
  const theme = localStorage.getItem("theme");
  const storeCart = localStorage.getItem("cart");

  if (storeCart) {
    cart = JSON.parse(storeCart);
  }
  function printCart() {
    let htmlCart = "";

    if (cart.length === 0) {
      htmlCart += `
      <div class="cart__empty">
      <i class='bx bxs-cart'></i>
      <p class="cart__empty--text">No Hay productos en el carrito</p>
      </div>
      `;
      notifyDOM.classList.remove("show--notify");
    } else {
      for (const item of cart) {
        const product = db.find((p) => p.id === item.id);
        htmlCart += `
        <article class="article">
        <div class="article__image">
        <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="article__content">
        <h3 class="article__title">${product.name}</h3>
        <span class="article__price">$${product.price}</span>
                <div class="article__quantity">
                  <button type="button" class="article__quantity-btn article--minus" data-id="${item.id}">
                    <i class='bx bx-minus'></i>
                  </button>
                   <span class="article__quantity-text">${item.qty}</span>
                   <button type="button" class="article__quantity-btn article--plus" data-id="${item.id}">
                    <i class='bx bx-plus'></i>
                  </button>
                </div>
                <button type="button" class="article__btn remove-from-cart" data-id="${item.id}">
                  <i class='bx bx-trash'></i>
                </button>
            </div>
          </article>
             `;
      }
      notifyDOM.classList.add("show--notify");
    }

    function saveStore() {
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    saveStore();
    cartDOM.innerHTML = htmlCart;
    notifyDOM.innerHTML = showItemsCount();
    countDOM.innerHTML = showItemsCount();
    totalDOM.innerHTML = showTotal();
  }

  function addToCart(id, qty = 1) {
    const itemFinded = cart.find((i) => i.id === id);

    if (itemFinded) {
      itemFinded.qty += qty;
    } else {
      cart.push({ id, qty });
    }

    printCart();
  }

  function removeFromCart(id, qty = 1) {
    const itemFinded = cart.find((i) => i.id === id);

    const result = itemFinded.qty - qty;
    if (result > 0) {
      itemFinded.qty -= qty;
    } else {
      cart = cart.filter((i) => i.id !== id);
    }
    printCart();
  }

  function deteleFromCart(id) {
    cart = cart.filter((i) => i.id !== id);

    printCart();
  }

  function showItemsCount() {
    let suma = 0;
    for (const item of cart) {
      suma += item.qty;
    }

    return suma;
  }

  function showTotal() {
    let total = 0;
    for (const item of cart) {
      const productFinded = db.find((p) => p.id === item.id);

      total += item.qty * productFinded.price;
    }

    return total;
  }

  // function checkout() {
  //   for (const item of cart) {
  //     const productFinded = db.find((p) => p.id === item.id);
  //     let stockStatick;
  //     for (const item of db) {
  //       stockStatick = item.quantity;
  //     }

  //     if (productFinded.quantity) {
  //       productFinded.quantity -= item.qty;
  //     }

  //     if (productFinded.quantity <= 0) {
  //       productFinded.quantity = stockStatick;
  //       console.log(`no hay mas prendas solo ${productFinded.quantity}`);
  //     } else {
  //       window.alert("gracias por su compra");
  //       cart = [];
  //     }
  //   }

  //   printCart();
  //   printProducts();
  // }

  function checkout() {
    for (const item of cart) {
      const productFinded = db.find((p) => p.id === item.id);

      if (productFinded) {
        if (productFinded.quantity >= item.qty) {
          // Verificar si hay suficiente stock
          productFinded.quantity -= item.qty;
        } else {
          console.log(
            `No se puede comprar. Stock insuficiente para ${productFinded.name}.`
          );
          return; // Salir de la función si no hay suficiente stock
        }
      }
    }

    // Si llegamos a este punto, significa que la compra se ha realizado con éxito
    window.alert("Gracias por su compra");
    cart = [];
    printCart();
    printProducts();
  }

  function darks() {
    if (theme === "dark") {
      document.body.classList.add("dark");
      icon.classList.remove("bxs-moon");
      icon.classList.add("bxs-sun");
    } else {
      document.body.classList.remove("dark");
      icon.classList.remove("bxs-sun");
      icon.classList.add("bxs-moon");
    }
  }

  darks();

  printCart();

  //eventos
  productsDOM.addEventListener("click", function (event) {
    if (event.target.closest(".add--to--cart")) {
      const id = +event.target.closest(".add--to--cart").dataset.id;
      addToCart(id);
    }
  });

  cartDOM.addEventListener("click", function (event) {
    if (event.target.closest(".article--minus")) {
      const id = +event.target.closest(".article--minus").dataset.id;
      removeFromCart(id);
    }

    if (event.target.closest(".article--plus")) {
      const id = +event.target.closest(".article--plus").dataset.id;
      addToCart(id);
    }

    if (event.target.closest(".remove-from-cart")) {
      const id = +event.target.closest(".remove-from-cart").dataset.id;
      deteleFromCart(id);
    }
  });

  checkoutDOM.addEventListener("click", function () {
    checkout();
  });

  // dark mode
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      icon.classList.remove("bxs-moon");
      icon.classList.add("bxs-sun");
    } else {
      localStorage.removeItem("theme");
      icon.classList.remove("bxs-sun");
      icon.classList.add("bxs-moon");
    }
  });
}

export default cart;

//TODO: terminal modal sectiones y favicon
