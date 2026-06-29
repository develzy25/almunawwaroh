/* eslint-disable */
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Format versi yang diminta: x.y.25
const currentVersion = packageJson.version || '1.0.25';
const parts = currentVersion.split('.');

if (parts.length === 3) {
  let major = parseInt(parts[0], 10);
  let minor = parseInt(parts[1], 10);
  let patch = parseInt(parts[2], 10);

  // Jika patch bukan 25 (karena satu dan lain hal), kita force jadi 25.
  // Tapi untuk increment normal, kita naikkan minor version-nya.
  minor += 1;
  patch = 25;

  const newVersion = `${major}.${minor}.${patch}`;
  packageJson.version = newVersion;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Version bumped from ${currentVersion} to ${newVersion}`);
} else {
  console.error('Format versi di package.json tidak dikenali (harus x.y.z)');
  process.exit(1);
}
