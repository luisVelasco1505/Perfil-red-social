
# Perfil de Red Social – Práctica de Laboratorio
**Asignatura:** Ingeniería Web I  
**Módulo:** Fundamentos de Ingeniería Web y Front-end  
**Tema:** CSS avanzado, Flexbox, CSS Grid y Mobile-First

---

# 1. Introducción

Este proyecto consiste en el desarrollo de un **componente de perfil de usuario de una red social**, implementado únicamente con **HTML5 y CSS3**, aplicando técnicas modernas de maquetación web.

El laboratorio se enfoca en comprender cómo funcionan:

- la **cascada de CSS**
- la **especificidad de selectores**
- los **selectores avanzados**
- los sistemas de layout **Flexbox** y **CSS Grid**
- la metodología **Mobile-First**

Una restricción importante del laboratorio es que **no se permite añadir clases ni IDs al HTML**, lo que obliga a utilizar correctamente los selectores del DOM.

---

# 2. Objetivo del proyecto

Diseñar un componente web responsivo que represente un **perfil de usuario**, aplicando técnicas avanzadas de CSS para controlar completamente la estructura visual del sitio.

El proyecto busca desarrollar habilidades en:

- diseño responsivo
- arquitectura de estilos
- control preciso de selectores
- organización de layouts modernos

---

# 3. Arquitectura del proyecto

La estructura del proyecto sigue una organización simple pero clara para separar contenido y estilos.

```
perfil-red-social
│
├── css
│   └── styles.css
│
├── perfiles
│   └── luis.html
│
├── index.html
│
└── README.md
```

### Descripción de archivos

**index.html**

Contiene el componente principal del perfil, incluyendo:

- fotografía del usuario
- nombre del usuario
- menú de navegación
- descripción o información personal

**css/styles.css**

Archivo donde se implementan todas las reglas de estilo del proyecto, incluyendo:

- estilos base Mobile-First
- Flexbox para navegación
- CSS Grid para layout en escritorio
- pseudo-clases y pseudo-elementos

**perfiles/luis.html**

Página de blog personal de aprendizaje donde se documenta el proceso del laboratorio.

Incluye:

- reflexión sobre especificidad CSS
- explicación de selectores avanzados
- explicación del enfoque Mobile-First
- galería de imágenes con interacción hover

---

# 4. Tecnologías utilizadas

| Tecnología | Uso |
|-----------|-----|
| HTML5 | Estructura semántica del documento |
| CSS3 | Estilización y layout |
| Flexbox | Organización del menú de navegación |
| CSS Grid | Layout de escritorio |
| Media Queries | Adaptación responsiva |
| Git | Control de versiones |
| GitHub | Gestión del repositorio |

---

# 5. Metodología de diseño: Mobile-First

El proyecto se desarrolló siguiendo la metodología **Mobile-First**, que consiste en diseñar primero para dispositivos móviles y posteriormente escalar el diseño para pantallas más grandes.

### Ventajas

- Mejor rendimiento
- Diseño más limpio
- Adaptación natural a pantallas pequeñas
- Escalabilidad del layout

### Implementación

Primero se definieron estilos base:

```css
main{
padding:20px;
}
```

Luego se adaptó el layout para escritorio con media queries:

```css
@media (min-width:768px){
main{
display:grid;
grid-template-columns:1fr 2fr;
gap:20px;
}
}
```

---

# 6. Uso de CSS Grid

CSS Grid se utilizó para dividir el perfil en dos columnas cuando el dispositivo tiene suficiente espacio.

Distribución en escritorio:

```
| Foto + Nombre | Información + Navegación |
```

Ejemplo de implementación:

```css
main{
display:grid;
grid-template-columns:1fr 2fr;
gap:20px;
}
```

Esto permite separar claramente la información del usuario y el contenido principal.

---

# 7. Uso de Flexbox

Flexbox se utilizó para organizar el menú de navegación del perfil.

Objetivos:

- distribuir enlaces horizontalmente
- mantener espaciado uniforme
- permitir adaptación flexible

Ejemplo:

```css
nav ul{
display:flex;
justify-content:center;
gap:30px;
}
```

Esto genera un menú limpio y adaptable.

---

# 8. Selectores avanzados

Debido a la restricción de **no usar clases ni IDs**, el diseño se basó en selectores del DOM.

Ejemplos utilizados:

### Selector descendiente

```
nav ul li a
```

### Selector estructural

```
section:first-child
section:last-child
```

### Pseudo-clases

```
a:hover
```

### Pseudo-elementos

```
h1::before
```

Ejemplo:

```css
h1::before{
content:"👤 ";
}
```

---

# 9. Interacciones visuales

Para mejorar la experiencia del usuario se agregaron efectos visuales utilizando transformaciones CSS.

```css
img:hover{
transform:scale(1.1);
transition:0.3s;
}
```

Esto genera un efecto de zoom suave al pasar el cursor.

---

# 10. Control de versiones

El proyecto utiliza **Git** para el control de versiones y **GitHub** para el almacenamiento del repositorio.

Ejemplo de commits utilizados:

```
init: estructura inicial del proyecto
feat: estructura HTML del perfil
feat: estilos base mobile-first
feat: menú con flexbox
feat: layout con css grid
feat: pseudo-clases y pseudo-elementos
docs: readme del proyecto
```

Esto permite mantener un historial claro del desarrollo.

---

# 11. Ejecución del proyecto

Clonar el repositorio

```
git clone https://github.com/luisVelasco1505/Perfil-red-social.git
```

Entrar al proyecto

```
cd Perfil-red-social
```

Abrir el archivo `index.html` en un navegador web.

Opcionalmente puede ejecutarse con **Live Server en Visual Studio Code**.

---

# 12. Resultados obtenidos

El proyecto logró:

✔ implementar layout responsivo  
✔ aplicar Flexbox correctamente  
✔ utilizar CSS Grid para layouts complejos  
✔ trabajar con selectores avanzados sin clases ni IDs  
✔ aplicar metodología Mobile-First  

Esto demuestra el control de técnicas modernas de maquetación web.

---

# 13. Autor

**Luis Velasco**  
Estudiante de Ingeniería de Software  
Asignatura: Ingeniería Web I