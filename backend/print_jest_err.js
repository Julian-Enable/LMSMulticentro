const fs = require('fs');
let str = fs.readFileSync('test_out.json', 'utf16le');
str = str.replace(/^\uFEFF/, '');
fs.writeFileSync('error_text.txt', JSON.parse(str).testResults[0].message);
