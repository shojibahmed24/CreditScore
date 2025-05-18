const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config();

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('Main: Preload path:', preloadPath);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');
  win.webContents.openDevTools(); // ডিবাগিংয়ের জন্য ডেভটুলস খুলুন
}

app.whenReady().then(createWindow);

ipcMain.handle('get-env', () => {
  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  };
});

ipcMain.handle('ask-ai', async (event, userInput, software, screenText, customPrompt) => {
  const prompt = customPrompt || `
ইউজার ব্যবহার করছে: ${software}
ইউজার বলেছে: "${userInput || 'কোনো ভয়েস ইনপুট নেই'}"
স্ক্রিনে থাকা টেক্সট: "${screenText || 'কোনো স্ক্রিন টেক্সট নেই'}"
তুমি একজন সফটওয়্যার গাইড। ${software} অনুযায়ী ইউজারের সমস্যার সমাধান দাও।
ধাপে ধাপে বাংলায় নির্দেশনা দাও। প্রতিটি ধাপ আলাদা লাইনে দাও।
`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) throw new Error('এপিআই রিকোয়েস্ট ব্যর্থ');
    const data = await res.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('ত্রুটি:', error);
    return 'নির্দেশনা তৈরি করতে ত্রুটি হয়েছে। দয়া করে আবার চেষ্টা করুন।';
  }
});