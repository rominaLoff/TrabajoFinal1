const URL_PRODUCTOS = "https://fakestoreapi.com/products";
const URL_CATEGORIAS = "https://fakestoreapi.com/products/categories";

function obtenerProductos() {
    fetch(URL_PRODUCTOS)
    .then(respuesta => respuesta.json())
    .then(data => mostrarProductos(data))
    .catch(() => {
        document.getElementById("contenedor-productos").innerHTML = "<p>Error al cargar productos.</p>";
    });
}

function mostrarProductos(lista) {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";

    lista.forEach(producto => {
        const card = document.createElement("div");
        card.className = "card-producto"; 
        card.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <div class="info-producto">
                <h3>${producto.title}</h3>
                <p class= "precio">$${producto.price}</p>
                <button class="btn-detalle">Ver Detalle</button>
                <button class="btn-agregar">Agregar al carrito</button>
                
            </div>
        `;
        const btnDetalle = card.querySelector(".btn-detalle");
        btnDetalle.addEventListener("click", () => {
            abrirModal(producto);
        });
        const btnAgregar = card.querySelector(".btn-agregar");
        btnAgregar.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });
        contenedor.appendChild(card);
    });
}


function abrirModal(producto) {
    const modal = document.getElementById("modal-producto");
    const contenedorDetalle = document.getElementById("detalle-producto-modal");

    contenedorDetalle.innerHTML = `
        <h2>${producto.title}</h2>
        <img src="${producto.image}" style="width:100px; display:block; margin:10px auto; object-fit:contain;">
        <p>${producto.description}</p>
        <p><strong>Precio: $${producto.price}</strong></p>
        <button class="btn-agregar" id="btn-agregar-modal">Agregar al carrito</button>
    `;
    const btnAgregarModal = document.querySelector("#btn-agregar-modal");
    btnAgregarModal.addEventListener("click", () => {
    agregarAlCarrito(producto);
    });
    modal.style.display = "block";
}

document.addEventListener("DOMContentLoaded",()=>{
    obtenerProductos();
    obtenerCategorias();
});
const modal = document.getElementById("modal-producto");
const btnCerrar = document.querySelector(".cerrar-modal");

if (btnCerrar && modal) {
    btnCerrar.onclick = () => {
        modal.style.display = "none";
    };
}
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function obtenerCategorias() {
    fetch(URL_CATEGORIAS)
    .then(respuesta => respuesta.json())
    .then(categorias => llenarComboCategorias(categorias))
}

function llenarComboCategorias(categorias) {
    const select = document.getElementById("filtroCategorias");
    categorias.forEach(categoria => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    select.appendChild(opcion);
});}

const comboCategorias = document.getElementById("filtroCategorias");
comboCategorias.addEventListener("change", (evento) => {
    const categoriaElegida = evento.target.value;
    let urlDestino = URL_PRODUCTOS;
    if (categoriaElegida !== "todos") {
        urlDestino = `https://fakestoreapi.com/products/category/${categoriaElegida}`;
    }
    document.getElementById("contenedor-productos").innerHTML = "<p>Cargando productos...</p>";
    fetch(urlDestino)
    .then(respuesta => respuesta.json())
    .then(productosFiltrados => mostrarProductos(productosFiltrados));
});

let carrito = JSON.parse(localStorage.getItem("carrito-tiendita")) ||[];

const btnVerCarrito = document.getElementById("btn-ver-carrito");
const modalCarrito = document.getElementById("modal-carrito");
const btnCerrarCarrito = document.getElementById("cerrar-carrito-btn");
const btnVaciar = document.getElementById("btn-vaciar-carrito");

function agregarAlCarrito(producto){
carrito.push(producto);
localStorage.setItem("carrito-tiendida", JSON.stringify(carrito));
console.log("Producto Agregado: ", producto.title);
actualizarContador();
}

function actualizarContador(){
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent=`🛒Carrito (${carrito.length})`;
    }
}
if(btnVerCarrito){
    btnVerCarrito.addEventListener("click", abrirModalCarrito)
}

if (btnCerrarCarrito) {
    btnCerrarCarrito.onclick = () => {
        modalCarrito.style.display ="none"; 
    };
}

function abrirModalCarrito(){
    const modalCarrito = document.getElementById("modal-carrito");
    const contenedorItems = document.getElementById("items-carrito-contenedor");
    const txtCantidad=document.getElementById("total-cantidad");
    const txtPrecio=document.getElementById("total-precio");

    contenedorItems.innerHTML = "";

    if (carrito.length==0){
        contenedorItems.innerHTML = "<p>El carrito está vacío.</p>";
    }
    else {
        carrito.forEach((item, index) => {
            const fila = document.createElement ("div");
            fila.className = "item-carrito";

            fila.innerHTML = `
            <img src ="${item.image}" alt = "${item.title}" class ="img-mini-carrito"> 
           <h4>${item.title}</h4>
            <p><strong>$${item.price}</strong></p>
            <button class ="btn-eliminar-item" title="Eliminar producto">🗑</button>
            `;

            const btnEliminar = fila.querySelector(".btn-eliminar-item");
            btnEliminar.addEventListener("click", () =>{
                eliminarDelCarrito(index);
            });
            contenedorItems.appendChild(fila);
        })
    }

    txtCantidad.textContent= carrito.length;

    const totalPagar = carrito.reduce((acumulador, item) => acumulador + item.price, 0);
    txtPrecio.textContent = totalPagar.toFixed(2);

    modalCarrito.style.display = "block"
}

function eliminarDelCarrito(indice) {
    carrito.splice(indice,1);
    localStorage.setItem("carrito-tiendita", JSON.stringify(carrito));
    actualizarContador();
    abrirModalCarrito();
}

if (btnVaciar) {
    btnVaciar.addEventListener("click", ()=> {
    carrito = [];
    localStorage.removeItem("carrito-tiendida");
    actualizarContador();
    abrirModalCarrito();
   });
}



