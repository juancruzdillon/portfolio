
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
import { Briefcase, MessageSquare, TrendingUp, Brain, Zap, Lightbulb, Award, Code as CodeIcon, MapPin, Sparkles, UserCircle, Target as TargetIcon, LetterText, Frame } from 'lucide-react';
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
  bio: 'Desarrollador Front End 👨‍💻 | Me encanta convertir ideas en apps que realmente se sientan 🔥 | Soy fan de Vue 🚀 | Desde Argentina 🇦🇷',
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
    title: "Front-End Developer Ssr.",
    company: "Telecentro",
    description: "Encargado de la integración de apps para Smart TVs, optimicé despliegues y performance en el ecosistema TPlay, y me consolidé como referente del equipo en desarrollo y adaptación para smart tvs."
  },
  {
    date: "2020 - 2021",
    title: "Full Stack Developer Jr.",
    company: "ORT Argentina",
    description: "Colaboré en la mejora de sistemas internos de gestión con PHP-ASP Classic y SQL Server, automatizando tareas y reduciendo errores. Unifiqué datos con SSIS ETL y trabajé con RRHH y Finanzas para implementar soluciones a medida.",
  },
  {
    date: "2019-2020",
    title: "CRM Software Developer",
    company: "BGlobal",
    description: `
    Desarrollé e implementé un sistema CRM desde cero utilizando BPM Online (Low Code) y .NET MVC, digitalizando procesos comerciales manuales. Integré la solución con WebAPI y SQL Server, migré los datos del cliente a la nueva plataforma y brindé soporte técnico y evolutivo, resolviendo incidentes críticos de forma ágil.
    `
  }
];

