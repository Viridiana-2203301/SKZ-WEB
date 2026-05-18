const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public');
const entries = [
  'index.html',
  'albums.html',
  'dashboard.html',
  'favicon.ico',
  'css',
  'js',
  'data',
  'pages',
];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const entry of entries) {
  const source = path.join(root, entry);
  const destination = path.join(output, entry);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing frontend asset: ${entry}`);
  }

  fs.cpSync(source, destination, { recursive: true });
}

const config = `window.SKZ_CONFIG = ${JSON.stringify({
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  apiBaseUrl: process.env.API_BASE_URL || 'auto',
}, null, 2)};\n`;

fs.writeFileSync(path.join(output, 'js', 'config.js'), config, 'utf8');
