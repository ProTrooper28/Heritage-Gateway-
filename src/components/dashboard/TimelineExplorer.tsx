import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Search,
  X,
  Star,
  ChevronDown,
  Bot,
  MapPin,
  Users,
  Calendar,
  Landmark,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { DustParticles } from "@/components/heritage/Atmosphere";
import { useUserState } from "@/context/UserStateContext";
import { useNavigate } from "@tanstack/react-router";

// ─── Assets ───────────────────────────────────────────────────────────────────
import brihadeeswara from "@/assets/brihadeeswara.jpg";
import hampi from "@/assets/hampi.jpg";
import konark from "@/assets/konark.jpg";
import tajmahal from "@/assets/tajmahal.jpg";
import ajanta from "@/assets/ajanta.jpg";
import indusValley from "@/assets/indus-valley.png";
import mauryanAshoka from "@/assets/mauryan-ashoka.png";
import indiaIndependence from "@/assets/india-independence.png";
import chandrayaanMoon from "@/assets/chandrayaan-moon.png";

// ─── Types ────────────────────────────────────────────────────────────────────
type Category =
  | "All"
  | "Dynasties"
  | "Architecture"
  | "Wars"
  | "Religion"
  | "Culture"
  | "Science"
  | "Modern India";

type Era = {
  id: string;
  title: string;
  period: string;
  shortDesc: string;
  description: string;
  image: string;
  tag: string;
  category: Category;
  importance: string;
  isHighlight: boolean;
  highlightEvent?: string;
  personalities?: string[];
  monuments?: string[];
  searchTerms: string[];
};

