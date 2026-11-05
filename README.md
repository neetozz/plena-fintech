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

- Marca tipográfica y símbolo geométrico originales; favicon SVG propio.
- Inicio editorial asimétrico; navegación de vidrio y CTA hacia una demo real dentro de la página.
- Tarjeta CSS/SVG con perspectiva suave para mouse, reflejo reactivo, frente/reverso, tres acabados y congelado visual. Todos los controles funcionan mediante botones nativos, teclado y toque. No requiere hover.
- Resumen con dos períodos, movimientos filtrables y total de selección. Saldo inicial de USD 1.500 en cada período independiente. Octubre: ingresos 3.250, gastos 200, cierre 4.550. Septiembre: ingresos 1.800, gastos 220, cierre 3.080. El gráfico se deriva de los mismos movimientos en orden cronológico y tiene un resumen textual. Los filtros afectan la lista y su total; el balance y el gráfico resumen el período completo.
- Notificación de vidrio en un espacio reservado de la interfaz, sin cubrir información.
- Simulador con objetivo, ahorro inicial y aporte mensual; calcula pendiente y meses redondeados hacia arriba. Sin intereses ni rendimientos. Contempla meta alcanzada, aporte cero, valores inválidos y límite de importes. No guarda los datos.
- Foco visible, enlace para saltar al contenido, etiquetas, anuncios de estado, alternativas sin `backdrop-filter` y respeto por `prefers-reduced-motion` (sin inclinación ni transiciones).

## Referencias consultadas

Consulta realizada el 4 de noviembre de 2026. Se consultaron fuentes accesibles mediante herramienta web; no se copiaron marcas, código ni recursos. El navegador visual no estuvo disponible, por lo que el estudio de las galerías está limitado a las fichas, contenido y recursos accesibles por la herramienta.

- [Fey en Minimal Gallery](https://minimal.gallery/fey/): ficha de producto financiero. Inspiró priorizar una interfaz concreta y claridad de información. [Sitio actual](https://fey.com/) consultado: hoy muestra un anuncio de incorporación a Wealthsimple, de modo que no se asume que conserve el diseño de la ficha histórica.
- [Portal en Minimal Gallery](https://minimal.gallery/portal/) y [sitio de Portal](https://useportal.net/): presentación centrada en el producto y progresión desde una promesa breve hacia funciones concretas. Inspiró la secuencia de exploración y la integración del producto en la narrativa. La composición asimétrica y la tipografía de Plena son decisiones propias.
- [Superior en Land-book](https://land-book.com/websites/75396-superior-startup-and-saas-template): ficha y recurso de presentación consultados. Su clasificación Black & White / Sans Serif / Finance sirvió de punto de partida para una base monocromática y jerarquía sobria; Plena agrega hueso, vidrio y cobalto moderado.
- [Awwwards / Fey](https://www.awwwards.com/sites/fey): intento de acceso fallido; no se atribuyen decisiones a contenido no visto.
- [Godly](https://godly.website/): redirigió a recent.design y la herramienta no pudo acceder. Se continuó sin su contenido.

## Verificación y límites

- `npm test`: siete pruebas exitosas de plazos, redondeo, meta alcanzada/superada, aporte cero, valores inválidos, decimales, fracciones menores a un centavo y coherencia por período.
- `npm run build`: exitoso.
- Servidor iniciado con `strictPort` en 5175. Verificación HTTP: 200 y documento con título Plena.
- Se definieron layouts responsivos para celular, tablet y escritorio. **Pendiente**: revisión visual y pruebas de interacción en navegador a 360, 390, 768 y 1440 px, desbordamientos, giros, acabados, congelado, filtros, foco, teclado, contraste renderizado y reducción de movimiento. El intento de abrir Chrome con la herramienta disponible devolvió `The browser access host is unavailable`. No se presentan como verificaciones realizadas.
- La fuente DM Sans se carga desde Google Fonts; se usa Arial/sans-serif si no hay conexión. No hay bancos, backend, analítica, pagos, claves ni servicios contratados.
- Las interacciones se reinician al recargar. Los meses representan aportes completos y constantes; el último aporte puede ser menor.

## Asistencia de IA

Diseño, textos, implementación, documentación y pruebas desarrollados con asistencia de Codex. Las decisiones visuales y el símbolo de Plena son propios de este concepto. No se usaron imágenes generadas ni recursos de tarjetas ajenas.
