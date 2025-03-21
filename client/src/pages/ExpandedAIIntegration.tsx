import React, { useState } from 'react';
import DynamicContentSection from '../components/DynamicContentSection';
import { Code, Bot, Brain, Sparkles, LineChart } from 'lucide-react';

// Define sections for the AI Integration page
const AI_SECTIONS = [
  { id: 'Overview', label: 'Overview' },
  { id: 'Chatbots', label: 'AI Chatbots' },
  { id: 'Analytics', label: 'Predictive Analytics' },
  { id: 'NLP', label: 'Natural Language Processing' },
  { id: 'CaseStudies', label: 'Case Studies' }
];

const ExpandedAIIntegration: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Overview');

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="w-full h-full">
      <DynamicContentSection
        sections={AI_SECTIONS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {/* Overview Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Brain className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">AI Integration</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Transform your business with cutting-edge AI solutions. At CyberHand, we specialize in 
                integrating artificial intelligence technologies that drive efficiency, enhance user experiences, 
                and provide valuable insights.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Bot className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Conversational AI</h3>
                  <p>
                    Create intelligent chatbots and virtual assistants that engage with your users naturally,
                    answer questions, and automate customer support tasks.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <LineChart className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Data Analysis</h3>
                  <p>
                    Uncover patterns and insights from your data using machine learning algorithms
                    to make data-driven decisions and forecast future trends.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Code className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Custom AI Solutions</h3>
                  <p>
                    Develop tailored AI applications specific to your industry and business needs,
                    from recommendation engines to image recognition systems.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Sparkles className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">AI Strategy Consulting</h3>
                  <p>
                    Get expert guidance on incorporating AI into your business strategy to
                    maximize ROI and create competitive advantages.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Why Choose CyberHand for AI Integration?</h2>
                <ul className="space-y-4">
                  <li className="flex gap-4 items-start">
                    <span className="bg-cyberhand-green text-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                    <p>Expert team with specialized knowledge in the latest AI technologies and frameworks</p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-cyberhand-green text-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                    <p>Customized solutions tailored to your specific business challenges</p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-cyberhand-green text-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                    <p>Seamless integration with your existing systems and workflows</p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-cyberhand-green text-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                    <p>Ongoing support and training to ensure your team can leverage AI effectively</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbots Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Bot className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">AI Chatbots</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Enhance customer engagement and automate support with intelligent chatbots that understand
                natural language and provide personalized assistance 24/7.
              </p>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h3 className="text-2xl font-semibold mb-4">Features & Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Natural language understanding and processing</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Multi-channel deployment (website, messaging apps, etc.)</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Contextual conversations and memory</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Integration with existing systems (CRM, databases)</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Sentiment analysis and emotional intelligence</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Seamless human handoff for complex queries</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Analytics dashboard for performance monitoring</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Continuous learning and improvement</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Benefits of AI Chatbots</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
                    <p>Provide instant support around the clock without increasing staffing costs.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-2">Reduced Costs</h3>
                    <p>Automate routine inquiries, freeing up human agents for complex issues.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-2">Consistent Service</h3>
                    <p>Deliver accurate information and consistent interactions every time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Analytics Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <LineChart className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Predictive Analytics</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Leverage the power of AI to analyze historical data, identify patterns, and forecast future outcomes.
                Our predictive analytics solutions help you make data-driven decisions and stay ahead of the competition.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Sales Forecasting</h3>
                  <p>
                    Accurately predict future sales trends, identify seasonal patterns, and
                    optimize inventory management.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Customer Behavior Prediction</h3>
                  <p>
                    Anticipate customer actions, preferences, and needs to provide personalized
                    experiences and targeted marketing.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Risk Assessment</h3>
                  <p>
                    Identify potential risks and vulnerabilities before they impact your business,
                    enabling proactive risk management.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Demand Forecasting</h3>
                  <p>
                    Optimize resource allocation and supply chain operations with accurate
                    predictions of future demand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Natural Language Processing Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Code className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Natural Language Processing</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Harness the power of Natural Language Processing (NLP) to extract insights from text data,
                automate content generation, and create more natural human-computer interactions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Sentiment Analysis</h3>
                  <p>
                    Automatically analyze customer reviews, social media mentions, and feedback to
                    gauge sentiment and identify areas for improvement.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Content Generation</h3>
                  <p>
                    Automate the creation of product descriptions, blog posts, reports, and other
                    content with AI-powered text generation.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Text Classification</h3>
                  <p>
                    Automatically categorize and tag documents, support tickets, and other text data
                    for improved organization and faster processing.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Language Translation</h3>
                  <p>
                    Break down language barriers with AI-powered translation that maintains context
                    and nuance across multiple languages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Case Studies Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Sparkles className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Case Studies</h1>
            </div>
            
            <div className="space-y-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h3 className="text-2xl font-semibold mb-4">E-commerce Personalization Engine</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-cyberhand-green font-medium">Client:</span>
                    <p>Major Online Retailer</p>
                  </div>
                  <div>
                    <span className="text-cyberhand-green font-medium">Industry:</span>
                    <p>E-commerce</p>
                  </div>
                  <div>
                    <span className="text-cyberhand-green font-medium">Timeline:</span>
                    <p>3 months</p>
                  </div>
                </div>
                <p className="mb-4">
                  We developed an AI-powered recommendation engine that analyzes customer browsing behavior,
                  purchase history, and demographic data to deliver highly personalized product recommendations.
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold text-cyberhand-green mb-2">Results:</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <span>•</span>
                      <p>37% increase in average order value</p>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <p>24% improvement in conversion rate</p>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <p>42% increase in customer engagement with recommended products</p>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h3 className="text-2xl font-semibold mb-4">Healthcare Diagnostic Assistant</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-cyberhand-green font-medium">Client:</span>
                    <p>Regional Healthcare Network</p>
                  </div>
                  <div>
                    <span className="text-cyberhand-green font-medium">Industry:</span>
                    <p>Healthcare</p>
                  </div>
                  <div>
                    <span className="text-cyberhand-green font-medium">Timeline:</span>
                    <p>6 months</p>
                  </div>
                </div>
                <p className="mb-4">
                  We created an AI system that helps medical professionals with preliminary diagnoses by analyzing
                  patient symptoms, medical history, and diagnostic images to suggest potential conditions and treatments.
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold text-cyberhand-green mb-2">Results:</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <span>•</span>
                      <p>30% reduction in diagnosis time</p>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <p>22% increase in accurate first-time diagnoses</p>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <p>15% decrease in unnecessary diagnostic tests</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DynamicContentSection>
    </div>
  );
};

export default ExpandedAIIntegration;
