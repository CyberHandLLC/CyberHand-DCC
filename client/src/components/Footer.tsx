import React from 'react';
import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon, GithubIcon } from 'lucide-react';

interface FooterProps {
  theme?: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full py-6 ${isDark ? 'bg-cyberhand-dark text-white' : 'bg-white text-cyberhand-dark'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="text-xl font-bold">
              <span className="font-montserrat">CyberHand</span>
            </div>
            <p className={`max-w-xs ${isDark ? 'text-white/70' : 'text-cyberhand-dark/70'}`}>
              Your digital growth partner, offering web development, marketing, cloud hosting, and AI integration solutions.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className={`space-y-2 ${isDark ? 'text-white/70' : 'text-cyberhand-dark/70'}`}>
              <li>
                <a href="/services" className="hover:text-cyberhand-green transition-colors">Services</a>
              </li>
              <li>
                <a href="/portfolio" className="hover:text-cyberhand-green transition-colors">Our Work</a>
              </li>
              <li>
                <a href="/packages" className="hover:text-cyberhand-green transition-colors">Packages</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-cyberhand-green transition-colors">Contact</a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-cyberhand-green transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className={`space-y-2 ${isDark ? 'text-white/70' : 'text-cyberhand-dark/70'}`}>
              <li>Email: info@cyberhand.com</li>
              <li>Phone: +1-123-456-7890</li>
              <li>Address: 123 Digital Avenue, Tech City, 12345</li>
            </ul>
            
            {/* Social media icons */}
            <div className="flex space-x-4 mt-4">
              <a href="https://www.facebook.com/cyberhand" className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-cyberhand-dark/10'}`}>
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="https://www.twitter.com/cyberhand" className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-cyberhand-dark/10'}`}>
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/cyberhand" className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-cyberhand-dark/10'}`}>
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/cyberhand" className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-cyberhand-dark/10'}`}>
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="https://www.github.com/cyberhand" className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-cyberhand-dark/10'}`}>
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className={`mt-8 pt-4 border-t ${isDark ? 'border-white/10 text-white/50' : 'border-cyberhand-dark/10 text-cyberhand-dark/50'} text-sm text-center`}>
          <p>&copy; {currentYear} CyberHand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
