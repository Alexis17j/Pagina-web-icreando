/* =====================================================
   CONFIGURACIÓN
===================================================== */

const WHATSAPP_NUMBER = "51999999999";


/* =====================================================
   ELEMENTOS
===================================================== */

const openSearch = document.getElementById("openSearch");
const closeSearch = document.getElementById("closeSearch");

const searchPanel = document.getElementById("searchPanel");

const searchInput = document.getElementById("searchInput");
const searchPanelInput = document.getElementById("searchPanelInput");

const searchResults = document.getElementById("searchResults");

const productsGrid = document.getElementById("productsGrid");
const resultsCount = document.getElementById("resultsCount");

const products = Array.from(
    document.querySelectorAll(".product-card")
);


/* =====================================================
   FUNCIÓN DE BÚSQUEDA
===================================================== */

function realizarBusqueda(texto) {

    texto = texto.toLowerCase().trim();

    searchResults.innerHTML = "";

    if (texto === "") {
        return;
    }

    const encontrados = products.filter(product => {

        const nombre =
            product.dataset.name
                ? product.dataset.name.toLowerCase()
                : "";

        const categoriaElement =
            product.querySelector(".product-category");

        const categoria =
            categoriaElement
                ? categoriaElement.textContent.toLowerCase()
                : "";

        return (
            nombre.includes(texto) ||
            categoria.includes(texto)
        );

    });


    /* SIN RESULTADOS */

    if (encontrados.length === 0) {

        searchResults.innerHTML = `
            <div class="no-results">

                <i class="fa-solid fa-face-frown"></i>

                <p>
                    No encontramos productos.
                </p>

                <small>
                    Prueba con otro nombre.
                </small>

            </div>
        `;

        return;
    }


    /* RESULTADOS */

    encontrados.forEach(product => {

        const imagen =
            product.querySelector("img");

        const nombre =
            product.dataset.name;

        const precio =
            product.dataset.price;

        const categoriaElement =
            product.querySelector(".product-category");

        const categoria =
            categoriaElement
                ? categoriaElement.textContent
                : "Producto";


        const resultado =
            document.createElement("div");

        resultado.className = "search-result";


        resultado.innerHTML = `

            <img
                src="${imagen.src}"
                alt="${nombre}"
            >

            <div class="search-result-info">

                <span>
                    ${categoria}
                </span>

                <h3>
                    ${nombre}
                </h3>

                <strong>
                    S/ ${precio}
                </strong>

            </div>

        `;


        resultado.addEventListener(
            "click",
            function () {

                searchPanel.classList.remove(
                    "active"
                );

                searchInput.value = "";

                searchPanelInput.value = "";

                searchResults.innerHTML = "";


                product.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                product.classList.add(
                    "search-highlight"
                );


                setTimeout(() => {

                    product.classList.remove(
                        "search-highlight"
                    );

                }, 2000);

            }
        );


        searchResults.appendChild(resultado);

    });

}


/* =====================================================
   ABRIR BUSCADOR
===================================================== */

if (openSearch) {

    openSearch.addEventListener(
        "click",
        function () {

            searchPanel.classList.add("active");

            setTimeout(() => {

                searchPanelInput.focus();

            }, 100);

        }
    );

}


/* =====================================================
   CERRAR BUSCADOR
===================================================== */

if (closeSearch) {

    closeSearch.addEventListener(
        "click",
        function () {

            searchPanel.classList.remove(
                "active"
            );

            searchInput.value = "";

            searchPanelInput.value = "";

            searchResults.innerHTML = "";

        }
    );

}


/* =====================================================
   BUSCADOR DEL HEADER
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            searchPanel.classList.add(
                "active"
            );

            searchPanelInput.value =
                this.value;

            realizarBusqueda(
                this.value
            );

        }
    );

}


/* =====================================================
   BUSCADOR DEL PANEL
===================================================== */

