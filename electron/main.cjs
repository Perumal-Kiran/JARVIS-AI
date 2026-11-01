const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const OLLAMA_URL = 'http://127.0.0.1:11434';
const DEFAULT_MODEL = process.env.JARVIS_MODEL || 'qwen3.5:9b';
let selectedModel = DEFAULT_MODEL;

async function readSettings() {
  try {
    const file = path.join(app.getPath('userData'), 'settings.json');
    const settings = JSON.parse(await fs.readFile(file, 'utf8'));
    if (typeof settings.model === 'string' && settings.model.trim()) {
      selectedModel = settings.model.trim();
    }
  } catch {
    // First launch: use the configured default model.
  }
}

async function writeSettings() {
  const file = path.join(app.getPath('userData'), 'settings.json');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify({ model: selectedModel }, null, 2), 'utf8');
}

async function getInstalledModels() {
  const response = await fetch(`${OLLAMA_URL}/api/tags`);
  if (!response.ok) throw new Error('Ollama returned an error while listing models.');
  const data = await response.json();
  return (data.models || []).map((item) => item.name).filter(Boolean);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 650,
    backgroundColor: '#08090c',
    title: 'J.A.R.V.I.S.',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  if (!app.isPackaged) {
    win.loadURL('http://127.0.0.1:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(async () => {
  await readSettings();
  createWindow();
  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('jarvis:status', async () => {
  try {
    const models = await getInstalledModels();
    const modelAvailable = models.includes(selectedModel);
    return {
      connected: true,
      model: selectedModel,
      modelAvailable,
      models,
      recommendedModel: DEFAULT_MODEL
    };
  } catch {
    return {
      connected: false,
      model: selectedModel,
      modelAvailable: false,
      models: [],
      recommendedModel: DEFAULT_MODEL
    };
  }
});

ipcMain.handle('jarvis:set-model', async (_event, model) => {
  if (typeof model !== 'string' || !model.trim()) {
    throw new Error('Choose an installed model.');
  }

  const models = await getInstalledModels();
  if (!models.includes(model)) {
    throw new Error('That model is not installed in Ollama.');
  }

  selectedModel = model;
  await writeSettings();
  return { model: selectedModel };
});

ipcMain.handle('jarvis:chat', async (_event, message) => {
  if (typeof message !== 'string' || !message.trim() || message.length > 8000) {
    throw new Error('Enter a message under 8,000 characters.');
  }

  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: selectedModel,
      stream: false,
      messages: [
        {
          role: 'system',
          content: 'You are JARVIS, a composed and intelligent personal assistant. Speak polished British English, address the user as Sir where natural, and never claim actions you have not performed.'
        },
        { role: 'user', content: message.trim() }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('The local AI request failed. Check Ollama and the selected model.');
  }

  const data = await response.json();
  return { reply: data.message?.content || 'I could not generate a response.' };
});
