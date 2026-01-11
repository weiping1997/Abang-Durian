
export interface DurianVariety {
  name: string;
  pricePerKg: number;
  availability: boolean;
  lastUpdated: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface StallRatings {
  overall: number;
  totalReviews: number;
  categories: {
    quality: number;
    price: number;
    service: number;
  };
}

export interface Stall {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  phone: string;
  whatsapp: string;
  operatingHours: string;
  varieties: DurianVariety[];
  ratings: StallRatings;
  photos: string[];
  distance?: number;
  isLiveSource?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingUrls?: { title: string; uri: string }[];
}

export enum DurianType {
  MUSANG_KING = "Musang King (D197)",
  BLACK_THORN = "Black Thorn (D200)",
  RED_PRAWN = "Red Prawn (D175)",
  D24 = "D24 (Sultan)",
  XO = "XO",
  KAMPUNG = "Kampung"
}

// Globe specific types
export interface GlobeDestination {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number]; 
  poeticTitle: string;
  description: string;
  image: string;
  visitedAt: string;
  priceLabel?: string; 
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface FlightInfo {
  price: string;
  link: string;
}
