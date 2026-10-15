
// ==========================================
// CARGAR REPORTES DESDE NODE.JS
// ==========================================

async function cargarReportes() {

    try {

        // 1. Solicitar los reportes al servidor
        const respuesta = await fetch("/api/reportes");

        // 2. Comprobar que la solicitud fue correcta
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los reportes");
        }

        // 3. Convertir la respuesta JSON en un arreglo
        const datos = await respuesta.json();

        // 4. Comprobar que recibimos un arreglo
        if (!Array.isArray(datos)) {
            throw new Error("Los datos recibidos no son válidos");
        }

        // 5. Vaciar los reportes que estaban en memoria
        reportes.length = 0;

        // 6. Recorrer los reportes guardados
        datos.forEach(function(reporte) {

            // Convertir las fechas de texto a objetos Date
            reporte.fecha = new Date(reporte.fecha);
            reporte.fechaLimite = new Date(reporte.fechaLimite);

            // Convertir la fecha de solución si existe
            if (reporte.fechaSolucion) {
                reporte.fechaSolucion =
                    new Date(reporte.fechaSolucion);
            }

            // Agregar el reporte recuperado al arreglo
            reportes.push(reporte);

        });

        console.log("Reportes recuperados:", reportes);

    } catch (error) {

        console.error("Error al cargar reportes:", error);

    }

}




// Barra superior que muestra al usuario conectado
const usuarioActivo = document.getElementById("usuarioActivo");
/* ==========================================
    REFERENCIAS A LAS INTERFACES
========================================== */

// Inicio de sesión
const login = document.getElementById("login");

// Panel compartido de alumnos y docentes
const panelEstudiante = document.getElementById("panelEstudiante");

// Panel para visualizar reportes
const panelEstudianteReportes =
    document.getElementById("panelEstudianteReportes");

// Panel para generar un nuevo reporte
const panelCrearReporte =
    document.getElementById("panelCrearReporte");
    /* ==========================================
 MENÚ PERSONALIZADO - TIPO DE REPORTE
========================================== */

// Referencias a los elementos HTML
const tipoReporte = document.getElementById("tipoReporte");
const abrirTipoReporte = document.getElementById("abrirTipoReporte");
const textoTipoReporte = document.getElementById("textoTipoReporte");
const opcionesTipoReporte = document.getElementById("opcionesTipoReporte");

// Abrir y cerrar el menú
function cambiarEstadoMenu(abierto) {
    opcionesTipoReporte.hidden = !abierto;

    abrirTipoReporte.setAttribute(
        "aria-expanded",
        String(abierto)
    );
}

// Crear las opciones a partir del select original
Array.from(tipoReporte.options).forEach(function(opcion) {

    if (opcion.value === "") {
        return;
    }

    const boton = document.createElement("button");

    boton.type = "button";
    boton.className = "opcion-tipo-reporte";
    boton.textContent = opcion.textContent;
    boton.dataset.valor = opcion.value;
    boton.setAttribute("role", "option");

    boton.addEventListener("click", function() {

        // Actualizamos el select original
        tipoReporte.value = opcion.value;

        // Actualizamos el texto visible
        textoTipoReporte.textContent = opcion.textContent;

        // Marcamos visualmente la opción seleccionada
        document.querySelectorAll(".opcion-tipo-reporte")
            .forEach(function(elemento) {
                const seleccionada =
                    elemento.dataset.valor === opcion.value;

                elemento.classList.toggle(
                    "seleccionada",
                    seleccionada
                );

                elemento.setAttribute(
                    "aria-selected",
                    String(seleccionada)
                );
            });

        // Avisamos al formulario que cambió el valor
        tipoReporte.dispatchEvent(
            new Event("change", { bubbles: true })
        );

        cambiarEstadoMenu(false);
        abrirTipoReporte.focus();
    });

    opcionesTipoReporte.appendChild(boton);
});

// Mostrar u ocultar al presionar el botón
abrirTipoReporte.addEventListener("click", function() {

    const abrir = opcionesTipoReporte.hidden;

    cambiarEstadoMenu(abrir);

    if (abrir) {
        const seleccionada = opcionesTipoReporte.querySelector(
            ".opcion-tipo-reporte.seleccionada"
        );

        (seleccionada ||
            opcionesTipoReporte.querySelector(".opcion-tipo-reporte")
        )?.focus();
    }
});

// Cerrar al hacer clic fuera del menú
document.addEventListener("click", function(evento) {

    if (!evento.target.closest(".contenedor-tipo-reporte")) {
        cambiarEstadoMenu(false);
    }
});

// Cerrar con la tecla Escape
opcionesTipoReporte.addEventListener("keydown", function(evento) {

    if (evento.key === "Escape") {
        cambiarEstadoMenu(false);
        abrirTipoReporte.focus();
    }
});

// Moverse entre opciones con las flechas del teclado
opcionesTipoReporte.addEventListener("keydown", function(evento) {

    if (evento.key !== "ArrowDown" &&
        evento.key !== "ArrowUp") {
        return;
    }

    evento.preventDefault();

    const botones = Array.from(
        opcionesTipoReporte.querySelectorAll(".opcion-tipo-reporte")
    );

    const indiceActual = botones.indexOf(document.activeElement);

    const siguienteIndice = evento.key === "ArrowDown"
        ? (indiceActual + 1) % botones.length
        : (indiceActual - 1 + botones.length) % botones.length;

    botones[siguienteIndice].focus();
});
/* ==========================================
    VISTA PREVIA DE EVIDENCIA FOTOGRÁFICA
========================================== */

const evidenciaProblemaInput =
    document.getElementById("evidenciaProblema");

const vistaPreviaEvidencia =
    document.getElementById("vistaPreviaEvidencia");

const imagenVistaPrevia =
    document.getElementById("imagenVistaPrevia");

let urlVistaPrevia = null;

evidenciaProblemaInput.addEventListener("change", function () {

    const archivo = evidenciaProblemaInput.files[0];

    if (urlVistaPrevia) {
        URL.revokeObjectURL(urlVistaPrevia);
        urlVistaPrevia = null;
    }

    if (!archivo) {
        imagenVistaPrevia.removeAttribute("src");
        vistaPreviaEvidencia.hidden = true;
        return;
    }

    const tiposPermitidos = [
        "image/png",
        "image/jpeg",
        "image/webp"
    ];

    if (!tiposPermitidos.includes(archivo.type) ||
        archivo.size > 2 * 1024 * 1024) {

        imagenVistaPrevia.removeAttribute("src");
        vistaPreviaEvidencia.hidden = true;
        return;
    }

    urlVistaPrevia = URL.createObjectURL(archivo);

    imagenVistaPrevia.src = urlVistaPrevia;
    vistaPreviaEvidencia.hidden = false;

});
/* ==========================================
    LIMPIEZA DEL FORMULARIO DE REPORTES
========================================== */

function limpiarFormularioReporte() {

    // Limpiar los campos del formulario
    document.getElementById("formularioReporte").reset();

    // Liberar la imagen temporal
    if (urlVistaPrevia) {
        URL.revokeObjectURL(urlVistaPrevia);
        urlVistaPrevia = null;
    }

    // Ocultar la vista previa
    imagenVistaPrevia.removeAttribute("src");
    vistaPreviaEvidencia.hidden = true;

    // Restablecer el texto del menú personalizado
    textoTipoReporte.textContent = "Seleccione una opción";

    // Quitar la selección visual de las opciones
    opcionesTipoReporte
        .querySelectorAll(".opcion-tipo-reporte")
        .forEach(function(opcion) {

            opcion.classList.remove("seleccionada");
            opcion.setAttribute("aria-selected", "false");

        });

    // Cerrar el menú desplegable
    cambiarEstadoMenu(false);
}    

// Interfaces administrativas
const panelAdministrador =
    document.getElementById("panelAdministrador");

const panelAgregarUsuario =
    document.getElementById("panelAgregarUsuario");

const panelAgregarAdministrador =
    document.getElementById("panelAgregarAdministrador");

const panelReportesAdmin =
    document.getElementById("panelReportesAdmin");

const panelSolucionReporte =
    document.getElementById("panelSolucionReporte");


/* ==========================================
    ESTADO INICIAL DE LAS INTERFACES
========================================== */

// Al abrir la página solamente mostraremos el login

login.hidden = false;
// Al iniciar el sistema no hay ningún usuario conectado
usuarioActivo.hidden = true;
panelEstudiante.hidden = true;
panelEstudianteReportes.hidden = true;
panelCrearReporte.hidden = true;

panelAdministrador.hidden = true;
panelAgregarUsuario.hidden = true;
panelAgregarAdministrador.hidden = true;
panelReportesAdmin.hidden = true;
panelSolucionReporte.hidden = true;


/* ==========================================
    INICIO DE SESIÓN
========================================== */

// Obtenemos el formulario principal
const formulario = document.getElementById("formulario");

