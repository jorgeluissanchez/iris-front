# Guía de Contribución

¡Gracias por tu interés en contribuir! 🎉

Este documento proporciona lineamientos y mejores prácticas para contribuir al proyecto. Siguiendo estas guías ayudas a mantener la calidad del código y facilita la colaboración entre todos los miembros del equipo.

## ¿Cómo Puedo Contribuir?

1. **Haz un Fork del repositorio** en GitHub

2. **Clona tu fork localmente:**
   ```bash
   git clone https://github.com/TU_USUARIO/iris-front.git
   cd iris-front
   ```

3. **Configura el repositorio original como upstream:**
   ```bash
   git remote add upstream https://github.com/jorgeluissanchez/iris-front.git
   ```

4. **Instala las dependencias:**
   ```bash
   pnpm install
   ```

5. **Crea una rama siguiendo la [convención de nombres](#convención-de-nombres-de-ramas):**
   ```bash
   git checkout -b feat/mi-nueva-funcionalidad
   ```

6. **Realiza tus cambios** y haz commits siguiendo la [convención de commits](#convención-de-commits):
   ```bash
   git add .
   git commit -m "feat(events): agregar nueva funcionalidad"
   ```

7. **Mantén tu rama actualizada:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

8. **Push a tu fork:**
   ```bash
   git push origin feat/mi-nueva-funcionalidad
   ```

9. **Crea un Pull Request** usando el [template de PR](#template-de-pull-request)

## Flujo de Trabajo con Git

### Convención de Nombres de Ramas

Usa el siguiente formato: `{tipo}/{descripción-breve}`

| Tipo       | Uso                                      | Ejemplo                           |
|------------|------------------------------------------|-----------------------------------|
| `feat/`    | Nueva funcionalidad                      | `feat/add-team-filtering`         |
| `fix/`     | Corrección de errores                    | `fix/event-date-validation`       |
| `refactor/`| Refactorización de código               | `refactor/auth-service`           |
| `docs/`    | Cambios en documentación                | `docs/update-contributing-guide`  |
| `style/`   | Cambios de formato (no afectan lógica)  | `style/format-components`         |
| `test/`    | Agregar o modificar tests               | `test/add-event-api-tests`        |
| `chore/`   | Tareas de mantenimiento                 | `chore/update-dependencies`       |
| `perf/`    | Mejoras de rendimiento                  | `perf/optimize-event-list`        |


### Convención de Commits

Seguimos el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance>): <descripción breve>
```

#### Tipos de Commit

| Tipo        | Uso                                              | Ejemplo                                      |
|-------------|--------------------------------------------------|----------------------------------------------|
| `feat`      | Nueva funcionalidad                              | `feat(events): agregar filtro por fecha`     |
| `fix`       | Corrección de bug                                | `fix(auth): corregir redirección de login`   |
| `docs`      | Cambios en documentación                         | `docs(readme): actualizar instrucciones`     |
| `style`     | Formato, punto y coma (sin cambios de código)   | `style(components): formatear con prettier`  |
| `refactor`  | Refactorización de código                        | `refactor(api): simplificar manejo de error` |
| `perf`      | Mejora de rendimiento                            | `perf(list): optimizar renderizado`          |
| `test`      | Agregar o modificar tests                        | `test(teams): agregar tests unitarios`       |
| `chore`     | Cambios en build, herramientas, etc.            | `chore(deps): actualizar dependencias`       |

### Convención de Pull Requests

El título del Pull Request debe seguir el mismo formato que los commits: `<tipo>(<alcance>): <descripción breve>`

#### Tipos de Pull Request

| Tipo        | Uso                                              | Ejemplo                                           |
|-------------|--------------------------------------------------|---------------------------------------------------|
| `feat`      | Nueva funcionalidad                              | `feat(events): agregar sistema de filtros`        |
| `fix`       | Corrección de bug                                | `fix(auth): resolver problema de redirección`     |
| `docs`      | Cambios en documentación                         | `docs(contributing): actualizar guía`             |
| `style`     | Formato, estilos (sin cambios de código)        | `style(ui): aplicar nuevos estilos a botones`     |
| `refactor`  | Refactorización de código                        | `refactor(hooks): optimizar custom hooks`         |
| `perf`      | Mejora de rendimiento                            | `perf(queries): mejorar caché de React Query`     |
| `test`      | Agregar o modificar tests                        | `test(integration): agregar tests de formularios` |
| `chore`     | Cambios en build, herramientas, etc.            | `chore(ci): configurar GitHub Actions`            |

#### Template de Pull Request

Al crear un Pull Request en GitHub, **automáticamente se cargará un template** (ubicado en `.github/pull_request_template.md`) que incluye:

- **Descripción**: Resumen de los cambios
- **Tipo de cambio**: Checkboxes para identificar el tipo (bug fix, feature, etc.)
- **Capturas y videos**: Espacio para evidencia visual
- **Checklist**: Verificaciones obligatorias antes de enviar el PR
- **Issues relacionados**: Referencias a issues que resuelve o relaciona

**Completa todas las secciones del template** antes de solicitar revisión.
