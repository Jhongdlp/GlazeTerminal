# ESTRATEGIA DE IMPLEMENTACIÓN - GLAZE TERMINAL

Este documento define la ruta crítica para construir Glaze asegurando robustez industrial, escalabilidad y preparación para IA desde el primer día.

---

## FASE 1: EL NÚCLEO DE HIERRO (The Rusty Core)

**Objetivo:** Establecer la comunicación segura y el ciclo de vida del proceso terminal. Sin UI compleja aún.

1.  **Inicialización Tauri v2**: Configuración del entorno Rust y ventanas base.
2.  **Sistema PTY (portable-pty)**:
    - Implementar `PtyManager` en `src-tauri/src/core/`.
    - Lograr que Rust pueda generar un proceso shell (`bash`/`zsh`/`powershell`) y capturar su `stdout`.
3.  **IPC Bridge (Ping-Pong)**:
    - Definir Comandos Tauri: `spawn_pty`, `write_pty`, `resize_pty`.
    - Definir Eventos Tauri: `pty_data`, `pty_exit`.
    - _Prueba de concepto:_ Enviar "ls" desde JS y recibir la lista de archivos en consola.

## FASE 2: MIDDLEWARE & AI HOOKS

**Objetivo:** Crear la infraestructura para que la IA pueda "ver" y "actuar" en el futuro sin refactorizar el núcleo.

1.  **Stream Interceptor**:
    - Crear `MiddlewareTrait` en Rust.
    - Implementar un `PassthroughLayer` que simplemente mueve bytes pero permite "inspectores".
2.  **Buffer de Contexto**:
    - Estructura en memoria (Rust) que guarda las últimas N líneas para que una futura IA tenga contexto inmediato.

## FASE 3: EL MOTOR VISUAL (The Glass Engine)

**Objetivo:** Implementar la interfaz disruptiva sin comprometer el rendimiento (`60fps+`).

1.  **Integración xterm.js**:
    - Encapsular `xterm.js` en un componente React `TerminalView`.
    - Conectar el addon `FitAddon` y `WebLinksAddon`.
2.  **Sistema "Liquid Glass"**:
    - Configurar Tailwind con tokens de opacidad y blur.
    - Implementar el filtro SVG `<feTurbulence>` para la distorsión de fondo.
    - Crear el componente `GlassContainer` que maneje el estado de "foco" y "actividad" para animar la turbulencia.
3.  **Gestor de Pestañas (State Management)**:
    - Store global (Zustand o Context) para manejar N instancias de terminales activas.

## FASE 4: REFINAMIENTO INDUSTRIAL

**Objetivo:** Estabilidad y manejo de errores.

1.  **Graceful Shutdown**: Asegurar que todos los procesos hijos (PTY) mueran si la app se cierra.
2.  **Configuración Dinámica**: Leer `config/defaults/theme.json` al inicio y aplicar variables CSS en caliente.
3.  **Benchmark de Memoria**: Verificar que el "Glassmorphism" no cause fugas de memoria en la GPU.

---

## PRINCIPIOS RECTORES

- **Zero Logic in View**: React solo renderiza. Si hay que calcular algo complejo, se hace en Rust.
- **Event Driven**: Todo es un evento. No hay polling.
- **Extensibility First**: Si añadimos una feature, ¿bloquea a la IA futura? Si sí, está mal diseñada.
