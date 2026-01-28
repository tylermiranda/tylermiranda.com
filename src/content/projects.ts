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
    id: 'optistack',
    name: 'OptiStack',
    description: 'Self-hosted supplement & medication manager for biohackers. AI-powered interaction analysis, smart inventory tracking, timing schedules, and doctor-ready PDF reports.',
    tech: ['JavaScript', 'Docker', 'AI/LLM', 'PWA'],
    github: 'https://github.com/tylermiranda/OptiStack',
  },
  {
    id: 'splitrowr',
    name: 'SplitRowr',
    description: 'iOS companion app for Concept2 rowers with retro LCD aesthetics. Real-time metrics, Ghost Pacer for racing previous performances, Apple Health & Strava sync.',
    tech: ['Swift', 'SwiftUI', 'FTMS', 'HealthKit'],
    url: 'https://splitrowr.app',
  },
  {
    id: 'hooli-phone',
    name: 'Hooli Phone',
    description: 'Parody landing page for the revolutionary Hooli Phone running Nucleus OS. Weissman score: 2.89.',
    tech: ['TypeScript', 'Hono', 'Cloudflare Workers'],
    github: 'https://github.com/tylermiranda/Hooli',
  },
];
