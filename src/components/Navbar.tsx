import { CheckSquare, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <CheckSquare className="size-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight text-foreground">
              TaskFlow
            </span>
            <span className="text-[11px] text-muted-foreground">
              calm task management
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
