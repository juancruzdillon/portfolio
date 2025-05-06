
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
      <SearchX className="h-24 w-24 text-destructive mb-6" />
      <h1 className="text-4xl font-bold text-foreground mb-4">Proyecto no Encontrado</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Lo sentimos, no pudimos encontrar el proyecto que estás buscando.
      </p>
      <Button asChild>
        <Link href="/profile#projects">Volver a Proyectos</Link>
      </Button>
    </div>
  );
}
