export interface WindowState {
  id: string;
  title: string;
  route: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  preMaximizeState?: { position: { x: number; y: number }; size: { width: number; height: number } };
}

export type WindowId =
  | 'about'
  | 'projects'
  | 'work-log'
  | 'skills'
  | 'resume'
  | 'contact'
  | 'welcome'
  | 'trash';
