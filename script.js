// URL de la API de productos
const API_URL = 'https://back-flama-production.up.railway.app/productos';

// Elementos del DOM
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

/**
 * Función para crear el HTML de una tarjeta de producto con estilo FLAMA
 * @param {Object} producto - Objeto del producto
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaProducto(producto) {
    return `
        <div class="bg-theme-secondary rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-theme">
            <div class="relative p-2">
                <img 
                    src="${producto.imagen}" 
                    alt="Producto ${producto.id}" 
                    class="w-full h-64 object-contain bg-gray-600 rounded-lg"
                    onerror="this.src='https://via.placeholder.com/400x300/374151/ffffff?text=Imagen+No+Disponible'"
                >
            </div>
            <div class="p-6 pt-8">
                <div class="flex justify-between items-center mb-6">
                    <span class="text-theme-secondary text-sm font-semibold uppercase tracking-wide">
                        Escríbenos para más información
                    </span>
                </div>
                <a 
                    href="${producto.whatsapp}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 w-full text-center block"
                >
                    <i class="fab fa-whatsapp mr-2"></i>
                    Contáctanos
                </a>
            </div>
        </div>
    `;
}

/**
 * Función para crear mensaje cuando no hay productos
 * @param {string} categoria - Nombre de la categoría
 * @returns {string} HTML del mensaje
 */
function crearMensajeSinProductos(categoria) {
    return `
        <div class="col-span-full text-center py-12">
            <div class="bg-theme-secondary rounded-lg p-8 border border-theme">
                <i class="fas fa-box-open text-6xl text-orange-500 mb-4"></i>
                <h3 class="text-2xl font-bold text-theme-primary mb-2">No hay ${categoria} disponibles</h3>
                <p class="text-theme-secondary">Pronto tendremos nuevos productos en esta categoría.</p>
            </div>
        </div>
    `;
}

/**
 * Función para crear botón "Mostrar más"
 * @param {string} categoriaId - ID de la categoría
 * @param {number} totalProductos - Total de productos
 * @param {number} productosMostrados - Productos actualmente mostrados
 * @returns {string} HTML del botón
 */
function crearBotonMostrarMas(categoriaId, totalProductos, productosMostrados) {
    const productosRestantes = totalProductos - productosMostrados;
    return `
        <div class="col-span-full text-center mt-8">
            <button 
                onclick="mostrarMasProductos('${categoriaId}')"
                class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                <i class="fas fa-plus mr-2"></i>
                Mostrar más (${productosRestantes} más)
            </button>
        </div>
    `;
}

/**
 * Función para renderizar productos en una categoría específica
 * @param {Array} productos - Array de productos
 * @param {string} contenedorId - ID del contenedor donde renderizar
 * @param {string} categoriaNombre - Nombre de la categoría para mensajes
 * @param {number} limiteInicial - Número de productos a mostrar inicialmente
 */
function renderizarProductos(productos, contenedorId, categoriaNombre, limiteInicial = 3) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) {
        console.warn(`Contenedor ${contenedorId} no encontrado`);
        return;
    }

    contenedor.innerHTML = '';
    
    if (productos.length === 0) {
        contenedor.innerHTML = crearMensajeSinProductos(categoriaNombre);
        return;
    }

    // Mostrar solo los primeros productos según el límite
    const productosAMostrar = productos.slice(0, limiteInicial);
    
    productosAMostrar.forEach(producto => {
        contenedor.innerHTML += crearTarjetaProducto(producto);
    });

    // Agregar botón "Mostrar más" si hay más productos
    if (productos.length > limiteInicial) {
        contenedor.innerHTML += crearBotonMostrarMas(contenedorId, productos.length, productosAMostrar.length);
    }
}

/**
 * Función para mostrar más productos
 * @param {string} categoriaId - ID de la categoría
 */
