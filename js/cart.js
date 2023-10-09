function cargarCarrito() {
  let productos = JSON.parse(localStorage.getItem("cart"));
  productos.forEach((producto) => {
    document.getElementById("productos").innerHTML += `<tr id="prod">
            <td>${producto.nombre}</td>
            <td id="precio">
              ${Intl.NumberFormat("en-US").format(
                producto.costo_en_pesos.toFixed(2)
              )}
            </td>
            <td><input id="cantidad" class="form-control" type="number" value="1"></input></td>
            <td id="subtotal">
              ${Intl.NumberFormat("en-US").format(
                producto.costo_en_pesos.toFixed(2)
              )}
            </td>
            <td>
              <button id="del" class="btn btn-danger">
                <i class="fa fa-solid fa-trash"></i>
              </button>
            </td>
            <td id="id" class="d-none" hidden>${producto.identificacion}</td> 
          </tr>`;
  });
  document.querySelectorAll("#prod").forEach((prod) => {
    prod.querySelector("#cantidad").addEventListener("change", (e) => {
      let cantidad = e.target.value;
      if (cantidad < 1) {
        cantidad = 1;
        e.target.value = 1;
      }
      let subtotal = prod.querySelector("#subtotal");
      let precio = prod.querySelector("#precio");
      subtotal.textContent = Intl.NumberFormat("en-US").format(
        (precio.textContent * cantidad).toFixed(2)
      );
    });
    prod.querySelector("#del").addEventListener("click", () => {
      prod.remove();
      let productos = JSON.parse(localStorage.getItem("cart"));
      productos = productos.filter((producto) => {
        return producto.identificacion != prod.querySelector("#id").textContent;
      });
      localStorage.setItem("cart", JSON.stringify(productos));
    });
  });
}
document.addEventListener("DOMContentLoaded", cargarCarrito());
