/*

Glǽmscribe (also written Glaemscribe) is a software dedicated to
the transcription of texts between writing systems, and more 
specifically dedicated to the transcription of J.R.R. Tolkien's 
invented languages to some of his devised writing systems.

Copyright (C) 2015 Benjamin Babut (Talagan).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

Glaemscribe.ModeDebugContext = function()
{
  this.preprocessor_output  = "";
  this.processor_pathes     = [];
  this.processor_output     = [];
  this.postprocessor_output = "";
  
  return this;
}


Glaemscribe.Mode = function(mode_name) {
  this.name                 = mode_name;
  this.supported_charsets   = {};
  this.options              = {};
  this.errors               = [];
  this.warnings             = [];
  this.latest_option_values = {};

  this.pre_processor    = new Glaemscribe.TranscriptionPreProcessor(this);
  this.processor        = new Glaemscribe.TranscriptionProcessor(this);
  this.post_processor   = new Glaemscribe.TranscriptionPostProcessor(this);
  return this;
}

Glaemscribe.Mode.prototype.finalize = function(options) {
  
  var mode = this;
  
  if(options == null)
    options = {};
  
  // Hash: option_name => value_name
  var trans_options = {};
  
  // Build default options
  mode.options.glaem_each(function(oname, o) {
    trans_options[oname] = o.default_value_name;
  });
  
  // Push user options
  options.glaem_each(function(oname, valname) {
    // Check if option exists
    var opt = mode.options[oname];
    if(!opt)
      return true; // continue
    var val = opt.value_for_value_name(valname)
    if(val == null)
      return true; // value name is not valid
    
    trans_options[oname] = valname;
  });
    
  var trans_options_converted = {};
 
  // Do a conversion to values space
  trans_options.glaem_each(function(oname,valname) {
    trans_options_converted[oname] = mode.options[oname].value_for_value_name(valname);
  });

  // Add the option defined constants to the whole list for evaluation purposes
  mode.options.glaem_each(function(oname, o) {
    // For enums, add the values as constants for the evaluator
    if(o.type == Glaemscribe.Option.Type.ENUM )
    {
      o.values.glaem_each(function(name,val) {
        trans_options_converted[name] = val
      });
    }
  });   
  
  this.latest_option_values = trans_options_converted;
    
  this.pre_processor.finalize(this.latest_option_values);
  this.post_processor.finalize(this.latest_option_values);
  this.processor.finalize(this.latest_option_values);
  
  return this;
}

Glaemscribe.Mode.prototype.transcribe = function(content, charset) {

  var debug_context = new Glaemscribe.ModeDebugContext();

  if(charset == null)
    charset = this.default_charset;
  
  if(charset == null)
    return [false, "*** No charset usable for transcription. Failed!"];

  var ret   = ""
  var lines = content.split("\n")
  
  for(var i=0;i<lines.length;i++)
  {
    // Do a bit of cleaning on the lines
    var l = lines[i].trim();
    
    l = this.pre_processor.apply(l);
    debug_context.preprocessor_output += l + "\n";
    
    l = this.processor.apply(l, debug_context);
    debug_context.processor_output = debug_context.processor_output.concat(l);
    
    l = this.post_processor.apply(l, charset);
    debug_context.postprocessor_output += l + "\n";
    
    ret += l + "\n";
  }

  return [true, ret, debug_context];  
}

