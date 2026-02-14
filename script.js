/* ===== CONFIGURACIÓN CONTRASEÑA ===== */
const PASSWORD = "20092025";

/* ===== CONFIGURACIÓN DE FOTOS - RULETA ===== */
/* Edita "title" y "story" de cada foto para personalizarlas */
const photoData = [
    { img: "11-julio.JPG", title: "11 de julio de 2025", story: "Este fue el primer día que nos conocimos y supe que éramos muy compatibles, nunca pense que seria tan feliz contigo. El poder escribir una historia tan bonita contigo es un sueño hecho realidad. ❤️" },
    { img: "25-julio.jpg", title: "2025-07-25", story: "De las primeras citas que tuvimos, de esas citas que fueron diferentes, el pasear en bici, el pasar un dia completo contigo fue algo muy especial. ❤️" },
    { img: "14-ago.jpg", title: "2025-08-14", story: "La primera cita que tuvimos en el tec, cuando te vi y de verdad me senti enamorado de ti. Fue el dia que le dije a tus papás si me daban la oportunidad de salir contigo. ❤️" },
    { img: "19-ago.jpg", title: "2025-08-19", story: "Un dia entrenando boxeo, me senti muy seguro y a la vez muy feliz de estar compartiendo algo que a los dos nos gusta hacer. ❤️" },
    { img: "30-ago.jpg", title: "2025-08-30", story: "Una de las citas que igual como las demas fue diferente ya que fuimos a jugar a las maquinitas, y para finalizar el dia hicimos un lego con nuestras iniciales y las plantas de Plants vs Zombies. ❤️" },
    { img: "18-sep.jpg", title: "2025-09-18", story: "Unos dias antes de que te pidiera, estabamos en el tec con todos, ya todos sabian como te iba a pedir pero nadie sabia en que momento, fue muy bonito estar ahi los dos juntos mientras pasabamos tiempo con nuestros amigos. ❤️" },
    { img: "20-sep.jpg", title: "2025-09-20", story: "Es el dia mas especial de mi vida, el dia en que te pedia y me dijiste que si. Fue el dia en que me di cuenta que era lo mas bonito del mundo tenerte a mi lado. Este dia estaba muy nervioso ya que queria que todo pasara a la perfeccion, llevaba tiempo planeando el como te iba a pedir y no queria que fuera algo muy comun o que ya te lo esperaras, por eso mismo estaba planeandolo con mucho tiempo de anticipacion. ❤️" },
    { img: "26-nov.JPG", title: "2025-11-26", story: "Muy chistosa la foto cargando nuestro primer proyecto juntos, trabajamos muy bien en equipo y se que fuera de equipo de trabajos de la escuela, nos entendemos muy bien en sentido de trabajo en equipo para poder lograr cualquier cosa que nos propongamos. ❤️" },
    { img: "3-dec.jpg", title: "2025-12-03", story: "El dia en el que compartimos un gusto que tenemos los dos, este dia me encanto compartirlo contigo ya que es algo que llevaba viendo desde la infancia luego compartirlo contigo, con alguien muy especial en mi vida. Simplemente me encanto el dia que pasamos juntos ❤️" },
    { img: "19-dec.JPG", title: "2025-12-19", story: "Un dia antes de que cumplieramos 3 meses de estar en una relacion, simplemente me encanta todo lo que pasamos juntos sin importar que. ❤️" },
    { img: "10-enero.jpg", title: "2026-01-10", story: "otra foto donde salimos y esta ves fue con mis papás, el estar conviviendo todos juntos, me lleno mucho de alegria, el pasar momentos todos juntos fue muy muy bonito. ❤️" },
    { img: "28-enero.jpg", title: "2026-01-28", story: "Aqui el dia en el que fuimos staff de algo que nos encanta a los dos que es los videojuegos. ❤️" },
    { img: "1-feb.jpg", title: "2026-02-01", story: "Donde nos pusieron a estar detras de una camara, a ser cosas que a lo mejor nunca habiamos hecho, me llena de orgullo ver como sigues creciendo como persona y ver que poco a poco vas cumpliendo tus metas. ❤️" },
];


/* ===== REFERENCIAS DOM ===== */
const lockScreen = document.getElementById("lock-screen");
const carouselScreen = document.getElementById("carousel-screen");
const lockContainer = document.getElementById("lock-container");
const lockShackle = document.getElementById("lock-shackle");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const carouselWheel = document.getElementById("carousel-wheel");

