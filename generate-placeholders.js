import fs from 'fs';
import path from 'path';

const missingList = fs.readFileSync('missing.txt', 'utf8').split('\n');
const componentsPath = path.join(process.cwd(), 'src', 'components');

missingList.forEach(line => {
  const compPath = line.trim();
  if (!compPath || compPath === 'Missing components:') return;

  const fullPath = path.join(componentsPath, compPath + '.tsx');
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const compName = path.basename(compPath);
  
  const content = `import React from 'react';

export function ${compName}(props: any) {
  return (
    <div className="p-4 border rounded-md text-sm text-muted-foreground">
      [Placeholder] ${compName} component
    </div>
  );
}
`;

  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
    console.log('Created', fullPath);
  }
});
