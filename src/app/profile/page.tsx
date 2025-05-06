
import Image from 'next/image';
import Link from 'next/link';
import { profileData } from '@/data/portfolio-data';
import type { Project } from '@/data/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { Separator } from '@/components/ui/separator';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
    <CardHeader className="p-0">
      <Image
        src={project.imageUrl}
        alt={project.title}
        width={400}
        height={300}
        className="object-cover w-full h-48"
        data-ai-hint="project image"
      />
    </CardHeader>
    <CardContent className="p-4 flex-grow">
      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
      <p className="text-sm text-muted-foreground line-clamp-3">{project.shortDescription}</p>
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Button asChild variant="link" className="p-0 h-auto text-primary">
        <Link href={`/project/${project.id}`}>View Details</Link>
      </Button>
    </CardFooter>
  </Card>
);

export default function ProfilePage() {
  const { name, username, avatarUrl, stats, projects } = profileData;

  return (
    <div className="flex flex-col min-h-screen bg-background md:pl-20"> {/* Padding for desktop sidebar */}
      <main className="flex-grow container mx-auto px-4 py-8 pt-10 md:pt-8 pb-24 md:pb-8"> {/* Padding for nav bars */}
        <header className="flex flex-col items-center text-center mb-12">
          <Image
            src={avatarUrl}
            alt={name}
            width={128}
            height={128}
            className="rounded-full mb-4 border-4 border-primary shadow-lg"
            data-ai-hint="profile avatar"
          />
          <h1 className="text-4xl font-bold text-foreground">{name}</h1>
          <p className="text-xl text-muted-foreground">@{username}</p>
          
          <div className="flex space-x-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">{stats.age}</p>
              <p className="text-sm text-muted-foreground">Edad</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">{stats.nationality}</p>
              <p className="text-sm text-muted-foreground">Nacionalidad</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">{stats.specialty}</p>
              <p className="text-sm text-muted-foreground">Especialidad</p>
            </div>
          </div>
        </header>

        <Separator className="my-8" />

        <section id="projects">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">Mis Proyectos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </main>
      <BottomNavBar />
    </div>
  );
}
