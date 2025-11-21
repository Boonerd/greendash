import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CropAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || ''; 

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const analyzeCropImage = async (base64Image: string, lang: 'en' | 'sw'): Promise<CropAnalysisResult> => {
  if (!ai) throw new Error("API Key missing");

  const prompt = lang === 'sw' 
    ? "Wewe ni mtaalamu wa kilimo Kenya. Angalia picha hii ya mmea. Tambua kama una ugonjwa wowote, wadudu, au upungufu wa virutubisho. Toa jibu fupi kwa umbizo la JSON: { \"diagnosis\": \"jina la tatizo au 'Afya Njema'\", \"confidence\": namba_0_hadi_100, \"treatment\": \"ushauri mfupi wa nini cha kufanya\", \"healthy\": boolean }."
    : "You are an agricultural expert in Kenya. Analyze this crop image. Identify if there are diseases, pests, or nutrient deficiencies. Provide a short response in JSON format: { \"diagnosis\": \"name of issue or 'Healthy'\", \"confidence\": number_0_to_100, \"treatment\": \"short advice on what to do\", \"healthy\": boolean }.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as CropAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const chatWithAgriBot = async (message: string, history: string[]): Promise<string> => {
  if (!ai) throw new Error("API Key missing");

  try {
    const systemInstruction = "You are 'Agri-Bot', a helpful assistant for Kenyan smallholder farmers. You speak a mix of English and Swahili (Sheng/local style) if appropriate, but stick to the user's language. Keep answers short, practical, and encouraging. Focus on coffee, maize, tea, and avocado.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text || "Sorry, I couldn't understand that. Jaribu tena.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Network error. Please try again later.";
  }
};