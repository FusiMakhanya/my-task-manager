import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into structured summaries, decisions, and action items with owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn raw meeting notes into decisions and action items.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Transcripts and rough notes turned into decisions and actions"
    >
      <ToolWorkspace
        system="You are an executive assistant who writes precise meeting summaries. Never invent facts that are not present in the notes; mark gaps as 'Not stated'. Return markdown only."
        submitLabel="Summarize meeting"
        outputLabel="Editable meeting summary"
        fileName="meeting-summary.md"
        tips={[
          "Remove names or confidential figures you don't want processed.",
          "Longer, messier notes still work — paste them as-is.",
        ]}
        fields={[
          {
            id: "meeting",
            label: "Meeting title",
            type: "text",
            placeholder: "e.g. Weekly product sync",
          },
          {
            id: "attendees",
            label: "Attendees",
            type: "text",
            placeholder: "e.g. Sam, Priya, Alex",
          },
          {
            id: "notes",
            label: "Raw notes or transcript",
            type: "textarea",
            placeholder: "Paste your notes or transcript here…",
            required: true,
            rows: 12,
          },
          {
            id: "style",
            label: "Summary depth",
            type: "select",
            options: ["Concise recap", "Balanced", "Detailed minutes"],
          },
        ]}
        buildPrompt={(v) => `Summarize the following meeting.

Meeting: ${v("meeting") || "Not stated"}
Attendees: ${v("attendees") || "Not stated"}
Depth: ${v("style")}

Raw notes / transcript:
"""
${v("notes")}
"""

Return markdown with these sections:
## Summary
## Key discussion points
## Decisions made
## Action items (table: Owner | Action | Due date)
## Open questions & risks`}
      />
    </AppShell>
  );
}
