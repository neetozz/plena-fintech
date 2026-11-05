# Plena

Concepto ficticio de fintech para portafolio, desarrollado con React, Vite y CSS. No ofrece servicios financieros, no realiza operaciones ni solicita información financiera. Todos los datos son ficticios y viven en memoria.

## Desarrollo

Requiere Node.js 20.19+ o 22.12+ y npm.

```sh
npm install
npm run dev
```

Dirección: http://localhost:5175/

El script usa el puerto **5175** con `strictPort`: si está ocupado, falla en lugar de tomar otro. No modifica servidores de otros proyectos.

```sh
npm test
npm run build
```

La compilación estática queda en `dist/`.

## Experiencia

- Se conserva el inicio, la paleta, el logo, la navegación de vidrio y la tarjeta CSS/SVG original: giro, inclinación, tres acabados y congelado.
- **Tu espacio** tiene tres vistas mediante botones accesibles: Resumen (saldo, gráfico y tres movimientos recientes), Movimientos (historial y filtros) y Metas (progreso compartido con el simulador). La ventana conserva su altura al navegar; el contenido extenso tiene desplazamiento interno.
- **Una fuente de estado** en React (`DemoContext.jsx` y `demo.js`) reúne movimientos, período, vistas, filtros, metas y comprobante. Saldo, ingresos, gastos y puntos del gráfico se derivan de ese estado, con centavos enteros.
- **Transferir** abre un diálogo nativo con tres destinatarios ficticios, avatares de iniciales, monto y concepto opcional. Primero se revisan destinatario, período y saldo resultante; luego se confirma explícitamente. Se informa antes de confirmar: «Demostración: no se envía dinero».
- Se rechazan montos no positivos, formatos inválidos, más de dos decimales y saldo insuficiente. La validación se repite al confirmar. Un bloqueo inmediato y un identificador único evitan duplicar la operación.
- La revisión se convierte en un **comprobante de vidrio** sobre el mismo plano: monto, iniciales, concepto, sello geométrico SVG, referencia PL-DEMO y saldo resultante. Sello de una sola ejecución; sin confeti, sonidos o bucles. Permite volver al resumen o hacer otra demo.
- Se conservan Octubre y Septiembre de 2026. Son escenarios independientes con saldo inicial de USD 1.500 cada uno. Octubre inicia con ingresos 3.250, gastos 200 y cierre 4.550; Septiembre con ingresos 1.800, gastos 220 y cierre 3.080. Las transferencias se agregan al final del período seleccionado (31 oct / 30 sep), nunca a la fecha real. Afectan saldo, gastos, historial, filtros y gráfico de ese período.
- **Reiniciar demo** restaura operaciones, comprobante, período, vista, filtros y las tres metas con sus importes iniciales. La tarjeta del inicio conserva sus controles independientes. Recargar también restaura todo. No se usa almacenamiento local ni de sesión.
- **Viaje, Equipo y Fondo personal** tienen ilustraciones SVG originales y personalizaciones independientes. Las metas se comparten entre la vista de la app y el simulador. Aporte mensual mediante slider y campo numérico sincronizados; progreso, pendiente y meses se calculan juntos, sin intereses ni rentabilidad. Metas independientes del saldo de muestra; no son recomendaciones financieras.
- Se contemplan objetivo alcanzado o superado, aporte cero, entradas vacías, negativas o no finitas, hasta dos decimales y un máximo de USD 1.000.000.000. Los meses se redondean hacia arriba y el último aporte puede ser menor. El slider parte de un rango de 0 a 1.000 y se amplía si el campo numérico supera ese máximo.
- Foco visible, controles nativos, etiquetas, indicadores de selección además del color, gestión de foco del diálogo y devolución al botón de origen. Escape solicita cierre; el diálogo nativo aporta modalidad y restricción de foco. Las confirmaciones y errores se anuncian en regiones específicas.
- Con movimiento reducido se desactiva la inclinación y el dibujo del sello; los nuevos paneles usan una aparición de opacidad breve. Hay alternativa sólida sin `backdrop-filter`. El comprobante se entiende también sin animación.
- La misma DM Sans se sirve ahora **localmente**, con su licencia OFL en `public/fonts/`. No se cargan fuentes externas. La app no hace fetch ni usa backend, bancos, pagos, cuentas, claves, analítica o servicios de red.

