# Trabajo Final Integrador 1°C 2025 - Construcción de Interfaces de Usuario (UNQ)

# Wordle

Implementación del juego Wordle desarrollado con React, TypeScript y Vite.

## Descripción

Este es un juego de palabras donde el jugador debe adivinar una palabra con X cantidad de letras en máximo 6 intentos. Después de cada intento, el juego proporciona pistas visuales sobre qué letras están en la palabra correcta y en qué posición.

## Tecnologías utilizadas

- **React** - Biblioteca para crear interfaces de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite** - Herramienta de desarrollo rápida
- **CSS** - Estilos y animaciones

## Requisitos previos

Antes de comenzar, se necesita tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jovolosin/unq-ui-josefina-volosin-trabajo-final
cd unq-ui-josefina-volosin-trabajo-final
```

### 2. Instalar dependencias

Con npm:

```bash
npm install
```

O con yarn:

```bash
yarn install
```

## Ejecución local

### Modo desarrollo

Para ejecutar el proyecto en modo desarrollo:

Con npm:

```bash
npm run dev
```

O con yarn:

```bash
yarn dev
```

El proyecto se ejecutará en `http://localhost:5173` por defecto.

## Cómo jugar

### Reglas del Juego

1. **Objetivo**: Adivina la palabra secreta en máximo 6 intentos
2. **Escribir**: Escribe una palabra válida en español de la cantidad de letras correspondiente a la dificultad seleccionada y presiona Enter
3. **Evaluar**: El juego evalúa cada letra y marca las pistas con colores
4. **Mejorar**: Usa esas pistas para mejorar tu próximo intento

### Dificultades disponibles

- **Fácil**: 4 letras
- **Intermedio**: 5 letras
- **Difícil**: 6 letras
- **Experto**: 7 letras

### Significado de los colores

- 🟩 **Verde (Correct)**: La letra está en la palabra y en la posición correcta
- 🟨 **Amarillo (Elsewhere)**: La letra está en la palabra pero en posición incorrecta
- ⬜ **Gris (Absent)**: La letra no está en la palabra

### Ejemplo de juego

Supongamos que la palabra secreta es `JUGAR`:

1. **FLETE** → Todas las letras en gris (absent) - ninguna letra está en la palabra
2. **RATON** → La `R` en amarillo (elsewhere), las demás en gris - la R está en la palabra pero no en esa posición
3. **LUGAR** → La `L` en gris (absent), las demás en verde (correct) - solo falta una letra
4. **JUGAR** → ¡Todas en verde! ¡Ganaste!

## Autora

Josefina Volosin - [@jovolosin](https://github.com/jovolosin)
