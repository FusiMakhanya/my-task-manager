import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const GenerateInput = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

export const generateAiText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing API key).");

    const { createLovableAiGatewayProvider, DEFAULT_MODEL } = await import(
      "./ai-gateway.server"
    );
    const gateway = createLovableAiGatewayProvider(key);

    const result = streamText({
      model: gateway(DEFAULT_MODEL),
      system: data.system,
      prompt: data.prompt,
    });

    return { text: await result.text };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing API key).");

    const { createLovableAiGatewayProvider, DEFAULT_MODEL } = await import(
      "./ai-gateway.server"
    );
    const gateway = createLovableAiGatewayProvider(key);

    const result = streamText({
      model: gateway(DEFAULT_MODEL),
      system:
        "You are the AI Workplace Productivity Assistant, a concise, professional workplace copilot. " +
        "Answer clearly with practical, actionable guidance. Use short paragraphs and bullet lists when helpful. " +
        "If you are unsure or the request needs verified facts, say so plainly.",
      messages: data.messages,
    });

    return { text: await result.text };
  });
