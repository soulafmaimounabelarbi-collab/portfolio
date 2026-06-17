export interface SkillGroup {
  category: string;
  skills: string[];
}

export const stack: SkillGroup[] = [
  {
    category: 'Frontend',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'Python', 'Django', 'PHP', 'REST APIs'],
  },
  {
    category: 'Database',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Redis'],
  },
  {
    category: 'Tools & Ops',
    skills: ['Git', 'Docker', 'Vite', 'Linux', 'Postman', 'Figma'],
  },
  {
    category: 'Concepts',
    skills: ['WebSockets', 'JWT Auth', 'Row-Level Security', 'REST', 'MVC', 'Clean Architecture'],
  },
];
