
// ==========================================
// SERVIDOR LOCAL - SISTEMA DE REPORTES
// ==========================================

// 1. Importar las herramientas necesarias
const express = require("express");
const path = require("path");
const fs = require("fs");

// 2. Crear nuestra aplicación Express
const app = express();

// 3. Definir el puerto del servidor
const puerto = 3000;


// ==========================================
// PERMITIR RECIBIR INFORMACIÓN EN FORMATO JSON
// ==========================================

// Aumentamos el límite porque los reportes
// pueden contener fotografías en Base64.

app.use(express.json({ limit: "10mb" }));

// 5. Permitir cargar los archivos HTML, CSS y JS
app.use(express.static(path.join(__dirname, "src")));

// ==========================================
// LECTURA DE REPORTES DESDE JSON
// ==========================================

// 6. Ubicar el archivo reportes.json
const rutaReportes = path.join(
    __dirname,
    "data",
    "reportes.json"
);

// 7. Crear una ruta para consultar los reportes
app.get("/api/reportes", function(req, res) {

    // Leer el contenido del archivo JSON
    fs.readFile(rutaReportes, "utf8", function(error, datos) {

        // Comprobar si ocurrió algún error
        if (error) {
            console.log("Error al leer los reportes:", error);

            return res.status(500).json({
                mensaje: "No se pudieron leer los reportes"
            });
        }

        // Convertir el texto JSON en un arreglo
        try {
            const reportes = JSON.parse(datos);

            // Enviar los reportes al navegador
            res.json(reportes);

        } catch (error) {
            console.log("Error en el formato JSON:", error);

            res.status(500).json({
                mensaje: "El archivo JSON no es válido"
            });
        }

    });

});

// ==========================================
// ACTUALIZAR LA SOLUCIÓN DE UN REPORTE
// ==========================================

app.put("/api/reportes/:folio", function(req, res) {

    // 1. Obtener el folio enviado en la dirección
    const folio = req.params.folio;

    // 2. Obtener los datos de la solución
    const solucion = req.body.solucion;
    const evidenciaSolucion = req.body.evidenciaSolucion;

    // 3. Validar la información recibida
    if (
        typeof solucion !== "string" ||
        solucion.trim().length < 15 ||
        solucion.trim().length > 300 ||
        typeof evidenciaSolucion !== "string" ||
        !/^data:image\/(jpeg|png|webp);base64,/.test(evidenciaSolucion)
    ) {
        return res.status(400).json({
            mensaje: "Los datos de la solución no son válidos"
        });
    }

    // 4. Leer los reportes guardados
    fs.readFile(rutaReportes, "utf8", function(error, datos) {

        if (error) {
            return res.status(500).json({
                mensaje: "No se pudieron leer los reportes"
            });
        }

        let reportes;

        try {
            reportes = JSON.parse(datos);

            if (!Array.isArray(reportes)) {
                throw new Error("Formato incorrecto");
            }

        } catch (error) {
            return res.status(500).json({
                mensaje: "El archivo JSON no es válido"
            });
        }

        // 5. Buscar el reporte por su folio
        let reporteEncontrado = false;

        for (let i = 0; i < reportes.length; i++) {

            if (reportes[i].numeroFolio === folio) {
                reporteEncontrado = reportes[i];
                break;
            }

        }

        // 6. Comprobar que existe
        if (reporteEncontrado === false) {
            return res.status(404).json({
                mensaje: "Reporte no encontrado"
            });
        }

        // 7. Evitar registrar soluciones duplicadas
        if (
            reporteEncontrado.estado === "Resuelto" ||
            reporteEncontrado.estado === "Resuelto fuera de tiempo"
        ) {
            return res.status(409).json({
                mensaje: "Este reporte ya fue solucionado"
            });
        }

        // 8. Registrar la fecha de solución
        const fechaSolucion = new Date();
        const fechaLimite = new Date(reporteEncontrado.fechaLimite);

        if (isNaN(fechaLimite.getTime())) {
            return res.status(500).json({
                mensaje: "La fecha límite del reporte no es válida"
            });
        }

        // 9. Determinar el estado correspondiente
        if (fechaSolucion <= fechaLimite) {
            reporteEncontrado.estado = "Resuelto";
        } else {
            reporteEncontrado.estado = "Resuelto fuera de tiempo";
        }

        // 10. Guardar los datos de la solución
        reporteEncontrado.solucion = solucion.trim();
        reporteEncontrado.fechaSolucion = fechaSolucion;
        reporteEncontrado.evidenciaSolucion = evidenciaSolucion;

        // 11. Convertir los reportes a JSON
        const contenido = JSON.stringify(reportes, null, 4);

        // 12. Guardar los cambios en el archivo
        fs.writeFile(rutaReportes, contenido, "utf8", function(error) {

            if (error) {
                return res.status(500).json({
                    mensaje: "No se pudo guardar la solución"
                });
            }

            // 13. Confirmar y devolver el reporte actualizado
            res.json({
                mensaje: "Solución guardada correctamente",
                reporte: reporteEncontrado
            });

        });

    });

});

