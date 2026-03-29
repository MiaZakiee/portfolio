import personalDetails from '@data/personalDetails.json';
import projects from '@data/projects.json';
import skills from '@data/skills.json';
import experience from '@data/experience.json';
import aboutme from '@data/aboutme.json';
import contacts from '@data/contacts.json';
import certifications from '@data/certifications.json';

// Build the virtual filesystem from JSON data
function buildFileSystem() {
  const fs = {
    '/': {
      type: 'dir',
      children: ['aboutme.txt', 'contacts.txt', 'projects', 'skills', 'experience', 'certifications.txt'],
    },
    '/aboutme.txt': {
      type: 'file',
      content: formatAboutMe(),
    },
    '/contacts.txt': {
      type: 'file',
      content: formatContacts(),
    },
    '/certifications.txt': {
      type: 'file',
      content: formatCertifications(),
    },
    '/projects': {
      type: 'dir',
      children: projects.map((p) => p.slug + '.txt'),
    },
    '/skills': {
      type: 'dir',
      children: ['languages.txt', 'frameworks.txt', 'tools.txt', 'soft.txt'],
    },
    '/experience': {
      type: 'dir',
      children: experience.map((e) => e.slug + '.txt'),
    },
  };

  // Add project files
  projects.forEach((p) => {
    fs[`/projects/${p.slug}.txt`] = {
      type: 'file',
      content: formatProject(p),
    };
  });

  // Add skill files
  Object.entries(skills).forEach(([category, items]) => {
    fs[`/skills/${category}.txt`] = {
      type: 'file',
      content: formatSkillCategory(category, items),
    };
  });

  // Add experience files
  experience.forEach((e) => {
    fs[`/experience/${e.slug}.txt`] = {
      type: 'file',
      content: formatExperience(e),
    };
  });

  return fs;
}

function formatAboutMe() {
  const lines = [];
  lines.push(`\x1b[1;36m╭─── About Me ───╮\x1b[0m`);
  lines.push('');
  lines.push(aboutme.bio);
  lines.push('');
  lines.push(`\x1b[1;33m⚡ Interests:\x1b[0m ${aboutme.interests.join(', ')}`);
  lines.push('');
  lines.push(`\x1b[1;33m🎲 Fun Facts:\x1b[0m`);
  aboutme.funFacts.forEach((f) => lines.push(`   • ${f}`));
  lines.push('');
  lines.push(`\x1b[1;33m📌 Currently:\x1b[0m`);
  lines.push(`   Learning: ${aboutme.currently.learning}`);
  lines.push(`   Reading:  ${aboutme.currently.reading}`);
  lines.push(`   Building: ${aboutme.currently.building}`);
  lines.push('');
  lines.push(`\x1b[1;36m╰─────────────────╯\x1b[0m`);
  return lines.join('\n');
}

function formatContacts() {
  const lines = [];
  lines.push(`\x1b[1;36m╭─── Contact ───╮\x1b[0m`);
  lines.push('');
  Object.entries(contacts).forEach(([key, val]) => {
    const icon = { github: '🐙', linkedin: '💼', email: '📧', twitter: '🐦', resume: '📄' }[key] || '🔗';
    lines.push(`   ${icon}  \x1b[1;33m${key.padEnd(10)}\x1b[0m ${val}`);
  });
  lines.push('');
  lines.push(`\x1b[1;36m╰────────────────╯\x1b[0m`);
  return lines.join('\n');
}

function formatProject(p) {
  const lines = [];
  lines.push(`\x1b[1;36m╭─── ${p.name} ───╮\x1b[0m`);
  lines.push('');
  lines.push(`  \x1b[1;33mDescription:\x1b[0m ${p.description}`);
  lines.push(`  \x1b[1;33mTech Stack:\x1b[0m  ${p.tech.join(', ')}`);
  lines.push(`  \x1b[1;33mDate:\x1b[0m        ${p.date}`);
  lines.push(`  \x1b[1;33mLink:\x1b[0m        ${p.link}`);
  lines.push('');
  lines.push(`\x1b[1;36m╰${'─'.repeat(p.name.length + 8)}╯\x1b[0m`);
  return lines.join('\n');
}

function formatSkillCategory(category, items) {
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  const lines = [];
  lines.push(`\x1b[1;36m╭─── ${title} ───╮\x1b[0m`);
  lines.push('');
  items.forEach((item) => lines.push(`   \x1b[1;32m●\x1b[0m ${item}`));
  lines.push('');
  lines.push(`\x1b[1;36m╰${'─'.repeat(title.length + 8)}╯\x1b[0m`);
  return lines.join('\n');
}

