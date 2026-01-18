
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async suggestSubtasks(taskTitle: string, taskDesc: string): Promise<string[]> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Break down the task "${taskTitle}" (${taskDesc}) into 3-5 actionable subtasks.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subtasks: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["subtasks"]
          }
        }
      });
      const data = JSON.parse(response.text);
      return data.subtasks || [];
    } catch (error) {
      console.error("Gemini Error:", error);
      return [];
    }
  },

  async getDashboardSummary(tasks: Task[]): Promise<string> {
    try {
      const taskSummary = tasks.map(t => `${t.title} (${t.status})`).join(', ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these tasks and give a short, motivational summary of progress and what to focus on next: ${taskSummary}`,
        config: {
          systemInstruction: "You are a highly productive life coach."
        }
      });
      return response.text || "Keep crushing those goals!";
    } catch (error) {
      return "Stay focused and keep moving forward.";
    }
  }
};
