import React from 'react';
import { NavLink } from 'react-router-dom';

function Footers() {
  return (
    <footer id='footer' className="footer max-w-7xl mx-auto py-1 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-xl xs:text-lg">FACE METRICS</span>
          </div>
          <p className="mt-2 text-gray-500 xs:text-sm">
            Advanced AI-powered face search technology for images and videos.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm ml-4 font-semibold text-gray-900 tracking-wider uppercase xs:text-xs">
            Product
          </h3>
          <ul className="mt-2 space-y-2">
            <li>
              <NavLink id='link' to="/search" className="text-base xs:text-sm text-gray-500 hover:text-gray-900">
                Try Now
              </NavLink>
            </li>
            <li>
              <NavLink id='link' to="/" className="text-base xs:text-sm text-gray-500 hover:text-gray-900">
                Pricing
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm ml-4 font-semibold text-gray-900 tracking-wider uppercase xs:text-xs">
            Download
          </h3>
          <ul className="mt-2 space-y-2">
            <li>
              <a 
                id='link'
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base xs:text-sm text-gray-500 hover:text-gray-900"
              >
                Google Play
              </a>
            </li>
            <li>
              <a 
                id='link'
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base xs:text-sm text-gray-500 hover:text-gray-900"
              >
                App Store
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-2 border-t border-gray-200 pt-1">
        <p className="text-base xs:text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} DOPPELGANGER AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footers;