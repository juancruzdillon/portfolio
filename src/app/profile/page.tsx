'use client';

import { useState } from 'react';
import Link from 'next/link';
import { profileData } from '@/data/portfolio-data';
import type { Project } from '@/data/types';
import { Button } from '@/components/ui/button';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Play, Bookmark } from 'lucide-react';
import Image from '@/components/ui/image';
import GithubIcon from '@/icons/GithubIcon';
import { cn } from '@/lib/utils';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={cn(
      "relative overflow-hidden bg-gray-300 dark:bg-gray-800",
      className
    )}
  >
    {/* pseudo‑shimmer */}
    <div className="absolute inset-0 transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
  </div>
);


const ProjectGridItem: React.FC<{ project: Project; index: number }> = ({ project }) => {
  const [loaded, setLoaded] = useState(false);
  const viewCount = project.views || `${(project.id.charCodeAt(project.id.length - 1) % 499) + 1}.${project.id.charCodeAt(0) % 9}K`;

  return (
    <Link
      href={`/project/${project.id}`}
      className="relative group aspect-[2/3] overflow-hidden rounded-sm block"
      aria-label={`Ver proyecto: ${project.title}`}
    >
      {/* Skeleton placeholder */}
      {!loaded && (
        <Skeleton className="absolute inset-0 rounded-sm" />
      )}

      {/* Imagen real */}
      <Image
        src={project.imageUrlPortrait}
        alt={project.title}
        fill
        style={{ objectFit: 'cover' }}
        containerClassName="w-full h-full"
        imgClassName={`group-hover:scale-105 transition-transform duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        data-ai-hint="project thumbnail"
        priority
        onLoadingComplete={() => setLoaded(true)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 group-hover:opacity-75 transition-opacity"></div>

      {project.isPinned && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-sm font-semibold flex items-center z-10 shadow">
          <Bookmark className="w-2.5 h-2.5 mr-1" />
          Anclado
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <Play className="w-12 h-12 text-white/90 fill-white/30" />
        <p className="text-white text-sm mt-2">{project.title}</p>
      </div>

      <div className="absolute bottom-2 left-2 text-white text-xs font-semibold flex items-center bg-black/50 px-1.5 py-0.5 rounded z-10">
        <Play className="w-3 h-3 mr-1 fill-white" />
        <span>{viewCount}</span>
      </div>
    </Link>
  );
};

export default function ProfilePage() {
  const { name, username, avatarUrl, bio, stats, projects, githubUrl } = profileData;
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  return (
    <div className="flex-grow container mx-auto px-0 sm:px-4 pt-4 md:pt-6 pb-20 md:pb-8 md:pl-20" style={{ paddingBottom: 'calc(5rem + 1.25rem)' }}> {/* Adjusted padding-bottom for mobile nav bar and added md:pl-20 */}
        <header className="relative flex flex-col items-center text-center p-4 mb-6 overflow-hidden rounded-lg">
          <div className="relative z-10 flex flex-col items-center pt-8 pb-4">
            {/* Skeleton avatar */}
            {!avatarLoaded && (
              <Skeleton className="w-24 h-24 mb-3 rounded-full" />
            )}

            <Image
              src={avatarUrl}
              alt={name}
              width={96}
              height={96}
              containerClassName="w-24 h-24 mb-3"
              imgClassName={`rounded-full object-cover border-2 border-border shadow-md transition-opacity duration-500 ${avatarLoaded ? 'opacity-100' : 'opacity-0'}`}
              data-ai-hint="profile avatar"
              onLoadingComplete={() => setAvatarLoaded(true)}
            />

            <h2 className="text-xl font-semibold text-foreground">@{username}</h2>
            <p className="text-sm text-muted-foreground mb-3">{name}</p>
            <div className="flex space-x-4 sm:space-x-6 my-3 text-sm">
              <div className="text-center">
                <p className="font-semibold text-foreground">{stats.age}</p>
                <p className="text-xs text-muted-foreground">Edad</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">{stats.nationality}</p>
                <p className="text-xs text-muted-foreground">Nacionalidad</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">{stats.specialty}</p>
                <p className="text-xs text-muted-foreground">Especialidad</p>
              </div>
            </div>
            <p className="text-sm text-foreground max-w-md mx-auto px-2 mb-4 leading-relaxed">
              {bio}
            </p>
            {githubUrl && (
              <div className="mt-4 mb-4">
                <Link href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="Perfil de GitHub de Juan Cruz Dillon">
                  <Button
                    variant="default"
                    className="
                      rounded-full 
                      p-3 sm:p-4
                      bg-gradient-to-br from-primary to-accent 
                      hover:bg-gradient-to-tl hover:from-accent hover:to-primary
                      text-primary-foreground
                      shadow-xl hover:shadow-2xl
                      transform transition-all duration-300 ease-out
                      hover:scale-110 hover:[&_svg]:filter hover:[&_svg]:drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]
                      focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent/80
                      active:scale-100
                    "
                  >
                    <GithubIcon className="h-8 w-8 sm:h-9 sm:h-9 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </header>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid p-0 w-full grid-cols-1 bg-card border-b border-border rounded-none sticky top-0 z-20 sm:static">
            <TabsTrigger
              value="grid"
              className="py-3 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LayoutGrid className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-5 pt-0.5 bg-background">
            {projects.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-0.5">
                {projects.map((project, index) => (
                  <ProjectGridItem key={project.id} project={project} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">No hay proyectos para mostrar.</p>
            )}
          </TabsContent>
        </Tabs>

      {/* BottomNavBar is rendered in layout.tsx */}
      {/* <div className="md:pl-20">
        <BottomNavBar />
      </div> */}
    </div>
  );
}
