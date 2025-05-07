
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
  views?: string; // Optional: e.g., "1.2M"
  isPinned?: boolean; // Optional
}

export interface ProfileData {
  name: string;
  username: string;
  avatarUrl: string;
  bio: string; // New field for profile description
  stats: {
    age?: number; // Made optional as it's not in the new design
    nationality?: string; // Made optional
    specialty?: string; // Made optional
    following: number | string; // New: e.g., 120 or "120"
    followers: string; // New: e.g., "1.5M"
    likes: string; // New: e.g., "10.2M"
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

