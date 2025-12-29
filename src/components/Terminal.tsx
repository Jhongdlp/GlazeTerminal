import React, { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { LogicalSize } from '@tauri-apps/api/dpi';
import 'xterm/css/xterm.css';
import '../index.css';
import config from '../config.json';
import { useTheme } from '../context/ThemeContext';

interface TerminalProps {
  id?: string;
}

const Terminal: React.FC<TerminalProps> = ({ id: initialId = "1" }) => {
  const { windowSettings } = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);
  // Use a unique ID for this instance to prevent collisions in React Strict Mode
  const idRef = useRef(`${initialId}-${Math.floor(Math.random() * 10000)}`);
  const id = idRef.current;
  
  const xtermRef = useRef<XTerminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // 1. Initialize xterm
    const term = new XTerminal({
      cursorBlink: true,
      fontFamily: config.terminal.fontFamily,
      fontSize: config.terminal.fontSize,
      theme: {
        background: '#00000000', // Transparent for Glass effect
        foreground: '#e0e0e0',
        cursor: '#ffffff',
        selectionBackground: 'rgba(255, 255, 255, 0.3)',
      },
      allowProposedApi: true,
      cols: 80,
      rows: 24,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);
    try {
        fitAddon.fit();
        
        // --- Custom Window Size Logic ---
        if (windowSettings.useCustomSize) {
           const core = (term as any)._core;
           const render = core._renderService;
           // Fallback if private API changes, though strictly standard in generic xterm usage
           const cellWidth = render.dimensions?.actualCellWidth || 9; 
           const cellHeight = render.dimensions?.actualCellHeight || 17;
           
           // Calculate Window Size: (Cols * CellW) + HorizontalPadding + (Rows * CellH) + VerticalPadding
           // Horizontal Padding: ~18px (2px border + 16px padding)
           // Vertical Padding: ~58px (40px TopBar + 16px padding + 2px border)
           const width = (windowSettings.columns * cellWidth) + 18;
           const height = (windowSettings.rows * cellHeight) + 58; // 40 (TopBar) + 16 (Padding) + 2 (Border)

           const appWindow = getCurrentWebviewWindow();
           appWindow.setSize(new LogicalSize(width, height)).catch(console.error);
        }
    } catch (e) {
        console.error("Fit/Resize error:", e);
    }
    
    term.focus(); // Auto-focus

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // 2. Initial Spawn & Resize Handler
    const handleResize = () => {
        if (!fitAddonRef.current || !xtermRef.current) return;
        try {
            fitAddonRef.current.fit();
            const { cols, rows } = xtermRef.current;
            invoke('resize_pty', { id, cols, rows }).catch(console.error);
        } catch (e) {
            console.error("Resize error:", e);
        }
    };

    // Spawn with default size, then immediately resize to fit container
    invoke('spawn_pty', { id, cols: 80, rows: 24 })
        .then(() => {
            // Wait a tick for layout to settle
            setTimeout(handleResize, 100);
        })
        .catch(err => console.error("Spawn Error:", err));

    // Observe container resizing
    const resizeObserver = new ResizeObserver(() => {
        handleResize();
    });
    
    if (terminalRef.current) {
        resizeObserver.observe(terminalRef.current);
    }

    // 3. Input Handling (User -> Rust)
    term.onData((data) => {
      // Dispatch event for Liquid Shader reactivity
      window.dispatchEvent(new CustomEvent('glaze-typing'));
      invoke('write_pty', { id, data }).catch(console.error);
    });

    // 4. Output Handling (Rust -> User)
    const unlisten = listen('pty_data', (event: any) => {
        if (event.payload.id === id) {
             const data = event.payload.data;
             term.write(data);

             // --- Glaze Error Detection ---
             // Expanded regex to catch fish shell "Unknown command" and others
             // Order matters slightly (longer phrases first can be safer but regex handles OR well)
             const errorRegex = /error|fatal|fail|denied|not found|command not found|unknown command|unknown|panic/i;
             if (errorRegex.test(data)) {
                 window.dispatchEvent(new Event('glaze-error'));
             }
        }
    });

    return () => {
      resizeObserver.disconnect();
      term.dispose();
      unlisten.then(f => f());
    };
  }, []);

  return (
    <div 
      ref={terminalRef} 
      className="h-full w-full bg-transparent rounded-lg"
    />
  );
};

export default Terminal;
