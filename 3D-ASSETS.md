# 3D-karakters en animaties — SEO Office World

De 3D-engine in `office-3d.js` gebruikt Three.js 0.160.1 en ondersteunt GLB-modellen met embedded animaties. Zonder GLB-bestanden verschijnen de ingebouwde gestileerde 3D-medewerkers. De demo voert nooit WordPress-wijzigingen uit.

## Geaccepteerde bestanden
Plaats modellen in deze repository:
- `assets/agents/technical.glb`
- `assets/agents/content.glb`
- `assets/agents/wordpress.glb`
- `assets/agents/analytics.glb`
- `assets/agents/manager.glb`

Gebruik eigen of aantoonbaar commercieel gelicentieerde modellen. Controleer rechten op modellen, kleding, animaties, textures en distributie op GitHub Pages. Voeg bij elk asset de herkomst en licentie toe aan `assets/agents/LICENSES.md`. Commit geen niet-herdistribueerbare assets.

## Animatieconventies
Exporteer als glTF 2.0 binary (GLB) met skelet en ingesloten animaties. Gebruik clipnamen met `Walk` of `Run` voor bewegen, en `Idle`, `Sit`, `Type`, `Work` of `Talk` voor stilstaan. De engine wisselt automatisch met een 0,3s crossfade. Wanneer een animatie ontbreekt, wordt een beschikbare idle-animatie gebruikt.

Voor betere resultaten moeten alle clips dezelfde rig delen, de voeten op de grond staan, het model in een consistente voorwaartse richting kijken en walk-clips **in-place** zijn (zonder root translation), omdat de engine de positie al bestuurt.

## Controlepunten
1. Controleer de browserconsole op import-/GLB-laadfouten.
2. Test orbit, zoom, dag/nacht, verdiepingsknop en klikken op agents.
3. Controleer desktop, mobiel, `prefers-reduced-motion`, en de CSS-3D fallback als WebGL ontbreekt.
4. Controleer dat geïmporteerde SEO-rapporten read-only blijven en dat demo-acties geen WordPress-publicatie starten.

De tweede verdieping is op dit moment een **visuele preview**. Extra agentfunctionaliteit of echte SEO-automatisering wordt niet ingeschakeld door het bouwen van een ruimte.
