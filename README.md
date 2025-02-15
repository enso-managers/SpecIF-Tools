# SpecIF Tools 
Tools for your web-browser to transform partial system specifications. 

SpecIF is the 'Specification Integration Facility'. It's purpose is to combine partial specifications from different tools in a single model to allow
- to search, navigate and audit partial results in a common context
- to exchange model information between organizations and tools.

Please have a look at the [SpecIF Homepage](https://specif.de) for further information.

## Features
- Import MS-Excel 'XLSX', 'XLS', 'CSV', 'ODS' and 'FODS' file
- Export 'reqifz' file (Requirements Interchange Format)

## Compatibility
- Mozilla Firefox
- Google Chromium and Chrome
- Microsoft Edge
- Apple Safari
- Opera
- Microsoft Internet Explorer is _not any more_ supported

## Maturity
The software code is a reference implementation and has not been designed for high data volume and other production requirements. 
Any contribution to this collaborative effort is highly welcome!

## Demonstration
The tools have been installed for demonstration
- [Sheet → ReqIF](https://tools.enso-managers.de/sheet2reqif.html).

The installation provided for your convenience is neither intended to be highly available nor scalable.
You may use the [latest release](https://github.com/enso-managers/SpecIF-Tools/releases) of the software for 
your own installation, see below.

## Installation
For any purpose other than demonstration please install the latest [release](https://github.com/enso-managers/SpecIF-Tools/releases) 
on a web server of your choice. Just unpack the files and load 'yourPath/view' or 'yourPath/edit' with a web-browser.

## Running the App Locally
1. Make sure you have NodeJS and NPM installed.

2. Clone this repository.

3. Install all dependencies:
```bash
  npm install
```

4. Run the build script:
```bash
  npm run start
```

### On Windows

After creating the build directory with the executables, you may start the local web-server:
```
  http-server
```

- Not recommended: Temporarily deactivate ```Cross-Origin Restrictions``` and ```Local File Restrictions``` in your browser, if you encounter a blank screen.
Make sure to re-activate these settings, later.
- Better: Copy the content of the folder 'dist' to /inetpub/wwwroot/your-subfolder/ and navigate to 'localhost/your-subfolder/' using your web-browser. 

## Acknowledgements
This work has been sponsored by [enso-managers gmbh](http://enso-managers.de) and [adesso SE](http://adesso.de), both Berlin.

The SpecIF web-apps have been built with the open source components listed below. These are fine pieces of software 
and we gratefully thank the contributors for their effort.

<table class="table table-condensed">
<thead>
<tr>
	<th width="15%">Library</th><th>Author</th><th>Description</th><th>License</th>
</tr>
</thead>
<tbody>
<tr>
	<td>AJV</td>
	<td><a href="https://github.com/epoberezkin" target="_blank">Evgeny Poberezkin</a></td>
	<td>Another JSON Schema Validator ... <a href="https://github.com/epoberezkin/ajv" target="_blank">more</a></td>
	<td><a href="https://github.com/epoberezkin/ajv/blob/master/LICENSE" target="_blank">MIT</a></td>
</tr>
<!--<tr>
	<td>jqTree</td>
	<td><a href="https://github.com/mbraak" target="_blank">Marco Braak</a></td>
	<td>A tree with collapsible branches and drag\'n\'drop support 
		for rearranging chapters and paragraphs ... <a href="http://mbraak.github.io/jqTree/" target="_blank">more</a></td>
	<td><a href="https://github.com/mbraak/jqTree/blob/master/LICENSE" target="_blank">Apache 2.0</a></td>
</tr>
<tr>
	<td>markdown-it</td>
	<td><a href="https://github.com/Kirill89" target="_blank">Kirill</a>,&nbsp;<a href="https://github.com/puzrin" target="_blank">Vitaly Puzrin</a>,&nbsp;<a href="https://github.com/rlidwka" target="_blank">Alex Kocharin</a></td>
	<td>Markdown parser, done right. 100% CommonMark support, extensions, syntax plugins & high speed ... <a href="https://markdown-it.github.io/" target="_blank">more</a></td>
	<td><a href="https://github.com/jonschlinkert/remarkable/blob/master/LICENSE" target="_blank">MIT</a></td>
</tr>--> 
<tr>
	<td>JSZip</td>
	<td><a href="https://github.com/Stuk" target="_blank">Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso</a></td>
	<td>A library for creating, reading and editing .zip files ... <a href="https://github.com/Stuk/jszip" target="_blank">more</a></td>
	<td><a href="https://github.com/Stuk/jszip/blob/master/LICENSE.markdown" target="_blank">MIT</a></td>
</tr>
<tr>
	<td>FileSaver</td>
	<td><a href="http://eligrey.com/" target="_blank">Eli Grey</a></td>
	<td>Save files to the local file system ... <a href="https://github.com/eligrey/FileSaver.js/" target="_blank">more</a></td>
	<td><a href="https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md" target="_blank">MIT</a></td>
</tr>
<!-- <tr>
	<td>BPMN-Viewer</td>
	<td></td>
	<td>A BPMN 2.0 rendering toolkit and web modeler ... <a href="https://bpmn.io/toolkit/bpmn-js/" target="_blank">more</a></td>
	<td><a href="https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE" target="_blank">bpmn.io</a></td>
</tr>
<tr>
	<td>vis.js Network</td>
	<td></td>
	<td>Display networks consisting of nodes and edges ... 
		<a href="https://visjs.github.io/vis-network/docs/network/" target="_blank">more</a></td>
	<td><a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache 2.0</a> or 
		<a href="http://opensource.org/licenses/MIT" target="_blank">MIT</a></td>
</tr> -->
<tr>
	<td>js-xlsx</td>
	<td></td>
	<td>Excel parser and writer ... <a href="https://github.com/SheetJS/js-xlsx" target="_blank">more</a></td>
	<td><a href="https://github.com/SheetJS/js-xlsx/blob/master/LICENSE" target="_blank">Apache 2.0</a></td>
</tr>
<tr>
	<td>jQuery</td>
	<td></td>
	<td>jQuery makes things like HTML document traversal and manipulation, event handling, animation 
		and Ajax much simpler ... <a href="https://jquery.com/" target="_blank">more</a></td>
	<td><a href="https://jquery.org/license/" target="_blank">MIT</a></td>
</tr>
<tr>
	<td>Bootstrap Icons</td>
	<td></td>
	<td>Free, high quality, open source icon library with over 1,800 icons. 
		Use them with or without Bootstrap in any project ... <a href="https://icons.getbootstrap.com/" target="_blank">more</a></td>
	<td><a href="https://github.com/twbs/bootstrap/blob/master/LICENSE" target="_blank">MIT</a></td>
</tr>
<tr>
	<td>Bootstrap</td>
	<td></td>
	<td>Front-end component library for responsive, mobile-first projects on the web ... 
		<a href="http://getbootstrap.com/" target="_blank">more</a></td>
	<td><a href="https://github.com/twbs/bootstrap/blob/master/LICENSE" target="_blank">MIT</a></td>
</tr>
<!-- <tr>
	<td>diff-match-patch</td>
	<td></td>
	<td>A library for text comparison, matching and patching ... 
		<a href="https://code.google.com/p/google-diff-match-patch/" target="_blank">more</a></td>
	<td><a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache 2.0</a></td>
</tr> -->
</tbody>
</table>
