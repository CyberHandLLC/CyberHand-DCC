import React, { useState } from 'react';
import DynamicContentSection from '../components/DynamicContentSection';
import { BookOpen, Tag, Clock, Calendar, User } from 'lucide-react';

// Define sections for the Blog page
const BLOG_SECTIONS = [
  { id: 'Featured', label: 'Featured Posts' },
  { id: 'WebDev', label: 'Web Development' },
  { id: 'AI', label: 'AI & Technology' },
  { id: 'Marketing', label: 'Digital Marketing' },
  { id: 'Business', label: 'Business Growth' }
];

// Sample blog posts data
const BLOG_POSTS = {
  Featured: [
    {
      id: 1,
      title: 'How AI is Transforming Web Development in 2023',
      excerpt: 'Discover the latest AI-powered tools and techniques that are revolutionizing the way websites are designed and developed.',
      image: '/images/blog/ai-webdev.jpg',
      author: 'Alex Johnson',
      date: 'June 15, 2023',
      readTime: '8 min read',
      tags: ['AI', 'Web Development', 'Technology']
    },
    {
      id: 2,
      title: 'The Future of Digital Marketing: Trends to Watch',
      excerpt: 'Stay ahead of the curve with these emerging digital marketing trends that are shaping the industry landscape.',
      image: '/images/blog/marketing-trends.jpg',
      author: 'Sarah Williams',
      date: 'May 28, 2023',
      readTime: '6 min read',
      tags: ['Marketing', 'Trends', 'Digital']
    },
    {
      id: 3,
      title: 'Building Scalable Cloud Infrastructure for Growing Businesses',
      excerpt: 'Learn how to design and implement cloud solutions that grow with your business needs without breaking the bank.',
      image: '/images/blog/cloud-scaling.jpg',
      author: 'Mike Chen',
      date: 'April 19, 2023',
      readTime: '10 min read',
      tags: ['Cloud', 'Infrastructure', 'Scaling']
    }
  ],
  WebDev: [
    {
      id: 4,
      title: 'Modern JavaScript Frameworks Comparison: React vs Vue vs Angular',
      excerpt: 'An in-depth analysis of the most popular JavaScript frameworks to help you choose the right one for your project.',
      image: '/images/blog/js-frameworks.jpg',
      author: 'David Miller',
      date: 'June 5, 2023',
      readTime: '12 min read',
      tags: ['JavaScript', 'Frameworks', 'React', 'Vue', 'Angular']
    },
    {
      id: 5,
      title: 'Optimizing Website Performance: A Complete Guide',
      excerpt: 'Comprehensive strategies to improve your website speed, user experience, and search engine rankings.',
      image: '/images/blog/performance.jpg',
      author: 'Emma Wilson',
      date: 'May 12, 2023',
      readTime: '9 min read',
      tags: ['Performance', 'SEO', 'UX']
    }
  ],
  AI: [
    {
      id: 6,
      title: 'Implementing Chatbots for Enhanced Customer Service',
      excerpt: 'How AI-powered chatbots can transform your customer service experience and reduce support costs.',
      image: '/images/blog/chatbots.jpg',
      author: 'Ryan Park',
      date: 'June 10, 2023',
      readTime: '7 min read',
      tags: ['AI', 'Chatbots', 'Customer Service']
    },
    {
      id: 7,
      title: 'Getting Started with Machine Learning in Business Applications',
      excerpt: 'A beginner-friendly guide to implementing machine learning solutions for common business challenges.',
      image: '/images/blog/ml-business.jpg',
      author: 'Lisa Zhang',
      date: 'April 28, 2023',
      readTime: '11 min read',
      tags: ['Machine Learning', 'Business', 'AI']
    }
  ],
  Marketing: [
    {
      id: 8,
      title: 'Content Marketing Strategies That Drive Organic Traffic',
      excerpt: 'Proven content marketing approaches to boost your organic search traffic and audience engagement.',
      image: '/images/blog/content-marketing.jpg',
      author: 'James Wilson',
      date: 'May 22, 2023',
      readTime: '8 min read',
      tags: ['Content Marketing', 'SEO', 'Traffic']
    },
    {
      id: 9,
      title: 'Social Media Advertising in 2023: Platform-by-Platform Guide',
      excerpt: 'Detailed breakdown of advertising strategies for each major social media platform to maximize your ROI.',
      image: '/images/blog/social-ads.jpg',
      author: 'Olivia Brown',
      date: 'June 2, 2023',
      readTime: '14 min read',
      tags: ['Social Media', 'Advertising', 'Digital Marketing']
    }
  ],
  Business: [
    {
      id: 10,
      title: 'Digital Transformation for Small Businesses: A Practical Approach',
      excerpt: 'Step-by-step guide to implementing digital transformation in small businesses with limited resources.',
      image: '/images/blog/digital-transform.jpg',
      author: 'Thomas Garcia',
      date: 'May 15, 2023',
      readTime: '9 min read',
      tags: ['Digital Transformation', 'Small Business', 'Strategy']
    },
    {
      id: 11,
      title: 'Building a Data-Driven Business Culture',
      excerpt: 'How to foster a data-driven decision-making culture in your organization for better outcomes.',
      image: '/images/blog/data-culture.jpg',
      author: 'Sophia Lee',
      date: 'April 5, 2023',
      readTime: '7 min read',
      tags: ['Data', 'Business Culture', 'Analytics']
    }
  ]
};

