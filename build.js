const fs = require('fs');

const files = [
  'index.html',
  'main.js',
  'styles.css',
  'site.webmanifest',
  'sw.js',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'image.png',
];

// 1. Delete the old build
fs.rmSync('www', { recursive: true, force: true });

// 2. Create a fresh www folder
fs.mkdirSync('www', { recursive: true });

// 3. Copy individual files
for (const file of files) {
  fs.copyFileSync(file, `www/${file}`);
}

// 4. Copy entire folders
fs.cpSync('icons', 'www/icons', { recursive: true });
fs.cpSync('images', 'www/images', { recursive: true });

console.log('Built TipCalc into www/');
