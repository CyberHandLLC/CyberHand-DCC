import React, { useState } from 'react';
import DynamicContentSection from '../components/DynamicContentSection';
import { Mail, MapPin, Phone, Globe, MessageSquare, Send, Clock } from 'lucide-react';

// Define sections for the Contact page
const CONTACT_SECTIONS = [
  { id: 'GetInTouch', label: 'Get In Touch' },
  { id: 'Locations', label: 'Our Locations' },
  { id: 'Support', label: 'Support' }
];

const Contact: React.FC = () => {
  const [activeSection, setActiveSection] = useState('GetInTouch');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    services: [] as string[]
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, services: [...prev.services, value] };
      } else {
        return { ...prev, services: prev.services.filter(service => service !== value) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the form data to your backend
    setSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        services: []
      });
      setSubmitted(false);
    }, 5000);
  };

  // Office locations data
  const officeLocations = [
    {
      id: 1,
      city: 'San Francisco',
      address: '123 Tech Boulevard, San Francisco, CA 94105',
      phone: '+1 (415) 555-0123',
      email: 'sf@cyberhand.com',
      hours: 'Mon-Fri: 9AM-6PM PST'
    },
    {
      id: 2,
      city: 'New York',
      address: '456 Digital Avenue, New York, NY 10001',
      phone: '+1 (212) 555-0456',
      email: 'ny@cyberhand.com',
      hours: 'Mon-Fri: 9AM-6PM EST'
    },
    {
      id: 3,
      city: 'London',
      address: '78 Innovation Street, London, EC2A 4NE, UK',
      phone: '+44 20 7123 4567',
      email: 'london@cyberhand.com',
      hours: 'Mon-Fri: 9AM-6PM GMT'
    },
    {
      id: 4,
      city: 'Singapore',
      address: '910 Tech Tower, Singapore 018956',
      phone: '+65 6123 4567',
      email: 'singapore@cyberhand.com',
      hours: 'Mon-Fri: 9AM-6PM SGT'
    }
  ];

  // Support channels data
  const supportChannels = [
    {
      id: 1,
      title: 'Technical Support',
      description: 'Get help with technical issues related to our services.',
      icon: <MessageSquare className="w-10 h-10" />,
      contactMethod: 'Email: support@cyberhand.com',
      additionalInfo: 'Response time: Within 24 hours'
    },
    {
      id: 2,
      title: 'Customer Service',
      description: 'Questions about your account, billing, or general inquiries.',
      icon: <Mail className="w-10 h-10" />,
      contactMethod: 'Email: customerservice@cyberhand.com',
      additionalInfo: 'Response time: Within 12 hours'
    },
    {
      id: 3,
      title: 'Sales Inquiries',
      description: 'Interested in our services? Our sales team is ready to assist you.',
      icon: <Phone className="w-10 h-10" />,
      contactMethod: 'Phone: +1 (800) 555-1234',
      additionalInfo: 'Available Mon-Fri: 8AM-8PM EST'
    },
    {
      id: 4,
      title: 'Live Chat',
      description: 'Get immediate assistance through our live chat service.',
      icon: <MessageSquare className="w-10 h-10" />,
      contactMethod: 'Available on our website',
      additionalInfo: 'Available 24/7'
    }
  ];

  return (
    <div className="w-full h-full">
      <DynamicContentSection
        sections={CONTACT_SECTIONS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {/* Get In Touch Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Mail className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Get In Touch</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                
                {submitted ? (
                  <div className="bg-cyberhand-green/20 border border-cyberhand-green/50 rounded-lg p-6 text-center">
                    <Send className="w-12 h-12 text-cyberhand-green mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-white/70">
                      Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name <span className="text-cyberhand-green">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyberhand-green/50"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address <span className="text-cyberhand-green">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyberhand-green/50"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-2">
                          Company Name
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyberhand-green/50"
                          placeholder="Your Company"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyberhand-green/50"
                          placeholder="+1 (123) 456-7890"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject <span className="text-cyberhand-green">*</span>
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyberhand-green/50"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message <span className="text-cyberhand-green">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-black/20 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyberhand-green/50"
                        placeholder="Tell us more about your project or inquiry..."
                      />
                    </div>
                    
                    <div>
                      <p className="block text-sm font-medium mb-2">
                        I&apos;m interested in: (select all that apply)
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {['Web Development', 'AI Integration', 'Cloud Hosting', 'Digital Marketing', 'Consulting', 'Support'].map(service => (
                          <label key={service} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="services"
                              value={service}
                              checked={formData.services.includes(service)}
                              onChange={handleCheckboxChange}
                              className="rounded border-white/30 text-cyberhand-green focus:ring-cyberhand-green/50"
                            />
                            <span>{service}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-cyberhand-green hover:bg-cyberhand-green/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyberhand-green transition-colors"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              {/* Contact Information */}
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-cyberhand-green flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Main Headquarters</h3>
                      <p className="text-white/70">123 Tech Boulevard, San Francisco, CA 94105</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-cyberhand-green flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-white/70">+1 (415) 555-0123</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-cyberhand-green flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-white/70">info@cyberhand.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Globe className="w-6 h-6 text-cyberhand-green flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Website</h3>
                      <p className="text-white/70">www.cyberhand.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-cyberhand-green flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Business Hours</h3>
                      <p className="text-white/70">Monday to Friday: 9AM - 6PM PST</p>
                      <p className="text-white/70">Saturday & Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {['facebook', 'twitter', 'linkedin', 'instagram'].map(social => (
                      <a
                        key={social}
                        href={`https://${social}.com/cyberhand`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyberhand-green/20 transition-colors"
                      >
                        <span className="sr-only">{social}</span>
                        {/* Placeholder for social media icons */}
                        <div className="w-5 h-5 text-cyberhand-green"></div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Locations Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <MapPin className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Our Locations</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                CyberHand has a global presence with offices strategically located around the world.
                Visit us at one of our locations or reach out to the office nearest to you.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {officeLocations.map(office => (
                  <div 
                    key={office.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 transition-all hover:border-cyberhand-green/50 hover:shadow-lg hover:shadow-cyberhand-green/10 p-6"
                  >
                    <h2 className="text-2xl font-bold mb-4">{office.city}</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-cyberhand-green flex-shrink-0 mt-1" />
                        <p className="text-white/70">{office.address}</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-cyberhand-green flex-shrink-0 mt-1" />
                        <p className="text-white/70">{office.phone}</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-cyberhand-green flex-shrink-0 mt-1" />
                        <p className="text-white/70">{office.email}</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-cyberhand-green flex-shrink-0 mt-1" />
                        <p className="text-white/70">{office.hours}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(office.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-cyberhand-green hover:text-cyberhand-green/80 transition-colors"
                      >
                        View on Map
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Global Reach</h2>
                <p className="text-lg mb-4">
                  Beyond our physical offices, CyberHand provides services worldwide with remote teams and partners in:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Australia', 'Brazil', 'Canada', 'France', 'Germany', 'India', 'Japan', 'South Korea'].map(country => (
                    <div key={country} className="px-4 py-2 bg-white/5 rounded-md border border-white/10">
                      {country}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <MessageSquare className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Support</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Our dedicated support team is here to help you with any questions or issues you may have.
                Choose the support channel that best fits your needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {supportChannels.map(channel => (
                  <div 
                    key={channel.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 transition-all hover:border-cyberhand-green/50 hover:shadow-lg hover:shadow-cyberhand-green/10 p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyberhand-green/20 text-cyberhand-green">
                        {channel.icon}
                      </div>
                      <h2 className="text-2xl font-bold">{channel.title}</h2>
                    </div>
                    
                    <p className="text-white/70 mb-6">{channel.description}</p>
                    
                    <div className="space-y-2">
                      <p className="font-semibold">{channel.contactMethod}</p>
                      <p className="text-sm text-white/50">{channel.additionalInfo}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 p-6 mt-12">
                <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      question: 'How quickly can I expect a response to my support request?',
                      answer: 'For standard support, we aim to respond within 24 hours. Premium support clients receive responses within 4 hours during business hours.'
                    },
                    {
                      question: 'Do you offer support outside of business hours?',
                      answer: 'Yes, our emergency support team is available 24/7 for critical issues. Standard support requests submitted outside business hours will be addressed the next business day.'
                    },
                    {
                      question: 'How do I upgrade to premium support?',
                      answer: 'Premium support is included in our Enterprise package. You can also add it to any other service package for an additional fee. Contact our sales team for more information.'
                    },
                    {
                      question: 'What information should I include in my support request?',
                      answer: 'To help us address your issue quickly, please include your account information, a detailed description of the problem, steps to reproduce the issue, and any error messages or screenshots.'
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                      <p className="text-white/70">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DynamicContentSection>
    </div>
  );
};

export default Contact;
