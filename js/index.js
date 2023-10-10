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
  return productos;
}

const searchInput = document.getElementById("searchInput");

function showProducts() {
  fetchProducts().then((productos) => {
    // cuando el usuario busca en el filtrado de busqueda
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();

      const filteredProducts = productos.productos.filter((producto) => {
        // filtra los productos en nombre y descripcion segun lo que busca el usuario
        return (
          producto.nombre.toLowerCase().includes(searchTerm) ||
          producto.descripcion.toLowerCase().includes(searchTerm)
        );
      });

      // muestra los productos filter
      renderProducts(filteredProducts);
    });

    // muestra todos los productos al cargar la pagina, funcion que esta abajo reemplazada 
    renderProducts(productos.productos);
  });
}

function renderProducts(productList) {
  const productosContainer = document.getElementById("productos");
  productosContainer.innerHTML = "";

  productList.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("col-sm-12", "col-md-6", "col-lg-4", "col-xl-4", "mb-3");
    card.innerHTML = `
      <div class="card shadow border-card">
        <div class="card-body">
          <h5 class="card-title text-card-margin">${producto.nombre}</h5>
          <p class="card-text card-description">
            ${producto.descripcion}
          </p>
          <p class="card-text">Stock: <span class="stock-q">${producto.cantidad_en_stock}</span></p>
          <button class="btn btn-info" onclick="addToCart('${producto.identificacion}')">Agregar al carrito</button>
        </div>
      </div>
    `;

    card.querySelector(".btn-info").addEventListener("click", () => {
      const stockElement = card.querySelector(".stock-q");
      const currentStock = parseInt(stockElement.textContent);
      if (currentStock > 0) {
        stockElement.textContent = currentStock - 1;

        // Actualiza el stock en el objeto del producto
        producto.cantidad_en_stock = currentStock - 1;
      }
    });

    productosContainer.appendChild(card);
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
    const toastBootstrap = new bootstrap.Toast(toastLiveExample);
    toastBootstrap.show();
  });
}

document.addEventListener("DOMContentLoaded", showProducts);