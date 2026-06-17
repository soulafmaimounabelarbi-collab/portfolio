/**
 * Portfolio3D.tsx
 * ────────────────
 * 3D hero (Three.js torus-knot + particle field + mouse parallax),
 * Framer-motion scroll reveals, all data from the shared store.
 * Replaces the individual section components as the portfolio page.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  MapPin, Circle, Send, CheckCircle, Mail,
  ExternalLink, Github, ChevronDown, ArrowUpRight,
} from 'lucide-react';

import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';
import { addMessage } from '../hooks/usePortfolioStore';
import type { Project, JourneyItem } from '../types/index';
import type { SkillGroup } from '../data/stack';

/* ─── colour tokens ───────────────────────────────────────────── */
const C = {
  cream:    '#FFF8F8',
  blush:    '#FFF0F3',
  petal:    '#FFE4EC',
  roseMist: '#F5C6D6',
  roseSoft: '#E8A0BA',
  rose:     '#D4789A',
  roseDeep: '#B85A7A',
  charcoal: '#2D2D2D',
  slate:    '#4A4A4A',
  ash:      '#787878',
  mist:     '#AAAAAA',
} as const;

/* ─── Default seed data ───────────────────────────────────────── */
const SEED_PROJECTS: Project[] = [
  {
    id: 'classmate',
    title: 'ClassMate',
    category: 'SaaS',
    description: 'Real-time classroom management platform with live whiteboard, attendance tracking, and instant quiz builder.',
    techStack: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis'],
    thumbnail: 'classmate',
    liveUrl: '#',
    githubUrl: '#',
    highlights: [
      'Live WebSocket sessions for 200+ concurrent users',
      'Sub-50ms whiteboard sync via binary diff patches',
      'JWT auth with role-based access (teacher / student / admin)',
    ],
    featured: true,
  },
  {
    id: 'souk',
    title: 'Souk',
    category: 'E-commerce',
    description: 'Modern Algerian e-commerce platform with multi-vendor support, real-time inventory, and Chargily payment integration.',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe'],
    thumbnail: 'souk',
    liveUrl: '#',
    githubUrl: '#',
    highlights: [
      'Multi-vendor architecture with per-vendor dashboards',
      'Chargily & CCP payment gateways integrated',
      'SSR with ISR for product pages — fast cold loads',
    ],
    featured: false,
  },
  {
    id: 'devflow',
    title: 'DevFlow',
    category: 'Tool',
    description: 'Developer productivity dashboard aggregating GitHub, Linear, and Notion into a single focused workspace.',
    techStack: ['React', 'GraphQL', 'Node.js', 'Redis'],
    thumbnail: 'devflow',
    liveUrl: '#',
    githubUrl: '#',
    highlights: [
      'Unified API gateway for 3rd-party services',
      'Real-time PR status notifications via webhooks',
    ],
    featured: false,
  },
];

const SEED_STACK: SkillGroup[] = [
  { category: 'Frontend',  skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend',   skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Socket.io'] },
  { category: 'Tools',     skills: ['Git', 'Docker', 'Vite', 'Prisma', 'Figma'] },
];

const SEED_JOURNEY: JourneyItem[] = [
  { year: '2022', title: 'First lines of code', description: 'Started with C and algorithms. Fell in love with how logic maps to real-world problems.' },
  { year: '2023', title: 'Web takes over', description: 'Discovered React and Node.js. Built my first full-stack app — a habit tracker that started as a todo list.' },
  { year: '2024', title: 'Real projects', description: 'Shipped ClassMate and Souk to production. Learned about scaling, databases, and the gap between tutorials and reality.' },
  { year: '2025', title: 'SaaS & systems', description: 'Deep-diving into SaaS architecture, real-time systems, and clean API design. Open to my next big opportunity.' },
];

const SEED_HERO = {
  firstName: 'Belarbi',
  lastName: 'Soulef',
  role: 'Full-Stack Developer',
  tagline: 'I build real-time web applications and SaaS platforms — clean architecture, thoughtful UI, and code that holds up under pressure.',
  statProjects: '5',
  statYears: '3+',
  statExtra: '∞',
  location: 'Algeria',
};