// Escuchamos cuando el usuario intenta iniciar sesión
formulario.addEventListener("submit",async function(event) {

    // Evitamos que la página se recargue
    event.preventDefault();

    // Obtenemos los valores ingresados
    const usuario = document.getElementById("usuario").value.trim();

    // Este campo recibirá NIP o contraseña
    const contrasena = document.getElementById("contrasena").value;

    // Elemento para mostrar los errores
    const error = document.getElementById("mensajeDeError");

    // Limpiamos cualquier mensaje anterior
    error.textContent = "";

    
// ==========================================
// VALIDACIÓN DE CAMPOS VACÍOS
// ==========================================

if (usuario === "" || contrasena === "") {

    error.textContent = "Error Campos Vacíos";
    return;

}

// ==========================================
// IDENTIFICAR EL TIPO DE ACCESO
// ==========================================

// Los estudiantes utilizan número de control
let tipoAcceso = "";

if (/^\d+$/.test(usuario)) {

    tipoAcceso = "estudiante";

} else {

    // Los nombres pueden pertenecer a docentes
    // o administradores.
    tipoAcceso = "docente";

}

// ==========================================
// AUTENTICACIÓN MEDIANTE NODE.JS
// ==========================================

let encontrado = null;

try {

    // Primero intentamos iniciar sesión
    // con el tipo de usuario identificado.
    let respuesta = await fetch("/api/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            usuario: usuario,
            contrasena: contrasena,
            tipo: tipoAcceso
        })

    });

    // Si no se encontró una cuenta docente válida,
    // intentamos el acceso como administrador.
    if (tipoAcceso === "docente" && respuesta.status === 401) {

        tipoAcceso = "administrador";

        respuesta = await fetch("/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                usuario: usuario,
                contrasena: contrasena,
                tipo: tipoAcceso
            })

        });

    }

    // Leer la respuesta del servidor
    const resultado = await respuesta.json();

    // Comprobar que las credenciales sean correctas
    if (!respuesta.ok) {

        error.textContent =
            respuesta.status === 401
                ? "Usuario o contraseña incorrectos"
                : resultado.mensaje || "Error al iniciar sesión";

        return;

    }

    // Guardar los datos del usuario autenticado
    encontrado = resultado.usuario;

    // Utilizar el rol confirmado por Node.js
    tipoAcceso = encontrado.tipo;

} catch (errorConexion) {

    console.log("Error de conexión:", errorConexion);

    error.textContent =
        "No se pudo conectar con el servidor";

    return;

}
    
/* ==========================================
    MOSTRAR INFORMACIÓN DEL USUARIO ACTIVO
========================================== */

// Hacemos visible nuestra barra superior
usuarioActivo.hidden = false;

// Mostramos el tipo de usuario y su nombre
// Información del usuario conectado

let nombreRol = "";
let iconoRol = "";

if (tipoAcceso === "estudiante") {
    nombreRol = "Estudiante";
    iconoRol = "icon-graduation-cap";

} else if (tipoAcceso === "docente") {
    nombreRol = "Docente";
    iconoRol = "icon-book-open";

} else if (tipoAcceso === "administrador") {
    nombreRol = "Administrador";
    iconoRol = "icon-shield-check";
}

// Construimos la tarjeta de perfil
usuarioActivo.innerHTML = `
    <div class="perfil-usuario">

        <div class="perfil-avatar">
            <i class="icon icon-user-round" aria-hidden="true"></i>
        </div>

        <div class="perfil-informacion">
            <strong>${encontrado.nombre}</strong>

            <span>
                <i class="icon ${iconoRol}" aria-hidden="true"></i>
                ${nombreRol}
            </span>
        </div>

        <div class="perfil-estado">
            <i class="icon icon-shield-check" aria-hidden="true"></i>
        </div>

    </div>
`;



    /* ======================================
        INICIO DE SESIÓN CORRECTO
    ====================================== */

    // Limpiamos los mensajes de error
    error.textContent = "";

    // Ocultamos el formulario de inicio de sesión
    login.hidden = true;

    // Ocultamos inicialmente ambos paneles
    panelEstudiante.hidden = true;
    panelAdministrador.hidden = true;

    /* ======================================
        MOSTRAR PANEL SEGÚN EL TIPO DE USUARIO
     ====================================== */

if (tipoAcceso === "administrador") {

    // Mostramos el panel administrativo
    panelAdministrador.hidden = false;

} else {

    // Alumnos y docentes comparten el mismo panel
    panelEstudiante.hidden = false;

}

// Cerramos correctamente el evento del formulario de login
});


/* ==========================================
   MOSTRAR EVIDENCIAS DEL REPORTE
========================================== */

function mostrarEvidencia(reporte, tarjeta) {

    // Comprobamos si el reporte tiene fotografías
    if (!reporte.evidenciaProblema &&
        !reporte.evidenciaSolucion) {

        return;

    }

    // Contenedor principal de las evidencias
    const contenedorEvidencias = document.createElement("div");

    contenedorEvidencias.classList.add("contenedor-evidencias");

    // Título general
    const tituloGeneral = document.createElement("h3");

    tituloGeneral.textContent = "Evidencias del reporte";

    contenedorEvidencias.appendChild(tituloGeneral);

    // Contenedor donde estarán las fotografías
    const galeria = document.createElement("div");

    galeria.classList.add("galeria-evidencias");


    /* ======================================
       EVIDENCIA DEL PROBLEMA
    ====================================== */

    if (reporte.evidenciaProblema) {

        // Tarjeta de la fotografía
        const tarjetaProblema = document.createElement("div");

        tarjetaProblema.classList.add("tarjeta-evidencia");

        // Título de la fotografía
        const titulo = document.createElement("h4");

        titulo.textContent = "Antes de la solución";

        // Imagen del problema
        const imagen = document.createElement("img");

        imagen.src = reporte.evidenciaProblema;
        imagen.alt = "Fotografía del problema";
        
        // Permitimos ampliar la fotografía al hacer clic
        imagen.classList.add("imagen-ampliable");

        imagen.addEventListener("click", function() {

        ampliarImagen(imagen.src, imagen.alt);

});
        // Agregamos los elementos
        tarjetaProblema.appendChild(titulo);
        tarjetaProblema.appendChild(imagen);

        galeria.appendChild(tarjetaProblema);

    }


    /* ======================================
       EVIDENCIA DE LA SOLUCIÓN
    ====================================== */

    if (reporte.evidenciaSolucion) {

        // Tarjeta de la fotografía
        const tarjetaSolucion = document.createElement("div");

        tarjetaSolucion.classList.add("tarjeta-evidencia");

        // Título de la fotografía
        const titulo = document.createElement("h4");

        titulo.textContent = "Después de la solución";

        // Imagen de la solución
        const imagen = document.createElement("img");

        imagen.src = reporte.evidenciaSolucion;
        imagen.alt = "Fotografía de la solución";
        
        /* ======================================
            AMPLIAR EVIDENCIA DE LA SOLUCIÓN
        ====================================== */

         // Indicamos que la fotografía es interactiva
            imagen.classList.add("imagen-ampliable");

          // Abrimos la fotografía cuando hacemos clic
            imagen.addEventListener("click", function() {

            ampliarImagen(imagen.src, imagen.alt);

});

        // Agregamos los elementos
        tarjetaSolucion.appendChild(titulo);
        tarjetaSolucion.appendChild(imagen);

        galeria.appendChild(tarjetaSolucion);

    }

    // Agregamos la galería al contenedor principal
    contenedorEvidencias.appendChild(galeria);

    // Insertamos las evidencias en el reporte
    tarjeta.appendChild(contenedorEvidencias);

}

/* ==========================================
   AMPLIAR FOTOGRAFÍAS DE EVIDENCIAS
========================================== */

function ampliarImagen(rutaImagen, descripcion) {

    // Creamos el fondo oscuro
    const fondo = document.createElement("div");

    fondo.classList.add("fondo-imagen-ampliada");

    // Creamos la fotografía ampliada
    const imagen = document.createElement("img");

    imagen.src = rutaImagen;
    imagen.alt = descripcion;

    // Creamos el botón para cerrar
    const cerrar = document.createElement("button");
    
/* ==========================================
   CERRAR FOTOGRAFÍA CON ANIMACIÓN
========================================== */

function cerrarImagen() {

    // Evitamos ejecutar el cierre varias veces
    if (fondo.classList.contains("cerrando")) {
        return;
    }

    // Activamos la animación de salida
    fondo.classList.add("cerrando");

    // Esperamos a que termine la animación
    fondo.addEventListener("animationend", function(event) {

        // Solo atendemos la animación del fondo
        if (event.target !== fondo) {
            return;
        }

        // Eliminamos el visualizador
        fondo.remove();

        // Restauramos el desplazamiento
        document.body.style.overflow = "";

    }, { once: true });

}

    cerrar.textContent = "×";
    cerrar.classList.add("cerrar-imagen");

    

    // Cerramos al presionar el botón
    cerrar.addEventListener("click", function() {

        cerrarImagen()
    });

    // Cerramos al hacer clic fuera de la fotografía
    fondo.addEventListener("click", function(event) {
        
        cerrarImagen()
    });

    // Agregamos los elementos al fondo
    fondo.appendChild(imagen);
    fondo.appendChild(cerrar);

    // Mostramos la fotografía ampliada
    document.body.appendChild(fondo);
    // Evitamos que la página se desplace mientras vemos la imagen
    document.body.style.overflow = "hidden";
}
/* =========================================
   NOTIFICACIÓN DE REPORTE GENERADO
========================================= */

