# markdown2dash

[![npm version](https://badge.fury.io/js/markdown2dash.svg)](https://badge.fury.io/js/markdown2dash)

Convert markdown files to Dash docset in CLI.

## INSTALL

```bash
$ npm install -g markdown2dash
```

## USAGE

```bash
$ md2dash -i {markdownDirectory} -o {docsetDirectory}
```

- `markdownDirectory`: default value is **./markdown**
- `docsetDirectory`: default value is **./docset**

Just type `md2dash` without args If you've put `.md` files in `markdown` directory.

The subdirectories of `markdownDirectory` must name after [Types](https://kapeli.com/docsets#supportedentrytypes) and the directory structure should be organized like this:

	- {markdownDirectory}
		- Functions
			- {xxx}.md
			- {xxx}.md
		- Statements
			- {xxx}.md
			- {xxx}.md
		- Types
			- {xxx}.md
			- {xxx}.md

# Flavor

Use `github` flavor, include [github-markdown-css](https://github.com/sindresorhus/github-markdown-css/blob/gh-pages/github-markdown.css) and [highlight.js](https://github.com/isagalaev/highlight.js/blob/master/src/styles/github.css).

Thanks to the authors above created beautiful styles.

![screenshot](./screenshoot.png)

# Demo

[GLSL Docset](https://github.com/eyworldwide/glsl-docset)
