import { GoogleGenAI, Type, Chat, Part } from '@google/genai';
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. This will fail if you make real API calls.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY || 'MISSING_API_KEY' });

interface AnalysisInput {
    fileData?: {
        mimeType: string;
        data: string;
    };
    textContent?: string;
}

export const analyzeContent = async (input: AnalysisInput): Promise<AnalysisResult> => {
    try {
        const prompt = `Analyze the following resume/profile content and extract the information in the specified JSON format. If a section like projects or certifications is missing, return an empty array for it.

Content is provided as a file or text.
---`;
        const parts: Part[] = [{ text: prompt }];

        if (input.fileData) {
            parts.push({
                inlineData: {
                    mimeType: input.fileData.mimeType,
                    data: input.fileData.data
                }
            });
        } else if (input.textContent) {
            parts.push({ text: input.textContent });
        } else {
            throw new Error("No content provided for analysis.");
        }


        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The full name of the person." },
                        summary: {
                            type: Type.STRING,
                            description: "A concise professional summary of 2-3 sentences.",
                        },
                        skills: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of 5-10 key technical and soft skills.",
                        },
                        experience: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    role: { type: Type.STRING },
                                    company: { type: Type.STRING },
                                    description: { type: Type.STRING, description: "A concise description of responsibilities and achievements." },
                                },
                                required: ["role", "company", "description"],
                            },
                            description: "A list of professional experiences.",
                        },
                        education: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of educational qualifications, including degree and university."
                        },
                        projects: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                },
                                required: ["title", "description"]
                            },
                            description: "A list of personal or professional projects."
                        },
                        certifications: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of certifications."
                        },
                        contact: {
                            type: Type.OBJECT,
                            properties: {
                                email: { type: Type.STRING }
                            },
                            required: ["email"]
                        }
                    },
                    required: ["name", "summary", "skills", "experience", "education", "projects", "certifications", "contact"],
                },
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as AnalysisResult;

    } catch (error) {
        console.error('Error analyzing content with Gemini:', error);
        throw new Error('Failed to process the document with AI.');
    }
};

export const createChat = (systemInstruction: string): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

export async function* sendMessageStream(chat: Chat, message: string): AsyncGenerator<string> {
    const stream = await chat.sendMessageStream({ message });
    for await (const chunk of stream) {
        yield chunk.text;
    }
}