// ─── Timeline Data ────────────────────────────────────────────────────────────
const ERAS: Era[] = [
  {
    id: "indus-valley",
    title: "Indus Valley Civilization",
    period: "3300 – 1300 BCE",
    shortDesc:
      "One of the world's earliest urban civilizations, flourishing in the Indus River basin with sophisticated city planning.",
    description:
      "The Indus Valley Civilization, one of the world's three earliest urban civilizations, flourished across the northwestern regions of South Asia. Cities like Mohenjo-daro and Harappa had remarkable urban planning with grid-like streets, advanced drainage systems, granaries, and standardized weights and measures. The civilization at its peak extended over 1.5 million km², larger than ancient Egypt and Mesopotamia combined.",
    image: indusValley,
    tag: "Indus Civilization",
    category: "Dynasties",
    importance:
      "World's earliest planned cities with advanced sanitation and trade networks.",
    isHighlight: false,
    personalities: ["Unknown rulers", "Merchant guilds"],
    monuments: ["Mohenjo-daro", "Harappa", "Lothal"],
    searchTerms: ["indus valley","harappa","mohenjo-daro","civilization","3300","1300"],
  },
  {
    id: "vedic-period",
    title: "Vedic Period",
    period: "1500 – 500 BCE",
    shortDesc:
      "A transformative era that shaped Indian philosophy, religion, and social structure through sacred Vedic texts.",
    description:
      "The Vedic Period saw the composition of the four Vedas — the Rigveda, Samaveda, Yajurveda, and Atharvaveda — foundational texts of Hinduism. Aryan tribes settled across the Indo-Gangetic plains, forming tribal kingdoms. This era witnessed the emergence of Sanskrit, the caste system's early forms, Vedic rituals, and the philosophical Upanishads that explored the nature of consciousness and reality.",
    image: ajanta,
    tag: "Vedic Age",
    category: "Religion",
    importance: "Foundation of Hinduism, Sanskrit literature, and Indian philosophy.",
    isHighlight: false,
    personalities: ["Sage Vyasa", "Vasishtha", "Vishwamitra"],
    monuments: ["Early fire altars", "Vedic sacrificial sites"],
    searchTerms: ["vedic","vedas","rigveda","sanskrit","hinduism","1500","500","aryan"],
  },
  {
    id: "mahajanapadas",
    title: "Mahajanapadas",
    period: "600 – 345 BCE",
    shortDesc:
      "Sixteen powerful republics and kingdoms that transformed Iron Age India into a competitive political landscape.",
    description:
      "The Mahajanapadas were sixteen powerful kingdoms and oligarchic republics that dominated the Indian subcontinent during the second urbanization period. Among these, Magadha, Kosala, Kuru, Gandhara, and Vatsa were the most prominent. This era saw the rise of Buddhism and Jainism as reform movements, the development of trade and mercantile classes, and eventual consolidation under Magadha which paved the way for the Mauryan Empire.",
    image: ajanta,
    tag: "Iron Age Republics",
    category: "Dynasties",
    importance: "Rise of republics, birth of Buddhism and Jainism, urban second revolution.",
    isHighlight: false,
    personalities: ["Bimbisara", "Ajatashatru", "Mahavira", "Siddhartha Gautama"],
    monuments: ["Rajgir", "Vaishali", "Pataliputra ruins"],
    searchTerms: ["mahajanapadas","magadha","republic","buddha","jainism","600","345"],
  },
  {
    id: "mauryan-empire",
    title: "Mauryan Empire",
    period: "322 – 185 BCE",
    shortDesc:
      "India's first pan-subcontinental empire, achieving its pinnacle under Emperor Ashoka who renounced war for Buddhism.",
    description:
      "Founded by Chandragupta Maurya with the counsel of Chanakya, the Mauryan Empire was ancient India's largest and most powerful empire. At its zenith under Emperor Ashoka (268–232 BCE), it stretched from Afghanistan to South India. After the brutal Kalinga War, Ashoka embraced Buddhism and propagated Dhamma (righteousness) across Asia through pillars, rock edicts, and missionaries — fundamentally reshaping Asian civilization.",
    image: mauryanAshoka,
    tag: "Mauryan Dynasty",
    category: "Dynasties",
    importance: "First unified Indian empire; spread of Buddhism across Asia.",
    isHighlight: true,
    highlightEvent: "Ashoka embraces Buddhism after the Kalinga War (261 BCE)",
    personalities: ["Chandragupta Maurya", "Chanakya", "Ashoka", "Bindusara"],
    monuments: ["Ashoka Pillars", "Sanchi Stupa", "Pataliputra Palace"],
    searchTerms: ["maurya","ashoka","chandragupta","chanakya","buddhism","kalinga","322","185","empire","pillar"],
  },
  {
    id: "gupta-empire",
    title: "Gupta Empire",
    period: "320 – 550 CE",
    shortDesc:
      "India's Golden Age — a period of unprecedented achievements in science, mathematics, astronomy, art, and philosophy.",
    description:
      "The Gupta Period is widely regarded as ancient India's Golden Age. Under rulers like Chandragupta I, Samudragupta, and Chandragupta II (Vikramaditya), the empire fostered extraordinary achievements. Aryabhata proposed the heliocentric model and calculated π. Kalidasa composed sublime Sanskrit literature. Vatsayana wrote the Kama Sutra. The decimal numeral system with zero emerged, later transforming global mathematics.",
    image: ajanta,
    tag: "Gupta Dynasty",
    category: "Culture",
    importance: "India's Golden Age: mathematics, astronomy, art, and literature peak.",
    isHighlight: false,
    personalities: ["Chandragupta II", "Samudragupta", "Aryabhata", "Kalidasa"],
    monuments: ["Ajanta Caves", "Nalanda University", "Gupta temples"],
    searchTerms: ["gupta","golden age","aryabhata","kalidasa","mathematics","320","550","nalanda"],
  },
  {
    id: "chola-empire",
    title: "Chola Empire",
    period: "300 BCE – 1279 CE",
    shortDesc:
      "South India's greatest maritime empire, master builders of Dravidian temples that defined Indian architecture.",
    description:
      "The Chola Dynasty, one of the longest-ruling dynasties in history, reached its apex during the Medieval Chola period (850–1279 CE). Under Raja Raja Chola I and Rajendra Chola I, the empire commanded a formidable navy, established trade networks across Southeast Asia, and constructed architectural masterpieces. The Brihadeeswara Temple at Thanjavur, built by Raja Raja Chola I in 1010 CE, remains one of humanity's greatest architectural achievements.",
    image: brihadeeswara,
    tag: "Chola Dynasty",
    category: "Architecture",
    importance: "Finest Dravidian architecture; maritime empire across Southeast Asia.",
    isHighlight: true,
    highlightEvent: "Construction of Brihadeeswara Temple, Thanjavur (1010 CE)",
    personalities: ["Raja Raja Chola I", "Rajendra Chola I", "Karikala Chola"],
    monuments: ["Brihadeeswara Temple", "Gangaikonda Cholapuram", "Darasuram Temple"],
    searchTerms: ["chola","brihadeeswara","raja raja","thanjavur","dravidian","temple","1010","maritime"],
  },
  {
    id: "delhi-sultanate",
    title: "Delhi Sultanate",
    period: "1206 – 1526 CE",
    shortDesc:
      "Five successive Islamic dynasties ruled from Delhi, transforming Indian architecture, language, and culture.",
    description:
      "The Delhi Sultanate comprised five dynasties: the Slave, Khalji, Tughlaq, Sayyid, and Lodi dynasties. This period saw Persian, Turkish, and Afghan influences reshape Indian culture, language, music, and architecture. The Qutub Minar — UNESCO-listed, the world's tallest brick minaret — and the Konark Sun Temple were built during this era. Alauddin Khalji successfully repelled Mongol invasions while implementing radical economic reforms.",
    image: konark,
    tag: "Delhi Sultanate",
    category: "Architecture",
    importance: "Synthesis of Indian and Islamic architectural traditions.",
    isHighlight: true,
    highlightEvent: "Construction of the Konark Sun Temple (1250 CE)",
    personalities: ["Qutb-ud-din Aibak", "Iltutmish", "Alauddin Khalji", "Muhammad bin Tughluq"],
    monuments: ["Qutub Minar", "Konark Sun Temple", "Alai Darwaza"],
    searchTerms: ["delhi","sultanate","qutub minar","konark","khalji","1206","1526","islamic"],
  },
  {
    id: "vijayanagara",
    title: "Vijayanagara Empire",
    period: "1336 – 1646 CE",
    shortDesc:
      "South India's last great Hindu empire, whose capital Hampi was one of the world's richest and most magnificent cities.",
    description:
      "Founded by brothers Harihara I and Bukka Raya, the Vijayanagara Empire served as a bulwark against northern Muslim invasions while nurturing Hindu, Jain, and Muslim communities. At its peak under Krishnadevaraya, its capital Hampi was among the world's most prosperous cities, described by foreign visitors as surpassing Rome and Beijing. The empire's downfall came after the Battle of Talikota (1565 CE) when the capital was sacked.",
    image: hampi,
    tag: "Vijayanagara",
    category: "Architecture",
    importance: "South India's greatest Hindu empire; Hampi was a global center of wealth.",
    isHighlight: true,
    highlightEvent: "Hampi at its peak under Krishnadevaraya — a city rivaling Rome (1509–1529 CE)",
    personalities: ["Krishnadevaraya", "Harihara I", "Bukka Raya I", "Saluva Narasimha"],
    monuments: ["Hampi Group of Monuments", "Vittala Temple", "Virupaksha Temple"],
    searchTerms: ["vijayanagara","hampi","krishnadevaraya","hindu empire","1336","1646","karnataka"],
  },
  {
    id: "mughal-empire",
    title: "Mughal Empire",
    period: "1526 – 1857 CE",
    shortDesc:
      "India's last great empire, whose patronage of art and architecture created some of humanity's greatest masterpieces.",
    description:
      "Founded by Babur after his victory at the First Battle of Panipat, the Mughal Empire reached its zenith under Akbar, Jahangir, Shah Jahan, and Aurangzeb. Shah Jahan commissioned the Taj Mahal as an eternal monument of love for his wife Mumtaz Mahal — completed in 1653 CE after 22 years and 22,000 artisans. Mughal art, architecture, music, cuisine, and literature defined a unique Indo-Persian cultural synthesis.",
    image: tajmahal,
    tag: "Mughal Dynasty",
    category: "Architecture",
    importance: "Peak of Indo-Persian art and architecture; the Taj Mahal created.",
    isHighlight: true,
    highlightEvent: "Taj Mahal completed by Shah Jahan (1653 CE)",
    personalities: ["Babur", "Akbar", "Shah Jahan", "Mumtaz Mahal", "Aurangzeb"],
    monuments: ["Taj Mahal", "Red Fort", "Fatehpur Sikri", "Humayun's Tomb"],
    searchTerms: ["mughal","taj mahal","akbar","shah jahan","babur","1526","1857","agra"],
  },
  {
    id: "maratha",
    title: "Maratha Confederacy",
    period: "1674 – 1818 CE",
    shortDesc:
      "A formidable Hindu confederacy that challenged Mughal and British supremacy, controlling much of the Indian subcontinent.",
    description:
      "Founded by Chhatrapati Shivaji Maharaj, the Maratha Empire grew from a regional power in the Deccan to a pan-Indian confederacy controlling most of India by the 18th century. The Maratha Peshwas — especially Bajirao I — expanded the empire to its greatest extent. The Third Battle of Panipat (1761) against Ahmad Shah Durrani was a turning point that weakened Maratha power, eventually leading to British supremacy.",
    image: ajanta,
    tag: "Maratha Empire",
    category: "Wars",
    importance: "Last major Hindu power; checked Mughal and British expansion.",
    isHighlight: false,
    personalities: ["Shivaji Maharaj", "Bajirao I", "Nana Fadnavis", "Mahadji Shinde"],
    monuments: ["Raigad Fort", "Shaniwarwada", "Sinhagad Fort"],
    searchTerms: ["maratha","shivaji","peshwa","bajirao","1674","1818","panipat"],
  },
  {
    id: "british-colonial",
    title: "British Colonial Rule",
    period: "1757 – 1947 CE",
    shortDesc:
      "Two centuries of British dominion over India, resisted by a powerful independence movement led by Mahatma Gandhi.",
    description:
      "British rule began effectively with Robert Clive's victory at the Battle of Plassey (1757) over Nawab Siraj-ud-Daulah of Bengal. The East India Company gradually replaced Indian rulers until the 1857 Uprising (the First War of Independence), after which the British Crown took direct control. The independence movement grew through the Indian National Congress, Non-Cooperation Movement, Civil Disobedience, and the Quit India Movement, culminating in independence on August 15, 1947.",
    image: indiaIndependence,
    tag: "British Raj",
    category: "Wars",
    importance: "Colonial rule that sparked one of history's greatest freedom movements.",
    isHighlight: true,
    highlightEvent: "Battle of Plassey — Britain establishes dominance over Bengal (1757 CE)",
    personalities: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "B.R. Ambedkar"],
    monuments: ["India Gate", "Victoria Memorial", "Gateway of India"],
    searchTerms: ["british","colonial","raj","gandhi","plassey","independence","1757","1947","nehru"],
  },
  {
    id: "independence",
    title: "Indian Independence",
    period: "August 15, 1947",
    shortDesc:
      "The midnight hour when India awoke to freedom — ending 190 years of British colonialism.",
    description:
      "At the stroke of midnight on August 15, 1947, India achieved independence from British rule. Jawaharlal Nehru delivered his iconic 'Tryst with Destiny' speech as the Tricolor was hoisted over the Red Fort in Delhi. The partition of British India into the Dominions of India and Pakistan led to one of history's largest mass migrations and communal violence, while simultaneously marking the triumph of a non-violent freedom movement.",
    image: indiaIndependence,
    tag: "Modern India",
    category: "Modern India",
    importance: "Freedom from 190 years of colonialism; birth of the largest democracy.",
    isHighlight: true,
    highlightEvent: "India achieves independence — Nehru's 'Tryst with Destiny' speech",
    personalities: ["Jawaharlal Nehru", "Mahatma Gandhi", "Vallabhbhai Patel", "Lord Mountbatten"],
    monuments: ["Red Fort, Delhi", "India Gate", "Parliament House"],
    searchTerms: ["independence","1947","freedom","nehru","gandhi","tryst","partition","british"],
  },
  {
    id: "republic",
    title: "Republic of India",
    period: "January 26, 1950",
    shortDesc:
      "The world's largest democracy adopts its Constitution — a landmark document ensuring equality and fundamental rights.",
    description:
      "On January 26, 1950, India became a sovereign democratic republic with the adoption of its Constitution, the world's longest written constitution. Drafted under the chairmanship of Dr. B.R. Ambedkar over nearly three years, it guaranteed fundamental rights, abolished untouchability, and established a parliamentary system of government. The Constitution drew from British, American, Irish, French, Canadian, Australian, German, and Soviet constitutional traditions.",
    image: indiaIndependence,
    tag: "Republic",
    category: "Modern India",
    importance: "World's largest democracy; universal adult suffrage enshrined.",
    isHighlight: true,
    highlightEvent: "Indian Constitution adopted — world's largest democracy born",
    personalities: ["B.R. Ambedkar", "Jawaharlal Nehru", "Rajendra Prasad"],
    monuments: ["Parliament of India", "Supreme Court of India"],
    searchTerms: ["republic","constitution","ambedkar","1950","democracy","fundamental rights"],
  },
  {
    id: "green-revolution",
    title: "Green Revolution",
    period: "1960s – 1980s",
    shortDesc:
      "India's agricultural transformation from chronic food shortages to self-sufficiency through modern farming techniques.",
    description:
      "The Green Revolution in India was spearheaded by agricultural scientist M.S. Swaminathan and Prime Minister Lal Bahadur Shastri under the slogan 'Jai Jawan, Jai Kisan.' High-yield variety seeds, chemical fertilizers, pesticides, and irrigation infrastructure transformed Punjab and Haryana into India's breadbasket. India went from importing food under PL480 to achieving food self-sufficiency by the late 1970s, averting feared famines.",
    image: ajanta,
    tag: "Scientific Era",
    category: "Science",
    importance: "Food security achieved; transformed India from food importer to exporter.",
    isHighlight: false,
    personalities: ["M.S. Swaminathan", "Lal Bahadur Shastri", "Norman Borlaug"],
    monuments: ["IIT Campuses", "ICAR Research Centers"],
    searchTerms: ["green revolution","swaminathan","agriculture","1960","1970","food","wheat","punjab"],
  },
  {
    id: "liberalization",
    title: "Economic Liberalization",
    period: "1991 CE",
    shortDesc:
      "India's historic economic pivot that opened the economy to the world, unleashing unprecedented growth.",
    description:
      "In 1991, facing a severe balance of payments crisis, India under Prime Minister P.V. Narasimha Rao and Finance Minister Manmohan Singh undertook sweeping economic reforms. The License Raj was dismantled, foreign investment welcomed, and state monopolies broken up. India's GDP growth accelerated dramatically, the middle class expanded, and the IT revolution began. This single year transformed India's economic trajectory for decades.",
    image: chandrayaanMoon,
    tag: "Economic Era",
    category: "Modern India",
    importance: "Economic opening that set India on path to becoming a global power.",
    isHighlight: false,
    personalities: ["P.V. Narasimha Rao", "Manmohan Singh", "Montek Singh Ahluwalia"],
    monuments: ["Bombay Stock Exchange", "SEBI Headquarters"],
    searchTerms: ["liberalization","1991","economy","manmohan singh","narasimha rao","reform","gdp"],
  },
  {
    id: "digital-india",
    title: "Digital India",
    period: "2015 – Present",
    shortDesc:
      "India's digital transformation initiative connecting 1.4 billion citizens through technology.",
    description:
      "Launched in 2015 by Prime Minister Narendra Modi, the Digital India initiative aims to transform India into a digitally empowered society. Key achievements include the Unified Payments Interface (UPI) processing over 10 billion monthly transactions, Aadhaar biometric ID covering 1.3 billion people, Direct Benefit Transfer eliminating welfare leakage, and CoWIN — India's vaccination management platform that managed the world's largest vaccination drive.",
    image: chandrayaanMoon,
    tag: "Digital Era",
    category: "Science",
    importance: "India becomes world's largest digital payment ecosystem.",
    isHighlight: false,
    personalities: ["Narendra Modi", "Nandan Nilekani", "Sam Pitroda"],
    monuments: ["India Stack", "UPI Infrastructure"],
    searchTerms: ["digital india","upi","aadhaar","technology","2015","modi","payments"],
  },
  {
    id: "chandrayaan",
    title: "Chandrayaan Missions",
    period: "2008 – 2023 CE",
    shortDesc:
      "India joins the elite space club, achieving the first soft landing at the Moon's south pole.",
    description:
      "India's Chandrayaan program achieved a series of historic firsts. Chandrayaan-1 (2008) confirmed the presence of water ice on the Moon. Chandrayaan-2 (2019) placed a successful orbiter. Chandrayaan-3 (2023) made history as the first mission to successfully soft-land at the lunar south pole — a region of immense scientific interest for its water ice deposits. India became only the fourth nation ever to land on the Moon and the first at the south pole.",
    image: chandrayaanMoon,
    tag: "Space Age",
    category: "Science",
    importance: "First lunar south pole landing in history; India joins the Moon-landing club.",
    isHighlight: true,
    highlightEvent: "Chandrayaan-3 lands at the Moon's south pole — world's first (August 23, 2023)",
    personalities: ["K. Sivan", "S. Somanath", "A.P.J. Abdul Kalam"],
    monuments: ["ISRO Headquarters", "Satish Dhawan Space Centre"],
    searchTerms: ["chandrayaan","moon","isro","2023","space","lunar","south pole","india space"],
  },
  {
    id: "g20",
    title: "G20 Presidency",
    period: "2023 CE",
    shortDesc:
      "India chairs the G20 under the theme 'Vasudhaiva Kutumbakam' — the world is one family.",
    description:
      "India assumed the G20 Presidency on December 1, 2022, under the theme 'Vasudhaiva Kutumbakam' (One Earth, One Family, One Future), derived from the Maha Upanishad. India hosted over 200 meetings across 60 cities, bringing global leaders to experience Indian culture and heritage sites. The New Delhi Declaration was adopted by consensus, addressing global debt, climate finance, and multilateral development reform.",
    image: chandrayaanMoon,
    tag: "Global Diplomacy",
    category: "Modern India",
    importance: "India leads global governance agenda, elevating developing nations.",
    isHighlight: false,
    personalities: ["Narendra Modi", "Amitabh Kant", "Shashi Tharoor"],
    monuments: ["Bharat Mandapam", "India Gate Canopy"],
    searchTerms: ["g20","2023","presidency","vasudhaiva","diplomacy","delhi","global"],
  },
  {
    id: "present",
    title: "India Today — 2026",
    period: "2026 CE",
    shortDesc:
      "India stands as the world's most populous nation and fifth-largest economy, shaping the 21st century.",
    description:
      "In 2026, India is the world's most populous nation with over 1.45 billion people and the fifth-largest economy at $3.7 trillion GDP. India is projected to become the third-largest economy by 2030. India leads in digital payments, space exploration, renewable energy capacity, and software exports. The country's youth demographic — over 600 million under 25 — positions India as a defining force of the 21st century, continuing a civilization spanning 5,000 years.",
    image: chandrayaanMoon,
    tag: "Present Day",
    category: "Modern India",
    importance: "World's most populous nation; democracy, technology, and culture converge.",
    isHighlight: false,
    personalities: ["India's 1.45 billion citizens"],
    monuments: ["Ram Mandir, Ayodhya", "GIFT City", "Navi Mumbai Airport"],
    searchTerms: ["india","2026","present","economy","population","democracy","technology"],
  },
];

