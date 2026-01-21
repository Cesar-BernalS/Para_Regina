/* ============================================
   CONFIGURACIÓN INICIAL
   ============================================ */

// Obtiene el elemento del carrusel
const carouselWheel = document.getElementById('carouselWheel');

// Obtiene todos los elementos del carrusel (imágenes)
const carouselItems = document.querySelectorAll('.carousel-item');

// Variable para almacenar el ángulo actual de rotación
let rotationAngle = 0;

// Variable para controlar si estamos en la sección del landing
let isInLanding = true;

// Variable para prevenir múltiples eventos de scroll muy rápidos
let scrollTimeout = null;

// Número total de imágenes en el carrusel
const totalItems = carouselItems.length;

// Ángulo entre cada imagen (360 grados dividido entre el número de imágenes)
const angleBetweenItems = 360 / totalItems;

/* ============================================
   FUNCIÓN: Obtener radio del carrusel
   ============================================ */

/**
 * Esta función obtiene el radio del carrusel según el tamaño de la pantalla.
 * @returns {number} El radio en píxeles
 */
function getCarouselRadius() {
    const windowWidth = window.innerWidth;
    
    if (windowWidth <= 480) {
        return 180; // Móvil
    } else if (windowWidth <= 768) {
        return 220; // Tablet
    } else if (windowWidth >= 1400) {
        return 350; // Pantallas muy grandes
    }
    return 300; // Desktop por defecto
}

/* ============================================
   FUNCIÓN: Posicionar imágenes en el círculo
   ============================================ */

/**
 * Esta función posiciona cada imagen del carrusel alrededor de un círculo.
 * Calcula la posición de cada imagen basándose en su índice y el ángulo entre ellas.
 */
function positionCarouselItems() {
    // Obtiene el radio según el tamaño de la pantalla
    const radius = getCarouselRadius();

    // Itera sobre cada imagen del carrusel
    carouselItems.forEach((item, index) => {
        // Calcula el ángulo inicial de esta imagen (en grados)
        // Cada imagen se coloca en un ángulo diferente alrededor del círculo
        const baseAngle = index * angleBetweenItems;
        const angleRad = baseAngle * (Math.PI / 180); // Convierte a radianes

        // Calcula la posición X usando trigonometría (coseno)
        const x = Math.cos(angleRad) * radius;

        // Calcula la posición Y usando trigonometría (seno)
        const y = Math.sin(angleRad) * radius;

        // Calcula el ángulo de rotación compensatorio para que la imagen mire hacia el centro
        const itemRotation = baseAngle - rotationAngle;

        // Aplica la transformación para posicionar la imagen
        // translate() mueve la imagen a su posición en el círculo
        // rotate() la rota para que siempre mire hacia el centro
        item.style.transform = `translate(${x}px, ${y}px) rotate(${itemRotation}deg)`;
    });
}

/* ============================================
   FUNCIÓN: Rotar el carrusel
   ============================================ */

/**
 * Esta función rota todo el carrusel un cierto número de grados.
 * @param {number} angle - El ángulo en grados que se debe rotar (positivo = sentido horario)
 */
function rotateCarousel(angle) {
    // Actualiza el ángulo de rotación acumulado
    rotationAngle += angle;

    // Aplica la rotación al contenedor del carrusel
    // rotate() rota todo el carrusel alrededor de su centro
    carouselWheel.style.transform = `rotate(${rotationAngle}deg)`;

    // Reposiciona todas las imágenes con la nueva rotación
    positionCarouselItems();
}

/* ============================================
   FUNCIÓN: Detectar scroll del mouse
   ============================================ */

/**
 * Esta función detecta cuando el usuario hace scroll con el mouse
 * y convierte ese scroll en rotación del carrusel.
 */
function handleScroll(event) {
    // Solo procesa el scroll si estamos en la sección del landing
    if (!isInLanding) {
        return;
    }

    // Previene el comportamiento por defecto del scroll (evita que la página se desplace)
    event.preventDefault();
    event.stopPropagation();

    // Limpia el timeout anterior si existe
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    // Obtiene la dirección del scroll
    // deltaY es positivo cuando se hace scroll hacia abajo, negativo hacia arriba
    const deltaY = event.deltaY;

    // Calcula el ángulo de rotación basado en el scroll
    // Ajusta este valor para hacer la rotación más rápida o más lenta
    const rotationSpeed = 1.5; // Grados por unidad de scroll

    // Determina la dirección de la rotación
    // Scroll hacia abajo = rotación en sentido horario (positivo)
    // Scroll hacia arriba = rotación en sentido antihorario (negativo)
    const rotationDirection = deltaY > 0 ? rotationSpeed : -rotationSpeed;

    // Rota el carrusel
    rotateCarousel(rotationDirection);

    // Establece un timeout para detectar cuando el scroll termina
    scrollTimeout = setTimeout(() => {
        // Aquí podrías agregar lógica adicional cuando el scroll termina
    }, 150);
}

