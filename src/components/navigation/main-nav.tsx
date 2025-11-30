"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NoteMode } from "@/types/database";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

/*
 * Main Navigation Component
 *
 * Provides consistent navigation across all authenticated pages.
 * Features:
 * - Logo/home link
 * - Mode switcher (Research, Project, Reference)
 * - User info and sign out
 *
 * Why "use client"?
 * - usePathname hook requires client-side rendering
 * - Active state detection needs current route info
 */

interface MainNavProps {
  userEmail: string;
}

/*
 * Mode configuration with consistent colors
 * These match the ModeBadge colors used throughout the app
 */
const MODES = [
  {
    key: "research" as NoteMode,
    label: "Research",
    href: "/research",
    description: "Capture external resources",
    colors: {
      active: "bg-purple-100 text-purple-700 border-purple-200",
      hover: "hover:bg-purple-50 hover:text-purple-600",
      icon: "text-purple-500",
    },
  },
  {
    key: "project" as NoteMode,
    label: "Project",
    href: "/project",
    description: "Active work notes",
    colors: {
      active: "bg-blue-100 text-blue-700 border-blue-200",
      hover: "hover:bg-blue-50 hover:text-blue-600",
      icon: "text-blue-500",
    },
  },
  {
    key: "reference" as NoteMode,
    label: "Reference",
    href: "/reference",
    description: "Distilled tutorials",
    colors: {
      active: "bg-green-100 text-green-700 border-green-200",
      hover: "hover:bg-green-50 hover:text-green-600",
      icon: "text-green-500",
    },
  },
] as const;

export function MainNav({ userEmail }: MainNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo / Home */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-700"
          >
            <NotebookIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Homelab Notebook</span>
          </Link>

          {/* Mode Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {MODES.map((mode) => {
              const isActive = pathname.startsWith(mode.href);
              return (
                <Link
                  key={mode.key}
                  href={mode.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-transparent",
                    isActive ? mode.colors.active : `text-gray-600 ${mode.colors.hover}`
                  )}
                >
                  {mode.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Search + User */}
        <div className="flex items-center gap-3">
          <Link
            href="/notes"
            className={cn(
              "text-sm text-gray-600 hover:text-gray-900 transition-colors",
              pathname === "/notes" && "font-medium text-gray-900"
            )}
          >
            All Notes
          </Link>
          <span className="hidden sm:inline text-sm text-gray-500">{userEmail}</span>
          <SignOutForm />
        </div>
      </div>

      {/* Mobile Mode Navigation */}
      <nav className="md:hidden border-t px-4 py-2 flex gap-1 overflow-x-auto">
        {MODES.map((mode) => {
          const isActive = pathname.startsWith(mode.href);
          return (
            <Link
              key={mode.key}
              href={mode.href}
              className={cn(
                "px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap transition-colors border border-transparent",
                isActive ? mode.colors.active : `text-gray-600 ${mode.colors.hover}`
              )}
            >
              {mode.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

/*
 * Sign Out Form
 * Uses a form with Server Action for sign out
 * This pattern follows progressive enhancement - works even without JS
 */
function SignOutForm() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
        Sign out
      </Button>
    </form>
  );
}

/*
 * Mode Indicator Badge
 * Shows current mode context in breadcrumbs or headers
 */
export function ModeIndicator({ mode }: { mode: NoteMode }) {
  const config = MODES.find((m) => m.key === mode);
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        config.colors.active
      )}
    >
      {config.label}
    </span>
  );
}

/*
 * Notebook Icon
 */
function NotebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
    </svg>
  );
}

// Export mode config for use in other components
export { MODES };
