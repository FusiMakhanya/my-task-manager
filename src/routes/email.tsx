import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in seconds with structured AI prompts, tone control, and fully editable output.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell
      title="Smart Email Generator"
      description="Professional emails drafted from a few structured inputs"
    >
      <ToolWorkspace
        system="You are an expert business communication writer. Write clear, concise, professional emails. Return only the email: a subject line, then the body. No commentary."
        submitLabel="Generate email"
        outputLabel="Editable email draft"
        fileName="email-draft.txt"
        tips={[
          "Keep recipient names generic if the content is sensitive.",
          "Adjust tone and length, then regenerate to compare drafts.",
        ]}
        fields={[
          {
            id: "recipient",
            label: "Recipient / audience",
            type: "text",
            placeholder: "e.g. Head of Operations",
            required: true,
          },
          {
            id: "purpose",
            label: "Purpose & key points",
            type: "textarea",
            placeholder:
              "e.g. Request a two-week extension on the Q3 rollout; blocked by vendor delays; propose new date of 14 Oct.",
            required: true,
            rows: 6,
          },
          {
            id: "tone",
            label: "Tone",
            type: "select",
            options: [
              "Professional",
              "Friendly",
              "Formal",
              "Persuasive",
              "Apologetic",
              "Direct",
            ],
          },
          {
            id: "length",
            label: "Length",
            type: "select",
            options: ["Short (under 100 words)", "Medium", "Detailed"],
          },
          {
            id: "cta",
            label: "Desired next step",
            type: "text",
            placeholder: "e.g. Confirm approval by Friday",
          },
        ]}
        buildPrompt={(v) => `Write a workplace email.

Recipient/audience: ${v("recipient")}
Purpose and key points: ${v("purpose")}
Tone: ${v("tone")}
Length: ${v("length")}
Desired next step / call to action: ${v("cta") || "Not specified"}

Format:
Subject: <subject line>

<email body with greeting, body paragraphs, and sign-off placeholder [Your Name]>`}
      />
    </AppShell>
  );
}
