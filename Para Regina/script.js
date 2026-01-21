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

// Variable para almacenar la historia activa actual
let activeStoryId = null;

// Variable para almacenar la posición del scroll antes de entrar a una historia
let scrollPositionBeforeStory = 0;

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

        // Aplica transición suave a cada imagen individual
        item.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

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
    // Velocidad más lenta y romántica (reducida para un movimiento más suave)
    const rotationSpeed = 10; // Grados por unidad de scroll 

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
   FUNCIÓN: Rotar imagen seleccionada hacia arriba
   ============================================ */

/**
 * Esta función rota el carrusel para que la imagen seleccionada quede arriba (centro superior).
 * @param {number} itemIndex - El índice de la imagen seleccionada
 */
function rotateSelectedItemToTop(itemIndex) {
    // Calcula el ángulo actual de la imagen seleccionada
    const currentAngle = itemIndex * angleBetweenItems;
    
    // Queremos que la imagen quede arriba, que es -90 grados desde el centro
    // (en un círculo, arriba es -90 grados, abajo es 90 grados)
    const targetAngle = -90;
    
    // Calcula cuánto necesitamos rotar el carrusel
    // Restamos el ángulo actual y sumamos el ángulo objetivo
    const rotationNeeded = targetAngle - currentAngle;
    
    // Actualiza el ángulo de rotación
    rotationAngle = rotationAngle + rotationNeeded;
    
    // Aplica la rotación con una transición suave
    carouselWheel.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
    carouselWheel.style.transform = `rotate(${rotationAngle}deg)`;
    
    // Reposiciona todas las imágenes con la nueva rotación
    positionCarouselItems();
    
    // Restaura la transición normal después de la animación
    setTimeout(() => {
        carouselWheel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 1000);
}

/* ============================================
   FUNCIÓN: Bloquear scroll de la página
   ============================================ */

/**
 * Esta función bloquea el scroll de la página principal.
 * Se llama cuando se entra a una historia para crear una experiencia cerrada.
 */
function lockPageScroll() {
    // Guarda la posición actual del scroll antes de bloquearlo
    scrollPositionBeforeStory = window.scrollY || window.pageYOffset;
    
    // BLOQUEA EL SCROLL: Agrega clase al body que bloquea el overflow
    document.body.classList.add('scroll-locked');
    
    // También establece overflow hidden directamente como respaldo
    document.body.style.overflow = 'hidden';
    
    // Previene scroll en móviles guardando la posición
    document.body.style.top = `-${scrollPositionBeforeStory}px`;
    
    console.log('Scroll bloqueado - Entrando a historia');
}

/* ============================================
   FUNCIÓN: Desbloquear scroll de la página
   ============================================ */

/**
 * Esta función restaura el scroll de la página principal.
 * Se llama cuando se sale de una historia.
 */
function unlockPageScroll() {
    // DESBLOQUEA EL SCROLL: Remueve la clase del body
    document.body.classList.remove('scroll-locked');
    
    // Restaura el overflow normal
    document.body.style.overflow = '';
    
    // Restaura la posición del scroll en desktop
    window.scrollTo(0, scrollPositionBeforeStory);
    
    // Restaura la posición top en móviles
    document.body.style.top = '';
    
    console.log('Scroll desbloqueado - Saliendo de historia');
}

/* ============================================
   FUNCIÓN: Mostrar historia específica
   ============================================ */

/**
 * Esta función muestra solo la historia seleccionada y oculta todas las demás.
 * @param {string} storyId - El ID de la historia a mostrar
 */
function showStory(storyId) {
    // Obtiene todas las secciones de historias
    const allStories = document.querySelectorAll('.story-section');
    
    // Oculta todas las historias primero
    allStories.forEach(story => {
        story.classList.remove('story-active');
        story.classList.add('story-hidden');
    });
    
    // Encuentra la historia seleccionada
    const selectedStory = document.getElementById(storyId);
    
    if (selectedStory) {
        // Muestra solo la historia seleccionada
        selectedStory.classList.remove('story-hidden');
        selectedStory.classList.add('story-active');
        
        // Guarda el ID de la historia activa
        activeStoryId = storyId;
        
        // Hace scroll al inicio de la historia (dentro del overlay)
        setTimeout(() => {
            selectedStory.scrollTop = 0;
        }, 100);
        
        console.log(`Historia activa: ${storyId}`);
    } else {
        console.warn(`No se encontró la historia con id: ${storyId}`);
    }
}

/* ============================================
   FUNCIÓN: Ocultar todas las historias
   ============================================ */

/**
 * Esta función oculta todas las historias y vuelve al carrusel.
 */
function hideAllStories() {
    // Obtiene todas las secciones de historias
    const allStories = document.querySelectorAll('.story-section');
    
    // Oculta todas las historias
    allStories.forEach(story => {
        story.classList.remove('story-active');
        story.classList.add('story-hidden');
    });
    
    // Limpia la historia activa
    activeStoryId = null;
    
    console.log('Todas las historias ocultas - Volviendo al carrusel');
}

/* ============================================
   FUNCIÓN: Detectar click en imágenes
   ============================================ */

/**
 * Esta función detecta cuando el usuario hace click en una imagen del carrusel
 * y abre la historia correspondiente en modo overlay fullscreen.
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

    // Encuentra el índice de la imagen clickeada
    const itemIndex = Array.from(carouselItems).indexOf(clickedItem);
    
    // Rota el carrusel para que la imagen seleccionada quede arriba
    if (itemIndex !== -1) {
        rotateSelectedItemToTop(itemIndex);
    }

    // Cambia el estado para indicar que ya no estamos en el landing
    isInLanding = false;

    // Espera un momento para que la rotación se complete antes de abrir la historia
    setTimeout(() => {
        // BLOQUEA EL SCROLL DE LA PÁGINA PRINCIPAL
        lockPageScroll();
        
        // MUESTRA SOLO LA HISTORIA SELECCIONADA (oculta las demás)
        showStory(storyId);
    }, 500);
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
 * NOTA: Esta función NO se ejecuta cuando hay una historia activa
 * porque el scroll está bloqueado.
 */
function handlePageScroll() {
    // Solo verifica si estamos en el landing si NO hay una historia activa
    // Si hay una historia activa, el scroll está bloqueado y no deberíamos estar aquí
    if (!activeStoryId) {
        checkIfInLanding();
    }
}

/* ============================================
   FUNCIÓN: Volver al carrusel
   ============================================ */

/**
 * Esta función cierra la historia actual y vuelve al carrusel.
 * DESBLOQUEA EL SCROLL y oculta todas las historias.
 * Se llama cuando el usuario hace click en el botón "Volver al carrusel".
 */
function goBackToCarousel() {
    // OCULTA TODAS LAS HISTORIAS (incluyendo la activa)
    hideAllStories();
    
    // DESBLOQUEA EL SCROLL DE LA PÁGINA PRINCIPAL
    unlockPageScroll();
    
    // Actualiza el estado para indicar que estamos de vuelta en el landing
    isInLanding = true;
    
    // Opcional: Scroll suave de vuelta al inicio si es necesario
    // (No es necesario porque el scroll ya está restaurado a su posición anterior)
    
    console.log('Volviendo al carrusel - Scroll restaurado');
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

    // INICIALIZACIÓN: Oculta todas las historias por defecto
    // Esto asegura que solo el carrusel sea visible al cargar la página
    const allStories = document.querySelectorAll('.story-section');
    allStories.forEach(story => {
        story.classList.add('story-hidden');
        story.classList.remove('story-active');
    });
    console.log(`Inicializadas ${allStories.length} historias (ocultas por defecto)`);

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
    // Nota: Este evento solo funcionará cuando no haya una historia activa
    window.addEventListener('scroll', handlePageScroll);

    // Verifica el estado inicial
    checkIfInLanding();

    // Asegura que el scroll no esté bloqueado al inicio
    unlockPageScroll();

    // Log para confirmar que todo se inicializó correctamente
    console.log(`Carrusel inicializado con ${totalItems} imágenes`);
    console.log('Sistema de historias independientes activo');
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
