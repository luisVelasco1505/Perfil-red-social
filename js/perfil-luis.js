/*
 * perfil-luis.js
 * ------------------------------------------------------------
 * Script principal del perfil de Luis.
 * Contiene tres modulos:
 * 1) Carga de fotos desde la carpeta /fotos
 * 2) Creacion dinamica de publicaciones
 * 3) Edicion de informacion del perfil
 * 4) Acciones de amigos (agregar/eliminar)
 * 5) Navegacion por secciones tipo "tabs" (sin scroll por anclas)
 */

/**
 * Gestiona la seccion "Informacion":
 * - Muestra datos tipo red social
 * - Permite editar campos con un formulario
 * - Guarda cambios en localStorage
 */
(function setupEditableProfileInfo() {
    // Clave unica para persistir esta seccion en el navegador.
    const storageKey = "perfilLuisInfo";
    const infoForm = document.getElementById("info-form");
    const editBtn = document.getElementById("edit-profile-info");
    const cancelBtn = document.getElementById("cancel-profile-info");
    const infoCard = document.getElementById("informacion");
    if (!infoForm || !editBtn || !cancelBtn || !infoCard) return;

    // Valores iniciales del perfil. Se usan como respaldo si localStorage falla o esta vacio.
    const defaults = {
        fullName: "Luis Velasco",
        bio: "Disenador de interiores y estudiante de ingenieria de software.",
        currentCity: "Bogota, Colombia",
        hometown: "Neiva, Huila",
        birthDate: "6 de diciembre de 1997",
        relationship: "Soltero",
        job: "Disenador de interiores",
        education: "Universidad Manuela Beltran",
        email: "luis.velasco@email.com",
        phone: "+57 300 000 0000",
        website: "https://miportafolio.com",
        languages: "Espanol, Ingles",
        joinedDate: "Marzo 2022"
    };

    function loadData() {
        try {
            const saved = localStorage.getItem(storageKey);
            if (!saved) return { ...defaults };
            return { ...defaults, ...JSON.parse(saved) };
        } catch (error) {
            return { ...defaults };
        }
    }

    function saveData(data) {
        // Guardado simple en JSON para permitir rehidratacion al recargar la pagina.
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    function renderData(data) {
        // Sincroniza el contenido visible (spans con data-info-key) con el objeto data.
        const fields = infoCard.querySelectorAll("[data-info-key]");
        fields.forEach((field) => {
            const key = field.getAttribute("data-info-key");
            if (!key) return;
            field.textContent = data[key] || "";
        });
    }

    function fillForm(data) {
        // Precarga el formulario con los valores actuales antes de editar.
        Object.keys(defaults).forEach((key) => {
            const input = infoForm.elements.namedItem(key);
            if (!input) return;
            input.value = data[key] || "";
        });
    }

    function getFormData() {
        // Construye el objeto final que se guardara/renderizara.
        const data = {};
        Object.keys(defaults).forEach((key) => {
            const input = infoForm.elements.namedItem(key);
            data[key] = input ? input.value.trim() : "";
        });
        return data;
    }

    let currentData = loadData();
    renderData(currentData);

    // Mostrar formulario de edicion.
    editBtn.addEventListener("click", () => {
        fillForm(currentData);
        infoForm.classList.remove("hidden");
        const firstInput = infoForm.elements.namedItem("fullName");
        if (firstInput) firstInput.focus();
    });

    // Cerrar formulario sin aplicar cambios.
    cancelBtn.addEventListener("click", () => {
        infoForm.classList.add("hidden");
    });

    // Guardar cambios del formulario y actualizar la vista.
    infoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        currentData = getFormData();
        saveData(currentData);
        renderData(currentData);
        infoForm.classList.add("hidden");
    });
})();

/**
 * Gestiona los botones de la seccion "Amigos":
 * - Agregar a amigos: alterna estado visual del boton
 * - Eliminar: quita la tarjeta del amigo con confirmacion
 */
