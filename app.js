// Definicion de las constantes para traer del DOM el elemento donde se pintará la tarjeta y el tamplate de la tarjeta

// variables que contendrán la sección en donde se mostrarán las cards de productos, la tabla del carrito y el footer.
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
// variables que contendrán los templates de las cards de productos, la tabla y el footer.
const templateCard = document.getElementById('template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateFooter = document.getElementById('template-footer').content;
// variable al que se le pasará los productos que fueron recorridos para evitar el reflow.
const fragment = document.createDocumentFragment();
// Objeto que contendrá los items que agreguen al carrito de compras
let carritoCompras = {};

// evento que ejecutará la función que consume la api de los productos.
document.addEventListener('DOMContentLoaded', () => { 
    fetchData() 
    if ( localStorage.getItem('carrito') ) {
        carritoCompras = JSON.parse(localStorage.getItem('carrito'));
        pintarItems()
    }
})

// función que obtendrá los productos a través de la "API". 
const fetchData = async () => {
    try {
        const res = await fetch('./api.json');
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        console.error(error)
    }
}

// pinta en el HTML los productos que se trajeron a través da la API usando el template de cards.
const pintarCards = (data) => {

    data.forEach(element => {
        templateCard.querySelector('.card-title').textContent = element.title;
        templateCard.querySelector('.card-text').textContent = element.precio;
        templateCard.querySelector('img').setAttribute("src", element.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id = element.id;        

        // clonamos el template para poder enviarlo a la variable fragment.
        const clone = templateCard.cloneNode(true);
        // añadimos los elementos clonados a la variable fragment.
        fragment.appendChild(clone);      
    });
    // añadimos al HTML el fragment con los productos.
    cards.appendChild(fragment);
}

// Ponemos un escuchardor de eventos a los items para detectar el clic del botón de compra.
cards.addEventListener('click', (e) => {

    // se crea una condicional para que cuando el clic corresponda al que tenga la clase que tiene el botón de comopra, entonces pasará el elemento padre de dicho botón a la función que añadirá los elementos al carrito.
    if (e.target.classList.contains('btn-dark')) {
        enviarCarrito(e.target.parentElement);
    }
    e.stopPropagation();

})

// función que añadirá los productos al carrito.
const enviarCarrito = (objeto) => {

    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('.card-title').textContent,
        precio: objeto.querySelector('.card-text').textContent,
        cantidad: 1
    }
    
    if (carritoCompras.hasOwnProperty(producto.id)) {
        producto.cantidad = carritoCompras[producto.id].cantidad + 1;
    }
    // se crea el index con el mismo id del producto y luego se añade a ese index el producto completo.
    carritoCompras[producto.id] = {...producto}
    pintarItems()
}

// Mostrará los elementos agregados en el carrito de compras.
const pintarItems = () => {
    items.innerHTML = ''
    Object.values(carritoCompras).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carritoCompras))
}
// mostrará los totales del carrito de compras como la cantidad de elementos y la suma total de los precios.
const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carritoCompras).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carritoCompras).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carritoCompras).reduce((acc, { precio, cantidad }) => acc + precio * cantidad, 0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')

    btnVaciar.addEventListener('click', () => {
        carritoCompras = {}
        pintarItems()
    })
}

items.addEventListener('click', (e) => {
    btnActions(e)
})

const btnActions = (e) => {
    
    if ( e.target.classList.contains('btn-info') ) {
        const producto = carritoCompras[e.target.dataset.id]
        producto.cantidad++;
        // carritoCompras[e.target.dataset.id] = {...producto}
        pintarItems()
    }
    if ( e.target.classList.contains('btn-danger') ) {
        const producto = carritoCompras[e.target.dataset.id]
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carritoCompras[e.target.dataset.id]
        }
        pintarItems()
    }
    e.stopPropagation();
}





















/* const addCarrito = (e) => {
    
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation();
} */

/* const setCarrito = objeto => {

    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('.card-title').textContent,
        precio: objeto.querySelector('.card-text').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = {...producto}
    console.log(carrito)
} */