"use client";

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const projectsToShow = projects.slice(0, 6);
  const totalSlides = projectsToShow.length + 1; // +1 for ViewMoreSlide

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft <= 5); // Add small tolerance for float precision
      // Add a small tolerance for floating point precision, ensure it's truly at the end
      setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 5);
    }
  };
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition(); // Initial check
      
      const handleResize = () => checkScrollPosition();
      window.addEventListener('resize', handleResize);
      
      // Re-check if projectsToShow changes, affecting scrollWidth
      // This might be needed if projectsToShow could change dynamically beyond initial load
      // For now, resize is the primary dynamic factor after initial load.
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [projectsToShow.length]); // Dependency on length of projects to show

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { children, scrollLeft, clientWidth, scrollWidth } = container;

      if (children.length === 0) return;

      const firstCard = children[0] as HTMLElement;
      const cardWidth = firstCard.offsetWidth;
      
      let gap = 16; // Default to 1rem (16px) for space-x-4
      // Try to get Tailwind's space-x value more reliably if needed, or use a fixed known value
      // For simplicity, assuming space-x-4 (1rem = 16px) or space-x-3 (0.75rem = 12px)
      // The actual gap might vary based on viewport for sm:space-x-4.
      // Let's take the smaller gap for calculation to be safe, or detect dynamically.
      // Using fixed value for simplicity with scroll-snap.
      const cardOuterWidth = cardWidth + (container.classList.contains('sm:space-x-4') ? 16 : 12);


      let targetScrollLeft;

      if (direction === 'right') {
        // Find the first card that is currently partially or fully off-screen to the right
        let currentCardIndex = -1;
        for(let i=0; i<children.length; i++) {
            const child = children[i] as HTMLElement;
            if(child.offsetLeft + child.offsetWidth > scrollLeft + clientWidth / 2) { // card is mostly visible or to the right
                currentCardIndex = i;
                break;
            }
        }
        // target the next card, or stay if last
        const nextIndex = Math.min(currentCardIndex + 1, children.length -1);
        targetScrollLeft = (children[nextIndex] as HTMLElement).offsetLeft;


      } else { // direction === 'left'
         // Find the first card that is mostly visible or to the left of viewport center
        let currentCardIndex = children.length -1;
         for(let i=0; i<children.length; i++) {
            const child = children[i] as HTMLElement;
            if(child.offsetLeft >= scrollLeft - clientWidth / 2 ) {
                currentCardIndex = i;
                break;
            }
        }
        // target the previous card, or stay if first
        const prevIndex = Math.max(currentCardIndex -1, 0);
        targetScrollLeft = (children[prevIndex] as HTMLElement).offsetLeft;
      }
      
      // Ensure targetScrollLeft is within bounds
      targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, scrollWidth - clientWidth));

      container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    }
  };

  
  return (
    <div className="relative w-full group"> {/* Added group for hover effects on arrows if ProjectSlider itself is the group target */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide space-x-3 sm:space-x-4 pb-2 -mb-2" 
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

      {totalSlides > 1 && ( // Show arrows only if there's more than one slide conceptually
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
