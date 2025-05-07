
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
import { Briefcase, MessageSquare, TrendingUp, Brain, Zap, Lightbulb, Award, Code as CodeIcon, MapPin, Sparkles, UserCircle, Target as TargetIcon } from 'lucide-react';
import Timeline from '@/components/ui/timeline';
import ProjectSlider from '@/components/project/ProjectSlider';
import ContactForm from '@/components/contact/ContactForm';
import MemoTestGame from '@/components/game/MemoTestGame';


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
    title: 'Plataforma E-commerce',
    shortDescription: 'Una solución de e-commerce full-stack con características modernas.',
    longDescription: 'Desarrollé una plataforma de e-commerce integral que permite a los usuarios explorar productos, agregarlos al carrito y completar compras. Incluye autenticación de usuarios, gestión de productos, procesamiento de pedidos y un diseño responsivo para una visualización óptima en todos los dispositivos. Integrado con Stripe para pagos.',
    imageUrl: 'https://picsum.photos/seed/project1/600/900', // Adjusted for portrait
    technologies: [technologies.react, technologies.nextjs, technologies.tailwind, technologies.nodejs, technologies.typescript],
    duration: '3 Meses',
    collaborators: ['Jane Doe (Diseñadora)', 'Mike Ross (Desarrollador Backend)'],
    liveLink: '#',
    repoLink: '#',
    isPinned: true, // First project is pinned
    views: "680.2K"
  },
  {
    id: 'project-2',
    title: 'Aplicación de Redes Sociales',
    shortDescription: 'Una aplicación de redes sociales centrada en compartir fotos.',
    longDescription: 'Construí una aplicación de redes sociales que permite a los usuarios crear perfiles, subir fotos, seguir a otros usuarios e interactuar con publicaciones mediante "me gusta" y comentarios. Implementé notificaciones en tiempo real y un algoritmo para el feed. Me enfoqué en una UI/UX limpia y en el rendimiento.',
    imageUrl: 'https://picsum.photos/seed/project2/600/900', // Adjusted for portrait
    technologies: [technologies.react, technologies.nodejs, technologies.javascript],
    duration: '4 Meses',
    liveLink: '#',
    views: "23.5K"
  },
  {
    id: 'project-3',
    title: 'Sitio Web Portfolio',
    shortDescription: 'Este mismo sitio web de portfolio, construido con Next.js y Tailwind CSS.',
    longDescription: 'Diseñé y desarrollé este sitio web de portfolio para mostrar mis habilidades y proyectos. Presenta una UI inspirada en TikTok, diseño responsivo y elementos interactivos. El objetivo fue crear una forma única y atractiva de presentar mi trabajo.',
    imageUrl: 'https://picsum.photos/seed/project3/600/900', // Adjusted for portrait
    technologies: [technologies.nextjs, technologies.react, technologies.tailwind, technologies.typescript],
    duration: '1 Mes',
    collaborators: ['Autodirigido'],
    repoLink: '#',
    views: "21.8K"
  },
   {
    id: 'project-4',
    title: 'Aplicación de Gestión de Tareas',
    shortDescription: 'Un gestor de tareas estilo Kanban para individuos y equipos.',
    longDescription: 'Creé una aplicación de gestión de tareas con funcionalidades como tableros de arrastrar y soltar, asignación de tareas, fechas de entrega y seguimiento del progreso. Me enfoqué en una experiencia de usuario colaborativa e intuitiva.',
    imageUrl: 'https://picsum.photos/seed/project4/600/900', // Adjusted for portrait
    technologies: [technologies.react, technologies.typescript, technologies.tailwind],
    duration: '2 Meses',
    repoLink: '#',
    views: "9365"
  },
  {
    id: 'project-5',
    title: 'API Buscador de Recetas',
    shortDescription: 'Una API RESTful para buscar y recuperar recetas.',
    longDescription: 'Desarrollé un servicio API de backend que permite a los usuarios buscar recetas basadas en ingredientes, tipo de cocina o restricciones dietéticas. Implementado con Node.js y Express, utilizando una base de datos de recetas de terceros.',
    imageUrl: 'https://picsum.photos/seed/project5/600/900', // Adjusted for portrait
    technologies: [technologies.nodejs, technologies.javascript],
    duration: '1.5 Meses',
    liveLink: '#',
    views: "9996"
  },
  {
    id: 'project-6',
    title: 'Panel del Clima',
    shortDescription: 'Un panel simple para mostrar el clima actual y los pronósticos.',
    longDescription: 'Construí un panel del clima que obtiene y muestra información meteorológica de una API externa. Los usuarios pueden buscar ubicaciones y ver las condiciones actuales, así como pronósticos por hora y diarios.',
    imageUrl: 'https://picsum.photos/seed/project6/600/900', // Adjusted for portrait
    technologies: [technologies.html, technologies.css, technologies.javascript],
    duration: '3 Semanas',
    views: "5388"
  },
  {
    id: 'project-7',
    title: 'Plataforma de Blog Personal',
    shortDescription: 'Una plataforma de blogs minimalista con soporte para Markdown.',
    longDescription: 'Diseñé y desarrollé una plataforma de blogs limpia y centrada en el contenido. Admite la redacción de publicaciones en Markdown, la categorización de artículos y una experiencia de lectura simple y responsiva.',
    imageUrl: 'https://picsum.photos/seed/project7/600/900', // Adjusted for portrait
    technologies: [technologies.nextjs, technologies.react, technologies.tailwind],
    duration: '2 Meses',
    repoLink: '#',
    views: "28.7K"
  },
];

export const profileData: ProfileData = {
  name: 'Juan Cruz Dillon',
  username: 'juancruzdillon',
  avatarUrl: 'https://picsum.photos/seed/profileavatar/200/200',
  bio: 'Desarrollador Front End Apasionado 👨‍💻 | Convierto ideas en experiencias digitales interactivas ✨ | Entusiasta de React, Next.js, Tailwind CSS 🚀 | Argentina 🇦🇷',
  stats: {
    age: 25,
    nationality: 'Argentina',
    specialty: 'Front End',
  },
  projects: projectsData,
  githubUrl: 'https://github.com/juandillon1',
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
  { q: "Usuario", a: "@juancruzdillon", qIcon: Brain, aIcon: Briefcase }, // Use Briefcase instead of BriefcaseIcon
  { q: "Pasión", a: "Programar", qIcon: Zap, aIcon: Lightbulb },
  { q: "Framework Favorito", a: "Next.js", qIcon: NextjsIcon, aIcon: ReactIcon },
];

export const homePageSectionsData: HomePageSection[] = [
  {
    id: 'about-me',
    type: 'about',
    title: 'Sobre Mí',
    content: (
      <React.Fragment>
        <div className="p-4 text-center max-w-md mx-auto">
           <Image
            src="https://picsum.photos/seed/aboutmeavatar/150/150"
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
    backgroundImageUrl: 'https://picsum.photos/seed/aboutmebg/1080/1920',
  },
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
    backgroundImageUrl: 'https://picsum.photos/seed/projectsbg/1080/1920',
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
    backgroundImageUrl: 'https://picsum.photos/seed/experiencebg/1080/1920',
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
    backgroundImageUrl: 'https://picsum.photos/seed/memogamebg/1080/1920',
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
    backgroundImageUrl: 'https://picsum.photos/seed/contactbg/1080/1920',
  },
];

