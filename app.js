/* ============================================================
   BirdDex — app logic
   Vanilla JS, no framework. All data lives on-device (IndexedDB).
   ============================================================ */
'use strict';

/* ---------- bird silhouettes (filled shapes, colored via CSS) ---------- */
const SHAPES = {
  songbird: `<svg viewBox="0 0 64 64"><ellipse cx="30" cy="34" rx="14" ry="11"/><circle cx="42" cy="24" r="8"/><polygon points="50,24 61,22 50,28"/><polygon points="16,30 3,19 20,41"/><rect x="26" y="44" width="2.5" height="11"/><rect x="34" y="44" width="2.5" height="11"/></svg>`,
  corvid: `<svg viewBox="0 0 64 64"><ellipse cx="27" cy="30" rx="11" ry="9"/><circle cx="37" cy="22" r="7"/><polygon points="44,22 53,20 44,26"/><polygon points="18,32 0,54 24,38"/><rect x="23" y="38" width="2.5" height="13"/><rect x="31" y="38" width="2.5" height="13"/></svg>`,
  waterfowl: `<svg viewBox="0 0 64 64"><ellipse cx="30" cy="33" rx="18" ry="9"/><circle cx="46" cy="23" r="7"/><rect x="52" y="21" width="10" height="5" rx="2"/><polygon points="12,28 6,22 16,31"/><rect x="4" y="45" width="56" height="3"/></svg>`,
  raptor: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="34" rx="6" ry="13"/><circle cx="32" cy="17" r="6"/><polygon points="37,15 45,13 37,20"/><polygon points="27,29 2,19 27,40"/><polygon points="37,29 62,19 37,40"/><polygon points="28,45 32,60 36,45"/></svg>`,
  owl: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="37" rx="15" ry="17"/><circle cx="32" cy="22" r="14"/><polygon points="18,10 27,22 14,22"/><polygon points="46,10 50,22 37,22"/></svg>`,
  woodpecker: `<svg viewBox="0 0 64 64"><ellipse cx="30" cy="35" rx="9" ry="15"/><circle cx="30" cy="17" r="7"/><polygon points="20,18 33,8 30,19"/><polygon points="37,17 48,15 37,22"/><polygon points="22,48 25,61 31,50"/></svg>`,
  gamebird: `<svg viewBox="0 0 64 64"><ellipse cx="29" cy="36" rx="16" ry="12"/><circle cx="44" cy="26" r="6"/><polygon points="49,26 57,25 49,30"/><polygon points="14,33 1,29 16,41"/><rect x="27" y="46" width="2.5" height="11"/><rect x="35" y="46" width="2.5" height="11"/></svg>`,
  wader: `<svg viewBox="0 0 64 64"><ellipse cx="27" cy="30" rx="12" ry="7"/><rect x="33" y="9" width="4.5" height="22" rx="2"/><circle cx="38" cy="10" r="5"/><polygon points="42,8 58,7 42,13"/><polygon points="16,30 3,24 18,37"/><rect x="24" y="35" width="2.5" height="22"/><rect x="32" y="35" width="2.5" height="22"/></svg>`,
  hummingbird: `<svg viewBox="0 0 64 64"><ellipse cx="29" cy="32" rx="9" ry="6"/><circle cx="38" cy="27" r="5"/><rect x="42" y="25.5" width="19" height="2.6" rx="1"/><polygon points="24,29 6,21 26,34"/><polygon points="20,34 9,46 27,38"/></svg>`,
  gull: `<svg viewBox="0 0 64 64"><ellipse cx="29" cy="34" rx="15" ry="8"/><circle cx="44" cy="25" r="6"/><rect x="49" y="23" width="9" height="4" rx="1"/><polygon points="17,30 1,23 20,39"/><rect x="27" y="42" width="2.5" height="11"/><rect x="35" y="42" width="2.5" height="11"/></svg>`
};
const shapeSVG = (s) => SHAPES[s] || SHAPES.songbird;

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, legendary: 3 };

/* ============================================================
   IndexedDB — tiny promise wrapper
   ============================================================ */
