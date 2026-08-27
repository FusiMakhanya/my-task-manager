import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, Sparkles, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithAssistant } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with an AI workplace copilot for quick answers, rewrites, and decision support — with editable, reviewable responses.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "Chat with an AI workplace copilot for quick answers and drafts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Rewrite this update so it's clearer for executives",
  "What should I ask in a vendor evaluation call?",
  "Help me prioritise five competing deadlines",
];

function ChatPage() {
  const send = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text.trim() }]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "The assistant could not respond.",
      );
    } finally {
      setLoading(false);
      requestAnimationFrame(() =>
        endRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
    }
  };

  const editMessage = (index: number, content: string) =>
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, content } : m)));

  return (
    <AppShell
      title="AI Chatbot"
      description="Conversational copilot for everyday workplace questions"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="flex min-h-[26rem] flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Conversation</h2>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={() => setMessages([])}
              disabled={messages.length === 0}
            >
              <Trash2 className="size-4" />
              Clear
            </Button>
          </div>

          <div className="mt-4 flex-1 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">
                  Ask anything about your workday
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    m.role === "user" && "flex-row-reverse",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg",
                      m.role === "user"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {m.role === "user" ? (
                      <User className="size-4" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                  </div>
                  {m.role === "assistant" ? (
                    <Textarea
                      value={m.content}
                      onChange={(e) => editMessage(i, e.target.value)}
                      aria-label="Editable assistant response"
                      className="min-h-24 flex-1 resize-y bg-muted/40 text-[13px] leading-relaxed"
                    />
                  ) : (
                    <p className="max-w-[80%] whitespace-pre-wrap rounded-xl bg-secondary px-3.5 py-2.5 text-[13px] leading-relaxed text-secondary-foreground">
                      {m.content}
                    </p>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Thinking…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="mt-4 flex items-end gap-2 border-t border-border pt-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={2}
              placeholder="Message the assistant… (Enter to send, Shift+Enter for a new line)"
              className="resize-none"
              aria-label="Message"
            />
            <Button
              onClick={() => submit(input)}
              disabled={loading || !input.trim()}
              size="icon"
              className="size-10 shrink-0"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>

        <AiDisclaimer />
      </div>
    </AppShell>
  );
}
