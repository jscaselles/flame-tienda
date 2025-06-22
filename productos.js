// Mapeo de categorías del JSON a IDs del HTML
const MAPEO_CATEGORIAS = {
    'camisas': 'productos-camisas',
    'pantalones': 'productos-pantalones', 
    'gorras': 'productos-gorras',
    'lociones': 'productos-lociones',
    'conjuntos': 'productos-conjuntos'
};

// Configuración para mostrar productos iniciales
const PRODUCTOS_INICIALES = {
    'camisas': 3, // Mostrar solo 3 camisas inicialmente
    'pantalones': 3,
    'gorras': 3,
    'lociones': 3,
    'conjuntos': 4
};

// Variable global para almacenar todos los productos
let TODOS_LOS_PRODUCTOS = {};

// Configuración de estilos para diferentes tipos de productos
const ESTILOS_PRODUCTOS = {
    destacados: {
        contenedor: 'bg-black rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl',
        imagen: 'w-full h-64 bg-gray-600 flex items-center justify-center',
        contenido: 'p-6',
        descripcion: 'text-gray-400 mb-4',
        boton: 'bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors font-bold'
    },
    categoria: {
        contenedor: 'bg-gray-800 rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl',
        imagen: 'w-full h-48 bg-gray-600 flex items-center justify-center',
        contenido: 'p-4',
        descripcion: 'text-gray-400 text-sm mb-2',
        boton: 'bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded transition-colors font-bold mt-2 block w-full text-center'
    }
};

const DESCRIPCION_FIJA = 'Contáctanos para más información con el botón de abajo.';

/**
 * Función principal que inicializa la carga de productos
 * Se ejecuta cuando el DOM está completamente cargado
 */
async function inicializarProductos() {
    try {
        // console.log('🚀 Iniciando carga de productos...');
        
        // Cargar datos del JSON
        const productos = await cargarDatosJSON();
        
        // Almacenar todos los productos globalmente
        TODOS_LOS_PRODUCTOS = productos;
        
        // Cargar productos destacados
        cargarProductosDestacados(productos);
        
        // Cargar productos por categoría (solo los iniciales)
        cargarProductosPorCategoria(productos, true);
        
        // Configurar event listeners para botones "Ver más"
        configurarBotonesVerMas();
        
        // console.log('✅ Productos cargados exitosamente');
        
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        mostrarErrorCarga();
    }
}

/**
 * Carga los datos del archivo producto.json
 * @returns {Promise<Object>} Objeto con todos los productos organizados por categoría
 */
async function cargarDatosJSON() {
    try {
        const response = await fetch('producto.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const datos = await response.json();
        // console.log('📦 Datos JSON cargados:', datos);
        return datos;
        
    } catch (error) {
        console.error('❌ Error al cargar JSON:', error);
        throw error;
    }
}

/**
 * Carga productos destacados (solo de la categoría 'conjuntos')
 * @param {Object} productos - Objeto con productos organizados por categoría
 */
function cargarProductosDestacados(productos) {
    const contenedor = document.getElementById('productos-destacados');
    
    if (!contenedor) {
        // console.warn('⚠️ Contenedor de productos destacados no encontrado');
        return;
    }
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Obtener productos de la categoría 'conjuntos'
    const productosConjuntos = productos['conjuntos'] || [];
    
    // Renderizar productos destacados
    productosConjuntos.forEach(producto => {
        const productoHTML = crearHTMLProductoDestacado(producto);
        contenedor.innerHTML += productoHTML;
    });
    
    // console.log(`⭐ ${productosConjuntos.length} productos destacados cargados`);
}

/**
 * Carga productos por categoría específica
 * @param {Object} productos - Objeto con productos organizados por categoría
 * @param {boolean} soloIniciales - Si mostrar solo productos iniciales
 */
function cargarProductosPorCategoria(productos, soloIniciales = false) {
    Object.keys(MAPEO_CATEGORIAS).forEach(categoria => {
        const contenedorId = MAPEO_CATEGORIAS[categoria];
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) return;
        
        contenedor.innerHTML = '';
        const productosCategoria = productos[categoria] || [];
        
        if (soloIniciales) {
            const productosAMostrar = productosCategoria.slice(0, PRODUCTOS_INICIALES[categoria]);
            productosAMostrar.forEach(producto => {
                const productoHTML = crearHTMLProductoCategoria(producto, categoria);
                contenedor.innerHTML += productoHTML;
            });
            
            // Mostrar/ocultar botón "Ver más" según corresponda
            mostrarOcultarBotonVerMas(categoria, productosCategoria.length);
        } else {
            productosCategoria.forEach(producto => {
                const productoHTML = crearHTMLProductoCategoria(producto, categoria);
                contenedor.innerHTML += productoHTML;
            });
        }
    });
}

/**
 * Muestra u oculta el botón "Ver más" según la cantidad de productos
 * @param {string} categoria - Nombre de la categoría
 * @param {number} totalProductos - Total de productos en la categoría
 */
function mostrarOcultarBotonVerMas(categoria, totalProductos) {
    const btnVerMas = document.getElementById(`btn-ver-mas-${categoria}`);
    const productosIniciales = PRODUCTOS_INICIALES[categoria];
    
    if (btnVerMas) {
        if (totalProductos > productosIniciales) {
            btnVerMas.style.display = 'inline-flex';
            btnVerMas.innerHTML = `<i class="fas fa-plus mr-2"></i>Ver Más ${categoria.charAt(0).toUpperCase() + categoria.slice(1)} (${totalProductos - productosIniciales} más)`;
        } else {
            btnVerMas.style.display = 'none';
        }
    }
}

