import loader from "./components/loaders.js";
import showMenu from "./components/showMenu.js";
import showCart from "./components/showCart.js";
import products from "./components/products.js";
import getProducts from "./helpers/getProducts.js";
import cart from "./components/cart.js";

/*UI Elemnts */
/*Ocultar loader */
loader();

/*ocultar menu */
showMenu();

/*mostrar carrito */
showCart();

/*products */

const { db, printProducts } = products(await getProducts());

/*carrito */
cart(db, printProducts);
