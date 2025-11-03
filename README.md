<div align="center">

<strong><h1>Iris - Sistema de Evaluación de Proyectos</h1></strong>

<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br>

<a href="https://github.com/jorgeluissanchez/iris-front" target="_blank" rel="noopener noreferrer">
  <img width="100px" height="100px" src="./public/logoUninorte.png" alt="Logo Universidad del Norte" />
</div>

</a>

<br>
<br>

## 📎 Descripción

**Iris** es una aplicación web diseñada para facilitar la administración y calificación de proyectos por parte de jurados en eventos académicos y competencias. El sistema permite gestionar eventos, equipos, evaluaciones y comentarios de manera eficiente y organizada.

### Contexto del Proyecto

Este proyecto fue desarrollado por estudiantes de la **Universidad del Norte** como parte de la materia **Diseño de Software 2**, bajo la dirección del profesor **Daniel Romero**. El objetivo es aplicar principios de ingeniería de software moderna y mejores prácticas en el desarrollo de aplicaciones web.

### Características Principales

- 🎯 **Gestión de Eventos**: Creación y administración de eventos con fechas de inicio, fin e inscripción
- 👥 **Gestión de Equipos**: Organización de equipos participantes y sus miembros
- ⭐ **Sistema de Evaluación**: Calificación de proyectos por parte de jurados autorizados
- 💬 **Comentarios y Discusiones**: Sistema de retroalimentación y comunicación
- 🔐 **Autenticación y Autorización**: Control de acceso basado en roles
- 📊 **Panel de Administración**: Vista completa del estado de evaluaciones y participantes

<p align="right">
    (<strong><a href="#readme-top">regresar</a></strong>)
    (<a href="#readme-index">índice</a>)
</p>

<a name="readme-index"></a>

---

## 🗂️ Índice

<details open>
    <summary>
        <a href="#readme-index" title="Más...">Iris - Sistema de Evaluación de Proyectos</a>
    </summary>

- 📎 <a href="#readme-top" title="Ir a la Descripción">Descripción</a>
- 🗂️ <a href="#readme-index" title="Ir al Índice"><strong>Índice</strong></a> <span><strong>< Usted está aquí ></strong></span>
- 🚀 <a href="#readme-stack" title="Ir al Stack Tecnológico">Tech Stack</a>
- 🏗️ <a href="#readme-architecture" title="Ir a Arquitectura">Arquitectura del Proyecto</a>
- 🧑‍💻 <a href="#readme-clone" title="Ir a Desarrollo Local">Desarrollo Local</a>
- 📜 <a href="#readme-scripts" title="Ir a Scripts">Scripts Disponibles</a>
- ☝️🖥️ <a href="#readme-contribute" title="Ir a Contribuir">¿Cómo Contribuir?</a>
- 👥 <a href="#readme-team" title="Ir al Equipo">Equipo de Desarrollo</a>

</details>

<p align="right">
    (<a href="#readme-top">regresar</a>)
    (<strong><a href="#readme-index">índice</a></strong>)
</p>

<a name="readme-stack"></a>

---

## 🚀 Tech Stack

### Framework y Librerías Principales

- [![Next.js][nextjs-badge]][nextjs-url] - Framework de React con renderizado del lado del servidor
- [![React][react-badge]][react-url] - Biblioteca de JavaScript para construir interfaces de usuario
- [![TypeScript][typescript-badge]][typescript-url] - JavaScript con tipado estático
- [![Tailwind CSS][tailwind-badge]][tailwind-url] - Framework CSS utility-first

### UI y Componentes

- [![HeroUI][heroui-badge]][heroui-url] - Biblioteca de componentes UI moderna y accesible
- [![Radix UI][radix-badge]][radix-url] - Componentes UI primitivos sin estilos
- [![Framer Motion][framer-badge]][framer-url] - Biblioteca de animaciones para React
- [![Lucide React][lucide-badge]][lucide-url] - Iconos modernos y personalizables

### Gestión de Estado y Datos

- [![TanStack Query][tanstack-badge]][tanstack-url] - Gestión de estado del servidor y caché
- [![Zustand][zustand-badge]][zustand-url] - Gestión de estado global ligera
- [![React Hook Form][rhf-badge]][rhf-url] - Manejo eficiente de formularios
- [![Zod][zod-badge]][zod-url] - Validación de esquemas con TypeScript

### Testing y Calidad de Código

- [![Vitest][vitest-badge]][vitest-url] - Framework de testing unitario
- [![Playwright][playwright-badge]][playwright-url] - Testing end-to-end
- [![Testing Library][testing-library-badge]][testing-library-url] - Utilities para testing de componentes
- [![ESLint][eslint-badge]][eslint-url] - Linter para JavaScript/TypeScript
- [![Prettier][prettier-badge]][prettier-url] - Formateador de código

### Herramientas de Desarrollo

- [![Storybook][storybook-badge]][storybook-url] - Desarrollo y documentación de componentes UI
- [![MSW][msw-badge]][msw-url] - Mocking de APIs para testing
- [![Husky][husky-badge]][husky-url] - Git hooks para automatización
- [![pnpm][pnpm-badge]][pnpm-url] - Gestor de paquetes rápido y eficiente

<p align="right">
    (<a href="#readme-top">regresar</a>)
    (<a href="#readme-index">índice</a>)
</p>

<a name="readme-architecture"></a>

---

## 🏗️ Arquitectura del Proyecto

