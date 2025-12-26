import React, { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import 'xterm/css/xterm.css';
import '../index.css'; // Assuming we put global styles here

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
  const [logs, setLogs] = React.useState<string[]>([]);

  const log = (msg: string) => setLogs(prev => [...prev.slice(-10), msg]);

  useEffect(() => {
    if (!terminalRef.current) return;
    log(`Initializing Terminal (Session ${id})...`);

    // 1. Initialize xterm
    const term = new XTerminal({
      cursorBlink: true,
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
      theme: {
        background: '#00000000',
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
        log(`Fit error: ${e}`);
    }
    
    term.focus(); // Auto-focus

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // 3. Initial Spawn
    log(`Spawning PTY ${id}...`);
    invoke('spawn_pty', { id, cols: 80, rows: 24 })
        .then(() => log("Spawn Success"))
        .catch(err => log(`Spawn Error: ${err}`));

    // 4. Input Handling (User -> Rust)
    term.onData((data) => {
      log(`Input: ${JSON.stringify(data)}`);
      invoke('write_pty', { id, data }).catch(e => log(`Write Error: ${e}`));
    });

    // 5. Output Handling (Rust -> User)
    const unlisten = listen('pty_data', (event: any) => {
        log(`EVENT RCVD: ID=${event.payload?.id} DataLen=${event.payload?.data?.length}`);
        // if (event.payload.id === id) {
             term.write(event.payload.data);
        // }
    });

    return () => {
      term.dispose();
      unlisten.then(f => f());
    };
  }, [id]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={terminalRef} 
        className="terminal-container"
        style={{ width: '100%', height: '100%' }}
      />
      <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          background: 'rgba(0,0,0,0.8)',
          color: '#0f0',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '10px',
          pointerEvents: 'none',
          maxHeight: '200px',
          overflow: 'hidden'
      }}>
          {logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};

export default Terminal;
