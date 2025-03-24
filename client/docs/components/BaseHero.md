# BaseHero Component

## Overview

The `BaseHero` component provides a standardized hero section for marketing pages with consistent layout structure, responsive design, and theme awareness. It's primarily used for landing pages, feature introductions, and call-to-action sections.

## Why Standardization Was Needed

Prior to the standardized `BaseHero` component, the application had:

- Inconsistent hero section layouts across marketing pages
- Duplicate responsive design code
- Varying approaches to content alignment
- Inconsistent padding and spacing
- No standardized handling of background images and overlays

## Component Interface

```typescript
interface BaseHeroProps {
  /** Main heading text */
  heading: string;
  
  /** Subheading or description text */
  subheading?: string;
  
  /** Image URL for the hero background or illustration */
  image?: string;
  
  /** Whether the image should be placed on the right (default) or left */
  imagePosition?: 'left' | 'right';
  
  /** Primary CTA button text */
  primaryButtonText?: string;
  
  /** Primary CTA button action */
  onPrimaryButtonClick?: () => void;
  
  /** Secondary CTA button text */
  secondaryButtonText?: string;
  
  /** Secondary CTA button action */
  onSecondaryButtonClick?: () => void;
  
  /** Whether to use a dark background */
  darkBackground?: boolean;
  
  /** Additional content to display below the main content */
  children?: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** CSS classes for the heading */
  headingClassName?: string;
  
  /** CSS classes for the content container */
  contentClassName?: string;
}
```

## Features

1. **Theme Awareness**: Automatically adapts to light or dark theme
2. **Responsive Design**: Properly adapts to different screen sizes
3. **Flexible Layout**: Support for different image positions
4. **Call-to-Action Buttons**: Built-in support for primary and secondary CTAs
5. **Custom Content Support**: Ability to add custom content below the main elements
6. **Background Options**: Support for dark backgrounds and image overlays

## Usage Examples

### Basic Usage

```tsx
import { BaseHero } from '../components/ui/BaseHero';

<BaseHero
  heading="Powerful Analytics for Your Business"
  subheading="Get insights into your business performance with our advanced analytics platform."
  primaryButtonText="Get Started"
  onPrimaryButtonClick={() => navigate('/signup')}
  secondaryButtonText="Learn More"
  onSecondaryButtonClick={() => navigate('/features')}
  image="/images/analytics-dashboard.png"
/>
```

### With Dark Background

```tsx
<BaseHero
  heading="Transform Your Workflow"
  subheading="Our tools help businesses streamline operations and increase productivity."
  primaryButtonText="Start Free Trial"
  onPrimaryButtonClick={() => navigate('/trial')}
  secondaryButtonText="Watch Demo"
  onSecondaryButtonClick={() => setShowDemoVideo(true)}
  image="/images/workflow-illustration.png"
  darkBackground
/>
```

### Left-Aligned Image

```tsx
<BaseHero
  heading="Security First Approach"
  subheading="Enterprise-grade security to protect your most valuable data."
  primaryButtonText="Learn About Security"
  onPrimaryButtonClick={() => navigate('/security')}
  image="/images/security-shield.png"
  imagePosition="left"
/>
```

### With Custom Content

```tsx
<BaseHero
  heading="Trusted by Industry Leaders"
  subheading="Join thousands of companies that rely on our platform daily."
  primaryButtonText="Join Them"
  onPrimaryButtonClick={() => navigate('/signup')}
>
  <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-6">
    {logos.map((logo) => (
      <div key={logo.id} className="col-span-1 flex justify-center">
        <img className="h-12" src={logo.src} alt={logo.name} />
      </div>
    ))}
  </div>
</BaseHero>
```

### With Custom Styling

```tsx
<BaseHero
  heading="Revolutionize Your Marketing"
  subheading="AI-powered tools to supercharge your marketing campaigns."
  primaryButtonText="Start Now"
  onPrimaryButtonClick={() => navigate('/marketing-tools')}
  image="/images/marketing-graphic.png"
  className="bg-gradient-to-r from-blue-500 to-purple-600"
  headingClassName="text-white"
  contentClassName="text-white"
/>
```

## Best Practices

1. **Keep heading text concise** (4-8 words typically)
2. **Use action-oriented button text** ("Get Started" rather than "Submit")
3. **Ensure image quality** is high and properly compressed
4. **Maintain consistent style** across multiple hero sections
5. **Test on multiple devices** to ensure responsive behavior
6. **Use dark backgrounds sparingly** for maximum impact

## Content Guidelines

1. **Heading**: Should be a clear value proposition
2. **Subheading**: Provides more detail about the value proposition (1-2 sentences)
3. **Primary Button**: Main call-to-action for the page
4. **Secondary Button**: Alternative action, typically less commitment than primary
5. **Image**: Should reinforce the message visually

## Migration Guide

To migrate from custom hero implementations to the standardized component:

1. Import the BaseHero component
2. Replace custom hero sections with the BaseHero component
3. Move heading and description text to the appropriate props
4. Configure button text and actions
5. Add your hero image

### Before:

```tsx
<div className="relative bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
      <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
        <div className="sm:text-center lg:text-left">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Powerful Analytics</span>
            <span className="block text-blue-600 xl:inline">for Your Business</span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Get insights into your business performance with our advanced analytics platform.
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <a
                href="/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </a>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <a
                href="/features"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
  <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
    <img
      className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
      src="/images/analytics-dashboard.png"
      alt="Analytics Dashboard"
    />
  </div>
</div>
```

### After:

```tsx
import { BaseHero } from '../components/ui/BaseHero';

<BaseHero
  heading="Powerful Analytics for Your Business"
  subheading="Get insights into your business performance with our advanced analytics platform."
  primaryButtonText="Get Started"
  onPrimaryButtonClick={() => navigate('/signup')}
  secondaryButtonText="Learn More"
  onSecondaryButtonClick={() => navigate('/features')}
  image="/images/analytics-dashboard.png"
/>
```
