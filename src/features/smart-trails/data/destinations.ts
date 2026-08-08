// ─── Smart Heritage Trails — destinations & discover pools ───────────────────
// Lightweight local dataset for the demo. Shape mirrors a live provider.

import type { Destination, DiscoverItem, DiscoverSection } from "../types";

import tajmahal from "@/assets/tajmahal.jpg";
import qutubminar from "@/assets/qutubminar.jpg";
import hampi from "@/assets/hampi.jpg";
import konark from "@/assets/konark.jpg";
import brihadeeswara from "@/assets/brihadeeswara.jpg";
import ajanta from "@/assets/ajanta.jpg";

export const DESTINATIONS: Destination[] = [
  {
    id: "delhi",
    city: "Delhi",
    state: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    tagline: "A thousand years of empires, layered in one city.",
    bestTime: "Oct – Mar · mornings are clearest",
    aliases: ["delhi", "new delhi", "old delhi", "qutub minar", "red fort"],
    image: qutubminar,
  },
  {
    id: "agra",
    city: "Agra",
    state: "Uttar Pradesh",
    lat: 27.1767,
    lng: 78.0081,
    tagline: "The city of the Taj — where love was carved in marble.",
    bestTime: "Oct – Mar · sunrise at the Taj",
    aliases: ["agra", "taj mahal", "taj"],
    image: tajmahal,
  },
  {
    id: "jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    tagline: "The Pink City — forts, bazaars and royal grandeur.",
    bestTime: "Oct – Mar · golden-hour forts",
    aliases: ["jaipur", "pink city", "rajasthan", "amber fort", "hawa mahal"],
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: "hampi",
    city: "Hampi",
    state: "Karnataka",
    lat: 15.335,
    lng: 76.46,
    tagline: "The ruined capital of the Vijayanagara Empire.",
    bestTime: "Nov – Feb · boulder-strewn sunsets",
    aliases: ["hampi", "vijayanagara", "virupaksha"],
    image: hampi,
  },
  {
    id: "mysore",
    city: "Mysore",
    state: "Karnataka",
    lat: 12.2958,
    lng: 76.6394,
    tagline: "The City of Palaces, where the Maharaja still reigns.",
    bestTime: "Oct – Feb · during the illuminated Dasara nights",
    aliases: ["mysore", "mysuru"],
    image: "https://images.unsplash.com/photo-1604313097139-2d6a6c18ee7f?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: "varanasi",
    city: "Varanasi",
    state: "Uttar Pradesh",
    lat: 25.3176,
    lng: 82.9739,
    tagline: "The eternal city — where dawn breaks over the Ganges.",
    bestTime: "Nov – Mar · sunrise & the evening Ganga Aarti",
    aliases: ["varanasi", "banaras", "kashi"],
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=900",
  },
];

// ─── Discover-more pools (keyed by destination id) ───────────────────────────
// Falls back to a shared pool for cities without bespoke entries.

