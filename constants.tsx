
import { Stall, DurianType } from './types';

export const MOCK_STALLS: Stall[] = [
  // --- MALAYSIA (Originals) ---
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
    ratings: {
      overall: 4.8,
      totalReviews: 1250,
      categories: { quality: 4.9, price: 4.2, service: 4.7 }
    }
  },
  {
    id: "3",
    name: "Rizky Durian Raub",
    address: "Pusat Bandar Raub, 27600 Raub, Pahang, Malaysia",
    coordinates: { lat: 3.7915, lng: 101.8569 },
    phone: "019-9876543",
    whatsapp: "60199876543",
    operatingHours: "10:00 AM - 10:00 PM",
    photos: ["https://picsum.photos/seed/durian3/400/300"],
    varieties: [
      { name: DurianType.MUSANG_KING, pricePerKg: 55, availability: true, lastUpdated: "2024-05-22" },
      { name: DurianType.KAMPUNG, pricePerKg: 15, availability: true, lastUpdated: "2024-05-22" }
    ],
    ratings: {
      overall: 4.9,
      totalReviews: 450,
      categories: { quality: 5.0, price: 4.8, service: 4.5 }
    }
  },

  // --- THAILAND (Global Exporters) ---
  {
    id: "global-1",
    name: "Queen Durian Export Co.",
    address: "Chanthaburi City, Chanthaburi, Thailand",
    coordinates: { lat: 12.6112, lng: 102.1039 },
    phone: "+66 39 123 456",
    whatsapp: "6639123456",
    operatingHours: "8:00 AM - 6:00 PM",
    photos: ["https://picsum.photos/seed/thai-durian/400/300"],
    varieties: [
      { name: "Monthong", pricePerKg: 12, availability: true, lastUpdated: "2024-05-25" },
      { name: "Chanee", pricePerKg: 10, availability: true, lastUpdated: "2024-05-25" }
    ],
    ratings: {
      overall: 4.7,
      totalReviews: 3200,
      categories: { quality: 4.8, price: 4.9, service: 4.4 }
    }
  },

  // --- VIETNAM ---
  {
    id: "global-2",
    name: "Dak Lak Durian Hub",
    address: "Buon Ma Thuot, Dak Lak, Vietnam",
    coordinates: { lat: 12.6678, lng: 108.0383 },
    phone: "+84 262 345 678",
    whatsapp: "84262345678",
    operatingHours: "7:00 AM - 7:00 PM",
    photos: ["https://picsum.photos/seed/viet-durian/400/300"],
    varieties: [
      { name: "Ri6 Durian", pricePerKg: 15, availability: true, lastUpdated: "2024-05-25" },
      { name: "Musang King (VN)", pricePerKg: 45, availability: true, lastUpdated: "2024-05-25" }
    ],
    ratings: {
      overall: 4.6,
      totalReviews: 1800,
      categories: { quality: 4.7, price: 4.8, service: 4.5 }
    }
  },

  // --- PHILIPPINES ---
  {
    id: "global-3",
    name: "Davao Durian Industry Association",
    address: "Davao City, Davao del Sur, Philippines",
    coordinates: { lat: 7.1907, lng: 125.4553 },
    phone: "+63 82 234 5678",
    whatsapp: "63822345678",
    operatingHours: "9:00 AM - 9:00 PM",
    photos: ["https://picsum.photos/seed/ph-durian/400/300"],
    varieties: [
      { name: "Puyat Durian", pricePerKg: 8, availability: true, lastUpdated: "2024-05-25" },
      { name: "Arancillo", pricePerKg: 9, availability: true, lastUpdated: "2024-05-25" }
    ],
    ratings: {
      overall: 4.5,
      totalReviews: 2400,
      categories: { quality: 4.6, price: 4.7, service: 4.3 }
    }
  },

  // --- INDONESIA ---
  {
    id: "global-4",
    name: "Medan Exotic Fruit Center",
    address: "Medan, North Sumatra, Indonesia",
    coordinates: { lat: 3.5952, lng: 98.6722 },
    phone: "+62 61 3456 7890",
    whatsapp: "626134567890",
    operatingHours: "10:00 AM - 11:00 PM",
    photos: ["https://picsum.photos/seed/indo-durian/400/300"],
    varieties: [
      { name: "Durian Medan", pricePerKg: 7, availability: true, lastUpdated: "2024-05-25" },
      { name: "Bawor", pricePerKg: 14, availability: true, lastUpdated: "2024-05-25" }
    ],
    ratings: {
      overall: 4.4,
      totalReviews: 3100,
      categories: { quality: 4.5, price: 4.8, service: 4.2 }
    }
  }
];