// ==========================================
// ARCHIVOS DE USUARIOS Y ADMINISTRADORES
// ==========================================

// 1. Ubicar los archivos JSON
const rutaUsuarios = path.join(
    __dirname,
    "data",
    "usuarios.json"
);

const rutaAdministradores = path.join(
    __dirname,
    "data",
    "administradores.json"
);

// ==========================================
// FUNCIÓN PARA LEER ARCHIVOS JSON
// ==========================================

// 2. Leer un archivo y convertirlo en un arreglo
function leerArchivoJSON(ruta) {

    // Leer el contenido del archivo
    const datos = fs.readFileSync(ruta, "utf8");

    // Convertir el texto JSON a JavaScript
    const arreglo = JSON.parse(datos);

    // Comprobar que contiene un arreglo
    if (!Array.isArray(arreglo)) {
        throw new Error("El archivo no contiene un arreglo");
    }

    return arreglo;
}

// ==========================================
// COMPROBAR LA LECTURA DE LOS ARCHIVOS
// ==========================================

// 3. Verificar los archivos al iniciar el servidor
try {

    const usuarios = leerArchivoJSON(rutaUsuarios);
    const administradores = leerArchivoJSON(rutaAdministradores);

    console.log("Usuarios cargados:", usuarios.length);
    console.log("Administradores cargados:", administradores.length);

} catch (error) {

    console.error("Error al cargar los archivos:", error.message);

}

// ==========================================
// INICIO DE SESIÓN CON NODE.JS
// ==========================================

app.post("/api/login", function(req, res) {

    // 1. Obtener las credenciales enviadas
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    const tipo = req.body.tipo;

    // 2. Comprobar que recibimos datos válidos
    if (
        typeof usuario !== "string" ||
        typeof contrasena !== "string" ||
        !["estudiante", "docente", "administrador"].includes(tipo)
    ) {
        return res.status(400).json({
            mensaje: "Datos de acceso inválidos"
        });
    }

    // 3. Leer las cuentas almacenadas
    let cuentas;

    try {

        if (tipo === "administrador") {
            cuentas = leerArchivoJSON(rutaAdministradores);
        } else {
            cuentas = leerArchivoJSON(rutaUsuarios);
        }

    } catch (error) {

        console.log("Error al consultar las cuentas:", error);

        return res.status(500).json({
            mensaje: "Error al consultar los usuarios"
        });

    }

    // 4. Buscar una cuenta que coincida
    let cuentaEncontrada = null;

    for (let i = 0; i < cuentas.length; i++) {

        const cuenta = cuentas[i];

        if (
            tipo === "estudiante" &&
            cuenta.tipo === "estudiante" &&
            cuenta.numeroControl === usuario &&
            cuenta.nip === contrasena
        ) {
            cuentaEncontrada = cuenta;
            break;
        }

        if (
            tipo === "docente" &&
            cuenta.tipo === "docente" &&
            cuenta.nombre === usuario &&
            cuenta.contrasena === contrasena
        ) {
            cuentaEncontrada = cuenta;
            break;
        }

        if (
            tipo === "administrador" &&
            cuenta.nombre === usuario &&
            cuenta.contrasena === contrasena
        ) {
            cuentaEncontrada = cuenta;
            break;
        }

    }

    // 5. Rechazar credenciales incorrectas
    if (cuentaEncontrada === null) {

        return res.status(401).json({
            mensaje: "Usuario o contraseña incorrectos"
        });

    }

    // 6. Enviar únicamente los datos necesarios
    res.json({
        mensaje: "Inicio de sesión correcto",
        usuario: {
            nombre: cuentaEncontrada.nombre,
            tipo: tipo
        }
    });

});

// ==========================================
// REGISTRAR UN NUEVO ESTUDIANTE
// ==========================================

