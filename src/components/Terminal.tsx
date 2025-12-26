import React, { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import 'xterm/css/xterm.css';
import '../index.css';

interface TerminalProps {
  id?: string;
}

const Terminal: React.FC<TerminalProps> = ({ id: initialId = "1" }) => {
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
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
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
    } catch (e) {
        console.error("Fit error:", e);
    }
    
    term.focus(); // Auto-focus

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // 2. Initial Spawn
    invoke('spawn_pty', { id, cols: 80, rows: 24 })
        .catch(err => console.error("Spawn Error:", err));

    // 3. Input Handling (User -> Rust)
    term.onData((data) => {
      invoke('write_pty', { id, data }).catch(console.error);
    });

    // 4. Output Handling (Rust -> User)
    const unlisten = listen('pty_data', (event: any) => {
        if (event.payload.id === id) {
             term.write(event.payload.data);
        }
    });

    return () => {
      term.dispose();
      unlisten.then(f => f());
    };
  }, []);

  return (
    <div 
      ref={terminalRef} 
      className="terminal-container"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default Terminal;
