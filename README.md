# 🐦 BirdDex

A retro **Game Boy–styled Pokédex for birds** — built for spotting and
"catching" the birds of **Alberta & British Columbia**. Install it to your
phone's home screen and check off birds as you find them around the city.

![style](https://img.shields.io/badge/style-Game%20Boy%20DMG-9bbc0f)
![offline](https://img.shields.io/badge/works-offline-0f380f)

## What it does

- **Curated regional dex** — every city shows the birds that actually occur
  there, sorted Common → Legendary, shown as grayed-out silhouettes until
  spotted.
- **Log a sighting** — snap a **photo**, tag your **GPS location**, add
  optional **notes**. The **date & time are added automatically**.
- **Rarity + lifetime tally** — each bird carries a rarity tier
  (Common / Uncommon / Rare / Legendary) and a running "spotted × N" count.
- **Multiple cities** — switch between Calgary, Lethbridge, Banff, Canmore,
  Edmonton, Vancouver… **or add your own city** by picking its province and
  habitats; the app fills in the expected bird list automatically.
- **100% on-device** — all data lives in the phone's IndexedDB. No account,
  no server, works fully offline once loaded.

## Get it on your phone

It's a **PWA** (installable web app), so hosting is free — no App Store.

**Easiest: GitHub Pages**
1. Push this repo to GitHub (branch/main).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → pick the
   branch and `/ (root)` → **Save**.
3. Open the given `https://<user>.github.io/<repo>/` URL on the phone.
4. In the browser menu tap **Add to Home Screen**. Done — it opens like a
   native app, full-screen, offline.

**Local preview**
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## How the bird data works

`data/species.js` is the master Alberta+BC species list. Each bird has a
province and habitat tags. `data/cities.js` defines each city's province +
habitat mix, and the app computes a city's checklist as:

> bird belongs to a city ⟺ same province **and** shares ≥1 habitat tag

That's why "add a city" just needs a province + a few habitat checkboxes.

### Adding or editing birds

Open `data/species.js` and add an entry:
```js
{ id: 'unique-slug', name: 'Common Name', sci: 'Genus species',
  rarity: 'rare', shape: 'owl', prov: ['AB','BC'],
  habitat: ['forest','mountain'], blurb: 'One-line field note.' }
```
`shape` picks a silhouette: `songbird, corvid, waterfowl, raptor, owl,
woodpecker, gamebird, wader, hummingbird, gull`.

## Project layout

```
index.html            app shell (device frame + modals)
styles.css            Game Boy DMG theme
app.js                logic, IndexedDB, rendering, silhouettes
data/species.js       master AB/BC bird database
data/cities.js        preset cities + habitat options
sw.js                 service worker (offline cache)
manifest.webmanifest  PWA manifest
icons/                app icons
fonts/                Press Start 2P (OFL, see fonts/OFL.txt)
```

## Credits

- Font: **Press Start 2P** by CodeMan38 — SIL Open Font License (`fonts/OFL.txt`).
- Bird species/rarity assignments are hand-curated for AB/BC and meant as a
  fun field companion, not an authoritative checklist.