app.post("/api/usuarios/estudiantes", function(req, res) {
    
// ==========================================
// REGISTRAR UN NUEVO DOCENTE
// ==========================================

    // 1. Recibimos los datos enviados desde app.js
    const nombre = req.body.nombre;
    const numeroControl = req.body.numeroControl;
    const nip = req.body.nip;

    // 2. Validamos los campos recibidos
    if (
        typeof nombre !== "string" ||
        typeof numeroControl !== "string" ||
        typeof nip !== "string" ||
        nombre.trim() === "" ||
        !/^\d+$/.test(numeroControl) ||
        !/^\d+$/.test(nip)
    ) {

        return res.status(400).json({
            mensaje: "Datos del estudiante inválidos"
        });

    }

    try {

        // 3. Leemos los usuarios guardados en JSON
        const usuariosGuardados = leerArchivoJSON(rutaUsuarios);

        // 4. Comprobamos números de control duplicados
        for (let i = 0; i < usuariosGuardados.length; i++) {

            if (
                usuariosGuardados[i].tipo === "estudiante" &&
                usuariosGuardados[i].numeroControl === numeroControl
            ) {

                return res.status(409).json({
                    mensaje: "El número de control ya existe"
                });

            }

        }

        // 5. Creamos el nuevo estudiante
        const nuevoAlumno = {

            nombre: nombre.trim(),
            numeroControl: numeroControl,
            nip: nip,
            tipo: "estudiante"

        };

        // 6. Lo agregamos al arreglo del servidor
        usuariosGuardados.push(nuevoAlumno);

        // 7. Guardamos el arreglo actualizado en JSON
        fs.writeFileSync(
            rutaUsuarios,
            JSON.stringify(usuariosGuardados, null, 2)
        );

        // 8. Confirmamos el registro
        res.status(201).json({
            mensaje: "Alumno registrado correctamente"
        });

    } catch (error) {

        console.log("Error al registrar estudiante:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar al estudiante"
        });

    }

});

// ==========================================
// REGISTRAR UN NUEVO DOCENTE
// ==========================================

app.post("/api/usuarios/docentes", function(req, res) {


    // 1. Recibimos los datos del formulario
    const nombre = req.body.nombre;
    const contrasena = req.body.contrasena;

    // 2. Validamos los datos recibidos
    if (
        typeof nombre !== "string" ||
        typeof contrasena !== "string" ||
        nombre.trim() === "" ||
        contrasena === ""
    ) {

        return res.status(400).json({
            mensaje: "Complete todos los campos"
        });

    }

    // 3. Evitamos nombres únicamente numéricos
    if (/^\d+$/.test(nombre.trim())) {

        return res.status(400).json({
            mensaje: "El nombre del docente no puede ser numérico"
        });

    }

    try {

        // 4. Leemos las cuentas guardadas
        const usuariosGuardados = leerArchivoJSON(rutaUsuarios);
        const administradoresGuardados =
            leerArchivoJSON(rutaAdministradores);

        // 5. Comprobamos nombres repetidos entre docentes
        for (let i = 0; i < usuariosGuardados.length; i++) {

            if (
                usuariosGuardados[i].tipo === "docente" &&
                usuariosGuardados[i].nombre === nombre.trim()
            ) {

                return res.status(409).json({
                    mensaje: "El nombre de usuario ya existe"
                });

            }

        }

        // 6. Comprobamos nombres repetidos entre administradores
        for (let i = 0; i < administradoresGuardados.length; i++) {

            if (administradoresGuardados[i].nombre === nombre.trim()) {

                return res.status(409).json({
                    mensaje: "El nombre de usuario ya existe"
                });

            }

        }

        // 7. Creamos el objeto del nuevo docente
        const nuevoDocente = {

            nombre: nombre.trim(),
            contrasena: contrasena,
            tipo: "docente"

        };

        // 8. Agregamos el docente al arreglo
        usuariosGuardados.push(nuevoDocente);

        // 9. Guardamos los cambios en usuarios.json
        fs.writeFileSync(
            rutaUsuarios,
            JSON.stringify(usuariosGuardados, null, 2)
        );

        // 10. Confirmamos el registro
        res.status(201).json({
            mensaje: "Docente registrado correctamente"
        });

    } catch (error) {

        console.log("Error al registrar docente:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar al docente"
        });

    }

});

// ==========================================
// REGISTRAR UN NUEVO ADMINISTRADOR
// ==========================================