const Blog: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Featured');

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Generate blog post cards for current section
  const renderBlogPosts = (category: string) => {
    const posts = BLOG_POSTS[category as keyof typeof BLOG_POSTS] || [];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map(post => (
          <div key={post.id} className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 transition-all hover:border-cyberhand-green/50 hover:shadow-lg hover:shadow-cyberhand-green/10">
            <div className="h-48 bg-gray-700 relative overflow-hidden">
              {/* Placeholder for blog post image */}
              <div className="absolute inset-0 flex items-center justify-center text-white/30">
                <BookOpen className="w-16 h-16" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-cyberhand-green/20 text-cyberhand-green">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-white/70 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-white/50 border-t border-white/10 pt-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <DynamicContentSection
        sections={BLOG_SECTIONS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {/* Featured Posts Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <BookOpen className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Featured Posts</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Explore our most popular articles on web development, AI integration, digital marketing, and more.
                Stay up-to-date with the latest trends and insights in the digital world.
              </p>
              
              <div className="mt-8">
                {renderBlogPosts('Featured')}
              </div>
              
              <div className="mt-8 flex justify-center">
                <button className="px-6 py-2 border border-cyberhand-green text-cyberhand-green rounded-md hover:bg-cyberhand-green/10 transition-colors">
                  View All Posts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Web Development Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <Tag className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Web Development</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Dive into our articles on front-end and back-end development, best practices,
                performance optimization, and the latest web technologies.
              </p>
              
              <div className="mt-8">
                {renderBlogPosts('WebDev')}
              </div>
            </div>
          </div>
        </div>

        {/* AI & Technology Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <Tag className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">AI & Technology</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Explore the cutting-edge of artificial intelligence, machine learning,
                and how these technologies are reshaping businesses and user experiences.
              </p>
              
              <div className="mt-8">
                {renderBlogPosts('AI')}
              </div>
            </div>
          </div>
        </div>

        {/* Digital Marketing Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <Tag className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Digital Marketing</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Learn about effective marketing strategies, SEO, content marketing,
                social media management, and analytics to grow your online presence.
              </p>
              
              <div className="mt-8">
                {renderBlogPosts('Marketing')}
              </div>
            </div>
          </div>
        </div>

        {/* Business Growth Section */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-12 overflow-y-auto">
          <div className="container mx-auto py-12 max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <Tag className="w-10 h-10 text-cyberhand-green" />
              <h1 className="text-4xl font-bold">Business Growth</h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl">
                Discover insights on scaling your business, digital transformation,
                leadership, and strategies for sustainable growth in the digital era.
              </p>
              
              <div className="mt-8">
                {renderBlogPosts('Business')}
              </div>
            </div>
          </div>
        </div>
      </DynamicContentSection>
    </div>
  );
};

export default Blog;
