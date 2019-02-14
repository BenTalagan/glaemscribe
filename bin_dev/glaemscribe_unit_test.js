#!/usr/bin/env node

"use strict";

// ======================
// === ENV LOADING ======
// ======================

var Fs       = require("fs")
var Vm       = require("vm")
var Glob     = require("Glob") // npm install 
var Path     = require("path")
var Util     = require("util")

// Use the following trick to load the javascript that we would use normally in a web browser
function include(path) { var code = Fs.readFileSync(path, 'utf-8'); Vm.runInThisContext(code, path); }
include(__dirname + "/../build/web/glaemscribe/js/glaemscribe.js")

// Include all charsets and modes
var cfiles = Glob.sync(__dirname + "/../build/web/glaemscribe/js/charsets/*.cst.js", {});
for(var c=0;c<cfiles.length;c++)
  include(cfiles[c]);

var mfiles = Glob.sync(__dirname + "/../build/web/glaemscribe/js/modes/*.glaem.js", {});
for(var c=0;c<mfiles.length;c++)
  include(mfiles[c]);

// Load the tts engine
include(__dirname + "/../build/web/glaemscribe/js/espeakng.for.glaemscribe.nowasm.sync.js")

if(!Glaemscribe.TTS.is_engine_loaded())
{
  console.log("*** CRITICAL : The TTS Engine is not loaded!");
  exit(666);
}


// =======================
// === UNIT TEST TOOL ====
// =======================

function unit_test_directory(directory) {

  console.log("Testing now test base + directory");

  var udirs  = Glob.sync(directory + "/sources/*/", {});

  for(var d=0;d<udirs.length;d++)
  {
    var dirent    = udirs[d];
    var full_name = Path.basename(dirent);
    var mode_name = full_name.split(".")[0];
    
    var mode    = Glaemscribe.resource_manager.loaded_modes[mode_name];
    
    if(!mode)
    {
      console.log("[    ] " + full_name + " : this mode is not loaded.");
      continue;
    }
  
    if(mode.errors.length > 0)
    {
      console.log("[    ] " + full_name + " : his mode has some errors.");
      continue;
    }
    
    var mode_options = {};
    var charset_name = null;
    var opt_file = dirent.substring(0,dirent.length-1) + ".options";
    
    if(Fs.existsSync(opt_file)) {
      
      var ofl = Fs.readFileSync(opt_file,'utf-8').split("\n");
      var charset_name = (ofl[0] || "").trim();
      var opt_line     = (ofl[1] || "").trim();
  
      var a = opt_line.split(",").filter(function(a) { return a != ""}).map(function(o) { return o.split(":")} );
      a.glaem_each(function(_,opt_val_pair) {
        mode_options[opt_val_pair[0].trim()] = opt_val_pair[1].trim();
      });
    }
    
    mode.finalize(mode_options);
    var charset = mode.supported_charsets[charset_name];
    if(!charset)
      charset = mode.default_charset;
      
    var ufiles  = Glob.sync(directory + "/sources/" + full_name + "/*", {});
  
    for(var u = 0; u < ufiles.length; u++)
    {
      var path    = ufiles[u];
      var bfname  = Path.basename(path);
      var prefix  = full_name + " : " + bfname + " : ";
    
      var true_teng = "";
      var teng      = "";
      var source    = "";
    
      source    = Fs.readFileSync(directory + "/sources/" + full_name + "/" + bfname,'utf-8');
      true_teng = Fs.readFileSync(directory + "/expecteds/" + full_name + "/" + bfname,'utf-8');
    
      if(true_teng.trim() == "")
        console.log("[    ] " + prefix + "Expected file is empty!!");

      true_teng = true_teng.split("\n").map(function(l) { return l.trim(); }).join("\n").trim();
      source    = source.split("\n").map(function(l) { return l.trim(); }).join("\n").trim();
      var tinfo = mode.transcribe(source, charset);
    
      var success = tinfo[0]
      teng    = tinfo[1].trim();
    
      if(!success)
      {
        console.log("[****] " + tinfo[1]);
        continue;
      }
      
      teng    = teng.split("\n").map(function(l) { return l.trim(); }).join("\n").trim();
   
      if(true_teng != teng)
      {
      
        console.log("[****] " + prefix);
    
        var teng_lines      = teng.split("\n");
        var true_teng_lines = true_teng.split("\n");
        var source_lines    = source.split("\n");
    
        console.log("========== Diff ==========")
      
        for(var index=0;index<true_teng_lines.length;index++)
        {
          var true_line = true_teng_lines[index].trim();
        
          // Cannot go further
          if(index >= teng_lines.length)
            break;
        
          var diff_line = "";
          var teng_line = teng_lines[index].trim();
          var source_line = source_lines[index].trim();
        
          for(var i=0;i<true_line.length;i++)
          {
            if(i >= teng_line.length || teng_line[i] != true_line[i])
              diff_line += "o";
            else
              diff_line += ".";
          }
        
          if(true_line == teng_line)
            continue;
        
          console.log( "S: " + source_line);
          console.log( "G: " + true_line);
          console.log( "T: " + teng_line);
          console.log( "D: " + diff_line);       
        }
        console.log("==========================");
      } 
      else
        console.log("[ OK ] " + prefix + "Yay.");
    }   
  }
}

console.log("Launching unit tests on the whole sample knowledge base to test if all modes are still ok...");

Glaemscribe.resource_manager.load_modes();

// Print problems if modes have errors
for(var mode_name in Glaemscribe.resource_manager.loaded_modes)
{ 
  var mode    = Glaemscribe.resource_manager.loaded_modes[mode_name];

  if(mode.errors.length > 0)
  {
    for(var i=0;i<mode.errors.length;i++)
    {
      var e = mode.errors[i];
      console.log("** " + mode.name + ":" + e.line + ": " + e.text);
    }
    continue;
  }
}

var error_context = {ecount: 0, wcount: 0}
unit_test_directory(__dirname + "/../unit_tests/glaemscrafu",error_context)
unit_test_directory(__dirname + "/../unit_tests/technical",error_context)

// unit_test_directory(__dirname + "/../unit_tests/old")
// console.log(Glaemscribe.resource_manager.loaded_modes['quenya'].finalize({"implicit_a" : "false"}).options['implicit_a_unutixe'].is_visible())
