"use client";

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Briefcase } from 'lucide-react'; // Removed CalendarDays as date is in text
import { cn } from '@/lib/utils';

interface ExperienceItem {
  date: string;
  title: string;
  company: string;
  description: string;
}

interface TimelineProps {
  items: ExperienceItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  // Display items chronologically (oldest first on the left)
  const displayItems = [...items].reverse();

  return (
    <div className="w-full py-16 px-2 sm:px-4 relative">
      {/* Timeline Track - ensure it's visually behind the dots */}
      <div className="absolute left-0 right-0 top-1/2 h-3 bg-primary/30 transform -translate-y-1/2 mx-4 md:mx-8 rounded-full z-0">
        <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
      </div>

      {/* Timeline Events Container */}
      <div className="relative flex justify-between items-center mx-4 md:mx-8 z-10">
        {displayItems.map((item, index) => (
          <Popover key={index}>
            <PopoverTrigger asChild>
              <button 
                aria-label={`View details for ${item.title} at ${item.company}`}
                className={cn(
                  "relative flex flex-col items-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full",
                  // Add some horizontal margin to prevent triggers from overlapping if container is too narrow
                  // For 3 items, justify-between should handle this, but good for robustness
                  index > 0 && "ml-4", // minimal margin for spacing if needed
                  index < displayItems.length -1 && "mr-4"
                )}
                >
                {/* Dot on the timeline */}
                <div className="w-7 h-7 bg-background border-[5px] border-primary rounded-full group-hover:scale-110 group-focus:scale-110 transition-transform duration-200 ease-in-out shadow-md"></div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side={index % 2 === 0 ? 'bottom' : 'top'} // Alternate sides
              align="center"
              sideOffset={15} // Increase distance from trigger
              className="w-72 sm:w-80 bg-card text-card-foreground shadow-2xl rounded-xl border-border z-50"
            >
              <Card className="border-0 shadow-none bg-transparent p-0">
                <CardHeader className="p-4 pb-2">
                  <p className="text-xs text-primary font-semibold mb-1 tracking-wider uppercase">{item.date}</p>
                  <CardTitle className="text-base sm:text-lg mb-0.5 text-foreground">{item.title}</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium flex items-center">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 text-primary/90" />
                    {item.company}
                  </p>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-foreground/90 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
