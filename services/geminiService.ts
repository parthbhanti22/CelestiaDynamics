import { GoogleGenAI } from "@google/genai";

/**
 * Service to handle physics concept explanations using Google Gemini AI.
 * Follows the latest @google/genai SDK guidelines.
 */
export const explainPhysicsConcept = async (concept: string, context: string): Promise<string> => {
  // Fix: The SDK client must be initialized using process.env.API_KEY directly in a named parameter.
  // The key's availability is handled externally and is a hard requirement.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Fix: Select 'gemini-3-pro-preview' as it is the recommended model for Complex Text Tasks including STEM.
    // We use ai.models.generateContent directly to perform the query.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
      You are a world-class physics professor named Dr. Celestia.
      Explain the following concept: "${concept}".
      Context: ${context}.
      
      Keep the explanation concise (under 150 words), engaging, and strictly scientifically accurate. 
      Use LaTeX formatting for equations if necessary (wrapped in $ signs).
      Tone: Inspiring, futuristic, educational.
    `,
    });

    // Fix: Directly access the .text property (not a method) on the GenerateContentResponse object.
    return response.text || "Unable to generate explanation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Communication with the cosmos failed. Please try again later.";
  }
};
