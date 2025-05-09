
import type { ProfileData, Project, HomePageSection, Technology } from './types';
import React from 'react'; // Import React for JSX
import Image from '@/components/ui/image';
import ReactIcon from '@/icons/ReactIcon';
import NextjsIcon from '@/icons/NextjsIcon';
import VuejsIcon from '@/icons/VuejsIcon';
import TailwindIcon from '@/icons/TailwindIcon';
import NodejsIcon from '@/icons/NodejsIcon';
import JavaScriptIcon from '@/icons/JavaScriptIcon';
import TypeScriptIcon from '@/icons/TypeScriptIcon';
import HtmlIcon from '@/icons/HtmlIcon';
import CssIcon from '@/icons/CssIcon';
import { Briefcase, MessageSquare, TrendingUp, Brain, Zap, Lightbulb, Award, Code as CodeIcon, MapPin, Sparkles, UserCircle, Target as TargetIcon } from 'lucide-react';
import Timeline from '@/components/ui/timeline';
import ProjectSlider from '@/components/project/ProjectSlider';
import ContactForm from '@/components/contact/ContactForm';
import MemoTestGame from '@/components/game/MemoTestGame';


const technologies: Record<string, Technology> = {
  react: { name: 'React', icon: ReactIcon },
  vue: { name: 'Vue.js', icon: VuejsIcon },
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
    id: 'tplay-web',
    title: 'Telecentro Web',
    shortDescription: 'Participé en el desarrollo e inovación de la plataforma tplay web',
    longDescription: 'Tplay web es una plataforma de contenido VOD y canales LIVE al estilo netflix, permitiendo ver contenido en vivo, pelis, series, contenido grabado y mucho más!\n Participe en el desarrollo activamente más que nada en el front resolviendo issues de la UI y mejoras que iban surgiendo.',
    imageUrl: 'https://i.ibb.co/KjYPDCZ6/tplay-web.webp', // Adjusted for portrait
    // imageUrlPortrait: 'https://i.ibb.co/MDh3B8HK/default.webp', // default
    imageUrlPortrait: 'https://i.ibb.co/HfYDqjQG/tplay-web-portrait.webp',
    technologies: [technologies.vue, technologies.css, technologies.nodejs, technologies.javascript, technologies.html],
    duration: 'Actual',
    collaborators: ['Equipo ingeniería y desarrollo'],
    liveLink: '',
    repoLink: '',
    isPinned: true,
    views: "0"
  },
];

export const profileData: ProfileData = {
  name: 'Juan Cruz Dillon',
  username: 'juancruzdillon',
  avatarUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGxAsHBbE6B9g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1679889620223?e=1752105600&v=beta&t=OarOcWN5hoHL02qrZEtI5XZtTNy0yM8Pwivy8h_OtGY',
  bio: 'Desarrollador Front End Apasionado 👨‍💻 | Convierto ideas en experiencias digitales interactivas ✨ | Entusiasta de React, Next.js, Tailwind CSS 🚀 | Argentina 🇦🇷',
  stats: {
    age: 25,
    nationality: 'Argentina',
    specialty: 'Front End',
  },
  projects: projectsData,
  githubUrl: 'https://github.com/juancruzdillon',
};

// Experience items should be in REVERSE chronological order (newest first)
// The Timeline component will reverse it for display (oldest first on left)
const experienceItems = [
  {
    date: "2021 - Actualidad",
    title: "Desarrollador Frontend",
    company: "Tech Solutions Inc.",
    description: "Liderando el desarrollo de interfaces de usuario dinámicas y mejorando el rendimiento de las aplicaciones con frameworks modernos. Colaborando con equipos de UI/UX para traducir diseños en código responsivo y de alta calidad."
  },
  {
    date: "2019 - 2021",
    title: "Desarrollador Junior",
    company: "Web Wizards Co.",
    description: "Contribuí en diversos proyectos de desarrollo web, enfocándome en tareas de front-end y back-end. Adquirí experiencia fundamental en metodologías ágiles y sistemas de control de versiones."
  },
  {
    date: "2018",
    title: "Pasante",
    company: "CodeCrafters",
    description: "Asistí a desarrolladores senior en diversas etapas del ciclo de vida del desarrollo de software. Me enfoqué en aprender tecnologías web y contribuir a herramientas internas."
  }
];

