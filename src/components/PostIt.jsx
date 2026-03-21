import React, { useState } from 'react';

const COMMANDS = [
  { cmd: 'ls', desc: 'list files & folders' },
  { cmd: 'cd <dir>', desc: 'enter a folder' },
  { cmd: 'cd ..', desc: 'go back' },
  { cmd: 'cat <file>', desc: 'read a file' },
  { cmd: 'tree', desc: 'show file tree' },
  { cmd: 'neofetch', desc: 'show system info' },
  { cmd: 'clear', desc: 'clear terminal' },
  { cmd: 'help', desc: 'all commands' },
];

export default function PostIt() {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        style={styles.minimizedButton}
        title="Show commands"
      >
        📋
      </button>
    );
  }

  return (
    <div style={styles.postit}>
      {/* Tape effect */}
      <div style={styles.tape} />

      <div style={styles.header}>
        <span style={styles.title}>📌 Commands</span>
        <button
          onClick={() => setIsMinimized(true)}
          style={styles.closeBtn}
          title="Minimize"
        >
          ─
        </button>
      </div>

      <div style={styles.commands}>
        {COMMANDS.map((c, i) => (
          <div key={i} style={styles.commandRow}>
            <code style={styles.cmd}>{c.cmd}</code>
            <span style={styles.desc}>{c.desc}</span>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <span style={styles.tip}>Tab → autocomplete</span>
        <span style={styles.tip}>↑↓ → history</span>
      </div>
    </div>
  );
}

const styles = {
  postit: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    width: 220,
    backgroundColor: 'var(--postit-bg)',
    color: 'var(--postit-text)',
    borderRadius: 4,
    padding: '20px 16px 14px',
    boxShadow: '2px 4px 16px var(--postit-shadow)',
    transform: 'rotate(1.5deg)',
    zIndex: 80,
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 12,
    transition: 'all 0.3s ease',
  },
  tape: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: 'translateX(-50%) rotate(-2deg)',
    width: 60,
    height: 16,
    backgroundColor: 'rgba(200,200,180,0.5)',
    borderRadius: 2,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: '1px dashed rgba(128,128,100,0.3)',
  },
  title: {
    fontWeight: 600,
    fontSize: 13,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--postit-text)',
    fontSize: 14,
    opacity: 0.5,
    padding: '0 4px',
  },
  commands: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  commandRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cmd: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    color: '#5a6a4a',
    backgroundColor: 'rgba(0,0,0,0.06)',
    padding: '1px 5px',
    borderRadius: 3,
    whiteSpace: 'nowrap',
  },
  desc: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: 'right',
  },
  footer: {
    marginTop: 10,
    paddingTop: 8,
    borderTop: '1px dashed rgba(128,128,100,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  tip: {
    fontSize: 10,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  minimizedButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 80,
    background: 'var(--postit-bg)',
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 20,
    cursor: 'pointer',
    boxShadow: '2px 4px 12px var(--postit-shadow)',
    transition: 'transform 0.2s ease',
  },
};
