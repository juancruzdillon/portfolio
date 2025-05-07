
"use client";
import type React from 'react';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { homePageSectionsData } from '@/data/portfolio-data';
import type { HomePageSection } from '@/data/types';
import NextImage from 'next/image';

const SectionCard: React.FC<{ section: HomePageSection }> = ({ section }) => {
  return (
    <div 
      className="h-full w-full relative flex flex-col items-center justify-center text-white snap-start shrink-0 overflow-hidden p-4" // Added padding for content
      style={{
        scrollSnapAlign: 'start',
      }}
    >
      {section.backgroundImageUrl && (
        <NextImage
          src={section.backgroundImageUrl}
          alt={section.title}
          fill
          style={{ objectFit: "cover" }}
          quality={85}
          className="z-0 brightness-50"
          data-ai-hint="abstract background"
          priority={section.id === homePageSectionsData[0].id} 
        />
      )}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 bg-black/50 rounded-lg shadow-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl text-center w-full"> {/* Adjusted max-width and added w-full */}
        {/* For project type, content is handled by ProjectSlider directly */}
        {section.type !== 'projects' && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{section.title}</h2>
        )}
        <div className="text-sm sm:text-base md:text-lg text-white/90 w-full">
          {section.content}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <main 
        className="flex-grow overflow-y-auto w-full group" // Added group for hover effects on arrows
        style={{
          scrollSnapType: 'y mandatory',
          height: 'calc(100% - 4rem)', // Account for bottom nav bar
        }}
      >
        {homePageSectionsData.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </main>
      <div className="md:pl-20"> {/* Add padding for desktop sidebar */}
        <BottomNavBar />
      </div>
    </div>
  );
}
