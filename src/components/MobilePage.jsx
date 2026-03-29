import React from 'react';
import personalDetails from '@data/personalDetails.json';
import projects from '@data/projects.json';
import skills from '@data/skills.json';
import experience from '@data/experience.json';
import aboutme from '@data/aboutme.json';
import contacts from '@data/contacts.json';
import certifications from '@data/certifications.json';

const C = {
  bg: '#1e1e2e',
  surface: '#181825',
  border: '#313244',
  fg: '#cdd6f4',
  green: '#a6e3a1',
  blue: '#89b4fa',
  yellow: '#f9e2af',
  red: '#f38ba8',
  cyan: '#94e2d5',
  comment: '#6c7086',
  mauve: '#cba6f7',
};

function Prompt({ cwd = '~', command }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, marginBottom: 8, userSelect: 'none', fontSize: 13 }}>
      <span style={{ color: C.green, fontWeight: 'bold' }}>{personalDetails.handle}</span>
      <span style={{ color: C.fg }}> </span>
      <span style={{ color: C.blue, fontWeight: 'bold' }}>{cwd}</span>
      <span style={{ color: C.red, fontWeight: 'bold' }}> ❯ </span>
      <span style={{ color: C.fg }}>{command}</span>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div style={{ borderLeft: `2px solid ${C.cyan}`, paddingLeft: 14, marginTop: 4 }}>
      <div style={{ color: C.cyan, fontWeight: 'bold', marginBottom: 10, fontSize: 13 }}>
        ─── {title} ───
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ color: C.yellow, fontWeight: 'bold' }}>{label}: </span>
      <span style={{ color: C.fg }}>{value}</span>
    </div>
  );
}

function parseLink(val) {
  const md = val.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
  if (md) {
    return (
      <a href={md[2]} target="_blank" rel="noopener noreferrer" style={{ color: C.yellow, textDecoration: 'underline', wordBreak: 'break-all' }}>
        {md[1]}
      </a>
    );
  }
  if (val.startsWith('http')) {
    return (
      <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: C.yellow, textDecoration: 'underline', wordBreak: 'break-all' }}>
        {val}
      </a>
    );
  }
  if (val.includes('@')) {
    return (
      <a href={`mailto:${val}`} style={{ color: C.yellow, textDecoration: 'underline' }}>
        {val}
      </a>
    );
  }
  return <span style={{ color: C.fg }}>{val}</span>;
}

const CONTACT_ICONS = { github: '🐙', linkedin: '💼', email: '📧', twitter: '🐦', resume: '📄' };

