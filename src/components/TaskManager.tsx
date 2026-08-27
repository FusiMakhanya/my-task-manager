import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "all" | "active" | "completed";

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: number;
}

const CATEGORIES = [
  "Work",
  "Personal",
  "Shopping",
  "Health",
  "Learning",
] as const;

const STORAGE_KEY = "taskflow-tasks";

const CATEGORY_DOT: Record<string, string> = {
  Work: "bg-sky-500",
  Personal: "bg-violet-500",
  Shopping: "bg-amber-500",
  Health: "bg-emerald-500",
  Learning: "bg-rose-500",
};

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<Status>("all");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        category,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setTitle("");
  };

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        if (filterCategory !== "all" && t.category !== filterCategory)
          return false;
        if (filterStatus === "active" && t.completed) return false;
        if (filterStatus === "completed" && !t.completed) return false;
        return true;
      }),
    [tasks, filterCategory, filterStatus]
  );

  const counts = useMemo(
    () => ({
      total: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      done: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        <StatCard label="Total" value={counts.total} />
        <StatCard label="Active" value={counts.active} accent />
        <StatCard label="Done" value={counts.done} />
      </div>

      {/* Add task */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            placeholder="Add a new task…"
            className="h-11 flex-1 text-base"
            aria-label="Task title"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 w-full sm:w-36" aria-label="Category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={addTask}
            className="h-11 gap-1.5 px-5"
            size="lg"
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "active", "completed"] as Status[]).map((s) => (
            <Button
              key={s}
              variant={filterStatus === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(s)}
              className="capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="h-9 w-full sm:w-44" aria-label="Filter category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task list */}
      <div className="mt-4 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
            <ListChecks className="size-9 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-foreground">
              {tasks.length === 0
                ? "No tasks yet — add your first one above"
                : "No tasks match these filters"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Stay calm and stay organized
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-colors hover:bg-accent/40"
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                aria-label={`Mark "${task.title}" as ${
                  task.completed ? "active" : "complete"
                }`}
                className="size-5"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-sm font-medium text-foreground transition-colors",
                    task.completed && "text-muted-foreground line-through"
                  )}
                >
                  {task.title}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      CATEGORY_DOT[task.category]
                    )}
                  />
                  <span className="text-xs text-muted-foreground">
                    {task.category}
                  </span>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "shrink-0 font-normal",
                  task.completed
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                )}
              >
                {task.completed ? "Done" : "Active"}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete task "${task.title}"`}
                className="size-8 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 text-center shadow-sm",
        accent && "border-primary/30 bg-primary/5"
      )}
    >
      <div
        className={cn(
          "text-2xl font-semibold tabular-nums",
          accent ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
