import { Desktop } from './Desktop';
import { MobileLayout } from './MobileLayout';
import { WelcomeTerminal } from './WelcomeTerminal';
import { AboutContent } from './AboutContent';
import { ProjectsContent } from './ProjectsContent';
import { WorkLogContent } from './WorkLogContent';
import { SkillsContent } from './SkillsContent';
import { ResumeContent } from './ResumeContent';
import { ContactContent } from './ContactContent';
import { TrashContent } from './TrashContent';
import type { WindowId } from '../types/window';

const windowContents: Record<WindowId, React.ReactNode> = {
  welcome: <WelcomeTerminal />,
  about: <AboutContent />,
  projects: <ProjectsContent />,
  'work-log': <WorkLogContent />,
  skills: <SkillsContent />,
  resume: <ResumeContent />,
  contact: <ContactContent />,
  trash: <TrashContent />,
};

export function App() {
  return (
    <>
      {/* Desktop layout - visible on md screens and up */}
      <div className="hidden md:block">
        <Desktop windowContents={windowContents} />
      </div>
      {/* Mobile layout - visible on screens smaller than md */}
      <div className="md:hidden">
        <MobileLayout windowContents={windowContents} />
      </div>
    </>
  );
}
