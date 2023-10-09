async function fetchProducts() {
  let productos = [];
  try {
    const response = await fetch("data/data.json");
    if (!response.ok) {
      throw new Error(response.status);
    }
    productos = await response.json();
  } catch (error) {
    console.log(error);
  }
  console.log(productos);
  return productos;
}
function showProducts() {
  fetchProducts().then((productos) => {
    productos.productos.forEach((producto) => {
      document.getElementById(
        "productos"
      ).innerHTML += `<div class="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-3">
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">
                ${producto.descripcion}
              </p>
              <button class="btn btn-info" onclick="addToCart('${producto.identificacion}')"> Agregar al carrito </button>
            </div>
          </div>
        </div>`;
    });
  });
}

function addToCart(id) {
  let cart = [];
  let producto;
  fetchProducts().then((productos) => {
    producto = productos.productos.find((producto) => {
      return producto.identificacion == id;
    });
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.push(producto);
    localStorage.setItem("cart", JSON.stringify(cart));

    const toastLiveExample = document.getElementById("liveToast");
    const toastBootstrap =
      bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  });
}

document.addEventListener("DOMContentLoaded", showProducts);
