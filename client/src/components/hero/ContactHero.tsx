import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactHeroProps {
  theme?: 'light' | 'dark';
}

const ContactHero: React.FC<ContactHeroProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  
  return (
    <section className="w-full animate-fade-in">
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold font-montserrat mb-4 ${
          isDark ? 'text-white' : 'text-cyberhand-dark'
        }`}>
          Contact Us
        </h2>
        <p className={`max-w-2xl mx-auto ${
          isDark ? 'text-white/70' : 'text-cyberhand-dark/70'
        }`}>
          Have a question or ready to start your project? Get in touch with our team.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className={`p-6 rounded-lg ${
            isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-4 ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                }`}>
                  <Mail className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-500'}`}>
                    Email
                  </h4>
                  <a 
                    href="mailto:info@cyberhand.com" 
                    className={`text-base ${isDark ? 'text-white hover:text-cyberhand-green' : 'text-gray-800 hover:text-cyberhand-green'}`}
                  >
                    info@cyberhand.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-4 ${
                  isDark ? 'bg-green-900/30' : 'bg-green-100'
                }`}>
                  <Phone className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-500'}`}>
                    Phone
                  </h4>
                  <a 
                    href="tel:+11234567890" 
                    className={`text-base ${isDark ? 'text-white hover:text-cyberhand-green' : 'text-gray-800 hover:text-cyberhand-green'}`}
                  >
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className={`p-2 rounded-full mr-4 ${
                  isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <MapPin className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-500'}`}>
                    Address
                  </h4>
                  <p className={`text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    123 Digital Avenue<br />
                    Tech City, 12345<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white/80' : 'text-gray-500'}`}>
                Follow Us
              </h4>
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className={`p-2 rounded-full ${
                    isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className={`p-2 rounded-full ${
                    isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className={`p-2 rounded-full ${
                    isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className={`p-2 rounded-full ${
                    isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-lg ${
            isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Office Hours
            </h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Monday - Friday:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Saturday:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>10:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Sunday:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className={`p-6 rounded-lg ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Send Us a Message
          </h3>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="name" 
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full rounded-md px-4 py-2 ${
                    isDark 
                      ? 'bg-white/10 border-white/10 text-white focus:border-cyberhand-green' 
                      : 'border-gray-300 focus:border-cyberhand-green'
                  } outline-none transition-colors`}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label 
                  htmlFor="email" 
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full rounded-md px-4 py-2 ${
                    isDark 
                      ? 'bg-white/10 border-white/10 text-white focus:border-cyberhand-green' 
                      : 'border-gray-300 focus:border-cyberhand-green'
                  } outline-none transition-colors`}
                  placeholder="Your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label 
                htmlFor="subject" 
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className={`w-full rounded-md px-4 py-2 ${
                  isDark 
                    ? 'bg-white/10 border-white/10 text-white focus:border-cyberhand-green' 
                    : 'border-gray-300 focus:border-cyberhand-green'
                } outline-none transition-colors`}
                placeholder="Message subject"
                required
              />
            </div>
            
            <div>
              <label 
                htmlFor="message" 
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className={`w-full rounded-md px-4 py-2 ${
                  isDark 
                    ? 'bg-white/10 border-white/10 text-white focus:border-cyberhand-green' 
                    : 'border-gray-300 focus:border-cyberhand-green'
                } outline-none transition-colors`}
                placeholder="Your message"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-cyberhand-green text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
            >
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
