import type { ProfileData, Project, HomePageSection, Technology } from './types';
import React from 'react'; // Import React for JSX
import Image from '@/components/ui/image';
import ReactIcon from '@/icons/ReactIcon';
import NextjsIcon from '@/icons/NextjsIcon';
import TailwindIcon from '@/icons/TailwindIcon';
import NodejsIcon from '@/icons/NodejsIcon';
import JavaScriptIcon from '@/icons/JavaScriptIcon';
import TypeScriptIcon from '@/icons/TypeScriptIcon';
import HtmlIcon from '@/icons/HtmlIcon';
import CssIcon from '@/icons/CssIcon';
import { Briefcase, MessageSquare, TrendingUp } from 'lucide-react';
import Timeline from '@/components/ui/timeline'; // Import the new Timeline component

const technologies: Record<string, Technology> = {
  react: { name: 'React', icon: ReactIcon },
  nextjs: { name: 'Next.js', icon: NextjsIcon },
  tailwind: { name: 'Tailwind CSS', icon: TailwindIcon },
  nodejs: { name: 'Node.js', icon: NodejsIcon },
  javascript: { name: 'JavaScript', icon: JavaScriptIcon },
  typescript: { name: 'TypeScript', icon: TypeScriptIcon },
  html: { name: 'HTML5', icon: HtmlIcon },
  css: { name: 'CSS3', icon: CssIcon },
};

export const projectsData: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform',
    shortDescription: 'A full-stack e-commerce solution with modern features.',
    longDescription: 'Developed a comprehensive e-commerce platform enabling users to browse products, add to cart, and complete purchases. Features include user authentication, product management, order processing, and a responsive design for optimal viewing on all devices. Integrated with Stripe for payments.',
    imageUrl: 'https://picsum.photos/seed/project1/600/800',
    technologies: [technologies.react, technologies.nextjs, technologies.tailwind, technologies.nodejs, technologies.typescript],
    duration: '3 Months',
    collaborators: ['Jane Doe (Designer)', 'Mike Ross (Backend Dev)'],
    liveLink: '#',
    repoLink: '#',
  },
  {
    id: 'project-2',
    title: 'Social Media App',
    shortDescription: 'A social networking app focused on photo sharing.',
    longDescription: 'Built a social media application allowing users to create profiles, upload photos, follow other users, and interact with posts through likes and comments. Implemented real-time notifications and a feed algorithm. Focused on a clean UI/UX and performance.',
    imageUrl: 'https://picsum.photos/seed/project2/600/800',
    technologies: [technologies.react, technologies.nodejs, technologies.javascript],
    duration: '4 Months',
    liveLink: '#',
  },
  {
    id: 'project-3',
    title: 'Portfolio Website',
    shortDescription: 'This very portfolio website, built with Next.js and Tailwind CSS.',
    longDescription: 'Designed and developed this portfolio website to showcase my skills and projects. It features a TikTok-inspired UI, responsive design, and interactive elements. The goal was to create a unique and engaging way to present my work.',
    imageUrl: 'https://picsum.photos/seed/project3/600/800',
    technologies: [technologies.nextjs, technologies.react, technologies.tailwind, technologies.typescript],
    duration: '1 Month',
    collaborators: ['Self-directed'],
    repoLink: '#',
  },
];

export const profileData: ProfileData = {
  name: 'Juan Cruz Dillon',
  username: 'juancruzdillon',
  avatarUrl: 'https://picsum.photos/seed/profileavatar/200/200',
  stats: {
    age: 25,
    nationality: 'Argentina',
    specialty: 'Front End',
  },
  projects: projectsData,
};

// Experience items should be in REVERSE chronological order (newest first)
// The Timeline component will reverse it for display (oldest first on left)
const experienceItems = [
  {
    date: "2021 - Present",
    title: "Frontend Developer",
    company: "Tech Solutions Inc.",
    description: "Spearheading the development of dynamic user interfaces and enhancing application performance with modern frameworks. Collaborating with UI/UX teams to translate designs into responsive, high-quality code."
  },
  {
    date: "2019 - 2021",
    title: "Junior Developer",
    company: "Web Wizards Co.",
    description: "Contributed to diverse web development projects, focusing on front-end and back-end tasks. Gained foundational experience in agile methodologies and version control systems."
  },
  {
    date: "2018",
    title: "Intern",
    company: "CodeCrafters",
    description: "Assisted senior developers in various stages of the software development lifecycle. Focused on learning web technologies and contributing to internal tools."
  }
];

export const homePageSectionsData: HomePageSection[] = [
  {
    id: 'about-me',
    type: 'about',
    title: 'About Me',
    content: (
      <React.Fragment>
        <div className="p-4 text-center">
          <div className="w-[150px] h-[150px] mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary shadow-lg relative">
            <Image
              src="https://picsum.photos/seed/aboutmeavatar/150/150"
              alt="Juan Cruz Dillon"
              layout="fill" 
              objectFit="cover"
              containerClassName="w-full h-full"
              imgClassName="rounded-full" // Ensure image itself is rounded if container is
              data-ai-hint="profile avatar"
            />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-white">Hi, I'm Juan Cruz!</h3>
          <p className="text-lg text-white/90">
            A passionate Front End Developer from Argentina, specializing in creating modern and responsive web applications.
            I love turning complex problems into beautiful, intuitive designs.
          </p>
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://picsum.photos/seed/aboutmebg/1080/1920',
  },
  {
    id: 'my-projects',
    type: 'projects',
    title: 'Projects',
    content: (
      <React.Fragment>
       <div className="p-4 text-center">
        <Briefcase className="mx-auto h-16 w-16 mb-4 text-primary" />
        <h3 className="text-2xl font-semibold mb-2 text-white">My Work</h3>
        <p className="text-lg text-white/90">
          Here are some of the projects I've worked on. Click to see more details!
        </p>
      </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://picsum.photos/seed/projectsbg/1080/1920',
  },
  {
    id: 'experience',
    type: 'experience',
    title: 'Experience',
    content: (
      <React.Fragment>
        <div className="p-4 text-center max-w-4xl mx-auto w-full flex flex-col items-center">
          <TrendingUp className="mx-auto h-16 w-16 mb-6 text-primary" />
          <h3 className="text-3xl font-bold mb-2 text-white">Professional Journey</h3>
          <p className="text-sm text-white/70 mb-10">Click on the timeline points to see details.</p>
          <div className="w-full"> {/* Container for the timeline */}
            <Timeline items={experienceItems} />
          </div>
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://picsum.photos/seed/experiencebg/1080/1920',
  },
   {
    id: 'contact-me-section',
    type: 'contact',
    title: 'Contact Me',
    content: (
      <React.Fragment>
        <div className="p-4 text-center">
          <MessageSquare className="mx-auto h-16 w-16 mb-4 text-primary" />
          <h3 className="text-2xl font-semibold mb-2 text-white">Get In Touch</h3>
          <p className="text-lg text-white/90">
            Have a project in mind or just want to say hi? Feel free to reach out! You can use the inbox feature below.
          </p>
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://picsum.photos/seed/contactbg/1080/1920',
  },
];
