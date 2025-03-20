import React from 'react';
import { Check } from 'lucide-react';

interface PricingFeatureProps {
  text: string;
}

const PricingFeature: React.FC<PricingFeatureProps> = ({ text }) => (
  <div className="flex items-center space-x-2">
    <div className="bg-cyberhand-green bg-opacity-20 rounded-full p-1">
      <Check className="h-4 w-4 text-cyberhand-green" />
    </div>
    <span className="text-sm">{text}</span>
  </div>
);

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  theme?: 'light' | 'dark';
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  isPopular = false,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-lg ${
      isPopular 
        ? isDark 
          ? 'bg-gradient-to-b from-cyberhand-blue/80 to-cyberhand-blue/40 border-cyberhand-green' 
          : 'bg-white border-cyberhand-green shadow-xl' 
        : isDark 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white border-gray-200'
    } border p-6 transition-transform duration-300 hover:-translate-y-1`}>
      {isPopular && (
        <div className="mb-4">
          <span className="bg-cyberhand-green text-white text-xs py-1 px-3 rounded-full">
            MOST POPULAR
          </span>
        </div>
      )}
      
      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      
      <div className="my-4">
        <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{price}</span>
        <span className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-500'}`}>/{period}</span>
      </div>
      
      <p className={`mb-6 text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{description}</p>
      
      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <PricingFeature key={index} text={feature} />
        ))}
      </div>
      
      <button 
        className={`w-full py-2 rounded-lg transition-colors ${
          isPopular
            ? 'bg-cyberhand-green text-white hover:bg-opacity-90'
            : isDark
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};

interface PackagesHeroProps {
  theme?: 'light' | 'dark';
}

const PackagesHero: React.FC<PackagesHeroProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  
  const packages = [
    {
      title: "Starter",
      price: "$399",
      period: "one-time",
      description: "Perfect for small businesses just getting started online.",
      features: [
        "Responsive website (up to 5 pages)",
        "Basic SEO setup",
        "Contact form",
        "Mobile optimization",
        "1 revision round"
      ],
      buttonText: "Get Started",
      isPopular: false
    },
    {
      title: "Business",
      price: "$899",
      period: "one-time",
      description: "Comprehensive solution for established businesses.",
      features: [
        "Responsive website (up to 10 pages)",
        "Advanced SEO optimization",
        "Content management system",
        "Google Analytics integration",
        "E-commerce functionality (up to 20 products)",
        "3 revision rounds"
      ],
      buttonText: "Get Started",
      isPopular: true
    },
    {
      title: "Enterprise",
      price: "$1,999",
      period: "one-time",
      description: "Custom solutions for large organizations with complex needs.",
      features: [
        "Custom website design",
        "Unlimited pages",
        "Advanced e-commerce features",
        "Custom database integration",
        "User authentication system",
        "API development",
        "Unlimited revisions"
      ],
      buttonText: "Contact Us",
      isPopular: false
    },
    {
      title: "Maintenance",
      price: "$49",
      period: "month",
      description: "Keep your website secure and up-to-date.",
      features: [
        "Regular software updates",
        "Security monitoring",
        "Weekly backups",
        "Technical support",
        "1 hour of content updates per month",
        "Performance optimization"
      ],
      buttonText: "Subscribe",
      isPopular: false
    }
  ];
  
  return (
    <section className="w-full animate-fade-in">
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold font-montserrat mb-4 ${
          isDark ? 'text-white' : 'text-cyberhand-dark'
        }`}>
          Our Packages
        </h2>
        <p className={`max-w-2xl mx-auto ${
          isDark ? 'text-white/70' : 'text-cyberhand-dark/70'
        }`}>
          Affordable solutions tailored to your business needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, index) => (
          <PricingCard
            key={index}
            title={pkg.title}
            price={pkg.price}
            period={pkg.period}
            description={pkg.description}
            features={pkg.features}
            buttonText={pkg.buttonText}
            isPopular={pkg.isPopular}
            theme={theme}
          />
        ))}
      </div>
      
      <div className={`mt-12 p-6 rounded-lg text-center ${
        isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Need a custom solution?
        </h3>
        <p className={`mb-4 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
          Contact us for a personalized quote tailored to your specific requirements.
        </p>
        <button className="px-6 py-3 bg-cyberhand-green text-white rounded-full hover:bg-opacity-90 transition-colors">
          Request a Quote
        </button>
      </div>
    </section>
  );
};

export default PackagesHero;
