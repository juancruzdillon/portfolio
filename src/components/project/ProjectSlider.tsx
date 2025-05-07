"use client";

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Project } from '@/data/types';
import { cn } from '@/lib/utils';

interface ProjectSliderProps {
  projects: Project[];
}

const ProjectSlideCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Card className="h-full w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-0 relative h-40 sm:h-48">
        <NextImage
          src={project.imageUrl}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="opacity-80 group-hover:opacity-100 transition-opacity"
          data-ai-hint="project image"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
        <div>
            <CardTitle className="text-lg sm:text-xl mb-1 sm:mb-2 text-foreground line-clamp-2">{project.title}</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">{project.shortDescription}</p>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button asChild variant="link" className="p-0 h-auto text-sm text-accent hover:text-accent-foreground/80">
          <Link href={`/project/${project.id}`}>View Details <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const ViewMoreSlide: React.FC = () => {
  return (
    <Link href="/profile#projects" className="h-full w-full">
      <Card className="h-full w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center bg-primary/80 hover:bg-primary/90 backdrop-blur-sm text-primary-foreground">
        <CardContent className="p-4 text-center">
          <ArrowRight className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" />
          <CardTitle className="text-lg sm:text-xl">View All Projects</CardTitle>
          <p className="text-xs sm:text-sm text-primary-foreground/80 mt-1">Explore my full portfolio</p>
        </CardContent>
      </Card>
    </Link>
  );
};


const ProjectSlider: React.FC<ProjectSliderProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const projectsToShow = projects.slice(0, 6);
  // totalSlides includes projects to show + 1 for the "View More" slide
  const totalSlides = projectsToShow.length + 1;

  const isAtStart = currentIndex === 0;
  // isAtEnd is true when the "View More" slide is active, or if no projects, the "View More" (which is the only slide) is active.
  const isAtEnd = currentIndex === totalSlides - 1;

  const navigateSlide = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else {
      // Ensure we don't go beyond the "View More" slide
      setCurrentIndex((prevIndex) => Math.min(totalSlides - 1, prevIndex + 1));
    }
  };

  // Determine if the current slide is a project or the "View More" slide
  const isViewMoreSlideActive = currentIndex === projectsToShow.length;
  const currentProject = !isViewMoreSlideActive ? projectsToShow[currentIndex] : null;

  return (
    <div className="relative w-full group flex flex-col items-center">
      {/* Container for the single visible card */}
      <div className="w-52 h-72 sm:w-60 sm:h-80 md:w-64 md:h-[22rem] flex items-center justify-center">
        {currentProject ? (
          <ProjectSlideCard project={currentProject} />
        ) : isViewMoreSlideActive ? (
          <ViewMoreSlide />
        ) : (
          // Fallback for no projects and not "View More" (e.g., if projectsToShow is empty, currentIndex is 0, isViewMoreSlideActive is true)
          // This case should ideally be handled by ViewMoreSlide if projectsToShow is empty.
          // If projectsToShow is empty, currentIndex is 0, projectsToShow.length is 0. So isViewMoreSlideActive = true.
          // totalSlides will be 1. isAtStart and isAtEnd will be true. Arrows won't show.
          // This means if no projects, it will show ViewMoreSlide correctly.
          null
        )}
      </div>

      {/* Navigation Arrows - only show if there's more than one conceptual slide */}
      {totalSlides > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-0 sm:left-1 md:left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card/70 hover:bg-card text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              isAtStart && "opacity-30 cursor-not-allowed"
            )}
            onClick={() => navigateSlide('left')}
            disabled={isAtStart}
            aria-label="Previous project"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-0 sm:right-1 md:right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card/70 hover:bg-card text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              isAtEnd && "opacity-30 cursor-not-allowed"
            )}
            onClick={() => navigateSlide('right')}
            disabled={isAtEnd}
            aria-label="Next project"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </>
      )}
    </div>
  );
};

export default ProjectSlider;