function mostrarMasProductos(categoriaId) {
    console.log('🔄 Mostrando más productos para:', categoriaId);
    
    const contenedor = document.getElementById(categoriaId);
    if (!contenedor) {
        console.error('❌ Contenedor no encontrado:', categoriaId);
        return;
    }

    // Obtener los productos de la variable global
    let productos = [];
    if (categoriaId === 'productos-camisas') {
        productos = TODOS_LOS_PRODUCTOS.camisas || [];
    } else if (categoriaId === 'productos-pantalones') {
        productos = TODOS_LOS_PRODUCTOS.pantalones || [];
    } else if (categoriaId === 'productos-conjuntos') {
        productos = TODOS_LOS_PRODUCTOS.conjuntos || [];
    }

    if (productos.length === 0) {
        console.error('❌ No hay productos para mostrar en:', categoriaId);
        return;
    }

    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Mostrar todos los productos
    productos.forEach(producto => {
        contenedor.innerHTML += crearTarjetaProducto(producto);
    });

    console.log(`✅ Mostrados todos los productos de ${categoriaId}: ${productos.length} productos`);
}

// Variable global para almacenar todos los productos
let TODOS_LOS_PRODUCTOS = {};

/**
 * Función para mostrar indicador de carga
 */
function mostrarCarga() {
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    }
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

/**
 * Función para ocultar indicador de carga
 */
function ocultarCarga() {
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

/**
 * Función para mostrar error
 */
function mostrarError() {
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
    if (errorElement) {
        errorElement.classList.remove('hidden');
    }
}

/**
 * Función principal para cargar y procesar los productos
 */
async function cargarProductos() {
    try {
        mostrarCarga();

        console.log('🔄 Iniciando carga de productos desde:', API_URL);

        // Realizar petición GET a la API
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const productos = await response.json();
        console.log('✅ Productos cargados exitosamente:', productos);

        // Agrupar productos por categoría
        const camisas = productos.filter(p => p.categoria === 'camisa');
        const pantalones = productos.filter(p => p.categoria === 'pantalon' || p.categoria === 'pantalón');
        const conjuntos = productos.filter(p => p.categoria === 'conjunto')
            .sort((a, b) => b.id - a.id); // Ordenar por ID descendente

        // Almacenar todos los productos globalmente
        TODOS_LOS_PRODUCTOS = {
            camisas: camisas,
            pantalones: pantalones,
            conjuntos: conjuntos
        };

        console.log(`📊 Productos agrupados:
            - Camisas: ${camisas.length}
            - Pantalones: ${pantalones.length}
            - Conjuntos: ${conjuntos.length}`);

        // Renderizar productos en sus respectivos contenedores (máximo 3 inicialmente)
        renderizarProductos(camisas, 'productos-camisas', 'camisas', 3);
        renderizarProductos(pantalones, 'productos-pantalones', 'pantalones', 3);
        renderizarProductos(conjuntos, 'productos-conjuntos', 'conjuntos', 3);

        ocultarCarga();

        console.log('🎉 Renderizado completado exitosamente');

    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        mostrarError();
        
        // Mostrar error en la consola con más detalles
        console.error('Detalles del error:', {
            message: error.message,
            stack: error.stack,
            url: API_URL
        });
    }
}

// Función para manejar errores de red
function manejarErrorRed() {
    console.error('❌ Error de red al cargar productos');
    mostrarError();
}

// Función para manejar timeout
function manejarTimeout() {
    console.error('⏰ Timeout al cargar productos');
    mostrarError();
}

// Configurar event listeners para errores de red
window.addEventListener('online', () => {
    console.log('🌐 Conexión restaurada, reintentando carga...');
    cargarProductos();
});

window.addEventListener('offline', () => {
    console.log('📡 Conexión perdida');
    mostrarError();
});

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM cargado, iniciando aplicación...');
    
    // Configurar timeout para la petición
    const timeoutId = setTimeout(() => {
        console.warn('⏰ Timeout configurado para la petición');
    }, 10000);

    cargarProductos().finally(() => {
        clearTimeout(timeoutId);
    });
});

// Exportar funciones para debugging (opcional)
window.FLAMA_API = {
    cargarProductos,
    renderizarProductos,
    crearTarjetaProducto,
    mostrarMasProductos,
    TODOS_LOS_PRODUCTOS
}; 