/* ============================================
   FUNCIÓN: Detectar click en imágenes
   ============================================ */

/**
 * Esta función detecta cuando el usuario hace click en una imagen del carrusel
 * y navega a la historia correspondiente.
 */
function handleImageClick(event) {
    // Obtiene el elemento que fue clickeado
    const clickedItem = event.currentTarget;

    // Obtiene el atributo data-story que indica a qué historia navegar
    const storyId = clickedItem.getAttribute('data-story');

    // Si no hay un storyId, no hace nada
    if (!storyId) {
        console.warn('Esta imagen no tiene un data-story asignado');
        return;
    }

    // Encuentra la sección de la historia correspondiente
    const storySection = document.getElementById(storyId);

    // Si la sección existe, navega a ella
    if (storySection) {
        // Cambia el estado para indicar que ya no estamos en el landing
        isInLanding = false;

        // Navega suavemente a la sección de la historia
        storySection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Después de un tiempo, permite volver a detectar si estamos en el landing
        setTimeout(() => {
            checkIfInLanding();
        }, 1000);
    } else {
        console.warn(`No se encontró la sección con id: ${storyId}`);
    }
}

/* ============================================
   FUNCIÓN: Verificar si estamos en el landing
   ============================================ */

/**
 * Esta función verifica si el usuario está actualmente en la sección del landing.
 * Se usa para activar/desactivar la rotación del carrusel con el scroll.
 */
function checkIfInLanding() {
    // Obtiene la sección del landing
    const landingSection = document.getElementById('landing');

    // Obtiene la posición actual del scroll
    const scrollPosition = window.scrollY || window.pageYOffset;

    // Obtiene la altura de la ventana
    const windowHeight = window.innerHeight;

    // Calcula si estamos dentro del área del landing
    // Estamos en el landing si el scroll está dentro de la altura de la ventana
    isInLanding = scrollPosition < windowHeight * 0.8;
}

/* ============================================
   FUNCIÓN: Manejar scroll de la página
   ============================================ */

/**
 * Esta función maneja el scroll general de la página.
 * Se usa para detectar cuando el usuario vuelve al landing.
 */
function handlePageScroll() {
    // Verifica si estamos en el landing
    checkIfInLanding();
}

/* ============================================
   INICIALIZACIÓN
   ============================================ */

/**
 * Esta función inicializa todos los componentes cuando la página carga.
 */
function init() {
    // Verifica que el carrusel exista
    if (!carouselWheel) {
        console.error('No se encontró el elemento del carrusel');
        return;
    }

    // Verifica que haya imágenes en el carrusel
    if (carouselItems.length === 0) {
        console.warn('No se encontraron imágenes en el carrusel');
        return;
    }

    // Posiciona las imágenes en el círculo inicial
    positionCarouselItems();

    // Agrega el evento de scroll del mouse al contenedor del carrusel y al landing
    // 'wheel' es el evento que se dispara cuando el usuario hace scroll con el mouse
    const landingSection = document.getElementById('landing');
    if (landingSection) {
        landingSection.addEventListener('wheel', handleScroll, { passive: false });
    }
    carouselWheel.addEventListener('wheel', handleScroll, { passive: false });

    // Agrega el evento de click a cada imagen del carrusel
    carouselItems.forEach(item => {
        item.addEventListener('click', handleImageClick);
    });

    // Agrega el evento de scroll de la página para detectar cuando volvemos al landing
    window.addEventListener('scroll', handlePageScroll);

    // Verifica el estado inicial
    checkIfInLanding();

    // Log para confirmar que todo se inicializó correctamente
    console.log(`Carrusel inicializado con ${totalItems} imágenes`);
}

/* ============================================
   EJECUCIÓN AL CARGAR LA PÁGINA
   ============================================ */

// Espera a que el DOM esté completamente cargado antes de inicializar
if (document.readyState === 'loading') {
    // Si el DOM aún se está cargando, espera al evento 'DOMContentLoaded'
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Si el DOM ya está cargado, inicializa inmediatamente
    init();
}

/* ============================================
   AJUSTES RESPONSIVE
   ============================================ */

/**
 * Esta función ajusta el radio del carrusel según el tamaño de la pantalla.
 * Se ejecuta cuando la ventana cambia de tamaño.
 */
function adjustCarouselForScreenSize() {
    // Reposiciona las imágenes con el nuevo radio
    // La función positionCarouselItems() ya obtiene el radio correcto automáticamente
    positionCarouselItems();
}

// Escucha cambios en el tamaño de la ventana
window.addEventListener('resize', adjustCarouselForScreenSize);

// Ejecuta el ajuste inicial
adjustCarouselForScreenSize();
