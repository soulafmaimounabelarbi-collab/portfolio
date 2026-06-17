export function Footer() {
  return (
    <footer className="border-t border-petal bg-cream py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-sm text-roseDeep tracking-wider">BS.</span>
        <p className="text-xs text-ash text-center">
          Designed &amp; built by Belarbi Soulef · {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-4">
          <p className="text-xs text-ash">React · TypeScript · Tailwind</p>
          <a
            href="/dashboard"
            className="text-xs text-mist hover:text-ash transition-colors"
            aria-label="Admin Dashboard"
          >
            Dashboard
          </a>
        </div>
      </div>
    </footer>
  );
}

