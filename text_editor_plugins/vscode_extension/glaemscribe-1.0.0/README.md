# README

This provides Glaemscribe GlaeML and Charset syntax highlighting for Visual Studio Code

This README offers basic How-To instructions (which are just the general rules for how to use a Visual Studio Code extension), for convenience.

## Testing

* Open the `vscode_extension` folder within Visual Studio Code (not as a subfolder of the whole project).
* Press F5. This will open a new Visual Studio Code window with the extension enabled to test in...

## Building and Installation

To build (following https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce),
you need a version of nodejs installed and accessible. Then, from this `vscode_extension` folder:

* `npm install -g vsce` 
* `vsce package`

This should produce a file `glaemscribe-1.0.0.vsix`.

To install this, from Visual Studio Code, run _Extensions: Install from VSIX..._ and select the file.

You should now have syntax highlighting etc for `.glaem` and `.cst` files.
