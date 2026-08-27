import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { TaskManager } from "@/components/TaskManager";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaskFlow — Calm Task Management" },
      {
        name: "description",
        content:
          "A clean, minimal task manager with categories, completion tracking, and dark mode.",
      },
      { property: "og:title", content: "TaskFlow — Calm Task Management" },
      {
        property: "og:description",
        content:
          "A clean, minimal task manager with categories, completion tracking, and dark mode.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="py-2">
        <TaskManager />
      </main>
    </div>
  );
}
