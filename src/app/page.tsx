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
 * For now, this is a simple landing page. After adding auth,
 * authenticated users will be redirected to the dashboard.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Homelab Notebook
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          AI-enhanced knowledge management with three integrated modes:
          Research, Project, and Reference.
        </p>

        {/* Feature Cards */}
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

        {/* CTA Button Placeholder */}
        <div className="flex justify-center gap-4">
          <button
            className="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-dark"
            disabled
          >
            Sign In (Coming Soon)
          </button>
        </div>

        {/* Status Badge */}
        <p className="mt-8 text-sm text-gray-500">
          Project initialized with Next.js 15, React 19, TypeScript, and
          Tailwind CSS
        </p>
      </div>
    </main>
  );
}

/*
 * Feature Card Component
 *
 * A simple presentational component for displaying features.
 * Defined in the same file for simplicity - will be extracted
 * to components/ once we have more shared components.
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
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <span className="mb-2 block text-2xl">{icon}</span>
      <h2 className="mb-1 font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
