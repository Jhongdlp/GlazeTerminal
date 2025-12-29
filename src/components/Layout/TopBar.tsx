import React from 'react';
import { useWindowControls } from '../../hooks/useWindowControls';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from '../ui/basic-dropdown';

import { Settings, Palette, Info, MoreHorizontal, Command, Maximize, HelpCircle, Keyboard } from 'lucide-react';


interface TopBarProps {
    title?: string;
    showControls?: boolean;
    className?: string; // Allow overrides
}

const TopBar: React.FC<TopBarProps> = ({ title = "REFRACT", showControls = true, className }) => {
  const { minimize, maximize, close, startDrag, toggleFullscreen } = useWindowControls();

  const handleMove = () => {
    startDrag();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    close();
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimize();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    maximize();
  };

  const preventDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      onMouseDown={handleMove} 
      className={`h-10 flex items-center justify-between px-4 border-b border-white/5 bg-black/20 backdrop-blur-md cursor-default select-none ${className || ''}`}
    >
      {/* Title Text */}
      <div data-tauri-drag-region className="text-xs text-white/40 font-medium tracking-wide font-mono pl-2">
        {title}
      </div>

      {/* Window Controls */}
      {showControls && (
        <div 
            onMouseDown={preventDrag}
            className="flex items-center gap-3 z-50 cursor-auto relative"
        >
            {/* Menu Dropdown */}
            <Dropdown>
                <DropdownTrigger className="outline-none">
                    <button 
                        className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
                        title="Menu"
                    >
                        <MoreHorizontal size={14} />
                    </button>
                </DropdownTrigger>
                <DropdownContent className="w-48 bg-gray-900/90 backdrop-blur-xl border border-white/10 shadow-2xl text-white/80" align="end" sideOffset={8}>
                    
                    <DropdownItem className="hover:bg-white/10 hover:text-white cursor-pointer gap-2 text-xs font-medium text-white">
                        <Command size={14} />
                        <span>Command Palette</span>
                        <span className="ml-auto text-[10px] text-white/30 border border-white/10 rounded px-1">Ctrl+K</span>
                    </DropdownItem>
                    
                    <DropdownSeparator className="bg-white/10" />

                    <DropdownItem onClick={toggleFullscreen} className="hover:bg-white/10 hover:text-white cursor-pointer gap-2 text-xs">
                        <Maximize size={14} />
                        <span>Full Screen</span>
                    </DropdownItem>

                     <DropdownItem className="hover:bg-white/10 hover:text-white cursor-pointer gap-2 text-xs">
                        <Settings size={14} />
                        <span>Settings</span>
                    </DropdownItem>
                    
                    <DropdownItem className="hover:bg-white/10 hover:text-white cursor-pointer gap-2 text-xs">
                        <Palette size={14} />
                        <span>Themes</span>
                    </DropdownItem>
                    
                    <DropdownSeparator className="bg-white/10" />
                    
                    <DropdownItem className="hover:bg-white/10 hover:text-white cursor-pointer gap-2 text-xs">
                        <Keyboard size={14} />
                        <span>Keyboard Shortcuts</span>
                    </DropdownItem>

                    <DropdownItem className="hover:bg-white/10 hover:text-white cursor-pointer gap-2 text-xs">
                        <HelpCircle size={14} />
                        <span>Help</span>
                    </DropdownItem>

                    <DropdownItem className="hover:bg-white/10 hover:text-white cursor-pointer gap-2 text-xs">
                        <Info size={14} />
                        <span>About Refract</span>
                    </DropdownItem>
                </DropdownContent>
            </Dropdown>

            <div className="w-[1px] h-3 bg-white/10 mx-1"></div>

            {/* Minimize */}
            <button 
            onClick={handleMinimize}
            className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
            title="Minimize"
            >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            </button>

            {/* Maximize */}
            <button 
            onClick={handleMaximize}
            className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
            title="Maximize"
            >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
            </button>

            {/* Close */}
            <button 
            onClick={handleClose}
            className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            title="Close"
            >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            </button>
        </div>
      )}
    </div>
  );
};



export default TopBar;
