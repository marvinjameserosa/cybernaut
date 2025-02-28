import React, { useEffect, useRef, useState } from 'react';

interface TerminalProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  autoScroll?: boolean;
  maxHeight?: string;
  theme?: 'dark' | 'light' | 'matrix';
}

const Terminal: React.FC<TerminalProps> = ({
  className = '',
  children,
  title = 'cybernaut-terminal',
  autoScroll = true,
  maxHeight = '400px',
  theme = 'dark'
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Theme configurations
  const themes = {
    dark: {
      bg: 'bg-black',
      text: 'text-white',
      border: 'border-gray-700',
      dots: ['bg-red-500', 'bg-yellow-500', 'bg-green-500'],
      header: 'bg-gray-900'
    },
    light: {
      bg: 'bg-gray-100',
      text: 'text-gray-900',
      border: 'border-gray-300',
      dots: ['bg-red-400', 'bg-yellow-400', 'bg-green-400'],
      header: 'bg-gray-200'
    },
    matrix: {
      bg: 'bg-black',
      text: 'text-green-500',
      border: 'border-green-700',
      dots: ['bg-green-700', 'bg-green-600', 'bg-green-500'],
      header: 'bg-gray-900'
    }
  };

  const currentTheme = themes[theme];

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      });
    }
  }, [children, autoScroll]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F to toggle fullscreen
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && e.target === document.body) {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div 
      className={`relative ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={{ maxHeight: isFullscreen ? '100vh' : maxHeight }}
    >
      {/* Terminal header */}
      <div className={`absolute top-0 left-0 right-0 h-6 ${currentTheme.header} rounded-t-md border-b ${currentTheme.border} flex items-center px-3 justify-between`}>
        <div className="flex space-x-1.5">
          {currentTheme.dots.map((dotColor, index) => (
            <div 
              key={index} 
              className={`w-3 h-3 rounded-full ${dotColor} hover:opacity-80 cursor-pointer transition-opacity`}
              onClick={() => index === 0 ? toggleFullscreen() : null}
            ></div>
          ))}
        </div>
        <div className="absolute left-0 right-0 mx-auto w-fit text-xs text-gray-400 font-mono">
          {title}
        </div>
        <div className="flex space-x-2">
          <button 
            className="text-xs text-gray-400 hover:text-gray-200"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? '⟱' : '⟰'}
          </button>
        </div>
      </div>
      
      {/* Terminal content */}
      <div
        ref={terminalRef}
        className={`font-mono text-sm ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} rounded-md pt-8 p-4 h-full overflow-auto transition-colors duration-200 ease-in-out`}
        style={{ 
          scrollBehavior: 'smooth',
          maxHeight: isFullscreen ? 'calc(100vh - 2rem)' : maxHeight
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Terminal;