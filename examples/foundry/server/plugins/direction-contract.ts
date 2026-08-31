/**
 * Injects the Impeccable direction contract as the first child of <body> so it
 * survives the production build and every re-render (the root layout lives in
 * the layer, so the example app owns it here instead).
 */
const CONTRACT = `<!--
THESIS: the agent-traffic transition as a station record; refuses the dark
dev-tool hero + three feature cards this category ships.
OWN-WORLD: smoked-drum seismogram — soot #141110 ground, scratched-light
#f2efe6 traces, vermilion #e33d24 event ink, graticule rules; Big Shoulders
condensed caps, Martian Mono readouts; full-inversion states; one datum rail.
STORY: a founder reads the crossover evidence, sees the wrap/stream/decide
loop, trusts the honest station log, installs from npm or opens GitHub.
FIRST VIEWPORT: masthead strip (station name, REC lamp, UTC); full-bleed drum
trace of real events with vermilion ticks; display headline lower-left;
punched install tag + GitHub lower-right.
FORM: observatory strip-chart station, #5 on the ordered list; seed be71f273.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance
-->`

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.bodyPrepend.unshift(CONTRACT)
  })
})
