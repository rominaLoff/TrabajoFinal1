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
        urlDestino = `http://fakestoreapi.com/products/category/${categoriaElegida}`;
    }
    document.getElementById("contenedor-productos").innerHTML = "<p>Cargando productos...</p>";
    fetch(urlDestino)
    .then(respuesta => respuesta.json())
    .then(productosFiltrados => mostrarProductos(productosFiltrados));
});


