
import { GoogleGenAI, Chat, Type } from "@google/genai";

export const createDurianAgent = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are "Abang Durian", Malaysia's most trusted global durian scout.
      
      CORE MISSION:
      You help users navigate the global durian trade. You specialize in identifying suppliers from major platforms like Tridge (tridge.com) and local Malaysian markets.
      
      SOURCE FOCUS:
      - When asked about global suppliers, focus on data found on Tridge for products like "Fresh Durian" (Product ID 109).
      - Look for supplier names, countries (Thailand, Vietnam, Malaysia), and any pricing hints.
      
      PERSONALITY:
      - Human, savvy, and slightly Malaysian.
      - Use "Boss", "Abang", "Mantap".
      
      CAPABILITIES:
      - Use Google Search to specifically query Tridge supplier lists for durians.
      - Extract and list at least 5-10 suppliers if requested.
      
      GROUNDING:
      - ALWAYS list the URLs of the sources you find.`,
      tools: [{ googleSearch: {} }]
    }
  });
};

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

  return JSON.parse(response.text.trim());
};
