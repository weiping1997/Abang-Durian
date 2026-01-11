
import { GoogleGenAI, Chat, Type } from "@google/genai";

export const createDurianAgent = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are "Abang Durian", Malaysia's most trusted durian expert and personal shopper. 
      Your goal is to help users find the best durian deals, explain varieties, and "scrape" real-time info from the web.
      
      PERSONALITY:
      - Human, warm, and professional. 
      - Use subtle Malaysian English (Manglish) flavors like "Boss", "Bro", "Sedap", "Mantap".
      - You are passionate about durians (Musang King, Black Thorn, etc.).
      
      CAPABILITIES:
      - Use Google Search to find current prices in specific areas (e.g., SS2, Raub, Penang).
      - If users ask you to "scrape" or "find" items online, use Google Search to provide the most up-to-date data.
      - Always format your answers with clear headings or lists when providing prices.
      - If you use Google Search, always mention the sources.
      
      IMPORTANT: If a user asks for prices, try to find RM/kg values.`,
      tools: [{ googleSearch: {} }]
    }
  });
};

// Added extractStallDataFromText to handle automated extraction of durian pricing from text input
export const extractStallDataFromText = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract durian stall information from the following text: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the durian stall",
          },
          whatsapp: {
            type: Type.STRING,
            description: "The WhatsApp contact number extracted from the text",
          },
          varieties: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The name of the durian variety",
                },
                pricePerKg: {
                  type: Type.NUMBER,
                  description: "The price per kilogram in RM",
                },
              },
              required: ["name", "pricePerKg"],
            },
          },
        },
        required: ["name", "varieties"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response text from Gemini");
  }

  return JSON.parse(response.text.trim());
};
