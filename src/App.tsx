import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoGrid from './components/VideoGrid';
import MobileMenu from './components/MobileMenu';
import Watch from './pages/Watch';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Home');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear search when changing category
  };
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header
        onToggleMobileMenu={toggleMobileMenu}
        onToggleSidebar={toggleSidebar}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="flex pt-16">
                <Sidebar
                  isOpen={isSidebarOpen}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />
                <main
                  className={`flex-1 transition-all duration-300 ${
                    isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
                  }`}
                >
                  <VideoGrid
                    searchQuery={searchQuery}
                    activeCategory={activeCategory}
                  />
                </main>
              </div>

              <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            </>
          }
        />
        <Route path="/watch/:id" element={<div className="pt-16"><Watch /></div>} />
      </Routes>
    </div>
  );
}

export default App;