let temporizadorNotificacion;

function mostrarNotificacionReporte(folio,tipo = "nuevo") {

    const notificacion = document.getElementById("notificacionReporte");

    clearTimeout(temporizadorNotificacion);

    notificacion.replaceChildren();

    const icono = document.createElement("i");
    icono.className = "icon icon-circle-check";
    icono.setAttribute("aria-hidden", "true");

    const contenido = document.createElement("div");

    // Creamos el título de la notificación
const titulo = document.createElement("strong");

// Creamos la descripción de la notificación
const descripcion = document.createElement("p");

// Elegimos el mensaje dependiendo de la acción realizada
if (tipo === "solucion") {

    titulo.textContent = "¡Reporte solucionado!";

    descripcion.textContent =
        "La solución del folio #" + folio +
        " se registró correctamente.";

} else {

    titulo.textContent = "¡Reporte registrado!";

    descripcion.textContent =
        "Tu reporte se generó correctamente. Folio: " + folio;

}

    contenido.appendChild(titulo);
    contenido.appendChild(descripcion);

    notificacion.appendChild(icono);
    notificacion.appendChild(contenido);

    notificacion.classList.add("visible");

    temporizadorNotificacion = setTimeout(function() {
        notificacion.classList.remove("visible");
    }, 5000);
}

/* ==========================================
    VISUALIZACIÓN DE REPORTES
    ALUMNOS Y DOCENTES
========================================== */

// Obtenemos el botón para visualizar reportes
const verReportes = document.getElementById("verReportes");

function mostrarReportesEstudiante() {

    // Revisamos si algún reporte ha vencido
    // antes de mostrar la información
    actualizarEstados();

    // Ocultamos el panel principal
    panelEstudiante.hidden = true;

    // Mostramos la interfaz de reportes
    panelEstudianteReportes.hidden = false;

    // Obtenemos la lista HTML
    const lu = document.getElementById("listaReportes");

    // Limpiamos la lista para evitar reportes repetidos
    lu.textContent = "";


    /* ======================================
        RECORRER LOS REPORTES REGISTRADOS
    ====================================== */

   // Obtener el texto del buscador
    const busqueda = document.getElementById("buscarReporte")
    .value.trim().toLowerCase();

    // Filtrar los reportes
    const reportesFiltrados = reportes.filter(function(reporte) {

    return (
        reporte.numeroFolio.toLowerCase().includes(busqueda) ||
        reporte.lugar.toLowerCase().includes(busqueda) ||
        reporte.tipo.toLowerCase().includes(busqueda) ||
        reporte.estado.toLowerCase().includes(busqueda)
    );

    });

       // Recorrer únicamente los reportes encontrados
        reportesFiltrados.forEach(function(reporte) {

        // Creamos un elemento li para cada reporte
        const nuevo = document.createElement("li");

        // Guardamos su folio como identificador
        nuevo.dataset.folio = reporte.numeroFolio;

        // Asignamos nuestra clase de CSS
        nuevo.className = "tarjeta-reporte";


      
/* ==========================================
   INFORMACIÓN GENERAL DEL REPORTE
========================================== */

// Creamos el contenedor principal
const informacion = document.createElement("div");

informacion.classList.add("informacion-reporte");


/* ==========================================
   ENCABEZADO: FOLIO Y ESTADO
========================================== */

// Creamos el encabezado
const encabezado = document.createElement("div");

encabezado.classList.add("encabezado-reporte");

// Mostramos el número de folio
const folio = document.createElement("h3");

folio.textContent = "Folio #" + reporte.numeroFolio;

// Mostramos el estado actual
const estado = document.createElement("span");

estado.textContent = reporte.estado;

estado.classList.add("estado-reporte");

// Asignamos una clase según el estado
if (reporte.estado === "Resuelto") {

    estado.classList.add("estado-resuelto");

} else if (reporte.estado === "Pendiente") {

    estado.classList.add("estado-pendiente");

} else {

    estado.classList.add("estado-vencido");

}

// Agregamos el folio y estado al encabezado
encabezado.appendChild(folio);
encabezado.appendChild(estado);


/* ==========================================
   DETALLES DEL REPORTE
========================================== */

// Contenedor de todas las propiedades
const detalles = document.createElement("div");

detalles.classList.add("detalles-reporte");


/* ==========================================
   FUNCIÓN PARA CREAR CAMPOS
========================================== */

// Crea un campo con su título y su valor
function crearCampo(titulo, valor) {

    const campo = document.createElement("div");
    campo.classList.add("campo-reporte");

    const etiqueta = document.createElement("strong");
    etiqueta.textContent = titulo;

    const contenido = document.createElement("p");
    contenido.textContent = valor;

    campo.appendChild(etiqueta);
    campo.appendChild(contenido);

    return campo;

}


/* ==========================================
   INFORMACIÓN GENERAL
========================================== */

// Lugar de la incidencia
detalles.appendChild(
    crearCampo("LUGAR", reporte.lugar)
);

// Tipo de incidencia
detalles.appendChild(
    crearCampo("TIPO DE INCIDENCIA", reporte.tipo)
);

// Fecha de creación
detalles.appendChild(
    crearCampo(
        "FECHA DE CREACIÓN",
        reporte.fecha.toLocaleDateString()
    )
);

// Fecha límite
detalles.appendChild(
    crearCampo(
        "FECHA LÍMITE",
        reporte.fechaLimite.toLocaleDateString()
    )
);


/* ==========================================
   DESCRIPCIÓN DEL PROBLEMA
========================================== */

// Contenedor independiente
const descripcion = crearCampo(
    "DESCRIPCIÓN DEL PROBLEMA",
    reporte.descripcion
);

descripcion.classList.add("descripcion-reporte");

detalles.appendChild(descripcion);

// Construimos la información
informacion.appendChild(encabezado);
informacion.appendChild(detalles);

// Agregamos todo a la tarjeta
nuevo.appendChild(informacion);
        


        
/* ==========================================
   MOSTRAR SOLUCIÓN DEL REPORTE
========================================== */

// Creamos el contenedor de la solución
const informacionSolucion = document.createElement("div");

informacionSolucion.classList.add("solucion-reporte");


/* ==========================================
   TÍTULO DE LA SOLUCIÓN
========================================== */

const tituloSolucion = document.createElement("h3");

tituloSolucion.textContent = "Solución del reporte";

informacionSolucion.appendChild(tituloSolucion);


/* ==========================================
   COMPROBAR SI EXISTE UNA SOLUCIÓN
========================================== */

if (reporte.solucion !== "") {

    // Título de la descripción
    const etiquetaSolucion = document.createElement("strong");

    etiquetaSolucion.textContent = "DESCRIPCIÓN DE LA SOLUCIÓN";

    // Texto registrado por el administrador
    const textoSolucion = document.createElement("p");

    textoSolucion.textContent = reporte.solucion;

    // Fecha de solución
    const fechaSolucion = document.createElement("div");

    fechaSolucion.classList.add("fecha-solucion");

    fechaSolucion.textContent =
        "Fecha de solución: " +
        reporte.fechaSolucion.toLocaleDateString();

    // Agregamos los elementos
    informacionSolucion.appendChild(etiquetaSolucion);
    informacionSolucion.appendChild(textoSolucion);
    informacionSolucion.appendChild(fechaSolucion);

} else {

    // Mensaje para reportes sin resolver
    const pendiente = document.createElement("p");

    pendiente.textContent = "Pendiente de atención";

    informacionSolucion.appendChild(pendiente);

}

       // Insertamos la solución en la tarjeta
        nuevo.appendChild(informacionSolucion);
       
        // Mostrar fotografía del problema
        mostrarEvidencia(reporte, nuevo);


        /* ==================================
            INSERTAR REPORTE EN LA LISTA
        ================================== */

        // Agregamos la tarjeta completa a nuestro ul
        lu.appendChild(nuevo);

    });

};

verReportes.addEventListener("click", function() {

document.getElementById("buscarReporte").value = "";

mostrarReportesEstudiante();

});

document.getElementById("buscarReporte")
    .addEventListener("input", function() {

        mostrarReportesEstudiante();

    });


/* ==========================================
    REGRESAR DESDE VER REPORTES
========================================== */

// Obtenemos el botón una sola vez
const regresar = document.getElementById("regresar");

regresar.addEventListener("click", function() {

    // Ocultamos la lista de reportes
    panelEstudianteReportes.hidden = true;

    // Mostramos el panel principal
    panelEstudiante.hidden = false;

});


/* ==========================================
    NAVEGACIÓN DEL ALUMNO Y DOCENTE
========================================== */

// Obtenemos los botones de navegación
const crearReporte = document.getElementById("crearReporte");

const regresarPanel = document.getElementById("regresarPanel");


/* BOTÓN: CREAR NUEVO REPORTE */

crearReporte.addEventListener("click", function() {
    
    // Ocultamos el panel principal
    panelEstudiante.hidden = true;
    
    // Mostramos el formulario para crear reportes
    panelCrearReporte.hidden = false;
    // Limpiamos cualquier mensaje de una operación anterior.
    // Así, cada vez que un alumno o docente ingrese al
    // formulario, encontrará la interfaz sin mensajes antiguos.
    
    document.getElementById("mensajeReporte").textContent = "";

});


