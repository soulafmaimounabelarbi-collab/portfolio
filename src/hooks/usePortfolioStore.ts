import { useState, useEffect, useCallback } from 'react';
import type { Project, JourneyItem } from '../types';
import { stack as seedStack } from '../data/stack';
import type { SkillGroup } from '../data/stack';
import { projects as seedProjects } from '../data/projects';
import { journey as seedJourney } from '../data/journey';

export interface AboutInfo {
  bio1: string;
  bio2: string;
  bio3: string;
  location: string;
  availability: string;
  focus: string;
  languages: string;
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
}

export interface HeroInfo {
  firstName: string;
  lastName: string;
  role: string;
  tagline: string;
  statProjects: string;
  statYears: string;
  statExtra: string;
  location: string;
  avatarUrl?: string;
  avatarBorderShape?: string;
  avatarBorderColor?: string;
  avatarBorderWidth?: string;
}

// ─── Messages ─────────────────────────────────────────────────
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string; // ISO string
  read: boolean;
  reply?: string;
  repliedAt?: string;
}

// ─── Analytics ────────────────────────────────────────────────
export interface DailyVisit {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface AnalyticsData {
  totalVisits: number;
  dailyVisits: DailyVisit[];
  lastVisit: string;
}

export interface PortfolioData {
  projects: Project[];
  journey: JourneyItem[];
  stack: SkillGroup[];
  about: AboutInfo;
  hero: HeroInfo;
}

const STORAGE_KEY = 'portfolio_data';
const MESSAGES_KEY = 'portfolio_messages';
const ANALYTICS_KEY = 'portfolio_analytics';

const DEFAULT_DATA: PortfolioData = {
  projects: seedProjects,
  journey: seedJourney,
  stack: seedStack,
  about: {
    bio1: 'I am a passionate Full-Stack Developer focused on building clean, scalable, and real-time web applications.',
    bio2: 'With a strong background in software engineering fundamentals, I enjoy solving complex logic problems and crafting premium user experiences.',
    bio3: 'When I\'m not coding, I\'m exploring new technologies, contributing to open-source, or learning about system architecture.',
    location: 'Algeria 🇩🇿',
    availability: 'Open to work',
    focus: 'Full-Stack · SaaS · Real-time',
    languages: 'Arabic · French · English',
    email: 'soulef@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  },
  hero: {
    firstName: 'Belarbi',
    lastName: 'Soulef',
    role: 'Full-Stack Developer',
    tagline: 'I build production-ready SaaS platforms and interactive digital experiences with clean, modern code.',
    statProjects: '5',
    statYears: '3+',
    statExtra: '∞',
    location: 'Algeria',
    avatarUrl: '/profile.jpg',
    avatarBorderShape: 'blob',
    avatarBorderColor: 'gradient',
    avatarBorderWidth: 'medium',
  },
};

function loadData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    return {
      projects: parsed.projects ?? [],
      journey: parsed.journey ?? [],
      stack: parsed.stack ?? [],
      about: { ...DEFAULT_DATA.about, ...(parsed.about ?? {}) },
      hero: { ...DEFAULT_DATA.hero, ...(parsed.hero ?? {}) },
    };
  } catch {
    return DEFAULT_DATA;
  }
}

function saveData(data: PortfolioData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.error('Failed to save portfolio data');
  }
}

// ─── Messages helpers ─────────────────────────────────────────
export function loadMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as ContactMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(msgs: ContactMessage[]) {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
  } catch { }
}

export function addMessage(msg: Omit<ContactMessage, 'id' | 'receivedAt' | 'read'>) {
  const msgs = loadMessages();
  const newMsg: ContactMessage = {
    ...msg,
    id: Date.now().toString(),
    receivedAt: new Date().toISOString(),
    read: false,
  };
  saveMessages([newMsg, ...msgs]);
}

// ─── Analytics helpers ────────────────────────────────────────
export function loadAnalytics(): AnalyticsData {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    return raw
      ? (JSON.parse(raw) as AnalyticsData)
      : { totalVisits: 0, dailyVisits: [], lastVisit: '' };
  } catch {
    return { totalVisits: 0, dailyVisits: [], lastVisit: '' };
  }
}

