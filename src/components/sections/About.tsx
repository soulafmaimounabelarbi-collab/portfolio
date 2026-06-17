import { SectionWrapper, SectionHeading } from '../layout/SectionWrapper';
import { usePortfolio } from '../../context/PortfolioContext';
import { Github } from 'lucide-react';

/* ── Inline SVG icons not in lucide ────────────────────────── */
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function About() {
  const { data } = usePortfolio();
  const about = data.about;

  const details = [
    about.location     && { dt: 'Location',     dd: about.location },
    about.availability && { dt: 'Availability', dd: about.availability },
    about.focus        && { dt: 'Focus',         dd: about.focus },
    about.languages    && { dt: 'Languages',     dd: about.languages },
    about.email        && { dt: 'Email',         dd: about.email },
  ].filter(Boolean) as { dt: string; dd: string }[];

  const hasBio = about.bio1 || about.bio2 || about.bio3;

  const socials = [
    about.github    && { href: about.github,    icon: <Github size={18} />,    label: 'GitHub' },
    about.linkedin  && { href: about.linkedin,  icon: <LinkedInIcon />,         label: 'LinkedIn' },
    about.instagram && { href: about.instagram, icon: <InstagramIcon />,        label: 'Instagram' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[];

  return (
    <SectionWrapper id="about" className="bg-blush" label="About me">
      <div className="grid md:grid-cols-2 gap-16 items-start">

        {/* ── Left: Bio + socials ─────────────────────────────── */}
        <div>
          <SectionHeading
            eyebrow="Who I am"
            title="Passionate about building things that work."
          />

          {hasBio ? (
            <div className="space-y-4 text-slate leading-relaxed">
              {about.bio1 && <p>{about.bio1}</p>}
              {about.bio2 && <p>{about.bio2}</p>}
              {about.bio3 && <p>{about.bio3}</p>}
            </div>
          ) : (
            <p className="text-ash text-sm italic">
              No bio added yet. Visit the{' '}
              <a href="/dashboard" className="text-rose hover:text-roseDeep underline">
                Dashboard
              </a>{' '}
              to add your information.
            </p>
          )}

          {/* Social links */}
          {socials.length > 0 && (
            <div className="flex gap-3 mt-8">
              {socials.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-roseMist flex items-center justify-center text-ash hover:border-rose hover:text-roseDeep hover:bg-petal transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Photo + details card ─────────────────────── */}
        <div className="bg-cream rounded-2xl border border-petal overflow-hidden shadow-[0_24px_64px_rgba(212,120,154,0.10)]">

          {/* Card Header */}
          <div className="p-7 pb-0 border-b border-petal bg-gradient-to-b from-roseSoft/20 to-transparent">
            <h3 className="font-display text-xl text-charcoal">Belarbi Soulef</h3>
            <p className="text-xs font-mono text-rose uppercase tracking-widest mt-1">Full-Stack Developer</p>
          </div>

          {/* Details list */}
          {details.length > 0 ? (
            <dl className="p-7 space-y-4">
              {details.map(({ dt, dd }) => (
                <div key={dt} className="flex items-start gap-4">
                  <dt className="text-xs font-mono text-rose uppercase tracking-widest w-28 shrink-0 pt-0.5">
                    {dt}
                  </dt>
                  <dd className="text-sm text-charcoal">{dd}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-ash text-sm text-center py-8 italic px-7">
              Add your details in the Dashboard.
            </p>
          )}
        </div>

      </div>
    </SectionWrapper>
  );
}
