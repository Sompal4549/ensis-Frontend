const fs = require('fs');
const path = require('path');

const root = process.cwd();
const exts = ['.png','.jpg','.jpeg','.gif','.svg','.webp'];
const codeExts = ['.ts','.tsx','.js','.jsx','.css','.scss','.html','.mjs','.md','.mdx'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const p = path.join(dir, file);
    const stat = fs.statSync(p);
    if (stat && stat.isDirectory()) {
      if (['node_modules','.next','.git'].includes(file)) return;
      results = results.concat(walk(p));
    } else {
      results.push(p);
    }
  });
  return results;
}

function isImage(file) {
  return exts.includes(path.extname(file).toLowerCase());
}

function isCode(file) {
  return codeExts.includes(path.extname(file).toLowerCase());
}

const allFiles = walk(root);
const imageFiles = allFiles.filter(isImage);
const codeFiles = allFiles.filter(isCode);

function normalize(p) {
  return p.split(path.sep).join('/');
}

const referenced = new Set();

console.log(`Scanning ${imageFiles.length} images against ${codeFiles.length} code files...`);

for (const img of imageFiles) {
  const imgNorm = normalize(path.relative(root, img)); // e.g., src/assets/...
  const base = path.basename(img);
  const altPath1 = imgNorm; // exact relative path
  const altPath2 = imgNorm.replace(/^(src\/)*/, '');
  const altPath3 = '/' + imgNorm.replace(/^public\//, '');
  const altPath4 = '@/'+imgNorm.replace(/^src\//, '');

  let found = false;
  for (const cf of codeFiles) {
    const txt = fs.readFileSync(cf, 'utf8');
    if (txt.indexOf(base) !== -1 || txt.indexOf(altPath1) !== -1 || txt.indexOf(altPath2) !== -1 || txt.indexOf(altPath3) !== -1 || txt.indexOf(altPath4) !== -1) {
      found = true;
      break;
    }
  }
  if (found) referenced.add(imgNorm);
}

const unused = imageFiles.map(i=>normalize(path.relative(root,i))).filter(p=>!referenced.has(p));

const out = unused.join('\n');
fs.writeFileSync(path.join(root,'unused-images.txt'), out, 'utf8');

console.log(`Found ${unused.length} unused images. Report saved to unused-images.txt`);
if (unused.length>0) console.log(unused.join('\n'));
else console.log('No unused images found.');
