// ALGORITMO 1: BÚSQUEDA DE PALABRAS
/*let descripcion = "No funciona el internet";

let palabra = "internet";

let encontrado = descripcion.includes(palabra);

if (encontrado) {
    console.log("Se encontro la palabra: " + palabra);
} else {
    console.log("No se encontro la palabra");
}
*/
// -------------------------------------

// ALGORITMO 2: BÚSQUEDA LINEAL
/*
let usuarios = [
    "26112171",
    "26112172",
    "26112173",
    "26112174"
];

let buscado = prompt("Ingrese el numero de control:");

let encontrado = false;

for (let i = 0; i < usuarios.length; i++) {

    if (usuarios[i] === buscado) {
        encontrado = true;
    }

}

if (encontrado) {
    console.log("Usuario encontrado");
} else {
    console.log("Usuario no encontrado");
}
*/

// ALGORITMO 3: VALIDACIÓN DE INICIO DE SESIÓN
/*
let usuarioRegistrado = "26112171";
let nipRegistrado = "1234";

let numeroControl = prompt("Ingrese su numero de control:");
let nip = prompt("Ingrese su NIP:");

if (numeroControl === usuarioRegistrado && nip === nipRegistrado) {

    console.log("Acceso permitido");
    console.log("Bienvenido al sistema");

} else {

    console.log("Credenciales incorrectas");

}
*/

// ALGORITMO 4: CLASIFICACIÓN DE REPORTES
/*
let pendientes = [];
let solucionados = [];

let totalPendientes = 0;
let totalSolucionados = 0;

let reporte = prompt("Ingrese el nombre del reporte:");

let estado = prompt("Ingrese el estado (Pendiente o Solucionado):");

if (estado === "Pendiente") {

    totalPendientes = totalPendientes + 1;

    pendientes[totalPendientes - 1] = reporte;

    console.log("Reporte agregado a pendientes");

} else {

    if (estado === "Solucionado") {

        totalSolucionados = totalSolucionados + 1;

        solucionados[totalSolucionados - 1] = reporte;

        console.log("Reporte agregado a solucionados");

    } else {

        console.log("Estado no valido");

    }

}
*/

// ALGORITMO 5: MODIFICACIÓN DEL ESTADO
/*
let folios = [
    "REP-001",
    "REP-002",
    "REP-003"
];

let estados = [
    "Pendiente",
    "Pendiente",
    "Pendiente"
];

let folioBuscado = prompt("Ingrese el folio del reporte:");

let encontrado = false;

for (let i = 0; folios.length < 3; i++) {

    if (folios[i] === folioBuscado) {

        encontrado = true;

        if (estados[i] === "Pendiente") {

            estados[i] = "Solucionado";

            console.log("Estado actualizado correctamente");

        } else {

            console.log("El reporte ya esta solucionado");

        }

    }

}

if (!encontrado) {
    console.log("Reporte no encontrado");
}
*/


//FUERA DE TIEMPO
// Buscar el folio 001
/*
let prueba = reportes.find(function(r) {
    return r.numeroFolio === "001";
});

if (prueba) {

    // Simular que ya venció su fecha límite
    prueba.fechaLimite = new Date();

    prueba.fechaLimite.setDate(
        prueba.fechaLimite.getDate() - 4
    );

    // Actualizar el estado del reporte
    actualizarEstados();

    // Actualizar las tarjetas de la página
    mostrarReportesAdmin();

    console.log("Estado actualizado:", prueba.estado);
}
    */

//SOLUCIONADO FUERA DE TIEMPO

// Buscar el folio 001
/*
let reporteAmarillo = reportes.find(function(r) {
    return r.numeroFolio === "001";
});

if (reporteAmarillo) {

    // Cambiar el estado temporalmente
    reporteAmarillo.estado = "Resuelto fuera de tiempo";

    // Actualizar las tarjetas
    mostrarReportesAdmin();

    // Buscar la tarjeta del folio
    let tarjeta = document.querySelector(
        '[data-folio="001"]'
    );

    // Buscar la etiqueta del estado
    if (tarjeta) {

        let etiqueta = tarjeta.querySelector(".estado-reporte");

        if (etiqueta) {
            etiqueta.style.backgroundColor = "#fff3cd";
            etiqueta.style.color = "#856404";
        }
    }
}
    */


