const dsButton = document.getElementById('dsButton');
const webDropdown = document.getElementById('webDropdown');
const webExpButtons = document.querySelectorAll('[data-web-exp]');

const instructionsOverlay = document.getElementById('instructionsOverlay');
const instructionsTitle = document.getElementById('instructionsTitle');
const instructionsBody = document.getElementById('instructionsBody');
const instructionsClose = document.getElementById('instructionsClose');

let toastTimer = null;

function getOrCreateToast() {
	let toast = document.getElementById('dsToast');
	if (toast) return toast;

	toast = document.createElement('div');
	toast.id = 'dsToast';
	toast.setAttribute('role', 'status');
	toast.setAttribute('aria-live', 'polite');
	toast.style.position = 'fixed';
	toast.style.top = '52px';
	toast.style.left = '12px';
	toast.style.padding = '8px 10px';
	toast.style.border = '1px solid rgba(17, 24, 39, 0.16)';
	toast.style.borderRadius = '12px';
	toast.style.boxShadow = '0 8px 18px rgba(0, 0, 0, 0.10)';
	toast.style.background = '#fff';
	toast.style.color = '#111827';
	toast.style.font = 'inherit';
	toast.style.display = 'none';
	toast.style.pointerEvents = 'none';
	document.body.appendChild(toast);

	return toast;
}

function showToast(message) {
	const toast = getOrCreateToast();
	toast.textContent = message;
	toast.style.display = 'block';

	if (toastTimer) clearTimeout(toastTimer);
	toastTimer = setTimeout(() => {
		toast.style.display = 'none';
	}, 1400);
}

async function copyToClipboard(text) {
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(text);
		return;
	}

	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.setAttribute('readonly', '');
	textarea.style.position = 'fixed';
	textarea.style.top = '-9999px';
	textarea.style.left = '-9999px';
	document.body.appendChild(textarea);
	textarea.select();
	textarea.setSelectionRange(0, textarea.value.length);

	const ok = document.execCommand('copy');
	document.body.removeChild(textarea);
	if (!ok) {
		throw new Error('Copy failed');
	}
}

