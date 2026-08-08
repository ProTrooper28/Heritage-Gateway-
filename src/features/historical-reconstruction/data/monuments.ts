// ─── Historical Reconstruction — monument dataset ────────────────────────────
// Demo data. Reconstruction visuals are ILLUSTRATIVE unless the source
// record says otherwise — the UI never presents them as confirmed fact.
//
// To attach a real 3D model: drop the .glb into /public/models and set
// `model: { url: "/models/<file>.glb", available: true }`. The viewer then
// loads it automatically and the procedural placeholder is skipped.

import type { Monument } from "../types";

import tajmahal from "@/assets/tajmahal.jpg";
import hampi from "@/assets/hampi.jpg";
import qutubminar from "@/assets/qutubminar.jpg";

const RED_FORT_IMAGE =
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1200";

export const MONUMENTS: Monument[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // RED FORT — flagship demo monument
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "red-fort",
    name: "Red Fort",
    location: "Delhi, India",
    description: "Explore how this monument evolved through history.",
    model: { url: "/models/red-fort.glb", available: false },
    presentImage: RED_FORT_IMAGE,
    periods: [
      {
        year: 1639,
        label: "Mughal Era",
        era: "Shah Jahan's new capital",
        summary:
          "Construction of Shahjahanabad's citadel begins in 1639 and is completed in 1648. The fort is the ceremonial heart of the Mughal court, crowned with marble pavilions, gardens and the legendary Peacock Throne.",
        changes: [
          "1639–1648 — construction under Shah Jahan, on the Yamuna riverfront",
          "Marble Diwan-i-Khas and Diwan-i-Aam completed",
          "Rang Mahal, Mumtaz Mahal and imperial gardens laid out",
        ],
        model: { url: "/models/red-fort-1639.glb", available: false },
        reconstruction: {
          image: RED_FORT_IMAGE,
          alt: "Illustrative reconstruction of the Red Fort in the Mughal era",
          illustrative: true,
          confidence: "High",
          confidenceScore: 82,
          confidenceNote:
            "Based on contemporary court chronicles (Shah Jahan Nama), 17th-century European travelogues and Company-school paintings.",
        },
      },
      {
        year: 1707,
        label: "Late Mughal",
        era: "After Aurangzeb",
        summary:
          "With Aurangzeb's death the empire enters a slow decline, but the fort remains the seat of the Mughal court — its halls still used for coronations and court ceremonies.",
        changes: [
          "Moti Masjid (1659, Aurangzeb) stands as the court's private mosque",
          "Succession struggles keep court life in the fort's halls",
          "Later Mughals continue occupying the imperial apartments",
        ],
        model: { url: "/models/red-fort-1707.glb", available: false },
        reconstruction: {
          image: RED_FORT_IMAGE,
          alt: "Illustrative reconstruction of the Red Fort around 1707",
          illustrative: true,
          confidence: "Medium",
          confidenceScore: 66,
          confidenceNote:
            "Combines documented structures with period travelogue descriptions; some courtyard details are inferred.",
        },
      },
      {
        year: 1857,
        label: "British Era",
        era: "Occupation & destruction",
        summary:
          "After the 1857 Revolt the British occupy the fort as a military garrison. Great portions — gardens, pavilions and the bazaar — are demolished or repurposed within decades.",
        changes: [
          "British army uses the fort as a cantonment",
          "Hayat Bakhsh garden structures demolished",
          "Marble pavilions stripped; Chhatta Chowk survives as a bazaar",
        ],
        model: { url: "/models/red-fort-1857.glb", available: false },
        reconstruction: {
          image: RED_FORT_IMAGE,
          alt: "Illustrative reconstruction of the Red Fort in the British era",
          illustrative: true,
          confidence: "Medium",
          confidenceScore: 63,
          confidenceNote:
            "Early photographs and military plans document the demolition; specific interior layouts are partially inferred.",
        },
      },
      {
        year: 1947,
        label: "Independence",
        era: "A symbol of the nation",
        summary:
          "On 15 August 1947 Jawaharlal Nehru raises the Indian flag over the Lahori Gate. The fort becomes the stage for the new nation's independence ceremonies.",
        changes: [
          "Flag hoisting at the Lahori Gate — 15 August 1947",
          "ASI assumes full management and begins systematic conservation",
          "Former barracks cleared from the imperial apartments",
        ],
        model: { url: "/models/red-fort-1947.glb", available: false },
        reconstruction: {
          image: RED_FORT_IMAGE,
          alt: "Illustrative reconstruction of the Red Fort at independence",
          illustrative: true,
          confidence: "High",
          confidenceScore: 78,
          confidenceNote:
            "Archival photographs from 1947 document the ceremony and the fort's condition.",
        },
      },
      {
        year: 2026,
        label: "Present Day",
        era: "UNESCO World Heritage",
        summary:
          "A UNESCO World Heritage Site since 2007, the fort is under ongoing Archaeological Survey of India conservation, hosting light-and-sound shows and millions of visitors each year.",
        changes: [
          "2007 — inscribed as a UNESCO World Heritage Site",
          "Ongoing ASI restoration of pavilions and gardens",
          "Open-air museum, museum buildings and evening sound-and-light shows",
        ],
        model: { url: "/models/red-fort-2026.glb", available: false },
        reconstruction: {
          image: RED_FORT_IMAGE,
          alt: "The Red Fort as it stands today",
          illustrative: true,
          confidence: "High",
          confidenceScore: 96,
          confidenceNote:
            "Current condition documented by photography and ASI survey.",
        },
      },
    ],
    annotations: [
      {
        id: 1,
        index: "01",
        title: "Lahori Gate",
        subtitle: "Main Gateway",
        position: [0, 1.4, 9],
        period: 1639,
        description:
          "The principal public entrance, named for its orientation toward Lahore. The gate leads through a vaulted passage into the covered bazaar of Chhatta Chowk.",
        historicalSignificance:
          "The gate where Jawaharlal Nehru raised the national flag in 1947, making it the enduring symbol of Indian independence.",
        architecturalDetails:
          "Tall arched gateway in red sandstone, flanked by octagonal towers, originally capped with chhatris and a marble finial.",
        periodLabel: "1639 – present",
        confidence: "High",
        evidence: ["Mughal court chronicles", "1847 Asar-us-Sanadid description", "1947 archival photographs"],
      },
      {
        id: 2,
        index: "02",
        title: "Chhatta Chowk",
        subtitle: "Covered Bazaar",
        position: [0, 1, 6.2],
        period: 1639,
        description:
          "A vaulted arcade running from the Lahori Gate to the Naubat Khana, where silk, jewellery and royal wares were sold to the court.",
        historicalSignificance:
          "One of the oldest continuously operating markets in Delhi — its arcade survived the 1857 demolitions.",
        architecturalDetails:
          "Sixty covered bays with pointed arches, lit by an ingenious series of skylights along the vault.",
        periodLabel: "1639 – present",
        confidence: "High",
        evidence: ["Company-school paintings (c. 1814)", "ASI conservation records"],
      },
      {
        id: 3,
        index: "03",
        title: "Naubat Khana",
        subtitle: "Drum House",
        position: [0, 1.8, 3.2],
        period: 1639,
        description:
          "The ceremonial gatehouse where the royal orchestra played at fixed hours, announcing the emperor's presence to the city.",
        historicalSignificance:
          "The point where all visitors — from princes to ambassadors — had to dismount before entering the inner court.",
        architecturalDetails:
          "Three-storey red-sandstone structure crowned with chhatris, pierced by an archway with a gallery for the musicians.",
        periodLabel: "1639 – present",
        confidence: "High",
        evidence: ["Shah Jahan Nama", "Bernier's Travels (1670)"],
      },
      {
        id: 4,
        index: "04",
        title: "Diwan-i-Aam",
        subtitle: "Hall of Public Audience",
        position: [-4.6, 1.3, -0.6],
        period: 1639,
        description:
          "The vast hypostyle hall where the emperor received the public, heard petitions and dispensed justice from a marble throne recess.",
        historicalSignificance:
          "The architectural embodiment of the Mughal 'just ruler' ideal — the emperor visible to all his subjects.",
        architecturalDetails:
          "Sixty sandstone columns carry a flat roof; the rear wall holds the marble jharokha throne niche with pietra dura inlay.",
        periodLabel: "1639 – 1857",
        confidence: "High",
        evidence: ["Mughal miniatures", "British Library plans (1850s)"],
      },
      {
        id: 5,
        index: "05",
        title: "Rang Mahal",
        subtitle: "Palace of Colours",
        position: [-3.4, 1.4, -4.2],
        period: 1639,
        description:
          "The emperor's private residence, its walls once alive with painted flowers and mirrored glass — the 'Palace of Colours'.",
        historicalSignificance:
          "The most personal of the imperial apartments, later stripped of its decoration under British occupation.",
        architecturalDetails:
          "Marble pavilion with scalloped arches, a central lotus fountain, and remnants of gilded and painted ceilings.",
        periodLabel: "1639 – 1857",
        confidence: "Medium",
        evidence: ["19th-century aquatints", "ASI restoration surveys"],
      },
      {
        id: 6,
        index: "06",
        title: "Diwan-i-Khas",
        subtitle: "Hall of Private Audience",
        position: [4.6, 1.9, -0.6],
        period: 1639,
        description:
          "The jewel of the fort — the emperor's private audience chamber, once home to the Peacock Throne.",
        historicalSignificance:
          "The inscription 'If there be a paradise on earth, it is this' crowns its arches; the throne was carried to Persia in 1739.",
        architecturalDetails:
          "Pure marble pavilion with engraved arches and pietra dura; the ceiling was originally silver-gilt.",
        periodLabel: "1639 – 1739",
        confidence: "High",
        evidence: ["Inscription on the arches", "Nadir Shah's court records"],
      },
      {
        id: 7,
        index: "07",
        title: "Moti Masjid",
        subtitle: "Pearl Mosque",
        position: [4.2, 1.6, -4.2],
        period: 1659,
        description:
          "A small private mosque of polished white marble, built by Aurangzeb for his personal use in 1659.",
        historicalSignificance:
          "One of the few imperial structures added after Shah Jahan's reign — a marker of Aurangzeb's more austere court.",
        architecturalDetails:
          "Three bulbous domes and a marble courtyard, its milky sheen giving the 'Pearl Mosque' its name.",
        periodLabel: "1659 – present",
        confidence: "High",
        evidence: ["Inscription with construction date", "ASI surveys"],
      },
      {
        id: 8,
        index: "08",
        title: "Hayat Bakhsh Bagh",
        subtitle: "Life-Bestowing Garden",
        position: [0, 0.7, -8.4],
        period: 1639,
        description:
          "The great pleasure garden of the fort, with marble pavilions, pools and the stone water channel fed by the Yamuna.",
        historicalSignificance:
          "Destroyed by the British after 1857; its central pavilions were reconstructed by the ASI in the 20th century.",
        architecturalDetails:
          "Charbagh layout with raised marble walkways, a central pavilion and two side pavilions around a fountain pool.",
        periodLabel: "1639 – 1857 (restored)",
        confidence: "Medium",
        evidence: ["Pre-1857 paintings", "ASI reconstruction plans"],
      },
    ],
    sources: [
      {
        id: "rf-1",
        name: "Shah Jahan Nama (court chronicle)",
        date: "c. 1650",
        type: "Archive",
        attribution: "Mughal court chroniclers, ed. W.E. Begley & Z.A. Desai",
        url: "https://en.wikipedia.org/wiki/Padshahnama",
      },
      {
        id: "rf-2",
        name: "Travels in the Mughal Empire — François Bernier",
        date: "1670",
        type: "Travelogue",
        attribution: "François Bernier, French physician at the Mughal court",
      },
      {
        id: "rf-3",
        name: "Asar-us-Sanadid — Sayyid Ahmad Khan",
        date: "1847",
        type: "Architectural Record",
        attribution: "Sayyid Ahmad Khan, Delhi",
        url: "https://en.wikipedia.org/wiki/Asar-us-Sanadid",
      },
      {
        id: "rf-4",
        name: "Delhi & Agra Company paintings",
        date: "c. 1814–15",
        type: "Painting",
        attribution: "British Library — Oriental and India Office Collections",
        url: "https://www.bl.uk/collection-items/company-school-paintings",
      },
      {
        id: "rf-5",
        name: "Early photographs of the fort",
        date: "1860s–1890s",
        type: "Photograph",
        attribution: "Archaeological Survey of India photo archives",
      },
      {
        id: "rf-6",
        name: "UNESCO World Heritage nomination file",
        date: "2007",
        type: "Archaeological Record",
        attribution: "Archaeological Survey of India / UNESCO",
        url: "https://whc.unesco.org/en/list/231",
      },
      {
        id: "rf-7",
        name: "ASI conservation & excavation reports",
        date: "1903 – present",
        type: "Archaeology",
        attribution: "Archaeological Survey of India",
      },
    ],
    info: {
      overview: [
        "The Red Fort (Lal Qila) is the great citadel of Shahjahanabad, the walled city built by Shah Jahan as his new capital. Its 2.4 km of red sandstone ramparts enclose the imperial apartments, audience halls, mosques and gardens of the Mughal court.",
        "Beyond its architecture, the fort is the stage of modern Indian history — the site of the 1857 Revolt's aftermath and the flag-hoisting of 1947.",
      ],
      history: [
        "1639 — Construction begins under Shah Jahan; the fort is completed in 1648 at enormous cost, with the Yamuna flowing along its eastern wall.",
        "1739 — Nadir Shah carries away the Peacock Throne and much of the treasury.",
        "1857 — After the Revolt, the British garrison the fort and demolish large portions.",
        "1903 — The Archaeological Survey of India begins formal conservation.",
        "1947 — Independence flag raised at the Lahori Gate.",
        "2007 — Inscribed on the UNESCO World Heritage List.",
      ],
      architecture: [
        "The fort blends Persian garden planning with indigenous Rajput and Bengali architectural traditions — a synthesis the Mughals perfected.",
        "Public and private hierarchies structure the plan: from the public Lahori Gate and Diwan-i-Aam, through the Naubat Khana, to the private marble pavilions of Diwan-i-Khas and Rang Mahal.",
        "Materials are deliberate: warm red sandstone for the public city-facing walls, cool white marble for the private imperial apartments.",
      ],
      majorChanges: [
        "1659 — Moti Masjid added by Aurangzeb.",
        "1739 — Nadir Shah's sack; Peacock Throne removed.",
        "1857–1900s — British demolition of gardens and pavilions; barracks built.",
        "1903 — ASI takes over conservation.",
        "1947 — National flag raised; fort becomes a symbol of independence.",
        "2007 — UNESCO World Heritage inscription.",
      ],
      culturalSignificance: [
        "The Red Fort is where the Prime Minister addresses the nation every Independence Day — a living symbol of Indian sovereignty.",
        "It represents the pinnacle of Mughal court culture: art, poetry, ceremony and craftsmanship gathered in one place.",
      ],
      preservation: [
        "Conservation is managed by the Archaeological Survey of India under the Ancient Monuments and Archaeological Sites and Remains Act.",
        "The fort's museums house galleries on the 1857 Revolt and the Indian freedom struggle.",
        "Light-and-sound shows interpret the fort's history to hundreds of thousands of visitors annually.",
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TAJ MAHAL — second monument (demonstrates reusability)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    location: "Agra, India",
    description: "A mausoleum of marble — explore its construction and symbolism.",
    model: { url: "/models/taj-mahal.glb", available: false },
    presentImage: tajmahal,
    periods: [
      {
        year: 1632,
        label: "Foundation",
        era: "The grieving emperor",
        summary:
          "Following Mumtaz Mahal's death in 1631, Shah Jahan begins the mausoleum in 1632 on the Yamuna riverbank — a project that will occupy some 20,000 workers for two decades.",
        changes: ["1632 — site preparation and foundation", "Plaza and platform laid out", "Karkhanas (workshops) established for marble and inlay"],
        model: { url: "/models/taj-mahal-1632.glb", available: false },
        reconstruction: {
          image: tajmahal,
          alt: "Illustrative reconstruction of the Taj Mahal during construction",
          illustrative: true,
          confidence: "Medium",
          confidenceScore: 61,
          confidenceNote:
            "Construction phases are documented by court accounts; the exact scaffolding arrangements are inferred.",
        },
      },
      {
        year: 1653,
        label: "Completion",
        era: "The completed masterpiece",
        summary:
          "The mausoleum is completed in 1653 — a symmetrical charbagh garden, marble dome and four minarets rising above the river. The complex is finished with a mosque, guesthouse and the great gateway.",
        changes: ["Dome, minarets and marble cladding completed", "Charbagh garden and reflecting pool laid out", "Mosque (west) and Mihman Khana (east) completed"],
        model: { url: "/models/taj-mahal-1653.glb", available: false },
        reconstruction: {
          image: tajmahal,
          alt: "Illustrative reconstruction of the completed Taj Mahal in 1653",
          illustrative: true,
          confidence: "High",
          confidenceScore: 84,
          confidenceNote:
            "Supported by the Shah Jahan Nama, epigraphs on the gateway, and early European descriptions.",
        },
      },
      {
        year: 2026,
        label: "Present Day",
        era: "UNESCO World Heritage",
        summary:
          "A UNESCO World Heritage Site since 1983, the Taj Mahal remains India's most visited monument, its marble undergoing periodic conservation to counter air pollution.",
        changes: ["1983 — UNESCO World Heritage inscription", "Ongoing mud-pack and conservation treatments", "Mehtab Bagh across the river restored as a viewing garden"],
        model: { url: "/models/taj-mahal-2026.glb", available: false },
        reconstruction: {
          image: tajmahal,
          alt: "The Taj Mahal as it stands today",
          illustrative: true,
          confidence: "High",
          confidenceScore: 96,
          confidenceNote: "Current condition documented by photography and ASI survey.",
        },
      },
    ],
    annotations: [
      {
        id: 1,
        index: "01",
        title: "Great Gateway",
        subtitle: "Darwaza-i-Rauza",
        position: [0, 2.2, 10.5],
        period: 1653,
        description:
          "The monumental red sandstone gate that frames the first view of the tomb — a device of 'reveal' central to Mughal garden design.",
        historicalSignificance:
          "Its marble inlay bears the full text of the Qur'anic verses that frame the entire complex.",
        architecturalDetails:
          "Three-storey pishtaq gateway crowned with chhatris, clad in red sandstone with white marble inlay.",
        periodLabel: "1653 – present",
        confidence: "High",
        evidence: ["Gateway epigraph", "Bernier's Travels (1670)"],
      },
      {
        id: 2,
        index: "02",
        title: "The Dome",
        subtitle: "Central onion dome",
        position: [0, 7, 0],
        period: 1653,
        description:
          "The great marble onion dome — 35 metres high, doubled internally for proportion — is the tomb's crowning form.",
        historicalSignificance:
          "The dome's perfect proportions are the visual anchor of the entire charbagh composition.",
        architecturalDetails:
          "Double-shell dome on a tall drum, crowned by a gilded finial that blends Hindu and Islamic motifs.",
        periodLabel: "1653 – present",
        confidence: "High",
        evidence: ["Court accounts of materials", "Survey of India measurements"],
      },
      {
        id: 3,
        index: "03",
        title: "Minarets",
        subtitle: "Four corner towers",
        position: [-6.2, 3.6, -6.2],
        period: 1653,
        description:
          "Four slender 40-metre minarets frame the mausoleum — each built with a slight outward tilt so they would fall away from the tomb.",
        historicalSignificance:
          "The minarets transform the tomb into a three-dimensional composition readable from any angle.",
        architecturalDetails:
          "Three balconies, red sandstone base, marble upper storeys, capped with chhatris.",
        periodLabel: "1653 – present",
        confidence: "High",
        evidence: ["Structural surveys", "Early photography"],
      },
      {
        id: 4,
        index: "04",
        title: "Charbagh Garden",
        subtitle: "The four-part garden",
        position: [0, 0.6, 5.5],
        period: 1653,
        description:
          "The tomb stands at the end of a charbagh — a quartered paradise garden divided by water channels symbolising the four rivers of heaven.",
        historicalSignificance:
          "The garden reverses the standard Mughal placement: the tomb crowns the garden rather than standing at its centre.",
        architecturalDetails:
          "Marble-lined water channels, raised pathways and cypress plantings in a strict quartered geometry.",
        periodLabel: "1653 – present",
        confidence: "High",
        evidence: ["Mughal garden treatises", "UNESCO site documentation"],
      },
      {
        id: 5,
        index: "05",
        title: "Platform & Cenotaphs",
        subtitle: "The tomb platform",
        position: [0, 1.4, 2.2],
        period: 1653,
        description:
          "The white marble platform carries the tomb, mosque and guesthouse; inside, the cenotaphs of Mumtaz Mahal and Shah Jahan are ringed by inlaid marble screens.",
        historicalSignificance:
          "The emperor's cenotaph, added beside his wife's after his death, breaks the strict symmetry — a humanising detail.",
        architecturalDetails:
          "Pietra dura inlay of semi-precious stones; the jali screens were carved from single marble slabs.",
        periodLabel: "1653 – present",
        confidence: "High",
        evidence: ["Inscriptions on the cenotaphs", "ASI reports"],
      },
    ],
    sources: [
      {
        id: "tj-1",
        name: "Shah Jahan Nama (court chronicle)",
        date: "c. 1650",
        type: "Archive",
        attribution: "Mughal court chroniclers",
        url: "https://en.wikipedia.org/wiki/Padshahnama",
      },
      {
        id: "tj-2",
        name: "Travels in the Mughal Empire — François Bernier",
        date: "1670",
        type: "Travelogue",
        attribution: "François Bernier",
      },
      {
        id: "tj-3",
        name: "Agra & Fatehpur Sikri surveys",
        date: "1880s",
        type: "Photograph",
        attribution: "Archaeological Survey of India",
      },
      {
        id: "tj-4",
        name: "UNESCO World Heritage nomination file",
        date: "1983",
        type: "Archaeological Record",
        attribution: "UNESCO / ASI",
        url: "https://whc.unesco.org/en/list/252",
      },
      {
        id: "tj-5",
        name: "Conservation & pollution studies",
        date: "1990 – present",
        type: "Archaeology",
        attribution: "ASI Taj Trapezium studies",
      },
    ],
    info: {
      overview: [
        "The Taj Mahal is the marble mausoleum Shah Jahan built for his wife Mumtaz Mahal between 1632 and 1653. It is the summit of Mughal architecture — a study in symmetry, light and material.",
      ],
      history: [
        "1631 — Mumtaz Mahal dies in Burhanpur; the mausoleum is commissioned.",
        "1632–1653 — Construction with ~20,000 artisans.",
        "1653 — Complex completed; later additions include the mosque and guesthouse.",
        "1983 — Inscribed on the UNESCO World Heritage List.",
      ],
      architecture: [
        "The plan is a strict bilateral symmetry centred on the tomb and its reflecting pool.",
        "Pietra dura inlay — thousands of semi-precious stones in white marble — is the signature technique.",
        "Optical devices, including the outward-tilting minarets, make the tomb appear taller and more stable.",
      ],
      majorChanges: [
        "1653 — Completion under Shah Jahan.",
        "19th c. — British-era repairs; gardens simplified.",
        "1990s — Mud-pack treatments against pollution discolouration.",
        "2020s — Ongoing conservation under ASI supervision.",
      ],
      culturalSignificance: [
        "The Taj Mahal is India's most recognisable symbol — a monument to love, read as architecture, poetry and power in one.",
      ],
      preservation: [
        "Managed by the ASI; protected under national monument law and the Taj Trapezium Zone environmental rules.",
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // HAMPI — third monument (ruins / lost-city experience)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "hampi",
    name: "Hampi",
    location: "Karnataka, India",
    description: "The ruined capital of the Vijayanagara Empire.",
    model: { url: "/models/hampi.glb", available: false },
    presentImage: hampi,
    periods: [
      {
        year: 1336,
        label: "Rise",
        era: "Capital of Vijayanagara",
        summary:
          "Hampi becomes the capital of the Vijayanagara Empire in 1336 — a sacred landscape of boulder hills and river ghats transformed into a city of temples, markets and royal enclosures.",
        changes: ["City founded alongside the Tungabhadra", "Sacred complex of Virupaksha grows", "Bazaar streets and temples rise"],
        model: { url: "/models/hampi-1336.glb", available: false },
        reconstruction: {
          image: hampi,
          alt: "Illustrative reconstruction of Hampi at the empire's rise",
          illustrative: true,
          confidence: "Medium",
          confidenceScore: 64,
          confidenceNote:
            "Later travellers' accounts and surviving foundations; the earlier city's form is partially reconstructed.",
        },
      },
      {
        year: 1565,
        label: "Fall",
        era: "The battle of Talikota",
        summary:
          "After the empire's defeat at Talikota in 1565, the city is sacked and abandoned within decades — leaving the extraordinary field of ruins we see today.",
        changes: ["City sacked after the battle of Talikota", "Temple rituals at Virupaksha continue", "The royal capital is abandoned"],
        model: { url: "/models/hampi-1565.glb", available: false },
        reconstruction: {
          image: hampi,
          alt: "Illustrative reconstruction of Hampi at the time of its fall",
          illustrative: true,
          confidence: "Medium",
          confidenceScore: 62,
          confidenceNote:
            "Early travel accounts and archaeology document the sack; specific damage patterns are inferred.",
        },
      },
      {
        year: 2026,
        label: "Present Day",
        era: "UNESCO World Heritage",
        summary:
          "The 'Group of Monuments at Hampi' has been a UNESCO World Heritage Site since 1986 — a vast open-air museum of the Vijayanagara empire.",
        changes: ["1986 — UNESCO World Heritage inscription", "Virupaksha remains a living temple", "Extensive ASI conservation of the royal enclosure"],
        model: { url: "/models/hampi-2026.glb", available: false },
        reconstruction: {
          image: hampi,
          alt: "The ruins of Hampi as they stand today",
          illustrative: true,
          confidence: "High",
          confidenceScore: 95,
          confidenceNote: "Current condition documented by photography and ASI survey.",
        },
      },
    ],
    annotations: [
      {
        id: 1,
        index: "01",
        title: "Virupaksha Gopuram",
        subtitle: "The living temple",
        position: [0, 3.4, 0],
        period: 1336,
        description:
          "The 50-metre eastern gateway of the Virupaksha temple — the only temple in Hampi still in active worship.",
        historicalSignificance:
          "Continuous worship since the 7th century makes it the thread linking Hampi's past and present.",
        architecturalDetails:
          "Nine-storey pyramidal gopuram of brick and timber over a stone core, densely carved with stucco figures.",
        periodLabel: "1336 – present",
        confidence: "High",
        evidence: ["Temple inscriptions", "ASI surveys"],
      },
      {
        id: 2,
        index: "02",
        title: "Stone Chariot",
        subtitle: "Vitthala temple icon",
        position: [4.4, 1.2, -3.2],
        period: 1565,
        description:
          "The monolithic stone chariot at the Vitthala temple — Hampi's most photographed monument, its wheels designed to turn.",
        historicalSignificance:
          "A symbol of Vijayanagara's mastery of stone; the temple it serves was left unfinished by the empire's fall.",
        architecturalDetails:
          "Carved from granite in the round, with a conical roof and wheeled base; part of the chariot was damaged in later centuries.",
        periodLabel: "16th century",
        confidence: "High",
        evidence: ["Temple sculptures", "Archaeological documentation"],
      },
      {
        id: 3,
        index: "03",
        title: "Royal Enclosure",
        subtitle: "The empire's court",
        position: [-4.6, 1.1, 3.4],
        period: 1565,
        description:
          "The fortified core of the capital — audience halls, the Mahanavami platform and the Lotus Mahal pavilion.",
        historicalSignificance:
          "The seat from which Vijayanagara ruled much of southern India for two centuries.",
        architecturalDetails:
          "Indo-Islamic arches of the Lotus Mahal contrast with the massive stone platforms of the Mahanavami Dibba.",
        periodLabel: "14th – 16th century",
        confidence: "High",
        evidence: ["16th-century traveller accounts", "ASI excavations"],
      },
    ],
    sources: [
      {
        id: "hp-1",
        name: "Travels — Domingo Paes & Fernão Nunes",
        date: "1520–37",
        type: "Travelogue",
        attribution: "Portuguese chroniclers at the Vijayanagara court",
      },
      {
        id: "hp-2",
        name: "A Forgotten Empire — Robert Sewell",
        date: "1900",
        type: "Historical Record",
        attribution: "Robert Sewell",
      },
      {
        id: "hp-3",
        name: "Hampi excavations & epigraphs",
        date: "1980 – present",
        type: "Archaeology",
        attribution: "ASI / Karnataka heritage boards",
      },
      {
        id: "hp-4",
        name: "UNESCO World Heritage nomination file",
        date: "1986",
        type: "Archaeological Record",
        attribution: "UNESCO / ASI",
        url: "https://whc.unesco.org/en/list/241",
      },
    ],
    info: {
      overview: [
        "Hampi is the ruined capital of the Vijayanagara Empire — a sacred landscape of granite boulders, ghats and temples along the Tungabhadra river. For two centuries it was among the largest cities of the medieval world.",
      ],
      history: [
        "1336 — Capital established; the city grows into a metropolis.",
        "1565 — Defeat at Talikota leads to the city's sack and abandonment.",
        "1800s — Rediscovered and documented by British antiquarians.",
        "1986 — Inscribed on the UNESCO World Heritage List.",
      ],
      architecture: [
        "Hampi blends temple architecture with a monumental secular court — bazaar streets, royal platforms and water structures.",
        "Granite is worked with astonishing precision; the stone chariot is a tour de force of carving.",
      ],
      majorChanges: [
        "14th c. — city foundation and temple building.",
        "1565 — sack and abandonment.",
        "19th c. — antiquarian documentation begins.",
        "1986 — UNESCO inscription; ASI conservation.",
      ],
      culturalSignificance: [
        "Hampi remains a living pilgrimage site around Virupaksha, and a UNESCO-protected landscape of world importance.",
      ],
      preservation: [
        "The Group of Monuments at Hampi is protected by the ASI and Karnataka state heritage bodies.",
      ],
    },
  },
];

/** All monument images (for the switcher thumbnails). */
export const MONUMENT_THUMBNAILS: Record<string, string> = {
  "red-fort": RED_FORT_IMAGE,
  "taj-mahal": tajmahal,
  hampi,
};

export { qutubminar };