const SEED_ABOUT = {
  bio1: "I'm a self-taught full-stack developer from Algeria with a strong background in real-time systems and SaaS architecture. I care about writing software that's maintainable, fast, and genuinely useful to the people who use it.",
  bio2: 'My journey started with C and algorithms in 2022 and has since grown into a full toolkit spanning React, Node.js, PostgreSQL, and beyond.',
  bio3: "When I'm not coding, I'm reading about system design, exploring new technologies, or thinking about how to make complex things feel simple.",
  location: 'Algeria 🇩🇿',
  availability: 'Open to full-time & freelance',
  focus: 'Full-Stack · SaaS · Real-time',
  languages: 'Arabic · French · English',
  email: 'contact@belarbisoulef.com',
  github: 'https://github.com/belarbisoulef',
  linkedin: 'https://linkedin.com/in/belarbisoulef',
  instagram: 'https://instagram.com/belarbisoulef',
};

/* ─── Seed hook — only seeds if store is empty ───────────────── */
function useSeedData() {
  const { data, updateData, updateAbout } = usePortfolio();

  useEffect(() => {
    const isEmpty =
      data.projects.length === 0 &&
      data.journey.length === 0 &&
      data.stack.length === 0 &&
      !data.hero.firstName;

    if (isEmpty) {
      // Full seed for new users
      updateData(() => ({
        projects: SEED_PROJECTS,
        journey: SEED_JOURNEY,
        stack: SEED_STACK,
        about: SEED_ABOUT,
        hero: SEED_HERO,
      }));
    } else if (!data.about.github && !data.about.linkedin && !data.about.instagram) {
      // Backfill social links for existing users
      updateAbout({ ...data.about, ...SEED_ABOUT });
    }
  }, []); // run once on mount
}

/* ─── 3D Scene ────────────────────────────────────────────────── */
function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    /* Torus knot */
    const torusGeo = new THREE.TorusKnotGeometry(1.1, 0.38, 180, 20, 2, 3);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xD4789A,
      roughness: 0.3,
      metalness: 0.55,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    /* Wireframe shell */
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xB85A7A, wireframe: true, transparent: true, opacity: 0.18,
    });
    const wireGeo = new THREE.TorusKnotGeometry(1.22, 0.42, 100, 16, 2, 3);
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    /* Particle cloud */
    const pCount = 900;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 2.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xF5C6D6, size: 0.035, transparent: true, opacity: 0.75 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* Lights */
    scene.add(new THREE.AmbientLight(0xfff0f5, 0.7));
    const dir = new THREE.DirectionalLight(0xffe0f0, 1.4);
    dir.position.set(3, 4, 3);
    scene.add(dir);
    const back = new THREE.DirectionalLight(0xb85a7a, 0.5);
    back.position.set(-4, -2, -3);
    scene.add(back);

    /* Mouse parallax */
    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    /* Resize */
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* Animate */
    let rafId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      torus.rotation.x = t * 0.18 + my * 0.2;
      torus.rotation.y = t * 0.26 + mx * 0.2;
      wire.rotation.x  = -t * 0.12;
      wire.rotation.y  =  t * 0.19;
      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.02;
      camera.position.x = mx * 0.4;
      camera.position.y = -my * 0.3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      torusGeo.dispose(); torusMat.dispose();
      wireGeo.dispose(); wireMat.dispose();
      pGeo.dispose(); pMat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

