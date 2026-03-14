import fs from 'fs';
import path from 'path';

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach(function(file) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, filelist);
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
}

const componentsDir = path.join(process.cwd(), 'src/components');
const files = walkSync(componentsDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('[Placeholder]')) {
    // Extract function name
    const match = content.match(/export function (\w+)/);
    if (match) {
      const name = match[1];
      if (!content.includes(`export default ${name}`)) {
        console.log(`Updating ${file} with export default ${name}`);
        content += `\nexport default ${name};\n`;
        fs.writeFileSync(file, content);
      }
    }
  }
});
