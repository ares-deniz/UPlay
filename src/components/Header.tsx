import React from 'react';
import { Menu, Search, Bell, User, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-zinc-950 border-b border-zinc-700 px-4 py-3 flex items-center justify-between z-50">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <button
          onClick={onToggleSidebar}
          className="hidden lg:block p-2 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/" className="flex items-center space-x-2 select-none">
          <div className="h-6 w-8 bg-red-500 rounded-md flex items-center justify-center font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-square-play-icon lucide-square-play"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white hidden sm:block">
            UPlay
          </h1>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-4 md:mx-auto ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 text-white px-4 py-2 pl-10 rounded-full border border-gray-600 focus:outline-none focus:border-red-500 transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
      {/* 
      <div className="flex items-center space-x-2">
        <button className="hidden sm:block p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Upload className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div> */}
    </header>
  );
};

export default Header;
