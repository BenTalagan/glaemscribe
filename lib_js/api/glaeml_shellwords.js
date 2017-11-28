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

Glaemscribe.Glaeml.Shellwords = function() {
  return this;
}

Glaemscribe.Glaeml.ShellwordsEscapeMode = {};
Glaemscribe.Glaeml.ShellwordsEscapeMode.Unicode = 1;

Glaemscribe.Glaeml.Shellwords.prototype.reset_state = function() {
  var sw = this;
  
  sw.is_escaping                = false;
  sw.is_eating_arg              = false;
  sw.is_eating_arg_between_quotes  = false;
  sw.args = [];
  sw.current_arg = "";
  sw.escape_mode            = null;
  sw.unicode_escape_counter = 0;
  sw.unicode_escape_str     = '';
}
  
Glaemscribe.Glaeml.Shellwords.prototype.advance_inside_arg = function(l,i) {
  var sw = this;
  
  if(l[i] == "\\") {
    sw.is_escaping      = true;
    sw.escape_mode      = null;
  }
  else {
    sw.current_arg += l[i];
  }
}

Glaemscribe.Glaeml.Shellwords.prototype.advance_inside_escape = function(l,i) {

  var sw = this;

  if(sw.escape_mode == null) {
    // We don't now yet what to do.
    switch(l[i])
    {
    case 'n':
      {
        sw.current_arg += "\n";
        sw.is_escaping = false;
        break;
      }
    case "\\":
      {
        sw.current_arg +=  "\\";
        sw.is_escaping = false;
        break;
      }
    case "t":
      {
        sw.current_arg +=  "\t";
        sw.is_escaping = false;
        break;      
      }
    case "\"":
      {
        sw.current_arg +=  "\"";
        sw.is_escaping = false;
        break;      
      }
    case "u":
      {
        sw.escape_mode = Glaemscribe.Glaeml.ShellwordsEscapeMode.Unicode;
        sw.unicode_escape_counter = 0;
        sw.unicode_escape_str     = '';
        break;
      }
    default:
      {
        throw new Error("Unknown escapment : \\" + l[i]);
      }
    }
  }
  else
  {
    switch(sw.escape_mode)
    {
    case Glaemscribe.Glaeml.ShellwordsEscapeMode.Unicode:
      {
        var c = l[i].toLowerCase();
          
        if(!(c.match(/[0-9a-f]/))) {
          throw new Error("Wrong format for unicode escaping, should be \\u with 4 hex digits");
        }
          
        sw.unicode_escape_counter += 1
        sw.unicode_escape_str     += c
        if(sw.unicode_escape_counter == 4) {
          sw.is_escaping = false
          sw.current_arg += String.fromCodePoint(parseInt(sw.unicode_escape_str, 16));
        }
        break;
      }
    default:
      {
        throw new Error("Unimplemented escape mode")
      }
    }
  }
}

Glaemscribe.Glaeml.Shellwords.prototype.parse = function(l) {
  var sw = this;
  
  sw.reset_state();
  
  for(var i=0;i<l.length;i++) {
    
    if(!sw.is_eating_arg) {
      
      if(l[i].match(/\s/))
        continue;
      
      if(l[i] == "'")
        throw new Error("Glaeml strictly uses double quotes, not simple quotes for args") 
      
      sw.is_eating_arg                = true;
      sw.is_eating_arg_between_quotes = (l[i] == "\"");
      
      if(!sw.is_eating_arg_between_quotes)
        sw.current_arg += l[i];
    }
    else {
      
      // Eating arg
      if(sw.is_escaping) {
        sw.advance_inside_escape(l,i);
      }
      else {
        if(!sw.is_eating_arg_between_quotes) {
          
          if(l[i].match(/[\s"]/)) {
            
            sw.args.push(sw.current_arg);
            sw.current_arg    = "";
            sw.is_eating_arg  = (l[i] == "\""); // Starting a new arg directly
            sw.is_eating_arg_between_quotes = sw.is_eating_arg;
            continue;
            
          }
          else {
            sw.advance_inside_arg(l,i)
          }
        }
        else {
          
          if(l[i] == "\"") {
            sw.args.push(sw.current_arg);
            sw.current_arg    = "";
            sw.is_eating_arg  = false;
          }
          else {
            sw.advance_inside_arg(l,i);
          }
        }
      }
    }
  }

  if(sw.is_eating_arg && sw.is_eating_arg_between_quotes) {
    throw new Error("Unmatched quote.");
  }

  if(sw.current_arg.trim() != '') {
    sw.args.push(sw.current_arg)
  }

  return sw.args;
}           
           
           