/* BOTÓN: REGRESAR AL PANEL PRINCIPAL */

regresarPanel.addEventListener("click", function() {

    // Ocultamos el formulario
    panelCrearReporte.hidden = true;

    // Mostramos nuevamente el panel principal
    panelEstudiante.hidden = false;

});


/* ==========================================
    NAVEGACIÓN DEL ADMINISTRADOR
========================================== */

// Botones del panel principal
const agregarUsuario =
    document.getElementById("agregarUsuario");

const agregarAdministrador =
    document.getElementById("agregarAdministrador");

const verReportesAdmin =
    document.getElementById("verReportesAdmin");


// Botones para regresar
const regresarAdminUsuario =
    document.getElementById("regresarAdminUsuario");

const regresarAdminRegistro =
    document.getElementById("regresarAdminRegistro");

const regresarPanelAdmin =
    document.getElementById("regresarPanelAdmin");


/* ==========================================
    BOTÓN: AGREGAR USUARIO
========================================== */

agregarUsuario.addEventListener("click", function() {

    // Ocultamos el panel administrativo
    panelAdministrador.hidden = true;

    // Mostramos el formulario de alumnos y docentes
    panelAgregarUsuario.hidden = false;

});


/* ==========================================
    BOTÓN: AGREGAR ADMINISTRADOR
========================================== */

agregarAdministrador.addEventListener("click", function() {

    // Ocultamos el panel principal
    panelAdministrador.hidden = true;

    // Mostramos el formulario de administradores
    panelAgregarAdministrador.hidden = false;

});

/* ==========================================
    REPORTE SELECCIONADO POR EL ADMINISTRADOR
========================================== */

// Esta variable guardará temporalmente el objeto
// del reporte que el administrador desea solucionar.

let reporteSeleccionado = false;

/* ==========================================
    ACTUALIZACIÓN AUTOMÁTICA DE ESTADOS
========================================== */

// Esta función revisará los reportes registrados
// y actualizará aquellos que hayan vencido
// sin recibir una solución.
// ==========================================
// CALCULAR TIEMPO RESTANTE DEL REPORTE
// ==========================================

function calcularTiempoRestante(reporte) {

    // Si ya está solucionado, no necesita temporizador
    if (
        reporte.estado === "Resuelto" ||
        reporte.estado === "Resuelto fuera de tiempo"
    ) {
        return "Reporte solucionado";
    }

    // Fecha y hora actuales
    const ahora = new Date();

    // Diferencia en milisegundos
    const diferencia = reporte.fechaLimite - ahora;

    // Si el plazo terminó
    if (diferencia <= 0) {
        return "Tiempo agotado";
    }

    // Convertir milisegundos a días, horas, minutos y segundos
    const dias = Math.floor(diferencia / 86400000);

    const horas = Math.floor(
        (diferencia % 86400000) / 3600000
    );

    const minutos = Math.floor(
        (diferencia % 3600000) / 60000
    );

    const segundos = Math.floor(
        (diferencia % 60000) / 1000
    );

    return dias + "d " +
        horas + "h " +
        minutos + "m " +
        segundos + "s";
}
// ==========================================
// MOSTRAR TEMPORIZADOR EN UNA TARJETA
// ==========================================

function mostrarTemporizador(reporte, tarjeta) {

    // Creamos un elemento para mostrar el tiempo
    const temporizador = document.createElement("p");
   // Clase para personalizar el contador desde CSS
    temporizador.classList.add("contador-reporte");
    // Identificamos el temporizador con su folio
    temporizador.dataset.temporizador = reporte.numeroFolio;
    // Mostramos el tiempo inicial
    temporizador.textContent =
        "Tiempo restante: " + calcularTiempoRestante(reporte);

    // Agregamos el temporizador a la tarjeta
    tarjeta.appendChild(temporizador);
}
function actualizarEstados() {

    // Obtenemos la fecha y hora actual
    const fechaActual = new Date();

    // Recorremos nuestro array de reportes
    for (let i = 0; i < reportes.length; i++) {

        // Comprobamos si el reporte sigue pendiente
        if (reportes[i].estado === "Pendiente") {

            // Comparamos la fecha actual con su fecha límite
            if (fechaActual > reportes[i].fechaLimite) {

                // Si ya venció, cambiamos su estado
                reportes[i].estado = "Fuera de tiempo";

            }

        }

    }

}

/* ==========================================
    BOTÓN: VER REPORTES ADMINISTRATIVOS
========================================== */

function mostrarReportesAdmin() {
    // Actualizamos los estados antes de mostrar los reportes
    actualizarEstados();
    // Ocultamos el panel principal del administrador
    panelAdministrador.hidden = true;

    // Mostramos la interfaz de reportes
    panelReportesAdmin.hidden = false;

    // Obtenemos la lista donde aparecerán los reportes
    const lista = document.getElementById("listaReportesAdmin");

    // Limpiamos la lista para evitar elementos repetidos
    lista.textContent = "";


    /* ======================================
        RECORRER LOS REPORTES
    ====================================== */

    const busqueda = document.getElementById("buscarReporteAdmin")
    .value.trim().toLowerCase();

    const reportesFiltrados = reportes.filter(function(reporte) {

        return (
            reporte.numeroFolio.toLowerCase().includes(busqueda) ||
            reporte.lugar.toLowerCase().includes(busqueda) ||
            reporte.tipo.toLowerCase().includes(busqueda) ||
            reporte.estado.toLowerCase().includes(busqueda)
        );
        });
        reportesFiltrados.forEach(function(reporte) {

        // Creamos un elemento li para cada reporte
        const nuevo = document.createElement("li");

        // Guardamos el folio como identificador
        nuevo.dataset.folio = reporte.numeroFolio;

        // Asignamos una clase para aplicar CSS
        nuevo.className = "tarjeta-reporte";

        // ==========================================
// INFORMACIÓN GENERAL DEL REPORTE
// ==========================================

// Contenedor principal
const informacion = document.createElement("div");
informacion.classList.add("informacion-reporte");

// ==========================================
// ENCABEZADO: FOLIO Y ESTADO
// ==========================================

const encabezado = document.createElement("div");
encabezado.classList.add("encabezado-reporte");

// Folio destacado
const folio = document.createElement("h3");
folio.textContent = "Folio #" + reporte.numeroFolio;

// Estado del reporte
const estado = document.createElement("span");
estado.textContent = reporte.estado;
estado.classList.add("estado-reporte");

// Aplicamos el color correspondiente
if (reporte.estado === "Resuelto") {

    estado.classList.add("estado-resuelto");

} else if (reporte.estado === "Pendiente") {

    estado.classList.add("estado-pendiente");

} else {

    estado.classList.add("estado-vencido");

}

// Agregamos folio y estado
encabezado.appendChild(folio);
encabezado.appendChild(estado);

// ==========================================
// DETALLES DEL REPORTE
// ==========================================

const detalles = document.createElement("div");
detalles.classList.add("detalles-reporte");

// Función para crear un campo con título y valor
function crearCampo(titulo, valor) {

    const campo = document.createElement("div");
    campo.classList.add("campo-reporte");

    const etiqueta = document.createElement("strong");
    etiqueta.textContent = titulo;

    const contenido = document.createElement("p");
    contenido.textContent = valor;

    campo.appendChild(etiqueta);
    campo.appendChild(contenido);

    return campo;
}

// Lugar
detalles.appendChild(
    crearCampo("LUGAR", reporte.lugar)
);

// Tipo de incidencia
detalles.appendChild(
    crearCampo("TIPO DE INCIDENCIA", reporte.tipo)
);

// Fecha de creación
detalles.appendChild(
    crearCampo(
        "FECHA DE CREACIÓN",
        reporte.fecha.toLocaleDateString()
    )
);

// Fecha límite
detalles.appendChild(
    crearCampo(
        "FECHA LÍMITE",
        reporte.fechaLimite.toLocaleDateString()
    )
);

// ==========================================
// DESCRIPCIÓN DEL PROBLEMA
// ==========================================

const descripcion = crearCampo(
    "DESCRIPCIÓN DEL PROBLEMA",
    reporte.descripcion
);

// La descripción ocupará todo el ancho
descripcion.classList.add("descripcion-reporte");

detalles.appendChild(descripcion);

// ==========================================
// CONSTRUIR LA TARJETA
// ==========================================

informacion.appendChild(encabezado);
informacion.appendChild(detalles);


        /* ==================================
            BOTÓN PARA SOLUCIONAR
        ================================== */

        // Creamos un botón para cada reporte
        const botonSolucionar = document.createElement("button");
        // Aplicamos el estilo institucional al botón
        botonSolucionar.classList.add("boton-admin-reporte");
        // Definimos su texto
        botonSolucionar.textContent = "SOLUCIONAR REPORTE";

        // Indicamos que no debe enviar formularios
        botonSolucionar.type = "button";

        // Guardamos también el folio en el botón
        botonSolucionar.dataset.folio = reporte.numeroFolio;


        /* ==================================
            EVENTO DEL BOTÓN SOLUCIONAR
        ================================== */

        botonSolucionar.addEventListener("click", function() {

            
        // Guardamos el objeto del reporte seleccionado.
        // Así sabremos cuál debemos modificar cuando
        // el administrador presione GUARDAR SOLUCIÓN.

        reporteSeleccionado = reporte;


            // Ocultamos la lista de reportes
            panelReportesAdmin.hidden = true;

            // Mostramos la interfaz para registrar la solución
            panelSolucionReporte.hidden = false;


            /* ==============================
                MOSTRAR DATOS SELECCIONADOS
            ============================== */

            document.getElementById("solucionFolio").textContent =
                reporte.numeroFolio;

            document.getElementById("solucionLugar").textContent =
                reporte.lugar;

            document.getElementById("solucionTipo").textContent =
                reporte.tipo;

            document.getElementById("solucionDescripcion").textContent =
                reporte.descripcion;

            document.getElementById("solucionEstado").textContent =
                reporte.estado;

            document.getElementById("solucionFechaLimite").textContent =
                reporte.fechaLimite.toLocaleDateString();
            const contenedorEvidencia =
            document.getElementById("evidenciaOriginalAdmin");

           // Limpiamos la imagen del reporte anterior
            contenedorEvidencia.textContent = "";

           // Mostramos la fotografía del problema
            mostrarEvidencia(reporte, contenedorEvidencia);    

            // Limpiamos mensajes anteriores
            document.getElementById("mensajeSolucion").textContent = "";

        });


        /* ==================================
            INSERTAR ELEMENTOS EN LA LISTA
        ================================== */
        // Siempre mostramos la información del reporte
        nuevo.appendChild(informacion);
        // Mostrar fotografía del problema
        mostrarEvidencia(reporte, nuevo);
        /* ==========================================
   DESCRIPCIÓN DE LA SOLUCIÓN - ADMINISTRADOR
========================================== */

// Comprobamos que el reporte tenga una solución registrada
if (reporte.solucion && reporte.solucion.trim() !== "") {

    // Creamos el contenedor de la solución
    const informacionSolucionAdmin = document.createElement("div");

    // Clase para aplicar estilos desde CSS
    informacionSolucionAdmin.classList.add("solucion-reporte-admin");

    // Creamos el título
    const tituloSolucionAdmin = document.createElement("strong");

    tituloSolucionAdmin.textContent = "DESCRIPCIÓN DE LA SOLUCIÓN";

    // Creamos el texto de la solución
    const textoSolucionAdmin = document.createElement("p");

    textoSolucionAdmin.textContent = reporte.solucion;

    // Agregamos el título y la descripción
    informacionSolucionAdmin.appendChild(tituloSolucionAdmin);
    informacionSolucionAdmin.appendChild(textoSolucionAdmin);

    // Mostramos la fecha cuando esté registrada
    if (reporte.fechaSolucion) {

        const fechaSolucionAdmin = document.createElement("p");

        fechaSolucionAdmin.classList.add("fecha-solucion-admin");

        fechaSolucionAdmin.textContent =
            "Fecha de solución: " +
            new Date(reporte.fechaSolucion).toLocaleDateString();

        informacionSolucionAdmin.appendChild(fechaSolucionAdmin);
    }

    // Insertamos la solución dentro de la tarjeta
    nuevo.appendChild(informacionSolucionAdmin);
}
        mostrarTemporizador(reporte, nuevo);
       // Solamente mostramos el botón si el reporte
       // todavía no tiene una solución registrada
        if (
            reporte.estado === "Pendiente" ||
            reporte.estado === "Fuera de tiempo"
        ) {
        nuevo.appendChild(botonSolucionar);
        }

        // Finalmente insertamos la tarjeta en nuestra lista
        lista.appendChild(nuevo);

    });

};
// Abrir la lista administrativa de reportes
verReportesAdmin.addEventListener("click", function() {

    document.getElementById("buscarReporteAdmin").value = "";

    mostrarReportesAdmin();

});


