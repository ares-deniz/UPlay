import React from 'react';
import {
  X,
  Home,
  Compass,
  Music,
  Film,
  Gamepad2,
  Trophy,
  Newspaper,
  Podcast,
  Clock,
  ThumbsUp,
  Download,
  User,
  Settings,
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeCategory,
  onCategoryChange,
}) => {
  const mainItems = [
    { icon: Home, label: 'Home' },
    { icon: Compass, label: 'Explore' },
    { icon: Music, label: 'Music' },
    { icon: Film, label: 'Films' },
    { icon: Gamepad2, label: 'Gaming' },
    { icon: Newspaper, label: 'News' },
    { icon: Trophy, label: 'Sport' },
    { icon: Podcast, label: 'Podcasts' },
  ];

  const libraryItems = [
    { icon: Clock, label: 'Watch Later' },
    { icon: ThumbsUp, label: 'Liked Videos' },
    { icon: Download, label: 'Downloads' },
  ];

  const accountItems = [
    { icon: User, label: 'Your Channel' },
    { icon: Settings, label: 'Settings' },
  ];

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    onClose();
  };
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 z-50 lg:hidden transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center font-bold">
              U
            </div>
            <h1 className="text-xl font-bold text-white">UPlay</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
          {/* Main Navigation */}
          <nav className="space-y-2">
            {mainItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeCategory === item.label
                      ? 'bg-red-500/20 text-red-400'
                      : 'hover:bg-zinc-800 text-gray-300'
                  }`}
                  onClick={() => handleCategoryClick(item.label)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Library */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold mb-3 px-3">
              Library
            </h3>
            <nav className="space-y-2">
              {libraryItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeCategory === item.label
                        ? 'bg-red-500/20 text-red-400'
                        : 'hover:bg-zinc-800 text-gray-300'
                    }`}
                    onClick={() => handleCategoryClick(item.label)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold mb-3 px-3">
              Account
            </h3>
            <nav className="space-y-2">
              {accountItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeCategory === item.label
                        ? 'bg-red-500/20 text-red-400'
                        : 'hover:bg-zinc-800 text-gray-300'
                    }`}
                    onClick={() => handleCategoryClick(item.label)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
