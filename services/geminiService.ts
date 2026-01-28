
import { GoogleGenAI } from "@google/genai";

// Always use the process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMinecraftDeathMessage(score: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, funny Minecraft-style death message for a player who died in a Flappy Bird game with a score of ${score}. Examples: "Steve hit the ground too hard", "Chicken flew into a pipe". Keep it under 60 characters.`,
    });
    // The response.text property returns the extracted string output.
    return response.text || "You fell out of the world!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "You hit the ground too hard!";
  }
}

export async function getBiomeLore(biome: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 1-sentence funny Minecraft lore about the ${biome} biome for a bird flying through it.`,
    });
    // The response.text property returns the extracted string output.
    return response.text || `Welcome to the ${biome}!`;
  } catch (error) {
    return `Watch out for the pipes!`;
  }
}