const CATEGORIES: Category[] = [
  "All","Dynasties","Architecture","Wars","Religion","Culture","Science","Modern India",
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Main Component ───────────────────────────────────────────────────────────
export function TimelineExplorer() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [currentEraIndex, setCurrentEraIndex] = useState(0);
  const [jumpTarget, setJumpTarget] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const eraRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { addActivity, incrementStat } = useUserState();

  useEffect(() => {
    addActivity("Timeline Explorer", "Visited Timeline Explorer");
    incrementStat("explorationCount");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const filteredEras = ERAS.filter((era) => {
    const matchesCategory = activeCategory === "All" || era.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      era.searchTerms.some((t) => t.includes(q)) ||
      era.title.toLowerCase().includes(q) ||
      era.period.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Track current era for sticky indicator
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let closestIndex = 0;
      let closestDist = Infinity;
      filteredEras.forEach((era, i) => {
        const el = eraRefs.current[era.id];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - containerTop - 200);
        if (dist < closestDist) { closestDist = dist; closestIndex = i; }
      });
      setCurrentEraIndex(closestIndex);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery]);

  const handleJump = useCallback((eraId: string) => {
    setJumpTarget(eraId);
    const el = eraRefs.current[eraId];
    if (el && containerRef.current) {
      containerRef.current.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
    }
  }, []);

  return (
    <motion.div
      key="timeline-explorer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ position: "relative", minHeight: "100vh", background: "oklch(0.13 0.008 60)", display: "flex", flexDirection: "column" }}
    >
      {/* Ambient background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 50% 40% at 50% 0%, oklch(0.79 0.11 82 / 0.06), transparent)," +
          "radial-gradient(ellipse 40% 30% at 0% 50%, oklch(0.65 0.15 240 / 0.04), transparent)" }} />

      {/* Page header */}
      <TimelineHeader
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        eras={ERAS}
        filteredEras={filteredEras}
        currentEraIndex={currentEraIndex}
        onJump={handleJump}
        jumpTarget={jumpTarget}
      />

      {/* Timeline scroll container */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative", zIndex: 1, scrollbarWidth: "none" }}
        className="scrollbar-hide"
      >
        {/* Progress bar */}
        <div style={{ position: "fixed", top: 0, left: 0, width: "3px", height: "100vh", background: "oklch(0.79 0.11 82 / 0.06)", zIndex: 60 }}>
          <motion.div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, oklch(0.79 0.11 82), oklch(0.79 0.11 82 / 0.3))", transformOrigin: "top", scaleY }} />
        </div>

        {/* Ambient dust particles */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2 }}>
          <DustParticles />
        </div>

        {/* Timeline content */}
        <div style={{ padding: "2rem 2rem 8rem", position: "relative" }}>
          {filteredEras.length === 0 ? (
            <EmptyState query={searchQuery} />
          ) : (
            <TimelineBody eras={filteredEras} eraRefs={eraRefs} onSelectEra={setSelectedEra} scaleY={scaleY} />
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEra && (
          <EraModal
            era={selectedEra}
            onClose={() => setSelectedEra(null)}
            onAskAI={() => { setSelectedEra(null); navigate({ to: "/ai-historian" }); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function TimelineHeader({
  activeCategory, setActiveCategory, searchQuery, setSearchQuery,
  eras, filteredEras, currentEraIndex, onJump,
}: {
  activeCategory: Category;
  setActiveCategory: (c: Category) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  eras: Era[];
  filteredEras: Era[];
  currentEraIndex: number;
  onJump: (id: string) => void;
  jumpTarget: string;
}) {
  const [jumpOpen, setJumpOpen] = useState(false);
  const currentEra = filteredEras[currentEraIndex];

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 30, background: "oklch(0.13 0.008 60 / 0.93)", backdropFilter: "blur(24px) saturate(150%)", borderBottom: "1px solid oklch(0.79 0.11 82 / 0.12)", padding: "1.5rem 2rem 1rem" }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.4em", color: "oklch(0.79 0.11 82 / 0.7)", marginBottom: "0.35rem" }}>
            Heritage Gateway — Interactive History
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 300, color: "oklch(0.96 0.012 85)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Journey Through{" "}<span style={{ color: "oklch(0.79 0.11 82)" }}>Time</span>
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Sticky era indicator */}
          {currentEra && (
            <AnimatePresence mode="wait">
              <motion.div key={currentEra.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }}
                style={{ padding: "0.35rem 0.85rem", borderRadius: "2rem", border: "1px solid oklch(0.79 0.11 82 / 0.25)", background: "oklch(0.79 0.11 82 / 0.08)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "oklch(0.79 0.11 82)", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.65rem", color: "oklch(0.79 0.11 82)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                  {currentEra.period}
                </span>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Jump to Era dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setJumpOpen((o) => !o)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.85rem", borderRadius: "0.65rem", border: "1px solid oklch(0.96 0.012 85 / 0.12)", background: "oklch(0.96 0.012 85 / 0.05)", color: "oklch(0.96 0.012 85 / 0.65)", fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.7rem", letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.2s" }}>
              <Landmark size={12} />
              Jump to Era
              <ChevronDown size={12} style={{ transform: jumpOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>
            <AnimatePresence>
              {jumpOpen && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.18, ease: EASE }}
                  style={{ position: "absolute", top: "calc(100% + 0.5rem)", right: 0, minWidth: "220px", maxHeight: "320px", overflowY: "auto", background: "linear-gradient(145deg, oklch(0.18 0.008 60 / 0.98), oklch(0.13 0.008 60 / 0.99))", backdropFilter: "blur(28px)", border: "1px solid oklch(0.79 0.11 82 / 0.2)", borderRadius: "0.875rem", boxShadow: "0 24px 60px oklch(0 0 0 / 0.7)", zIndex: 100, scrollbarWidth: "none" }}
                  className="scrollbar-hide"
                >
                  {eras.map((era) => (
                    <button key={era.id} onClick={() => { onJump(era.id); setJumpOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.55rem 1rem", background: "transparent", border: "none", color: era.isHighlight ? "oklch(0.79 0.11 82)" : "oklch(0.96 0.012 85 / 0.7)", fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.72rem", cursor: "pointer", textAlign: "left" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.79 0.11 82 / 0.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >
                      {era.isHighlight && <Star size={10} style={{ color: "oklch(0.79 0.11 82)", flexShrink: 0 }} fill="currentColor" />}
                      <span style={{ flex: 1 }}>{era.title}</span>
                      <span style={{ fontSize: "0.58rem", color: "oklch(0.96 0.012 85 / 0.35)", whiteSpace: "nowrap" }}>{era.period.split("–")[0]!.trim()}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filter chips + search */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", flex: 1 }}>
          {CATEGORIES.map((cat) => (
            <FilterChip key={cat} label={cat} isActive={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
          ))}
        </div>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "oklch(0.96 0.012 85 / 0.35)", pointerEvents: "none" }} />
          <input type="text" placeholder="Search monument, king, year…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "0.45rem 2rem 0.45rem 2.1rem", borderRadius: "2rem", border: "1px solid oklch(0.96 0.012 85 / 0.1)", background: "oklch(0.1 0.003 60 / 0.5)", color: "oklch(0.96 0.012 85)", fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.72rem", outline: "none", width: "220px", transition: "border 0.2s, box-shadow 0.2s" }}
            onFocus={(e) => { e.target.style.border = "1px solid oklch(0.79 0.11 82 / 0.4)"; e.target.style.boxShadow = "0 0 0 1px oklch(0.79 0.11 82 / 0.15)"; }}
            onBlur={(e) => { e.target.style.border = "1px solid oklch(0.96 0.012 85 / 0.1)"; e.target.style.boxShadow = "none"; }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "oklch(0.96 0.012 85 / 0.4)", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Filter Chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void; }) {
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onClick}
      style={{ padding: "0.35rem 0.85rem", borderRadius: "2rem", border: isActive ? "1px solid oklch(0.79 0.11 82 / 0.6)" : "1px solid oklch(0.96 0.012 85 / 0.12)", background: isActive ? "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.22), oklch(0.79 0.11 82 / 0.08))" : "oklch(0.96 0.012 85 / 0.04)", color: isActive ? "oklch(0.79 0.11 82)" : "oklch(0.96 0.012 85 / 0.55)", fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.68rem", letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.2s ease", boxShadow: isActive ? "0 0 16px oklch(0.79 0.11 82 / 0.2), inset 0 1px 0 oklch(0.79 0.11 82 / 0.15)" : "none", whiteSpace: "nowrap" }}>
      {label}
    </motion.button>
  );
}

// ─── Timeline Body ─────────────────────────────────────────────────────────────
function TimelineBody({
  eras, eraRefs, onSelectEra,
}: {
  eras: Era[];
  eraRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onSelectEra: (era: Era) => void;
  scaleY: ReturnType<typeof useSpring>;
}) {
  return (
    <div style={{ position: "relative" }}>
      {/* Vertical spine */}
      <div className="timeline-spine" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, transform: "translateX(-50%)", zIndex: 1, pointerEvents: "none" }} />
      {/* Era cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative", zIndex: 2 }}>
        {eras.map((era, index) => (
          <TimelineEraItem
            key={era.id}
            era={era}
            index={index}
            isLeft={index % 2 === 0}
            onSelect={onSelectEra}
            eraRefs={eraRefs}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Timeline Era Item ────────────────────────────────────────────────────────
function TimelineEraItem({
  era, index, isLeft, onSelect, eraRefs,
}: {
  era: Era;
  index: number;
  isLeft: boolean;
  onSelect: (era: Era) => void;
  eraRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}) {
  const [hovered, setHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -60 : 60, y: 20, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE, delay: 0.05 } },
  };

  return (
    <div
      ref={(el) => { eraRefs.current[era.id] = el; }}
      style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", alignItems: "center", marginBottom: era.isHighlight ? "3.5rem" : "2.5rem", minHeight: era.isHighlight ? "280px" : "220px" }}
    >
      {/* Left slot */}
      <div style={{ gridColumn: 1, display: "flex", justifyContent: "flex-end", paddingRight: "2rem" }}>
        {isLeft && (
          <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} style={{ width: "100%", maxWidth: era.isHighlight ? "520px" : "440px" }}>
            <EraCard era={era} hovered={hovered} setHovered={setHovered} onSelect={onSelect} />
          </motion.div>
        )}
      </div>

      {/* Center: year + node */}
      <div style={{ gridColumn: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem", position: "relative" }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.6rem", color: era.isHighlight ? "oklch(0.79 0.11 82)" : "oklch(0.96 0.012 85 / 0.4)", textAlign: "center", letterSpacing: "0.04em", whiteSpace: "nowrap", marginBottom: "0.25rem" }}>
          {era.period.split("–")[0]!.trim()}
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 300 }}
          className={era.isHighlight ? "timeline-node-highlight" : "timeline-node"}
          style={{ width: era.isHighlight ? "18px" : "12px", height: era.isHighlight ? "18px" : "12px", borderRadius: "50%", background: "oklch(0.79 0.11 82)", border: era.isHighlight ? "2px solid oklch(0.96 0.012 85 / 0.8)" : "1.5px solid oklch(0.96 0.012 85 / 0.4)", flexShrink: 0, position: "relative", zIndex: 2 }}>
          {era.isHighlight && (
            <div style={{ position: "absolute", inset: "-6px", borderRadius: "50%", background: "oklch(0.79 0.11 82 / 0.12)", border: "1px solid oklch(0.79 0.11 82 / 0.25)" }} />
          )}
        </motion.div>
        <div style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.52rem", color: "oklch(0.96 0.012 85 / 0.2)", letterSpacing: "0.08em" }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Right slot */}
      <div style={{ gridColumn: 3, display: "flex", justifyContent: "flex-start", paddingLeft: "2rem" }}>
        {!isLeft && (
          <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} style={{ width: "100%", maxWidth: era.isHighlight ? "520px" : "440px" }}>
            <EraCard era={era} hovered={hovered} setHovered={setHovered} onSelect={onSelect} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Era Card ─────────────────────────────────────────────────────────────────
function EraCard({ era, hovered, setHovered, onSelect }: { era: Era; hovered: boolean; setHovered: (v: boolean) => void; onSelect: (era: Era) => void; }) {
  return (
    <motion.button
      whileHover={{ y: -6, scale: 1.015 }} whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(era)}
      style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer", border: "none", background: "transparent", padding: 0, borderRadius: era.isHighlight ? "1.5rem" : "1.25rem", transition: "all 0.3s ease",
        boxShadow: hovered ? (era.isHighlight ? "0 0 40px oklch(0.79 0.11 82 / 0.25), 0 20px 60px oklch(0 0 0 / 0.6)" : "0 0 20px oklch(0.79 0.11 82 / 0.12), 0 16px 40px oklch(0 0 0 / 0.5)") : (era.isHighlight ? "0 0 30px oklch(0.79 0.11 82 / 0.15), 0 16px 40px oklch(0 0 0 / 0.5)" : "0 8px 32px oklch(0 0 0 / 0.4)") }}>
      <div className={era.isHighlight ? "timeline-card-highlight" : "timeline-card"}
        style={{ padding: era.isHighlight ? "1.75rem" : "1.35rem", border: hovered ? `1px solid oklch(0.79 0.11 82 / ${era.isHighlight ? "0.6" : "0.35"})` : undefined, position: "relative", overflow: "hidden" }}>
        {/* Top shimmer */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: (hovered || era.isHighlight) ? "linear-gradient(90deg, transparent, oklch(0.79 0.11 82 / 0.6), transparent)" : "linear-gradient(90deg, transparent, oklch(0.96 0.012 85 / 0.1), transparent)", transition: "background 0.3s" }} />

        {/* Milestone badge */}
        {era.isHighlight && (
          <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", borderRadius: "2rem", background: "oklch(0.79 0.11 82 / 0.15)", border: "1px solid oklch(0.79 0.11 82 / 0.35)" }}>
            <Star size={9} fill="oklch(0.79 0.11 82)" color="oklch(0.79 0.11 82)" />
            <span style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.58rem", color: "oklch(0.79 0.11 82)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Milestone</span>
          </div>
        )}

        {/* Image */}
        <div style={{ borderRadius: "0.85rem", overflow: "hidden", marginBottom: "1rem", height: era.isHighlight ? "160px" : "120px", position: "relative" }}>
          <img src={era.image} alt={era.title} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.8s ease", filter: "brightness(0.75) contrast(1.05) saturate(0.9)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, oklch(0.08 0.005 60 / 0.7), transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: "0.6rem", left: "0.6rem", padding: "0.2rem 0.6rem", borderRadius: "2rem", background: "oklch(0.08 0.005 60 / 0.85)", backdropFilter: "blur(8px)", border: "1px solid oklch(0.96 0.012 85 / 0.12)", fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.79 0.11 82 / 0.85)" }}>
            {era.tag}
          </div>
        </div>

        {/* Content */}
        <div>
          <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", color: era.isHighlight ? "oklch(0.79 0.11 82 / 0.9)" : "oklch(0.79 0.11 82 / 0.6)", marginBottom: "0.35rem", textTransform: "uppercase" }}>
            {era.period}
          </p>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: era.isHighlight ? "1.5rem" : "1.2rem", fontWeight: 300, color: "oklch(0.96 0.012 85)", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: "0.6rem" }}>
            {era.title}
          </h3>
          {era.isHighlight && era.highlightEvent && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", padding: "0.5rem 0.75rem", borderRadius: "0.65rem", background: "oklch(0.79 0.11 82 / 0.08)", border: "1px solid oklch(0.79 0.11 82 / 0.2)", marginBottom: "0.65rem" }}>
              <Star size={10} fill="oklch(0.79 0.11 82)" color="oklch(0.79 0.11 82)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.82rem", fontStyle: "italic", color: "oklch(0.79 0.11 82 / 0.9)", lineHeight: 1.4 }}>{era.highlightEvent}</p>
            </div>
          )}
          <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.75rem", fontWeight: 300, lineHeight: 1.6, color: "oklch(0.96 0.012 85 / 0.55)", marginBottom: "0.75rem" }}>
            {era.shortDesc}
          </p>
          <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.66rem", color: "oklch(0.96 0.012 85 / 0.35)", lineHeight: 1.5, borderTop: "1px solid oklch(0.96 0.012 85 / 0.06)", paddingTop: "0.65rem", display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
            <BookOpen size={10} style={{ flexShrink: 0, marginTop: "2px" }} />
            {era.importance}
          </p>
        </div>

        {/* Hover glass shimmer */}
        {hovered && (
          <div style={{ position: "absolute", top: "-50%", left: "-20%", width: "60%", height: "200%", background: "linear-gradient(105deg, transparent 40%, oklch(0.96 0.012 85 / 0.04) 50%, transparent 60%)", pointerEvents: "none", transform: "skewX(-15deg)" }} />
        )}
      </div>
    </motion.button>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: "center", padding: "6rem 2rem" }}>
      <Search size={40} style={{ color: "oklch(0.79 0.11 82 / 0.3)", margin: "0 auto 1.5rem" }} />
      <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", color: "oklch(0.96 0.012 85 / 0.6)", marginBottom: "0.5rem" }}>No eras found</h3>
      <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.8rem", color: "oklch(0.96 0.012 85 / 0.35)" }}>
        No results for &ldquo;{query}&rdquo;. Try a different search term.
      </p>
    </motion.div>
  );
}