const SHARED_POOL: Record<string, DiscoverItem[]> = {
  heritage: [
    { id: "d-unesco", name: "UNESCO World Heritage Sites", subtitle: "12 curated icons across India", image: tajmahal, tag: "Heritage" },
    { id: "d-chola", name: "Great Living Chola Temples", subtitle: "Dravidian masterpieces", image: brihadeeswara, tag: "Temples" },
    { id: "d-sun", name: "Konark Sun Temple", subtitle: "A chariot for the Sun God", image: konark, tag: "Heritage" },
    { id: "d-ajanta", name: "Ajanta Caves", subtitle: "Rock-cut Buddhist sanctuaries", image: ajanta, tag: "Caves" },
  ],
  hidden: [
    { id: "h-rkivav", name: "Rani ki Vav", subtitle: "An inverted temple of water", image: "https://images.unsplash.com/photo-1620023447192-3a339d672baf?auto=format&fit=crop&q=80&w=900", tag: "Hidden Gem" },
    { id: "h-lepakshi", name: "Lepakshi Temple", subtitle: "Famous hanging pillar", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=900", tag: "Hidden Gem" },
    { id: "h-mehrauli", name: "Mehrauli Archaeological Park", subtitle: "Ruin gardens of Delhi", image: qutubminar, tag: "Hidden Gem" },
  ],
  museums: [
    { id: "m-nat", name: "National Museum", subtitle: "200,000 works of Indian art", image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=900", tag: "Museum" },
    { id: "m-craft", name: "Crafts Museum", subtitle: "Living traditions of India", image: "https://images.unsplash.com/photo-1580745294621-26c387413fbc?auto=format&fit=crop&q=80&w=900", tag: "Museum" },
  ],
  culture: [
    { id: "c-lightsound", name: "Light & Sound Shows", subtitle: "History after dark", image: konark, tag: "Culture" },
    { id: "c-festival", name: "Heritage Festivals", subtitle: "Dance, music & craft fairs", image: ajanta, tag: "Culture" },
  ],
  food: [
    { id: "f-street", name: "Street Food Safaris", subtitle: "Chaats, kebabs & sweets", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
    { id: "f-royal", name: "Royal Thali Experiences", subtitle: "Feasts fit for maharajas", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
  ],
  viewpoints: [
    { id: "v-sunset", name: "Sunset Viewpoints", subtitle: "Golden hour over the skyline", image: hampi, tag: "Scenic" },
    { id: "v-ganga", name: "Riverside Walks", subtitle: "Ghats, mist & morning light", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=900", tag: "Scenic" },
  ],
};

const POOLS_BY_CITY: Record<string, Partial<Record<string, DiscoverItem[]>>> = {
  delhi: {
    heritage: [
      { id: "d-redfort", name: "Red Fort", subtitle: "The Mughal seat of power", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=900", tag: "Heritage" },
      { id: "d-unesco", name: "Qutb Complex", subtitle: "India's tallest brick minaret", image: qutubminar, tag: "Heritage" },
    ],
    hidden: [
      { id: "h-jamali", name: "Jamali Kamali Mosque", subtitle: "A poet's tomb in Mehrauli", image: qutubminar, tag: "Hidden Gem" },
      { id: "h-hauz", name: "Hauz Khas Village", subtitle: "14th-century reservoir ruins", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=900", tag: "Hidden Gem" },
    ],
    museums: [
      { id: "m-nat", name: "National Museum", subtitle: "200,000 works of Indian art", image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=900", tag: "Museum" },
      { id: "m-craft", name: "Crafts Museum", subtitle: "Living traditions of India", image: "https://images.unsplash.com/photo-1580745294621-26c387413fbc?auto=format&fit=crop&q=80&w=900", tag: "Museum" },
    ],
    culture: [
      { id: "c-lightsound", name: "Red Fort Light & Sound", subtitle: "The story of Delhi at dusk", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=900", tag: "Culture" },
      { id: "c-dastaan", name: "Dastaan-e-Delhi", subtitle: "Old Delhi walking tours", image: qutubminar, tag: "Culture" },
    ],
    food: [
      { id: "f-chandni", name: "Chandni Chowk Food Walk", subtitle: "Paranthe, jalebis & kebabs", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
      { id: "f-karim", name: "Karim's Old Delhi", subtitle: "Legendary Mughlai since 1913", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
    ],
    viewpoints: [
      { id: "v-india", name: "India Gate Evening Walk", subtitle: "Lamps, lawns & monuments", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=900", tag: "Scenic" },
      { id: "v-lodi", name: "Lodi Gardens", subtitle: "Tombs among the trees", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&q=80&w=900", tag: "Scenic" },
    ],
  },
  agra: {
    heritage: [
      { id: "d-fort", name: "Agra Fort", subtitle: "The imperial red sandstone citadel", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=900", tag: "Heritage" },
      { id: "d-sikri", name: "Fatehpur Sikri", subtitle: "Akbar's ghost capital", image: tajmahal, tag: "Heritage" },
    ],
    hidden: [
      { id: "h-itmad", name: "Itmad-ud-Daulah", subtitle: "The 'Baby Taj' of marble lace", image: tajmahal, tag: "Hidden Gem" },
      { id: "h-mehtab", name: "Mehtab Bagh", subtitle: "The Taj reflected at dusk", image: tajmahal, tag: "Hidden Gem" },
    ],
    food: [
      { id: "f-petha", name: "Petha & Bedai", subtitle: "Agra's sweet & savoury icons", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
      { id: "f-mughlai", name: "Mughlai Thali", subtitle: "Slow-cooked royal feasts", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
    ],
  },
  jaipur: {
    heritage: [
      { id: "d-amber", name: "Amber Fort", subtitle: "Palace of mirrors on a hill", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=900", tag: "Heritage" },
      { id: "d-hawa", name: "Hawa Mahal", subtitle: "The palace of winds", image: "https://images.unsplash.com/photo-1524613032530-4495c0d4c5a7?auto=format&fit=crop&q=80&w=900", tag: "Heritage" },
    ],
    hidden: [
      { id: "h-jal", name: "Jal Mahal", subtitle: "A palace floating on Man Sagar", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=900", tag: "Hidden Gem" },
      { id: "h-nahargarh", name: "Nahargarh Fort", subtitle: "Sunset over the Pink City", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=900", tag: "Hidden Gem" },
    ],
    food: [
      { id: "f-lmb", name: "LMB & Rawat", subtitle: "Dal baati, kachori & pyaaz ki kachori", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
      { id: "f-bazaar", name: "Johari Bazaar", subtitle: "Gems, textiles & street sweets", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
    ],
  },
  hampi: {
    heritage: [
      { id: "d-vitthala", name: "Vitthala Temple", subtitle: "The stone chariot & musical pillars", image: hampi, tag: "Heritage" },
      { id: "d-lotus", name: "Lotus Mahal", subtitle: "Indo-Islamic courtly grace", image: hampi, tag: "Heritage" },
    ],
    hidden: [
      { id: "h-hemakuta", name: "Hemakuta Hill", subtitle: "Ancient shrines & boulder vistas", image: hampi, tag: "Hidden Gem" },
      { id: "h-matanga", name: "Matanga Hill", subtitle: "The best sunrise in Hampi", image: hampi, tag: "Hidden Gem" },
    ],
    food: [
      { id: "f-bazaar", name: "Hampi Bazaar", subtitle: "Banana dosas by the ruins", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
      { id: "f-river", name: "Riverside Cafés", subtitle: "Camel rides & sunset chai", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
    ],
    viewpoints: [
      { id: "v-tungabhadra", name: "Tungabhadra Riverside", subtitle: "Coracle boats at golden hour", image: hampi, tag: "Scenic" },
    ],
  },
  mysore: {
    heritage: [
      { id: "d-palace", name: "Mysore Palace", subtitle: "The Maharaja's dazzling seat", image: "https://images.unsplash.com/photo-1604313097139-2d6a6c18ee7f?auto=format&fit=crop&q=80&w=900", tag: "Heritage" },
      { id: "d-chamundi", name: "Chamundeshwari Temple", subtitle: "On the hill above the city", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=900", tag: "Heritage" },
    ],
    hidden: [
      { id: "h-stphil", name: "St. Philomena's Church", subtitle: "A neo-gothic jewel", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&q=80&w=900", tag: "Hidden Gem" },
    ],
    museums: [
      { id: "m-palace", name: "Railway Museum", subtitle: "The Maharaja's royal saloons", image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=900", tag: "Museum" },
    ],
    food: [
      { id: "f-mysorepak", name: "Mysore Pak & Dosa", subtitle: "The city's legendary sweets", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
    ],
    viewpoints: [
      { id: "v-brindavan", name: "Brindavan Gardens", subtitle: "Fountains & musical lights", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=900", tag: "Scenic" },
    ],
  },
  varanasi: {
    heritage: [
      { id: "d-sarnath", name: "Sarnath", subtitle: "Where the Buddha first taught", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=900", tag: "Heritage" },
      { id: "d-kashi", name: "Kashi Vishwanath", subtitle: "The golden temple of Shiva", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=900", tag: "Heritage" },
    ],
    hidden: [
      { id: "h-assi", name: "Assi Ghat", subtitle: "Artists, cafés & sunrise boats", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=900", tag: "Hidden Gem" },
    ],
    culture: [
      { id: "c-aarti", name: "Ganga Aarti at Dashashwamedh", subtitle: "Fire, bells & incense at dusk", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=900", tag: "Culture" },
      { id: "c-weaving", name: "Silk Weaving Quarter", subtitle: "Banarasi brocade looms", image: "https://images.unsplash.com/photo-1580745294621-26c387413fbc?auto=format&fit=crop&q=80&w=900", tag: "Culture" },
    ],
    food: [
      { id: "f-kachori", name: "Kachori Gali", subtitle: "Breakfasts that made Banaras famous", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
      { id: "f-lassi", name: "Blue Lassi Shop", subtitle: "Famous malai lassis since 1925", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900", tag: "Cuisine" },
    ],
    viewpoints: [
      { id: "v-sunrise", name: "Sunrise Boat Ride", subtitle: "The Ganges at first light", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=900", tag: "Scenic" },
    ],
  },
};

export const DISCOVER_SECTIONS: { id: string; title: string; emoji: string; poolKey: string }[] = [
  { id: "heritage", title: "Nearby Heritage Sites", emoji: "🏛", poolKey: "heritage" },
  { id: "hidden", title: "Hidden Gems", emoji: "✨", poolKey: "hidden" },
  { id: "museums", title: "Museums", emoji: "🏺", poolKey: "museums" },
  { id: "culture", title: "Cultural Experiences", emoji: "🎭", poolKey: "culture" },
  { id: "food", title: "Local Cuisine", emoji: "🍛", poolKey: "food" },
  { id: "viewpoints", title: "Scenic Viewpoints", emoji: "🌄", poolKey: "viewpoints" },
];

export function getDiscoverSections(destinationId: string): DiscoverSection[] {
  const cityPool = POOLS_BY_CITY[destinationId] ?? {};
  return DISCOVER_SECTIONS.map((section) => {
    const items = cityPool[section.poolKey] ?? SHARED_POOL[section.poolKey] ?? [];
    return {
      id: section.id,
      title: section.title,
      emoji: section.emoji,
      items,
    };
  }).filter((s) => s.items.length > 0);
}
