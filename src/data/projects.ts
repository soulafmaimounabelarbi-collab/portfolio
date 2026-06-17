import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'dirassa',
    title: 'Dirassa',
    category: 'SaaS',
    description:
      'A real-time educational SaaS platform connecting students and teachers with live classrooms, assignments, and progress tracking built for scale.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'WebSockets', 'JWT Auth', 'Tailwind CSS'],
    thumbnail: 'dirassa',
    liveUrl: '#',
    githubUrl: '#',
    highlights: [
      'Built real-time messaging with WebSockets for zero-latency classroom communication',
      'Implemented JWT refresh-token rotation for secure, session-persistent authentication',
      'Designed scalable PostgreSQL schema with Row-Level Security for multi-tenant isolation',
    ],
    featured: true,
  },
  {
    id: 'taskflow',
    title: 'TaskFlow',
    category: 'Full-Stack',
    description:
      'A collaborative project management tool with drag-and-drop boards, real-time updates, and team analytics dashboards.',
    techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Socket.io', 'Redux Toolkit'],
    thumbnail: 'taskflow',
    liveUrl: '#',
    githubUrl: '#',
    highlights: [
      'Drag-and-drop interface built with native HTML5 DnD API — no external library',
      'Real-time board updates synced across all connected clients via Socket.io rooms',
      'Custom analytics dashboard with Recharts showing team velocity and burn-down metrics',
    ],
  },
  {
    id: 'shopwave',
    title: 'ShopWave',
    category: 'Web App',
    description:
      'A full-featured e-commerce storefront with dynamic product filtering, cart management, payment integration, and an admin dashboard.',
    techStack: ['React', 'Django', 'Python', 'PostgreSQL', 'Stripe API', 'Tailwind CSS'],
    thumbnail: 'shopwave',
    liveUrl: '#',
    githubUrl: '#',
    highlights: [
      'Stripe webhook integration handling payment events with idempotency keys',
      'Server-side pagination and filtering with Django REST Framework for fast product queries',
      'Role-based admin dashboard for inventory, order, and customer management',
    ],
  },
  {
    id: 'devlog',
    title: 'DevLog',
    category: 'Full-Stack',
    description:
      'A developer-focused blog and knowledge-base platform with Markdown support, syntax highlighting, and a clean reading experience.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Marked.js'],
    thumbnail: 'devlog',
    liveUrl: '#',
    githubUrl: '#',
    highlights: [
      'Custom Markdown parser pipeline with Prism.js syntax highlighting for 20+ languages',
      'Full-text search using MySQL FULLTEXT indexes — no external search engine needed',
      'Progressive image loading with blur-up placeholders for fast perceived performance',
    ],
  },
  {
    id: 'weathermap',
    title: 'WeatherMap',
    category: 'Web App',
    description:
      'An interactive weather visualization app with geolocation, 7-day forecasts, animated weather maps, and historical data charts.',
    techStack: ['React', 'TypeScript', 'OpenWeather API', 'Leaflet.js', 'Chart.js', 'CSS Modules'],
    thumbnail: 'weathermap',
    liveUrl: '#',
    githubUrl: '#',
    highlights: [
      'Animated rain/wind overlay tiles on a Leaflet map using OpenWeather tile API',
      'Geolocation-first UX with graceful fallback to manual city search',
      'Historical 30-day temperature chart built with Chart.js for trend analysis',
    ],
  },
];
