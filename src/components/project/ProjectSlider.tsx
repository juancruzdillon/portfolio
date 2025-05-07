
"use client";

import type React from 'react';
import { useState, useRef } from 'react';
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
            <CardTitle className="text-lg sm:text-xl mb-1 sm:mb-2 text-primary-foreground line-clamp-2">{project.title}</CardTitle>
            <p className="text-xs sm:text-sm text-primary-foreground/80 line-clamp-2 sm:line-clamp-3">{project.shortDescription}</p>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button asChild variant="link" className="p-0 h-auto text-sm text-accent hover:text-accent-foreground">
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
          <ArrowRight className="w-10 h-10 sm:w-12 sm:w-12 mb-2 sm:mb-3" />
          <CardTitle className="text-lg sm:text-xl">View All Projects</CardTitle>
          <p className="text-xs sm:text-sm text-primary-foreground/80 mt-1">Explore my full portfolio</p>
        </CardContent>
      </Card>
    </Link>
  );
};


const ProjectSlider: React.FC<ProjectSliderProps> = ({ projects }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const projectsToShow = projects.slice(0, 6);
  const totalSlides = projectsToShow.length + 1; // +1 for ViewMoreSlide

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll by 80% of viewport width

      let newScrollLeft = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      // Clamp scrollLeft to prevent overscrolling
      newScrollLeft = Math.max(0, Math.min(newScrollLeft, scrollWidth - clientWidth));
      
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft <= 0);
      // Add a small tolerance for floating point precision
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth -1);
    }
  };


  // Call checkScrollPosition initially and on scroll
  useState(() => {
    checkScrollPosition();
  });
  
  return (
    <div className="relative w-full">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide space-x-3 sm:space-x-4 pb-2 -mb-2" // pb and -mb to hide scrollbar visually if it appears
        onScroll={checkScrollPosition}
      >
        {projectsToShow.map((project) => (
          <div key={project.id} className="snap-center shrink-0 w-52 h-72 sm:w-60 sm:h-80 md:w-64 md:h-[22rem]">
            <ProjectSlideCard project={project} />
          </div>
        ))}
        <div className="snap-center shrink-0 w-52 h-72 sm:w-60 sm:h-80 md:w-64 md:h-[22rem]">
          <ViewMoreSlide />
        </div>
      </div>

      {totalSlides > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 transform -translate-x-1/2 z-10 rounded-full bg-card/70 hover:bg-card text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                isAtStart && "opacity-30 cursor-not-allowed"
            )}
            onClick={() => scroll('left')}
            disabled={isAtStart}
            aria-label="Previous project"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-1/2 z-10 rounded-full bg-card/70 hover:bg-card text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                isAtEnd && "opacity-30 cursor-not-allowed"
            )}
            onClick={() => scroll('right')}
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
