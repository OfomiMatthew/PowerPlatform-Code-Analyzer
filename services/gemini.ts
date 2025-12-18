
import { GoogleGenAI, Type } from "@google/genai";
import { SolutionType, AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `You are an elite Power Platform Architect and Lead Developer. 
Your expertise spans across Power Apps (Power Fx), Power Automate (Logic Apps/JSON), and Power BI (DAX/M).
Your task is to analyze code provided by the user. 
- Identify logic errors, performance bottlenecks, security vulnerabilities, and accessibility issues.
- Provide a summary of the analysis.
- Assign an overall health score (0-100).
- List specific issues with category, severity, title, description, and clear recommendation.
- Provide an optimized version of the code snippet.
Return exactly the JSON structure requested.`;

export const analyzePowerPlatformCode = async (
  type: SolutionType,
  code: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this ${type} code: \n\n${code}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          score: { type: Type.NUMBER },
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                severity: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                snippet: { type: Type.STRING },
              },
              required: ["id", "category", "severity", "title", "description", "recommendation"]
            }
          },
          optimizedCode: { type: Type.STRING }
        },
        required: ["summary", "score", "issues", "optimizedCode"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse analysis result:", e);
    throw new Error("Invalid response format from AI");
  }
};
