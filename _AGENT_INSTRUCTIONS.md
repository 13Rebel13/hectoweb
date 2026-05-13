# HECTOWEB — Instructions pour agents (construction sites métiers)

## Contexte
HectoWeb est une **agence web suisse de démonstration**. Le hub (`/home/willbot/hectoweb/index.html`) liste 20 métiers en grille. Quand on clique sur un métier, on arrive sur un **site complet de démo** pour ce métier — qui se termine par un CTA invitant à contacter HectoWeb.

Tu construis un (ou plusieurs) de ces sites métiers. **Chacun est un fichier HTML standalone** dans `/home/willbot/hectoweb/metiers/{slug}.html`.

## Références de qualité (LIRE AVANT D'ÉCRIRE)
- `/home/willbot/hectoweb/metiers/restaurant.html` — Maison Hélène (gastronomique éditorial, crème+bordeaux+ocre, Playfair Display + Lora + Cormorant)
- `/home/willbot/hectoweb/metiers/tatoueur.html` — Encre Noire (studio urbain brutaliste, noir+rouge sang, Bebas Neue + Oswald)

Le but : **chaque nouveau site doit être radicalement différent** de ces 2 références ET du hub HectoWeb (qui est noir + lime + Unbounded + Geist Mono).

## Structure obligatoire (dans cet ordre)
1. `<head>` : title, meta description, theme-color, Google Fonts `<link>`
2. **HW STRIP** (banner haut fixed — code exact ci-dessous)
3. **NAV** fixe avec brand wordmark + anchors sections + CTA principal (réserver/booker/contacter)
4. **HERO** avec nom de marque + tagline + CTA(s)
5. **4 à 6 sections métier** (varient selon l'industrie)
6. Section **formulaire** (réservation/devis/booking) avec mailto fallback (e.preventDefault + alert démo)
7. Section **INFOS** (adresse Suisse fictive plausible + tél +41 21/22/24 + horaires)
8. **HW CTA** en bas (code exact ci-dessous, fond noir)
9. **FOOTER** avec attribution HectoWeb

## HW STRIP (HTML — coller verbatim, ajuster offset nav top:30-32px)
```html
<div class="hw-strip">Site de démonstration HectoWeb<a href="../index.html">← Retour aux 20 univers</a></div>
```
```css
.hw-strip{position:fixed;top:0;left:0;right:0;z-index:60;background:#0a0a0c;border-bottom:1px solid #e3c789;font-family:'Inter',sans-serif;font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:#e3c789;padding:.65rem 1.5rem;text-align:center;font-weight:500}
.hw-strip a{border-bottom:1px solid rgba(227,199,137,.5);padding-bottom:1px;margin-left:.6rem;color:#e3c789}
.hw-strip a:hover{color:#f0d89f;border-color:#f0d89f}
@media(max-width:640px){.hw-strip{font-size:.6rem;letter-spacing:.12em;padding:.55rem 1rem}}
```

## HW CTA bottom (HTML + CSS — coller verbatim)
```html
<section class="hw-cta">
  <p class="hw-cta-kicker">Vous avez aimé ce site ?</p>
  <h3>Vous aussi pouvez avoir<br/>un site <em>fait pour vous</em>.</h3>
  <p>HectoWeb conçoit des sites pour les artisans, restaurateurs, commerces et professions libérales partout en Suisse romande. Devis sous 24 heures, sans engagement.</p>
  <div class="hw-cta-actions">
    <a href="../index.html#contact" class="hw-cta-btn">Démarrer un projet ↗</a>
    <a href="../index.html" class="hw-cta-back">← Voir les autres univers</a>
  </div>
</section>
```
```css
.hw-cta{padding:clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem);text-align:center;background:#0a0a0c;color:#f0ebe1;border-top:2px solid #e3c789}
.hw-cta-kicker{font-family:'Inter',sans-serif;font-size:.7rem;font-weight:500;letter-spacing:.45em;text-transform:uppercase;color:#e3c789;margin-bottom:1.8rem;display:inline-flex;align-items:center;gap:1rem}
.hw-cta-kicker::before,.hw-cta-kicker::after{content:'';width:40px;height:1px;background:#e3c789}
.hw-cta h3{font-family:'Fraunces',serif;font-weight:300;font-size:clamp(2rem,5vw,3.5rem);line-height:1.05;color:#f0ebe1;max-width:42rem;margin:0 auto 1.5rem;letter-spacing:-.025em}
.hw-cta h3 em{font-style:italic;color:#e3c789;font-family:'Cormorant Garamond',serif;font-weight:400}
.hw-cta p{color:#a39d8d;font-size:1.05rem;max-width:36rem;margin:0 auto 2.5rem;line-height:1.6;font-family:'Inter',sans-serif}
.hw-cta-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.hw-cta-btn{display:inline-flex;align-items:center;gap:.6rem;padding:1rem 2rem;background:#e3c789;color:#0a0a0c;font-weight:500;border-radius:999px;font-family:'Inter',sans-serif;font-size:.78rem;letter-spacing:.3em;text-transform:uppercase;transition:background .25s,transform .15s}
.hw-cta-btn:hover{background:#f0d89f;transform:translateY(-2px)}
.hw-cta-back{display:inline-flex;align-items:center;gap:.5rem;padding:1rem 1.8rem;border:1px solid rgba(227,199,137,.4);color:#f0ebe1;border-radius:999px;font-family:'Inter',sans-serif;font-size:.78rem;letter-spacing:.3em;text-transform:uppercase;transition:border-color .25s,color .25s}
.hw-cta-back:hover{border-color:#e3c789;color:#e3c789}
```
**IMPORTANT** : Inclure Fraunces, Cormorant Garamond, et Inter dans ton Google Fonts link (nécessaires pour le HW CTA), en plus de tes polices spécifiques au site.

## Technique
- Single HTML file, TOUT le CSS inliné dans `<style>`
- GSAP via CDN : `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js` + `ScrollTrigger.min.js`
- Photos Unsplash via `https://images.unsplash.com/photo-XXXXX-XXXXX?auto=format&fit=crop&w=2000&q=85`
- **VÉRIFIE QUE LES URLS UNSPLASH EXISTENT** (404 sinon) — utilise des photo IDs courants/connus que tu sais valides
- Responsive mobile (clamp + @media max-width 880px et 600px)
- Support `prefers-reduced-motion`
- 600-1000 lignes par site

## Règle de distinctivité RADICALE
Chaque site doit avoir une identité visuelle radicalement différente de :
- Tous les autres sites que tu écris (si plusieurs)
- restaurant.html (Playfair + Cormorant + crème + bordeaux + ornements ❦)
- tatoueur.html (Bebas Neue + Oswald + noir + rouge sang)
- HectoWeb hub (Unbounded + Geist Mono + noir + lime acide)

→ Choisis des **fonts différentes**, **palettes différentes**, **structures de layout différentes** (parfois split asymétrique, parfois centré, parfois magazine, parfois grid plein écran, parfois split-screen, etc.)

## Form handling JS (tous formulaires)
```javascript
document.querySelector('.your-form-class')?.addEventListener('submit', e => {
  e.preventDefault();
  alert("Site de démonstration HectoWeb.\nSur votre vrai site, [réservation/devis/inscription] serait envoyé(e) par email.\n\nIntéressé par un site comme celui-ci ? info@hectoweb.ch");
});
```

## INTERDICTIONS
- **NE MODIFIE AUCUN FICHIER en dehors de `/home/willbot/hectoweb/metiers/`**
- Ne touche pas à `index.html`, `restaurant.html`, `tatoueur.html`, `README.md`, `.gitignore`, `_AGENT_INSTRUCTIONS.md`
- Pas de framework (pas de React, Vue, Tailwind, etc.) — du HTML/CSS/JS vanilla
- Pas de typo répétée sur tous les sites — varie

## Format de réponse à la fin
Quand tu as fini tes fichiers, liste-les en 1 ligne chacun :
```
- {chemin} — {marque}, {identité visuelle en 1 ligne}
```
Pas de code dans la réponse.
