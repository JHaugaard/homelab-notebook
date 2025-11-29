import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/*
 * Landing Page Component
 *
 * This is the home page rendered at the root URL (/).
 * It's a Server Component by default, meaning:
 * - Renders on the server, sends HTML to browser
 * - Can use async/await directly for data fetching
 * - Cannot use React hooks (useState, useEffect)
 * - Cannot use browser APIs (window, document)
 *
 * Now using shadcn/ui components (Button, Card) for consistent styling.
 * After adding auth, authenticated users will be redirected to the dashboard.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Homelab Notebook
        </h1>

        <p className="mb-8 text-lg text-muted-foreground">
          AI-enhanced knowledge management with three integrated modes:
          Research, Project, and Reference.
        </p>

        {/* Feature Cards - now using shadcn/ui Card component */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <FeatureCard
            title="Research"
            description="Capture and organize external resources with AI auto-tagging"
            icon="📚"
          />
          <FeatureCard
            title="Project"
            description="Raw lab notebook for active work with timestamped notes"
            icon="🔬"
          />
          <FeatureCard
            title="Reference"
            description="Distilled tutorials and step-by-step guides"
            icon="📖"
          />
        </div>

        {/* CTA Button - now using shadcn/ui Button component */}
        <div className="flex justify-center gap-4">
          <Button size="lg" disabled>
            Sign In (Coming Soon)
          </Button>
        </div>

        {/* Status Badge */}
        <p className="mt-8 text-sm text-muted-foreground">
          Project initialized with Next.js 15, React 19, TypeScript, Tailwind
          CSS, and shadcn/ui
        </p>
      </div>
    </main>
  );
}

/*
 * Feature Card Component
 *
 * Now uses shadcn/ui Card components for consistent styling.
 * The Card component provides:
 * - Consistent border radius (--radius variable)
 * - Proper background/foreground colors
 * - Hover states and focus handling
 */
function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <span className="mb-1 block text-2xl">{icon}</span>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
