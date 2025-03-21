import React, { useState } from 'react';
import DynamicContentSection from '../components/DynamicContentSection';
import { FileText, Download, ExternalLink, BookOpen, BarChart, Code } from 'lucide-react';

// Define sections for the Resources page
const RESOURCE_SECTIONS = [
  { id: 'Guides', label: 'Guides & Tutorials' },
  { id: 'Templates', label: 'Templates' },
  { id: 'Tools', label: 'Tools & Calculators' },
  { id: 'CaseStudies', label: 'Case Studies' },
  { id: 'Webinars', label: 'Webinars & Events' }
];

// Sample resources data
const RESOURCES = {
  Guides: [
    {
      id: 1,
      title: 'Complete Guide to Modern Web Development',
      description: 'A comprehensive guide covering HTML5, CSS3, JavaScript, and modern frameworks.',
      icon: <Code />,
      downloadLink: '/resources/guides/modern-web-dev-guide.pdf',
      type: 'PDF Guide',
      size: '4.2 MB'
    },
    {
      id: 2,
      title: 'Ultimate SEO Checklist for 2023',
      description: 'Step-by-step checklist to optimize your website for search engines.',
      icon: <FileText />,
      downloadLink: '/resources/guides/seo-checklist-2023.pdf',
      type: 'PDF Checklist',
      size: '2.8 MB'
    },
    {
      id: 3,
      title: 'Getting Started with AI Integration',
      description: 'Learn how to incorporate AI into your existing business applications.',
      icon: <BookOpen />,
      downloadLink: '/resources/guides/ai-integration-basics.pdf',
      type: 'PDF Guide',
      size: '5.1 MB'
    },
    {
      id: 4,
      title: 'Cloud Hosting Setup Tutorial',
      description: 'A beginner-friendly tutorial on setting up cloud infrastructure.',
      icon: <FileText />,
      downloadLink: '/resources/guides/cloud-hosting-tutorial.pdf',
      type: 'PDF Tutorial',
      size: '3.7 MB'
    }
  ],
  Templates: [
    {
      id: 5,
      title: 'Responsive Website Template Pack',
      description: 'Collection of 5 modern, responsive website templates for various industries.',
      icon: <Code />,
      downloadLink: '/resources/templates/responsive-templates.zip',
      type: 'ZIP Archive',
      size: '12.6 MB'
    },
    {
      id: 6,
      title: 'Digital Marketing Strategy Template',
      description: 'Editable template to create your comprehensive digital marketing strategy.',
      icon: <FileText />,
      downloadLink: '/resources/templates/marketing-strategy-template.docx',
      type: 'Word Document',
      size: '1.8 MB'
    },
    {
      id: 7,
      title: 'Social Media Content Calendar',
      description: 'Plan and organize your social media content with this ready-to-use calendar.',
      icon: <FileText />,
      downloadLink: '/resources/templates/social-media-calendar.xlsx',
      type: 'Excel Spreadsheet',
      size: '1.2 MB'
    },
    {
      id: 8,
      title: 'UX/UI Design System Kit',
      description: 'Complete design system with components, styles, and guidelines for consistent interfaces.',
      icon: <FileText />,
      downloadLink: '/resources/templates/design-system-kit.zip',
      type: 'ZIP Archive',
      size: '18.5 MB'
    }
  ],
  Tools: [
    {
      id: 9,
      title: 'Website Performance Calculator',
      description: 'Estimate load times and identify performance bottlenecks on your website.',
      icon: <BarChart />,
      externalLink: 'https://tools.cyberhand.com/performance-calculator',
      type: 'Web App',
      access: 'Free Access'
    },
    {
      id: 10,
      title: 'SEO ROI Calculator',
      description: 'Calculate the potential return on investment for your SEO efforts.',
      icon: <BarChart />,
      externalLink: 'https://tools.cyberhand.com/seo-roi-calculator',
      type: 'Web App',
      access: 'Free Access'
    },
    {
      id: 11,
      title: 'Cloud Hosting Cost Estimator',
      description: 'Estimate your monthly cloud hosting costs based on your specific requirements.',
      icon: <BarChart />,
      externalLink: 'https://tools.cyberhand.com/cloud-cost-estimator',
      type: 'Web App',
      access: 'Free Access'
    },
    {
      id: 12,
      title: 'AI Implementation Readiness Assessment',
      description: 'Assess your organization\'s readiness for AI implementation with this interactive tool.',
      icon: <BarChart />,
      externalLink: 'https://tools.cyberhand.com/ai-readiness',
      type: 'Web App',
      access: 'Free Access'
    }
  ],
  CaseStudies: [
    {
      id: 13,
      title: 'E-commerce Revenue Growth: TechGear Case Study',
      description: 'How we helped TechGear increase online revenue by 157% in 6 months.',
      icon: <FileText />,
      downloadLink: '/resources/case-studies/techgear-ecommerce.pdf',
      type: 'PDF Case Study',
      size: '3.2 MB'
    },
    {
      id: 14,
      title: 'AI-Powered Customer Service: ServicePro Success Story',
      description: 'Implementation of AI chatbots that reduced support costs by 42% for ServicePro.',
      icon: <FileText />,
      downloadLink: '/resources/case-studies/servicepro-ai-customer-service.pdf',
      type: 'PDF Case Study',
      size: '2.9 MB'
    },
    {
      id: 15,
      title: 'Cloud Migration: FinTech Security Upgrade',
      description: 'Secure cloud migration for a financial technology company handling sensitive data.',
      icon: <FileText />,
      downloadLink: '/resources/case-studies/fintech-cloud-migration.pdf',
      type: 'PDF Case Study',
      size: '4.1 MB'
    },
    {
      id: 16,
      title: 'Digital Transformation: Manufacturing Sector',
      description: 'Complete digital transformation strategy for a traditional manufacturing company.',
      icon: <FileText />,
      downloadLink: '/resources/case-studies/manufacturing-digital-transformation.pdf',
      type: 'PDF Case Study',
      size: '5.7 MB'
    }
  ],
  Webinars: [
    {
      id: 17,
      title: 'The Future of Web Development [Recorded Webinar]',
      description: 'Expert panel discussion on upcoming trends and technologies in web development.',
      icon: <ExternalLink />,
      externalLink: 'https://webinars.cyberhand.com/future-web-dev',
      type: 'Recorded Webinar',
      duration: '65 minutes'
    },
    {
      id: 18,
      title: 'AI for Small Businesses [Upcoming Event]',
      description: 'Live webinar on practical AI applications for small and medium businesses.',
      icon: <ExternalLink />,
      externalLink: 'https://webinars.cyberhand.com/ai-small-business',
      type: 'Upcoming Webinar',
      date: 'July 15, 2023'
    },
    {
      id: 19,
      title: 'Advanced SEO Strategies [Recorded Webinar]',
      description: 'Deep dive into advanced SEO techniques that deliver real results.',
      icon: <ExternalLink />,
      externalLink: 'https://webinars.cyberhand.com/advanced-seo',
      type: 'Recorded Webinar',
      duration: '72 minutes'
    },
    {
      id: 20,
      title: 'Cybersecurity Best Practices [Upcoming Event]',
      description: 'Essential cybersecurity measures for protecting your business in the digital age.',
      icon: <ExternalLink />,
      externalLink: 'https://webinars.cyberhand.com/cybersecurity-practices',
      type: 'Upcoming Webinar',
      date: 'August 3, 2023'
    }
  ]
};

