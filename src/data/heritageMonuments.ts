export type HeritageMonument = {
  id: number;
  name: string;
  city: string;
  state: string;
  era: string;
  description: string;
  image: string;
};

/**
 * Verified local image set. Only monuments with an existing clean local asset
 * are included; no image is substituted when a requested site is unavailable.
 */
export const heritageMonuments: HeritageMonument[] = [
  {
    id: 1,
    name: "Taj Mahal",
    city: "Agra",
    state: "Uttar Pradesh",
    era: "Mughal Empire",
    description: "17th-century marble mausoleum and UNESCO World Heritage Site.",
    image: "/images/heritage/taj-mahal.jpg",
  },
  {
    id: 2,
    name: "Qutub Minar",
    city: "Delhi",
    state: "Delhi",
    era: "Delhi Sultanate",
    description: "A 12th-century minaret and UNESCO World Heritage Site in Mehrauli.",
    image: "/images/heritage/qutub-minar.jpg",
  },
  {
    id: 3,
    name: "Brihadeeswara Temple",
    city: "Thanjavur",
    state: "Tamil Nadu",
    era: "Chola Dynasty",
    description: "An 11th-century granite temple commissioned by Rajaraja Chola I.",
    image: "/images/heritage/brihadeeswara-temple.jpg",
  },
  {
    id: 4,
    name: "Hampi",
    city: "Hampi",
    state: "Karnataka",
    era: "Vijayanagara Empire",
    description: "The monumental ruins of the former Vijayanagara capital.",
    image: "/images/heritage/hampi.jpg",
  },
  {
    id: 5,
    name: "Ajanta Caves",
    city: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    era: "2nd century BCE–6th century CE",
    description: "Buddhist rock-cut sanctuaries renowned for their ancient murals.",
    image: "/images/heritage/ajanta-caves.jpg",
  },
  {
    id: 6,
    name: "Konark Sun Temple",
    city: "Konark",
    state: "Odisha",
    era: "13th century",
    description: "A stone chariot temple dedicated to Surya and a UNESCO World Heritage Site.",
    image: "/images/heritage/konark-sun-temple.jpg",
  },
];