export function recordVisit() {
  const analytics = loadAnalytics();
  const today = new Date().toISOString().split('T')[0];

  // Only count once per session
  const sessionKey = `visited_${today}`;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, '1');

  const existing = analytics.dailyVisits.find((d) => d.date === today);
  const dailyVisits = existing
    ? analytics.dailyVisits.map((d) => (d.date === today ? { ...d, count: d.count + 1 } : d))
    : [...analytics.dailyVisits, { date: today, count: 1 }];

  // Keep last 30 days only
  const sorted = dailyVisits.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);

  const updated: AnalyticsData = {
    totalVisits: analytics.totalVisits + 1,
    dailyVisits: sorted,
    lastVisit: new Date().toISOString(),
  };
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updated));
  } catch { }
}

// ─── Main store hook ──────────────────────────────────────────
export function usePortfolioStore() {
  const [data, setData] = useState<PortfolioData>(loadData);
  const [messages, setMessages] = useState<ContactMessage[]>(loadMessages);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updateData = useCallback((updater: (prev: PortfolioData) => PortfolioData) => {
    setData(updater);
  }, []);

  // ─── Projects ────────────────────────────────────────────────
  const addProject = useCallback((project: Project) => {
    setData((prev) => ({ ...prev, projects: [...prev.projects, project] }));
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  }, []);

  // ─── Journey ─────────────────────────────────────────────────
  const addJourneyItem = useCallback((item: JourneyItem) => {
    setData((prev) => ({
      ...prev,
      journey: [...prev.journey, item].sort((a, b) => a.year.localeCompare(b.year)),
    }));
  }, []);

  const updateJourneyItem = useCallback((year: string, patch: Partial<JourneyItem>) => {
    setData((prev) => ({
      ...prev,
      journey: prev.journey.map((j) => (j.year === year ? { ...j, ...patch } : j)),
    }));
  }, []);

  const deleteJourneyItem = useCallback((year: string) => {
    setData((prev) => ({ ...prev, journey: prev.journey.filter((j) => j.year !== year) }));
  }, []);

  // ─── Stack ───────────────────────────────────────────────────
  const addSkillGroup = useCallback((group: SkillGroup) => {
    setData((prev) => ({ ...prev, stack: [...prev.stack, group] }));
  }, []);

  const updateSkillGroup = useCallback((category: string, patch: Partial<SkillGroup>) => {
    setData((prev) => ({
      ...prev,
      stack: prev.stack.map((s) => (s.category === category ? { ...s, ...patch } : s)),
    }));
  }, []);

  const deleteSkillGroup = useCallback((category: string) => {
    setData((prev) => ({ ...prev, stack: prev.stack.filter((s) => s.category !== category) }));
  }, []);

  // ─── About / Hero ────────────────────────────────────────────
  const updateAbout = useCallback((patch: Partial<AboutInfo>) => {
    setData((prev) => ({ ...prev, about: { ...prev.about, ...patch } }));
  }, []);

  const updateHero = useCallback((patch: Partial<HeroInfo>) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }));
  }, []);

  // ─── Messages ────────────────────────────────────────────────
  const markMessageRead = useCallback((id: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, read: true } : m));
      saveMessages(updated);
      return updated;
    });
  }, []);

  const replyToMessage = useCallback((id: string, reply: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.id === id
          ? { ...m, read: true, reply, repliedAt: new Date().toISOString() }
          : m
      );
      saveMessages(updated);
      return updated;
    });
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveMessages(updated);
      return updated;
    });
  }, []);

  const refreshMessages = useCallback(() => {
    setMessages(loadMessages());
  }, []);

  return {
    data,
    messages,
    updateData,
    refreshMessages,
    // projects
    addProject,
    updateProject,
    deleteProject,
    // journey
    addJourneyItem,
    updateJourneyItem,
    deleteJourneyItem,
    // stack
    addSkillGroup,
    updateSkillGroup,
    deleteSkillGroup,
    // about / hero
    updateAbout,
    updateHero,
    // messages
    markMessageRead,
    replyToMessage,
    deleteMessage,
  };
}