(function setupFriendActions() {
    const friendsSection = document.getElementById("amigos");
    const friendsList = friendsSection ? friendsSection.querySelector(".friends-list") : null;
    if (!friendsSection || !friendsList) return;

    function ensureEmptyState() {
        // Si no quedan tarjetas, muestra mensaje de estado vacio.
        const cards = friendsList.querySelectorAll(".friend-card");
        const existingEmpty = friendsSection.querySelector(".friends-empty");

        if (cards.length === 0 && !existingEmpty) {
            const empty = document.createElement("p");
            empty.className = "friends-empty";
            empty.textContent = "No hay sugerencias de amigos por ahora.";
            friendsSection.appendChild(empty);
        } else if (cards.length > 0 && existingEmpty) {
            existingEmpty.remove();
        }
    }

    // Delegacion de eventos: un solo listener para todos los botones de amigos.
    friendsList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement)) return;

        const card = target.closest(".friend-card");
        if (!card) return;

        // Boton: Agregar a amigos (toggle de estado visual)
        if (target.classList.contains("primary")) {
            const isAdded = target.classList.contains("is-added");
            if (isAdded) {
                target.classList.remove("is-added");
                target.textContent = "Agregar a amigos";
            } else {
                target.classList.add("is-added");
                target.textContent = "Solicitud enviada";
            }
            return;
        }

        // Boton: Eliminar amigo sugerido (eliminacion de tarjeta)
        if (target.classList.contains("danger")) {
            const friendNameEl = card.querySelector(".friend-name");
            const friendName = friendNameEl ? friendNameEl.textContent : "este amigo";
            const confirmed = window.confirm(`¿Eliminar a ${friendName} de la lista de amigos?`);
            if (!confirmed) return;

            card.remove();
            ensureEmptyState();
        }
    });
})();

/**
 * Carga las imagenes disponibles dentro de ../fotos/
 * y las pinta en #photos-grid.
 *
 * Nota:
 * Esta tecnica depende de que el servidor permita listar directorios.
 * Si no lo permite, mostramos un mensaje de ayuda.
 */
