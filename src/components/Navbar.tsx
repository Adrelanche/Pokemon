import React from 'react';
import { Rocket } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center cursor-pointer group hover:scale-105 transition-transform" onClick={() => window.location.reload()}>
              <Rocket className="h-8 w-8 text-red-600 group-hover:text-white transition-colors" />
              <span className="ml-2 text-xl font-bold text-gray-100 group-hover:text-red-500 transition-colors">Team Rocket</span>
              <span className="ml-2 text-xl font-bold text-red-500 group-hover:text-gray-100 transition-colors">Database</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