const SECTIONS = [
  { id: 'neofetch', label: '~' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Exp' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'certs', label: 'Certs' },
  { id: 'contact', label: 'Contact' },
];

export default function MobilePage() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: C.bg, overflowY: 'auto', fontFamily: "'JetBrains Mono', monospace", color: C.fg }}>

      {/* Sticky header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: C.red, fontWeight: 'bold', fontSize: 16 }}>❯</span>
        <span style={{ color: C.green, fontWeight: 'bold', fontSize: 15 }}>{personalDetails.handle}</span>
        <span style={{ color: C.comment, fontSize: 13 }}>@portfolio</span>
      </header>

      {/* Section nav */}
      <nav style={{ position: 'sticky', top: 49, zIndex: 99, backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex', overflowX: 'auto', padding: '0 8px', gap: 2, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{ background: 'none', border: 'none', color: C.blue, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: '10px 10px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={{ padding: '28px 20px 0', maxWidth: 680, margin: '0 auto' }}>

        {/* ── neofetch ── */}
        <section id="neofetch" style={{ marginBottom: 48 }}>
          <Prompt command="neofetch" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
            <pre style={{ margin: 0, fontSize: 7.5, lineHeight: 1.2, color: C.fg, whiteSpace: 'pre', overflowX: 'auto', maxWidth: '100%', alignSelf: 'center' }}>
              {personalDetails.ascii.join('\n')}
            </pre>
            <div style={{ width: '100%', fontSize: 13, lineHeight: 1.8 }}>
              <div style={{ marginBottom: 2 }}>
                <span style={{ color: C.green, fontWeight: 'bold' }}>{personalDetails.handle}</span>
                <span style={{ color: C.fg }}>@</span>
                <span style={{ color: C.cyan, fontWeight: 'bold' }}>portfolio</span>
              </div>
              <div style={{ color: C.comment, marginBottom: 8 }}>{'─'.repeat(22)}</div>
              {[
                ['Name', personalDetails.name],
                ['Role', personalDetails.role],
                ['Location', personalDetails.location],
                ['OS', personalDetails.os],
                ['Shell', personalDetails.shell],
                ['Terminal', personalDetails.terminal],
                ['Uptime', personalDetails.uptime],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 2 }}>
                  <span style={{ color: C.yellow, fontWeight: 'bold' }}>{k}:</span>
                  <span style={{ color: C.fg }}> {v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 5, marginTop: 12 }}>
                {[C.comment, C.red, C.green, C.yellow, C.blue, C.mauve, C.cyan, '#bac2de'].map(color => (
                  <span key={color} style={{ width: 18, height: 18, backgroundColor: color, borderRadius: 3, display: 'inline-block' }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── about me ── */}
        <section id="about" style={{ marginBottom: 48 }}>
          <Prompt command="cat aboutme.txt" />
          <Block title="About Me">
            <p style={{ color: C.fg, marginBottom: 12, marginTop: 0 }}>{aboutme.bio}</p>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: C.yellow, fontWeight: 'bold' }}>⚡ Interests: </span>
              <span style={{ color: C.fg }}>{aboutme.interests.join(', ')}</span>
            </div>
            <div style={{ color: C.yellow, fontWeight: 'bold', marginBottom: 4 }}>🎲 Fun Facts:</div>
            {aboutme.funFacts.map((f, i) => (
              <div key={i} style={{ color: C.fg, paddingLeft: 12, marginBottom: 2 }}>• {f}</div>
            ))}
            <div style={{ color: C.yellow, fontWeight: 'bold', marginTop: 10, marginBottom: 4 }}>📌 Currently:</div>
            <div style={{ color: C.fg, paddingLeft: 12, marginBottom: 2 }}>Learning: {aboutme.currently.learning}</div>
            <div style={{ color: C.fg, paddingLeft: 12, marginBottom: 2 }}>Reading: {aboutme.currently.reading}</div>
            <div style={{ color: C.fg, paddingLeft: 12 }}>Building: {aboutme.currently.building}</div>
          </Block>
        </section>

        {/* ── experience ── */}
        <section id="experience" style={{ marginBottom: 48 }}>
          <Prompt cwd="~/experience" command="ls" />
          {experience.map((e) => (
            <div key={e.slug} style={{ marginBottom: 24 }}>
              <Prompt cwd="~/experience" command={`cat ${e.slug}.txt`} />
              <Block title={e.company}>
                <Field label="Role" value={e.role} />
                <Field label="Period" value={e.dates} />
                <div style={{ marginBottom: 4 }}>
                  <span style={{ color: C.yellow, fontWeight: 'bold' }}>Details: </span>
                  <span style={{ color: C.fg }}>{e.description}</span>
                </div>
              </Block>
            </div>
          ))}
        </section>

        {/* ── projects ── */}
        <section id="projects" style={{ marginBottom: 48 }}>
          <Prompt cwd="~/projects" command="ls" />
          {projects.map((p) => (
            <div key={p.slug} style={{ marginBottom: 24 }}>
              <Prompt cwd="~/projects" command={`cat ${p.slug}.txt`} />
              <Block title={p.name}>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ color: C.yellow, fontWeight: 'bold' }}>Description: </span>
                  <span style={{ color: C.fg }}>{p.description}</span>
                </div>
                <Field label="Tech Stack" value={p.tech.join(', ')} />
                <Field label="Date" value={p.date} />
                {p.link && (
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ color: C.yellow, fontWeight: 'bold' }}>Link: </span>
                    <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: C.yellow, textDecoration: 'underline', wordBreak: 'break-all' }}>
                      {p.link}
                    </a>
                  </div>
                )}
              </Block>
            </div>
          ))}
        </section>

        {/* ── skills ── */}
        <section id="skills" style={{ marginBottom: 48 }}>
          <Prompt cwd="~/skills" command="ls" />
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 24 }}>
              <Prompt cwd="~/skills" command={`cat ${category}.txt`} />
              <Block title={category.charAt(0).toUpperCase() + category.slice(1)}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ color: C.fg }}>
                      <span style={{ color: C.green }}>● </span>{item}
                    </div>
                  ))}
                </div>
              </Block>
            </div>
          ))}
        </section>

        {/* ── certifications ── */}
        <section id="certs" style={{ marginBottom: 48 }}>
          <Prompt command="cat certifications.txt" />
          <Block title="Certifications">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ color: C.yellow, fontWeight: 'bold' }}>{c.name}</div>
                <div style={{ color: C.fg }}>Issued by: {c.issuer}</div>
              </div>
            ))}
          </Block>
        </section>

        {/* ── contact ── */}
        <section id="contact" style={{ marginBottom: 48 }}>
          <Prompt command="cat contacts.txt" />
          <Block title="Contact">
            {Object.entries(contacts).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 10, display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px 10px' }}>
                <span>{CONTACT_ICONS[key] || '🔗'}</span>
                <span style={{ color: C.yellow, fontWeight: 'bold', minWidth: 72 }}>{key}</span>
                {parseLink(val)}
              </div>
            ))}
          </Block>
        </section>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '8px 0 48px', color: C.comment, fontSize: 12 }}>
          © {new Date().getFullYear()} {personalDetails.name}
        </footer>
      </div>
    </div>
  );
}
