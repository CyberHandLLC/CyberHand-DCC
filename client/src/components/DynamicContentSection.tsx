import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from './ui/ScrollArea';

interface Section {
  id: string;
  label: string;
}

interface DynamicContentSectionProps {
  sections: Section[];
  children: ReactNode[];
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
  showArrows?: boolean;
  showIndicators?: boolean;
}

export function DynamicContentSection({ 
  sections, 
  children, 
  activeSection,
  onSectionChange,
  showArrows = true,
  showIndicators = true
}: DynamicContentSectionProps) {
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

  // Scroll to section when active index changes
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: activeSectionIndex * containerWidth,
        behavior: 'smooth'
      });
    }
  }, [activeSectionIndex]);

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

  // Determine if arrows should be shown
  const showLeftArrow = showArrows && activeSectionIndex > 0;
  const showRightArrow = showArrows && activeSectionIndex < sections.length - 1;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Navigation arrows - hidden on small screens and conditionally shown based on position */}
      {showLeftArrow && (
        <button
          onClick={navigatePrev}
          className="hidden md:block absolute left-8 top-1/2 z-30 transform -translate-y-1/2 rounded-full bg-black/20 hover:bg-black/30 border border-white/20 text-white dark:text-white text-white w-12 h-12 flex items-center justify-center shadow-lg"
          aria-label="Previous section"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={navigateNext}
          className="hidden md:block absolute right-8 top-1/2 z-30 transform -translate-y-1/2 rounded-full bg-black/20 hover:bg-black/30 border border-white/20 text-white dark:text-white w-12 h-12 flex items-center justify-center shadow-lg"
          aria-label="Next section"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Main scroll container */}
      <div
        ref={containerRef}
        className="scroll-container flex w-full h-full overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ 
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',  /* Firefox */
          msOverflowStyle: 'none'  /* IE and Edge */
        }}
      >
        {children.map((child, index) => (
          <div
            key={sections[index]?.id || index}
            className="min-w-full w-full h-full flex-shrink-0 snap-center pb-16"
          >
            <ScrollArea className="h-full w-full">
              <div className="pt-6 pb-12">
                {child}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>

      {/* Section indicators */}
      {showIndicators && sections.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full">
          {sections.map((section, index) => (
            <button
              key={section.id}
              className={`h-2 rounded-full transition-all ${
                activeSectionIndex === index 
                  ? "bg-white w-6" 
                  : "bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => scrollToSection(index)}
              aria-label={`Go to ${section.label} section`}
              title={section.label}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DynamicContentSection;
