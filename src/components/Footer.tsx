import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 border-t border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-100">
              &copy; {new Date().getFullYear()} Team Rocket API
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/Adrelanche" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-100 hover:text-gray-400 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <div className="flex items-center text-gray-100">
              <span className="mr-1">Made by Adrelanche</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;