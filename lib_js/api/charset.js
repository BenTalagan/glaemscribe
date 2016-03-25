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

Glaemscribe.Char = function()
{
  return this;
}

Glaemscribe.Charset = function(charset_name) {
  
  this.name         = charset_name;
  this.chars        = [];
  this.errors       = [];
  return this;
}

Glaemscribe.Charset.prototype.add_char = function(line, code, names)
{
  if(names == undefined || names.length == 0 || names.indexOf("?") != -1) // Ignore characters with '?'
    return;
  
  var c = new Glaemscribe.Char();    
  c.line  = line;
  c.code  = code;
  c.names = names;    
  c.str   = String.fromCodePoint(code);
  this.chars.push(c);
}

Glaemscribe.Charset.prototype.finalize = function()
{
  this.errors = [];
  
  this.lookup_table = {};
  
  this.chars = this.chars.sort(function(c1,c2) {
    return (c1.code - c2.code);
  });
  
  for(var i=0;i<this.chars.length;i++)
  {
    var c = this.chars[i];  
    for(var j=0;j<c.names.length;j++)
    {
      var cname = c.names[j];
      var found = this.lookup_table[cname];
      if(found != null)
        this.errors.push(new Glaemscribe.Glaeml.Error(c.line, "Character " + cname + " found twice."));
      else
        this.lookup_table[cname] = c;
    }
  }
}

Glaemscribe.Charset.prototype.n2c = function(cname)
{
  return this.lookup_table[cname];
}