// ==========================================
// GENERAR 20 REPORTES AUTOMÁTICAMENTE
// ==========================================
/*
async function generar20Reportes() {

    // 1. Definir los reportes de prueba
    let datosReportes = [

        {
            lugar: "Laboratorio de Cómputo A",
            tipo: "Equipo de cómputo",
            descripcion: "La computadora número 12 no enciende y presenta fallas en la fuente de alimentación."
        },
        {
            lugar: "Baños del edificio B",
            tipo: "Mantenimiento",
            descripcion: "Uno de los lavamanos presenta una fuga constante de agua y el piso permanece mojado."
        },
        {
            lugar: "Aula 204",
            tipo: "Equipo audiovisual",
            descripcion: "El proyector no muestra imagen al conectarlo a la computadora del docente."
        },
        {
            lugar: "Biblioteca",
            tipo: "Internet",
            descripcion: "La conexión inalámbrica presenta interrupciones constantes que dificultan las actividades académicas."
        },
        {
            lugar: "Estacionamiento principal",
            tipo: "Seguridad",
            descripcion: "Varias lámparas del estacionamiento no funcionan durante el horario nocturno."
        },
        {
            lugar: "Cafetería",
            tipo: "Limpieza",
            descripcion: "Se encontraron residuos de comida y basura acumulada en las mesas del área de comedor."
        },
        {
            lugar: "Laboratorio de Electrónica",
            tipo: "Equipo de laboratorio",
            descripcion: "Uno de los multímetros presenta lecturas incorrectas durante las prácticas."
        },
        {
            lugar: "Aula 105",
            tipo: "Mobiliario",
            descripcion: "Cinco sillas presentan daños en sus respaldos y representan un riesgo para los estudiantes."
        },
        {
            lugar: "Pasillo del edificio C",
            tipo: "Mantenimiento",
            descripcion: "Se detectaron losetas desprendidas que podrían provocar tropiezos."
        },
        {
            lugar: "Centro de Cómputo",
            tipo: "Software",
            descripcion: "Varias computadoras no cuentan con el programa necesario para realizar las prácticas de programación."
        },
        {
            lugar: "Cancha deportiva",
            tipo: "Infraestructura",
            descripcion: "Una sección de la malla perimetral está desprendida y requiere reparación."
        },
        {
            lugar: "Baños del edificio A",
            tipo: "Limpieza",
            descripcion: "Los sanitarios requieren limpieza y reposición de jabón y papel higiénico."
        },
        {
            lugar: "Laboratorio de Redes",
            tipo: "Internet",
            descripcion: "Los equipos conectados por cable de red presentan desconexiones durante las prácticas."
        },
        {
            lugar: "Aula 302",
            tipo: "Climatización",
            descripcion: "El aire acondicionado no enfría correctamente y la temperatura del salón es elevada."
        },
        {
            lugar: "Entrada principal",
            tipo: "Seguridad",
            descripcion: "La puerta de acceso presenta dificultades para cerrar correctamente."
        },
        {
            lugar: "Biblioteca digital",
            tipo: "Equipo de cómputo",
            descripcion: "Dos computadoras presentan lentitud excesiva y se reinician inesperadamente."
        },
        {
            lugar: "Auditorio",
            tipo: "Equipo audiovisual",
            descripcion: "El sistema de sonido produce interferencias y uno de los micrófonos no funciona."
        },
        {
            lugar: "Área de jardines",
            tipo: "Mantenimiento",
            descripcion: "El sistema de riego presenta una fuga que provoca acumulación de agua cerca del andador."
        },
        {
            lugar: "Oficina de Servicios Escolares",
            tipo: "Atención administrativa",
            descripcion: "Se reportan tiempos de espera prolongados para recibir información sobre trámites escolares."
        },
        {
            lugar: "Laboratorio de Programación",
            tipo: "Software",
            descripcion: "El entorno de desarrollo instalado en varias computadoras no permite ejecutar correctamente los programas."
        }

    ];

    // 2. Consultar los reportes existentes
    const respuesta = await fetch("/api/reportes");

    if (!respuesta.ok) {
        console.log("Error al consultar los reportes");
        return;
    }

    const existentes = await respuesta.json();

    // 3. Buscar el folio más alto
    let ultimoFolio = 0;

    for (let i = 0; i < existentes.length; i++) {

        let numero = Number(existentes[i].numeroFolio);

        if (numero > ultimoFolio) {
            ultimoFolio = numero;
        }
    }

    // 4. Generar los 20 reportes
    for (let i = 0; i < datosReportes.length; i++) {

        // Crear número de folio
        let nuevoFolio = String(ultimoFolio + i + 1).padStart(3, "0");

        // Fecha de creación
        let fecha = new Date();

        // Fecha límite de prueba
        let fechaLimite = new Date(fecha);
        fechaLimite.setDate(fechaLimite.getDate() + 3);

        // Crear objeto del reporte
        let nuevoReporte = {

            numeroFolio: nuevoFolio,

            lugar: datosReportes[i].lugar,

            tipo: datosReportes[i].tipo,

            descripcion: datosReportes[i].descripcion,

            fecha: fecha,

            fechaLimite: fechaLimite,

            estado: "Pendiente",

            solucion: "",

            evidenciaProblema: null,

            evidenciaSolucion: null

        };

        // 5. Enviar reporte a Node.js
        let guardar = await fetch("/api/reportes", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(nuevoReporte)

        });

        if (!guardar.ok) {
            console.log("Error al guardar el folio:", nuevoFolio);
            break;
        }

        console.log(
            "Folio creado:",
            nuevoFolio,
            "| Lugar:",
            nuevoReporte.lugar,
            "| Tipo:",
            nuevoReporte.tipo
        );
    }

    // 6. Actualizar reportes e interfaz
    await cargarReportes();

    mostrarReportesAdmin();

    console.log("Proceso de generación terminado");
}

// Ejecutar el algoritmo
generar20Reportes();
*/