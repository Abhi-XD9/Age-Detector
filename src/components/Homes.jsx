import React from 'react';
import { Search, Star, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import doppleImage from '../components/Images/cover-4.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Homes() {
  return (
    <div className="relative">
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="relative z-10 pb-0 bg-white lg:w-1/2">
            <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-3 xs:mt-2 sm:px-6 md:mt-5 lg:mt-28 lg:px-8 xl:mt-32">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-3xl xs:text-2xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="block">Find Faces in</span>
                  <span className="block text-blue-600">Images & Videos</span>
                </h1>
                <p className="mt-3 text-sm xs:text-xs text-gray-500 sm:mt-5 sm:text-base sm:max-w-xl sm:mx-auto md:mt-5 md:text-lg lg:mx-0">
                  Advanced AI-powered face search technology. Upload an image and find the Ages and Expressions  Instantly.
                </p>
                <div className="mt-2 sm:mt-4 sm:flex sm:justify-center lg:mb-4  lg:justify-start">
                  <div className="rounded-md ">
                    <Link
                      to="/search"
                      id='link'
                      className="w-full flex items-center justify-center px-3 py-2 border border-transparent text-sm xs:text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-black md:py-4 md:text-base md:px-10"
                    >
                      Try Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
          <div className="relative lg:w-1/2 w-full mt-6 sm:mt-8 md:mt-2 lg:mt-0">
            <img
              className="w-full h-auto max-h-98 xs:p-3 xs:rounded-[20px] rounded-lg object-cover"
              src={doppleImage}
              alt="Face recognition"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50 mb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base xs:text-sm text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-2xl xs:text-xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Why Choose Face Search AI?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Search className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg xs:text-base leading-6 font-medium text-gray-900">Advanced Search</p>
                <p className="mt-2 ml-16 text-base xs:text-sm text-gray-500">
                  Powerful AI algorithms to detect the faces with high accuracy.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <p className="ml-16 text -lg xs:text-base leading-6 font-medium text-gray-900">5-Star Rated</p>
                <p className="mt-2 ml-16 text-base xs:text-sm text-gray-500">
                  Trusted by users with excellent reviews on Play Store.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Download className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg xs:text-base leading-6 font-medium text-gray-900">1000+ Downloads</p>
                <p className="mt-2 ml-16 text-base xs:text-sm text-gray-500">
                  Growing user base with successful face searches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homes;