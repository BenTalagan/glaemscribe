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

Glaemscribe.CharsetParser = function()
{
  return this;
}

Glaemscribe.CharsetParser.prototype.parse_raw = function(charset_name, raw)
{
  var charset = new Glaemscribe.Charset(charset_name);
  var doc     = new Glaemscribe.Glaeml.Parser().parse(raw);

  if(doc.errors.length>0)
  {
    charset.errors = doc.errors;
    return charset;
  }
 
  var chars   = doc.root_node.gpath('char');

  for(var c=0;c<chars.length;c++)
  {
    var char = chars[c];
    code   = parseInt(char.args[0],16);
    names  = char.args.slice(1);
    charset.add_char(char.line, code, names)
  }  
  
  doc.root_node.gpath("virtual").glaem_each(function(_,virtual_element) { 
    var names = virtual_element.args;
    var classes = {};
    virtual_element.gpath("class").glaem_each(function(_,class_element) {
      var result    = class_element.args[0];
      var triggers  = class_element.args.slice(1);   
      classes[result] = triggers;
    });
    charset.add_virtual_char(virtual_element.line,classes,names);
  });
  
  charset.finalize(); 
  return charset;  
}

Glaemscribe.CharsetParser.prototype.parse = function(charset_name) {
  
  var raw     = Glaemscribe.resource_manager.raw_charsets[charset_name];
  
  return this.parse_raw(charset_name, raw);
}