function formatExperience(e) {
  const lines = [];
  lines.push(`\x1b[1;36m╭─── ${e.company} ───╮\x1b[0m`);
  lines.push('');
  lines.push(`  \x1b[1;33mRole:\x1b[0m    ${e.role}`);
  lines.push(`  \x1b[1;33mPeriod:\x1b[0m  ${e.dates}`);
  lines.push(`  \x1b[1;33mDetails:\x1b[0m ${e.description}`);
  lines.push('');
  lines.push(`\x1b[1;36m╰${'─'.repeat(e.company.length + 8)}╯\x1b[0m`);
  return lines.join('\n');
}

function formatCertifications() {
  const lines = [];
  lines.push(`\x1b[1;36m╭─── Certifications ───╮\x1b[0m`);
  lines.push('');
  certifications.forEach((c) => {
    lines.push(`  \x1b[1;33m${c.name}\x1b[0m`);
    lines.push(`  Issued By: ${c.issuer}`);
    lines.push('');
  });
  lines.push(`\x1b[1;36m╰────────────────────────╯\x1b[0m`);
  return lines.join('\n');
}

function generateNeofetch() {
  const d = personalDetails;
  const info = [
    `\x1b[1;32m${d.handle}\x1b[0m@\x1b[1;36mportfolio\x1b[0m`,
    `\x1b[1;37m${'-'.repeat(d.handle.length + 10)}\x1b[0m`,
    `\x1b[1;33mName:\x1b[0m     \x1b[1;37m${d.name}\x1b[0m`,
    `\x1b[1;33mRole:\x1b[0m     \x1b[1;37m${d.role}\x1b[0m`,
    `\x1b[1;33mLocation:\x1b[0m \x1b[1;37m${d.location}\x1b[0m`,
    `\x1b[1;33mOS:\x1b[0m       \x1b[1;37m${d.os}\x1b[0m`,
    `\x1b[1;33mShell:\x1b[0m    \x1b[1;37m${d.shell}\x1b[0m`,
    `\x1b[1;33mTerminal:\x1b[0m \x1b[1;37m${d.terminal}\x1b[0m`,
    `\x1b[1;33mUptime:\x1b[0m   \x1b[1;37m${d.uptime}\x1b[0m`,
    `\x1b[1;33mPackages:\x1b[0m \x1b[1;37m${d.packages}\x1b[0m`,
    '',
    `\x1b[40m  \x1b[41m  \x1b[42m  \x1b[43m  \x1b[44m  \x1b[45m  \x1b[46m  \x1b[47m  \x1b[0m`,
  ];

  return { isNeofetch: true, info, ascii: d.ascii, image: d.image };
}

