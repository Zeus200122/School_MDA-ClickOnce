console.log("AXON iniciado correctamente.");

// ============================================================
// MENÚ MÓVIL
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("header.navbar nav");

    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            nav.classList.toggle("open");
        });

        // Cierra el menú al tocar cualquier link (útil en móvil)
        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("open");
            });
        });
    }

    // ============================================================
    // PRELLENAR "PRODUCTO DE INTERÉS" SEGÚN DE DÓNDE VENGA EL VISITANTE
    // Ej: school-mda.html enlaza a index.html#contacto?producto=School%20MDA
    // ============================================================

    const params = new URLSearchParams(window.location.search);
    const producto = params.get("producto");
    const tipo = params.get("tipo");

    if (producto) {
        const selectProducto = document.querySelector('[name="producto"]');
        if (selectProducto) {
            const opcionExiste = Array.from(selectProducto.options)
                .some(function (o) { return o.value === producto; });

            if (opcionExiste) selectProducto.value = producto;
        }
    }

    if (tipo) {
        const selectTipo = document.querySelector('[name="tipo_consulta"]');
        if (selectTipo) {
            const opcionExiste = Array.from(selectTipo.options)
                .some(function (o) { return o.value === tipo; });

            if (opcionExiste) selectTipo.value = tipo;
        }
    }

    if ((producto || tipo) && window.location.hash === "#contacto") {
        const seccionContacto = document.getElementById("contacto");
        if (seccionContacto) {
            seccionContacto.scrollIntoView({ behavior: "smooth" });
        }
    }

    // ============================================================
    // ENVÍO DEL FORMULARIO DE CONTACTO (Formspree, vía fetch)
    // ============================================================

    document.querySelectorAll("form.contact-form").forEach(function (form) {

        const status = form.querySelector(".form-status");
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            status.className = "form-status sending show";
            status.textContent = "Enviando tu mensaje...";
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: new FormData(form),
                    headers: { "Accept": "application/json" }
                });

                if (response.ok) {
                    status.className = "form-status success show";
                    status.textContent =
                        "¡Mensaje enviado! Te responderemos lo antes posible.";
                    form.reset();
                } else {
                    const data = await response.json().catch(function () { return null; });

                    const mensajeError =
                        data && data.errors
                            ? data.errors.map(function (err) { return err.message; }).join(", ")
                            : "Ocurrió un error al enviar el mensaje. Intenta de nuevo.";

                    status.className = "form-status error show";
                    status.textContent = mensajeError;
                }
            } catch (err) {
                status.className = "form-status error show";
                status.textContent =
                    "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.";
            } finally {
                submitBtn.disabled = false;
            }
        });
    });

});
