export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  thumbnail: string;
  liveUrl: string;
  githubUrl: string;
  highlights: string[];
  featured?: boolean;
}

export interface JourneyItem {
  year: string;
  title: string;
  description: string;
}

export interface Skill {
  name: string;
  category: string;
  level: number;
}
