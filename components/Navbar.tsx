
import React from 'react';
import { Box } from 'lucide-react';

interface NavbarProps {
  onNav: (view: 'explore' | 'vr' | 'agent' | 'admin') => void;
  activeView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNav, activeView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNav('explore')}>
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white mr-3 font-bold text-xl">
              M
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block"><span className="text-green-600">MY</span> Abang Durian</h1>
          </div>
          <div className="flex space-x-2 sm:space-x-4">
            <button 
              onClick={() => onNav('explore')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'explore' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
            >
              Explore
            </button>
            <button 
              onClick={() => onNav('vr')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeView === 'vr' ? 'text-red-600 bg-red-50 ring-1 ring-red-100' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
            >
              <Box className={`w-4 h-4 ${activeView === 'vr' ? 'animate-bounce' : ''}`} />
              VR View
            </button>
            <button 
              onClick={() => onNav('agent')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'agent' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
            >
              Abang AI
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