(function loadPhotosSection() {
    const grid = document.getElementById("photos-grid");
    const addMediaBtn = document.getElementById("add-media-btn");
    const addMediaInput = document.getElementById("add-media-input");
    const mediaModal = document.getElementById("media-modal");
    const mediaViewer = document.getElementById("media-viewer");
    const mediaCloseBtn = document.getElementById("media-close-btn");
    const mediaDeleteBtn = document.getElementById("media-delete-btn");
    if (!grid || !addMediaBtn || !addMediaInput || !mediaModal || !mediaViewer || !mediaCloseBtn || !mediaDeleteBtn) return;

    // Extensiones soportadas para carga automatica desde carpeta.
    const imageExt = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
    const videoExt = /\.(mp4|webm|ogg|mov)$/i;
    let currentMediaElement = null;

    function removeEmptyMessage() {
        // Limpia el mensaje vacio cuando se agrega al menos un medio.
        const empty = grid.querySelector(".photos-empty");
        if (empty) empty.remove();
    }

    function ensureEmptyMessage() {
        // Recompone estado vacio cuando se eliminan todos los medios.
        const mediaCount = grid.querySelectorAll("img, video").length;
        const empty = grid.querySelector(".photos-empty");
        if (mediaCount === 0 && !empty) {
            grid.innerHTML = '<p class="photos-empty">Aun no hay fotos en la carpeta /fotos.</p>';
        }
    }

    function appendImage(src, altText) {
        // Inserta imagen en la grilla principal.
        const img = document.createElement("img");
        img.src = src;
        img.alt = altText;
        img.loading = "lazy";
        grid.appendChild(img);
    }

    function appendVideo(src) {
        // Inserta video en la grilla principal.
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.preload = "metadata";
        grid.appendChild(video);
    }

    function closeModal() {
        // Cierra visor y libera referencia del elemento activo.
        mediaModal.classList.add("hidden");
        mediaViewer.innerHTML = "";
        currentMediaElement = null;
    }

    function openModalFromMedia(element) {
        // Duplica el elemento (img/video) en el visor para mostrarlo en gran formato.
        currentMediaElement = element;
        mediaViewer.innerHTML = "";

        if (element.tagName.toLowerCase() === "video") {
            const video = document.createElement("video");
            video.src = element.currentSrc || element.src;
            video.controls = true;
            video.autoplay = true;
            mediaViewer.appendChild(video);
        } else {
            const img = document.createElement("img");
            img.src = element.currentSrc || element.src;
            img.alt = element.alt || "Vista ampliada";
            mediaViewer.appendChild(img);
        }

        mediaModal.classList.remove("hidden");
    }

    async function renderPhotos() {
        // Intento de carga automatica desde listado de directorio.
        // Dependiente del servidor: puede fallar en algunos entornos.
        try {
            const response = await fetch("../fotos/");
            if (!response.ok) throw new Error("No se pudo leer la carpeta.");

            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const links = Array.from(doc.querySelectorAll("a[href]"));

            const mediaFiles = links
                .map((link) => link.getAttribute("href"))
                .filter((href) => href && !href.startsWith("?") && (imageExt.test(href) || videoExt.test(href)))
                .map((href) => {
                    const fileName = href.split("/").pop();
                    return `../fotos/${fileName}`;
                });

            if (!mediaFiles.length) {
                grid.innerHTML = '<p class="photos-empty">Aun no hay fotos en la carpeta /fotos.</p>';
                return;
            }

            mediaFiles.forEach((src, index) => {
                if (videoExt.test(src)) {
                    appendVideo(src);
                } else {
                    appendImage(src, `Foto ${index + 1}`);
                }
            });
        } catch (error) {
            grid.innerHTML =
                '<p class="photos-empty">No fue posible listar automaticamente la carpeta. Abre el proyecto con Live Server.</p>';
        }
    }

    // Abre explorador de archivos del sistema.
    addMediaBtn.addEventListener("click", () => {
        addMediaInput.click();
    });

    addMediaInput.addEventListener("change", () => {
        // Previsualiza archivos seleccionados (no persiste fisicamente en disco).
        const files = Array.from(addMediaInput.files || []);
        if (!files.length) return;

        removeEmptyMessage();

        files.forEach((file) => {
            const fileUrl = URL.createObjectURL(file);

            if (file.type.startsWith("video/")) {
                appendVideo(fileUrl);
            } else if (file.type.startsWith("image/")) {
                appendImage(fileUrl, file.name || "Nueva foto");
            }
        });

        addMediaInput.value = "";
    });

    // Click sobre miniatura para abrir modal.
    grid.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const media = target.closest("img, video");
        if (!(media instanceof HTMLImageElement || media instanceof HTMLVideoElement)) return;

        openModalFromMedia(media);
    });

    // Cierre explicito con boton X.
    mediaCloseBtn.addEventListener("click", closeModal);

    mediaModal.addEventListener("click", (event) => {
        // Cierre al hacer click en backdrop.
        if (event.target === mediaModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        // Cierre rapido con Escape.
        if (event.key === "Escape" && !mediaModal.classList.contains("hidden")) {
            closeModal();
        }
    });

    mediaDeleteBtn.addEventListener("click", () => {
        // Elimina el medio actualmente abierto en el modal.
        if (!currentMediaElement) return;

        const src = currentMediaElement.currentSrc || currentMediaElement.src || "";
        currentMediaElement.remove();
        closeModal();
        ensureEmptyMessage();

        // Libera object URL para evitar fugas de memoria con archivos locales.
        if (src.startsWith("blob:")) {
            URL.revokeObjectURL(src);
        }
    });

    renderPhotos();
})();

/**
 * Gestiona el formulario de publicaciones:
 * - Muestra boton "Publicar nueva historia" debajo de cada post.
 * - Abre el formulario al hacer clic.
 * - Inserta la nueva publicacion con el mismo formato visual.
 */