if (searchPanelInput) {

    searchPanelInput.addEventListener(
        "input",
        function () {

            searchInput.value =
                this.value;

            realizarBusqueda(
                this.value
            );

        }
    );

}


/* =====================================================
   CATEGORÍAS
===================================================== */

const categoryLinks =
    document.querySelectorAll(
        "[data-category]"
    );

const mainTitleElement =
    document.querySelector(".products-section h1");

const breadcrumbSpan =
    document.querySelector(".breadcrumb span");


categoryLinks.forEach(link => {

    link.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            const categoria =
                this.dataset.category;

            const nombreTexto =
                this.textContent.trim();


            /* 1. Filtrar productos */

            products.forEach(product => {

                if (
                    categoria === "all" ||
                    product.dataset.category === categoria
                ) {

                    product.classList.remove(
                        "hidden"
                    );

                } else {

                    product.classList.add(
                        "hidden"
                    );

                }

            });


            /* 2. Cambiar título y breadcrumb */

            if (mainTitleElement) mainTitleElement.textContent = nombreTexto;
            if (breadcrumbSpan) breadcrumbSpan.textContent = nombreTexto;


            /* 3. Actualizar contador de resultados */

            actualizarContador();


            /* 4. Bajar suavemente hacia la sección de productos */

            const productsSec =
                document.querySelector(".products-section");

            if (productsSec) {

                productsSec.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

});


/* =====================================================
   CONTADOR
===================================================== */

function actualizarContador() {

    const visibles =
        products.filter(
            product =>
                !product.classList.contains("hidden")
        );


    if (resultsCount) {

        resultsCount.textContent =
            `Mostrando 1–${visibles.length} de ${visibles.length} resultados`;

    }

}


actualizarContador();


/* =====================================================
   FILTRO DE PRECIO
===================================================== */

const minPrice =
    document.getElementById("minPrice");

const maxPrice =
    document.getElementById("maxPrice");

const filterPrice =
    document.getElementById("filterPrice");


if (filterPrice) {

    filterPrice.addEventListener(
        "click",
        function () {

            const minimo =
                parseFloat(minPrice.value) || 0;

            const maximo =
                parseFloat(maxPrice.value) || Infinity;


            products.forEach(product => {

                const precio =
                    parseFloat(
                        product.dataset.price
                    );


                if (
                    precio >= minimo &&
                    precio <= maximo
                ) {

                    product.classList.remove(
                        "hidden"
                    );

                } else {

                    product.classList.add(
                        "hidden"
                    );

                }

            });


            actualizarContador();

        }
    );

}


/* =====================================================
   ORDENAR PRODUCTOS
===================================================== */

const sortProducts =
    document.getElementById(
        "sortProducts"
    );


if (sortProducts) {

    sortProducts.addEventListener(
        "change",
        function () {

            const tipo =
                this.value;

            let ordenados =
                [...products];


            if (tipo === "price-low") {

                ordenados.sort(
                    (a, b) =>
                        Number(a.dataset.price) -
                        Number(b.dataset.price)
                );

            }


            if (tipo === "price-high") {

                ordenados.sort(
                    (a, b) =>
                        Number(b.dataset.price) -
                        Number(a.dataset.price)
                );

            }


            if (tipo === "name") {

                ordenados.sort(
                    (a, b) =>
                        a.dataset.name.localeCompare(
                            b.dataset.name
                        )
                );

            }


            ordenados.forEach(product => {

                productsGrid.appendChild(
                    product
                );

            });

        }
    );

}


/* =====================================================
   WHATSAPP
===================================================== */

function consultProduct(nombreProducto) {

    const mensaje =
        `Hola, quiero consultar sobre: ${nombreProducto}`;


    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;


    window.open(
        url,
        "_blank"
    );

}
/* =====================================================
   FUNCIONALIDAD DE VISTA PREVIA (MODAL)
===================================================== */

const quickViewModal = document.getElementById("quickViewModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModalOverlay = document.getElementById("closeModalOverlay");
const modalBodyContent = document.getElementById("modalBodyContent");

// Agregar el botón de vista previa a cada tarjeta de producto de forma automática
products.forEach(product => {
    const triggerBtn = document.createElement("button");
    triggerBtn.className = "quick-view-trigger";
    triggerBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Vista previa';
    
    triggerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirVistaPrevia(product);
    });

    product.appendChild(triggerBtn);
});

