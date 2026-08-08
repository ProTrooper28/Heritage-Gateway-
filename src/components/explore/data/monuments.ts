import brihadeeswara from "@/assets/brihadeeswara.jpg";
import tajmahal from "@/assets/tajmahal.jpg";
import qutubminar from "@/assets/qutubminar.jpg";
import hampi from "@/assets/hampi.jpg";
import konark from "@/assets/konark.jpg";
import ajanta from "@/assets/ajanta.jpg";

export type MonumentCategory = "Temples" | "Forts" | "Caves" | "Museums" | "Stepwells" | "Other";

export interface Monument {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  category: MonumentCategory;
  dynasty: string;
  period: string;
  timePeriod: string;
  shortDesc: string;
  images: string[];
  hidden: boolean;
  unesco: boolean;
  history: string;
  architecture: string;
  culturalSignificance: string;
  visitingTips: string[];
  nearbyAttractions: string[];
}

export const monuments: Monument[] = [
  {
    id: "m-1",
    name: "Taj Mahal",
    location: { city: "Agra", state: "Uttar Pradesh", lat: 27.1751, lng: 78.0421 },
    category: "Other",
    dynasty: "Mughal Empire",
    period: "1631–1653",
    timePeriod: "17th Century",
    shortDesc: "An immense mausoleum of white marble, built by Shah Jahan in memory of his favorite wife.",
    images: [tajmahal],
    hidden: false,
    unesco: true,
    history: "Commissioned in 1631 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself.",
    architecture: "The Taj Mahal incorporates and expands on design traditions of Persian and earlier Mughal architecture. Specific inspiration came from successful Timurid and Mughal buildings.",
    culturalSignificance: "Universally admired masterpiece of the world's heritage and a symbol of India's rich history.",
    visitingTips: ["Visit at sunrise for the best light.", "Closed on Fridays.", "No food or tripods allowed inside."],
    nearbyAttractions: ["Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"]
  },
  {
    id: "m-2",
    name: "Brihadeeswara Temple",
    location: { city: "Thanjavur", state: "Tamil Nadu", lat: 10.7828, lng: 79.1318 },
    category: "Temples",
    dynasty: "Chola Dynasty",
    period: "1003–1010 CE",
    timePeriod: "11th Century",
    shortDesc: "A Hindu temple dedicated to Shiva, it is one of the largest South Indian temples.",
    images: [brihadeeswara],
    hidden: false,
    unesco: true,
    history: "Built by Tamil king Raja Raja Chola I between 1003 and 1010 CE, the temple is a part of the UNESCO World Heritage Site known as the 'Great Living Chola Temples'.",
    architecture: "It is a supreme achievement of the Chola architects. The vimana tower above the shrine is one of the tallest in South India.",
    culturalSignificance: "The temple stands as a testament to the architectural brilliance and cultural prosperity of the Chola empire.",
    visitingTips: ["Early morning or late afternoon visits are best.", "Wear comfortable footwear.", "Dress modestly."],
    nearbyAttractions: ["Thanjavur Maratha Palace", "Saraswathi Mahal Library"]
  },
  {
    id: "m-3",
    name: "Qutub Minar",
    location: { city: "New Delhi", state: "Delhi", lat: 28.5245, lng: 77.1855 },
    category: "Other",
    dynasty: "Delhi Sultanate",
    period: "1192 CE",
    timePeriod: "12th Century",
    shortDesc: "A towering minaret and 'victory tower' that forms part of the Qutb complex.",
    images: [qutubminar],
    hidden: false,
    unesco: true,
    history: "Construction was started in 1192 by Qutb-ud-din Aibak and was finished by Iltutmish.",
    architecture: "The minaret is made of red sandstone and marble, covered with intricate carvings and verses from the Quran.",
    culturalSignificance: "It is a prominent landmark of Delhi and represents the early Islamic architecture in India.",
    visitingTips: ["Best visited in the evening.", "The complex requires a good amount of walking."],
    nearbyAttractions: ["Iron Pillar of Delhi", "Alai Darwaza"]
  },
  {
    id: "m-4",
    name: "Hampi Virupaksha Temple",
    location: { city: "Hampi", state: "Karnataka", lat: 15.3350, lng: 76.4600 },
    category: "Temples",
    dynasty: "Vijayanagara Empire",
    period: "14th Century",
    timePeriod: "14th Century",
    shortDesc: "The main center of pilgrimage at Hampi, dedicated to Lord Shiva.",
    images: [hampi],
    hidden: false,
    unesco: true,
    history: "The temple's history goes back to the 7th century, but it was vastly expanded during the Vijayanagara empire.",
    architecture: "Known for its tall gopuram, intricate carvings, and the pinhole camera effect in the inner sanctum.",
    culturalSignificance: "An active worship site and the heart of the Hampi ruins.",
    visitingTips: ["Beware of monkeys.", "Hire a guide to understand the history.", "Carry plenty of water."],
    nearbyAttractions: ["Vitthala Temple", "Lotus Mahal", "Elephant Stables"]
  },
  {
    id: "m-5",
    name: "Konark Sun Temple",
    location: { city: "Konark", state: "Odisha", lat: 19.8876, lng: 86.0945 },
    category: "Temples",
    dynasty: "Eastern Ganga Dynasty",
    period: "1250 CE",
    timePeriod: "13th Century",
    shortDesc: "A 13th-century Sun Temple designed as a massive chariot.",
    images: [konark],
    hidden: false,
    unesco: true,
    history: "Built by King Narasimhadeva I, the temple is dedicated to the Hindu Sun God Surya.",
    architecture: "Designed in the shape of a colossal chariot with 24 wheels carved from stone and drawn by seven horses.",
    culturalSignificance: "A masterpiece of Orissan architecture and one of the most famous Brahman sanctuaries.",
    visitingTips: ["Visit during the Konark Dance Festival.", "The stone carvings are best viewed in daylight."],
    nearbyAttractions: ["Chandrabhaga Beach", "ASI Museum"]
  },
  {
    id: "m-6",
    name: "Ajanta Caves",
    location: { city: "Chhatrapati Sambhajinagar", state: "Maharashtra", lat: 20.5519, lng: 75.7033 },
    category: "Caves",
    dynasty: "Vakataka Dynasty",
    period: "2nd BCE - 480 CE",
    timePeriod: "2nd BCE - 5th CE",
    shortDesc: "Ancient Buddhist cave monuments featuring exquisite murals and sculptures.",
    images: [ajanta],
    hidden: false,
    unesco: true,
    history: "The caves include paintings and rock-cut sculptures described as among the finest surviving examples of ancient Indian art.",
    architecture: "Rock-cut architecture with elaborate pillars, stupas, and intricately carved facades.",
    culturalSignificance: "A profound representation of Buddhist religious art.",
    visitingTips: ["Flash photography is prohibited.", "Plan for a full day trip.", "Wear comfortable shoes."],
    nearbyAttractions: ["Ellora Caves", "Bibi Ka Maqbara"]
  },
  {
    id: "m-7",
    name: "Rani ki Vav",
    location: { city: "Patan", state: "Gujarat", lat: 23.8589, lng: 72.1023 },
    category: "Stepwells",
    dynasty: "Chaulukya Dynasty",
    period: "11th Century",
    timePeriod: "11th Century",
    shortDesc: "An intricately constructed stepwell situated on the banks of Saraswati River.",
    images: ["https://images.unsplash.com/photo-1620023447192-3a339d672baf?auto=format&fit=crop&q=80&w=800"],
    hidden: true,
    unesco: true,
    history: "Built as a memorial to King Bhimdev I by his widowed queen Udayamati.",
    architecture: "Designed as an inverted temple highlighting the sanctity of water, featuring over 500 principal sculptures.",
    culturalSignificance: "An exceptional example of the Maru-Gurjara architectural style.",
    visitingTips: ["The intricate details are best captured in the morning light."],
    nearbyAttractions: ["Patan Patola Heritage", "Modhera Sun Temple"]
  },
  {
    id: "m-8",
    name: "Red Fort",
    location: { city: "Delhi", state: "Delhi", lat: 28.6562, lng: 77.2410 },
    category: "Forts",
    dynasty: "Mughal Empire",
    period: "1639",
    timePeriod: "17th Century",
    shortDesc: "A historic fort in the city of Delhi that served as the main residence of the Mughal Emperors.",
    images: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800"],
    hidden: false,
    unesco: true,
    history: "Commissioned by Shah Jahan, it represents the zenith of Mughal creativity.",
    architecture: "Known for its massive enclosing walls of red sandstone and its beautiful pavilions.",
    culturalSignificance: "Every year on Independence Day, the Prime Minister hoists the national flag at the fort's main gate.",
    visitingTips: ["Attend the evening light and sound show.", "Closed on Mondays."],
    nearbyAttractions: ["Jama Masjid", "Chandni Chowk"]
  },
  {
    id: "m-9",
    name: "National Museum",
    location: { city: "New Delhi", state: "Delhi", lat: 28.6119, lng: 77.2193 },
    category: "Museums",
    dynasty: "Modern",
    period: "1949",
    timePeriod: "20th Century",
    shortDesc: "One of the largest museums in India, holding over 200,000 works of art.",
    images: ["https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800"],
    hidden: false,
    unesco: false,
    history: "Established in 1949, it holds a variety of articles ranging from pre-historic era to modern works of art.",
    architecture: "The building was designed by Ganesh Bikaji Deolalikar.",
    culturalSignificance: "A premier institution safeguarding India's cultural heritage.",
    visitingTips: ["You need at least 4-5 hours to explore.", "Audio guides are highly recommended."],
    nearbyAttractions: ["India Gate", "Rashtrapati Bhavan"]
  },
  {
    id: "m-10",
    name: "Lepakshi Temple",
    location: { city: "Lepakshi", state: "Andhra Pradesh", lat: 13.8016, lng: 77.6067 },
    category: "Temples",
    dynasty: "Vijayanagara Empire",
    period: "16th Century",
    timePeriod: "16th Century",
    shortDesc: "Famous for its hanging pillar, cave shrines and monolithic Nandi.",
    images: ["https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800"],
    hidden: true,
    unesco: false,
    history: "Built by brothers Viranna and Virupanna, the temple is dedicated to Veerabhadra.",
    architecture: "Exemplifies the Vijayanagara architectural style with magnificent sculptures and mural paintings.",
    culturalSignificance: "A marvel of ancient engineering, famous for its hanging pillar.",
    visitingTips: ["Look for the hanging pillar and try passing a piece of cloth under it.", "Hire a local guide."],
    nearbyAttractions: ["Nandi Bull Statue", "Penukonda Fort"]
  }
];