(function setupPublicationForm() {
    const form = document.getElementById("publication-form");
    const list = document.querySelector(".publications-list");
    if (!form || !list) return;

    // Referencias de campos del formulario de publicaciones.
    const textInput = document.getElementById("publication-text");
    const timeInput = document.getElementById("publication-time");
    const imageFileInput = document.getElementById("publication-image-file");

    // Referencia a la publicacion despues de la cual insertaremos la nueva historia.
    let targetInsertAfter = null;

    /**
     * Crea/actualiza el boton "Publicar nueva historia"
     * despues de cada publication-item.
     */
    function addCreateStoryButtons() {
        // Rebuild de botones dinamicos para evitar duplicados tras cada insercion.
        list.querySelectorAll(".create-story-row").forEach((row) => row.remove());

        const publications = list.querySelectorAll(".publication-item");
        publications.forEach((publication) => {
            const row = document.createElement("div");
            row.className = "create-story-row";

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "open-publication-form";
            btn.textContent = "Publicar nueva historia";
            btn.addEventListener("click", () => {
                targetInsertAfter = publication;
                form.classList.remove("hidden");
                textInput.focus();
                form.scrollIntoView({ behavior: "smooth", block: "center" });
            });

            row.appendChild(btn);
            publication.insertAdjacentElement("afterend", row);
        });
    }

    addCreateStoryButtons();

    // Alta de nueva publicacion en UI.
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const text = textInput.value.trim();
        const time = timeInput.value.trim() || "Ahora";
        const imageFile = imageFileInput.files[0];

        // El contenido de texto es obligatorio.
        if (!text) return;

        const article = document.createElement("article");
        article.className = "publication-item";

        // Header de la publicacion (avatar + nombre + tiempo)
        const header = document.createElement("div");
        header.className = "post-header";

        const avatar = document.createElement("img");
        avatar.className = "post-avatar";
        avatar.src = "../img/foto-perfil.png.png";
        avatar.alt = "Avatar de Luis Velasco";

        const user = document.createElement("div");
        user.className = "post-user";

        const name = document.createElement("h4");
        name.textContent = "Luis Velasco";

        const timeTag = document.createElement("span");
        timeTag.textContent = time;

        user.appendChild(name);
        user.appendChild(timeTag);
        header.appendChild(avatar);
        header.appendChild(user);

        // Cuerpo de texto
        const textBlock = document.createElement("div");
        textBlock.className = "post-text";
        const textP = document.createElement("p");
        textP.textContent = text;
        textBlock.appendChild(textP);

        article.appendChild(header);
        article.appendChild(textBlock);

        // Imagen opcional elegida desde el dispositivo
        // Imagen opcional de la publicacion.
        if (imageFile) {
            const imageBlock = document.createElement("div");
            imageBlock.className = "post-image";
            const postImage = document.createElement("img");
            postImage.src = URL.createObjectURL(imageFile);
            postImage.alt = "Nueva publicacion";
            imageBlock.appendChild(postImage);
            article.appendChild(imageBlock);
        }

        // Botones de interaccion
        const actions = document.createElement("div");
        actions.className = "post-actions";

        ["Me gusta", "Comentar", "Compartir"].forEach((label) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = label;
            actions.appendChild(btn);
        });

        article.appendChild(actions);

        // Inserta despues de la publicacion seleccionada o al inicio por defecto.
        // Insercion contextual: despues del post elegido o al inicio.
        if (targetInsertAfter && targetInsertAfter.parentElement === list) {
            targetInsertAfter.insertAdjacentElement("afterend", article);
        } else {
            list.prepend(article);
        }

        // Limpieza del formulario y regeneracion de botones auxiliares.
        form.reset();
        form.classList.add("hidden");
        targetInsertAfter = null;
        addCreateStoryButtons();
        textInput.focus();
    });
})();

/**
 * Convierte el menu superior en "tabs":
 * - Evita navegar por anclas
 * - Muestra solo la seccion seleccionada
 * - Marca visualmente el tab activo
 */
(function setupSectionTabs() {
    // Enlaces del menu superior convertidos a comportamiento tipo "tabs".
    const menuLinks = document.querySelectorAll('.menu-items a[href^="#"]');
    const contentContainer = document.querySelector(".content-container");
    const leftPanel = document.querySelector(".profile-left");
    const rightColumn = document.querySelector(".profile-right");

    const sections = {
        informacion: document.getElementById("informacion"),
        amigos: document.getElementById("amigos"),
        fotos: document.getElementById("fotos"),
        publicaciones: document.getElementById("publicaciones")
    };

    function showSection(sectionId) {
        // Muestra la seccion activa y oculta las demas.
        Object.entries(sections).forEach(([key, element]) => {
            if (!element) return;
            element.classList.toggle("section-hidden", key !== sectionId);
        });

        // Estado visual del tab activo.
        menuLinks.forEach((link) => {
            const li = link.closest("li");
            if (!li) return;
            li.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
        });

        // Fuerza layout de una sola columna durante la navegacion por tabs.
        if (contentContainer) {
            contentContainer.classList.add("single-panel");
        }

        // Informacion vive en la columna izquierda.
        // Las otras secciones viven dentro de la columna derecha.
        if (sectionId === "informacion") {
            if (leftPanel) leftPanel.classList.remove("section-hidden");
            if (rightColumn) rightColumn.classList.add("section-hidden");
        } else {
            if (leftPanel) leftPanel.classList.add("section-hidden");
            if (rightColumn) rightColumn.classList.remove("section-hidden");
        }
    }

    menuLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").replace("#", "");
            showSection(targetId);
        });
    });

    // Vista inicial por defecto.
    showSection("informacion");
})();
