import { useState, useEffect } from 'react';
import { useScrollTo } from '../../hooks/useScrollTo';
import { cn } from '../../lib/utils';

const navLinks = [
  { label: 'About', id: 'about' },
  { label: 'Journey', id: 'journey' },
  { label: 'Projects', id: 'projects' },
  { label: 'Stack', id: 'stack' },
  { label: 'Contact', id: 'contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollTo } = useScrollTo();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNav = (id: string) => {
    scrollTo(id);
    setMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
        scrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-petal' : 'bg-transparent'
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
        <button
          onClick={() => scrollTo('hero')}
          className="font-mono text-sm text-roseDeep tracking-wider focus:outline-none focus:ring-2 focus:ring-rose rounded-md px-1"
          aria-label="Back to top"
        >
          BS.
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleNav(link.id)}
                className="text-sm text-slate hover:text-roseDeep transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose rounded-md px-1 py-0.5"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleNav('contact')}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-xs font-medium rounded-full bg-roseDeep text-white hover:bg-rose transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-2"
        >
          Hire me
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate hover:text-roseDeep focus:outline-none focus:ring-2 focus:ring-rose rounded-md"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="block w-5 h-0.5 bg-current mb-1.5 transition-all" />
          <span className="block w-5 h-0.5 bg-current mb-1.5 transition-all" />
          <span className="block w-3 h-0.5 bg-current transition-all" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream/98 backdrop-blur-md border-b border-petal">
          <ul className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNav(link.id)}
                  className="w-full text-left px-3 py-2.5 text-sm text-slate hover:text-roseDeep hover:bg-petal rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li className="mt-2">
              <button
                onClick={() => handleNav('contact')}
                className="w-full px-5 py-2.5 text-sm font-medium rounded-full bg-roseDeep text-white hover:bg-rose transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose"
              >
                Hire me
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