Este proyecto sigue una arquitectura **Feature-Based** inspirada en [Bulletproof React](https://github.com/alan2207/bulletproof-react), que organiza el código por funcionalidades en lugar de por tipos de archivo.

### Estructura de Carpetas

```
src/
├── app/                  # Páginas y rutas de Next.js 
├── components/           # Componentes compartidos y UI base
│   └── ui/               # Componentes de interfaz reutilizables
├── config/               # Configuraciones de la aplicación
├── features/             # Funcionalidades principales
├── hooks/                # Custom hooks compartidos
├── lib/                  # Utilidades y configuraciones de librerías
├── styles/               # Estilos globales
├── testing/              # Configuración y utilidades de testing
├── types/                # Tipos TypeScript globales
└── utils/                # Funciones auxiliares
```
<p align="right">
    (<a href="#readme-top">regresar</a>)
    (<a href="#readme-index">índice</a>)
</p>

<a name="readme-clone"></a>

---

## 🧑‍💻 Desarrollo Local

> Deberá tener instalado [Node.js 18+](https://nodejs.org/) y [pnpm][pnpm-url]

### Instalación de pnpm

Si no tiene pnpm instalado, puede instalarlo con:

```bash
npm install -g pnpm
```

### Pasos Manuales

1. **Clone el repositorio:**

   ```bash
   git clone https://github.com/jorgeluissanchez/iris-front.git
   ```

2. **Entre en el directorio del proyecto:**

   ```bash
   cd iris-front
   ```

3. **Instale las dependencias:**

   ```bash
   pnpm install
   ```

4. **Configure las variables de entorno:**

   Cree un archivo `.env.local` en la raíz del proyecto con las variables necesarias:

   ```bash
   # Linux/MacOS:
   cp .env.example .env.local

   # Windows:
   copy .env.example .env.local
   ```

5. **Inicie el servidor de desarrollo:**

   ```bash
   # Frontend:
   pnpm run dev
   
   # Servidor de mocks (MSW):
   pnpm run run-mock-server
   ```

6. **Abra el navegador en:**

   ⇒ [http://localhost:3000](http://localhost:3000)

<p align="right">
    (<a href="#readme-top">regresar</a>)
    (<a href="#readme-index">índice</a>)
</p>

<a name="readme-scripts"></a>

---

## 👥 Equipo de Desarrollo

### Universidad del Norte
**Diseño de Software 2**

**Profesor:** Daniel Romero

Este proyecto es desarrollado por estudiantes de Ingeniería de Sistemas como parte de su formación académica en diseño y arquitectura de software.

---

<br>
<br>
<br>

<div align="center">

**¡Gracias a todos los colaboradores por su esfuerzo y dedicación!**

[![Contribuidores](https://contrib.rocks/image?repo=jorgeluissanchez/iris-front&max=500&columns=20)](https://github.com/jorgeluissanchez/iris-front/graphs/contributors)

</div>

<!-- Repository Links -->

[contributors-shield]: https://img.shields.io/github/contributors/jorgeluissanchez/iris-front.svg?style=for-the-badge
[contributors-url]: https://github.com/jorgeluissanchez/iris-front/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jorgeluissanchez/iris-front.svg?style=for-the-badge
[forks-url]: https://github.com/jorgeluissanchez/iris-front/network/members
[stars-shield]: https://img.shields.io/github/stars/jorgeluissanchez/iris-front.svg?style=for-the-badge
[stars-url]: https://github.com/jorgeluissanchez/iris-front/stargazers
[issues-shield]: https://img.shields.io/github/issues/jorgeluissanchez/iris-front.svg?style=for-the-badge
[issues-url]: https://github.com/jorgeluissanchez/iris-front/issues

<!-- Tech Stack Links -->

[nextjs-url]: https://nextjs.org/
[react-url]: https://react.dev/
[typescript-url]: https://www.typescriptlang.org/
[tailwind-url]: https://tailwindcss.com/
[heroui-url]: https://www.heroui.com/
[radix-url]: https://www.radix-ui.com/
[framer-url]: https://www.framer.com/motion/
[lucide-url]: https://lucide.dev/
[tanstack-url]: https://tanstack.com/query/latest
[zustand-url]: https://zustand-demo.pmnd.rs/
[rhf-url]: https://react-hook-form.com/
[zod-url]: https://zod.dev/
[vitest-url]: https://vitest.dev/
[playwright-url]: https://playwright.dev/
[testing-library-url]: https://testing-library.com/
[eslint-url]: https://eslint.org/
[prettier-url]: https://prettier.io/
[storybook-url]: https://storybook.js.org/
[msw-url]: https://mswjs.io/
[husky-url]: https://typicode.github.io/husky/
[pnpm-url]: https://pnpm.io/installation

<!-- Badges -->

[nextjs-badge]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white
[react-badge]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black
[typescript-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[heroui-badge]: https://img.shields.io/badge/HeroUI-7C3AED?style=for-the-badge&logo=react&logoColor=white
[radix-badge]: https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white
[framer-badge]: https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white
[lucide-badge]: https://img.shields.io/badge/Lucide-F56565?style=for-the-badge&logo=lucide&logoColor=white
[tanstack-badge]: https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white
[zustand-badge]: https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white
[rhf-badge]: https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white
[zod-badge]: https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white
[vitest-badge]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white
[playwright-badge]: https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white
[testing-library-badge]: https://img.shields.io/badge/Testing_Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white
[eslint-badge]: https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white
[prettier-badge]: https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black
[storybook-badge]: https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white
[msw-badge]: https://img.shields.io/badge/MSW-FF6A33?style=for-the-badge&logo=mock-service-worker&logoColor=white
[husky-badge]: https://img.shields.io/badge/Husky-42B983?style=for-the-badge&logo=git&logoColor=white
[pnpm-badge]: https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white

<!-- Other Links -->

[how-to-fork-tutorial]: https://docs.github.com/es/get-started/quickstart/fork-a-repo
