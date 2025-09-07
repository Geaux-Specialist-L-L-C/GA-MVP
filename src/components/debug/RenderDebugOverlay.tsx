// File: /src/components/debug/RenderDebugOverlay.tsx
// Description: Minimal debug overlay to help diagnose blank screen rendering issues
// Author: GitHub Copilot
// Created: 2025-09-07

import React, { useEffect, useState } from 'react';

interface RenderDebugOverlayProps { enabled?: boolean; }

const boxStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 8,
  right: 8,
  zIndex: 99999,
  background: 'rgba(0,0,0,0.75)',
  color: '#0ff',
  fontFamily: 'monospace',
  fontSize: 11,
  padding: '6px 8px',
  borderRadius: 4,
  maxWidth: 280,
  lineHeight: 1.3,
  pointerEvents: 'none'
};

export const RenderDebugOverlay: React.FC<RenderDebugOverlayProps> = ({ enabled }) => {
  const initialEnabled = (() => {
    if (typeof enabled === 'boolean') return enabled;
    // Enable automatically only in development when flag set
    return import.meta.env.DEV && import.meta.env.VITE_DEBUG_OVERLAY === 'true';
  })();
  const [active, setActive] = useState<boolean>(initialEnabled);
  const [ts, setTs] = useState<number>(Date.now());
  const [vis, setVis] = useState<string>(document.visibilityState);

  useEffect(() => {
    const id = setInterval(() => setTs(Date.now()), 3000);
    const onVis = () => setVis(document.visibilityState);
    const onKey = (e: KeyboardEvent) => {
      // Ctrl+Alt+D toggles overlay
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
        setActive(a => !a);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('keydown', onKey);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('keydown', onKey); };
  }, []);

  if (!active) return null;
  return (
    <div style={boxStyle}>
      <div>Render OK @ {new Date(ts).toLocaleTimeString()}</div>
      <div>Visibility: {vis}</div>
      <div>Env: {import.meta.env.MODE}</div>
      <div>Firebase apiKey present: {Boolean(import.meta.env.VITE_FIREBASE_API_KEY).toString()}</div>
      <div style={{marginTop:4, color:'#9cf'}}>Ctrl+Alt+D to toggle</div>
    </div>
  );
};

export default RenderDebugOverlay;
