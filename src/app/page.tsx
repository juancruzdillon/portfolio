
"use client";
import type React from 'react';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { homePageSectionsData } from '@/data/portfolio-data';
import type { HomePageSection } from '@/data/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import NextImage from 'next/image'; // Use NextImage directly for layout="fill"

const SectionCard: React.FC<{ section: HomePageSection }> = ({ section }) => {
  return (
    <div 
      className="h-full w-full relative flex flex-col items-center justify-center text-white snap-start shrink-0 overflow-hidden"
      style={{
        scrollSnapAlign: 'start',
      }}
    >
      {section.backgroundImageUrl && (
        <NextImage // Changed to NextImage for direct fill usage
          src={section.backgroundImageUrl}
          alt={section.title}
          layout="fill"
          objectFit="cover"
          quality={85}
          className="z-0 brightness-50"
          data-ai-hint="abstract background"
          priority={section.id === homePageSectionsData[0].id} // Prioritize first section image
        />
      )}
      <div className="relative z-10 p-8 bg-black/50 rounded-lg shadow-xl max-w-xl text-center">
        <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
        {/* Ensure this div allows text color inheritance or sets it to white if needed */}
        <div className="text-lg text-white/90"> {/* Ensured content text is light */}
          {section.content}
        </div>
        {section.type === 'projects' && (
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/profile#projects">View All Projects</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="flex flex-col h-full">
      <main 
        className="flex-grow overflow-y-auto w-full"
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