// The command processor
export function createTerminal() {
  const fileSystem = buildFileSystem();
  let cwd = '/';

  function resolvePath(input) {
    if (!input) return cwd;
    if (input.startsWith('/')) return normalizePath(input);
    if (input === '..') {
      const parts = cwd.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/');
    }
    if (input === '.') return cwd;
    const base = cwd === '/' ? '' : cwd;
    return normalizePath(`${base}/${input}`);
  }

  function normalizePath(p) {
    const parts = p.split('/').filter(Boolean);
    const resolved = [];
    for (const part of parts) {
      if (part === '..') resolved.pop();
      else if (part !== '.') resolved.push(part);
    }
    return '/' + resolved.join('/');
  }

  function getPrompt() {
    const pathDisplay = cwd === '/' ? '~' : '~' + cwd;
    return `\x1b[1;32m${personalDetails.handle}\x1b[0m \x1b[1;34m${pathDisplay}\x1b[0m \x1b[1;31m❯\x1b[0m `;
  }

  function getCompletions(partial) {
    const parts = partial.split(' ');
    const commands = ['ls', 'cd', 'cat', 'clear', 'help', 'pwd', 'whoami', 'neofetch', 'echo', 'tree'];

    // Command completion
    if (parts.length === 1) {
      return commands.filter((c) => c.startsWith(parts[0]));
    }

    // Path completion
    if (parts.length === 2) {
      const cmd = parts[0];
      const pathPart = parts[1];

      if (['cd', 'cat', 'ls'].includes(cmd)) {
        // Determine directory to list
        let dir = cwd;
        let prefix = '';

        if (pathPart.includes('/')) {
          const lastSlash = pathPart.lastIndexOf('/');
          const dirPart = pathPart.substring(0, lastSlash) || '/';
          prefix = pathPart.substring(lastSlash + 1);
          dir = resolvePath(dirPart);
        } else {
          prefix = pathPart;
        }

        const node = fileSystem[dir];
        if (node && node.type === 'dir') {
          const matches = node.children.filter((c) => c.startsWith(prefix));
          if (pathPart.includes('/')) {
            const dirPart = pathPart.substring(0, pathPart.lastIndexOf('/') + 1);
            return matches.map((m) => `${cmd} ${dirPart}${m}`);
          }
          return matches.map((m) => `${cmd} ${m}`);
        }
      }
    }

    return [];
  }

  function execute(input) {
    const trimmed = input.trim();
    if (!trimmed) return '';

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        return [
          '',
          '\x1b[1;36m╭─── Available Commands ───╮\x1b[0m',
          '',
          '  \x1b[1;32mls\x1b[0m [path]       List directory contents',
          '  \x1b[1;32mcd\x1b[0m <path>       Change directory',
          '  \x1b[1;32mcat\x1b[0m <file>      Display file contents',
          '  \x1b[1;32mpwd\x1b[0m             Print working directory',
          '  \x1b[1;32mtree\x1b[0m            Show directory tree',
          '  \x1b[1;32mwhoami\x1b[0m          Display user info',
          '  \x1b[1;32mneofetch\x1b[0m        System info with ASCII art',
          '  \x1b[1;32mclear\x1b[0m           Clear terminal',
          '  \x1b[1;32mhelp\x1b[0m            Show this message',
          '  \x1b[1;32mecho\x1b[0m <text>     Print text',
          '',
          '  \x1b[1;33mTip:\x1b[0m Press Tab for autocomplete!',
          '',
          '\x1b[1;36m╰──────────────────────────╯\x1b[0m',
          '',
        ].join('\n');

      case 'clear':
        return '__CLEAR__';

      case 'pwd':
        return cwd === '/' ? '/' : cwd;

      case 'whoami':
        return `${personalDetails.name} (${personalDetails.role})`;

      case 'neofetch':
        return generateNeofetch();

      case 'echo':
        return args.join(' ');

      case 'ls': {
        const target = resolvePath(args[0]);
        const node = fileSystem[target];
        if (!node) return `\x1b[1;31mls: cannot access '${args[0]}': No such file or directory\x1b[0m`;
        if (node.type === 'file') return args[0] || target.split('/').pop();
        const items = node.children.map((child) => {
          const childPath = target === '/' ? `/${child}` : `${target}/${child}`;
          const childNode = fileSystem[childPath];
          const isDir = childNode && childNode.type === 'dir';
          return { name: child, isDir, action: isDir ? `cd ${child}` : `cat ${child}` };
        });
        return { isLsOutput: true, items };
      }

      case 'cd': {
        if (!args[0] || args[0] === '~') {
          cwd = '/';
          return '';
        }
        const target = resolvePath(args[0]);
        const node = fileSystem[target];
        if (!node) return `\x1b[1;31mcd: no such directory: ${args[0]}\x1b[0m`;
        if (node.type !== 'dir') return `\x1b[1;31mcd: not a directory: ${args[0]}\x1b[0m`;
        cwd = target;
        return '';
      }

      case 'cat': {
        if (!args[0]) return '\x1b[1;31mcat: missing file operand\x1b[0m';
        let target = resolvePath(args[0]);
        let node = fileSystem[target];
        // Try appending .txt if not found
        if (!node && !target.endsWith('.txt')) {
          target = target + '.txt';
          node = fileSystem[target];
        }
        if (!node) return `\x1b[1;31mcat: ${args[0]}: No such file or directory\x1b[0m`;
        if (node.type === 'dir') return `\x1b[1;31mcat: ${args[0]}: Is a directory\x1b[0m`;
        return node.content;
      }

      case 'tree': {
        const lines = ['\x1b[1;34m.\x1b[0m'];
        const root = fileSystem['/'];
        root.children.forEach((child, i) => {
          const isLast = i === root.children.length - 1;
          const prefix = isLast ? '└── ' : '├── ';
          const childPath = `/${child}`;
          const childNode = fileSystem[childPath];
          if (childNode && childNode.type === 'dir') {
            lines.push(`${prefix}\x1b[1;34m${child}/\x1b[0m`);
            childNode.children.forEach((sub, j) => {
              const subLast = j === childNode.children.length - 1;
              const subPrefix = (isLast ? '    ' : '│   ') + (subLast ? '└── ' : '├── ');
              lines.push(`${subPrefix}${sub}`);
            });
          } else {
            lines.push(`${prefix}${child}`);
          }
        });
        return lines.join('\n');
      }

      default:
        return `\x1b[1;31mcommand not found: ${cmd}\x1b[0m\nType \x1b[1;32mhelp\x1b[0m for available commands.`;
    }
  }

  return {
    execute,
    getPrompt,
    getCompletions,
    getNeofetch: generateNeofetch,
    getCwd: () => cwd,
  };
}
