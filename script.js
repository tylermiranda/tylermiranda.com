async function simulateCommand(url, text) {
  const command = `Invoke-WebRequest -Uri '${url}'`;
  const terminalContent = document.querySelector('.terminal-content');
  const content = document.querySelector('.content');

  // Store current content
  const currentContent = content.innerHTML;

  // Clear content
  content.innerHTML = `
    <div class="command initial-command">PS /Users/Visitor> </div>
  `;

  // Type command
  const cmdElement = content.querySelector('.initial-command');
  for (let i = 0; i <= command.length; i++) {
    cmdElement.textContent = `PS /Users/Visitor> ${command.substring(0, i)}`;
    await new Promise(resolve => setTimeout(resolve, 20));
  }

  // Open URL in new tab
  await new Promise(resolve => setTimeout(resolve, 500));
  window.open(url, '_blank', 'noopener,noreferrer');

  // Restore content
  await new Promise(resolve => setTimeout(resolve, 1000));
  content.innerHTML = currentContent.replace(/Welcome.*?commands\./g, '');

  // Reinitialize any necessary event listeners
  initializeEventListeners();
}

function createExperienceItem(title, content) {
  // Check if title contains a link
  const linkMatch = title.match(/\[(.*?)\]\((.*?)\)/);
  let processedTitle = title;

  if (linkMatch) {
    const [fullMatch, text, url] = linkMatch;
    processedTitle = title.replace(fullMatch, `<a href="#" onclick="event.preventDefault(); simulateCommand('${url}', '${text}')">${text}</a>`);
  }

  return `
    <div class="experience-item">
      <h3>${processedTitle}</h3>
      <p>${content}</p>
    </div>
  `;
}

function parseSkills(content) {
  const skills = content.split('\n')
    .filter(line => line.startsWith('-'))
    .map(skill => skill.replace('-', '').trim());

  return `
    <div class="tags">
      ${skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
    </div>
  `;
}

