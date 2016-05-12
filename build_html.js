// !/bin/node

var editor = process.argv[2]

if (!editor) {
  throw new Error('Editor argument is mandatory')
}

var fs = require('fs')
var path = require('path')

var styles = String(fs.readFileSync(path.join(editor, 'styles.css')))
var indexHTML = String(fs.readFileSync(path.join(editor, 'src/index.html')))
var previewHTML = String(fs.readFileSync(path.join(editor, 'src/preview.html')))

var compiledIndex = indexHTML.replace('{{STYLES}}', styles)
var compiledPreview = previewHTML.replace('{{TEMPLATE}}', compiledIndex.replace(/\n/g, '\\n').replace(/"/g, '\\"').replace(/<\/script>/g, '<" + "/script>'))

fs.writeFileSync(path.join(editor, 'index.html'), compiledIndex)
fs.writeFileSync(path.join(editor, 'preview.html'), compiledPreview)