function abrirVistaPrevia(product) {
    const img = product.querySelector("img").src;
    const nombre = product.dataset.name;
    const precio = product.dataset.price;
    const categoria = product.querySelector(".product-category").textContent;

    modalBodyContent.innerHTML = `
        <img src="${img}" alt="${nombre}" class="modal-img">
        <div class="modal-info">
            <span style="font-size: 12px; color: #888; text-transform: uppercase;">${categoria}</span>
            <h2>${nombre}</h2>
            <div class="modal-price">S/ ${precio}</div>
            <p>Producto de alta calidad ideal para personalización y sublimación. Consulta disponibilidad y detalles adicionales.</p>
            <button class="modal-btn-whatsapp" onclick="consultProduct('${nombre}')">
                <i class="fa-brands fa-whatsapp"></i> Consultar por WhatsApp
            </button>
        </div>
    `;

    quickViewModal.classList.add("active");
}

// Cerrar modal
function cerrarModal() {
    quickViewModal.classList.remove("active");
}

if (closeModalBtn) closeModalBtn.addEventListener("click", cerrarModal);
if (closeModalOverlay) closeModalOverlay.addEventListener("click", cerrarModal);
/* =====================================================
   ACORDEÓN UNIFICADO PARA TODAS LAS FILAS LATERALES
===================================================== */
const categoryRows = document.querySelectorAll(".category-row-ref");

categoryRows.forEach(row => {
    row.addEventListener("click", function (e) {
        // Si hace clic directamente en el texto con categoría principal, dejamos que actúe el filtro
        if (e.target.classList.contains("category-main-click")) return;

        const parentLi = this.closest(".category-parent");
        if (!parentLi) return;

        parentLi.classList.toggle("open");
        
        const subList = parentLi.querySelector(".sub-category-list");
        if (!subList) return;

        if (parentLi.classList.contains("open")) {
            subList.style.display = "block";
            subList.style.maxHeight = "300px";
        } else {
            subList.style.maxHeight = "0";
            setTimeout(() => {
                if (!parentLi.classList.contains("open")) {
                    subList.style.display = "none";
                }
            }, 300);
        }
    });
});
/* =====================================================
   INTERCEPTOR DE CLIC ABSOLUTO (CAPTURADOR DE EMERGENCIA)
===================================================== */
document.querySelectorAll(".category-toggle").forEach(toggle => {
    toggle.addEventListener("click", function(e) {
        // Detiene el evento en la fase más temprana posible
        e.stopImmediatePropagation();
        e.preventDefault();

        // Congela la posición actual al milisegundo
        const scrollY = window.pageYOffset;

        const parentLi = this.closest(".category-parent");
        const subList = parentLi.querySelector(".sub-category-list");

        if (subList) {
            const isOpen = parentLi.classList.contains("open");
            if (isOpen) {
                subList.style.display = "none";
                parentLi.classList.remove("open");
            } else {
                subList.style.display = "block";
                parentLi.classList.add("open");
            }
        }

        // Restaura la posición por si el navegador intenta moverla
        window.scrollTo(0, scrollY);

    }, { capture: true }); // <--- Esto es clave: actúa antes que cualquier otro script
});
/* =====================================================
   REEL INFINITO - PC + CELULAR
   ARRRASTRAR CON MOUSE Y CON EL DEDO
===================================================== */

const reelSection = document.querySelector(".products-reel-section");
const reelTrack = document.querySelector(".reel-track");

