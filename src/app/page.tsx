"use client";
import type React from 'react';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { homePageSectionsData } from '@/data/portfolio-data';
import type { HomePageSection } from '@/data/types';
import NextImage from 'next/image';

const SectionCard: React.FC<{ section: HomePageSection }> = ({ section }) => {
  return (
    <div 
      className="min-h-full w-full relative flex flex-col items-center text-white snap-start shrink-0"
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
      <div className="mt-[5vh] md:mt-[25vh] relative z-10 p-4 sm:p-6 md:p-8 bg-black/50 rounded-lg shadow-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl text-center w-full flex flex-col">
        {section.type !== 'projects' && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{section.title}</h2>
        )}
        <div className="text-sm sm:75 sm:text-base md:text-lg text-white/90 w-full">
          {section.content}
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <>
      <div
        className="homepage-sections-container flex-grow overflow-y-scroll snap-y snap-mandatory w-full group overscroll-y-contain"
        style={{
          scrollSnapType: 'y mandatory',
          scrollSnapStop: 'always'
        }}
      >
        {homePageSectionsData.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
      <BottomNavBar />
    </>
  );
}
