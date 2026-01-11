
import { Stall, DurianType } from './types.ts';

export const MOCK_STALLS: Stall[] = [
  {
    id: "1",
    name: "Durian King @ SS2",
    address: "19, Jalan SS 2/67, SS 2, 47300 Petaling Jaya, Selangor, Malaysia",
    coordinates: { lat: 3.1189, lng: 101.6212 },
    phone: "012-3456789",
    whatsapp: "60123456789",
    operatingHours: "12:00 PM - 12:00 AM",
    photos: ["https://picsum.photos/seed/durian1/400/300"],
    varieties: [
      { name: DurianType.MUSANG_KING, pricePerKg: 65, availability: true, lastUpdated: "2024-05-20" },
      { name: DurianType.BLACK_THORN, pricePerKg: 95, availability: true, lastUpdated: "2024-05-20" },
      { name: DurianType.D24, pricePerKg: 28, availability: true, lastUpdated: "2024-05-20" }
    ],
    ratings: { overall: 4.8, totalReviews: 1250, categories: { quality: 4.9, price: 4.2, service: 4.7 } }
  },
  {
    id: "global-1",
    name: "Queen Durian Export Co.",
    address: "Chanthaburi City, Thailand",
    coordinates: { lat: 12.6112, lng: 102.1039 },
    phone: "+66 39 123 456",
    whatsapp: "6639123456",
    operatingHours: "8:00 AM - 6:00 PM",
    photos: ["https://picsum.photos/seed/thai-durian/400/300"],
    varieties: [
      { name: "Monthong", pricePerKg: 12, availability: true, lastUpdated: "2024-05-25" },
      { name: "Chanee", pricePerKg: 10, availability: true, lastUpdated: "2024-05-25" }
    ],
    ratings: { overall: 4.7, totalReviews: 3200, categories: { quality: 4.8, price: 4.9, service: 4.4 } }
  },
  {
    id: "global-2",
    name: "Dak Lak Durian Hub",
    address: "Buon Ma Thuot, Vietnam",
    coordinates: { lat: 12.6678, lng: 108.0383 },
    phone: "+84 262 345 678",
    whatsapp: "84262345678",
    operatingHours: "7:00 AM - 7:00 PM",
    photos: ["https://picsum.photos/seed/viet-durian/400/300"],
    varieties: [
      { name: "Ri6 Durian", pricePerKg: 15, availability: true, lastUpdated: "2024-05-25" },
      { name: "Musang King (VN)", pricePerKg: 45, availability: true, lastUpdated: "2024-05-25" }
    ],
    ratings: { overall: 4.6, totalReviews: 1800, categories: { quality: 4.7, price: 4.8, service: 4.5 } }
  }
];
