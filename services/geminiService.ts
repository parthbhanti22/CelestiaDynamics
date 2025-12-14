import { GoogleGenAI } from "@google/genai";

// Safely retrieve API key, handling environments where 'process' might be undefined
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
  } catch (e) {
    // Ignore reference errors
  }
  return '';
};

const apiKey = getApiKey();

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const explainPhysicsConcept = async (concept: string, context: string): Promise<string> => {
  if (!ai) return "API Key not configured. Please check your environment settings.";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a world-class physics professor named Dr. Celestia.
      Explain the following concept: "${concept}".
      Context: ${context}.
      
      Keep the explanation concise (under 150 words), engaging, and strictly scientifically accurate. 
      Use LaTeX formatting for equations if necessary (wrapped in $ signs).
      Tone: Inspiring, futuristic, educational.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Unable to generate explanation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Communication with the cosmos failed. Please try again later.";
  }
};