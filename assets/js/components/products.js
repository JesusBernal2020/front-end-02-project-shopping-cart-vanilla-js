/**
 *Esta funcion resive una promesa donde viene la data
 * @param {Promise<String>} products va esperar la data : (await nameFuncion())
 * @returns {Array<String>} retorna la data de productos
 */
function products(products) {
  if (!products) throw new Error("No hay productos");

  const db = [...products];

  function printProducts() {
    const productsDOM = document.querySelector(".products__container");
    let htmlProduct = "";

    for (const product of db) {
      htmlProduct += `
          <article class="product">
            <div class="product__image">
              <div class="card-content">
                <div class="card-text">
                  <h3 class="title-card">Descripcion</h3>
                  <p class="text-card">${product.description}</p>
                </div>
              </div>
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product__content">
              <button type="button" class="product__btn add--to--cart" data-id="${product.id}">
                <i class='bx bxs-cart-add'></i>
              </button>
              <span class="product__price">$${product.price}</span>
              <span class="product__stock">Disponible ${product.quantity}</span>
              <h3 class="product__title">${product.name}</h3>
            </div>
          </article>
            `;
    }
    productsDOM.innerHTML = htmlProduct;
  }

  printProducts();

  return {
    db,
    printProducts,
  };
}

export default products;
