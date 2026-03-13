import fs from 'fs';
import path from 'path';

const basePath = path.join(process.cwd(), 'src');
const pagesPath = path.join(basePath, 'pages-1cc');
const componentsPath = path.join(basePath, 'components');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walkDir(pagesPath);
const missing = new Set();

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /import\s+.*?\s+from\s+['"]@\/components\/(.*?)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Check if the component exists (.tsx, .ts, .jsx, .js, or index file)
    const options = [
      path.join(componentsPath, importPath + '.tsx'),
      path.join(componentsPath, importPath + '.ts'),
      path.join(componentsPath, importPath + '.jsx'),
      path.join(componentsPath, importPath + '.js'),
      path.join(componentsPath, importPath, 'index.tsx'),
      path.join(componentsPath, importPath, 'index.ts'),
      path.join(componentsPath, importPath, 'index.jsx'),
      path.join(componentsPath, importPath, 'index.js')
    ];
    
    let found = false;
    for (const opt of options) {
      if (fs.existsSync(opt)) {
        found = true;
        break;
      }
    }
    
    if (!found) {
      missing.add(importPath);
    }
  }
});

console.log('Missing components:');
missing.forEach(m => console.log(m));
