# Instrucciones de workspace para GitHub Copilot

Estas reglas aplican cuando pidas a Copilot que redacte mensajes de commit. Sigue el estándar Conventional Commits definido en `CONTRIBUTING.md`.

## Formato

```
<tipo>(<alcance>): <descripción breve>
```

## Tipos permitidos

- feat – Nueva funcionalidad
- fix – Corrección de bug
- docs – Cambios en documentación
- style – Formato (sin cambios de código)
- refactor – Refactorización de código
- perf – Mejora de rendimiento
- test – Agregar o modificar tests
- chore – Cambios en build, herramientas, etc.

## Reglas del mensaje

1. Tipo: debe ser uno de los listados arriba.
2. Alcance (opcional): módulo o feature afectado (events, auth, teams, ui, api, etc.).
3. Descripción breve:
   - Máximo 72 caracteres.
   - Usa imperativo: «agregar», no «agregado» ni «agrega».
   - Sin punto final.
   - En español.

## Ejemplos válidos

```
feat(events): agregar filtro por fecha
fix(auth): corregir redirección de login
docs(readme): actualizar instrucciones
style(components): formatear con prettier
refactor(api): simplificar manejo de error
perf(list): optimizar renderizado
test(teams): agregar tests unitarios
chore(deps): actualizar dependencias
```

## No hacer

- No usar descripciones genéricas en inglés (p. ej., `update files`).
- No capitalizar después del tipo (p. ej., `Fix bug`).
- No usar punto final (p. ej., `feat: nueva feature.`).
- No usar pasado (p. ej., `Added new filter`).
- No hacer mensajes largos o multilínea para la cabecera.

---

Nota: Este archivo reemplaza las antiguas reglas de `Cursor` y está pensado para que Copilot (Chat y Autocomplete) entienda el contexto del repositorio en VS Code.
