
import NextImage from 'next/image'; // Renamed to avoid conflict with custom Image
import Link from 'next/link';
import { profileData } from '@/data/portfolio-data';
import type { Project } from '@/data/types';
import { Button } from '@/components/ui/button';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Clapperboard, Heart, Play, ChevronDown, Bookmark } from 'lucide-react';
import Image from '@/components/ui/image'; // Custom Image component

const ProjectGridItem: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  // Consistent placeholder view count based on project ID or use provided views
  const viewCount = project.views || `${(project.id.charCodeAt(project.id.length - 1) % 499) + 1}.${project.id.charCodeAt(0) % 9}K`;

  return (
    <Link
      key={project.id}
      href={`/project/${project.id}`}
      className="relative group aspect-[2/3] overflow-hidden rounded-sm block"
      aria-label={`View project: ${project.title}`}
    >
      <Image
        src={project.imageUrl}
        alt={project.title}
        layout="fill"
        objectFit="cover"
        containerClassName="w-full h-full"
        imgClassName="group-hover:scale-105 transition-transform duration-300"
        data-ai-hint="project thumbnail"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 group-hover:opacity-75 transition-opacity"></div>

      {project.isPinned && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-sm font-semibold flex items-center z-10 shadow">
          <Bookmark className="w-2.5 h-2.5 mr-1" />
          Anclado
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <Play className="w-12 h-12 text-white/90 fill-white/30" />
      </div>

      <div className="absolute bottom-2 left-2 text-white text-xs font-semibold flex items-center bg-black/50 px-1.5 py-0.5 rounded z-10">
        <Play className="w-3 h-3 mr-1 fill-white" />
        <span>{viewCount}</span>
      </div>
    </Link>
  );
};

export default function ProfilePage() {
  const { name, username, avatarUrl, bio, stats, projects } = profileData;

  return (
    <div className="flex flex-col min-h-screen bg-background md:pl-20"> {/* Maintain padding for desktop sidebar */}
      <main className="flex-grow container mx-auto px-0 sm:px-4 pt-4 md:pt-6 pb-20 md:pb-8"> {/* Adjusted padding */}
        
        <header className="flex flex-col items-center text-center p-4 mb-6">
          <Image
            src={avatarUrl}
            alt={name}
            width={96} // Standard TikTok avatar size is ~96-112px
            height={96}
            containerClassName="w-24 h-24 mb-3"
            imgClassName="rounded-full object-cover border-2 border-border shadow-md"
            data-ai-hint="profile avatar"
          />
          <h2 className="text-xl font-semibold text-foreground">@{username}</h2>
          <p className="text-sm text-muted-foreground mb-3">{name}</p>

          <div className="flex space-x-4 sm:space-x-6 my-3 text-sm">
            <div className="text-center">
              <p className="font-semibold text-foreground">{stats.following}</p>
              <p className="text-xs text-muted-foreground">Siguiendo</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{stats.followers}</p>
              <p className="text-xs text-muted-foreground">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{stats.likes}</p>
              <p className="text-xs text-muted-foreground">Me gusta</p>
            </div>
          </div>

          <p className="text-sm text-foreground max-w-md mx-auto px-2 mb-4 leading-relaxed">
            {bio}
          </p>

          <div className="flex space-x-2">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 text-sm">Seguir</Button>
            <Button variant="outline" size="icon" className="border-border text-muted-foreground">
              <ChevronDown className="h-5 w-5" />
            </Button>
             {/* Placeholder for other buttons like Instagram icon if needed */}
          </div>
        </header>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border-b border-border rounded-none sticky top-0 z-20 sm:static">
            <TabsTrigger value="grid" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none">
              <LayoutGrid className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="videos" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none">
              <Clapperboard className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger value="liked" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none">
              <Heart className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="pt-0.5 bg-background"> {/* Slight padding for separation */}
            {projects.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-0.5"> {/* Minimal gap for TikTok style */}
                {projects.map((project, index) => (
                  <ProjectGridItem key={project.id} project={project} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">No projects to display.</p>
            )}
          </TabsContent>
          <TabsContent value="videos" className="py-10 text-center text-muted-foreground bg-background">
            Contenido de videos no disponible.
          </TabsContent>
          <TabsContent value="liked" className="py-10 text-center text-muted-foreground bg-background">
            Contenido de me gusta no disponible.
          </TabsContent>
        </Tabs>

      </main>
      <div className="md:pl-20"> {/* This div helps BottomNavBar adjust if desktop sidebar is part of global layout but not used here */}
        <BottomNavBar />
      </div>
    </div>
  );
}