function parseSection(title, content) {
  if (title === 'Skills') {
    return parseSkills(content);
  }

  if (title === 'Certifications') {
    const items = content.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(item => `<li>${item.trim().substring(2)}</li>`)
      .join('');
    return `<ul>${items}</ul>`;
  }

  if (title === 'Experience' || title === 'Education') {
    const items = content.split('\n### ').filter(Boolean);
    return items.map(item => {
      const [itemTitle, ...itemContent] = item.split('\n');
      const cleanTitle = itemTitle.replace(/^### /, '');
      const processedContent = itemContent
        .join('\n')
        .split('\n')
        .map(line => {
          if (line.trim().startsWith('- ')) {
            return `<li>${line.trim().substring(2)}</li>`;
          }
          return line;
        })
        .join('\n');
      return createExperienceItem(cleanTitle, processedContent.replace(/<li>/g, '<ul><li>').replace(/<\/li>\n(?!<li>)/g, '</li></ul>\n'));
    }).join('');
  }

  if (title === 'Contact') {
    return content.split('\n')
      .filter(line => line.includes('['))
      .map(line => {
        const [text, url] = line.match(/\[(.*?)\]\((.*?)\)/).slice(1);
        const target = url.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"';
        return `<a href="${url}" class="contact-link"${target}>${text}</a>`;
      }).join('');
  }

  // Process bullet points and bold text
  const lines = content.split('\n');
  const processedLines = lines.map(line => {
    // Handle bullet points
    if (line.trim().startsWith('- ')) {
      const bulletContent = line.trim().substring(2);
      // Process bold text within bullet points
      const processedBullet = bulletContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<li>${processedBullet}</li>`;
    }
    // Process bold text in regular lines
    return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  });

  if (processedLines.some(line => line.startsWith('<li>'))) {
    return `<ul>${processedLines.join('\n')}</ul>`;
  }
  return `<p>${processedLines.join('\n')}</p>`;
}

async function loadContent() {
  try {
    const response = await fetch('content.md');
    const markdown = await response.text();
    const sections = markdown.split('\n## ').slice(1);
    const mainTitle = markdown.split('\n')[0].replace('# ', '');

    const output = document.querySelector('.output');
    output.innerHTML = `<h1>${mainTitle}</h1>`;

    // Add interactive command line
    const terminalContent = document.querySelector('.terminal-content');
    const lastCommand = terminalContent.querySelector('.command:last-child');
    lastCommand.innerHTML = `PS /Users/Visitor><input type="text" class="command-input" />`;

    const commandInput = lastCommand.querySelector('.command-input');

    const commands = {
      '?': 'Shows this help message',
      'Send-Email': 'Opens your default email client to send me an email',
      'Get-Resume': 'Displays my resume information',
      'Get-LinkedIn': 'Opens my LinkedIn profile',
      'Clear-Host': 'Clears the terminal screen'
    };

    function displayHelp() {
      const helpContent = Object.entries(commands)
        .map(([cmd, desc]) => `${cmd.padEnd(15)} - ${desc}`)
        .join('\n');

      const helpDiv = document.createElement('div');
      helpDiv.style.color = '#ffffff';
      helpDiv.style.marginLeft = '20px';
      helpDiv.style.whiteSpace = 'pre';
      helpDiv.textContent = `Available Commands:\n\n${helpContent}`;

      return helpDiv;
    }

    function handleCommand(command) {
      if (command === '?') {
        return displayHelp();
      }

      if (command === 'Send-Email') {
        window.location.href = 'mailto:tyler.miranda@gmail.com?subject=I%20want%20to%20hire%20you!';
        return createOutputDiv('Opening email client...');
      }

      if (command === 'Get-Resume') {
        window.open('https://docs.google.com/document/d/18HLUyYZaaRRvGUiA7XVZnfgjbHsR5C62/edit?usp=sharing&ouid=108376089676197856722&rtpof=true&sd=true', '_blank', 'noopener,noreferrer');
        return createOutputDiv('Opening resume in new tab...');
      }

      if (command === 'Get-LinkedIn') {
        window.open('https://www.linkedin.com/in/tyler-miranda-pro/', '_blank', 'noopener,noreferrer');
        return createOutputDiv('Opening LinkedIn profile in new tab...');
      }

      if (command === 'Clear-Host') {
        window.location.reload();
        return null;
      }

      return createOutputDiv(`Command not recognized: ${command}\nType ? for available commands.`);
    }

    function createOutputDiv(text) {
      const div = document.createElement('div');
      div.style.color = '#ffffff';
      div.style.marginLeft = '20px';
      div.style.whiteSpace = 'pre';
      div.textContent = text;
      return div;
    }

    function setupCommandInput(inputElement) {
      inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const command = inputElement.value.trim();
          inputElement.value = '';

          // Add the previous command as plain text
          const prevCommand = document.createElement('div');
          prevCommand.className = 'command';
          prevCommand.textContent = `PS /Users/Visitor>  ${command}`;
          terminalContent.appendChild(prevCommand);

          // Handle command and show output if any
          const output = handleCommand(command);
          if (output) {
            terminalContent.appendChild(output);
          }

          // Create new command line
          const newCommand = document.createElement('div');
          newCommand.className = 'command';
          newCommand.innerHTML = `PS /Users/Visitor> <input type="text" class="command-input" />`;

          // Add the new command line
          terminalContent.appendChild(newCommand);

          // Setup the new input and focus it
          const newInput = newCommand.querySelector('.command-input');
          setupCommandInput(newInput);
          newInput.focus();
        }
      });
    }

    // Setup initial command input
    setupCommandInput(commandInput);

    // Focus input on load
    commandInput.focus();

    // Add welcome message only on initial load
    if (!document.querySelector('.welcome-message')) {
      const welcomeDiv = document.createElement('div');
      welcomeDiv.className = 'welcome-message';
      welcomeDiv.style.color = '#00ff00';
      welcomeDiv.style.marginLeft = '20px';
      welcomeDiv.style.marginBottom = '15px';
      welcomeDiv.textContent = 'Welcome! This is an interactive terminal. Type ? and press Enter to see available commands.';
      terminalContent.insertBefore(welcomeDiv, terminalContent.lastChild);
    }

    sections.forEach(section => {
      const [title, ...content] = section.split('\n');
      const cleanContent = content.join('\n').trim();

      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'section';
      sectionDiv.innerHTML = `
        <h2>> Get-${title.trim()}</h2>
        ${parseSection(title.trim(), cleanContent)}
      `;

      output.appendChild(sectionDiv);
    });
  } catch (error) {
    console.error('Error loading content:', error);
  }
}

async function typeCommand(text) {
  const initialCommand = document.querySelector('.initial-command');
  const baseText = 'PS /Users/Visitor>';
  const command = 'Get-Resume';
  const args = ' -Name "Tyler Miranda"';
  const fullText = `${baseText}${command}${args}`;

  for (let i = 0; i <= fullText.length; i++) {
    if (i <= baseText.length) {
      initialCommand.textContent = fullText.substring(0, i);
    } else if (i <= baseText.length + command.length) {
      initialCommand.innerHTML = `${baseText}<span style="color: #FFFF00">${command.substring(0, i - baseText.length)}</span>`;
    } else {
      initialCommand.innerHTML = `${baseText}<span style="color: #FFFF00">${command}</span><span style="color: #808080">${args.substring(0, i - (baseText.length + command.length))}</span>`;
    }
    await new Promise(resolve => setTimeout(resolve, 20));
  }
}

function initializeEventListeners() {
  // Add click handlers for all window controls
  const linkedInUrl = 'https://www.linkedin.com/in/tyler-miranda-pro/';
  ['close', 'minimize', 'maximize'].forEach(control => {
    document.querySelector('.' + control).addEventListener('click', () => {
      window.location.href = linkedInUrl;
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  window.scrollTo(0, 0);
  await typeCommand('Get-Resume -Name "Tyler Miranda"');
  await new Promise(resolve => setTimeout(resolve, 500));
  document.querySelector('.content').style.display = 'block';
  loadContent();
  initializeEventListeners();
  window.scrollTo(0, 0);

  // Add click handlers for all window controls
  const linkedInUrl = 'https://www.linkedin.com/in/tyler-miranda-pro/';
  ['close', 'minimize', 'maximize'].forEach(control => {
    document.querySelector('.' + control).addEventListener('click', () => {
      window.location.href = linkedInUrl;
    });
  });
});