const Resources: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Guides');

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Render resource cards
  const renderResourceCards = (category: string) => {
    const resources = RESOURCES[category as keyof typeof RESOURCES] || [];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map(resource => (
          <div key={resource.id} className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 transition-all hover:border-cyberhand-green/50 hover:shadow-lg hover:shadow-cyberhand-green/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-cyberhand-green/20 text-cyberhand-green">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold">{resource.title}</h3>
            </div>
            
            <p className="text-white/70 mb-6">{resource.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-white/50">
                {resource.type} 
                {'size' in resource && resource.size && <span> • {resource.size}</span>}
                {'duration' in resource && resource.duration && <span> • {resource.duration}</span>}
                {'date' in resource && resource.date && <span> • {resource.date}</span>}
                {'access' in resource && resource.access && <span> • {resource.access}</span>}
              </div>
              
              {'downloadLink' in resource && resource.downloadLink && (
                <a 
                  href={resource.downloadLink} 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyberhand-green/20 text-cyberhand-green hover:bg-cyberhand-green/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              )}
              
              {'externalLink' in resource && resource.externalLink && (
                <a 
                  href={resource.externalLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyberhand-green/20 text-cyberhand-green hover:bg-cyberhand-green/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Access</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <DynamicContentSection
        sections={RESOURCE_SECTIONS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {/* Guides & Tutorials Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <BookOpen className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Guides & Tutorials</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Access our comprehensive guides and step-by-step tutorials to enhance your knowledge
                and skills in web development, digital marketing, AI integration, and more.
              </p>
              
              <div className="mt-8">
                {renderResourceCards('Guides')}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <FileText className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Templates</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Download our professional templates to jumpstart your projects and streamline your workflow.
                From website templates to marketing plans, we've got you covered.
              </p>
              
              <div className="mt-8">
                {renderResourceCards('Templates')}
              </div>
            </div>
          </div>
        </div>

        {/* Tools & Calculators Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <BarChart className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Tools & Calculators</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Utilize our free online tools and calculators to analyze performance, estimate costs,
                and make data-driven decisions for your business.
              </p>
              
              <div className="mt-8">
                {renderResourceCards('Tools')}
              </div>
            </div>
          </div>
        </div>

        {/* Case Studies Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <FileText className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Case Studies</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Explore our detailed case studies showcasing real-world results and success stories
                from clients across various industries.
              </p>
              
              <div className="mt-8">
                {renderResourceCards('CaseStudies')}
              </div>
            </div>
          </div>
        </div>

        {/* Webinars & Events Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <ExternalLink className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Webinars & Events</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Register for upcoming webinars or watch recordings of past events covering the latest
                trends and insights in technology, digital marketing, and business growth.
              </p>
              
              <div className="mt-8">
                {renderResourceCards('Webinars')}
              </div>
            </div>
          </div>
        </div>
      </DynamicContentSection>
    </div>
  );
};

export default Resources;