app.post("/api/administradores", function(req, res) {

    // 1. Obtenemos los datos enviados
    const nombre = req.body.nombre;
    const contrasena = req.body.contrasena;

    // 2. Validamos los campos
    if (
        typeof nombre !== "string" ||
        typeof contrasena !== "string" ||
        nombre.trim() === "" ||
        contrasena === ""
    ) {

        return res.status(400).json({
            mensaje: "Error Campos Vacíos"
        });

    }

    // 3. El nombre no puede ser solamente numérico
    if (/^\d+$/.test(nombre.trim())) {

        return res.status(400).json({
            mensaje: "El nombre del administrador no puede ser numérico"
        });

    }

    try {

        // 4. Leemos los archivos JSON
        const administradoresGuardados =
            leerArchivoJSON(rutaAdministradores);

        const usuariosGuardados =
            leerArchivoJSON(rutaUsuarios);

        // 5. Comprobamos administradores duplicados
        for (let i = 0; i < administradoresGuardados.length; i++) {

            if (administradoresGuardados[i].nombre === nombre.trim()) {

                return res.status(409).json({
                    mensaje: "El nombre de usuario ya existe"
                });

            }

        }

        // 6. Comprobamos nombres de docentes duplicados
        for (let i = 0; i < usuariosGuardados.length; i++) {

            if (
                usuariosGuardados[i].tipo === "docente" &&
                usuariosGuardados[i].nombre === nombre.trim()
            ) {

                return res.status(409).json({
                    mensaje: "El nombre de usuario ya existe"
                });

            }

        }

        // 7. Creamos el nuevo administrador
        const nuevoAdministrador = {

            nombre: nombre.trim(),
            contrasena: contrasena

        };

        // 8. Lo agregamos al arreglo
        administradoresGuardados.push(nuevoAdministrador);

        // 9. Guardamos los cambios permanentemente
        fs.writeFileSync(
            rutaAdministradores,
            JSON.stringify(administradoresGuardados, null, 2)
        );

        // 10. Confirmamos el registro
        res.status(201).json({
            mensaje: "Administrador registrado correctamente"
        });

    } catch (error) {

        console.log("Error al registrar administrador:", error);

        res.status(500).json({
            mensaje: "No se pudo registrar al administrador"
        });

    }

});

// ==========================================
// INICIAR EL SERVIDOR
// ==========================================

app.listen(puerto, function() {
    console.log("Servidor funcionando correctamente");
    console.log("Abre http://localhost:" + puerto);
});




// ==========================================
// GUARDAR NUEVOS REPORTES EN JSON
// ==========================================

// Esta ruta recibe los reportes enviados desde el navegador
app.post("/api/reportes", function(req, res) {

    // 1. Obtener los datos del nuevo reporte
    const nuevoReporte = req.body;

    // 2. Leer los reportes que ya están guardados
    fs.readFile(rutaReportes, "utf8", function(error, datos) {

        if (error) {
            console.log("Error al leer los reportes:", error);

            return res.status(500).json({
                mensaje: "No se pudieron leer los reportes"
            });
        }

        let reportes;

        // 3. Convertir el JSON en un arreglo
        try {
            reportes = JSON.parse(datos);

            if (!Array.isArray(reportes)) {
                throw new Error("El archivo no contiene un arreglo");
            }

        } catch (error) {
            return res.status(500).json({
                mensaje: "El archivo de reportes no es válido"
            });
        }

        // 4. Comprobar que recibimos un reporte válido
        if (
            !nuevoReporte ||
            typeof nuevoReporte.lugar !== "string" ||
            typeof nuevoReporte.tipo !== "string" ||
            typeof nuevoReporte.descripcion !== "string"
        ) {
            return res.status(400).json({
                mensaje: "Datos del reporte incompletos"
            });
        }

        // 5. Agregar el nuevo reporte al arreglo
        reportes.push(nuevoReporte);

        // 6. Convertir el arreglo nuevamente a JSON
        const contenido = JSON.stringify(reportes, null, 4);

        // 7. Guardar los datos en el archivo
        fs.writeFile(rutaReportes, contenido, "utf8", function(error) {

            if (error) {
                console.log("Error al guardar el reporte:", error);

                return res.status(500).json({
                    mensaje: "No se pudo guardar el reporte"
                });
            }

            // 8. Confirmar que el reporte fue guardado
            res.status(201).json({
                mensaje: "Reporte guardado correctamente"
            });

        });

    });

});


