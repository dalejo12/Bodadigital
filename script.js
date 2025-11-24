// ===================================
// 1. INGRESO AL SITIO
// ===================================

function enterSite() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    // Música desactivada según solicitud
}


// ===================================
// 2. CONTADOR REGRESIVO
// ===================================

// Fecha de la boda: 21 de febrero de 2026, 5:00 PM (17:00:00)
// La zona horaria no afecta la función getTime(), pero se usa en el agendamiento.
const weddingDate = new Date("Feb 21, 2026 17:00:00").getTime();

const countdownFunction = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Actualiza los elementos HTML
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
    
    // URL de Envío de Google Forms (CORREGIDA a /formResponse)
    // ID del Formulario: 1FAIpQLSdaknnJOn8dhcNYQmf5uk9wYvXVrTeF_793PhdjdvFfjRACUA
    const RSVP_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdaknnJOn8dhcNYQmf5uk9wYvXVrTeF_793PhdjdvFfjRACUA/formResponse";
    
    // Se elimina la funcionalidad de Sugerir Canción

    function handleFormSubmit(formId, successMessageId, googleFormUrl) {
        const form = document.getElementById(formId);
        const messageDisplay = document.getElementById(successMessageId);

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Desactiva el botón de envío temporalmente
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            const formData = new FormData(form);
            const params = new URLSearchParams();

            // Construye los parámetros usando los nombres de campo de Google (entry.XXXXX)
            for (let [name, value] of formData.entries()) {
                params.append(name, value);
            }

            try {
                // Envío con POST a la URL de respuesta
                const response = await fetch(googleFormUrl, {
                    method: 'POST',
                    mode: 'no-cors', 
                    body: params
                });

                messageDisplay.textContent = '✅ ¡Confirmación enviada con éxito! Gracias.';
                form.reset();
                
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                messageDisplay.textContent = '❌ Hubo un error al enviar. Intenta de nuevo.';
            } finally {
                // Restaura el botón después de unos segundos
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar Confirmación';
                }, 3000);
            }
        });
    }

    // Inicializar el manejo del formulario de RSVP
    handleFormSubmit('rsvp-form', 'rsvp-message', RSVP_FORM_URL);

});