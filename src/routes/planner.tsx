import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Break goals into prioritized, time-boxed task plans with dependencies, owners, and realistic schedules.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Break goals into prioritized, time-boxed task plans.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell
      title="AI Task Planner"
      description="Goals broken down into prioritized, time-boxed plans"
    >
      <ToolWorkspace
        system="You are a senior project manager. Produce realistic, prioritized plans using the Eisenhower matrix and clear time estimates. Return markdown only."
        submitLabel="Build plan"
        outputLabel="Editable task plan"
        fileName="task-plan.md"
        tips={[
          "State real constraints — the plan adapts to them.",
          "Edit estimates directly in the output before sharing.",
        ]}
        fields={[
          {
            id: "goal",
            label: "Goal or project",
            type: "text",
            placeholder: "e.g. Launch the customer onboarding revamp",
            required: true,
          },
          {
            id: "context",
            label: "Context, constraints & known tasks",
            type: "textarea",
            placeholder:
              "e.g. Team of 3, two weeks, legal review needed, design assets not started…",
            required: true,
            rows: 7,
          },
          {
            id: "horizon",
            label: "Time horizon",
            type: "select",
            options: ["Today", "This week", "Two weeks", "This month", "This quarter"],
          },
          {
            id: "capacity",
            label: "Available capacity",
            type: "text",
            placeholder: "e.g. ~4 focused hours per day",
          },
        ]}
        buildPrompt={(v) => `Create a task plan.

Goal: ${v("goal")}
Context and constraints: ${v("context")}
Time horizon: ${v("horizon")}
Capacity: ${v("capacity") || "Not stated"}

Return markdown with:
## Objective (one sentence)
## Prioritized tasks (table: # | Task | Priority (P1-P3) | Estimate | Owner | Depends on)
## Suggested schedule across the ${v("horizon").toLowerCase()} horizon
## Risks & mitigations
## Definition of done`}
      />
    </AppShell>
  );
}
