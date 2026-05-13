# HectoWeb

Site démo de l'agence web HectoWeb. Site caméléon : 6 sections, 6 styles radicalement différents, pour démontrer la polyvalence de l'agence.

## Stack
- HTML5 + Tailwind CSS v3 (CDN)
- GSAP + ScrollTrigger pour les animations scroll
- Three.js pour la scène 3D (section animation)
- Canvas 2D pour les particules du hero

## Sections
1. **Hero** — Dark Luxe (particules canvas + typo serif)
2. **Vitrine** — Pop / Memphis (couleurs vives, formes géométriques)
3. **E-commerce** — Glass / Néon (glassmorphism, dégradés)
4. **SEO/GEO** — Éditorial Magazine (typo serif, fond crème, layout grille)
5. **Animation/3D** — Three.js (icosahedron wobble, lights)
6. **Process** — Brutalist (bord noir épais, monospace, orange saturé)
7. **Contact** — Minimaliste (formulaire propre, fond crème)

## Déploiement
Hébergé sur GitHub Pages (branche `main`).

## Local
Aucun build. Ouvrir `index.html` dans un navigateur (idéalement via un petit serveur statique pour que les `type="module"` chargent : `python3 -m http.server 8000`).
