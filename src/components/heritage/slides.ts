import brihadeeswara from "@/assets/slide-brihadeeswara.jpg";
import tajmahal from "@/assets/slide-tajmahal.png";
import hampi from "@/assets/slide-hampi.jpg";
import ajanta from "@/assets/slide-ajanta.jpg";
import konark from "@/assets/slide-konark.jpg";

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
    id: "ajanta",
    image: ajanta,
    index: "IV",
    title: ["Ajanta", "Caves"],
    theme: "Rock-Cut Devotion",
    subtitle: "Thirty sanctuaries carved from living rock — a civilisation's prayer in stone and pigment.",
    align: "left",
    cards: [
      {
        label: "2nd century BCE",
        title: "Hidden for a millennium",
        body: "Rediscovered in 1819, these caves slept beneath jungle canopy for over a thousand years.",
        className: "right-[7vw] top-[20vh]",
        float: "a",
        delay: 900,
      },
      {
        label: "Buddhist murals",
        title: "Jataka tales in colour",
        body: "The oldest surviving paintings of India — worlds of narrative in mineral pigment and devotion.",
        className: "right-[7vw] bottom-[14vh]",
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
