/*
 * MASTER BIRD DATABASE — Alberta & British Columbia
 * -------------------------------------------------
 * Every city (preset or custom) is just a filtered view into this list.
 * A species appears in a city when its province matches AND it shares at
 * least one habitat tag with that city.
 *
 * Fields:
 *   id         unique slug
 *   name       common name
 *   sci        scientific name
 *   rarity     'common' | 'uncommon' | 'rare' | 'legendary'
 *   shape      silhouette group (see SHAPES in app.js)
 *   prov       provinces where found: ['AB','BC']
 *   habitat    habitat tags used to place the bird into cities
 *   blurb      one-line field-guide note
 *
 * Habitat vocabulary:
 *   urban parkland prairie river wetland forest mountain alpine boreal
 */
window.SPECIES = [
  // ---------------- COMMON ----------------
  { id: 'house-sparrow', name: 'House Sparrow', sci: 'Passer domesticus', rarity: 'common', shape: 'songbird', prov: ['AB','BC'], habitat: ['urban'], blurb: 'City sidewalks and cafe patios everywhere.' },
  { id: 'black-billed-magpie', name: 'Black-billed Magpie', sci: 'Pica hudsonia', rarity: 'common', shape: 'corvid', prov: ['AB','BC'], habitat: ['urban','parkland','prairie'], blurb: 'Loud, iridescent, and impossible to miss.' },
  { id: 'rock-pigeon', name: 'Rock Pigeon', sci: 'Columba livia', rarity: 'common', shape: 'songbird', prov: ['AB','BC'], habitat: ['urban'], blurb: 'The classic city bird, ledges and bridges.' },
  { id: 'american-robin', name: 'American Robin', sci: 'Turdus migratorius', rarity: 'common', shape: 'songbird', prov: ['AB','BC'], habitat: ['urban','parkland','forest'], blurb: 'Orange breast, tugging worms from lawns.' },
  { id: 'bc-chickadee', name: 'Black-capped Chickadee', sci: 'Poecile atricapillus', rarity: 'common', shape: 'songbird', prov: ['AB','BC'], habitat: ['urban','parkland','forest'], blurb: 'Tiny, tame, sings its own name: chick-a-dee.' },
  { id: 'house-finch', name: 'House Finch', sci: 'Haemorhous mexicanus', rarity: 'common', shape: 'songbird', prov: ['AB','BC'], habitat: ['urban'], blurb: 'Rosy-red males at backyard feeders.' },
  { id: 'canada-goose', name: 'Canada Goose', sci: 'Branta canadensis', rarity: 'common', shape: 'waterfowl', prov: ['AB','BC'], habitat: ['wetland','river','urban','parkland'], blurb: 'Honking Vs overhead; guards its pond fiercely.' },
  { id: 'mallard', name: 'Mallard', sci: 'Anas platyrhynchos', rarity: 'common', shape: 'waterfowl', prov: ['AB','BC'], habitat: ['wetland','river','urban'], blurb: 'Green-headed drake on every pond.' },
  { id: 'european-starling', name: 'European Starling', sci: 'Sturnus vulgaris', rarity: 'common', shape: 'songbird', prov: ['AB','BC'], habitat: ['urban','prairie','parkland'], blurb: 'Glossy, speckled, and endlessly chattering.' },
  { id: 'american-crow', name: 'American Crow', sci: 'Corvus brachyrhynchos', rarity: 'common', shape: 'corvid', prov: ['AB','BC'], habitat: ['urban','parkland','prairie'], blurb: 'Clever all-black bird; classic caw.' },
  { id: 'common-raven', name: 'Common Raven', sci: 'Corvus corax', rarity: 'common', shape: 'corvid', prov: ['AB','BC'], habitat: ['mountain','forest','urban','boreal'], blurb: 'Bigger than a crow, croaks and tumbles in flight.' },
  { id: 'dark-eyed-junco', name: 'Dark-eyed Junco', sci: 'Junco hyemalis', rarity: 'common', shape: 'songbird', prov: ['AB','BC'], habitat: ['forest','parkland','urban'], blurb: 'Slate hood, white belly, flashes white tail.' },

  // ---------------- UNCOMMON ----------------
  { id: 'blue-jay', name: 'Blue Jay', sci: 'Cyanocitta cristata', rarity: 'uncommon', shape: 'corvid', prov: ['AB'], habitat: ['parkland','forest','urban'], blurb: 'Crested blue bruiser of the poplar woods.' },
  { id: 'stellers-jay', name: "Steller's Jay", sci: 'Cyanocitta stelleri', rarity: 'uncommon', shape: 'corvid', prov: ['BC'], habitat: ['forest','mountain'], blurb: "BC's provincial bird — black hood, deep blue body." },
  { id: 'cedar-waxwing', name: 'Cedar Waxwing', sci: 'Bombycilla cedrorum', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['parkland','forest','urban'], blurb: 'Silky crest, bandit mask, waxy red wingtips.' },
  { id: 'bohemian-waxwing', name: 'Bohemian Waxwing', sci: 'Bombycilla garrulus', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['forest','urban','parkland'], blurb: 'Winter flocks strip mountain-ash berries.' },
  { id: 'downy-woodpecker', name: 'Downy Woodpecker', sci: 'Dryobates pubescens', rarity: 'uncommon', shape: 'woodpecker', prov: ['AB','BC'], habitat: ['forest','parkland','urban'], blurb: 'Smallest woodpecker; taps at suet feeders.' },
  { id: 'northern-flicker', name: 'Northern Flicker', sci: 'Colaptes auratus', rarity: 'uncommon', shape: 'woodpecker', prov: ['AB','BC'], habitat: ['parkland','forest','urban'], blurb: 'Ground-feeding woodpecker; salmon wing flash.' },
  { id: 'red-winged-blackbird', name: 'Red-winged Blackbird', sci: 'Agelaius phoeniceus', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['wetland'], blurb: 'Cattail king with scarlet shoulder patches.' },
  { id: 'american-goldfinch', name: 'American Goldfinch', sci: 'Spinus tristis', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['parkland','prairie','urban'], blurb: 'Bouncy flight; canary-yellow in summer.' },
  { id: 'white-breasted-nuthatch', name: 'White-breasted Nuthatch', sci: 'Sitta carolinensis', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['forest','parkland'], blurb: 'Walks head-first down tree trunks.' },
  { id: 'mountain-bluebird', name: 'Mountain Bluebird', sci: 'Sialia currucoides', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['prairie','mountain','parkland'], blurb: 'Sky-blue male hovering over foothill fields.' },
  { id: 'yellow-warbler', name: 'Yellow Warbler', sci: 'Setophaga petechia', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['parkland','river','wetland'], blurb: 'Sweet-sweet song from willow thickets.' },
  { id: 'song-sparrow', name: 'Song Sparrow', sci: 'Melospiza melodia', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['parkland','wetland','river'], blurb: 'Streaky brown, sings from a low perch.' },
  { id: 'tree-swallow', name: 'Tree Swallow', sci: 'Tachycineta bicolor', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['wetland','parkland','river'], blurb: 'Iridescent teal-blue, swoops over water.' },
  { id: 'common-goldeneye', name: 'Common Goldeneye', sci: 'Bucephala clangula', rarity: 'uncommon', shape: 'waterfowl', prov: ['AB','BC'], habitat: ['river','wetland'], blurb: 'Round-headed diver with a bright golden eye.' },
  { id: 'bufflehead', name: 'Bufflehead', sci: 'Bucephala albeola', rarity: 'uncommon', shape: 'waterfowl', prov: ['AB','BC'], habitat: ['wetland','river'], blurb: 'Tiny puffball duck with a big white bonnet.' },
  { id: 'ring-billed-gull', name: 'Ring-billed Gull', sci: 'Larus delawarensis', rarity: 'uncommon', shape: 'gull', prov: ['AB','BC'], habitat: ['urban','wetland','river'], blurb: 'Parking-lot gull with a black-ringed bill.' },
  { id: 'franklins-gull', name: "Franklin's Gull", sci: 'Leucophaeus pipixcan', rarity: 'uncommon', shape: 'gull', prov: ['AB'], habitat: ['wetland','prairie'], blurb: 'Prairie gull; black hood, follows the plough.' },
  { id: 'killdeer', name: 'Killdeer', sci: 'Charadrius vociferus', rarity: 'uncommon', shape: 'wader', prov: ['AB','BC'], habitat: ['prairie','wetland','urban'], blurb: 'Cries its name; fakes a broken wing.' },
  { id: 'great-blue-heron', name: 'Great Blue Heron', sci: 'Ardea herodias', rarity: 'uncommon', shape: 'wader', prov: ['AB','BC'], habitat: ['wetland','river'], blurb: 'Statue-still stalker of shallow water.' },
  { id: 'belted-kingfisher', name: 'Belted Kingfisher', sci: 'Megaceryle alcyon', rarity: 'uncommon', shape: 'songbird', prov: ['AB','BC'], habitat: ['river','wetland'], blurb: 'Rattling call; dives headlong for fish.' },
  { id: 'osprey', name: 'Osprey', sci: 'Pandion haliaetus', rarity: 'uncommon', shape: 'raptor', prov: ['AB','BC'], habitat: ['river','wetland','mountain'], blurb: 'Fish hawk; plunges talons-first into rivers.' },
  { id: 'red-tailed-hawk', name: 'Red-tailed Hawk', sci: 'Buteo jamaicensis', rarity: 'uncommon', shape: 'raptor', prov: ['AB','BC'], habitat: ['prairie','parkland','urban'], blurb: 'Broad-winged; rusty tail on fence posts.' },
  { id: 'swainsons-hawk', name: "Swainson's Hawk", sci: 'Buteo swainsoni', rarity: 'uncommon', shape: 'raptor', prov: ['AB'], habitat: ['prairie'], blurb: 'Prairie soarer that winters in Argentina.' },
  { id: 'great-horned-owl', name: 'Great Horned Owl', sci: 'Bubo virginianus', rarity: 'uncommon', shape: 'owl', prov: ['AB','BC'], habitat: ['parkland','forest','urban'], blurb: "Alberta's provincial bird — deep hoots at dusk." },
  { id: 'rufous-hummingbird', name: 'Rufous Hummingbird', sci: 'Selasphorus rufus', rarity: 'uncommon', shape: 'hummingbird', prov: ['AB','BC'], habitat: ['forest','parkland','mountain'], blurb: 'Feisty copper spark; buzzes intruders.' },
  { id: 'annas-hummingbird', name: "Anna's Hummingbird", sci: 'Calypte anna', rarity: 'uncommon', shape: 'hummingbird', prov: ['BC'], habitat: ['urban','parkland'], blurb: 'Coastal hummer that even braves winter.' },
  { id: 'bald-eagle', name: 'Bald Eagle', sci: 'Haliaeetus leucocephalus', rarity: 'uncommon', shape: 'raptor', prov: ['AB','BC'], habitat: ['river','wetland','mountain'], blurb: 'White head and tail; scans rivers for fish.' },

  // ---------------- RARE ----------------
  { id: 'pileated-woodpecker', name: 'Pileated Woodpecker', sci: 'Dryocopus pileatus', rarity: 'rare', shape: 'woodpecker', prov: ['AB','BC'], habitat: ['forest','mountain'], blurb: 'Crow-sized, flaming crest; carves rectangular holes.' },
  { id: 'barred-owl', name: 'Barred Owl', sci: 'Strix varia', rarity: 'rare', shape: 'owl', prov: ['AB','BC'], habitat: ['forest'], blurb: 'Asks "who cooks for you?" from deep woods.' },
  { id: 'harlequin-duck', name: 'Harlequin Duck', sci: 'Histrionicus histrionicus', rarity: 'rare', shape: 'waterfowl', prov: ['AB','BC'], habitat: ['mountain','river'], blurb: 'Painted clown of fast mountain streams.' },
  { id: 'american-dipper', name: 'American Dipper', sci: 'Cinclus mexicanus', rarity: 'rare', shape: 'songbird', prov: ['AB','BC'], habitat: ['mountain','river'], blurb: 'Grey songbird that walks underwater.' },
  { id: 'pine-grosbeak', name: 'Pine Grosbeak', sci: 'Pinicola enucleator', rarity: 'rare', shape: 'songbird', prov: ['AB','BC'], habitat: ['boreal','mountain','forest'], blurb: 'Plump rosy finch of the winter conifers.' },
  { id: 'northern-pygmy-owl', name: 'Northern Pygmy-Owl', sci: 'Glaucidium californicum', rarity: 'rare', shape: 'owl', prov: ['AB','BC'], habitat: ['forest','mountain'], blurb: 'Sparrow-sized day owl with false "eyes" on its nape.' },
  { id: 'sandhill-crane', name: 'Sandhill Crane', sci: 'Antigone canadensis', rarity: 'rare', shape: 'wader', prov: ['AB','BC'], habitat: ['wetland','prairie'], blurb: 'Bugling giants that dance on migration.' },
  { id: 'trumpeter-swan', name: 'Trumpeter Swan', sci: 'Cygnus buccinator', rarity: 'rare', shape: 'waterfowl', prov: ['AB','BC'], habitat: ['wetland'], blurb: 'Heaviest native waterfowl; a living trumpet.' },
  { id: 'clarks-nutcracker', name: "Clark's Nutcracker", sci: 'Nucifraga columbiana', rarity: 'rare', shape: 'corvid', prov: ['AB','BC'], habitat: ['mountain','alpine'], blurb: 'Caches thousands of pine seeds high on ridges.' },
  { id: 'canada-jay', name: 'Canada Jay', sci: 'Perisoreus canadensis', rarity: 'rare', shape: 'corvid', prov: ['AB','BC'], habitat: ['mountain','boreal','forest'], blurb: 'The friendly "whiskey jack" of the backcountry.' },
  { id: 'varied-thrush', name: 'Varied Thrush', sci: 'Ixoreus naevius', rarity: 'rare', shape: 'songbird', prov: ['AB','BC'], habitat: ['forest','mountain'], blurb: 'Eerie one-note whistle from damp forest.' },
  { id: 'spruce-grouse', name: 'Spruce Grouse', sci: 'Canachites canadensis', rarity: 'rare', shape: 'gamebird', prov: ['AB','BC'], habitat: ['boreal','forest','mountain'], blurb: 'Tame "fool hen" that hardly flushes.' },

  // ---------------- LEGENDARY ----------------
  { id: 'golden-eagle', name: 'Golden Eagle', sci: 'Aquila chrysaetos', rarity: 'legendary', shape: 'raptor', prov: ['AB','BC'], habitat: ['mountain','alpine'], blurb: 'Thousands stream over the Rockies each fall.' },
  { id: 'great-gray-owl', name: 'Great Gray Owl', sci: 'Strix nebulosa', rarity: 'legendary', shape: 'owl', prov: ['AB','BC'], habitat: ['boreal','forest'], blurb: 'Tallest owl; a grey ghost of the muskeg.' },
  { id: 'snowy-owl', name: 'Snowy Owl', sci: 'Bubo scandiacus', rarity: 'legendary', shape: 'owl', prov: ['AB','BC'], habitat: ['prairie'], blurb: 'Arctic wanderer on winter fence posts.' },
  { id: 'white-tailed-ptarmigan', name: 'White-tailed Ptarmigan', sci: 'Lagopus leucura', rarity: 'legendary', shape: 'gamebird', prov: ['AB','BC'], habitat: ['alpine','mountain'], blurb: 'Turns pure white; hides above treeline.' },
  { id: 'gyrfalcon', name: 'Gyrfalcon', sci: 'Falco rusticolus', rarity: 'legendary', shape: 'raptor', prov: ['AB','BC'], habitat: ['prairie','alpine'], blurb: 'Largest falcon; a rare winter prize.' },
  { id: 'northern-hawk-owl', name: 'Northern Hawk Owl', sci: 'Surnia ulula', rarity: 'legendary', shape: 'owl', prov: ['AB','BC'], habitat: ['boreal','forest'], blurb: 'Hunts by day from spruce tops like a falcon.' }
];

