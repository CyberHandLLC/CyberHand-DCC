import React, { useState } from 'react';
import DynamicContentSection from '../components/DynamicContentSection';
import { TrendingUp, BarChart, Globe, Mail, Share2 } from 'lucide-react';

// Define sections for the Marketing page
const MARKETING_SECTIONS = [
  { id: 'Overview', label: 'Overview' },
  { id: 'SEO', label: 'SEO Optimization' },
  { id: 'ContentMarketing', label: 'Content Marketing' },
  { id: 'SocialMedia', label: 'Social Media' },
  { id: 'EmailMarketing', label: 'Email Marketing' }
];

const ExpandedMarketing: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Overview');

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="w-full h-full">
      <DynamicContentSection
        sections={MARKETING_SECTIONS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {/* Overview Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <TrendingUp className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Digital Marketing</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Boost your online presence and reach your target audience with our comprehensive
                digital marketing services. We develop data-driven strategies tailored to your business goals.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Globe className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">SEO Optimization</h3>
                  <p>
                    Improve your visibility in search engines with our expert SEO strategies,
                    including keyword research, on-page optimization, and technical SEO.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <BarChart className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Content Marketing</h3>
                  <p>
                    Engage your audience with high-quality, relevant content that establishes your authority,
                    builds trust, and drives organic traffic.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Share2 className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Social Media Management</h3>
                  <p>
                    Build a strong social media presence with strategic content, community management,
                    and targeted advertising campaigns.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Mail className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Email Marketing</h3>
                  <p>
                    Connect directly with your audience through personalized email campaigns that
                    nurture leads and drive conversions.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Our Marketing Approach</h2>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
                    <div>
                      <h4 className="font-semibold">Research & Analysis</h4>
                      <p>We analyze your industry, competitors, and target audience to develop an effective strategy.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <h4 className="font-semibold">Strategy Development</h4>
                      <p>Based on our research, we create a comprehensive marketing plan aligned with your business goals.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
                    <div>
                      <h4 className="font-semibold">Implementation</h4>
                      <p>We execute the strategy across the most effective channels for your audience.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
                    <div>
                      <h4 className="font-semibold">Monitoring & Optimization</h4>
                      <p>We continuously track performance and refine our approach to maximize results.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="bg-cyberhand-green text-black rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">5</span>
                    <div>
                      <h4 className="font-semibold">Reporting & Analysis</h4>
                      <p>Regular reports and insights to keep you informed about your campaign's performance.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Globe className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">SEO Optimization</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Improve your search engine rankings and drive organic traffic to your website.
                Our comprehensive SEO services help you reach your audience effectively.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Technical SEO</h3>
                  <p>
                    Optimize your website's technical elements, including site structure, load speed,
                    mobile responsiveness, and crawlability to improve search engine performance.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">On-Page SEO</h3>
                  <p>
                    Enhance your content, meta tags, headers, and internal linking structure
                    to make your pages more relevant for target keywords.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Off-Page SEO</h3>
                  <p>
                    Build your website's authority through backlink acquisition, social signals,
                    and other off-site optimization strategies.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Local SEO</h3>
                  <p>
                    Enhance your visibility in local search results with Google My Business optimization,
                    local citations, and geo-targeted content.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mt-8">
                <h3 className="text-2xl font-semibold mb-4">Our SEO Process</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Comprehensive Audit</h4>
                    <p>We analyze your current SEO performance, identify opportunities and develop a roadmap.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Keyword Research</h4>
                    <p>Identify high-value keywords that your target audience is searching for.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">On-Page Optimization</h4>
                    <p>Optimize your website content and structure to improve relevance and user experience.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Technical Improvements</h4>
                    <p>Enhance website performance, fix crawl errors, and improve mobile usability.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Content Strategy</h4>
                    <p>Develop high-quality, SEO-friendly content that engages your audience.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Link Building</h4>
                    <p>Acquire quality backlinks to increase your website's authority.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Marketing Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <BarChart className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Content Marketing</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Engage your audience with valuable, relevant content that attracts, informs, and converts.
                Our content marketing strategies help establish your brand as an industry authority.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Blog Content</h3>
                  <p>
                    Informative, engaging blog posts that address your audience's needs and questions
                    while improving your SEO performance.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Video Content</h3>
                  <p>
                    Compelling video content that simplifies complex ideas, demonstrates products,
                    and engages viewers across platforms.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Infographics & Visuals</h3>
                  <p>
                    Visually appealing graphics that present information in an easy-to-digest format,
                    perfect for social sharing.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Whitepapers & Case Studies</h3>
                  <p>
                    In-depth resources that showcase your expertise, address industry challenges,
                    and highlight your success stories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Share2 className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Social Media</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Build meaningful connections with your audience through strategic social media management.
                We help you grow your brand presence and engagement across platforms.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Platform Strategy</h3>
                  <p>
                    Identify the most effective social platforms for your business and develop
                    tailored strategies for each channel.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Content Creation</h3>
                  <p>
                    Develop engaging, platform-specific content that resonates with your audience
                    and encourages interaction and sharing.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Community Management</h3>
                  <p>
                    Actively engage with your audience, respond to comments, and build a loyal
                    community around your brand.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Paid Social Advertising</h3>
                  <p>
                    Strategic social media ad campaigns that target specific demographics,
                    interests, and behaviors to maximize ROI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Marketing Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Mail className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Email Marketing</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Connect directly with your audience through personalized email campaigns.
                Our email marketing strategies help nurture leads, drive conversions, and build customer loyalty.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Email Automation</h3>
                  <p>
                    Set up automated email sequences that deliver the right message at the right time,
                    nurturing leads throughout the customer journey.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Newsletter Campaigns</h3>
                  <p>
                    Regular, engaging newsletters that keep your audience informed about your brand,
                    industry insights, and valuable resources.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Personalization</h3>
                  <p>
                    Tailor email content based on recipient behavior, preferences, and demographics
                    to increase engagement and conversion rates.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Performance Analysis</h3>
                  <p>
                    Comprehensive tracking and analysis of email metrics to continuously improve
                    your campaigns and maximize results.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mt-8">
                <h3 className="text-2xl font-semibold mb-4">Email Marketing Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Direct Connection</h4>
                    <p>Communicate directly with your audience in their inbox.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">High ROI</h4>
                    <p>Email marketing consistently delivers one of the highest returns on investment.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Measurable Results</h4>
                    <p>Track opens, clicks, conversions, and more to gauge campaign effectiveness.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DynamicContentSection>
    </div>
  );
};

export default ExpandedMarketing;
