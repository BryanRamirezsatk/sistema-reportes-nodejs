# Requisitos del Sistema

## 1. Inicio de sesión

### RF01 - Identificación del usuario

El sistema deberá permitir que los usuarios inicie sesión mediante
su número de control y contraseña.

### RF02 - Validación de credenciales

El sistema deberá comprobar que el número de control y la contraseña
correspondan a un usuario registrado.

Si las credenciales son incorrectas, el sistema deberá impedir el
acceso y mostrar un mensaje de error.

### RF03 - Tipos de usuario

El sistema contará con dos roles:

- Estudiante
- Administrador

Ambos tipos de usuario utilizarán la misma interfaz de inicio de sesión.

### RF04 - Acceso según el rol

Después de iniciar sesión correctamente, el sistema deberá identificar
el rol del usuario y proporcionar las funciones correspondientes a
dicho rol.


## 2. Creación de reportes

### RF05 - Nuevo reporte

El sistema deberá permitir a los estudiantes autenticados crear
un nuevo reporte.

### RF06 - Información del reporte

El usuario deberá proporcionar los siguientes datos:

- Lugar
- Tipo de problema
- Descripción

### RF07 - Tipos de problema

El usuario deberá seleccionar el tipo de problema de una lista
predefinida con las siguientes categorías:

- Infraestructura
- Limpieza
- Seguridad
- Equipo o mobiliario
- Servicios
- Problema académico

### RF08 - Información automática

Al crear un reporte, el sistema deberá generar automáticamente:

- Número de folio
- Fecha
- Estado

El estado inicial de un reporte será "Pendiente".

### RF09 - Anonimato

Los reportes serán anónimos.

La información personal del estudiante, incluyendo nombre y número
de control, no será almacenada como parte de la información pública
del reporte.

### RF10 - Validación del lugar

El campo "Lugar" será obligatorio.

El lugar deberá:

- Contener entre 5 y 100 caracteres.
- No estar compuesto únicamente por espacios.
- No estar compuesto únicamente por números o caracteres especiales.

El sistema eliminará los espacios innecesarios al inicio y al final
del texto.

La interfaz mostrará un ejemplo para orientar al usuario sobre cómo
describir la ubicación del problema.

### RF11 - Validación de la descripción

El campo "Descripción" será obligatorio.

La descripción deberá:

- Contener entre 15 y 300 caracteres.
- No estar compuesta únicamente por espacios.
- No estar compuesta únicamente por números o caracteres especiales.

El sistema eliminará los espacios innecesarios al inicio y al final
del texto.

La interfaz mostrará un texto de ayuda indicando al usuario que debe
describir claramente el problema presentado.

### RF12 - Generación del reporte

Al presionar el botón "Generar reporte", el sistema deberá validar
los campos Lugar, Tipo y Descripción.

Si alguno de los campos no cumple con las validaciones establecidas,
el reporte no deberá generarse y el sistema deberá indicar los
campos que deben corregirse.

Si todos los campos son válidos, el sistema deberá:

- Generar un número de folio.
- Registrar la fecha de creación.
- Asignar el estado inicial "Pendiente".
- Crear el objeto correspondiente al reporte.
- Agregar el reporte al array de reportes.
- Mostrar al usuario el mensaje "Reporte solucionado".

## 3. Visualización de reportes

### RF13 - Consulta de reportes

El sistema deberá permitir a los estudiantes visualizar los reportes
generados en la institución.

Todos los estudiantes podrán visualizar todos los reportes registrados.

### RF14 - Información visible del reporte

Cada reporte deberá mostrar:

- Número de folio
- Lugar
- Tipo
- Descripción
- Fecha
- Estado

No se mostrará información personal del usuario que realizó el reporte.

### RF15 - Identificación del folio

El número de folio deberá mostrarse de manera resaltada para facilitar
la identificación de cada reporte.

### RF16 - Visualización del estado

El estado del reporte deberá mostrarse de manera resaltada para que
pueda identificarse fácilmente.

Los estados disponibles inicialmente serán:

- Pendiente
- Solucionado

### RF17 - Modificación del estado

Los estudiantes no podrán modificar el estado de los reportes.

La modificación del estado estará disponible únicamente para usuarios
con rol de administrador.

## 4. Administradores

### RF18 - Inicio de sesión del administrador

El administrador deberá iniciar sesión mediante su nombre de usuario
y contraseña.

El usuario no tendrá que indicar si es estudiante o administrador.
El sistema determinará el tipo de usuario mediante las credenciales
proporcionadas.

### RF19 - Panel del administrador

El administrador tendrá acceso a las siguientes opciones:

- Agregar estudiante
- Agregar administrador
- Ver reportes

### RF20 - Agregar estudiante

Para registrar un nuevo estudiante, el administrador deberá
proporcionar:

- Nombre
- Número de control
- Contraseña

El nuevo estudiante será agregado al array de estudiantes.

### RF21 - Agregar administrador

Para registrar un nuevo administrador se deberá proporcionar:

- Nombre de usuario
- Contraseña

El nuevo administrador será agregado al array de administradores.

### RF22 - Gestión de reportes

El administrador podrá visualizar todos los reportes registrados
y modificar su estado.

### RF23 - Cambio de estado

El administrador podrá cambiar el estado de un reporte de
"Pendiente" a "Solucionado".

### RF24 - Descripción de la solución

Para cambiar un reporte al estado "Solucionado", el administrador
deberá proporcionar una descripción de la solución realizada.

La descripción de la solución deberá:

- Ser obligatoria.
- Contener entre 15 y 300 caracteres.
- No estar compuesta únicamente por espacios.
- No estar compuesta únicamente por números o caracteres especiales.

Si la descripción no cumple con las validaciones, el estado del
reporte no deberá modificarse.

### RF25 - Actualización del reporte

Cuando la solución sea válida, el sistema deberá:

- Cambiar el estado del reporte a "Solucionado".
- Guardar la descripción de la solución.
- Actualizar el reporte correspondiente dentro del array de reportes.

Los cambios deberán reflejarse en la visualización de reportes
para estudiantes y administradores.

### RF26 - Visualización de la solución

Cuando un reporte tenga el estado "Solucionado", los usuarios podrán
visualizar la descripción de la solución realizada.