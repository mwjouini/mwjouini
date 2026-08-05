const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve(__dirname, 'assets', 'cv_template.html');
const pdfPath = path.resolve(__dirname, 'CV_Mohamed_Wael_Jouini.pdf');

console.log('Generating PDF from:', htmlPath);
console.log('Output PDF to:', pdfPath);

// Remove existing PDF if present to ensure clean write
if (fs.existsSync(pdfPath)) {
  try {
    fs.unlinkSync(pdfPath);
  } catch (err) {
    console.error('Warning: could not delete existing PDF:', err.message);
  }
}

const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const res = spawnSync(edgePath, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--no-sandbox',
  `--print-to-pdf=${pdfPath}`,
  fileUrl
], { encoding: 'utf8' });

if (fs.existsSync(pdfPath)) {
  console.log('SUCCESS! PDF generated successfully. File size:', fs.statSync(pdfPath).size, 'bytes');
} else {
  console.log('First attempt output:', res.stdout, res.stderr);
  console.log('Trying with --headless=new...');
  spawnSync(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--no-sandbox',
    `--print-to-pdf=${pdfPath}`,
    fileUrl
  ], { encoding: 'utf8' });
  
  if (fs.existsSync(pdfPath)) {
    console.log('SUCCESS with --headless=new! File size:', fs.statSync(pdfPath).size, 'bytes');
  } else {
    console.error('ERROR: PDF generation failed.');
  }
}
