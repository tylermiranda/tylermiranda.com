import { Desktop } from './Desktop';
import { WelcomeTerminal } from './WelcomeTerminal';
import { AboutContent } from './AboutContent';
import { ProjectsContent } from './ProjectsContent';
import { SkillsContent } from './SkillsContent';
import { ResumeContent } from './ResumeContent';
import { ContactContent } from './ContactContent';
import type { WindowId } from '../types/window';

const windowContents: Record<WindowId, React.ReactNode> = {
  welcome: <WelcomeTerminal />,
  about: <AboutContent />,
  projects: <ProjectsContent />,
  skills: <SkillsContent />,
  resume: <ResumeContent />,
  contact: <ContactContent />,
};

export function App() {
  return <Desktop windowContents={windowContents} />;
}
