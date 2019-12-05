#!/usr/bin/env node

// ======================
// === ENV LOADING ======
// ======================

Fs       = require("fs")
Vm       = require("vm")
Glob     = require("Glob") // npm install glob
Path     = require("path")
Util     = require("util")
print    = console.log;

// Use the following trick to load the javascript that we would use normally in a web browser
function include(path) { var code = Fs.readFileSync(path, 'utf-8'); Vm.runInThisContext(code, path); }

global.require    = require;
global.__dirname  = __dirname;

// Load separately the espeakng library
include(__dirname + "/../espeakng.for.glaemscribe.nowasm.sync.js")
include(__dirname + "/../glaemscribe_tts.js")

client = new Glaemscribe.TTS();

client.synthesize_wav("fold. '",{voice:'en-tengwar'},function(wav) {
  console.log(wav)
});

client.synthesize_ipa("This has been folded. And it's cool .",{voice:'en-tengwar'},function(ipa) {
  console.log(ipa)
});

client.synthesize_ipa("Hi.",{voice:'en-tengwar'},function(ipa) {
  console.log(ipa)
});

client.synthesize_ipa("Hi?",{voice:'en-tengwar'},function(ipa) {
  console.log(ipa)
});

var hi = "Hi, my name is toto! ";
var r = ""
for(var i=0;i<1000;i++)
  r = r + hi;

client.synthesize_ipa(r,{voice:'en-tengwar'},function(ipa) {
  console.log(ipa)
});