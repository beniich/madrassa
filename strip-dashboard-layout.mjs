/**
 * Script to strip DashboardLayout wrapper from pages-1cc files.
 * The pages will now render inside the main MainLayout (no secondary sidebar).
 */
import fs from 'fs';
import path from 'path';

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fp = path.join(dir, file);
    if (fs.statSync(fp).isDirectory()) {
      filelist = walkSync(fp, filelist);
    } else if (fp.endsWith('.tsx')) {
      filelist.push(fp);
    }
  });
  return filelist;
}

const pages1ccDir = path.join(process.cwd(), 'src/pages-1cc');
const files = walkSync(pages1ccDir);

let modified = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Remove the DashboardLayout import line
  const importRegex = /import\s*\{\s*DashboardLayout\s*\}\s*from\s*['"]@\/components\/dashboard\/DashboardLayout['"];\r?\n/g;
  if (importRegex.test(content)) {
    content = content.replace(importRegex, '');
    changed = true;
  }

  // 2. Remove opening <DashboardLayout> tag (may have attributes)
  const openTagRegex = /<DashboardLayout[^>]*>/g;
  if (openTagRegex.test(content)) {
    content = content.replace(openTagRegex, '<>');
    changed = true;
  }

  // 3. Remove closing </DashboardLayout> tag
  const closeTagRegex = /<\/DashboardLayout>/g;
  if (closeTagRegex.test(content)) {
    content = content.replace(closeTagRegex, '</>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    modified++;
    console.log(`✓ Stripped DashboardLayout from: ${path.relative(process.cwd(), file)}`);
  }
});

console.log(`\nDone! Modified ${modified} files.`);
