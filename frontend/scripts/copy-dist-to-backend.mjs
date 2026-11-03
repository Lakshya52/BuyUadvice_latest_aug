// Copies frontend/dist/* -> backend/ so backend/ is the complete
// Hostinger public_html upload (SPA + PHP API) and `php -S` serves
// the latest frontend on the same port as the API.
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const frontendDir = dirname(here);
const distDir = join(frontendDir, 'dist');
const backendDir = join(frontendDir, '..', 'backend');

if (!existsSync(distDir)) {
  console.error('dist/ not found. Run `vite build` first.');
  process.exit(1);
}

for (const entry of readdirSync(distDir)) {
  const target = join(backendDir, entry);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
  cpSync(join(distDir, entry), target, { recursive: true });
  console.log(`synced: ${entry}`);
}

console.log('backend/ now contains the latest frontend build.');
