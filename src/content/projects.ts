export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  url?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Project One',
    description: 'A brief description of your first project and what it does.',
    tech: ['TypeScript', 'React', 'Node.js'],
    url: 'https://example.com',
    github: 'https://github.com/tylermiranda/project-1',
  },
  {
    id: 'project-2',
    name: 'Project Two',
    description: 'Another cool project you built.',
    tech: ['Python', 'FastAPI', 'PostgreSQL'],
    github: 'https://github.com/tylermiranda/project-2',
  },
  {
    id: 'project-3',
    name: 'Project Three',
    description: 'Something else impressive.',
    tech: ['Go', 'Docker', 'AWS'],
  },
];
