import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../components/Images/logo-1.png'

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav id='navbar' className="bg-white shadow-sm pt-1 pb-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link   id='link' to="/" className="flex gap-3 items-center">
              <img src={logo} width={40} alt="" />
              <span className="font-bold text-2xl">FACE METRICS</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link   id='link1' to="/search" className="text-gray-700  hover:text-blue-600 transition">
              Try Now
            </Link>
          
            <a 
                  href="/"
                  target="_blank" 
              rel="noopener noreferrer"
              id='link1'
              className="text-gray-700 hover:text-blue-600 transition">
              Download App
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              id='link'
              to="/search"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Try Now
            </Link>
            <a
              id='link'
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Download App
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;