/*
 * Species that range across most of Canada. When the friend adds a city in a
 * province other than AB/BC, these fill its starter dex (matched by habitat)
 * so it's never empty. Western/regional specialties stay AB/BC-only until a
 * province-specific list is added. Setting `wide` here keeps the data in one
 * place instead of repeating a flag on every entry.
 */
window.WIDE_RANGE = [
  'house-sparrow', 'rock-pigeon', 'american-robin', 'bc-chickadee', 'house-finch',
  'canada-goose', 'mallard', 'european-starling', 'american-crow', 'common-raven',
  'dark-eyed-junco', 'blue-jay', 'cedar-waxwing', 'downy-woodpecker', 'northern-flicker',
  'red-winged-blackbird', 'american-goldfinch', 'white-breasted-nuthatch', 'yellow-warbler',
  'song-sparrow', 'tree-swallow', 'common-goldeneye', 'bufflehead', 'ring-billed-gull',
  'killdeer', 'great-blue-heron', 'belted-kingfisher', 'osprey', 'red-tailed-hawk',
  'great-horned-owl', 'bald-eagle', 'pileated-woodpecker', 'barred-owl', 'pine-grosbeak',
  'sandhill-crane', 'canada-jay', 'spruce-grouse', 'golden-eagle', 'great-gray-owl',
  'snowy-owl', 'gyrfalcon', 'northern-hawk-owl'
];
window.WIDE_RANGE.forEach(id => {
  const s = window.SPECIES.find(x => x.id === id);
  if (s) s.wide = true;
});
