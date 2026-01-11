
import { Stall, DurianType } from './types';

export const MOCK_STALLS: Stall[] = [
  {
    id: "1",
    name: "Durian King @ SS2",
    address: "19, Jalan SS 2/67, SS 2, 47300 Petaling Jaya, Selangor",
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
    id: "2",
    name: "Donald's Durian",
    address: "15, Jalan 19/29, Seksyen 19, 46300 Petaling Jaya, Selangor",
    coordinates: { lat: 3.1192, lng: 101.6298 },
    phone: "017-2345678",
    whatsapp: "60172345678",
    operatingHours: "1:00 PM - 11:00 PM",
    photos: ["https://picsum.photos/seed/durian2/400/300"],
    varieties: [
      { name: DurianType.MUSANG_KING, pricePerKg: 68, availability: true, lastUpdated: "2024-05-21" },
      { name: DurianType.XO, pricePerKg: 35, availability: true, lastUpdated: "2024-05-21" }
    ],
    ratings: {
      overall: 4.5,
      totalReviews: 890,
      categories: { quality: 4.6, price: 4.0, service: 4.4 }
    }
  },
  {
    id: "3",
    name: "Rizky Durian Raub",
    address: "Pusat Bandar Raub, 27600 Raub, Pahang",
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
  {
    id: "4",
    name: "Durian SS2",
    address: "Jalan SS 2/24, SS 2, 47300 Petaling Jaya, Selangor",
    coordinates: { lat: 3.1172, lng: 101.6234 },
    phone: "012-6668888",
    whatsapp: "60126668888",
    operatingHours: "11:00 AM - 11:00 PM",
    photos: ["https://picsum.photos/seed/durian4/400/300"],
    varieties: [
      { name: DurianType.MUSANG_KING, pricePerKg: 62, availability: true, lastUpdated: "2024-05-23" },
      { name: DurianType.RED_PRAWN, pricePerKg: 42, availability: true, lastUpdated: "2024-05-23" }
    ],
    ratings: {
      overall: 4.2,
      totalReviews: 2100,
      categories: { quality: 4.3, price: 3.9, service: 4.1 }
    }
  }
];
