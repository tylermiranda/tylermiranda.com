import { Desktop } from './Desktop';
import { WelcomeTerminal } from './WelcomeTerminal';
import { AboutContent } from './AboutContent';
import { SkillsContent } from './SkillsContent';
import { ContactContent } from './ContactContent';
import type { WindowId } from '../types/window';

const windowContents: Record<WindowId, React.ReactNode> = {
  welcome: <WelcomeTerminal />,
  about: <AboutContent />,
  projects: <div className="p-4 prose">Projects content coming soon...</div>,
  skills: <SkillsContent />,
  resume: <div className="p-4 prose">Resume content coming soon...</div>,
  contact: <ContactContent />,
};

export function App() {
  return <Desktop windowContents={windowContents} />;
}