/* ===== VARIABLES GLOBALES - ROTACIÓN CON RUEDA ===== */
let currentRotation = 0;
let targetRotation = 0;
let rafId = null;

/* ============================================
SECCIÓN CANDADO - VALIDACIÓN Y ANIMACIÓN
   ============================================ */

/**
 * Valida la contraseña ingresada
 * @param {string} input - Texto ingresado por el usuario
 * @returns {boolean} - true si es correcta
 */
function validatePassword(input) {
    return input.trim() === PASSWORD;
}

/**
 * Ejecuta animación de sacudida cuando la contraseña es incorrecta
 */
function shakeLock() {
    lockContainer.classList.add("shake");
    setTimeout(() => {
        lockContainer.classList.remove("shake");
    }, 500);
}

/**
 * Ejecuta la secuencia de desbloqueo:
 * 1. Animar apertura del arco
 * 2. Fade out del candado
 * 3. Fade in de la ruleta
 */
function unlockSequence() {
    /* Paso 1: Animación de apertura del arco */
    lockContainer.classList.add("unlocked");

    /* Paso 2: Esperar a que termine la animación del arco, luego fade out */
    setTimeout(() => {
        lockScreen.classList.add("hidden");
        initCarousel();
        initScrollRotation();
    }, 600);

    /* Paso 3: Mostrar ruleta con fade in y bloquear scroll de página */
    setTimeout(() => {
        carouselScreen.classList.add("visible");
        document.body.style.overflow = "hidden";
        startHearts();
    }, 800);
}

/**
 * Manejador del formulario de contraseña
 */
function handlePasswordSubmit(e) {
    e.preventDefault();
    const input = passwordInput.value.trim();

    if (validatePassword(input)) {
        unlockSequence();
    } else {
        shakeLock();
        passwordInput.value = "";
        passwordInput.focus();
    }
}

/* Event listener del formulario */
passwordForm.addEventListener("submit", handlePasswordSubmit);

/* ============================================
EFECTO CORAZONES CAYENDO
   ============================================ */
/**
 * Activa el efecto de corazones cayendo desde la parte superior.
 * Llamar manualmente cuando se desee (ej: después de contraseña correcta).
 */
function startHearts() {
    const container = document.getElementById("hearts-container");
    if (!container) return;

    const heartSvg = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

    const createHeart = () => {
        const heart = document.createElement("div");
        heart.className = "heart";
        heart.innerHTML = heartSvg;

        heart.style.left = Math.random() * 100 + "%";
        heart.style.width = (14 + Math.random() * 18) + "px";
        heart.style.animationDuration = (10 + Math.random() * 8) + "s";
        heart.style.animationDelay = Math.random() * 2 + "s";
        heart.style.animationName = "heartFall";
        heart.style.animationTimingFunction = "linear";
        heart.style.animationFillMode = "forwards";

        container.appendChild(heart);

        heart.addEventListener("animationend", () => heart.remove());
    };

    createHeart();
    const intervalId = setInterval(createHeart, 1200);

    /* Exponer para poder detener: window.stopHearts = () => clearInterval(intervalId) */
    window._heartsIntervalId = intervalId;
}

/* ============================================
RULETA DE FOTOS - CONSTRUCCIÓN DINÁMICA
   ============================================ */

/**
 * Construye la ruleta circular con las fotos
 * Usa transform: rotate() y translate() para distribución circular
 */
function initCarousel() {
    const photoCount = photoData.length;
    const angleStep = 360 / photoCount;
    const radius = window.innerWidth <= 600 ? 160 : 280;

    photoData.forEach((photo, index) => {
        const angle = angleStep * index;
        const photoEl = document.createElement("div");
        photoEl.className = "carousel-photo";
        photoEl.dataset.index = index;
        photoEl.dataset.angle = angle;
        photoEl.dataset.radius = radius;

        const img = document.createElement("img");
        img.src = photo.img;
        img.alt = `Foto ${index + 1}`;

        photoEl.appendChild(img);

        photoEl.addEventListener("click", () => openOverlay(index));

        carouselWheel.appendChild(photoEl);
    });

    /* Aplicar posición inicial (smoothRotate la mantendrá con parallax) */
    updatePhotoTransforms();
}

