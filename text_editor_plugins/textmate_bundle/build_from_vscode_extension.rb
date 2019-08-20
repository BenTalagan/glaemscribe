#!/usr/bin/env ruby

Dir.chdir(File.dirname(__FILE__))

%x(plutil -convert xml1 ../vscode_extension/glaemscribe-1.0.0/syntaxes/cst.tmlanguage.json -o ./GlaeML.tmbundle/Syntaxes/cst.tmLanguage)
%x(plutil -convert xml1 ../vscode_extension/glaemscribe-1.0.0/syntaxes/glaem.tmlanguage.json -o ./GlaeML.tmbundle/Syntaxes/glaem.tmLanguage)
%x(plutil -convert xml1 ../vscode_extension/glaemscribe-1.0.0/syntaxes/glaeml.tmlanguage.json -o ./GlaeML.tmbundle/Syntaxes/glaeml.tmLanguage)