// New data for MemoTestGame
export const memoTestGameData = [
  { q: "Edad", a: "25", qIcon: UserCircle, aIcon: UserCircle },
  { q: "Nacionalidad", a: "Argentina", qIcon: MapPin, aIcon: MapPin },
  { q: "Especialidad", a: "Front End", qIcon: CodeIcon, aIcon: CodeIcon },
  { q: "Nombre", a: "Juan Cruz", qIcon: Brain, aIcon: Brain }, // Use Briefcase instead of BriefcaseIcon
  { q: "Pasión", a: "Programar", qIcon: Zap, aIcon: Zap },
  { q: "Framework más usado", a: "Vue.js", qIcon: Frame, aIcon: VuejsIcon },
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
    backgroundImageUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNnzDMHV0fX-5kOspAxIj78zNwM8FLvIsRWTVuPWN79fVzgHo8pz5AtB_m-Lw0y0kK17b3HV3OKa67r1FUEQ_SOqsZkBjvKUybLlxGoEAIphkogu_TsFful7F44UD3z8GualxgtPGoWzvn9wK_2NusXhI9sW72aH7IOUjtROJ2FrEAwKV14J3yUA_1EYtEuoJ9RQ9zxf7cUnbvDbcNeiL7sCgKUIrUpiQ9di6rXcfySHupzdUVxiDp4Byp-G50_h3X3aLfSFmGrkqqkHgeJbl0LvbxHDTOQQbgvcT8UQXlPhmedZmboYw5pvXSgbpf3Rltos76T8NF8s5752oYz8ijvvDWK-sVmMjObl2o72GOjT5nM7Cb6NREMTJziFS527lMVdUs13OfklZH_aFDhiyaZRikSa7eoeM4nQPzfY5c_8E0UFtDT7f1cOmArqAO0QtcKEvuM8Em2ISg0drMBZOo51qqXNitiy2mVSo-6dsedmKsgC1BIcsU7768CJbBwVNtTvBGzB4Wrb1qvih2NMawekg5CsD9-RQNsknC2cjGUIfQwfDFAGeCfa9iGn0OXJQln3QZgnX-XTbmOM6f-Mhf5fvqhP9eRb5kyLAbEHGdZQKZMgh7QEnRa-TJ6JwiPqL8uxH-runm4x6Vs7kPlGAO-jGv6FsmBE1hvW_Lvg-TjO7Ooisn_oivlKCgxLs2gPX4xWOjA5Bn50gpdLSSwaAUIA9ElWBfF6fnuA-xRYrlpKsOxThPqgl8NOQderdyKgIO2jtwDFvD4XnBTYMdu1DBJwlMIZLHFgknBW9ryL2bvHmKPqOVoco-vEzK9aD2Kd-Hpl2W46DO0jW53HHjaUx6MbhWYLrL6vi67jQs1hFxLSD1jma9q_pHDoly-2og2_wlKfKve2PfkLRDOLnY3y96XuA1J2N148KdS9FnPmu_OEJggsef8LK5m6JHzZj6uL17j439UkE00KVHbOjlUB-ppWm6_Dbl6R7GzjN5-LVuDYYCKUWnnb5ZXC0jnitxpYiSGevVlIBIwEN6zUJrGkWFVM6NfAyPtq-DyqHmC6MUlOO_pQKGyH8ImmfCJ2xheSY-G1eRogFhzT9Pg1op4kTlUWKIUzqmXDH1YE64Iqi0sxD2qlCKrN74yvgPG_mlWMQBtChLL3A=w1440-h960-no?authuser=0',
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
            Soy un desarrollador nacido en argentina, apasionado por crear aplicaciones de todo tipo. Me gusta transformar desafíos en experiencias visuales, atractivas e intuitivas.
          </p>
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://lh3.googleusercontent.com/pw/AP1GczOCg004CKZQhLfZ_xapjSABEKg10YErvJTWWvUOx3TXk5W8b3Cd6RKVndTvdbHwQ8nzCEtU7McpOwir-1ydr46IMBCDVAn51mrmg0YFaKf2WeQh1IVRH8M5CY5_JtCFC3YHbu6Mh267dhNdwn1BcpIXaYxV7iEOawfjCLx3kG5J--w_qIdiyZzIoDHCtAzrpC5SSYbU_S6Xtq_e7tsotKGH5JS7bLPXsiJ9YK7DGSCxJxMNwlVBLZTOOLzkTz2kYU-8LLrdAZZMHroqdvk-wcCNXnRueU0EuODMJz6MClgaLcjWAD7qYkvGeIl_yUSx_Ke7XN8xihKWdHCTHSRbhCjrlwTGKE0hlXqA17z4gdTVOERzCKfiePAHUm5otE5iWzCxcleuCr_vV0177CoKfOZHJfxq-nShBlSxwlkpeYQXeDoW-bywXad-DSbHzmBiMQ3bq_41MA7QQosNVZwaQgY1N5G9EcOyts6Tz7B1t_bTm2pAF2J1lpMXi6ymXZkROt0M5oFosYEdTXCKJpuvoizwxwU9SNFGGsEEabyF9yd34aw-rLAKamixk5ybXxujJWvuLaesmgsj86EaSwTHxbhnRI_-nwGiL6tE5PAQC7iQKMNP_U0nr7ZVGD64F2tQQTYeVi0s62N0iuEGwZwN0E0i9-b0gzhl4ze9Ya05T8Kkw7LBhs2YXYNpkfwItn4-3smQLQxAakyi6eWPPpbMtBM2ze_Er9atMhS4tVTVz89FDpC83FuDj-7_s6az2KaQsPIWZEvz5lQf06-Y8fGz09ZHN4VLlIBoK_t-Sl4I4Yj2i6psAQfjfnKMnwcm1pi5-ikaiB3avCsksJJXSeplzMTzA67eDawPJjrVnOueAKB376yA-pbOcvZPEgwXlku3ikIv-PyTldCdqGO_ASslcb82SVeFjl2oSR6I9z7xlUBnk9xVsrICzyyVHJfc-CzGb8ncqMznpraL-xGY4B-fYrySRywV2PBQo_Vv8G-TGpRxM0xL6jBwDzFgU-ZsDEFgjz-wR0pD5LLfcL6PXocwFkLZB2VhzD_1Dm8NZPFFzleoVjNj9_m_3-a7HIt7PfhAmR75_S03d3hCok1CPrtvNEHBU7HXfmuFw2bv1NVVVUcnbb3cdVOrHKFUED4lWK2jj2jk9HLTvA=w1440-h960-no?authuser=0',
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
    backgroundImageUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNsJg7kZVrRLqSuxSzvrO-eBT_ufrmLiKTNFauTtZFUZhLyirzebWfx5V2pDaNOnx9kDjppSHW8GnUEimFfmd9FGZyohzQXH0yZWmi5vhfVJDZUEUAke666o_DY2rwyULFcVQc338xMc6dQ-gkgjf8Yca9yI4UUA7xuUP0IgHbql0kgz3N7Ln-t9c9gIEIws4ZsXlzL3fNxjmAs2FaWKHNQ64xPciJSAr9mAsoyDUtX44jfdG-uO_EHtSls68US0_Zd1LqDtfVQW6F8nfyTIavGFE26anzUEBDkQiBCYSgCwV70FqQWxP4NrdUXyu2WJ2ywwD_Jy8sgGn307kYtuKA0flJ7J69O1edle3m-NAYcoL3OTcxxUU0EVfXsihGVLjr0JIMmXxPn3c0dBqQCxUnzD3x-m53XzaB6FHRmsaSs4gYUzu0zpBEJi9J2FRzjcds8wMCEmLP5A8nJ8CXZzZ37XF71m5JP9pTH6BoGe4blfTlQDLqtvephGDjaSHg9vECiYLUwaNnSWYdcYx81OlPaZxmOCnNq0FqU1iGt3IZUQvx9GJbRJvktMSYUkLUtX3VM6_lDAOeCF6dBsirc4DYhN-XFs6kZDCp5QYSnaF_2Ld3wumEz-D63YedlW81d_jXP5bAeRxKM268puzOEKJ5AOMuuw56DvORzFq5tQBoyASm7ys7NjzTNVs0Xq8c51H73iKkJw7yUbkZKPz5NqKZHGjvxJLcADsRVievc_Jw8PZqBT2GJmRECoRDIYHla81eKOBMJRLpb1_5cUvDzqB796fO4_V8Th-PoVybXGUzr4jtHp7ErLnj6No0s06n4xfNlVlQJK6MD3vS7PNbfVmYAqaxnUEHB1vpN3bY9-LZ1QL6IA7nYKdVS9EjEI3GGvrFdrc_fZoLqP_jRkqmNPq6TY0n3NABQA_YhPeW5OAZaeBDrEoHekt5inI-9q7IK9_gaU0gN7KYzO12TxAwkv85UHIVjthVK7sKv9cDUsKKX62HXheq3I-r9JjhTVPu0yk0A4K_9Sw_b5OI8q18X8dquSwbaiBpvZuUuZv6JbhL_mig_0QIq7capGGt39jNJ-AJGigu9cvoGuLmxEvgg2iPQxRadc9g-0m4H_pFT1Mu_lHBr_kFHwLn4kzbIgQkVNbJn8QyMlA=w1440-h960-no?authuser=0',
  },
  {
    id: 'memo-test-game',
    type: 'game',
    title: 'Ahora vamos a ver, ¿cuánto sabes de mí?',
    content: (
      <React.Fragment>
        <div className="p-4 text-center w-full max-w-2xl mx-auto flex flex-col items-center justify-center h-full">
            <Brain className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 text-primary" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Poné a prueba tu memoria</h3>
            <p className="text-base sm:text-lg text-white/80 mb-6 max-w-md">
                Encontrá los pares correctos y descubrí algunos datos sobre mí. Buena suerte!
            </p>
            <MemoTestGame pairs={memoTestGameData} />
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://lh3.googleusercontent.com/pw/AP1GczNQqiAtDZGwp0YZqpqaQDXsAD0s80am-p11gFflTATf3WKt-dRZJRDj762fJb5vdf_Yu761feK2SUIoQ58zQ1qMMvUytyV-Mnq14saeW18SpqHtYETjXPvU8jtWoQKShZ5rECDzmnH19_iJajrrbiRX4q8Yq3GK9uHE6tr8APrjKovIjbNFBMRTn4V9FgzDRWInDIN2AHOVucTVvaNIgFda-WgGJ4pp0nkHYIYiIAOXQ0trI4LHLYCYLwv3Dc24Ij6Pd5UeP1y1NpaEq6xSKhmRnjTNoEsfkG0gUsyUVzm7DD8TjGRBqcEPCMWosPOkpbX7jnBhxpQEIC9EUPInv15kNfUUv9YIGm8C8D0yK0EuFwcqxSh2aUTIWRc0aeOtonuP32Pov2SRJWqRjEfLpJ-9l42cRehMaC27FN_S3a3NYqXcXPw-72vaEfTjhXjj7acwzQpcMYYnjabvCkdLK9jkzI3recZylLVcfzCwXCXUTr0eZgkoAx8otkvvQ9jp35VaxXUV6vSh4g47sLq8NMnEogUXQs0kQSzLWZKw-wKHZCfYn2RW0IruBWrFjJDHNX9IpeQ84DEIQ6YV2lnspumbzW3sYZZ6WnlJdbuj6hwO7kwwUng_vfwytsM2_KV5y6RADyMyVAQJkFikBrIBEsghAxqDm3U8RAvIeLvXZzsqLp7BDiBIy-pfkdnH5NwGC_to-XWx6JNFT3j6cJu5ku-ZwAPndwA7euahhpgXmS3z-7GeBphr3ULi5vqH-ZKrtw1HwfD9wefphDqpqbsmZq8tLSyw_7-KSg7nj1AFqQKPgFWyW9TVniEQ0JmwGsT-qPI1NY6SRDTvXx0taRI52jKKpUhU9pY_gxAqcCFHlK1X1MDxpuRmEMKhg4mNiDVAhCfb9uGXu71mnzYrkciqmXAqHGuTJgLMiEGXpZNBHxZ1ER4mCdXbwlWCddRnz4D1trZqIKP8PUSqX1STz7eXNxa8Sw6Oo4GNdN1h2u_4hWgGDV2f3BkkuYmpmj-pD4xYkREGV33iLm-lgTrMiM4eEaw20mKSbDAMTVOLLUcS29RlNUPG2N38xKTZptlfQfD3CnUXMwsn299oDIT-TXLNhQIUcPyK6wQIueWZ5JrG86--1aD4EmIAq6bCw5BMvaH9J2uSRLVOjA=w1359-h1041-no?authuser=0',
    },
   {
    id: 'contact-me-section',
    type: 'contact',
    title: 'Contáctame',
    content: (
      <React.Fragment>
        <div className="flex flex flex-col h-75 text-center w-full max-w-md mx-auto">
          <MessageSquare className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 text-primary" />
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Ponete en Contacto</h3>
          <p className="text-base sm:text-lg text-white/90 mb-6">
          Si querés contactarme llená este formulario y pronto me voy a comunicar con vos 😀
          </p>
          <ContactForm />
        </div>
      </React.Fragment>
    ),
    backgroundImageUrl: 'https://lh3.googleusercontent.com/pw/AP1GczMewpyBRMYo_0enMAXk7rLsipSFw-RUPvwi4KcfijVfzGoQqeQDQ3V4KNjKycCMkInce9m_YtbAFCfAk6drPa4zeebzEZWu13jVEzrT3rlAu84k_N3zDNjRVE4FFzORG3Xwpy45AMxXF-qFKczd2NmIFA=w1619-h1080-s-no-gm?authuser=0',
  },
];

