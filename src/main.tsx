import React from "react";
import ReactDOM from "react-dom/client";
import Terminal from "./components/Terminal";
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import "./index.css";

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
    <div className="glass-panel" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px' }}>
      {/* Title Bar / Window Controls */}
      {/* Title Bar / Window Controls */}
      <div onMouseDown={handleMove} style={{ 
        height: '38px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 16px', 
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(255, 255, 255, 0.03)',
        cursor: 'default',
        userSelect: 'none'
      }}>
        {/* Window Controls */}
        <div 
          onMouseDown={(e) => e.stopPropagation()}
          style={{ display: 'flex', gap: '8px', zIndex: 50, cursor: 'auto' }}
        >
          <div 
            onClick={handleClose} 
            title="Close"
            style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)', cursor: 'pointer' }}
          ></div>
          <div 
            onClick={handleMinimize} 
            title="Minimize"
            style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)', cursor: 'pointer' }}
          ></div>
          <div 
            onClick={handleMaximize} 
            title="Maximize"
            style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)', cursor: 'pointer' }}
          ></div>
        </div>

        {/* Title Text */}
        <div data-tauri-drag-region style={{ 
          flex: 1, 
          textAlign: 'center', 
          fontSize: '13px', 
          color: 'var(--text-secondary)', 
          fontWeight: 500,
          opacity: 0.8,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none' // Let clicks pass through to drag region if needed, though drag region is parent now
        }}>
          Glaze Terminal — zsh
        </div>

        {/* Spacer */}
        <div style={{ width: '52px', height: '100%' }}></div> 
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '10px' }}>
        <Terminal id="1" />
        
        {/* Resize Handle */}
        <div 
            onMouseDown={handleResize}
            style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '16px',
                height: '16px',
                cursor: 'nwse-resize',
                zIndex: 50
            }}
        />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
