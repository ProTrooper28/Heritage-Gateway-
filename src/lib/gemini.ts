import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { IS_DEMO_MODE, getMockResponse } from "./mockHistorian";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatRole = "user" | "model";

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

// ─── Validation schema ────────────────────────────────────────────────────────

const HistorianRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "model"]),
      text: z.string(),
    }),
  ),
  monumentContext: z.string().optional(),
});

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `You are Heritage AI Historian, an expert in Indian history, archaeology, architecture, dynasties, mythology, and culture. Your personality is engaging, curious, and educational. You explain history through storytelling while maintaining historical accuracy. Never answer like a generic AI assistant. Encourage curiosity, include interesting trivia, and clearly separate historical facts from speculation whenever discussing hypothetical scenarios.

Response Style Rules:
1. Start every answer with a captivating hook — an evocative sentence or surprising fact that immediately draws the reader in.
2. Explain topics naturally through storytelling, not bullet lists. Use flowing prose.
3. Weave in architectural details, cultural significance, and fascinating historical facts throughout.
4. End most responses with a "Did You Know?" section highlighted with the emoji 🏛️, containing one remarkable, lesser-known fact.
5. For speculative "What if...?" questions, clearly structure your response into three sections:
   **⚔️ Historical Reality** — What actually happened.
   **🌀 The Alternate Possibility** — What could have been, written imaginatively but grounded in historical logic.
   **🌍 Likely Consequences** — How history might have unfolded differently.
   Always remind the reader which parts are speculation vs. documented history.
6. NEVER respond in a bland, clinical, or generic manner. You are a passionate historian and storyteller — every word should feel like it belongs in a museum documentary.`;

// ─── Preferred model with fallback ────────────────────────────────────────────

const PREFERRED_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
] as const;

// ─── Server Function ──────────────────────────────────────────────────────────

export const askHistorian = createServerFn({ method: "POST" })
  .validator((data: unknown) => HistorianRequestSchema.parse(data))
  .handler(async ({ data }) => {
    // Build conversation history for multi-turn chat
    const { messages, monumentContext } = data;

    // The latest user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      throw new Error("Last message must be from the user.");
    }
    
    // DEMO MODE BYPASS
    if (IS_DEMO_MODE) {
      // Small artificial delay to simulate network
      await new Promise(resolve => setTimeout(resolve, 600));
      return { text: getMockResponse(lastMessage.text), model: "demo-mock" };
    }

    const apiKey = process.env["VITE_GEMINI_API_KEY"];

    if (!apiKey || apiKey === "<PASTE_NEW_GEMINI_API_KEY_HERE>") {
      throw new Error(
        "VITE_GEMINI_API_KEY is not configured. Please add it to your .env file.",
      );
    }

    // Dynamically import to keep this purely server-side
    const { GoogleGenAI } = await import("@google/genai");
    const genAI = new GoogleGenAI({ apiKey });

    // Build contents array — all turns except the last (which is the current user msg)
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // Prepend monument context to the user message if provided
    const userText = monumentContext
      ? `[Context: The user is currently exploring the monument "${monumentContext}"]\n\n${lastMessage.text}`
      : lastMessage.text;

    // Try models in order of preference
    let lastError: Error | null = null;

    for (const modelName of PREFERRED_MODELS) {
      try {
        const response = await genAI.models.generateContent({
          model: modelName,
          contents: [
            ...history,
            { role: "user", parts: [{ text: userText }] },
          ],
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.85,
            maxOutputTokens: 2048,
          },
        });

        const text = response.text ?? "";
        return { text, model: modelName };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // If it's a model not found error, try next model
        const errMsg = lastError.message.toLowerCase();
        if (
          errMsg.includes("not found") ||
          errMsg.includes("404") ||
          errMsg.includes("not supported") ||
          errMsg.includes("invalid model")
        ) {
          continue;
        }
        // Otherwise rethrow immediately
        throw lastError;
      }
    }

    throw lastError ?? new Error("All Gemini models unavailable.");
  });
