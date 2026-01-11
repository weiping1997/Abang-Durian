
import { Stall, DurianType } from './types.ts';

export const MOCK_STALLS: Stall[] = [
  {
    id: "my-ss2-king",
    name: "Durian King @ SS2",
    address: "19, Jalan SS 2/67, SS 2, 47300 Petaling Jaya, Selangor, Malaysia",
    coordinates: { lat: 3.1189, lng: 101.6212 },
    phone: "012-3456789",
    whatsapp: "60123456789",
    operatingHours: "12:00 PM - 12:00 AM",
    // Specifically using the Harian Metro area/stall photo for SS2 as requested
    photos: ["https://assets.hmetro.com.my/images/articles/0102rsdurian_1767326978.jpg"], 
    varieties: [
      { name: DurianType.MUSANG_KING, pricePerKg: 65, availability: true, lastUpdated: "2024-05-20" },
      { name: DurianType.BLACK_THORN, pricePerKg: 95, availability: true, lastUpdated: "2024-05-20" },
      { name: DurianType.D24, pricePerKg: 28, availability: true, lastUpdated: "2024-05-20" }
    ],
    ratings: { overall: 4.8, totalReviews: 1250, categories: { quality: 4.9, price: 4.2, service: 4.7 } }
  },
  {
    id: "my-raub-gold",
    name: "Raub Musang King Hub",
    address: "Raub District, Pahang, Malaysia",
    coordinates: { lat: 3.7915, lng: 101.8569 },
    phone: "019-2233445",
    whatsapp: "60192233445",
    operatingHours: "9:00 AM - 6:00 PM",
    // Use the first provided durian link (FAMA/Bernama)
    photos: ["https://www.freemalaysiatoday.com/cdn-cgi/image/width=3840,quality=80,format=auto,fit=scale-down,metadata=none,dpr=1,onerror=redirect/https://media.freemalaysiatoday.com/wp-content/uploads/2026/01/4e84aed3-durian-fama-bernamapic-090126.webp"], 
    varieties: [
      { name: DurianType.MUSANG_KING, pricePerKg: 52, availability: true, lastUpdated: "2024-05-21" },
      { name: "Pahang Grade A", pricePerKg: 48, availability: true, lastUpdated: "2024-05-21" }
    ],
    ratings: { overall: 4.9, totalReviews: 890, categories: { quality: 5.0, price: 4.5, service: 4.8 } }
  },
  {
    id: "th-queen-chan",
    name: "Queen Durian Chanthaburi",
    address: "Chanthaburi, Thailand",
    coordinates: { lat: 12.6112, lng: 102.1039 },
    phone: "+66 39 311 000",
    whatsapp: "6639311000",
    operatingHours: "7:00 AM - 7:00 PM",
    // Use the second provided durian link
    photos: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtv5OH-OSFL8ZRV1VnRVa7WxVO4BfzXLnUKA&s"], 
    varieties: [
      { name: "Monthong", pricePerKg: 15, availability: true, lastUpdated: "2024-05-25" },
      { name: "Kanyao (Long Stem)", pricePerKg: 45, availability: true, lastUpdated: "2024-05-25" }
    ],
    ratings: { overall: 4.8, totalReviews: 4500, categories: { quality: 4.9, price: 4.7, service: 4.6 } }
  },
  {
    id: "vn-vina-tt",
    name: "Vina T&T Group",
    address: "Tien Giang, Mekong Delta, Vietnam",
    coordinates: { lat: 10.3592, lng: 106.3420 },
    phone: "+84 28 3822 0000",
    whatsapp: "842838220000",
    operatingHours: "8:00 AM - 8:00 PM",
    // Use the third provided durian link
    photos: ["https://static4.depositphotos.com/1004740/386/i/450/depositphotos_3867259-stock-photo-durian-2.jpg"], 
    varieties: [
      { name: "Ri6 Durian", pricePerKg: 14, availability: true, lastUpdated: "2024-05-24" },
      { name: "Chuong Durian", pricePerKg: 12, availability: true, lastUpdated: "2024-05-24" }
    ],
    ratings: { overall: 4.5, totalReviews: 1200, categories: { quality: 4.6, price: 4.9, service: 4.3 } }
  }
];