let isDraggingReel = false;
let reelStartX = 0;
let reelCurrentX = 0;
let reelSpeed = 1.2;

if (reelSection && reelTrack) {

    /* =================================================
       DUPLICAR PRODUCTOS PARA CREAR EL BUCLE INFINITO
    ================================================= */

    const originalItems = Array.from(
        reelTrack.querySelectorAll(".reel-item")
    );

    for (let i = 0; i < 3; i++) {

        originalItems.forEach(item => {

            const clone = item.cloneNode(true);

            reelTrack.appendChild(clone);

        });

    }


    /* =================================================
       FUNCIÓN PARA MANTENER EL REEL INFINITO
    ================================================= */

    function comprobarBucleReel() {

        const primerItem =
            reelTrack.querySelector(".reel-item");

        if (!primerItem) return;

        const itemWidth =
            primerItem.offsetWidth;

        const gap =
            parseFloat(
                getComputedStyle(reelTrack).gap
            ) || 0;

        const grupoOriginal =
            (itemWidth + gap) *
            originalItems.length;


        /* AVANZANDO HACIA LA IZQUIERDA */

        if (Math.abs(reelCurrentX) >= grupoOriginal) {

            reelCurrentX += grupoOriginal;

        }


        /* RETROCEDIENDO HACIA LA DERECHA */

        if (reelCurrentX > 0) {

            reelCurrentX -= grupoOriginal;

        }

    }


    /* =================================================
       ACTUALIZAR POSICIÓN
    ================================================= */

    function actualizarReel() {

        comprobarBucleReel();

        reelTrack.style.transform =
            `translateX(${reelCurrentX}px)`;

    }


    /* =================================================
       MOVIMIENTO AUTOMÁTICO
    ================================================= */

    function moverReel() {

        if (!isDraggingReel) {

            reelCurrentX -= reelSpeed;

            actualizarReel();

        }

        requestAnimationFrame(moverReel);

    }


    /* =================================================
       MOUSE - PC
    ================================================= */

    reelSection.addEventListener(
        "mousedown",
        function(e) {

            isDraggingReel = true;

            reelStartX = e.clientX;

            reelSection.style.cursor = "grabbing";

            e.preventDefault();

        }
    );


    document.addEventListener(
        "mousemove",
        function(e) {

            if (!isDraggingReel) return;

            const movimiento =
                e.clientX - reelStartX;

            reelCurrentX += movimiento;

            reelStartX = e.clientX;

            actualizarReel();

        }
    );


    document.addEventListener(
        "mouseup",
        function() {

            if (!isDraggingReel) return;

            isDraggingReel = false;

            reelSection.style.cursor = "grab";

        }
    );


    /* =================================================
       CELULAR - TOUCH
    ================================================= */

    reelSection.addEventListener(
        "touchstart",
        function(e) {

            if (!e.touches || !e.touches.length) return;

            isDraggingReel = true;

            reelStartX =
                e.touches[0].clientX;

            reelSection.style.cursor = "grabbing";

        },
        { passive: true }
    );


    reelSection.addEventListener(
        "touchmove",
        function(e) {

            if (!isDraggingReel) return;

            if (!e.touches || !e.touches.length) return;

            const movimiento =
                e.touches[0].clientX - reelStartX;

            reelCurrentX += movimiento;

            reelStartX =
                e.touches[0].clientX;

            actualizarReel();

        },
        { passive: true }
    );


    reelSection.addEventListener(
        "touchend",
        function() {

            isDraggingReel = false;

            reelSection.style.cursor = "grab";

        },
        { passive: true }
    );


    /* =================================================
       SI EL DEDO SALE DEL REEL
    ================================================= */

    reelSection.addEventListener(
        "touchcancel",
        function() {

            isDraggingReel = false;

            reelSection.style.cursor = "grab";

        },
        { passive: true }
    );


    /* =================================================
       INICIAR
    ================================================= */

    reelSection.style.cursor = "grab";

    moverReel();

}
// =========================================================
// MENÚ HAMBURGUESA / PANEL LATERAL (CELULAR)
// =========================================================

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mainNav = document.getElementById("mainNav");
const menuOverlay = document.getElementById("menuOverlay");
const drawerClose = document.getElementById("drawerClose");
const drawerSearchForm = document.getElementById("drawerSearchForm");
const drawerSearchInput = document.getElementById("drawerSearchInput");

