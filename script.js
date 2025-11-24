// ===================================
// 1. INGRESO AL SITIO (Pantalla de Bienvenida)
// ===================================

function enterSite() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    // Opcional: Si tienes música de fondo, actívala aquí
    // document.getElementById('music-player').play();
}


// ===================================
// 2. CONTADOR REGRESIVO
// ===================================

// Establece la fecha de la boda (AÑO, MES (0=Enero), DÍA, HORA)
const weddingDate = new Date("Feb 21, 2026 17:00:00").getTime();

const countdownFunction = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Asegura que los números tengan 2 dígitos (ej: 05)
    document.getElementById("days").innerHTML = String(days).padStart(2, '0');
    document.getElementById("hours").innerHTML = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerHTML = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerHTML = String(seconds).padStart(2, '0');

    // Cuando el contador termina
    if (distance < 0) {
        clearInterval(countdownFunction);
        document.getElementById("countdown").innerHTML = "¡ES HOY!";
    }
}, 1000);


// ===================================
// 3. FUNCIONALIDAD DE MODALES (Pop-ups)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Escucha clics en todos los botones que abren modales
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            document.getElementById(`modal-${modalId}`).style.display = 'block';
        });
    });

    // Escucha clics en los botones de cerrar y fuera del modal
    document.querySelectorAll('.close-btn').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            closeButton.closest('.modal').style.display = 'none';
        });
    });

    // Cierra el modal si el usuario hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // ===================================
    // 4. ENVÍO DE FORMULARIOS A GOOGLE FORMS
    // ===================================
    
    // Función genérica para manejar el envío
    function handleFormSubmit(formId, successMessageId, googleFormUrl) {
        const form = document.getElementById(formId);
        const messageDisplay = document.getElementById(successMessageId);

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Desactiva el botón de envío temporalmente
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            // Recolectar datos del formulario
            const formData = new FormData(form);
            const params = new URLSearchParams();

            // Construye los parámetros usando los nombres de campo de Google (entry.XXXXX)
            for (let [name, value] of formData.entries()) {
                // Si es un radio button de asistencia, solo enviar el valor si está marcado
                if (formId === 'rsvp-form' && name.startsWith('entry.') && value !== 'Si asisto' && value !== 'No asisto') {
                    // Ignora otros campos radio si no están marcados
                } else {
                    params.append(name, value);
                }
            }

            try {
                // El envío a Google Forms debe hacerse usando un POST request a la URL de respuesta
                const response = await fetch(googleFormUrl, {
                    method: 'POST',
                    mode: 'no-cors', // Necesario para evitar errores CORS en la respuesta, ya que Google Forms no devuelve JSON
                    body: params
                });

                // Aunque la respuesta es 'no-cors' y no se puede inspeccionar,
                // si el fetch se completa sin errores, asumimos éxito.

                messageDisplay.textContent = '✅ ¡Información enviada con éxito! Gracias.';
                form.reset();
                
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                messageDisplay.textContent = '❌ Hubo un error al enviar. Intenta de nuevo.';
            } finally {
                // Restaura el botón después de unos segundos
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = (formId === 'rsvp-form') ? 'Enviar Confirmación' : 'Sugerir';
                }, 3000);
            }
        });
    }

    // --- Configuración de las URLs de Google Forms ---
    // REEMPLAZA ESTAS URLs con la URL de ENVÍO de tu Google Form
    const RSVP_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdaknnJOn8dhcNYQmf5uk9wYvXVrTeF_793PhdjdvFfjRACUA/viewform";
    const SONG_FORM_URL = "https://music.youtube.com/search?q=everybody+wants+to+rule+the+world";
    
    handleFormSubmit('rsvp-form', 'rsvp-message', RSVP_FORM_URL);
    handleFormSubmit('song-form', 'song-message', SONG_FORM_URL);

});