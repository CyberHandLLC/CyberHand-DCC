import React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  className?: string;
  viewportClassName?: string;
  scrollbarClassName?: string;
  orientation?: 'vertical' | 'horizontal';
  children: React.ReactNode;
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({
  className = '',
  viewportClassName = '',
  scrollbarClassName = '',
  orientation = 'vertical',
  children,
  ...props
}, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={`relative overflow-hidden ${className}`}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className={`h-full w-full rounded-[inherit] ${viewportClassName}`}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar
      orientation={orientation}
      className={scrollbarClassName}
    />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = 'ScrollArea';

interface ScrollBarProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({
  className = '',
  orientation = 'vertical',
  ...props
}, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={`
      flex touch-none select-none transition-colors duration-150 ease-out
      ${orientation === 'vertical' 
        ? 'h-full w-2.5 border-l border-l-transparent p-[1px] pr-[1px]' 
        : 'h-2.5 flex-col border-t border-t-transparent p-[1px] pt-[1px]'}
      ${className}
    `}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={`
        relative flex-1 rounded-full bg-cyberhand-green/50 hover:bg-cyberhand-green/70
        ${orientation === 'vertical' ? 'w-1.5' : 'h-1.5'}
      `}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));

ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