// Buscar mientras el administrador escribe
document.getElementById("buscarReporteAdmin")
    .addEventListener("input", function() {

        mostrarReportesAdmin();

    });

/* ==========================================
    REGRESAR DESDE AGREGAR USUARIO
========================================== */

regresarAdminUsuario.addEventListener("click", function() {

    // Ocultamos el formulario
    panelAgregarUsuario.hidden = true;

    // Regresamos al panel administrativo
    panelAdministrador.hidden = false;

});


/* ==========================================
    REGRESAR DESDE AGREGAR ADMINISTRADOR
========================================== */

regresarAdminRegistro.addEventListener("click", function() {

    // Ocultamos el formulario
    panelAgregarAdministrador.hidden = true;

    // Regresamos al panel administrativo
    panelAdministrador.hidden = false;

});


/* ==========================================
    REGRESAR DESDE VER REPORTES ADMIN
========================================== */

regresarPanelAdmin.addEventListener("click", function() {

    // Ocultamos la interfaz de reportes
    panelReportesAdmin.hidden = true;

    // Mostramos nuevamente el panel administrativo
    panelAdministrador.hidden = false;

});


/* ==========================================
    REGISTRO DE ALUMNOS Y DOCENTES
========================================== */

// Obtenemos el selector del tipo de usuario
const nuevoTipo = document.getElementById("nuevoTipo");

// Obtenemos los contenedores de los campos
const camposAlumno = document.getElementById("camposAlumno");
const camposDocente = document.getElementById("camposDocente");


/* ==========================================
    MOSTRAR CAMPOS SEGÚN EL TIPO DE USUARIO
========================================== */

// Este evento se ejecuta cuando el administrador
// selecciona Alumno o Docente

nuevoTipo.addEventListener("change", function() {

    // Ocultamos inicialmente ambos contenedores
    camposAlumno.hidden = true;
    camposDocente.hidden = true;

    // Si selecciona estudiante, mostramos sus campos
    if (nuevoTipo.value === "estudiante") {

        camposAlumno.hidden = false;

    }

    // Si selecciona docente, mostramos su campo
    else if (nuevoTipo.value === "docente") {

        camposDocente.hidden = false;

    }

});
// ==========================================
// OBSERVADOR DE ALERTAS DEL REGISTRO
// ==========================================

// Obtenemos el elemento donde aparecen los mensajes
const mensajeRegistroUsuario =
    document.getElementById("mensajeNuevoUsuario");

// Creamos el observador una sola vez
const observadorMensaje = new MutationObserver(function () {

    // Quitamos los estilos anteriores
    mensajeRegistroUsuario.classList.remove("aviso-exito");
    mensajeRegistroUsuario.classList.remove("aviso-error");

    // Si no hay mensaje, terminamos
    if (mensajeRegistroUsuario.textContent.trim() === "") {
        return;
    }

    // Comprobamos si el mensaje indica un registro exitoso
    if (mensajeRegistroUsuario.textContent.toLowerCase().includes("correctamente")) {

        mensajeRegistroUsuario.classList.add("aviso-exito");

    } else {

        // Aplicamos la alerta roja a los errores
        mensajeRegistroUsuario.classList.add("aviso-error");

    }

});

// Comenzamos a observar los cambios del mensaje
observadorMensaje.observe(mensajeRegistroUsuario, {
    childList: true,
    characterData: true,
    subtree: true
});


/* ==========================================
    FORMULARIO PARA REGISTRAR USUARIOS
========================================== */

// Obtenemos el formulario
const formularioNuevoUsuario =
    document.getElementById("formularioNuevoUsuario");


