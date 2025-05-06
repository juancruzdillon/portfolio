
import type { LucideIcon } from 'lucide-react';

export interface Technology {
  name: string;
  icon?: React.ComponentType<{ className?: string }>; // For custom SVG or Lucide icons
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  technologies: Technology[];
  duration: string;
  collaborators?: string[];
  liveLink?: string;
  repoLink?: string;
}

export interface ProfileData {
  name: string;
  username: string;
  avatarUrl: string;
  stats: {
    age: number;
    nationality: string;
    specialty: string;
  };
  projects: Project[];
}

export interface HomePageSection {
  id: string;
  type: 'about' | 'projects' | 'experience' | 'contact';
  title: string;
  content?: React.ReactNode; // For more complex content rendering
  backgroundImageUrl?: string; // Optional background for the section "video"
}
