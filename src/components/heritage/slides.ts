import brihadeeswara from "@/assets/brihadeeswara.jpg";
import tajmahal from "@/assets/tajmahal.jpg";
import hampi from "@/assets/hampi.jpg";
import qutubminar from "@/assets/qutubminar.jpg";
import konark from "@/assets/konark.jpg";

export type Slide = {
  id: string;
  image: string;
  index: string;
  title: string[];
  theme: string;
  subtitle: string;
  cards: {
    label: string;
    title: string;
    body: string;
    className: string;
    float: "a" | "b";
    delay: number;
  }[];
  align: "left" | "center" | "right";
};

export const slides: Slide[] = [
  {
    id: "brihadeeswara",
    image: brihadeeswara,
    index: "I",
    title: ["Brihadeeswara", "Temple"],
    theme: "Power & Legacy",
    subtitle: "A thousand years of granite ambition, still standing against the dark.",
    align: "left",
    cards: [
      {
        label: "Built 1010 CE",
        title: "Raja Raja Chola I",
        body: "Commissioned as an offering and a statement — an empire carved into stone that would outlive its emperor.",
        className: "right-[7vw] bottom-[13vh]",
        float: "a",
        delay: 900,
      },
      {
        label: "Engineering",
        title: "216 feet of vimana",
        body: "An 80-tonne capstone crowns the tower, raised without mortar or modern machinery.",
        className: "right-[7vw] top-[18vh]",
        float: "b",
        delay: 1250,
      },
    ],
  },
  {
    id: "taj-mahal",
    image: tajmahal,
    index: "II",
    title: ["Taj Mahal"],
    theme: "Love & Architecture",
    subtitle: "Grief made permanent — a promise translated into marble and light.",
    align: "center",
    cards: [
      {
        label: "1632 — 1653",
        title: "Shah Jahan's elegy",
        body: "Twenty thousand artisans, twenty-two years, and one unfinished sentence of mourning.",
        className: "left-[6vw] top-[30vh]",
        float: "a",
        delay: 900,
      },
      {
        label: "Material",
        title: "Marble that breathes",
        body: "Makrana stone shifts from rose at dawn to pearl at noon to silver beneath the moon.",
        className: "right-[6vw] bottom-[18vh]",
        float: "b",
        delay: 1250,
      },
    ],
  },
  {
    id: "hampi",
    image: hampi,
    index: "III",
    title: ["Hampi"],
    theme: "Ruins of Grandeur",
    subtitle: "A capital of half a million souls, now a conversation between stone and wind.",
    align: "left",
    cards: [
      {
        label: "Vijayanagara",
        title: "The stone chariot",
        body: "Its wheels once turned. Today they hold the memory of a city that traded in diamonds.",
        className: "right-[7vw] top-[24vh]",
        float: "b",
        delay: 950,
      },
    ],
  },
  {
    id: "qutub-minar",
    image: qutubminar,
    index: "IV",
    title: ["Qutub", "Minar"],
    theme: "Victory & History",
    subtitle: "Five storeys of sandstone, each raised by a different century.",
    align: "left",
    cards: [
      {
        label: "1199 CE",
        title: "A tower of triumph",
        body: "Begun by Qutb ud-Din Aibak, completed across generations — history written vertically.",
        className: "right-[7vw] bottom-[13vh]",
        float: "a",
        delay: 900,
      },
      {
        label: "Inscription",
        title: "Bands of Kufic script",
        body: "Verses spiral the shaft, weathering slower than the empires that carved them.",
        className: "right-[7vw] top-[18vh]",
        float: "b",
        delay: 1250,
      },
    ],
  },
  {
    id: "konark",
    image: konark,
    index: "V",
    title: ["Konark", "Sun Temple"],
    theme: "Symbolism in Stone",
    subtitle: "A chariot for the sun, with wheels that keep time itself.",
    align: "right",
    cards: [
      {
        label: "24 wheels",
        title: "A working sundial",
        body: "Each spoke casts a shadow precise enough to read the hour of the day.",
        className: "left-[6vw] top-[18vh]",
        float: "a",
        delay: 900,
      },
      {
        label: "13th century",
        title: "Seven stone horses",
        body: "They pull Surya's chariot eastward, forever mid-stride across the Odisha coast.",
        className: "left-[6vw] bottom-[13vh]",
        float: "b",
        delay: 1250,
      },
    ],
  },
];
