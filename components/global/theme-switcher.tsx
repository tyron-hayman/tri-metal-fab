"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sun, Moon, Monitor } from "lucide-react";

const STORAGE_KEY = "theme-preference";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(preference: string) {
  const resolved = preference === "system" ? getSystemTheme() : preference;
  if (resolved === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default function ThemeSwitch() {
  // Always start with "system" on both server and client to avoid hydration mismatch.
  // The real persisted value is read from localStorage in useEffect, after hydration.
  const [theme, setTheme] = useState("system");
  const [mounted, setMounted] = useState(false);

  // On mount: read persisted preference and mark as mounted
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTheme(stored);
    } catch {}
    setMounted(true);
  }, []);

  // Apply theme + persist whenever it changes (skip until mounted to avoid mismatch)
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme, mounted]);

  // Listen for OS-level theme changes (only matters when theme === "system")
  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, mounted]);

  const resolved = mounted
    ? theme === "system"
      ? getSystemTheme()
      : theme
    : "system";

  const statusText = !mounted
    ? "Loading..."
    : theme === "system"
      ? `Following system · ${resolved} mode active`
      : `${resolved.charAt(0).toUpperCase() + resolved.slice(1)} mode active · saved`;

  return (
    <Card className="w-auto bg-none p-0 py-0 m-0 ring-0 bg-muted/0">
      <CardContent className="flex flex-col gap-0 p-0 m-0">
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={(val) => {
            if (val) setTheme(val);
          }}
          className="border-0 m-0 p-0"
        >
          <ToggleGroupItem value="light" aria-label="Light mode">
            <Sun className="h-3.5 w-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="system" aria-label="System mode">
            <Monitor className="h-3.5 w-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Dark mode">
            <Moon className="h-3.5 w-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}
