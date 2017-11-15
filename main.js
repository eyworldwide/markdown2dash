#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const commandLineArgs = require('command-line-args')
const showdown = require('showdown')
const DocSetGenerator = require('docset-generator').DocSetGenerator
const showdownHighlight = require('showdown-highlight')
const rimraf = require('rimraf')
const template = require('./index.html')

// define input and output path in CLI
const args = [
	 { name: 'input', alias: 'i', type: String, defaultValue: './markdown'},
	 { name: 'output', alias: 'o', type: String, defaultValue: './docset'},
]

let {input, output} = commandLineArgs(args)

// set showdown to `github flavor` because I love github :)
showdown.setFlavor('github')

let converter = new showdown.Converter({
	extensions: [showdownHighlight]
})

// temp HTML directory
const html = './.html'

const extReg = /([.]md)|([.]markdown)/

// ensure directories exist
if (!fs.existsSync(html)) {
	fs.mkdirSync(html)
}

if (!fs.existsSync(output)) {
	fs.mkdirSync(output)
}

let directories = fs.readdirSync(input)

// directories must be types: https://kapeli.com/docsets#supportedentrytypes
for (let j = 0, l = directories.length; j < l; j++) {
	let directory = directories[j]

	let markdowns = fs.readdirSync(path.join(input, directory))

	// 
	for (let i = 0, len = markdowns.length; i < len; i++) {
		let markdown = markdowns[i]

		let ext = path.extname(markdown)

		if( ext !== '.md' && ext !== '.markdown') {
			continue
		}

		let markdownPath = path.join(input, directory, markdown)

		// read markdown file
		fs.readFile(markdownPath, 'utf8', (err, data)=>{
			// convert to HTML
			let text = converter.makeHtml(data)

			let directoryPath = path.join(html, directory)
			let htmlPath = path.join(directoryPath, markdown.replace(extReg, '') + '.html')

			// ensure `write directories` exist
			if (!fs.existsSync(directoryPath)) {
				fs.mkdirSync(directoryPath)
			}

			// write to temp HTML file
			fs.writeFile(htmlPath, template.replace('{{text}}', text), (err) => {
				if (err) throw err

				console.log('-- Markdown To HTML:', htmlPath)

				if (j === l - 1 && i === len - 1) {
					setTimeout(html2Docset, 100)
				}
			})
		})
	}
}

// convert temp HTML to docset
function html2Docset(){
	let entries = []

	for (let j = 0, len = directories.length; j < len; j++) {
		let directory = directories[j]

		let markdowns = fs.readdirSync(path.join(input, directory))

		for (let i = 0, len = markdowns.length; i < len; i++) {
			let markdown = markdowns[i]
			let name = markdown.replace(extReg, '')

			let docPath = path.join(directory, name + '.html')

			console.log('-- -- HTML To Docset:', docPath)

			entries.push({
				name: name,
				type: directory,
				path: docPath
			})
		}
	}

	// create docset use `DocSetGenerator` which is much better than [dashing](https://github.com/technosophos/dashing). 
	// Long live javascript!
	var docSetGenerator = new DocSetGenerator({
		destination: output,
		name: 'GLSL',
		documentation: html,
		entries: entries
	})

	docSetGenerator.create()

	// finally, delete temp HTML
	rimraf(html, (err) => {
		console.log('-- -- -- Done!')
	})
}
