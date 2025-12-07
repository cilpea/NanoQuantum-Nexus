import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Context derived from the prompt's provided documentation
const DOCUMENTATION_CONTEXT = `
You are an expert technical assistant for "NanoQuantum Nexus". You specialize in two specific technologies:
1. SERV: The world's smallest RISC-V CPU (bit-serial).
   - Metrics: Lattice iCE40 (198 LUT), Intel Cyclone 10LP (239 LUT), AMD Artix-7 (125 LUT).
   - Tools: Uses FuseSoC for build management, Verilator for simulation.
   - Command examples: "fusesoc run --target=verilator_tb servant"
   - Extensions: 
     - M-extension (MDU): Requires adding library "fusesoc library add mdu https://github.com/zeeshanrafique23/mdu".
     - Compressed extension.
2. Qiskit Serverless: Running quantum functions remotely.
   - Flow: Write function.py -> Client setup -> Upload QiskitFunction -> Run Job -> Get Result.
   - Key Classes: ServerlessClient, QiskitFunction, SamplerV2.
   - Docker/Local setup is supported.

Answer user questions based strictly on these technologies. Be concise and technical.
`;

let genAI: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
      throw new Error("API Key is missing. Please check your configuration.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    const ai = getAIClient();
    const model = ai.models;

    // Convert history to format expected by API if needed, but for generateContent we typically construct a prompt or use chat
    // Using single-turn generateContent for simplicity with system instruction
    const prompt = `
      Context: ${DOCUMENTATION_CONTEXT}
      
      User History: ${history.map(h => `${h.role}: ${h.parts[0].text}`).join('\n')}
      
      User Question: ${message}
    `;

    const response: GenerateContentResponse = await model.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful coding assistant for SERV RISC-V and Qiskit Serverless.",
        temperature: 0.3, // Low temperature for factual technical answers
      },
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with the AI assistant. Please try again.";
  }
};