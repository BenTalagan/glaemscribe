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

Glaemscribe.Option = function(mode, name, default_value_name, values, visibility)
{
  this.mode               = mode;
  this.name               = name;
  this.default_value_name = default_value_name;
  this.type               = (Object.keys(values).length == 0)?(Glaemscribe.Option.Type.BOOL):(Glaemscribe.Option.Type.ENUM);
  this.values             = values;
  this.visibility         = visibility;
  
  return this;
}
Glaemscribe.Option.Type = {};
Glaemscribe.Option.Type.BOOL = "BOOL";
Glaemscribe.Option.Type.ENUM = "ENUM";


Glaemscribe.Option.prototype.default_value = function()
{
  if(this.type == Glaemscribe.Option.Type.BOOL)
    return (this.default_value_name == 'true')
  else
    return this.values[this.default_value_name];
}

Glaemscribe.Option.prototype.value_for_value_name = function(val_name)
{
  if(this.type == Glaemscribe.Option.Type.BOOL)
  {
    if(val_name == 'true' || val_name == true)
      return true;
    
    if(val_name == 'false' || val_name == false)
      return false;
    
    return null;
  }
  else
  {
    return this.values[val_name];
  }
}

Glaemscribe.Option.prototype.is_visible = function() {
  var if_eval = new Glaemscribe.Eval.Parser;
        
  var res = false;
  
  try
  {
    res = if_eval.parse(this.visibility || "true", this.mode.latest_option_values || {});
    return (res == true);
  }
  catch(err)
  {
    console.log(err);
    return null;
  }                
}
