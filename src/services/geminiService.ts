import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CropAnalysisResult } from "../types";

// Use NEXT_PUBLIC_ for client-side access in Next.js
const apiKey = process.env.AIzaSyCgz2hevZeDbVBEAZqfyrVCPkMAC8D_Cjo || ''; 

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const analyzeCropImage = async (base64Image: string, lang: 'en' | 'sw'): Promise<CropAnalysisResult> => {
  if (!ai) throw new Error("API Key missing. Please check your .env.local file.");

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

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export const chatWithAgriBot = async (messages: ChatMessage[]): Promise<string> => {
  if (!ai) return "Error: API Key is missing. Please check your configuration.";

  try {
    const systemInstruction = `
      You are 'Agri-Bot', an expert agricultural assistant for Kenyan farmers.
      
      RULES:
      1. LANGUAGE: If the user writes in English, YOU MUST REPLY IN ENGLISH. If the user writes in Swahili, YOU MUST REPLY IN SWAHILI. Do not mix languages unless explicitly asked.
      2. TONE: Be practical, encouraging, and brief.
      3. TOPICS: Focus on crops like Coffee, Tea, Maize, Avocado, and general farm management in Kenya.
    `;
    
    // Transform app messages to Gemini Content format
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents, // Send full history for context
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    // Access the text property directly
    return response.text || "I'm having trouble thinking right now. Please try again.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Connection error. Please check your internet or API key.";
  }
};