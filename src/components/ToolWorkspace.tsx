import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Download, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { generateAiText } from "@/lib/ai.functions";

export type Field =
  | {
      id: string;
      label: string;
      type: "text" | "textarea";
      placeholder?: string;
      rows?: number;
      required?: boolean;
      defaultValue?: string;
    }
  | {
      id: string;
      label: string;
      type: "select";
      options: string[];
      required?: boolean;
      defaultValue?: string;
    };

interface Props {
  fields: Field[];
  system: string;
  buildPrompt: (get: (key: string) => string) => string;
  submitLabel: string;
  outputLabel: string;
  fileName: string;
  tips?: string[];
}

export function ToolWorkspace({
  fields,
  system,
  buildPrompt,
  submitLabel,
  outputLabel,
  fileName,
  tips,
}: Props) {
  const generate = useServerFn(generateAiText);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [
        f.id,
        f.defaultValue ?? (f.type === "select" ? (f.options[0] ?? "") : ""),
      ]) as [string, string][],
    ),
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const setValue = (id: string, v: string) =>
    setValues((prev) => ({ ...prev, [id]: v }));

  const onGenerate = async () => {
    const missing = fields.find((f) => f.required && !values[f.id]?.trim());
    if (missing) {
      toast.error(`Please fill in "${missing.label}".`);
      return;
    }
    setLoading(true);
    try {
      const res = await generate({ data: { system, prompt: buildPrompt((k) => values[k] ?? "") } });
      setOutput(res.text.trim());
      toast.success("Draft ready — review and edit before using it.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Generation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([output], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Structured prompt</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Fill in the details — they are assembled into a guided AI prompt.
        </p>

        <div className="mt-5 space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="text-xs">
                {field.label}
                {field.required && <span className="text-destructive"> *</span>}
              </Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  rows={field.rows ?? 5}
                  placeholder={field.placeholder}
                  value={values[field.id] ?? ""}
                  onChange={(e) => setValue(field.id, e.target.value)}
                />
              ) : field.type === "select" ? (
                <Select
                  value={values[field.id] ?? ""}
                  onValueChange={(v) => setValue(field.id, v)}
                >
                  <SelectTrigger id={field.id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  value={values[field.id] ?? ""}
                  onChange={(e) => setValue(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <Button onClick={onGenerate} disabled={loading} className="mt-5 w-full gap-2">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? "Generating…" : submitLabel}
        </Button>

        {tips && tips.length > 0 && (
          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            {tips.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">{outputLabel}</h2>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={copy}
                disabled={!output}
                aria-label="Copy output"
              >
                <Copy className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={download}
                disabled={!output}
                aria-label="Download output"
              >
                <Download className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setOutput("")}
                disabled={!output}
                aria-label="Clear output"
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Fully editable — refine the draft directly here.
          </p>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Your AI-generated draft will appear here…"
            className="mt-4 min-h-80 flex-1 resize-none font-mono text-[13px] leading-relaxed"
          />
        </div>
        <AiDisclaimer />
      </section>
    </div>
  );
}
