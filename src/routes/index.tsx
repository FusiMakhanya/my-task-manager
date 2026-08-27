import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Mail,
  MessageSquare,
  ListTodo,
  NotebookPen,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A professional AI workspace for drafting emails, summarizing meetings, planning tasks, researching topics, and chatting with an AI copilot.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Automate workplace tasks with AI: emails, meeting summaries, task plans, research and chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a few bullet points into a polished, on-tone workplace email.",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Convert transcripts into decisions, owners and action items.",
  },
  {
    to: "/planner",
    icon: ListTodo,
    title: "AI Task Planner",
    body: "Break goals into prioritized, time-boxed plans with dependencies.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    body: "Structured briefings with findings, trade-offs and open questions.",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Chatbot",
    body: "A conversational copilot for quick answers and rewrites.",
  },
] as const;

const STATS = [
  { label: "AI workspaces", value: "5" },
  { label: "Structured prompts", value: "Guided" },
  { label: "Outputs", value: "Editable" },
];

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspaces for everyday professional work"
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm sm:p-8">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            AI Workplace Productivity Assistant
          </p>
          <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Automate the busywork, keep the judgement
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Five focused AI workspaces built for professionals — each one guided by
            structured prompts and returning drafts you can edit, copy, and export.
          </p>
          <Link
            to="/email"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start with an email draft
            <ArrowRight className="size-4" />
          </Link>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="text-lg font-semibold text-foreground">{s.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map(({ to, icon: Icon, title, body }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {body}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                Open
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </section>

        <AiDisclaimer />
      </div>
    </AppShell>
  );
}