function isMobileMenu() {
    return window.innerWidth <= 768;
}

function setMobileMenu(open) {

    mainNav.classList.toggle("mobile-open", open);

    if (menuOverlay) menuOverlay.classList.toggle("active", open);

    document.body.classList.toggle("menu-open", open);

    const icon = mobileMenuBtn.querySelector("i");

    if (icon) {
        icon.classList.toggle("fa-xmark", open);
        icon.classList.toggle("fa-bars", !open);
    }

    /* Al cerrar, se pliegan los submenús */
    if (!open) {
        mainNav
            .querySelectorAll(".nav-dropdown.open")
            .forEach(item => item.classList.remove("open"));
    }
}

if (mobileMenuBtn && mainNav) {

    /* Abrir con la hamburguesa */
    mobileMenuBtn.addEventListener("click", () => {
        setMobileMenu(!mainNav.classList.contains("mobile-open"));
    });

    /* Cerrar: botón X, fondo oscuro, tecla Esc */
    if (drawerClose) {
        drawerClose.addEventListener("click", () => setMobileMenu(false));
    }

    if (menuOverlay) {
        menuOverlay.addEventListener("click", () => setMobileMenu(false));
    }

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") setMobileMenu(false);
    });

    /* Si se agranda la pantalla, se restablece todo */
    window.addEventListener("resize", () => {
        if (!isMobileMenu()) setMobileMenu(false);
    });

    /* Submenús tipo acordeón (solo en celular) */
    mainNav.querySelectorAll(".nav-dropdown > .dropdown-toggle").forEach(toggle => {

        toggle.addEventListener("click", e => {

            if (!isMobileMenu()) return;

            e.preventDefault();

            const item = toggle.parentElement;
            const willOpen = !item.classList.contains("open");

            mainNav
                .querySelectorAll(".nav-dropdown.open")
                .forEach(other => other.classList.remove("open"));

            if (willOpen) item.classList.add("open");
        });
    });

    /* Al elegir una categoría se cierra el panel */
    mainNav.querySelectorAll(".dropdown-menu a").forEach(link => {
        link.addEventListener("click", () => {
            if (isMobileMenu()) setMobileMenu(false);
        });
    });
}

/* Buscador dentro del panel: reutiliza tu búsqueda existente */
if (drawerSearchForm && drawerSearchInput && searchInput) {

    drawerSearchForm.addEventListener("submit", e => {

        e.preventDefault();

        const texto = drawerSearchInput.value.trim();

        setMobileMenu(false);

        /* El "input" del buscador del header abre el panel y busca */
        searchInput.value = texto;
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));

        setTimeout(() => {
            if (searchPanelInput) searchPanelInput.focus();
        }, 150);

        drawerSearchInput.value = "";
    });
}


// =========================================================
// ENLACES QUE BAJAN A UNA SECCIÓN (NOSOTROS, MISIÓN, VISIÓN)
// =========================================================

document.querySelectorAll("[data-scroll]").forEach(link => {

    link.addEventListener("click", e => {

        /* En celular, tocar "NOSOTROS" solo despliega el submenú */
        if (link.classList.contains("dropdown-toggle") && isMobileMenu()) return;

        const destino = document.getElementById(link.dataset.scroll);

        if (!destino) return;

        e.preventDefault();

        /* Pequeña espera para que el panel móvil termine de cerrarse
           y el scroll de la página vuelva a estar activo */
        setTimeout(() => {
            destino.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
    });
});