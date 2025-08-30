import React from 'react';
import {
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
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
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

  const subscriptions = [
    { name: 'TechReview', avatar: 'T', online: true },
    { name: 'MusicChannel', avatar: 'M', online: false },
    { name: 'GameStream', avatar: 'G', online: true },
    { name: 'NewsToday', avatar: 'N', online: false },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-full bg-zinc-950 border-r border-gray-700 transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      } hidden lg:block`}
    >
      <div className="p-4 space-y-6 overflow-y-auto h-full">
        {/* Main Navigation */}
        <nav className="space-y-2">
          {mainItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => onCategoryChange(item.label)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeCategory === item.label
                    ? 'bg-red-500/20 text-red-400'
                    : 'hover:bg-zinc-800 text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {isOpen && (
          <>
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
                      onClick={() => onCategoryChange(item.label)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        activeCategory === item.label
                          ? 'bg-red-500/20 text-red-400'
                          : 'hover:bg-zinc-800 text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Subscriptions */}
            <div>
              <h3 className="text-gray-400 text-sm font-semibold mb-3 px-3">
                Subscriptions
              </h3>
              <nav className="space-y-2">
                {subscriptions.map((sub, index) => (
                  <button
                    key={index}
                    onClick={() => onCategoryChange(sub.name)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeCategory === sub.name
                        ? 'bg-red-500/20 text-red-400'
                        : 'hover:bg-zinc-800 text-gray-300'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {sub.avatar}
                      </div>
                      {sub.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <span className="truncate">{sub.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
