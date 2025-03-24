import React, { useState } from 'react';
import DynamicContentSection from '../components/DynamicContentSection';
import { Server, Cloud, Shield, Database, Clock } from 'lucide-react';

// Define sections for the Cloud Hosting page
const CLOUD_SECTIONS = [
  { id: 'Overview', label: 'Overview' },
  { id: 'ManagedHosting', label: 'Managed Hosting' },
  { id: 'Serverless', label: 'Serverless Solutions' },
  { id: 'Security', label: 'Security & Compliance' },
  { id: 'Pricing', label: 'Pricing Plans' }
];

const ExpandedCloudHosting: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Overview');

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="w-full h-full">
      <DynamicContentSection
        sections={CLOUD_SECTIONS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {/* Overview Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Cloud className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Cloud Hosting</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                CyberHand provides reliable, scalable cloud infrastructure solutions tailored to your business needs.
                Our cloud hosting services ensure optimal performance, security, and uptime for your applications and websites.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Server className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Infrastructure as a Service</h3>
                  <p>
                    Flexible, on-demand access to computing resources, storage, and networking
                    that scale with your business needs.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Cloud className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Platform as a Service</h3>
                  <p>
                    Complete development and deployment environments in the cloud,
                    with resources that enable you to deliver everything from simple apps to sophisticated enterprise applications.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Database className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Database Solutions</h3>
                  <p>
                    Managed database services that offer high availability, security,
                    and scalability without the operational overhead.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Shield className="w-8 h-8 text-cyberhand-green mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Security & Compliance</h3>
                  <p>
                    Comprehensive security measures including encryption, firewalls, intrusion detection,
                    and compliance with industry standards.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Why Choose Our Cloud Hosting Solutions?</h2>
                <ul className="space-y-4">
                  <li className="flex gap-4 items-start">
                    <span className="bg-cyberhand-green text-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                    <p>99.9% uptime guarantee for all our hosting services</p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-cyberhand-green text-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                    <p>24/7 monitoring and technical support from cloud experts</p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-cyberhand-green text-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                    <p>Automatic backups and disaster recovery options</p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="bg-cyberhand-green text-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                    <p>Pay-as-you-go pricing with no hidden costs</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Managed Hosting Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Server className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Managed Hosting</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Our managed hosting services provide you with a worry-free experience. We handle all the technical
                aspects of server management so you can focus on your business.
              </p>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h3 className="text-2xl font-semibold mb-4">What&apos;s Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Server setup and configuration</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Operating system updates and patches</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Performance optimization</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Security monitoring and threat detection</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Automated backups and recovery</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Load balancing and auto-scaling</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>24/7 technical support</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyberhand-green">•</span>
                    <p>Content Delivery Network (CDN) integration</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Managed Hosting Solutions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-2">Managed VPS</h3>
                    <p>Dedicated virtual resources with full root access and our expert management.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-2">Managed Kubernetes</h3>
                    <p>Simplified container orchestration with automated deployment, scaling, and operations.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-2">Managed Cloud Servers</h3>
                    <p>Scalable cloud instances optimized for performance and reliability.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Serverless Solutions Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Cloud className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Serverless Solutions</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Embrace the future of cloud computing with our serverless architecture solutions.
                Build and run applications without thinking about servers, with automatic scaling
                and pay-only-for-what-you-use pricing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Function as a Service (FaaS)</h3>
                  <p>
                    Run code in response to events without provisioning or managing servers.
                    Perfect for microservices and event-driven architectures.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Serverless Databases</h3>
                  <p>
                    Auto-scaling database solutions that provide on-demand capacity
                    with minimal administration.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Serverless API Gateway</h3>
                  <p>
                    Create, publish, and secure APIs at any scale without managing infrastructure.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Event Processing</h3>
                  <p>
                    Process streaming data in real-time with serverless architecture for immediate insights.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mt-8">
                <h3 className="text-2xl font-semibold mb-4">Benefits of Serverless Architecture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Reduced Operational Costs</h4>
                    <p>Only pay for the compute time you consume, not for idle servers.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Auto-Scaling</h4>
                    <p>Applications automatically scale with usage, from one request per day to thousands per second.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Faster Time to Market</h4>
                    <p>Focus on writing code rather than managing and operating servers.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-cyberhand-green">Built-in Fault Tolerance</h4>
                    <p>Serverless applications have built-in availability and fault tolerance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Compliance Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Security & Compliance</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                We prioritize the security of your data and applications. Our cloud hosting solutions
                include comprehensive security measures and compliance with industry standards.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Data Encryption</h3>
                  <p>
                    End-to-end encryption for data at rest and in transit to protect
                    sensitive information from unauthorized access.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Firewall Protection</h3>
                  <p>
                    Advanced firewall configurations to control network traffic and
                    block potential threats.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">DDoS Mitigation</h3>
                  <p>
                    Robust protection against distributed denial-of-service attacks
                    to ensure continuous availability.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">Regular Security Audits</h3>
                  <p>
                    Continuous monitoring and periodic security assessments to identify
                    and address potential vulnerabilities.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Compliance Standards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">GDPR</h3>
                    <p className="text-center">General Data Protection Regulation compliance for handling personal data.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">HIPAA</h3>
                    <p className="text-center">Health Insurance Portability and Accountability Act compliance for healthcare data.</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">PCI DSS</h3>
                    <p className="text-center">Payment Card Industry Data Security Standard compliance for handling payment information.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
              <Clock className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Pricing Plans</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Transparent, flexible pricing options designed to fit businesses of all sizes.
                Choose the plan that best meets your needs with no hidden costs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {/* Basic Plan */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">Starter Cloud</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-sm">/month</span>
                  </div>
                  <p className="text-sm mb-6">Perfect for personal projects and small websites</p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>2 vCPUs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>4GB RAM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>80GB SSD Storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>2TB Data Transfer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>Daily Backups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>Basic Support</span>
                    </li>
                  </ul>
                  <button className="w-full py-2 bg-cyberhand-green text-black font-semibold rounded-md hover:bg-cyberhand-green/90 transition-colors">
                    Select Plan
                  </button>
                </div>
                
                {/* Pro Plan */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-cyberhand-green flex flex-col relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyberhand-green text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Business Cloud</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$89</span>
                    <span className="text-sm">/month</span>
                  </div>
                  <p className="text-sm mb-6">Ideal for growing businesses and applications</p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>4 vCPUs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>8GB RAM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>160GB SSD Storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>5TB Data Transfer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>Daily Backups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>24/7 Priority Support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>Load Balancing</span>
                    </li>
                  </ul>
                  <button className="w-full py-2 bg-cyberhand-green text-black font-semibold rounded-md hover:bg-cyberhand-green/90 transition-colors">
                    Select Plan
                  </button>
                </div>
                
                {/* Enterprise Plan */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 flex flex-col">
                  <h3 className="text-xl font-semibold mb-2">Enterprise Cloud</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$249</span>
                    <span className="text-sm">/month</span>
                  </div>
                  <p className="text-sm mb-6">For high-performance and mission-critical applications</p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>8 vCPUs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>16GB RAM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>320GB SSD Storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>10TB Data Transfer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>Hourly Backups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>24/7 Dedicated Support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>Auto-Scaling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyberhand-green text-lg">✓</span>
                      <span>Multi-region Deployment</span>
                    </li>
                  </ul>
                  <button className="w-full py-2 bg-cyberhand-green text-black font-semibold rounded-md hover:bg-cyberhand-green/90 transition-colors">
                    Select Plan
                  </button>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="mb-4">Need a custom solution? Contact us for personalized pricing.</p>
                <button className="px-6 py-2 border border-cyberhand-green text-cyberhand-green rounded-md hover:bg-cyberhand-green/10 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </DynamicContentSection>
    </div>
  );
};

export default ExpandedCloudHosting;