// Escuchamos el evento submit
formularioNuevoUsuario.addEventListener("submit", async function(event) {

    // Evitamos que la página se recargue
    event.preventDefault();

    // Obtenemos los datos generales
    const nombre =
        document.getElementById("nuevoNombre").value.trim();

    const tipo = nuevoTipo.value;

    // Elemento donde mostraremos los mensajes
    const mensaje =
        document.getElementById("mensajeNuevoUsuario");
     
        // ==========================================
    // LIMPIAR LAS ALERTAS ANTERIORES
    // ==========================================

    // Eliminamos el mensaje anterior
    mensaje.textContent = "";

    // Quitamos los estilos de éxito y error
    mensaje.classList.remove("aviso-exito");
    mensaje.classList.remove("aviso-error");

    // Limpiamos mensajes anteriores
    mensaje.textContent = "";


    /* ======================================
        VALIDACIÓN DE DATOS GENERALES
    ====================================== */

    if (nombre === "" || tipo === "") {

        mensaje.textContent = "Complete todos los campos";
        return;

    }
    // ==========================================
    // VALIDACIÓN DEL NOMBRE DEL USUARIO
    // ==========================================
    // Comprobamos si el nombre contiene solamente números
    if (/^\d+$/.test(nombre)) {

    // Mostramos el mensaje de error
    mensaje.textContent = "El nombre del usuario no puede ser numérico";

    // Aplicamos el estilo de alerta roja
    mensaje.classList.add("aviso-error");

    // Detenemos el registro para evitar guardar datos inválidos
    return;
    }


    /* ======================================
        REGISTRO DE UN ALUMNO
    ====================================== */

    if (tipo === "estudiante") {

        // Obtenemos número de control y NIP
        const numeroControl =
            document.getElementById("nuevoNumeroControl").value.trim();

        const nip =
            document.getElementById("nuevoNip").value;
            
        /* ======================================
            VALIDACIÓN DEL NIP DEL ESTUDIANTE
        ====================================== */
        // Comprobamos que el NIP contenga únicamente dígitos.
        // No permitimos letras, espacios ni símbolos.
        if (!/^[0-9]+$/.test(nip)) {

    mensaje.textContent =
        "El NIP debe contener únicamente números";

    return;

}


        // Comprobamos que los campos no estén vacíos
        if (numeroControl === "" || nip === "") {

            mensaje.textContent = "Ingrese número de control y NIP";
            return;

        }

        // El número de control debe contener solo números
        if (isNaN(numeroControl)) {

            mensaje.textContent = "Número de control inválido";
            return;

        }

        
// ==========================================
// CREAR EL OBJETO DEL NUEVO ESTUDIANTE
// ==========================================

const nuevoAlumno = {

    nombre: nombre,
    numeroControl: numeroControl,
    nip: nip,
    tipo: "estudiante"

};

// ==========================================
// ENVIAR EL ESTUDIANTE A NODE.JS
// ==========================================

try {

    // Enviamos los datos al servidor
    const respuesta = await fetch("/api/usuarios/estudiantes", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(nuevoAlumno)

    });

    // Leemos la respuesta de Node.js
    const resultado = await respuesta.json();

    // Si el servidor rechazó el registro,
    // mostramos el motivo y detenemos la función
    if (!respuesta.ok) {

        mensaje.textContent = resultado.mensaje;
        return;

    }

    // El servidor confirmó que guardó el estudiante
    mensaje.textContent = resultado.mensaje;

} catch (error) {

    console.log("Error al registrar estudiante:", error);

    mensaje.textContent =
        "No se pudo conectar con el servidor";

    return;

}

}


    /* ======================================
        REGISTRO DE UN DOCENTE
    ====================================== */

    else if (tipo === "docente") {

        // Obtenemos la contraseña
        const contrasena =
            document.getElementById("nuevaContrasena").value;

        // Validamos que exista una contraseña
        if (contrasena === "") {

            mensaje.textContent = "Ingrese una contraseña";
            return;

        }

        // El nombre no debe ser únicamente numérico,
        // porque el login utiliza los números para buscar alumnos
        if (!isNaN(nombre)) {

            mensaje.textContent = "El nombre del docente no puede ser numérico";
            // Aplicamos el diseño de la tarjeta roja
        mensaje.classList.add("aviso-error");
            return;

        }

        
// ==========================================
// CREAR EL OBJETO DEL NUEVO DOCENTE
// ==========================================

const nuevoDocente = {

    nombre: nombre,
    contrasena: contrasena,
    tipo: "docente"

};

// ==========================================
// ENVIAR EL DOCENTE A NODE.JS
// ==========================================

try {

    // Enviamos los datos al servidor
    const respuesta = await fetch("/api/usuarios/docentes", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(nuevoDocente)

    });

    // Leemos la respuesta del servidor
    const resultado = await respuesta.json();

    // Si hubo un error, mostramos el mensaje
    if (!respuesta.ok) {

        mensaje.textContent = resultado.mensaje;
        return;

    }

    // Confirmamos que Node.js guardó al docente
    mensaje.textContent = resultado.mensaje;

} catch (error) {

    console.log("Error al registrar docente:", error);

    mensaje.textContent = "No se pudo conectar con el servidor";
    return;

}

    }

    /* ======================================
        LIMPIAR EL FORMULARIO
    ====================================== */

    // Después de un registro correcto,
    // limpiamos los campos del formulario

    formularioNuevoUsuario.reset();

    // Ocultamos nuevamente los campos específicos
    camposAlumno.hidden = true;
    camposDocente.hidden = true;

});

/* ==========================================
    REGISTRO DE NUEVOS ADMINISTRADORES
========================================== */

// Obtenemos el formulario para registrar administradores
const formularioNuevoAdministrador =
    document.getElementById("formularioNuevoAdministrador");

// Escuchamos cuando el administrador envía el formulario
formularioNuevoAdministrador.addEventListener("submit", async function(event) {

    // Evitamos que el formulario recargue la página
    event.preventDefault();

    /* ======================================
        OBTENER LOS DATOS INGRESADOS
    ====================================== */

    // Obtenemos el nombre del nuevo administrador
    const nombre =
        document.getElementById("nuevoNombreAdmin").value.trim();

    // Obtenemos su contraseña
    const contrasena =
        document.getElementById("nuevaContrasenaAdmin").value;

    // Obtenemos el elemento donde mostraremos los mensajes
    const mensaje =
        document.getElementById("mensajeNuevoAdministrador");

    // Limpiamos cualquier mensaje anterior
    mensaje.textContent = "";
    // Eliminamos los estilos de alertas anteriores
    mensaje.classList.remove("aviso-exito");
    mensaje.classList.remove("aviso-error");


    /* ======================================
        VALIDACIÓN DE CAMPOS VACÍOS
    ====================================== */

    // Comprobamos que ambos campos tengan información
    if (nombre === "" || contrasena === "") {

    // Mostramos el mensaje de error
    mensaje.textContent = "Debes completar todos los campos";

    // Aplicamos el diseño de alerta roja
    mensaje.classList.add("aviso-error");

    return;
    }


    /* ======================================
        VALIDACIÓN DEL NOMBRE
    ====================================== */

    // El nombre no puede ser únicamente numérico,
    // porque nuestro login interpreta los números
    // como números de control de estudiantes

    if (!isNaN(nombre)) {

        mensaje.textContent =
            "El nombre del administrador no puede ser numérico";

        return;

    }


    /* ======================================
        COMPROBAR ADMINISTRADORES DUPLICADOS
    ====================================== */
    
    
// ==========================================
// CREAR EL OBJETO DEL NUEVO ADMINISTRADOR
// ==========================================

const nuevoAdministrador = {

    nombre: nombre,
    contrasena: contrasena

};

// ==========================================
// ENVIAR EL ADMINISTRADOR A NODE.JS
// ==========================================

try {

    // Enviamos los datos al servidor
    const respuesta = await fetch("/api/administradores", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(nuevoAdministrador)

    });

   // Leemos la respuesta enviada por Node.js
const resultado = await respuesta.json();

// Comprobamos si ocurrió algún error
if (!respuesta.ok) {

    mensaje.textContent = resultado.mensaje;

    // Mostramos la tarjeta roja de error
    mensaje.classList.add("aviso-error");

    return;
}

// Confirmamos que el administrador fue guardado
mensaje.textContent = resultado.mensaje;

// Mostramos la tarjeta verde de éxito
mensaje.classList.add("aviso-exito");

// Limpiamos el formulario después del registro correcto
formularioNuevoAdministrador.reset();

} catch (error) {

    // Mostramos el error en la consola
    console.log("Error al registrar administrador:", error);

    // Informamos al usuario
    mensaje.textContent = "No se pudo completar el registro";

    // Mostramos la tarjeta roja de error
    mensaje.classList.add("aviso-error");

    return;
}

// Cerramos el evento del formulario
});



function leerImagen(archivo) {

    return new Promise((resolve, reject) => {

        if (!archivo) {
            resolve(null);
            return;
        }

        // Máximo 2 MB
        if (archivo.size > 2 * 1024 * 1024) {
            reject(new Error("La imagen no debe superar 2 MB"));
            return;
        }

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(archivo.type)) {
            reject(new Error("Formato de imagen no permitido"));
            return;
        }

        const lector = new FileReader();

        lector.onload = () => resolve(lector.result);

        lector.onerror = () =>
            reject(new Error("No se pudo leer la imagen"));

        lector.readAsDataURL(archivo);
    });
}

/* ==========================================
    GENERACIÓN DE NUEVOS REPORTES
========================================== */

// Obtenemos el formulario para generar reportes
const formularioReporte =
    document.getElementById("formularioReporte");

// Establecemos los días disponibles para solucionar
// un reporte. Por ahora utilizaremos 3 días naturales.
const diasParaSolucionar = 3;


/* ==========================================
    EVENTO PARA GENERAR UN REPORTE
========================================== */