/**
 * Actualiza el transform de cada foto con efecto parallax
 */
function updatePhotoTransforms() {
    const photos = carouselWheel.querySelectorAll(".carousel-photo");
    const drift = -currentRotation * photoParallaxFactor;
    photos.forEach((photo) => {
        const angle = parseFloat(photo.dataset.angle);
        const radius = parseFloat(photo.dataset.radius);
        if (!isNaN(angle) && !isNaN(radius)) {
            photo.style.transform = `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg) rotate(${drift}deg)`;
        }
    });
}

/* ============================================
SISTEMA DE ROTACIÓN CON RUEDA DEL MOUSE
   ============================================ */
/* La página NO hace scroll - solo la ruleta gira con wheel/touch */

const wheelSensitivity = 0.04; /* Grados por deltaY - más bajo = movimiento más lento */

/**
 * Actualiza la rotación según la rueda del mouse
 * Wheel down → rotación horaria (positiva)
 * Wheel up → rotación antihoraria (negativa)
 */
function handleWheel(e) {
    /* No rotar si hay overlay abierto */
    if (document.querySelector(".photo-overlay.active")) return;

    targetRotation += e.deltaY * wheelSensitivity;
    e.preventDefault();
}

/* Parallax leve: las fotos se mueven un poco independiente del carrusel */
const photoParallaxFactor = 1; /* 0 = rígidas, mayor = más movimiento independiente */

/**
 * Interpola suavemente hacia la rotación objetivo
 * Aplica efecto parallax a cada foto (se mueven levemente, no rígidas)
 */
function smoothRotate() {
    const friction = 0.92;
    const minDelta = 0.5;

    currentRotation += (targetRotation - currentRotation) * (1 - friction);

    if (Math.abs(targetRotation - currentRotation) > minDelta) {
        currentRotation += (targetRotation - currentRotation) * 0.15;
    }

    carouselWheel.style.transform = `rotate(${currentRotation}deg)`;
    updatePhotoTransforms();

    rafId = requestAnimationFrame(smoothRotate);
}

/**
 * Inicializa la rotación con rueda del mouse (sin scroll de página)
 */
function initScrollRotation() {
    carouselScreen.addEventListener("wheel", handleWheel, { passive: false });
    smoothRotate();
}

/* ============================================
OVERLAYS - VISOR DE FOTOS AMPLIADO
   ============================================ */

/**
 * Abre el overlay mostrando la foto seleccionada
 * @param {number} index - Índice de la foto en el array
 */
function openOverlay(index) {
    const photo = photoData[index];
    if (!photo) return;

    let overlay = document.getElementById("dynamic-overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "dynamic-overlay";
        overlay.className = "photo-overlay";
        overlay.innerHTML = `
            <div class="overlay-content">
                <img class="overlay-image" src="" alt="Foto especial">
                <div class="overlay-story">
                    <h3></h3>
                    <p class="editable-text"></p>
                </div>
                <button class="overlay-back-btn">Volver a la ruleta</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeOverlay();
        });
        overlay.querySelector(".overlay-back-btn").addEventListener("click", closeOverlay);
    }

    overlay.querySelector(".overlay-image").src = photo.img;
    overlay.querySelector(".overlay-story h3").textContent = photo.title;
    overlay.querySelector(".overlay-story .editable-text").textContent = photo.story;
    overlay.classList.add("active");
}


/**
 * Cierra el overlay activo
 */
function closeOverlay() {
    const activeOverlay = document.querySelector(".photo-overlay.active");
    if (activeOverlay) {
        activeOverlay.classList.remove("active");
        document.body.style.overflow = "hidden"; /* Mantener bloqueado (estamos en carrusel) */
    }
}

/**
 * Inicializa los event listeners de los overlays
 */
function initOverlays() {
    document.querySelectorAll(".overlay-back-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeOverlay();
        });
    });

    /* Cerrar al hacer clic fuera del contenido */
    document.querySelectorAll(".photo-overlay").forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeOverlay();
            }
        });
    });

    /* Cerrar con tecla Escape */
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeOverlay();
        }
    });
}

/* Inicializar overlays al cargar (se ejecutan al hacer clic en fotos después del unlock) */
initOverlays();