/* ─── Scroll-reveal wrapper ───────────────────────────────────── */
function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────── */
function Sec({ id, children, bg = C.cream, label }: { id: string; children: React.ReactNode; bg?: string; label?: string }) {
  return (
    <section
      id={id}
      aria-label={label}
      style={{ background: bg, scrollMarginTop: 80, padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

/* ─── Section heading ─────────────────────────────────────────── */
function Heading({ eyebrow, title, desc, center }: { eyebrow?: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div style={{ marginBottom: 56, textAlign: center ? 'center' : 'left' }}>
      {eyebrow && (
        <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: C.rose,
          textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 12 }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{ fontFamily: 'Playfair Display,Georgia,serif',
        fontSize: 'clamp(2rem,5vw,3rem)', color: C.charcoal, lineHeight: 1.1, margin: '0 0 14px' }}>
        {title}
      </h2>
      {desc && <p style={{ color: C.slate, maxWidth: 520, lineHeight: 1.72 }}>{desc}</p>}
    </div>
  );
}

/* ─── Primary button ──────────────────────────────────────────── */
function PrimaryBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '13px 28px', borderRadius: 50,
        background: disabled ? C.roseMist : `linear-gradient(135deg, ${C.roseDeep}, ${C.rose})`,
        color: 'white', border: 'none',
        fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '0.88rem', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 10px 32px rgba(184,90,122,0.42)`; } }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '13px 28px', borderRadius: 50,
      background: 'transparent', color: C.slate,
      border: `1px solid ${C.roseMist}`,
      fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '0.88rem', fontWeight: 500,
      cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.rose; (e.currentTarget as HTMLButtonElement).style.color = C.roseDeep; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.roseMist; (e.currentTarget as HTMLButtonElement).style.color = C.slate; }}>
      {children}
    </button>
  );
}

/* ─── Social icons ───────────────────────────────────────────── */
// Instagram SVG inline (not in lucide)
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function SocialLinks({ github, linkedin, instagram, size = 18 }: { github?: string; linkedin?: string; instagram?: string; size?: number }) {
  const links = [
    github    && { href: github,    icon: <Github size={size} />,       label: 'GitHub' },
    linkedin  && { href: linkedin,  icon: <LinkedInIcon size={size} />,  label: 'LinkedIn' },
    instagram && { href: instagram, icon: <InstagramIcon size={size} />, label: 'Instagram' },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; label: string }[];

  if (links.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      {links.map(({ href, icon, label }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            border: `1px solid ${C.roseMist}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.ash, textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = C.rose;
            (e.currentTarget as HTMLAnchorElement).style.color = C.roseDeep;
            (e.currentTarget as HTMLAnchorElement).style.background = C.petal;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = C.roseMist;
            (e.currentTarget as HTMLAnchorElement).style.color = C.ash;
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
          }}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}


function Navbar3D() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const links = ['about', 'journey', 'projects', 'stack', 'contact'];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.3s, box-shadow 0.3s',
        background: scrolled ? 'rgba(255,248,248,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? `0 1px 0 ${C.petal}` : 'none',
      }}
    >
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => scrollTo('hero')}
          style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.85rem',
            color: C.roseDeep, letterSpacing: '0.15em',
            background: 'none', border: 'none', cursor: 'pointer' }}>
          BS.
        </button>

        {/* Desktop */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {links.map(id => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '0.85rem',
                color: C.slate, background: 'none', border: 'none', cursor: 'pointer',
                textTransform: 'capitalize', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.roseDeep)}
              onMouseLeave={e => (e.currentTarget.style.color = C.slate)}>
              {id}
            </button>
          ))}
          <button onClick={() => scrollTo('contact')}
            style={{
              padding: '8px 20px', borderRadius: 50,
              background: C.roseDeep, color: '#fff', border: 'none',
              fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '0.78rem',
              fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = C.rose)}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = C.roseDeep)}>
            Hire me
          </button>
          <a
            href="/dashboard"
            style={{
              padding: '7px 16px', borderRadius: 50,
              border: `1px solid ${C.roseMist}`,
              color: C.ash, fontSize: '0.72rem',
              fontFamily: 'DM Mono,monospace',
              textDecoration: 'none', transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = C.roseDeep; (e.currentTarget as HTMLAnchorElement).style.borderColor = C.rose; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = C.ash; (e.currentTarget as HTMLAnchorElement).style.borderColor = C.roseMist; }}>
            Admin
          </a>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'rgba(255,248,248,0.98)', borderTop: `1px solid ${C.petal}`, padding: '12px 24px 20px' }}>
          {links.map(id => (
            <button key={id} onClick={() => scrollTo(id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 0',
                fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '0.9rem',
                color: C.slate, background: 'none', border: 'none', cursor: 'pointer' }}>
              {id}
            </button>
          ))}
        </div>
      )}
    </motion.header>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function Hero3D() {
  const { data } = usePortfolio();
  const hero = data.hero;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const bShape = hero.avatarBorderShape || 'blob';
  const bWidth = hero.avatarBorderWidth || 'medium';
  const bColor = hero.avatarBorderColor || 'gradient';

  const frameRadius = 
    bShape === 'circle' ? '50%' :
    bShape === 'rounded' ? '24px' :
    bShape === 'square' ? '0px' :
    '40% 60% 55% 45% / 45% 40% 60% 55%';

  const imgRadius = 
    bShape === 'circle' ? '50%' :
    bShape === 'rounded' ? '20px' :
    bShape === 'square' ? '0px' :
    '38% 58% 53% 43% / 43% 38% 58% 53%';

  const framePadding = 
    bWidth === 'none' ? 0 :
    bWidth === 'thin' ? 3 :
    bWidth === 'thick' ? 12 :
    6; // medium

  const frameBg = 
    bColor === 'charcoal' ? C.charcoal :
    bColor === 'rose' ? C.rose :
    bColor === 'white' ? '#FFFFFF' :
    bColor === 'gold' ? 'linear-gradient(145deg, #FFE082, #FFB300)' :
    `linear-gradient(140deg, ${C.petal}, ${C.roseMist}, ${C.roseSoft})`;

  return (
    <section id="hero" style={{
      minHeight: '100vh', background: C.cream,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      padding: '0', position: 'relative', overflow: 'hidden',
    }}>

      {/* ── LEFT: Text content ──────────────────────────────────── */}
      <div style={{ padding: '120px 48px 80px 48px', position: 'relative', zIndex: 2 }}>

        {/* Status badges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}>
          {hero.location && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 50,
              border: `1px solid ${C.roseMist}`, color: C.slate,
              fontSize: '0.72rem', fontFamily: 'Plus Jakarta Sans,sans-serif',
            }}>
              <MapPin style={{ width: 11, height: 11 }} /> {hero.location}
            </span>
          )}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 50,
            border: `1px solid ${C.roseSoft}`, background: C.petal,
            color: C.roseDeep, fontSize: '0.72rem',
            fontFamily: 'Plus Jakarta Sans,sans-serif',
          }}>
            <Circle style={{ width: 9, height: 9, fill: C.rose }} /> Open to work
          </span>
        </motion.div>

        {/* Role label */}
        {hero.role && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: C.rose,
              textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 16 }}>
            {hero.role}
          </motion.p>
        )}

        {/* Name */}
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
          style={{ fontFamily: 'Playfair Display,Georgia,serif',
            fontSize: 'clamp(3rem,7vw,5.5rem)', color: C.charcoal,
            lineHeight: 1.05, marginBottom: 20 }}>
          {hero.firstName}
          {hero.firstName && hero.lastName && <br />}
          <em style={{ color: C.rose, fontStyle: 'normal' }}>{hero.lastName}{hero.lastName ? '.' : ''}</em>
        </motion.h1>

        {/* Tagline */}
        {hero.tagline && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
            style={{ color: C.slate, fontSize: '1rem', maxWidth: 440,
              lineHeight: 1.75, fontWeight: 300, marginBottom: 36 }}>
            {hero.tagline}
          </motion.p>
        )}

        {/* CTAs + Social */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <PrimaryBtn onClick={() => scrollTo('projects')}>
              View my work <ArrowUpRight style={{ width: 15, height: 15 }} />
            </PrimaryBtn>
            <OutlineBtn>Download CV</OutlineBtn>
          </div>
          <SocialLinks github={data.about.github} linkedin={data.about.linkedin} instagram={data.about.instagram} />
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.0 }}
          style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${C.petal}`,
            display: 'flex', gap: 40 }}>
          {[
            { val: hero.statProjects || '0', label: 'Projects shipped' },
            { val: hero.statYears    || '0', label: 'Years building' },
            { val: hero.statExtra   || '∞', label: 'Curiosity' },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontFamily: 'Playfair Display,Georgia,serif',
                fontSize: '2.2rem', color: C.charcoal, margin: 0 }}>{s.val}</p>
              <p style={{ fontSize: '0.68rem', color: C.ash, marginTop: 3 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT: Profile photo ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'relative', height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs behind the photo */}
        <div style={{
          position: 'absolute', top: '10%', right: '-10%',
          width: 380, height: 380, borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
          background: `radial-gradient(circle, ${C.petal} 0%, transparent 70%)`,
          opacity: 0.7, zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '5%',
          width: 240, height: 240, borderRadius: '50%',
          background: `radial-gradient(circle, ${C.roseMist} 0%, transparent 70%)`,
          opacity: 0.5, zIndex: 0,
        }} />

        {/* The photo itself */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1,
        }}>
          {/* Outer soft frame */}
          <div style={{
            width: '72%', maxWidth: 380,
            aspectRatio: '3/4',
            borderRadius: frameRadius,
            padding: framePadding,
            background: frameBg,
            boxShadow: `0 32px 80px rgba(184,90,122,0.25), 0 8px 24px rgba(212,120,154,0.15)`,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <img
              src={hero.avatarUrl || '/profile.jpg'}
              alt={`${hero.firstName || ''} ${hero.lastName || ''}`}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 10%',
                borderRadius: imgRadius,
                display: 'block',
              }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Fade left edge so text side blends into photo side */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '30%', zIndex: 2,
          background: `linear-gradient(to right, ${C.cream}, transparent)`,
          pointerEvents: 'none',
        }} />
      </motion.div>

      {/* Scroll hint */}
      <motion.button onClick={() => scrollTo('about')}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.roseMist, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          zIndex: 10,
        }}
        aria-label="Scroll down"
      >
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem',
          letterSpacing: '0.2em', textTransform: 'uppercase' }}>scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ChevronDown style={{ width: 16, height: 16 }} />
        </motion.div>
      </motion.button>
    </section>
  );
}

/* ─── ABOUT ───────────────────────────────────────────────────── */
function About3D() {
  const { data } = usePortfolio();
  const a = data.about;
  const hasBio = a.bio1 || a.bio2 || a.bio3;

  const details = [
    a.location     && { dt: 'Location',     dd: a.location },
    a.availability && { dt: 'Availability', dd: a.availability },
    a.focus        && { dt: 'Focus',        dd: a.focus },
    a.languages    && { dt: 'Languages',    dd: a.languages },
    a.email        && { dt: 'Email',        dd: a.email },
  ].filter(Boolean) as { dt: string; dd: string }[];

  return (
    <Sec id="about" bg={C.blush} label="About me">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 56, alignItems: 'center' }}>
        <div>
          <Reveal><Heading eyebrow="Who I am" title="Passionate about building things that work." /></Reveal>
          {hasBio ? (
            [a.bio1, a.bio2, a.bio3].filter(Boolean).map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p style={{ color: C.slate, lineHeight: 1.78, marginBottom: 16 }}>{p}</p>
              </Reveal>
            ))
          ) : (
            <p style={{ color: C.ash, fontStyle: 'italic', fontSize: '0.9rem' }}>
              Add your bio in the <a href="/dashboard" style={{ color: C.rose }}>Dashboard</a>.
            </p>
          )}
          <Reveal delay={0.25}>
            <SocialLinks github={a.github} linkedin={a.linkedin} instagram={a.instagram} size={20} />
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div style={{
            background: C.cream, borderRadius: 24, overflow: 'hidden',
            border: `1px solid ${C.petal}`,
            boxShadow: `0 24px 64px rgba(212,120,154,0.1), 0 4px 16px rgba(212,120,154,0.06)`,
          }}>
            {/* Header / Name badge without picture */}
            <div style={{
              padding: '28px 28px 20px',
              borderBottom: `1px solid ${C.petal}`,
              background: `linear-gradient(to bottom, ${C.petal} 0%, transparent 100%)`,
            }}>
              <p style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '1.25rem', color: C.charcoal, margin: 0 }}>Belarbi Soulef</p>
              <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', color: C.rose, textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: 4 }}>Full-Stack Developer</p>
            </div>

            {/* Details */}
            <div style={{ padding: '24px 28px 28px' }}>
              {details.length > 0 ? (
                <dl style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {details.map(({ dt, dd }) => (
                    <div key={dt} style={{ display: 'flex', gap: 20 }}>
                      <dt style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem',
                        color: C.rose, textTransform: 'uppercase', letterSpacing: '0.15em',
                        minWidth: 96, paddingTop: 2 }}>{dt}</dt>
                      <dd style={{ color: C.charcoal, fontSize: '0.9rem', margin: 0 }}>{dd}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p style={{ color: C.ash, fontSize: '0.85rem', textAlign: 'center', padding: '12px 0', fontStyle: 'italic' }}>
                  Add your details in the Dashboard.
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </Sec>
  );
}

/* ─── JOURNEY ─────────────────────────────────────────────────── */
function Journey3D() {
  const { data } = usePortfolio();
  const journey = data.journey;

  return (
    <Sec id="journey" bg={C.cream} label="My journey">
      <Reveal>
        <Heading eyebrow="How I got here" title="My journey."
          desc="From algorithms on a whiteboard to shipping real products — years of deliberate learning." />
      </Reveal>

      {journey.length === 0 ? (
        <p style={{ color: C.ash, fontStyle: 'italic', fontSize: '0.9rem' }}>
          No journey items yet. Add them in the <a href="/dashboard" style={{ color: C.rose }}>Dashboard</a>.
        </p>
      ) : (
        <div style={{ position: 'relative', maxWidth: 660 }}>
          <div style={{
            position: 'absolute', left: 27, top: 8, bottom: 8, width: 1,
            background: `linear-gradient(to bottom, ${C.petal}, ${C.roseMist}, ${C.petal})`,
          }} />
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {journey.map((item, i) => (
              <li key={item.year} style={{ display: 'flex', gap: 32, paddingBottom: i < journey.length - 1 ? 48 : 0 }}>
                <Reveal delay={i * 0.1} y={16}>
                  <div style={{ width: 54, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      width: 54, height: 54, borderRadius: '50%',
                      background: C.petal, border: `2px solid ${C.roseMist}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative', zIndex: 1,
                      boxShadow: `0 4px 16px rgba(212,120,154,0.18)`,
                    }}>
                      <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.68rem', fontWeight: 600, color: C.roseDeep }}>
                        {item.year}
                      </span>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={i * 0.1 + 0.06}>
                  <div style={{ paddingTop: 12 }}>
                    <h3 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '1.2rem', color: C.charcoal, marginBottom: 8 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: C.slate, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{item.description}</p>
                    {i === journey.length - 1 && (
                      <span style={{ display: 'inline-block', marginTop: 10,
                        fontFamily: 'DM Mono,monospace', fontSize: '0.65rem',
                        color: C.rose, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                        Currently here
                      </span>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Sec>
  );
}

/* ─── PROJECT CARD ────────────────────────────────────────────── */
function ProjectCard({ project: p, expanded, onExpand }: { project: Project; expanded: boolean; onExpand: () => void }) {
  const gradients: Record<string, string> = {
    'SaaS':       `linear-gradient(135deg, ${C.petal} 0%, ${C.roseMist} 100%)`,
    'E-commerce': `linear-gradient(135deg, ${C.roseMist} 0%, ${C.roseSoft} 100%)`,
    'Tool':       `linear-gradient(135deg, ${C.petal} 0%, #D4789A55 100%)`,
  };
  const grad = gradients[p.category] ?? `linear-gradient(135deg, ${C.blush} 0%, ${C.roseMist} 100%)`;

  return (
    <div
      style={{
        background: 'white', borderRadius: 20, overflow: 'hidden',
        border: `1px solid ${C.petal}`,
        boxShadow: '0 4px 24px rgba(212,120,154,0.08)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 18px 52px rgba(212,120,154,0.18)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(212,120,154,0.08)'; }}
    >
      {/* Thumbnail */}
      <div style={{ height: 160, background: grad, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {p.thumbnail && (p.thumbnail.startsWith('http') || p.thumbnail.startsWith('data:') || p.thumbnail.includes('/') || p.thumbnail.includes('.')) ? (
          <img
            src={p.thumbnail}
            alt={p.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <>
            <div style={{ width: 80, height: 80, borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', background: 'rgba(255,255,255,0.4)', position: 'absolute', right: 20, bottom: -20, transform: 'rotate(45deg)' }} />
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', position: 'absolute', left: 24, top: 16 }} />
            <span style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '2.2rem', color: C.roseDeep, opacity: 0.5, position: 'relative', zIndex: 1, fontStyle: 'italic' }}>
              {p.title[0]}
            </span>
          </>
        )}
        {p.featured && (
          <span style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', borderRadius: 50, background: C.roseDeep, color: 'white', fontSize: '0.6rem', fontFamily: 'DM Mono,monospace', letterSpacing: '0.1em', textTransform: 'uppercase', zIndex: 2 }}>
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '1.2rem', color: C.charcoal, margin: '0 0 6px' }}>
              {p.title}
            </h3>
            <span style={{ padding: '2px 10px', borderRadius: 50, border: `1px solid ${C.roseMist}`, color: C.rose, fontSize: '0.7rem', fontFamily: 'DM Mono,monospace' }}>
              {p.category}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {p.githubUrl && p.githubUrl !== '#' && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.ash, transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.roseDeep)}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.ash)}>
                <Github style={{ width: 16, height: 16 }} />
              </a>
            )}
            {p.liveUrl && p.liveUrl !== '#' && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: C.ash, transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.roseDeep)}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.ash)}>
                <ExternalLink style={{ width: 16, height: 16 }} />
              </a>
            )}
          </div>
        </div>

        <p style={{ color: C.slate, fontSize: '0.85rem', lineHeight: 1.65, marginBottom: 14 }}>{p.description}</p>

        {/* Tech chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {p.techStack.slice(0, 5).map(t => (
            <span key={t} style={{ padding: '3px 9px', borderRadius: 6, background: C.petal, color: C.roseDeep, fontSize: '0.68rem', fontFamily: 'DM Mono,monospace' }}>{t}</span>
          ))}
          {p.techStack.length > 5 && (
            <span style={{ padding: '3px 9px', borderRadius: 6, background: C.petal, color: C.ash, fontSize: '0.68rem', fontFamily: 'DM Mono,monospace' }}>
              +{p.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Highlights */}
        {p.highlights.length > 0 && (
          <>
            <button onClick={onExpand} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.rose, fontSize: '0.75rem', fontWeight: 600, padding: 0, transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = C.roseDeep)}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = C.rose)}>
              {expanded ? 'Hide details ↑' : 'View highlights ↓'}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden', listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
                  {p.highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.78rem', color: C.slate, marginBottom: 6 }}>
                      <span style={{ color: C.rose, flexShrink: 0 }}>→</span>
                      {h}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── PROJECTS ────────────────────────────────────────────────── */
function Projects3D() {
  const { data } = usePortfolio();
  const projects = data.projects;
  const [cat, setCat] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const cats = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filtered = cat === 'All' ? projects : projects.filter(p => p.category === cat);

  return (
    <Sec id="projects" bg={C.blush} label="Projects">
      <Reveal>
        <Heading eyebrow="What I've built" title="Projects."
          desc={projects.length === 0 ? 'No projects yet.' : `${projects.length} project${projects.length !== 1 ? 's' : ''} across full-stack web, SaaS, and real-time systems.`} />
      </Reveal>

      {projects.length === 0 ? (
        <p style={{ color: C.ash, fontStyle: 'italic' }}>
          Add projects in the <a href="/dashboard" style={{ color: C.rose }}>Dashboard</a>.
        </p>
      ) : (
        <>
          {/* Filter pills */}
          <Reveal delay={0.1}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: '8px 18px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 500,
                  border: `1px solid ${cat === c ? C.roseDeep : C.roseMist}`,
                  background: cat === c ? C.roseDeep : 'white',
                  color: cat === c ? 'white' : C.slate,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>{c}</button>
              ))}
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div key={cat} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.09}>
                  <ProjectCard
                    project={p}
                    expanded={expanded === p.id}
                    onExpand={() => setExpanded(expanded === p.id ? null : p.id)}
                  />
                </Reveal>
              ))}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </Sec>
  );
}

