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
    var char    = chars[c];
    var code    = parseInt(char.args[0],16);
    var names   = char.args.slice(1);
    charset.add_char(char.line, code, names)
  }  
  
  glaemEach(doc.root_node.gpath("seq"), function(_,seq_elemnt) {
    var names       = seq_elemnt.args;
    var child_node  = seq_elemnt.children[0];   
    var seq         = (child_node && child_node.is_text())?(child_node.args[0]):("")
    charset.add_sequence_char(seq_elemnt.line,names,seq);
  });
  
  glaemEach(doc.root_node.gpath("virtual"), function(_,virtual_element) {
    var names     = virtual_element.args;
    var classes   = [];
    var reversed  = false;
    var deflt     = null;
    glaemEach(virtual_element.gpath("class"), function(_,class_element) {
      var vc        = new Glaemscribe.VirtualChar.VirtualClass();
      vc.target     = class_element.args[0];
      vc.triggers   = class_element.args.slice(1);   

      // Allow triggers to be defined inside the body of the class element
      var child_node      = class_element.children[0]; 
      var inner_triggers  = (child_node && child_node.is_text())?(child_node.args[0]):("");
      inner_triggers      = inner_triggers.split(/\s/).filter(function(e) { return e !== '' });
      vc.triggers         = vc.triggers.concat(inner_triggers);

      classes.push(vc);
    });
    glaemEach(virtual_element.gpath("reversed"), function(_,reversed_element) {
      reversed = true;
    });
    glaemEach(virtual_element.gpath("default"), function(_,default_element) {
      deflt = default_element.args[0];
    });
    charset.add_virtual_char(virtual_element.line,classes,names,reversed,deflt);
  });
  
  charset.finalize(); 
  return charset;  
}

Glaemscribe.CharsetParser.prototype.parse = function(charset_name) {
  
  var raw     = Glaemscribe.resource_manager.raw_charsets[charset_name];
  
  return this.parse_raw(charset_name, raw);
}
