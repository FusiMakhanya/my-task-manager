import { ShieldCheck } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border border-border bg-muted/50 p-3.5 text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        <span className="font-medium text-foreground">Responsible AI notice.</span>{" "}
        Generated content may be inaccurate, incomplete, or biased. Review and edit
        every output before use, never paste confidential or personal data, and keep
        a human accountable for final decisions.
      </p>
    </div>
  );
}
