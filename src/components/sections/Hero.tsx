import { MapPin, Circle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useScrollTo } from '../../hooks/useScrollTo';
import { usePortfolio } from '../../context/PortfolioContext';

export function Hero() {
  const { scrollTo } = useScrollTo();
  const { data } = usePortfolio();
  const hero = data.hero;

  const hasContent = hero.firstName || hero.lastName || hero.role || hero.tagline;

  if (!hasContent) {
    return (
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 bg-cream scroll-mt-0"
        aria-label="Introduction"
      >
        <div className="max-w-6xl mx-auto w-full text-center">
          <p className="text-ash text-lg mb-4">Welcome to your portfolio.</p>
          <p className="text-slate text-sm mb-6">
            Go to the{' '}
            <a href="/dashboard" className="text-rose hover:text-roseDeep underline">
              Dashboard
            </a>{' '}
            to add your information and projects.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 bg-cream scroll-mt-0"
      aria-label="Introduction"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {hero.location && (
            <Badge variant="outline">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              <span>{hero.location}</span>
            </Badge>
          )}
          <Badge variant="rose">
            <Circle className="w-2 h-2 fill-current animate-pulse" aria-hidden="true" />
            <span>Open to work</span>
          </Badge>
        </div>

        {/* Main headline */}
        <div className="mb-8">
          {hero.role && (
            <p className="font-mono text-xs text-rose tracking-[0.25em] uppercase mb-4">
              {hero.role}
            </p>
          )}
          <h1 className="font-display text-6xl md:text-8xl text-charcoal leading-[1.05] mb-6">
            {hero.firstName}
            {hero.firstName && hero.lastName && <br />}
            <em className="text-rose not-italic">{hero.lastName}{hero.lastName ? '.' : ''}</em>
          </h1>
          {hero.tagline && (
            <p className="text-slate text-lg md:text-xl max-w-xl leading-relaxed font-light">
              {hero.tagline}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => scrollTo('projects')}
            aria-label="View my projects"
          >
            View my work
          </Button>
          <a
            href="#cv"
            aria-label="Download CV"
            className="inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-2 focus:ring-offset-cream border border-roseMist text-slate hover:border-rose hover:text-roseDeep bg-transparent active:scale-95 px-8 py-3.5 text-base"
          >
            Download CV
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 pt-10 border-t border-petal grid grid-cols-3 gap-8 max-w-sm">
          {[
            { value: hero.statProjects || '0', label: 'Projects shipped' },
            { value: hero.statYears || '0', label: 'Years building' },
            { value: hero.statExtra || '∞', label: 'Curiosity' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl text-charcoal mb-1">{stat.value}</p>
              <p className="text-xs text-ash leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