const DB = (() => {
  let dbp;
  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open('birddex', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('sightings')) {
          const s = db.createObjectStore('sightings', { keyPath: 'id' });
          s.createIndex('bySpecies', 'speciesId');
        }
        if (!db.objectStoreNames.contains('cities')) {
          db.createObjectStore('cities', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'k' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }
  function tx(store, mode, fn) {
    return open().then(db => new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const os = t.objectStore(store);
      const res = fn(os);
      t.oncomplete = () => resolve(res && res.result !== undefined ? res.result : res);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    }));
  }
  const reqP = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  return {
    all: (store) => tx(store, 'readonly', os => os.getAll()).then(r => r.result || r),
    getAll: (store) => open().then(db => new Promise((res, rej) => {
      const r = db.transaction(store).objectStore(store).getAll();
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    })),
    put: (store, val) => open().then(db => new Promise((res, rej) => {
      const t = db.transaction(store, 'readwrite');
      t.objectStore(store).put(val);
      t.oncomplete = () => res(val); t.onerror = () => rej(t.error);
    })),
    del: (store, key) => open().then(db => new Promise((res, rej) => {
      const t = db.transaction(store, 'readwrite');
      t.objectStore(store).delete(key);
      t.oncomplete = () => res(); t.onerror = () => rej(t.error);
    })),
    get: (store, key) => open().then(db => new Promise((res, rej) => {
      const r = db.transaction(store).objectStore(store).get(key);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }))
  };
})();

/* ============================================================
   App state
   ============================================================ */
const state = {
  cities: [],          // preset + custom
  current: null,       // active city object
  filter: 'all',
  sightings: [],       // all sightings
  seen: new Set(),     // speciesIds with >=1 sighting
  tally: {},           // speciesId -> count
  pending: null        // sighting being composed { speciesId, photo, geo, ... }
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* which species belong to a city */
function cityMembers(city) {
  return window.SPECIES
    .filter(s => s.prov.includes(city.prov) && s.habitat.some(h => city.habitat.includes(h)))
    .sort((a, b) => (RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]) || a.name.localeCompare(b.name));
}

function recomputeSightings() {
  state.seen = new Set();
  state.tally = {};
  for (const s of state.sightings) {
    state.seen.add(s.speciesId);
    state.tally[s.speciesId] = (state.tally[s.speciesId] || 0) + 1;
  }
}

/* ============================================================
   Rendering
   ============================================================ */
function render() {
  const members = cityMembers(state.current);
  const grid = $('#grid');
  grid.innerHTML = '';

  const seenCount = members.filter(s => state.seen.has(s.id)).length;
  $('#progressFill').style.width = members.length ? (seenCount / members.length * 100) + '%' : '0%';
  $('#progressText').textContent = `${seenCount} / ${members.length} spotted`;

  let list = members;
  if (state.filter === 'seen') list = members.filter(s => state.seen.has(s.id));
  else if (state.filter !== 'all') list = members.filter(s => s.rarity === state.filter);

  $('#emptyState').hidden = list.length !== 0;

  members.forEach((sp, i) => {
    if (!list.includes(sp)) return;
    const seen = state.seen.has(sp.id);
    const n = state.tally[sp.id] || 0;
    const card = document.createElement('button');
    card.className = 'card ' + (seen ? 'seen' : 'locked');
    card.innerHTML = `
      <span class="num">#${String(i + 1).padStart(2, '0')}</span>
      ${seen && n > 0 ? `<span class="tally-badge">x${n}</span>` : ''}
      <span class="art">${shapeSVG(sp.shape)}</span>
      <span class="cname">${seen ? sp.name : '??????'}</span>
      <span class="r-dot r-${sp.rarity}" title="${sp.rarity}"></span>`;
    card.addEventListener('click', () => openBird(sp));
    grid.appendChild(card);
  });
}

