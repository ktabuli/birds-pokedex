/*
 * PRESET CITIES — Alberta & British Columbia
 * ------------------------------------------
 * A city is defined by its province + habitat mix. The app computes each
 * city's bird checklist from SPECIES (see cityMembers() in app.js): a bird
 * belongs to a city if its province matches and it shares >= 1 habitat.
 *
 * The friend can add his own cities in-app with the same shape; custom
 * cities are stored in IndexedDB and merged with these on load.
 */
window.PRESET_CITIES = [
  { id: 'calgary',    name: 'Calgary',    prov: 'AB', habitat: ['urban','parkland','prairie','river','wetland'] },
  { id: 'lethbridge', name: 'Lethbridge', prov: 'AB', habitat: ['urban','prairie','river','wetland'] },
  { id: 'banff',      name: 'Banff',      prov: 'AB', habitat: ['mountain','forest','alpine','river'] },
  { id: 'canmore',    name: 'Canmore',    prov: 'AB', habitat: ['mountain','forest','river'] },
  { id: 'edmonton',   name: 'Edmonton',   prov: 'AB', habitat: ['urban','parkland','boreal','river','wetland'] },
  { id: 'vancouver',  name: 'Vancouver',  prov: 'BC', habitat: ['urban','parkland','forest','river','wetland'] }
];

// Habitat options offered when the friend adds a custom city.
window.HABITAT_OPTIONS = [
  { id: 'urban',    label: 'Urban / city' },
  { id: 'parkland', label: 'Parkland / trees' },
  { id: 'prairie',  label: 'Prairie / grassland' },
  { id: 'river',    label: 'River / creek' },
  { id: 'wetland',  label: 'Wetland / pond' },
  { id: 'forest',   label: 'Forest' },
  { id: 'mountain', label: 'Mountain' },
  { id: 'alpine',   label: 'Alpine (above treeline)' },
  { id: 'boreal',   label: 'Boreal / spruce' }
];