formularioReporte.addEventListener("submit",async function(event) {

    // Evitamos que el formulario recargue la página
    event.preventDefault();


    /* ======================================
        OBTENER LA INFORMACIÓN DEL FORMULARIO
    ====================================== */

    // Lugar donde se presenta el problema
    const lugar =
        document.getElementById("lugarReporte").value.trim();

    // Categoría seleccionada
    const tipo =
        document.getElementById("tipoReporte").value;

    // Descripción escrita por el usuario
    const descripcion =
        document.getElementById("descripcionReporte").value.trim();

    // Elemento para mostrar errores o confirmaciones
    const mensaje =
        document.getElementById("mensajeReporte");

    // Limpiamos cualquier mensaje anterior
    mensaje.textContent = "";


    /* ======================================
        VALIDACIÓN DE CAMPOS VACÍOS
    ====================================== */

    if (lugar === "" || tipo === "" || descripcion === "") {

        mensaje.textContent = "Complete todos los campos";
        return;

    }


    /* ======================================
        VALIDACIÓN DEL LUGAR
    ====================================== */

    // El lugar debe tener entre 5 y 100 caracteres
    if (lugar.length < 5 || lugar.length > 100) {

        mensaje.textContent =
            "El lugar debe contener entre 5 y 100 caracteres";

        return;

    }


    /* ======================================
        VALIDACIÓN DE LA DESCRIPCIÓN
    ====================================== */

    // La descripción debe contener entre 15 y 300 caracteres
    if (descripcion.length < 15 || descripcion.length > 300) {

        mensaje.textContent =
            "La descripción debe contener entre 15 y 300 caracteres";

        return;

    }

    let imagenProblema = null;

    try { 

    const archivo = document.getElementById(
        "evidenciaProblema"
    ).files[0];

    imagenProblema = await leerImagen(archivo);

    } catch (error) {

    mensaje.textContent = error.message;
    return;
    }

    /* ======================================
        GENERACIÓN AUTOMÁTICA DEL FOLIO
    ====================================== */

    // Buscaremos el folio numérico más alto que exista.
    // Esto evita repetir un folio si en algún momento
    // los reportes no están ordenados.

    let ultimoFolio = 0;

    // Recorremos los reportes registrados
    for (let i = 0; i < reportes.length; i++) {

        // Convertimos temporalmente el folio a número
        const folioActual = Number(reportes[i].numeroFolio);

        // Comprobamos si es mayor al último registrado
        if (folioActual > ultimoFolio) {

            ultimoFolio = folioActual;

        }

    }

    // Incrementamos el folio más alto encontrado
    let nuevoFolio = ultimoFolio + 1;

    // Lo convertimos nuevamente a texto
    nuevoFolio = String(nuevoFolio);

    // Agregamos ceros al inicio para conservar
    // el formato de nuestros folios: 001, 002, 003...

    if (nuevoFolio.length === 1) {

        nuevoFolio = "00" + nuevoFolio;

    } else if (nuevoFolio.length === 2) {

        nuevoFolio = "0" + nuevoFolio;

    }


    /* ======================================
        GENERACIÓN DE FECHAS
    ====================================== */

    // Obtenemos la fecha y hora actual
    const fecha = new Date();

    // Creamos una copia para calcular la fecha límite
    const fechaLimite = new Date(fecha);

    // Sumamos los días establecidos al día actual
    fechaLimite.setDate(
        fechaLimite.getDate() + diasParaSolucionar
    );


    /* ======================================
        CREACIÓN DEL OBJETO REPORTE
    ====================================== */

    // Creamos un objeto con todos los datos validados
    const nuevoReporte = {

        numeroFolio: nuevoFolio,

        lugar: lugar,

        tipo: tipo,

        descripcion: descripcion,

        fecha: fecha,

        fechaLimite: fechaLimite,

        estado: "Pendiente",

        solucion: "",
        
        evidenciaProblema: imagenProblema,

        evidenciaSolucion: null,

    };


    
// ======================================
// ALMACENAMIENTO DEL REPORTE EN NODE.JS
// ======================================

try {

    // 1. Enviar el nuevo reporte al servidor
    const respuesta = await fetch("/api/reportes", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(nuevoReporte)

    });

    // 2. Obtener la respuesta del servidor
    const resultado = await respuesta.json();

    // 3. Comprobar que se guardó correctamente
    if (!respuesta.ok) {

        mensaje.textContent = resultado.mensaje;
        return;

    }

    // 4. Actualizar el arreglo del navegador
    reportes.push(nuevoReporte);

} catch (error) {

    // 5. Mostrar un error si falla la conexión
    console.log("Error al conectar con Node.js:", error);

    mensaje.textContent =
        "No se pudo conectar con el servidor";

    return;

}


    /* ======================================
        CONFIRMACIÓN DEL REGISTRO
    ====================================== */
    // Limpiamos el mensaje anterior
    mensaje.textContent = "";
    

    // Limpiamos los campos del formulario
    limpiarFormularioReporte();
    // Mostrar notificación flotante
    mostrarNotificacionReporte(nuevoFolio);

});



/* ==========================================
    CANCELAR SOLUCIÓN DE UN REPORTE
========================================== */

// Obtenemos el botón CANCELAR
const cancelarSolucion =
    document.getElementById("cancelarSolucion");

// Escuchamos cuando el administrador lo presiona
cancelarSolucion.addEventListener("click", function() {

    // Ocultamos el formulario de solución
    panelSolucionReporte.hidden = true;

    // Mostramos nuevamente la lista de reportes
    panelReportesAdmin.hidden = false;

    // Limpiamos el campo de la solución
    document.getElementById("formularioSolucion").reset();

});



/* ==========================================
    CERRAR SESIÓN
    ALUMNOS Y DOCENTES
========================================== */

// Obtenemos el botón CERRAR SESIÓN
const cerrarSesion =
    document.getElementById("cerrarSesion");

// Escuchamos cuando el usuario presiona el botón
cerrarSesion.addEventListener("click", function() {

    // Ocultamos el panel de alumnos y docentes
    panelEstudiante.hidden = true;

    // Ocultamos las demás interfaces del usuario
    panelEstudianteReportes.hidden = true;
    panelCrearReporte.hidden = true;
    // Limpiamos la información del usuario anterior
    usuarioActivo.textContent = "";

    // Ocultamos la barra cuando no hay una sesión activa
    usuarioActivo.hidden = true;
    // Limpiamos los campos del formulario de inicio de sesión
    formulario.reset();

    // Eliminamos cualquier mensaje de error anterior
    document.getElementById("mensajeDeError").textContent = "";

    // Mostramos nuevamente el login
    login.hidden = false;

});


/* ==========================================
    CERRAR SESIÓN
    ADMINISTRADORES
========================================== */

// Obtenemos el botón CERRAR SESIÓN del administrador
const cerrarSesionAdmin =
    document.getElementById("cerrarSesionAdmin");

// Escuchamos cuando el administrador presiona el botón
cerrarSesionAdmin.addEventListener("click", function() {

    // Ocultamos todas las interfaces administrativas
    panelAdministrador.hidden = true;
    panelAgregarUsuario.hidden = true;
    panelAgregarAdministrador.hidden = true;
    panelReportesAdmin.hidden = true;
    panelSolucionReporte.hidden = true;

    usuarioActivo.hidden = true;
    // Limpiamos la información del administrador
    usuarioActivo.textContent = "";

   // Ocultamos la barra superior
    usuarioActivo.hidden = true; 

    // Limpiamos los campos del inicio de sesión
    formulario.reset();

    // Eliminamos los mensajes de error anteriores
    document.getElementById("mensajeDeError").textContent = "";

    // Mostramos nuevamente el login
    login.hidden = false;

});


/* ==========================================
    REGISTRO DE SOLUCIONES
========================================== */

// Obtenemos el formulario para registrar soluciones
const formularioSolucion =
    document.getElementById("formularioSolucion");

// Escuchamos cuando el administrador lo envía
formularioSolucion.addEventListener("submit", async function(event) {

    // Evitamos que la página se recargue
    event.preventDefault();


    /* ======================================
        OBTENER LA INFORMACIÓN
    ====================================== */

    // Obtenemos el texto escrito por el administrador
    const solucion =
        document.getElementById("textoSolucion").value.trim();

    // Elemento para mostrar mensajes
    const mensaje =
        document.getElementById("mensajeSolucion");

    
    // Ocultamos la barra superior
    usuarioActivo.hidden = true;

    /* ======================================
        VALIDAR REPORTE SELECCIONADO
    ====================================== */

    // Comprobamos que realmente exista un reporte
    // seleccionado antes de guardar la solución

    if (reporteSeleccionado === false) {

        mensaje.textContent = "No se seleccionó ningún reporte";
        return;

    }


    /* ======================================
        VALIDAR LA SOLUCIÓN
    ====================================== */

    // La solución debe contener entre 15 y 300 caracteres

    if (solucion.length < 15 || solucion.length > 300) {

        mensaje.textContent =
            "La solución debe contener entre 15 y 300 caracteres";

        return;

    }


    /* ======================================
        EVITAR SOLUCIONES DUPLICADAS
    ====================================== */

    // No permitimos solucionar nuevamente un reporte
    // que ya fue atendido anteriormente

    if (
        reporteSeleccionado.estado === "Resuelto" ||
        reporteSeleccionado.estado === "Resuelto fuera de tiempo"
    ) {

        mensaje.textContent = "Este reporte ya fue solucionado";
        return;

    }
    // ======================================
    // OBTENER EVIDENCIA DE LA SOLUCIÓN
    // ======================================
    let imagenSolucion = null;

    try {

    const archivo = document.getElementById(
        "evidenciaSolucion"
    ).files[0];

    // Validar que exista una fotografía
    if (!archivo) {
        mensaje.textContent =
            "Debe adjuntar una imagen de la solución";
        return;
    }
        imagenSolucion = await leerImagen(archivo);

    } catch (error) {

        mensaje.textContent = error.message;
        return;
    }


// ==========================================
// GUARDAR LA SOLUCIÓN UTILIZANDO NODE.JS
// ==========================================

try {

    // 1. Enviar la solución al servidor
    const respuesta = await fetch(
        "/api/reportes/" + reporteSeleccionado.numeroFolio,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                solucion: solucion,
                evidenciaSolucion: imagenSolucion
            })
        }
    );

    // 2. Obtener la respuesta de Node.js
    const resultado = await respuesta.json();

    // 3. Comprobar si ocurrió algún error
    if (!respuesta.ok) {

        mensaje.textContent = resultado.mensaje;
        return;

    }

    // 4. Recuperar el reporte actualizado
    const reporteActualizado = resultado.reporte;

    // 5. Actualizar los datos del navegador
    reporteSeleccionado.estado = reporteActualizado.estado;

    reporteSeleccionado.solucion = reporteActualizado.solucion;

    reporteSeleccionado.fechaSolucion =
        new Date(reporteActualizado.fechaSolucion);

    reporteSeleccionado.evidenciaSolucion =
        reporteActualizado.evidenciaSolucion;

    // 6. Mostrar la confirmación
    mensaje.textContent =
        "Solución registrada correctamente. Estado: " +
        reporteSeleccionado.estado;

    // 7. Actualizar el estado mostrado en pantalla
    document.getElementById("solucionEstado").textContent =
        reporteSeleccionado.estado;

    // 8. Limpiar el formulario
    formularioSolucion.reset();
    // Ocultamos el panel de solucionar reportes
