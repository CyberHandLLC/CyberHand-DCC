import React, { useState } from 'react';
import DynamicContentSection from '../components/DynamicContentSection';
import { Code, Globe, Server, TrendingUp } from 'lucide-react';

// Define sections for the services page
const SERVICE_SECTIONS = [
  { id: 'WebDevelopment', label: 'Web Development' },
  { id: 'Marketing', label: 'Marketing' },
  { id: 'CloudHosting', label: 'Cloud Hosting' },
  { id: 'AIIntegration', label: 'AI Integration' }
];

const ExpandedServices: React.FC = () => {
  const [activeSection, setActiveSection] = useState('WebDevelopment');

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="w-full h-full">
      <DynamicContentSection
        sections={SERVICE_SECTIONS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {/* Web Development Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Globe className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Web Development</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                We create beautiful, functional websites and web applications tailored to your specific needs.
                Our approach focuses on user experience, performance, and scalability.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Frontend Development</h3>
                  <p>
                    Modern, responsive interfaces built with React, Angular, or Vue.js that provide
                    exceptional user experiences across all devices.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Backend Development</h3>
                  <p>
                    Robust server-side solutions using Node.js, Python, or .NET to handle your business
                    logic, data storage, and API integrations.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">E-commerce Solutions</h3>
                  <p>
                    Custom online stores with secure payment processing, inventory management, and
                    seamless shopping experiences.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Progressive Web Apps</h3>
                  <p>
                    Web applications that offer app-like experiences, with offline capabilities
                    and improved performance.
                  </p>
                </div>
              </div>
              
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Our Development Process</h2>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
                    <div>
                      <h4 className="font-semibold">Discovery & Planning</h4>
                      <p>We analyze your requirements, target audience, and business goals to create a comprehensive project plan.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <h4 className="font-semibold">Design & Prototyping</h4>
                      <p>We create wireframes and interactive prototypes to visualize the user interface and experience.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
                    <div>
                      <h4 className="font-semibold">Development</h4>
                      <p>Our team develops your solution using modern technologies and best practices.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
                    <div>
                      <h4 className="font-semibold">Testing & Quality Assurance</h4>
                      <p>We rigorously test your application to ensure it works flawlessly across all devices and browsers.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">5</span>
                    <div>
                      <h4 className="font-semibold">Deployment & Support</h4>
                      <p>We launch your application and provide ongoing maintenance and support.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <TrendingUp className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Marketing</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Enhance your digital presence and grow your audience with our data-driven marketing strategies.
                We help you connect with your target audience and drive conversions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">SEO Optimization</h3>
                  <p>
                    Improve your search engine rankings with our comprehensive SEO services, including keyword research,
                    on-page optimization, and technical SEO.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Content Marketing</h3>
                  <p>
                    Engage your audience with high-quality, relevant content that establishes your authority
                    and drives organic traffic.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Social Media Management</h3>
                  <p>
                    Build a strong social media presence with strategic content, community management,
                    and targeted advertising campaigns.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Email Marketing</h3>
                  <p>
                    Connect directly with your audience through personalized email campaigns that
                    nurture leads and drive conversions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Hosting Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Server className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Cloud Hosting</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Reliable, scalable cloud infrastructure solutions to host your applications and websites.
                We ensure optimal performance, security, and uptime.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Managed Cloud Hosting</h3>
                  <p>
                    Worry-free hosting with 24/7 monitoring, automatic backups, and expert support to keep
                    your applications running smoothly.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Serverless Architecture</h3>
                  <p>
                    Modern, cost-effective solutions that automatically scale with your needs and
                    only charge you for what you use.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Database Management</h3>
                  <p>
                    Secure, optimized database solutions that ensure data integrity and
                    high-performance data access.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Security & Compliance</h3>
                  <p>
                    Robust security measures and compliance solutions to protect your data and
                    meet industry regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Integration Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Code className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">AI Integration</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Harness the power of artificial intelligence to transform your business processes and customer experiences.
                Our AI solutions help you automate tasks, gain insights, and make better decisions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">AI Chatbots</h3>
                  <p>
                    Intelligent conversational interfaces that provide instant customer support and
                    streamline user interactions.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Predictive Analytics</h3>
                  <p>
                    Data-driven insights and forecasts to help you anticipate market trends and
                    customer behaviors.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Natural Language Processing</h3>
                  <p>
                    Extract meaningful information from text data, enabling content analysis, sentiment analysis,
                    and automated content generation.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Computer Vision</h3>
                  <p>
                    Image and video analysis solutions that can identify objects, recognize faces,
                    and extract valuable information from visual data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DynamicContentSection>
    </div>
  );
};

export default ExpandedServices;