function escapeHtml(text) {
	return String(text)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function showInstructions(title, steps) {
	if (!instructionsOverlay || !instructionsTitle || !instructionsBody) return;

	instructionsTitle.textContent = title;

	const itemsHtml = steps
		.map((step) => `<li>${escapeHtml(step)}</li>`)
		.join('');

	instructionsBody.innerHTML = `<ol>${itemsHtml}</ol>`;
	instructionsOverlay.style.display = 'flex';
	instructionsOverlay.setAttribute('aria-hidden', 'false');
}

function hideInstructions() {
	if (!instructionsOverlay) return;
	instructionsOverlay.style.display = 'none';
	instructionsOverlay.setAttribute('aria-hidden', 'true');
}

function getCommonSnippetSteps(copiedFileLabel) {
	return [
		`${copiedFileLabel} JSON is copied to your clipboard.`,
		'Open VS Code.',
		'Press Ctrl+Shift+P.',
		'Type: Snippets: Configure User Snippets and press Enter.',
		'Click: New Global Snippets file...',
		'Give a name (example: ds.code-snippets or web-exp1.code-snippets).',
		'Paste the copied JSON into that file.',
		'Save the snippet file (Ctrl+S).'
	];
}

function getDsSteps() {
	return [
		'Create a new folder for your DS program (any name).',
		'Create a Python file (example: main.py).',
		'In the Python file, type a snippet prefix like: exp1 (or exp2, exp3, ...), then press Tab to insert the code.',
		'If Tab does not expand: press Ctrl+Space to open suggestions and select the snippet.',
		'Then run the Python file: Right click the file → Run Python File, or open terminal and run: python main.py.'
	];
}

function getWebExpSteps(exp) {
	const expLabel = `exp${exp}`;
	if (exp === '1') {
		return [
			`Create a folder named ${expLabel}.`,
			'Create these files inside it: index.html and portfolio.css.',
			'Open index.html, type: web-exp1-index-html then press Tab (or pick the snippet from suggestions).',
			'Open portfolio.css, type: web-exp1-portfolio-css then press Tab.',
			'To run: right click index.html → Open with Live Server (recommended) or open index.html in a browser.'
		];
	}

	if (exp === '2') {
		return [
			`Create a folder named ${expLabel}.`,
			'Create these files inside it: index.html, style.css, script.js.',
			'In index.html insert snippet: web-exp2-index-html.',
			'In style.css insert snippet: web-exp2-style-css.',
			'In script.js insert snippet: web-exp2-script-js.',
			'To run: Open index.html with Live Server (recommended) or open in a browser.'
		];
	}

	if (exp === '3') {
		return [
			'Exp3 needs PHP + MySQL, so you must install a local server (XAMPP recommended).',
			'Download XAMPP (Windows): https://www.apachefriends.org/download.html',
			'Install XAMPP. Recommended install folder: C:/xampp (default).',
			"If you want XAMPP inside this experiment folder: during install, set the install path to .../WEB TECHNOLOGY/exp3/xampp (this folder is ignored by git).",
			'Open XAMPP Control Panel (xampp-control.exe) → start Apache and MySQL.',
			`Place your project inside the web root (htdocs): create a folder named ${expLabel} in htdocs.`,
			'Examples:',
			'- If installed to C:/xampp: C:/xampp/htdocs/exp3',
			'- If installed to .../exp3/xampp: .../WEB TECHNOLOGY/exp3/xampp/htdocs/exp3',
			'Inside that exp3 folder, create these files: index.php, add.php, view.php, delete.php, db.php, database.sql.',
			'Insert snippets into each matching file:',
			'- index.php: web-exp3-index-php',
			'- add.php: web-exp3-add-php',
			'- view.php: web-exp3-view-php',
			'- delete.php: web-exp3-delete-php',
			'- db.php: web-exp3-db-php',
			'- database.sql: web-exp3-database-sql',
			'Open http://localhost/phpmyadmin → Databases → create: inventory_db',
			'Open the new database → Import → choose database.sql → Go (or copy/paste SQL into the SQL tab).',
			'To run: open http://localhost/exp3/index.php in your browser.'
		];
	}

	if (exp === '4') {
		return [
			`Create a folder named ${expLabel}.`,
			'Create a Python file named app.py.',
			'Insert snippet: web-exp4-app-py.',
			'Open a terminal in that folder and install requirements: pip install flask werkzeug.',
			'Run the app: python app.py.',
			'Open the shown URL (usually http://127.0.0.1:5000) in a browser.'
		];
	}

	if (exp === '5') {
		return [
			`Create a folder named ${expLabel}.`,
			'Inside it, create this structure: task-manager/public/',
			'Create files:',
			'- exp5/package.json (snippet: web-exp5-package-json)',
			'- exp5/task-manager/package.json (snippet: web-exp5-task-manager-package-json)',
			'- exp5/task-manager/server.js (snippet: web-exp5-task-manager-server-js)',
			'- exp5/task-manager/tasks.json (snippet: web-exp5-task-manager-tasks-json)',
			'- exp5/task-manager/public/index.html (snippet: web-exp5-task-manager-public-index-html)',
			'- exp5/task-manager/public/script.js (snippet: web-exp5-task-manager-public-script-js)',
			'- exp5/task-manager/public/style.css (snippet: web-exp5-task-manager-public-style-css)',
			'Open terminal in exp5/task-manager and run: npm install',
			'Then run: node server.js (or npm start).',
			'Open http://localhost:5000 in your browser.'
		];
	}

	if (exp === '6') {
		return [
			`Create a folder named ${expLabel}.`,
			'Create files: package.json and server.js.',
			'Insert snippets:',
			'- package.json: web-exp6-package-json',
			'- server.js: web-exp6-server-js',
			'Open terminal in exp6 and run: npm install',
			'Then run: node server.js',
			'Test API endpoints using browser/Postman:',
			'- GET http://localhost:3000/products',
			'- POST/PUT/DELETE via Postman with JSON body'
		];
	}

	if (exp === '7') {
		return [
			`Create a folder named ${expLabel}.`,
			'Inside it, create public/ folder.',
			'Create files: package.json, server.js, public/index.html.',
			'Insert snippets:',
			'- package.json: web-exp7-package-json',
			'- server.js: web-exp7-server-js',
			'- public/index.html: web-exp7-public-index-html',
			'Open terminal in exp7 and run: npm install',
			'Then run: node server.js',
			'Open http://localhost:3000 in two browser tabs and chat.'
		];
	}

	return [`No instructions found for ${expLabel}.`];
}

function toAbsoluteUrl(relativePath) {
	return new URL(relativePath, window.location.href).toString();
}

async function copyJsonFile(relativePath) {
	const response = await fetch(toAbsoluteUrl(relativePath), { cache: 'no-store' });
	if (!response.ok) {
		throw new Error(`Failed to load ${relativePath} (${response.status})`);
	}
	const text = await response.text();
	await copyToClipboard(text);
}

dsButton.addEventListener('click', async () => {
	try {
		await copyJsonFile('./python.json');
		showToast('Copied to clipboard');
		showInstructions(
			'DS (Python) – Step by step',
			[...getCommonSnippetSteps('DS'), ...getDsSteps()]
		);
	} catch (err) {
		console.error(err);
		showToast('Copy failed');
	}
});

for (const button of webExpButtons) {
	button.addEventListener('click', async () => {
		const exp = button.getAttribute('data-web-exp');
		const jsonPath = `./WEB TECHNOLOGY/exp${exp}/exp${exp}.json`;
		try {
			await copyJsonFile(jsonPath);
			showToast(`Copied exp${exp}`);
			showInstructions(
				`Web ${`exp${exp}`} – Step by step`,
				[...getCommonSnippetSteps(`Web exp${exp}`), ...getWebExpSteps(exp)]
			);
			if (webDropdown) webDropdown.removeAttribute('open');
		} catch (err) {
			console.error(err);
			showToast('Copy failed');
		}
	});
}

document.addEventListener('click', (event) => {
	if (!webDropdown) return;
	if (!webDropdown.hasAttribute('open')) return;
	const target = event.target;
	if (target instanceof Node && webDropdown.contains(target)) return;
	webDropdown.removeAttribute('open');
});

if (instructionsClose) {
	instructionsClose.addEventListener('click', hideInstructions);
}