/* ---------- bird detail modal ---------- */
function openBird(sp) {
  const seen = state.seen.has(sp.id);
  $('#mArt').innerHTML = shapeSVG(sp.shape);
  $('#mArt').style.opacity = seen ? '1' : '0.5';
  $('#mName').textContent = seen ? sp.name : '??? Unidentified ???';
  const badge = $('#mRarity');
  badge.textContent = sp.rarity.toUpperCase();
  badge.className = 'badge' + (sp.rarity === 'legendary' ? ' legendary' : '');
  $('#mSci').textContent = seen ? sp.sci : '—';
  $('#mBlurb').textContent = seen ? sp.blurb : 'Spot this bird to reveal its entry.';
  const n = state.tally[sp.id] || 0;
  $('#mTally').textContent = n === 0 ? 'Not yet spotted' : `Spotted ${n} time${n === 1 ? '' : 's'}`;

  // sightings for this species (newest first)
  const mine = state.sightings.filter(s => s.speciesId === sp.id).sort((a, b) => b.ts - a.ts);
  const wrap = $('#mSightings');
  wrap.innerHTML = mine.map(s => `
    <div class="sighting">
      ${s.photo ? `<img src="${s.photo}" alt="sighting" />` : ''}
      <div class="meta">
        <div class="when">${fmtDate(s.ts)}</div>
        ${s.cityName ? `<div class="where">@ ${esc(s.cityName)}</div>` : ''}
        ${s.geo ? `<div class="where">&#9678; ${s.geo.lat.toFixed(4)}, ${s.geo.lng.toFixed(4)}</div>` : ''}
        ${s.notes ? `<div class="note">&ldquo;${esc(s.notes)}&rdquo;</div>` : ''}
      </div>
      <button class="del" data-sid="${s.id}" title="Delete">&times;</button>
    </div>`).join('');
  wrap.querySelectorAll('.del').forEach(b =>
    b.addEventListener('click', () => deleteSighting(b.dataset.sid, sp)));

  $('#logBtn').onclick = () => openLog(sp);
  showModal('#birdModal');
}

/* ---------- log a sighting ---------- */
function openLog(sp) {
  state.pending = { speciesId: sp.id, photo: null, geo: null };
  $('#logFor').textContent = sp.name;
  $('#photoInput').value = '';
  $('#photoPreview').hidden = true;
  $('#notesInput').value = '';
  $('#geoStatus').textContent = 'Location not added';
  $('#geoStatus').className = 'geo-status';
  hideModal('#birdModal');
  showModal('#logModal');
}

/* photo -> compressed dataURL */
$('#photoInput').addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const max = 900;
    let { width: w, height: h } = img;
    if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
    else if (h > max) { w = Math.round(w * max / h); h = max; }
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    const data = c.toDataURL('image/jpeg', 0.72);
    state.pending.photo = data;
    $('#photoImg').src = data;
    $('#photoPreview').hidden = false;
  };
  img.src = url;
});

/* geolocation */
$('#geoBtn').addEventListener('click', () => {
  const st = $('#geoStatus');
  if (!navigator.geolocation) { st.textContent = 'Geolocation not supported'; return; }
  st.textContent = 'Locating…';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.pending.geo = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      st.textContent = `◎ ${state.pending.geo.lat.toFixed(4)}, ${state.pending.geo.lng.toFixed(4)}`;
      st.className = 'geo-status ok';
    },
    (err) => { st.textContent = 'Could not get location (' + err.message + ')'; st.className = 'geo-status'; },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
});

/* save sighting */
$('#saveSighting').addEventListener('click', async () => {
  const p = state.pending;
  if (!p) return;
  const sighting = {
    id: 'sg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    speciesId: p.speciesId,
    ts: Date.now(),                    // auto date/time
    photo: p.photo || null,
    geo: p.geo || null,
    notes: $('#notesInput').value.trim() || null,
    cityId: state.current.id,
    cityName: state.current.name
  };
  await DB.put('sightings', sighting);
  state.sightings.push(sighting);
  recomputeSightings();
  hideModal('#logModal');
  render();
  const sp = window.SPECIES.find(s => s.id === p.speciesId);
  const first = state.tally[p.speciesId] === 1;
  toast(first ? `${sp.name} added to the dex! ★` : `${sp.name} logged (x${state.tally[p.speciesId]})`);
  state.pending = null;
});

async function deleteSighting(id, sp) {
  await DB.del('sightings', id);
  state.sightings = state.sightings.filter(s => s.id !== id);
  recomputeSightings();
  render();
  openBird(sp); // refresh detail
}

/* ============================================================
   City picker + add city
   ============================================================ */
function renderCityList() {
  const ul = $('#cityList');
  ul.innerHTML = '';
  state.cities.forEach(city => {
    const count = cityMembers(city).length;
    const li = document.createElement('li');
    if (city.id === state.current.id) li.classList.add('active');
    li.innerHTML = `
      <span>
        ${esc(city.name)} <span class="meta2">${city.prov} &middot; ${count} birds</span>
      </span>
      ${city.custom ? `<button class="del-city" title="Remove city">&times;</button>` : ''}`;
    li.addEventListener('click', (e) => {
      if (e.target.classList.contains('del-city')) return;
      selectCity(city);
    });
    const del = li.querySelector('.del-city');
    if (del) del.addEventListener('click', (e) => { e.stopPropagation(); removeCity(city); });
    ul.appendChild(li);
  });
}

async function selectCity(city) {
  state.current = city;
  $('#cityLabel').textContent = city.name;
  await DB.put('meta', { k: 'currentCity', v: city.id });
  hideModal('#cityModal');
  render();
}

async function removeCity(city) {
  if (!confirm(`Remove ${city.name}? (Your bird sightings are kept.)`)) return;
  await DB.del('cities', city.id);
  state.cities = state.cities.filter(c => c.id !== city.id);
  if (state.current.id === city.id) await selectCity(state.cities[0]);
  renderCityList();
}

/* --- add city form --- */
let addProv = 'AB';
function buildHabitatChecks() {
  const box = $('#habitatChecks');
  box.innerHTML = '';
  window.HABITAT_OPTIONS.forEach(opt => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${opt.id}" /> ${opt.label}`;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      label.classList.toggle('on', input.checked);
      updateAddCityCount();
    });
    box.appendChild(label);
  });
}
function selectedHabitats() {
  return $$('#habitatChecks input:checked').map(i => i.value);
}
function updateAddCityCount() {
  const draft = { prov: addProv, habitat: selectedHabitats() };
  const n = draft.habitat.length ? cityMembers(draft).length : 0;
  $('#addCityCount').textContent = `${n} bird${n === 1 ? '' : 's'} match`;
}

