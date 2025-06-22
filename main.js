

// ============================================================================
// FUNCIONES DE CAMBIO DE TEMA
// ============================================================================

/**
 * Función para cambiar tema (claro/oscuro)
 */
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    if (body.classList.contains('theme-dark')) {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('theme-light');
        body.classList.add('theme-dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * Cargar tema guardado en localStorage
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'light') {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('theme-light');
        body.classList.add('theme-dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}


/**
 * Función para menú móvil
 */
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

/**
 * Configurar smooth scrolling para enlaces internos
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


/**
 * Función para ocultar el loading del GIF
 */
function hideLoading() {
    const loading = document.getElementById('video-loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
}

/**
 * Configurar el GIF de fogata
 */
function setupHeroGif() {
    const loading = document.getElementById('video-loading');
    
    // Ocultar loading después de 3 segundos como máximo
    setTimeout(hideLoading, 3000);
    
    // Detectar si es móvil para optimizar
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // En móviles, ocultar loading inmediatamente
        hideLoading();
    }
}


/**
 * Agregar animaciones de entrada a elementos
 */
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que deben animarse
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}


/**
 * Detectar si el dispositivo es móvil
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Formatear números de teléfono
 */
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}


/**
 * Función principal de inicialización
 */
function initializeFlama() {
    console.log('🔥 Inicializando FLAMA...');
    
    // Cargar tema
    loadTheme();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar smooth scrolling
    setupSmoothScrolling();
    
    // Configurar GIF de fogata
    setupHeroGif();
    
    // Configurar animaciones
    setupAnimations();
    
    console.log('✅ FLAMA inicializado correctamente');
}

/**
 * Configurar todos los event listeners
 */
function setupEventListeners() {
    // Botón de cambio de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Botón de menú móvil
    const menuToggle = document.querySelector('[onclick="toggleMenu()"]');
    if (menuToggle) {
        menuToggle.removeAttribute('onclick');
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Event listeners adicionales
    window.addEventListener('resize', () => {
        if (isMobile()) {
            // Comportamiento específico para móviles
        }
    });
}


// Hacer funciones disponibles globalmente
window.toggleTheme = toggleTheme;
window.toggleMenu = toggleMenu;
window.hideLoading = hideLoading;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeFlama); 