import React from "react";
import ReactDOM from "react-dom/client";
import Terminal from "./components/Terminal";
import { LiquidBackground } from "./components/LiquidBackground";
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import "./index.css";
import config from "./config.json";

function App() {
  const appWindow = getCurrentWebviewWindow();

  const handleMove = () => {
    appWindow.startDragging();
  };

  const handleResize = () => {
    appWindow.startResizeDragging('SouthEast');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    appWindow.close();
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    appWindow.minimize();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    appWindow.toggleMaximize();
  };

  // Prevent drag when clicking buttons
  const preventDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-glass shadow-glass-glow border border-glass-border transition-all duration-300">
      
      {/* Layer 0: Liquid Render Engine */}
      <LiquidBackground />

      {/* Layer 1: Contrast Control (The "Dark Glass" tint) */}
      <div 
        className="absolute inset-0 z-5 bg-gray-950 pointer-events-none" 
        style={{ opacity: config.theme.opacity }}
      />

      {/* Layer 2: UI Context (Terminal & Controls) */}
      <div className="relative z-10 w-full h-full flex flex-col bg-transparent">
        {/* Title Bar / Window Controls */}
        <div 
          onMouseDown={handleMove} 
          className="h-10 flex items-center px-4 border-b border-glass-border/30 bg-white/5 cursor-default select-none"
        >
          {/* Window Controls */}
          <div 
            onMouseDown={preventDrag}
            className="flex gap-2 z-50 cursor-auto group"
          >
            <div 
              onClick={handleClose} 
              title="Close"
              className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 shadow-inner transition-colors"
            ></div>
            <div 
              onClick={handleMinimize} 
              title="Minimize"
              className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 shadow-inner transition-colors"
            ></div>
            <div 
              onClick={handleMaximize} 
              title="Maximize"
              className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 shadow-inner transition-colors"
            ></div>
          </div>

          {/* Title Text */}
          <div data-tauri-drag-region className="flex-1 text-center text-[13px] text-white/60 font-medium h-full flex items-center justify-center pointer-events-none">
            Refract — zsh
          </div>

          {/* Spacer to balance controls */}
          <div className="w-[52px]"></div> 
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden p-2">
          <Terminal id="1" />
          
          {/* Resize Handle */}
          <div 
              onMouseDown={handleResize}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl"
          />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