// ─── Era Detail Modal ─────────────────────────────────────────────────────────
function EraModal({ era, onClose, onAskAI }: { era: Era; onClose: () => void; onAskAI: () => void; }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "oklch(0 0 0 / 0.78)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0, filter: "blur(12px)" }} animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}
        style={{ position: "relative", width: "100%", maxWidth: "760px", maxHeight: "90vh", overflowY: "auto", borderRadius: "1.75rem", background: "linear-gradient(150deg, oklch(0.17 0.008 60 / 0.98), oklch(0.11 0.006 60 / 0.99))", backdropFilter: "blur(40px) saturate(150%)", border: era.isHighlight ? "1px solid oklch(0.79 0.11 82 / 0.4)" : "1px solid oklch(0.96 0.012 85 / 0.12)", boxShadow: era.isHighlight ? "0 0 60px oklch(0.79 0.11 82 / 0.2), 0 40px 100px oklch(0 0 0 / 0.8)" : "0 40px 100px oklch(0 0 0 / 0.8)", scrollbarWidth: "none" }}
        className="scrollbar-hide"
      >
        {/* Header gold line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, oklch(0.79 0.11 82 / 0.6), transparent)" }} />

        {/* Hero image */}
        <div style={{ height: "280px", position: "relative", overflow: "hidden", borderRadius: "1.75rem 1.75rem 0 0" }}>
          <img src={era.image} alt={era.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65) contrast(1.1) saturate(0.85)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, oklch(0.13 0.008 60 / 0.95) 100%)" }} />
          <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", alignItems: "center", justifyContent: "center", width: "2.2rem", height: "2.2rem", borderRadius: "50%", border: "1px solid oklch(0.96 0.012 85 / 0.2)", background: "oklch(0.08 0.005 60 / 0.8)", backdropFilter: "blur(8px)", color: "oklch(0.96 0.012 85 / 0.7)", cursor: "pointer" }}>
            <X size={14} />
          </button>
          <div style={{ position: "absolute", bottom: "1.5rem", left: "2rem", right: "2rem" }}>
            {era.isHighlight && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.2rem 0.7rem", borderRadius: "2rem", background: "oklch(0.79 0.11 82 / 0.15)", border: "1px solid oklch(0.79 0.11 82 / 0.4)", marginBottom: "0.5rem" }}>
                <Star size={10} fill="oklch(0.79 0.11 82)" color="oklch(0.79 0.11 82)" />
                <span style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.6rem", color: "oklch(0.79 0.11 82)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Historical Milestone</span>
              </div>
            )}
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300, color: "oklch(0.96 0.012 85)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{era.title}</h2>
            <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.72rem", color: "oklch(0.79 0.11 82 / 0.8)", letterSpacing: "0.1em", marginTop: "0.3rem", textTransform: "uppercase" }}>{era.period}</p>
          </div>
        </div>

        {/* Modal body */}
        <div style={{ padding: "2rem" }}>
          {era.isHighlight && era.highlightEvent && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", padding: "0.85rem 1.1rem", borderRadius: "0.875rem", background: "oklch(0.79 0.11 82 / 0.08)", border: "1px solid oklch(0.79 0.11 82 / 0.25)", marginBottom: "1.5rem" }}>
              <Star size={14} fill="oklch(0.79 0.11 82)" color="oklch(0.79 0.11 82)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem", fontStyle: "italic", color: "oklch(0.79 0.11 82 / 0.95)", lineHeight: 1.5 }}>{era.highlightEvent}</p>
            </div>
          )}
          <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.85rem", fontWeight: 300, lineHeight: 1.8, color: "oklch(0.96 0.012 85 / 0.72)", marginBottom: "2rem" }}>{era.description}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {era.personalities && era.personalities.length > 0 && <InfoSection icon={<Users size={14} />} title="Key Figures" items={era.personalities} />}
            {era.monuments && era.monuments.length > 0 && <InfoSection icon={<MapPin size={14} />} title="Monuments & Sites" items={era.monuments} />}
            <InfoSection icon={<Calendar size={14} />} title="Time Period" items={[era.period]} />
            <InfoSection icon={<Landmark size={14} />} title="Category" items={[era.category, era.tag]} />
          </div>

          <div style={{ padding: "1rem 1.25rem", borderRadius: "0.875rem", background: "oklch(0.96 0.012 85 / 0.04)", border: "1px solid oklch(0.96 0.012 85 / 0.08)", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "oklch(0.79 0.11 82 / 0.7)", marginBottom: "0.5rem" }}>Historical Significance</p>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.05rem", fontStyle: "italic", color: "oklch(0.96 0.012 85 / 0.75)", lineHeight: 1.5 }}>{era.importance}</p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} onClick={onAskAI}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1.4rem", borderRadius: "0.875rem", background: "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.22), oklch(0.79 0.11 82 / 0.1))", border: "1px solid oklch(0.79 0.11 82 / 0.45)", color: "oklch(0.79 0.11 82)", fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.75rem", letterSpacing: "0.08em", cursor: "pointer", boxShadow: "0 0 20px oklch(0.79 0.11 82 / 0.15)", transition: "all 0.25s" }}>
              <Bot size={15} />
              Ask AI Historian about this
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.4rem", borderRadius: "0.875rem", background: "transparent", border: "1px solid oklch(0.96 0.012 85 / 0.1)", color: "oklch(0.96 0.012 85 / 0.5)", fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.75rem", letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.25s" }}>
              <ArrowLeft size={13} />
              Back to Timeline
            </motion.button>
          </div>
        </div>

        {/* Bottom gold line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, oklch(0.79 0.11 82 / 0.3), transparent)" }} />
      </motion.div>
    </motion.div>
  );
}

// ─── Info Section ─────────────────────────────────────────────────────────────
function InfoSection({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[]; }) {
  return (
    <div style={{ padding: "1rem", borderRadius: "0.875rem", background: "oklch(0.96 0.012 85 / 0.03)", border: "1px solid oklch(0.96 0.012 85 / 0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.6rem", color: "oklch(0.79 0.11 82 / 0.7)" }}>
        {icon}
        <span style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "oklch(0.79 0.11 82 / 0.7)" }}>{title}</span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ fontFamily: "'Jost', system-ui, sans-serif", fontSize: "0.75rem", color: "oklch(0.96 0.012 85 / 0.65)", padding: "0.2rem 0", borderBottom: i < items.length - 1 ? "1px solid oklch(0.96 0.012 85 / 0.05)" : "none" }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