$('#provSeg').addEventListener('click', (e) => {
  const btn = e.target.closest('.seg-btn');
  if (!btn) return;
  addProv = btn.dataset.prov;
  $$('#provSeg .seg-btn').forEach(b => b.classList.toggle('active', b === btn));
  updateAddCityCount();
});

$('#addCityBtn').addEventListener('click', () => {
  $('#newCityName').value = '';
  addProv = 'AB';
  $$('#provSeg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.prov === 'AB'));
  buildHabitatChecks();
  updateAddCityCount();
  hideModal('#cityModal');
  showModal('#addCityModal');
});

$('#saveCity').addEventListener('click', async () => {
  const name = $('#newCityName').value.trim();
  const habitat = selectedHabitats();
  if (!name) { toast('Give the city a name'); return; }
  if (!habitat.length) { toast('Pick at least one habitat'); return; }
  const city = {
    id: 'city_' + Date.now().toString(36),
    name, prov: addProv, habitat, custom: true
  };
  await DB.put('cities', city);
  state.cities.push(city);
  hideModal('#addCityModal');
  await selectCity(city);
  toast(`${name} added — ${cityMembers(city).length} birds`);
});

/* ============================================================
   Modal + toast helpers
   ============================================================ */
function showModal(sel) { $(sel).hidden = false; }
function hideModal(sel) { $(sel).hidden = true; }
$$('.modal [data-close]').forEach(b =>
  b.addEventListener('click', () => b.closest('.modal').hidden = true));
$$('.modal').forEach(m =>
  m.addEventListener('click', (e) => { if (e.target === m) m.hidden = true; }));

$('#cityBtn').addEventListener('click', () => { renderCityList(); showModal('#cityModal'); });

$$('.chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  state.filter = chip.dataset.filter;
  render();
}));

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

/* ---------- utils ---------- */
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function fmtDate(ts) {
  const d = new Date(ts);
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

/* ============================================================
   Boot
   ============================================================ */
async function init() {
  const custom = await DB.getAll('cities').catch(() => []);
  state.cities = [...window.PRESET_CITIES, ...custom];

  const meta = await DB.get('meta', 'currentCity').catch(() => null);
  const savedId = meta && meta.v;
  state.current = state.cities.find(c => c.id === savedId) || state.cities[0];
  $('#cityLabel').textContent = state.current.name;

  state.sightings = await DB.getAll('sightings').catch(() => []);
  recomputeSightings();
  render();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
init();
