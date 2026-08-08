export interface NearbySite {
  id: string;
  name: string;
  distance: string;
  travelTime: string;
  category: string;
  description: string;
  image: string;
}

export interface SuggestedTrail {
  id: string;
  name: string;
  stops: number;
  duration: string;
  distance: string;
  route: string[];
  start: string;
  end: string;
}

export interface ExtendedMonumentData {
  monumentId: string;
  nearbySites: NearbySite[];
  suggestedTrails: SuggestedTrail[];
}

export const extendedData: Record<string, ExtendedMonumentData> = {
  "m-3": { // Qutub Minar
    monumentId: "m-3",
    nearbySites: [
      {
        id: "ns-1",
        name: "Alai Darwaza",
        distance: "0.1 km",
        travelTime: "2 min walk",
        category: "Gateway",
        description: "The main gateway from southern side of the Quwwat-ul-Islam Mosque.",
        image: "https://images.unsplash.com/photo-1585141012921-6d73beaa02db?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-2",
        name: "Iron Pillar of Delhi",
        distance: "0.2 km",
        travelTime: "3 min walk",
        category: "Monument",
        description: "A 7 meter column famous for its rust-resistant composition.",
        image: "https://images.unsplash.com/photo-1549474776-32d56a73c1d9?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-3",
        name: "Quwwat-ul-Islam Mosque",
        distance: "0.1 km",
        travelTime: "2 min walk",
        category: "Mosque",
        description: "One of the earliest mosques built in India.",
        image: "https://images.unsplash.com/photo-1621213032731-05d8fcdba5b0?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-4",
        name: "Mehrauli Archaeological Park",
        distance: "1.2 km",
        travelTime: "15 min walk",
        category: "Park",
        description: "An archaeological area spread over 200 acres in Mehrauli.",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-5",
        name: "Jamali Kamali Mosque",
        distance: "1.5 km",
        travelTime: "20 min walk",
        category: "Mosque",
        description: "A mosque and tomb belonging to Sufi saint Jamali.",
        image: "https://images.unsplash.com/photo-1598425237654-4cbf35160b73?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-6",
        name: "Rajon Ki Baoli",
        distance: "2.0 km",
        travelTime: "25 min walk",
        category: "Stepwell",
        description: "A famous stepwell in Mehrauli Archaeological Park.",
        image: "https://images.unsplash.com/photo-1620023447192-3a339d672baf?auto=format&fit=crop&q=80&w=800"
      }
    ],
    suggestedTrails: [
      {
        id: "t-1",
        name: "Delhi Heritage Trail",
        stops: 5,
        duration: "Half-Day (3-4 hrs)",
        distance: "3.5 km",
        route: [
          "Qutub Minar",
          "Iron Pillar",
          "Mehrauli Archaeological Park",
          "Jamali Kamali",
          "Rajon Ki Baoli"
        ],
        start: "Qutub Minar",
        end: "Rajon Ki Baoli"
      },
      {
        id: "t-2",
        name: "Sultanate Architecture Tour",
        stops: 3,
        duration: "2 hours",
        distance: "1.0 km",
        route: [
          "Qutub Minar",
          "Quwwat-ul-Islam Mosque",
          "Alai Darwaza"
        ],
        start: "Qutub Minar",
        end: "Alai Darwaza"
      }
    ]
  },
  "m-4": { // Hampi
    monumentId: "m-4",
    nearbySites: [
      {
        id: "ns-7",
        name: "Virupaksha Temple",
        distance: "0 km",
        travelTime: "0 min",
        category: "Temple",
        description: "The main center of pilgrimage at Hampi.",
        image: "https://images.unsplash.com/photo-1600021670845-8fbfce9356ce?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-8",
        name: "Vittala Temple",
        distance: "2.5 km",
        travelTime: "10 min drive",
        category: "Temple",
        description: "Known for its musical pillars and the stone chariot.",
        image: "https://images.unsplash.com/photo-1624614276707-1b03362a9baf?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-9",
        name: "Lotus Mahal",
        distance: "3.0 km",
        travelTime: "12 min drive",
        category: "Palace",
        description: "A two-storied pavilion with a lotus-like structure.",
        image: "https://images.unsplash.com/photo-1596773229656-787c8e76c11b?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-10",
        name: "Elephant Stables",
        distance: "3.2 km",
        travelTime: "15 min drive",
        category: "Monument",
        description: "An impressive structure used to house royal elephants.",
        image: "https://images.unsplash.com/photo-1621213032731-05d8fcdba5b0?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-11",
        name: "Hemakuta Hill",
        distance: "0.5 km",
        travelTime: "10 min walk",
        category: "Scenic Spot",
        description: "A rocky hill offering sunset views and dotted with ancient temples.",
        image: "https://images.unsplash.com/photo-1614088031359-5b0c95ce1d82?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-12",
        name: "Hazara Rama Temple",
        distance: "2.8 km",
        travelTime: "12 min drive",
        category: "Temple",
        description: "Famous for its intricate bas-relics depicting the Ramayana.",
        image: "https://images.unsplash.com/photo-1634024479549-808603673f44?auto=format&fit=crop&q=80&w=800"
      }
    ],
    suggestedTrails: [
      {
        id: "t-3",
        name: "Vijayanagara Grand Tour",
        stops: 6,
        duration: "One-Day (6-8 hrs)",
        distance: "8.5 km",
        route: [
          "Virupaksha Temple",
          "Hemakuta Hill",
          "Hazara Rama Temple",
          "Lotus Mahal",
          "Elephant Stables",
          "Vittala Temple"
        ],
        start: "Virupaksha Temple",
        end: "Vittala Temple"
      }
    ]
  },
  "m-1": { // Taj Mahal
    monumentId: "m-1",
    nearbySites: [
      {
        id: "ns-13",
        name: "Agra Fort",
        distance: "2.5 km",
        travelTime: "10 min drive",
        category: "Fort",
        description: "A historical fort and former residence of the Mughal emperors.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-14",
        name: "Itmad-ud-Daulah",
        distance: "5.0 km",
        travelTime: "20 min drive",
        category: "Mausoleum",
        description: "Often described as the 'Baby Taj'.",
        image: "https://images.unsplash.com/photo-1549474776-32d56a73c1d9?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-15",
        name: "Mehtab Bagh",
        distance: "7.0 km",
        travelTime: "25 min drive",
        category: "Garden",
        description: "A charbagh complex perfectly aligned with the Taj Mahal.",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-16",
        name: "Jama Masjid Agra",
        distance: "3.5 km",
        travelTime: "15 min drive",
        category: "Mosque",
        description: "A large 17th-century congregational mosque.",
        image: "https://images.unsplash.com/photo-1598425237654-4cbf35160b73?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-17",
        name: "Akbar's Tomb",
        distance: "14 km",
        travelTime: "40 min drive",
        category: "Mausoleum",
        description: "The tomb of the great Mughal emperor Akbar.",
        image: "https://images.unsplash.com/photo-1621213032731-05d8fcdba5b0?auto=format&fit=crop&q=80&w=800"
      }
    ],
    suggestedTrails: [
      {
        id: "t-4",
        name: "Mughal Empire Trail",
        stops: 4,
        duration: "One-Day (6-8 hrs)",
        distance: "12 km",
        route: [
          "Taj Mahal",
          "Agra Fort",
          "Itmad-ud-Daulah",
          "Mehtab Bagh"
        ],
        start: "Taj Mahal",
        end: "Mehtab Bagh"
      }
    ]
  }
};

