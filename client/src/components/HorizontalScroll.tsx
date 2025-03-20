import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Section {
  id: string;
  label: string;
}

interface HorizontalScrollProps {
  sections: Section[];
  children: ReactNode[];
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
}

export function HorizontalScroll({ 
  sections, 
  children, 
  activeSection,
  onSectionChange 
}: HorizontalScrollProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Update active section when activeSection prop changes
  useEffect(() => {
    if (activeSection) {
      const index = sections.findIndex(section => section.id === activeSection);
      if (index !== -1) {
        setActiveSectionIndex(index);
      }
    }
  }, [activeSection, sections]);

  const scrollToSection = (index: number) => {
    if (index < 0 || index >= sections.length) return;
    
    setIsScrolling(true);
    setActiveSectionIndex(index);
    
    const container = containerRef.current;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    container.scrollTo({
      left: index * containerWidth,
      behavior: 'smooth'
    });

    // Notify parent component about section change
    if (onSectionChange) {
      onSectionChange(sections[index].id);
    }
    
    // Reset scrolling state after animation completes
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  const handleScroll = () => {
    if (isScrolling || !containerRef.current) return;
    
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    
    const newIndex = Math.round(scrollLeft / containerWidth);
    
    if (newIndex !== activeSectionIndex) {
      setActiveSectionIndex(newIndex);
      
      // Notify parent component about section change
      if (onSectionChange) {
        onSectionChange(sections[newIndex].id);
      }
    }
  };

  const navigatePrev = () => {
    scrollToSection(activeSectionIndex - 1);
  };

  const navigateNext = () => {
    scrollToSection(activeSectionIndex + 1);
  };

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // If the swipe is significant enough (50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left, go next
        navigateNext();
      } else {
        // Swipe right, go prev
        navigatePrev();
      }
    }

    setTouchStart(null);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Navigation arrows - hidden on small screens */}
      <button
        onClick={navigatePrev}
        disabled={activeSectionIndex === 0}
        className="hidden md:block absolute left-4 top-1/2 z-10 transform -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 disabled:opacity-30 text-white w-10 h-10 flex items-center justify-center"
        aria-label="Previous section"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={navigateNext}
        disabled={activeSectionIndex === sections.length - 1}
        className="hidden md:block absolute right-4 top-1/2 z-10 transform -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 disabled:opacity-30 text-white w-10 h-10 flex items-center justify-center"
        aria-label="Next section"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Main scroll container */}
      <div
        ref={containerRef}
        className="scroll-container flex w-full h-full overflow-x-scroll snap-x snap-mandatory"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children.map((child, index) => (
          <div
            key={sections[index]?.id || index}
            className="min-w-full w-full h-full flex-shrink-0 snap-center"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Section indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`w-2 h-2 rounded-full transition-all ${
              activeSectionIndex === index 
                ? "bg-white w-6" 
                : "bg-white/30 hover:bg-white/50"
            }`}
            onClick={() => scrollToSection(index)}
            aria-label={`Go to ${section.label} section`}
          />
        ))}
      </div>
    </div>
  );
}

export default HorizontalScroll;
