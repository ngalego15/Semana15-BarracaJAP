function calcularTotal() {
  let productos = document.querySelectorAll("#productos tr");
  let total = 0;
  
  productos.forEach((producto) => {
    let cantidad = parseInt(producto.querySelector("#cantidad").value);
    let precioUnitario = parseFloat(producto.querySelector("#precio").textContent.replace(/[^0-9.-]+/g,"")); // Eliminar caracteres no numéricos
    let subtotal = cantidad * precioUnitario;
    
    producto.querySelector("#subtotal").textContent = new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(subtotal);
    
    total += subtotal;
  });

  let totalCompra = document.getElementById("totalCompra")
  totalCompra.textContent = new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(total);

  let formaPago = document.querySelector('input[name="formaPago"]:checked').value;
  let mensajeFormaPago = '';

  let precioFinal = total; // Inicializar precioFinal con el total sin descuento o aumento

  switch (formaPago) {
    case 'efectivo':
      mensajeFormaPago = 'Efectivo (10% de descuento)';
      precioFinal = total * 0.9; // aplica descuento del 10% y lo mestra
      break;
    case 'credito':
      mensajeFormaPago = 'Crédito (7% de aumento)';
      precioFinal = total * 1.07; // aplica aumento del 7% y lo muestra
      break;
    case 'debito':
      mensajeFormaPago = 'Débito';
      break;
  }

  document.getElementById("formaPagoSeleccionada").textContent = mensajeFormaPago;
  
  // Mostrar el precio final
  document.getElementById("precioFinal").textContent = new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(precioFinal);

  let mensajeFinal = document.getElementById("mensajeFinal")
    let comprar = document.getElementById("comprar")
    comprar.addEventListener("click", () => {
      if (productos.length > 0){
        mensajeFinal.innerHTML = `<br><br>
        <h3>Compra realizada correctamente</h3>
        <p>Precio final: $${precioFinal}</p>
        <p>Forma de pago: ${formaPago}</p>`
    } else {
        mensajeFinal.innerHTML = `<br><br>
        <h3>No hay productos en su carrito</h3>`
        mensajeFinal.classList.add("text-danger")
    } 
  })
}

function cargarCarrito() {
  let productos = JSON.parse(localStorage.getItem("cart"));
  productos.forEach((producto) => {
    document.getElementById("productos").innerHTML += `<tr id="prod">
            <td>${producto.nombre}</td>
            <td id="precio">
              ${Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(producto.costo_en_pesos)}
            </td>
            <td><input id="cantidad" class="form-control" type="number" value="1"></input></td>
            <td id="subtotal">
              ${Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format(producto.costo_en_pesos)}
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
      subtotal.textContent = new Intl.NumberFormat("en-US", { style: 'currency', currency: 'USD' }).format((precio.textContent.replace(/[^0-9.-]+/g,"") * cantidad).toFixed(2));
      
      calcularTotal(); // Llamamos a la función calcularTotal() cuando cambia la cantidad
    });

    prod.querySelector("#del").addEventListener("click", () => {
      prod.remove();
      let productos = JSON.parse(localStorage.getItem("cart"));
      productos = productos.filter((producto) => {
        return producto.identificacion != prod.querySelector("#id").textContent;
      });
      localStorage.setItem("cart", JSON.stringify(productos));
      
      calcularTotal(); // Llamamos a la función calcularTotal() cuando se elimina un producto
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  calcularTotal();
});

// Llamar a calcularTotal() cuando se cambie la forma de pago
document.querySelectorAll('input[name="formaPago"]').forEach((input) => {
  input.addEventListener("change", calcularTotal);
});