// Fallback generator for monuments without explicit extended data
export function getExtendedData(monumentId: string): ExtendedMonumentData {
  if (extendedData[monumentId]) {
    return extendedData[monumentId];
  }
  
  // Generic fallback data
  return {
    monumentId,
    nearbySites: [
      {
        id: "ns-generic-1",
        name: "Local Heritage Museum",
        distance: "1.5 km",
        travelTime: "5 min drive",
        category: "Museum",
        description: "Exhibits artifacts from the surrounding ancient sites.",
        image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-generic-2",
        name: "Old City Gates",
        distance: "2.0 km",
        travelTime: "8 min drive",
        category: "Monument",
        description: "The historic entrance to the ancient city.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-generic-3",
        name: "Royal Gardens",
        distance: "3.5 km",
        travelTime: "12 min drive",
        category: "Garden",
        description: "Lush gardens designed during the peak of the empire.",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "ns-generic-4",
        name: "Ancient Stepwell",
        distance: "5.0 km",
        travelTime: "15 min drive",
        category: "Stepwell",
        description: "A beautifully preserved subterranean water structure.",
        image: "https://images.unsplash.com/photo-1620023447192-3a339d672baf?auto=format&fit=crop&q=80&w=800"
      }
    ],
    suggestedTrails: [
      {
        id: "t-generic-1",
        name: "Local Discoveries Walk",
        stops: 3,
        duration: "Half-Day (3-4 hrs)",
        distance: "4.5 km",
        route: [
          "Current Monument",
          "Local Heritage Museum",
          "Old City Gates"
        ],
        start: "Current Monument",
        end: "Old City Gates"
      }
    ]
  };
}
