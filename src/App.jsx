import React, { useState, useCallback } from 'react';
import { ThemeProvider } from '@hooks/useTheme';
import BeachScene from '@components/BeachScene';
import Navbar from '@components/Navbar';
import PostIt from '@components/PostIt';
import { cameraStore } from './stores/cameraStore';

function PortfolioContent() {
  const [navTarget, setNavTarget] = useState(null);

  const handleNavigate = useCallback((target) => {
    setNavTarget(target);
    cameraStore.focusLaptop();
  }, []);

  const handleActivity = useCallback(() => {
    cameraStore.reportActivity();
  }, []);

  return (
    <div style={styles.container}>
      {/* 3D Beach Background with integrated laptop */}
      <BeachScene navTarget={navTarget} onTerminalActivity={handleActivity} />

      {/* Navbar */}
      <Navbar onNavigate={handleNavigate} onActivity={handleActivity} />

      {/* PostIt note */}
      <PostIt />

      {/* Hint */}
      <div style={styles.hint}>
        Click the laptop to focus, drag to orbit
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  );
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  hint: {
    position: 'fixed',
    bottom: 24,
    left: 24,
    zIndex: 80,
    color: 'var(--nav-text)',
    fontSize: 11,
    fontFamily: "'Space Grotesk', sans-serif",
    opacity: 0.5,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'var(--overlay-bg)',
    backdropFilter: 'blur(10px)',
    padding: '6px 12px',
    borderRadius: 20,
  },
};