panelSolucionReporte.hidden = true;

// Mostramos nuevamente la lista administrativa
panelReportesAdmin.hidden = false;

// Actualizamos la lista para mostrar el reporte solucionado

    // 9. Actualizar las tarjetas con el nuevo estado del reporte
mostrarReportesAdmin();
// Mostramos la notificación de solución registrada
mostrarNotificacionReporte(
    reporteSeleccionado.numeroFolio,
    "solucion"
);


} catch (error) {

    console.log("Error al guardar la solución:", error);

    mensaje.textContent =
        "No se pudo completar la solicitud al servidor";

}

});

// ==========================================
// ACTUALIZAR TEMPORIZADORES EN TIEMPO REAL
// ==========================================

setInterval(function() {

    // Revisamos los estados de los reportes
    actualizarEstados();

    // Buscamos los temporizadores que están en pantalla
    const temporizadores = document.querySelectorAll(
        "[data-temporizador]"
    );

    // Actualizamos cada uno
    temporizadores.forEach(function(elemento) {

        const folio = elemento.dataset.temporizador;

        // Buscamos el reporte correspondiente
        const reporte = reportes.find(function(r) {
            return r.numeroFolio === folio;
        });

        if (reporte) {

            elemento.textContent =
                "Tiempo restante: " +
                calcularTiempoRestante(reporte);

        }
    });

}, 1000);


//Intereccion del estilo de la pagina
//--------------------------------------------------------------------------------------------
// ======================================
// CARRUSEL DE FOTOGRAFÍAS
// ======================================

// Fotografías disponibles
const imagenesFondo = [
    "css/imagen1.jpg",
    "css/imagen2.jpg",
    "css/imagen3.jpg",
    "css/imagen4.jpg"
];
// Posición de la fotografía actual
let indiceFondo = 0;

// Obtenemos las dos capas del fondo
const fondoDinamico = document.getElementById("fondoDinamico");
const fondoSiguiente = document.getElementById("fondoSiguiente");

// Mostramos la primera fotografía
fondoDinamico.style.backgroundImage =
    `url("${imagenesFondo[indiceFondo]}")`;

// Cambiamos la fotografía cada 6 segundos
setInterval(function() {

    // Seleccionamos la siguiente fotografía
    indiceFondo = (indiceFondo + 1) % imagenesFondo.length;

    // Preparamos la fotografía en la segunda capa
    fondoSiguiente.style.backgroundImage =
        `url("${imagenesFondo[indiceFondo]}")`;

    // Iniciamos el desvanecimiento
    fondoSiguiente.style.opacity = "1";

    // Esperamos a que termine la transición
    setTimeout(function() {

        // Actualizamos la fotografía principal
        fondoDinamico.style.backgroundImage =
            `url("${imagenesFondo[indiceFondo]}")`;

        // Ocultamos nuevamente la segunda capa
        fondoSiguiente.style.opacity = "0";

    }, 1500);

}, 6000);
// =====================================
// MOSTRAR Y OCULTAR CONTRASEÑA
// =====================================

const botonOjo = document.getElementById("mostrarContrasena");

const campoContrasena = document.getElementById("contrasena");

botonOjo.addEventListener("click", function() {

    if (campoContrasena.type === "password") {

        // Mostrar contraseña
        campoContrasena.type = "text";

        botonOjo.innerHTML =
            '<i class="icon icon-eye-off" aria-hidden="true"></i>';

        botonOjo.setAttribute("aria-label", "Ocultar contraseña");
        botonOjo.setAttribute("aria-pressed", "true");

    } else {

        // Ocultar contraseña
        campoContrasena.type = "password";

        botonOjo.innerHTML =
            '<i class="icon icon-eye" aria-hidden="true"></i>';

        botonOjo.setAttribute("aria-label", "Mostrar contraseña");
        botonOjo.setAttribute("aria-pressed", "false");

    }

});


// ==========================================
// RECUPERAR REPORTES AL INICIAR EL SISTEMA
// ==========================================

cargarReportes();

// ==========================================
// SELECTOR PERSONALIZADO - TIPO DE USUARIO
// ==========================================

// Obtenemos los elementos del HTML
const botonTipoUsuario = document.getElementById("botonTipoUsuario");
const opcionesTipoUsuario = document.getElementById("opcionesTipoUsuario");
const textoTipoUsuario = document.getElementById("textoTipoUsuario");


// Abrimos o cerramos el menú al presionar el botón
botonTipoUsuario.addEventListener("click", function () {

    if (opcionesTipoUsuario.hidden) {

        opcionesTipoUsuario.hidden = false;
        botonTipoUsuario.setAttribute("aria-expanded", "true");

    } else {

        opcionesTipoUsuario.hidden = true;
        botonTipoUsuario.setAttribute("aria-expanded", "false");

    }

});

// Obtenemos las opciones del menú
const botonesOpciones = opcionesTipoUsuario.querySelectorAll("button");

// Recorremos las opciones
botonesOpciones.forEach(function (opcion) {

    opcion.addEventListener("click", function () {

        // Obtenemos el tipo seleccionado
        const tipoSeleccionado = opcion.dataset.tipo;

        // Actualizamos el select original
        nuevoTipo.value = tipoSeleccionado;

        // Avisamos al programa que cambió el tipo de usuario
        nuevoTipo.dispatchEvent(new Event("change", { bubbles: true }));

        // Mostramos el texto seleccionado
        textoTipoUsuario.textContent = opcion.textContent.trim();

        // Cerramos el menú
        opcionesTipoUsuario.hidden = true;
        botonTipoUsuario.setAttribute("aria-expanded", "false");

    });

});

// Cerramos el menú al hacer clic fuera de él
document.addEventListener("click", function (evento) {

    if (!evento.target.closest(".selector-personalizado")) {

        opcionesTipoUsuario.hidden = true;
        botonTipoUsuario.setAttribute("aria-expanded", "false");

    }

});

// Cerramos el menú al presionar Escape
document.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {

        opcionesTipoUsuario.hidden = true;
        botonTipoUsuario.setAttribute("aria-expanded", "false");

    }

});
// ==========================================
// VISTA PREVIA DE LA IMAGEN DE SOLUCIÓN
// ==========================================

// Obtenemos los elementos del HTML
const evidenciaSolucionInput = document.getElementById("evidenciaSolucion");

const vistaPreviaSolucion = document.getElementById("vistaPreviaSolucion");

const imagenPreviaSolucion = document.getElementById("imagenPreviaSolucion");

// Escuchamos cuando el administrador selecciona una imagen
evidenciaSolucionInput.addEventListener("change", function() {

    // Obtenemos el archivo seleccionado
    const archivo = evidenciaSolucionInput.files[0];

    // Si no seleccionó ninguna imagen, ocultamos la vista previa
    if (!archivo) {
        imagenPreviaSolucion.removeAttribute("src");
        vistaPreviaSolucion.hidden = true;
        return;
    }

    // Comprobamos que el archivo sea una imagen permitida
    if (
        archivo.type !== "image/png" &&
        archivo.type !== "image/jpeg" &&
        archivo.type !== "image/webp"
    ) {
        imagenPreviaSolucion.removeAttribute("src");
        vistaPreviaSolucion.hidden = true;
        return;
    }

    // Creamos una dirección temporal para mostrar la fotografía
    const direccionImagen = URL.createObjectURL(archivo);

    // Mostramos la fotografía seleccionada
    imagenPreviaSolucion.src = direccionImagen;

    // Hacemos visible el contenedor
    vistaPreviaSolucion.hidden = false;

    // Liberamos la dirección temporal después de cargar la imagen
    imagenPreviaSolucion.onload = function() {
        URL.revokeObjectURL(direccionImagen);
    };

});