/**
 * Crea el HTML para un producto destacado
 * @param {Object} producto - Objeto del producto
 * @returns {string} HTML del producto
 */
function crearHTMLProductoDestacado(producto) {
    const estilos = ESTILOS_PRODUCTOS.destacados;
    
    return `
        <div class="${estilos.contenedor}">
            <div class="${estilos.imagen}">
                <img src="${producto.imagen}" alt="Producto FLAMA" class="max-w-full max-h-full object-contain">
            </div>
            <div class="${estilos.contenido}">
                <p class="${estilos.descripcion}">${DESCRIPCION_FIJA}</p>
                <div class="flex justify-end">
                    <a href="${producto.linkContactar}" target="_blank" class="${estilos.boton}">Escríbenos</a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Crea el HTML para un producto de categoría
 * @param {Object} producto - Objeto del producto
 * @param {string} categoria - Nombre de la categoría
 * @returns {string} HTML del producto
 */
function crearHTMLProductoCategoria(producto, categoria = '') {
    // Si la categoría es camisas, usamos un alto mayor y la imagen más grande
    let estilos = ESTILOS_PRODUCTOS.categoria;
    let imagenClass = 'max-w-full max-h-full object-contain';
    let imagenContainerClass = estilos.imagen;
    if (categoria === 'camisas') {
        imagenContainerClass = 'w-full h-64 bg-gray-600 flex items-center justify-center';
        imagenClass = 'w-full h-full object-contain';
    }
    return `
        <div class="${estilos.contenedor}">
            <div class="${imagenContainerClass}">
                <img src="${producto.imagen}" alt="Producto FLAMA" class="${imagenClass}">
            </div>
            <div class="${estilos.contenido}">
                <p class="${estilos.descripcion}">${DESCRIPCION_FIJA}</p>
                <a href="${producto.linkContactar}" target="_blank" class="${estilos.boton}">Escríbenos</a>
            </div>
        </div>
    `;
}


/**
 * Muestra un mensaje de error cuando falla la carga
 */
function mostrarErrorCarga() {
    const contenedores = [
        'productos-destacados',
        'productos-camisas',
        'productos-pantalones',
        'productos-gorras',
        'productos-lociones',
        'productos-conjuntos'
    ];
    
    contenedores.forEach(id => {
        const contenedor = document.getElementById(id);
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <i class="fas fa-exclamation-triangle text-orange-500 text-4xl mb-4"></i>
                    <p class="text-gray-400">Error al cargar los productos. Por favor, recarga la página.</p>
                </div>
            `;
        }
    });
}

/**
 * Función placeholder para agregar productos al carrito
 * @param {number} productoId - ID del producto
 */
function agregarAlCarrito(productoId) {
    // Aquí iría la lógica para agregar al carrito
    // console.log(`🛒 Producto ${productoId} agregado al carrito`);
}


/**
 * Función para buscar productos por nombre
 * @param {string} termino - Término de búsqueda
 */
function buscarProductos(termino) {
    // console.log(`🔍 Buscando productos con término: ${termino}`);
    // TODO: Implementar búsqueda de productos
}

/**
 * Función para ordenar productos
 * @param {string} criterio - Criterio de ordenamiento (nombre, etc.)
 */
function ordenarProductos(criterio) {
    // console.log(`📊 Ordenando productos por: ${criterio}`);
    // TODO: Implementar ordenamiento de productos
}

// ============================================================================
// FUNCIONES PARA BOTONES "VER MÁS"
// ============================================================================

/**
 * Configura los event listeners para los botones "Ver más"
 */
function configurarBotonesVerMas() {
    // Botón para camisas
    const btnVerMasCamisas = document.getElementById('btn-ver-mas-camisas');
    if (btnVerMasCamisas) {
        btnVerMasCamisas.addEventListener('click', () => mostrarTodosLosProductos('camisas'));
    }
}

/**
 * Muestra todos los productos de una categoría específica
 * @param {string} categoria - Nombre de la categoría
 */
function mostrarTodosLosProductos(categoria) {
    const contenedorId = MAPEO_CATEGORIAS[categoria];
    const contenedor = document.getElementById(contenedorId);
    const btnVerMas = document.getElementById(`btn-ver-mas-${categoria}`);
    
    if (!contenedor || !TODOS_LOS_PRODUCTOS[categoria]) {
        // console.warn(`⚠️ No se encontró contenedor o productos para ${categoria}`);
        return;
    }
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Cargar todos los productos de la categoría
    TODOS_LOS_PRODUCTOS[categoria].forEach(producto => {
        const productoHTML = crearHTMLProductoCategoria(producto, categoria);
        contenedor.innerHTML += productoHTML;
    });
    
    // Ocultar el botón "Ver más"
    if (btnVerMas) {
        btnVerMas.style.display = 'none';
    }
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarProductos);

// Exportar funciones para uso global (opcional)
window.FlamaProductos = {
    inicializarProductos,
    buscarProductos,
    ordenarProductos,
    agregarAlCarrito
}; 