## Referencias consultadas

Consulta realizada el 4 de noviembre de 2026. Se consultaron fuentes accesibles mediante herramienta web; no se copiaron marcas, código ni recursos. El navegador visual no estuvo disponible, por lo que el estudio de las galerías está limitado a las fichas, contenido y recursos accesibles por la herramienta.

- [Fey en Minimal Gallery](https://minimal.gallery/fey/): ficha de producto financiero. Inspiró priorizar una interfaz concreta y claridad de información. [Sitio actual](https://fey.com/) consultado: hoy muestra un anuncio de incorporación a Wealthsimple, de modo que no se asume que conserve el diseño de la ficha histórica.
- [Portal en Minimal Gallery](https://minimal.gallery/portal/) y [sitio de Portal](https://useportal.net/): presentación centrada en el producto y progresión desde una promesa breve hacia funciones concretas. Inspiró la secuencia de exploración y la integración del producto en la narrativa. La composición asimétrica y la tipografía de Plena son decisiones propias.
- [Superior en Land-book](https://land-book.com/websites/75396-superior-startup-and-saas-template): ficha y recurso de presentación consultados. Su clasificación Black & White / Sans Serif / Finance sirvió de punto de partida para una base monocromática y jerarquía sobria; Plena agrega hueso, vidrio y cobalto moderado.
- [Awwwards / Fey](https://www.awwwards.com/sites/fey): intento de acceso fallido; no se atribuyen decisiones a contenido no visto.
- [Godly](https://godly.website/): redirigió a recent.design y la herramienta no pudo acceder. Se continuó sin su contenido.

## Verificación y límites

- `npm test`: **21 pruebas exitosas**. Dieciséis pruebas de cálculos y estado, y cinco pruebas de integración de la interfaz en jsdom.
- Cálculos/estado: precisión decimal, límites del simulador, las tres metas, validación y deduplicación de transferencias, saldo insuficiente al confirmar, saldo agotado, asignación al período, gráfico consistente, reinicio e inmutabilidad. Una secuencia de 100 operaciones de un centavo comprueba que no se acumula error.
- Interfaz DOM: navegación, período y filtros; flujo de errores/revisión/confirmación; doble clic; comprobante; saldo e historial conectados; reinicio; edición y nueva demo; foco inicial y devolución al origen; evento de cancelación; metas y sincronización de slider/campo; regresión de giro, acabados y congelado de la tarjeta.
- jsdom **no renderiza CSS ni implementa el top layer de un diálogo**. El test sustituye `showModal` únicamente para probar React. Estas pruebas no equivalen a probar Escape físico, atrapamiento de foco nativo, navegación completa por teclado, contraste, animación o tacto en un navegador real.
- `npm run build`: exitoso. Sólo React y React DOM como dependencias de producción; esbuild y jsdom son herramientas de pruebas en desarrollo.
- Servidor local en `http://localhost:5175/`, puerto estricto. Respuesta HTTP y módulos de Plena verificados.
- **Pendiente de revisión visual real a 360, 390, 768 y 1440 px**: desbordamientos, legibilidad, recortes, scroll interno, contraste renderizado y comportamiento táctil. Se implementaron estilos responsivos, pero no se afirma que esas dimensiones hayan sido comprobadas en navegador.
- Se intentó acceder al navegador: la herramienta devolvió `The browser access host is unavailable`. Luego se intentó Computer Use con la ventana Brave disponible; la herramienta detuvo el acceso porque no pudo determinar la URL actual en Windows con suficiente confianza para aplicar su política. No se continuó con automatización de esa ventana. También quedan pendientes las verificaciones nativas de teclado/Escape, foco atrapado, movimiento reducido y alternativa sin blur.
- Todos los datos son ilustrativos y temporales. No hay envío de dinero, comprobante financiero válido ni recomendaciones. No se hizo push ni publicación de esta segunda versión.

## Asistencia de IA

Diseño, textos, implementación, documentación y pruebas desarrollados con asistencia de Codex. Las decisiones visuales y el símbolo de Plena son propios de este concepto. No se usaron imágenes generadas ni recursos de tarjetas ajenas.