/* ─── STACK ───────────────────────────────────────────────────── */
function Stack3D() {
  const { data } = usePortfolio();
  const stack = data.stack;

  return (
    <Sec id="stack" bg={C.cream} label="Tech stack">
      <Reveal>
        <Heading eyebrow="The tools I use" title="My stack."
          desc="Technologies I reach for when building production software." />
      </Reveal>

      {stack.length === 0 ? (
        <p style={{ color: C.ash, fontStyle: 'italic' }}>
          Add your skills in the <a href="/dashboard" style={{ color: C.rose }}>Dashboard</a>.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
          {stack.map((group, i) => (
            <Reveal key={group.category} delay={i * 0.1}>
              <div style={{ background: C.blush, borderRadius: 20, padding: 24, border: `1px solid ${C.petal}` }}>
                <h3 style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.68rem', color: C.rose,
                  textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 20, margin: '0 0 18px' }}>
                  {group.category}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {group.skills.map(s => (
                    <span key={s} style={{
                      padding: '6px 14px', borderRadius: 50,
                      background: 'white', color: C.charcoal, fontSize: '0.8rem',
                      border: `1px solid ${C.petal}`, transition: 'border-color 0.2s',
                    }}
                      onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.borderColor = C.roseMist)}
                      onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.borderColor = C.petal)}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Sec>
  );
}

/* ─── CONTACT ─────────────────────────────────────────────────── */
interface FormFields { name: string; email: string; subject: string; message: string; }
interface FormErrors { name?: string; email?: string; subject?: string; message?: string; }

function Contact3D() {
  const [fields, setFields] = useState<FormFields>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!fields.name.trim()) e.name = 'Name is required.';
    if (!fields.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email.';
    if (!fields.subject.trim()) e.subject = 'Subject is required.';
    if (!fields.message.trim()) e.message = 'Message is required.';
    else if (fields.message.trim().length < 20) e.message = 'At least 20 characters.';
    return e;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    addMessage({ name: fields.name.trim(), email: fields.email.trim(), subject: fields.subject.trim(), message: fields.message.trim() });
    setSending(false);
    setSent(true);
  };

  const inputBase = (err?: string): React.CSSProperties => ({
    width: '100%', padding: '10px 14px', borderRadius: 12,
    border: `1.5px solid ${err ? '#e05575' : C.petal}`,
    fontSize: '0.84rem', color: C.charcoal, outline: 'none',
    fontFamily: 'Plus Jakarta Sans,sans-serif',
    background: 'white', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  });

  return (
    <Sec id="contact" bg={C.blush} label="Contact">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 56, alignItems: 'flex-start' }}>
        <div>
          <Reveal>
            <Heading eyebrow="Get in touch" title="Let's work together."
              desc="Open to full-time roles, freelance projects, and interesting collaborations. Reach out and I'll reply within 24 hours." />
          </Reveal>
          <Reveal delay={0.1}>
            <a href="mailto:contact@belarbisoulef.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: C.charcoal, fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.roseDeep)}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.charcoal)}>
              <Mail style={{ width: 16, height: 16, color: C.rose }} />
              contact@belarbisoulef.com
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div style={{ background: 'white', borderRadius: 24, padding: 32, border: `1px solid ${C.petal}`, boxShadow: '0 8px 40px rgba(212,120,154,0.08)' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircle style={{ width: 48, height: 48, color: C.rose, margin: '0 auto 16px', display: 'block' }} />
                <h3 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '1.5rem', color: C.charcoal, margin: '0 0 8px' }}>Message sent!</h3>
                <p style={{ color: C.slate, fontSize: '0.9rem', marginBottom: 20 }}>Thanks for reaching out. I'll reply within 24 hours.</p>
                <button onClick={() => { setSent(false); setFields({ name: '', email: '', subject: '', message: '' }); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.rose, fontSize: '0.8rem' }}>
                  Send another
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {(['name', 'email'] as const).map(k => (
                    <div key={k}>
                      <label style={{ display: 'block', fontSize: '0.65rem', fontFamily: 'DM Mono,monospace', color: C.rose, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>
                        {k}
                      </label>
                      <input id={k} type={k === 'email' ? 'email' : 'text'} placeholder={k === 'name' ? 'Your name' : 'you@example.com'}
                        value={fields[k]} onChange={update(k)} style={inputBase(errors[k])}
                        onFocus={e => (e.currentTarget.style.borderColor = errors[k] ? '#e05575' : C.rose)}
                        onBlur={e => (e.currentTarget.style.borderColor = errors[k] ? '#e05575' : C.petal)}
                      />
                      {errors[k] && <p style={{ fontSize: '0.72rem', color: '#e05575', marginTop: 3 }}>{errors[k]}</p>}
                    </div>
                  ))}
                </div>
                {(['subject', 'message'] as const).map(k => (
                  <div key={k}>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontFamily: 'DM Mono,monospace', color: C.rose, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>
                      {k}
                    </label>
                    {k === 'message' ? (
                      <textarea id={k} rows={5} placeholder="Tell me about your project..."
                        value={fields[k]} onChange={update(k)}
                        style={{ ...inputBase(errors[k]), resize: 'none' }}
                        onFocus={e => (e.currentTarget.style.borderColor = errors[k] ? '#e05575' : C.rose)}
                        onBlur={e => (e.currentTarget.style.borderColor = errors[k] ? '#e05575' : C.petal)}
                      />
                    ) : (
                      <input id={k} placeholder="What's this about?" value={fields[k]} onChange={update(k)}
                        style={inputBase(errors[k])}
                        onFocus={e => (e.currentTarget.style.borderColor = errors[k] ? '#e05575' : C.rose)}
                        onBlur={e => (e.currentTarget.style.borderColor = errors[k] ? '#e05575' : C.petal)}
                      />
                    )}
                    {errors[k] && <p style={{ fontSize: '0.72rem', color: '#e05575', marginTop: 3 }}>{errors[k]}</p>}
                  </div>
                ))}
                <PrimaryBtn onClick={submit} disabled={sending}>
                  {sending ? (
                    <>
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                        style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }} />
                      Sending…
                    </>
                  ) : (
                    <><Send style={{ width: 14, height: 14 }} /> Send message</>
                  )}
                </PrimaryBtn>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </Sec>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function Footer3D() {
  const { data } = usePortfolio();
  const a = data.about;
  return (
    <footer style={{ borderTop: `1px solid ${C.petal}`, background: C.cream, padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.85rem', color: C.roseDeep }}>BS.</span>
        <p style={{ fontSize: '0.75rem', color: C.ash, margin: 0 }}>
          Designed &amp; built by Belarbi Soulef · {new Date().getFullYear()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <SocialLinks github={a.github} linkedin={a.linkedin} instagram={a.instagram} size={15} />
          <p style={{ fontSize: '0.75rem', color: C.ash, margin: 0 }}>React · TypeScript · Three.js</p>
          <a href="/dashboard" style={{ fontSize: '0.72rem', color: C.mist, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.ash)}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.mist)}>
            Dashboard
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT EXPORT ─────────────────────────────────────────────── */
export function Portfolio3D() {
  useSeedData();

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans,system-ui,sans-serif', background: C.cream }}>
      <Navbar3D />
      <main>
        <Hero3D />
        <About3D />
        <Journey3D />
        <Projects3D />
        <Stack3D />
        <Contact3D />
      </main>
      <Footer3D />
    </div>
  );
}