// New data for MemoTestGame
export const memoTestGameData = [
  { q: "Edad", a: "25", qIcon: UserCircle, aIcon: Award },
  { q: "Nacionalidad", a: "Argentina", qIcon: MapPin, aIcon: Sparkles },
  { q: "Especialidad", a: "Front End", qIcon: CodeIcon, aIcon: TargetIcon },
  { q: "Nombre", a: "Juan Cruz", qIcon: Brain, aIcon: Briefcase }, // Use Briefcase instead of BriefcaseIcon
  { q: "Pasión", a: "Programar", qIcon: Zap, aIcon: Lightbulb },
  { q: "Framework más usado", a: "Vue.js", qIcon: Brain, aIcon: VuejsIcon },
];

export const homePageSectionsData: HomePageSection[] = [
  {
    id: 'my-projects',
    type: 'projects',
    title: 'Proyectos',
    content: (
      <React.Fragment>
       <div className="p-4 text-center flex flex-col items-center justify-center h-full">
        <Briefcase className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 text-primary" />
        <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Mis Trabajos</h3>
        <p className="text-base sm:text-lg text-white/90 mb-6">
          Desliza o usa las flechas para navegar por los proyectos. Haz clic en un proyecto para ver detalles.
        </p>
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <ProjectSlider projects={projectsData} />
        </div>
      </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://images.unsplash.com/photo-1592636120953-3d2b28ebfd69?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'about-me',
    type: 'about',
    title: 'Sobre Mí',
    content: (
      <React.Fragment>
        <div className="p-4 text-center max-w-md mx-auto">
           <Image
            src="https://lh3.googleusercontent.com/pw/AP1GczMlWqE920GZHa2P6SaVrqR7_uZzpIU5pS2XkFg1HQlSphoeys9CiA2nNlUuFdAmRZ6IrHOxXVWxVsXHKjbw4sy_8FDoto2vH4j7hn9UpmQZkjD6y0o3uC_JjVCr4KcYvXRD0ay01mBZYub_ifjpp_DeNA=w979-h1305-s-no-gm?authuser=0"
            alt="Juan Cruz Dillon"
            width={150}
            height={150}
            containerClassName="mb-6 mx-auto w-[150px] h-[150px]"
            imgClassName="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg"
            data-ai-hint="profile avatar"
          />
          <h3 className="text-2xl font-semibold mb-2 text-white">¡Hola, soy Juan Cruz!</h3>
          <p className="text-lg text-white/90">
            Un Desarrollador Front End apasionado de Argentina, especializado en crear aplicaciones web modernas y responsivas.
            Me encanta convertir problemas complejos en diseños hermosos e intuitivos.
          </p>
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://images.unsplash.com/photo-1598162480222-b2c3d92548d5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'experience',
    type: 'experience',
    title: 'Experiencia',
    content: (
      <React.Fragment>
        <div className="p-4 text-center max-w-4xl mx-auto w-full flex flex-col items-center">
          <TrendingUp className="mx-auto h-16 w-16 mb-6 text-primary" />
          <h3 className="text-3xl font-bold mb-2 text-white">Trayectoria Profesional</h3>
          <p className="text-sm text-white/70 mb-10 md:hidden">Toca los puntos de la línea de tiempo para ver los detalles.</p>
          <p className="text-sm text-white/70 mb-10 hidden md:block">Pasa el cursor o haz clic en los puntos de la línea de tiempo para ver los detalles.</p>
          <div className="w-full"> {/* Container for the timeline */}
            <Timeline items={experienceItems} />
          </div>
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'memo-test-game',
    type: 'game',
    title: 'Ahora ¿cuánto sabes de mí?',
    content: (
      <React.Fragment>
        <div className="p-4 text-center w-full max-w-2xl mx-auto flex flex-col items-center justify-center h-full">
            <Brain className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 text-primary" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Pon a prueba tu memoria</h3>
            <p className="text-base sm:text-lg text-white/80 mb-6 max-w-md">
                Encuentra los pares correctos y descubre algunos datos sobre mí. ¡Buena suerte!
            </p>
            <MemoTestGame pairs={memoTestGameData} />
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://images.unsplash.com/photo-1642278460334-a65640d55509?q=80&w=2712&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
   {
    id: 'contact-me-section',
    type: 'contact',
    title: 'Contáctame',
    content: (
      <React.Fragment>
        <div className="p-4 text-center w-full max-w-md mx-auto">
          <MessageSquare className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 text-primary" />
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Ponte en Contacto</h3>
          <p className="text-base sm:text-lg text-white/90 mb-6">
            ¿Tienes un proyecto en mente o solo quieres saludar? Completa el formulario a continuación o usa la función de inbox.
          </p>
          <ContactForm />
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

