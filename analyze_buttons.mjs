import fs from 'fs';
import path from 'path';

const srcDirs = [path.join(process.cwd(), 'src/pages'), path.join(process.cwd(), 'src/components')];

function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
}

const allFiles = srcDirs.flatMap(d => walkSync(d));

const buttonsAndLinks = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find <Link to="...">...</Link>
  const linkRegex = /<Link[^>]*to=["'{]([^"'}]+)["'}][^>]*>(.*?)<\/Link>/gs;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
      buttonsAndLinks.push({
          file: path.relative(process.cwd(), file),
          type: 'Link',
          dest: match[1],
          text: match[2].replace(/<\/?[^>]+(>|$)/g, "").trim().substring(0, 30)
      });
  }

  // Find <a href="...">...</a>
  const aRegex = /<a[^>]*href=["'{]([^"'}]+)["'}][^>]*>(.*?)<\/a>/gs;
  while ((match = aRegex.exec(content)) !== null) {
      buttonsAndLinks.push({
          file: path.relative(process.cwd(), file),
          type: 'a (Ancre)',
          dest: match[1],
          text: match[2].replace(/<\/?[^>]+(>|$)/g, "").trim().substring(0, 30)
      });
  }
  
  // Find Button tags with onClick
  // Using a simpler regex to catch <Button ... onClick={...}>...</Button>
  const btnRegex = /<Button[^>]*onClick=\{([^}]+)\}[^>]*>(.*?)<\/Button>/gs;
  while ((match = btnRegex.exec(content)) !== null) {
      buttonsAndLinks.push({
          file: path.relative(process.cwd(), file),
          type: 'Button (onClick)',
          dest: match[1].trim(),
          text: match[2].replace(/<\/?[^>]+(>|$)/g, "").trim().substring(0, 30)
      });
  }
}

// Write json output
fs.writeFileSync('button_links_report.json', JSON.stringify(buttonsAndLinks, null, 2));
console.log(`Trouvé ${buttonsAndLinks.length} éléments avec liens ou actions. Rapport généré dans button_links_report.json.`);
