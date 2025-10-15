
import { GoogleGenAI, Chat } from "@google/genai";
import { Message, MessageRole } from '../types';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const getChat = (history: Message[]) => {
    const aiInstance = getAI();
    const formattedHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
    
    chat = aiInstance.chats.create({
        model: 'gemini-2.5-flash',
        history: formattedHistory
    });
    return chat;
}

export const sendMessage = async (message: string, history: Message[]): Promise<string> => {
    try {
        const chatInstance = getChat(history);
        const response = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to get response from Gemini API.");
    }
};
