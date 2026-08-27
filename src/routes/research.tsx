import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Get structured briefings on any work topic: key findings, comparisons, implications, and open questions to verify.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured briefings on any workplace topic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell
      title="AI Research Assistant"
      description="Structured briefings with findings, implications and open questions"
    >
      <ToolWorkspace
        system="You are a research analyst. Be balanced and precise, separate well-established facts from uncertainty, and never fabricate statistics, citations, or sources. Flag anything the reader must verify. Return markdown only."
        submitLabel="Research topic"
        outputLabel="Editable research brief"
        fileName="research-brief.md"
        tips={[
          "The model has no live web access — verify facts and figures.",
          "Narrow the scope for sharper, more useful briefs.",
        ]}
        fields={[
          {
            id: "topic",
            label: "Topic or question",
            type: "text",
            placeholder: "e.g. Trends in B2B onboarding automation",
            required: true,
          },
          {
            id: "scope",
            label: "Scope, angle & audience",
            type: "textarea",
            placeholder:
              "e.g. For a leadership readout; focus on cost impact and adoption barriers in mid-market SaaS.",
            rows: 6,
          },
          {
            id: "depth",
            label: "Depth",
            type: "select",
            options: ["Quick overview", "Standard brief", "Deep dive"],
          },
          {
            id: "format",
            label: "Output format",
            type: "select",
            options: ["Executive brief", "Bullet summary", "Pros & cons comparison"],
          },
        ]}
        buildPrompt={(v) => `Research the following topic and produce a ${v.format.toLowerCase()}.

Topic: ${v.topic}
Scope, angle and audience: ${v.scope || "General professional audience"}
Depth: ${v.depth}

Return markdown with:
## Executive summary
## Key findings
## Different perspectives / trade-offs
## Practical implications and recommended next steps
## Confidence & what to verify independently (be explicit about uncertainty)`}
      />
    </AppShell>
  );
}
