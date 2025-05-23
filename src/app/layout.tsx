import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavBar } from '@/components/layout/BottomNavBar'; // Added import

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Portfolio | Juan Cruz Dillon | Front‑End Developer Vue.js & React.js',
    template: 'Front‑End Developer Vue.js & React.js '
  },
  description: 'Portafolio de Juan Cruz Dillon: desarrollador Front‑End especializado en Vue.js, React.js y Full Stack.',
  keywords: [
    'Juan Cruz Dillon',
    'Portafolio',
    'Front End Developer',
    'Vue.js',
    'Vue',
    'React.js',
    'React',
    'Full Stack Developer',
    'JavaScript',
    'TypeScript',
    'Tailwind CSS',
    'Next.js',
    'SEO',
    'Web Developer',
    'UI/UX'
  ],
  authors: [
    { name: 'Juan Cruz Dillon', url: 'https://www.juancruzdillon.com.ar' }
  ],
  robots: {
    index: true,
    follow: true,
    nocache: true
  },
  openGraph: {
    title: 'Juan Cruz Dillon – Front‑End Developer Vue.js & React.js',
    description: 'Portafolio de Juan Cruz Dillon: proyectos y habilidades en Vue.js, React.js, JavaScript, TypeScript y más.',
    url: 'https://www.juancruzdillon.com.ar',
    siteName: 'Portfolio Juan Cruz Dillon',
    images: [
      {
        url: 'https://www.juancruzdillon.com.ar/assets/perfil.jpg',
        width: 1200,
        height: 630,
        alt: 'Portafolio de Juan Cruz Dillon'
      }
    ],
    locale: 'es_AR',
    type: 'website'
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false,
    viewportFit: 'cover'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;  
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex flex-col`}>        
        <main className='flex-grow overflow-y-auto md:pl-20'>
          {children}
          <Toaster />
          <BottomNavBar /> {/* Added BottomNavBar here */}
        </main>
      </body>
    </html>
  );
}
