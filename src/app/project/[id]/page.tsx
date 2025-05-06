
import { projectsData } from '@/data/portfolio-data';
import type { Project as ProjectType } from '@/data/types';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, CalendarDays, Users, Globe, Github } from 'lucide-react';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.id,
  }));
}

const getProject = (id: string): ProjectType | undefined => {
  return projectsData.find((project) => project.id === id);
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:pl-20"> {/* Padding for desktop sidebar */}
      <main className="flex-grow container mx-auto px-4 py-8 pt-10 md:pt-8 pb-24 md:pb-8"> {/* Padding for nav bars */}
        <Button asChild variant="outline" className="mb-8">
          <Link href="/profile#projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Proyectos
          </Link>
        </Button>

        <Card className="overflow-hidden shadow-xl">
          <CardHeader className="relative p-0 h-72 md:h-96">
            <Image
              src={project.imageUrl}
              alt={project.title}
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
              data-ai-hint="project detail image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <CardTitle className="absolute bottom-6 left-6 text-4xl font-bold text-white">
              {project.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Descripción del Proyecto</h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {project.longDescription}
                </p>

                <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Tecnologías Utilizadas</h3>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech) => (
                    <Badge key={tech.name} variant="secondary" className="py-1 px-3 text-sm flex items-center gap-2">
                      {tech.icon && <tech.icon className="h-4 w-4" />}
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <aside className="md:col-span-1 space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Duración
                  </h3>
                  <p className="text-foreground/80">{project.duration}</p>
                </div>

                {project.collaborators && project.collaborators.length > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" /> Colaboradores
                    </h3>
                    <ul className="list-disc list-inside text-foreground/80 space-y-1">
                      {project.collaborators.map((collab) => (
                        <li key={collab}>{collab}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="space-y-2">
                  {project.liveLink && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href={project.liveLink} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" /> Ver Demo en Vivo
                      </Link>
                    </Button>
                  )}
                  {project.repoLink && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href={project.repoLink} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" /> Repositorio en GitHub
                      </Link>
                    </Button>
                  )}
                </div>
              </aside>
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomNavBar />
    </div>
  );
}

