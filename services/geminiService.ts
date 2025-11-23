import { GoogleGenAI } from "@google/genai";
import { CaughtFish } from "../types";

const apiKey = process.env.API_KEY || '';

// Fallback lore if API fails or key is missing
const FALLBACK_LORE = [
  "这条鱼看起来很普通，但它的眼神充满智慧。",
  "它在水中闪闪发光，仿佛吞下了一颗星星。",
  "传说这种鱼能带来好运，或者至少是一顿美餐。",
  "钓鱼佬永不空军！",
  "仔细看，它好像在嘲笑你的鱼钩。"
];

export const generateFishLore = async (fish: CaughtFish): Promise<string> => {
  if (!apiKey) {
    return FALLBACK_LORE[Math.floor(Math.random() * FALLBACK_LORE.length)];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We use gemini-2.5-flash for speed and low latency
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, humorous, or mystical description (one or two sentences, max 30 words) for a caught fish in a game. 
      Fish Details:
      Name: ${fish.speciesName}
      Weight: ${fish.weight.toFixed(1)}kg
      Rarity: ${fish.rarity}
      
      Language: Simplified Chinese.
      Tone: Witty, fun, or RPG-style flavor text.`,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return FALLBACK_LORE[Math.floor(Math.random() * FALLBACK_LORE.length)];
  }
};