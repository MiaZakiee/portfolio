import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createTerminal } from '@hooks/useTerminal';
import personalDetails from '@data/personalDetails.json';

// Parse ANSI escape codes into styled spans
function parseAnsi(text) {
  const parts = [];
  const regex = /\x1b\[([0-9;]*)m/g;
  let lastIndex = 0;
  let currentStyles = {};
  let key = 0;

  const colorMap = {
    '30': '#45475a', '31': '#f38ba8', '32': '#a6e3a1', '33': '#f9e2af',
    '34': '#89b4fa', '35': '#cba6f7', '36': '#94e2d5', '37': '#cdd6f4',
    '40': '#45475a', '41': '#f38ba8', '42': '#a6e3a1', '43': '#f9e2af',
    '44': '#89b4fa', '45': '#cba6f7', '46': '#94e2d5', '47': '#bac2de',
  };

  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++} style={{ ...currentStyles }}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }

    const codes = match[1].split(';');
    for (const code of codes) {
      if (code === '0' || code === '') {
        currentStyles = {};
      } else if (code === '1') {
        currentStyles = { ...currentStyles, fontWeight: 'bold' };
      } else if (colorMap[code]) {
        if (parseInt(code) >= 40) {
          currentStyles = { ...currentStyles, backgroundColor: colorMap[code], padding: '0 3px' };
        } else {
          currentStyles = { ...currentStyles, color: colorMap[code] };
        }
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={key++} style={{ ...currentStyles }}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : text;
}

export default function Terminal({ navigateTo, onActivity, onFocus }) {
  const terminal = useMemo(() => createTerminal(), []);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  // Show neofetch on mount
  useEffect(() => {
    if (!initialized) {
      const neofetch = terminal.getNeofetch();
      setHistory([
        { type: 'output', content: neofetch },
        { type: 'output', content: '' },
        { type: 'output', content: '\x1b[1;33mWelcome!\x1b[0m Type \x1b[1;32mhelp\x1b[0m for commands, or \x1b[1;32mls\x1b[0m to explore.' },
        { type: 'output', content: '' },
      ]);
      setInitialized(true);
    }
  }, [initialized, terminal]);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Navigate from navbar
  useEffect(() => {
    if (navigateTo) {
      const cmd = navigateTo.cmd;
      if (cmd) {
        // Execute commands sequentially
        const commands = Array.isArray(cmd) ? cmd : [cmd];
        commands.forEach((c) => {
          const result = terminal.execute(c);
          if (result === '__CLEAR__') {
            setHistory([]);
          } else {
            setHistory((prev) => [
              ...prev,
              { type: 'command', content: c, prompt: terminal.getPrompt() },
              ...(result ? [{ type: 'output', content: result }] : []),
            ]);
          }
        });
      }
    }
  }, [navigateTo, terminal]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    const prompt = terminal.getPrompt();

    if (!trimmed) {
      setHistory((prev) => [...prev, { type: 'command', content: '', prompt }]);
      setInput('');
      return;
    }

    const result = terminal.execute(trimmed);

    if (result === '__CLEAR__') {
      setHistory([]);
    } else {
      setHistory((prev) => [
        ...prev,
        { type: 'command', content: trimmed, prompt },
        ...(result ? [{ type: 'output', content: result }] : []),
      ]);
    }

    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);
    setInput('');
    setSuggestion('');
  }, [input, terminal]);

  const handleKeyDown = useCallback((e) => {
    if (onActivity) onActivity();
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
        setSuggestion('');
      } else {
        const completions = terminal.getCompletions(input);
        if (completions.length === 1) {
          setInput(completions[0]);
        } else if (completions.length > 1) {
          setHistory((prev) => [
            ...prev,
            { type: 'output', content: completions.join('   ') },
          ]);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  }, [handleSubmit, suggestion, input, terminal, commandHistory, historyIndex]);

  // Autocomplete suggestion
  useEffect(() => {
    if (input.length > 0) {
      const completions = terminal.getCompletions(input);
      if (completions.length === 1 && completions[0] !== input) {
        setSuggestion(completions[0]);
      } else {
        setSuggestion('');
      }
    } else {
      setSuggestion('');
    }
  }, [input, terminal]);

  const focusInput = () => {
    if (onActivity) onActivity();
    inputRef.current?.focus();
  };

  return (
    <div onClick={focusInput} style={styles.terminal}>
      {/* Title bar */}
      <div style={styles.titleBar}>
        <div style={styles.trafficLights}>
          <span style={{ ...styles.dot, backgroundColor: '#ff5f57' }} />
          <span style={{ ...styles.dot, backgroundColor: '#febc2e' }} />
          <span style={{ ...styles.dot, backgroundColor: '#28c840' }} />
        </div>
        <span style={styles.titleText}>{personalDetails.handle}@portfolio: ~{terminal.getCwd() === '/' ? '' : terminal.getCwd()}</span>
        <div style={{ width: 52 }} />
      </div>

      {/* Output area */}
      <div ref={outputRef} style={styles.output}>
        {history.map((entry, i) => (
          <div key={i} style={styles.line}>
            {entry.type === 'command' ? (
              <div>
                <span>{parseAnsi(entry.prompt)}</span>
                <span style={{ color: 'var(--term-fg)' }}>{entry.content}</span>
              </div>
            ) : (
              <pre style={styles.pre}>{parseAnsi(entry.content)}</pre>
            )}
          </div>
        ))}

        {/* Current input line */}
        <div style={styles.inputLine}>
          <span>{parseAnsi(terminal.getPrompt())}</span>
          <div style={styles.inputWrapper}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              style={styles.input}
              spellCheck={false}
              autoFocus
            />
            {suggestion && suggestion.length > input.length && (
              <span style={styles.suggestion}>
                {suggestion.slice(input.length)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  terminal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--term-bg)',
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    cursor: 'text',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    backgroundColor: '#181825',
    borderBottom: '1px solid #313244',
    userSelect: 'none',
  },
  trafficLights: {
    display: 'flex',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    display: 'inline-block',
  },
  titleText: {
    color: '#6c7086',
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
  },
  output: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 14px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--term-scrollbar) transparent',
  },
  line: {
    minHeight: 20,
  },
  pre: {
    margin: 0,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: 'var(--term-fg)',
  },
  inputLine: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 24,
  },
  inputWrapper: {
    position: 'relative',
    flex: 1,
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--term-fg)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    width: '100%',
    caretColor: 'var(--term-cursor)',
  },
  suggestion: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: 'var(--term-comment)',
    pointerEvents: 'none',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    opacity: 0.5,
  },
};
