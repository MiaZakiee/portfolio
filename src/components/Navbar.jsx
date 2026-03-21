import React from 'react';
import { useTheme } from '@hooks/useTheme';

const NAV_ITEMS = [
  { label: 'About Me', cmd: ['cd /', 'cat aboutme.txt'] },
  { label: 'Projects', cmd: ['cd /projects', 'ls'] },
  { label: 'Skills', cmd: ['cd /skills', 'ls'] },
  { label: 'Experience', cmd: ['cd /experience', 'ls'] },
  { label: 'Contact', cmd: ['cd /', 'cat contacts.txt'] },
];

export default function Navbar({ onNavigate, onActivity }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.logoSymbol}>❯</span>
        <span style={styles.logoText}>portfolio</span>
      </div>

      <div style={styles.links}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            style={styles.link}
            onClick={() => { onNavigate({ cmd: item.cmd, id: Date.now() }); if (onActivity) onActivity(); }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--nav-hover)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        style={styles.themeToggle}
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={isDark ? 'Switch to day' : 'Switch to night'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: 'var(--nav-bg)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 50,
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginRight: 8,
    paddingRight: 12,
    borderRight: '1px solid rgba(128,128,128,0.2)',
  },
  logoSymbol: {
    color: 'var(--term-prompt-symbol)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: 16,
  },
  logoText: {
    color: 'var(--nav-text)',
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  links: {
    display: 'flex',
    gap: 2,
  },
  link: {
    background: 'transparent',
    border: 'none',
    color: 'var(--nav-text)',
    padding: '6px 12px',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "'Space Grotesk', sans-serif",
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  themeToggle: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    padding: '4px 8px',
    borderRadius: 20,
    transition: 'transform 0.3s ease',
    marginLeft: 4,
  },
};
