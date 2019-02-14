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

Glaemscribe.ResourceManager = function() {  
  this.raw_modes                    = {}; // name is misleading it clashes with raw mode. TODO : refactor? Maybe not it could break the js loading
  this.raw_charsets                 = {};
  this.loaded_modes                     = {};
  this.loaded_charsets                  = {};
  this.pre_processor_operator_classes   = {};
  this.post_processor_operator_classes  = {};
  return this;
}

Glaemscribe.ResourceManager.prototype.load_charsets = function(charset_list) {
  
  // Load all charsets if null is passed
  if(charset_list == null)
     charset_list = Object.keys(this.raw_charsets);
  
  // If passed a name, wrap into an array
  if(typeof charset_list === 'string' || charset_list instanceof String)
    charset_list = [charset_list];
     
  for(var i=0;i<charset_list.length;i++)
  {
    var charset_name = charset_list[i];
    
    // Don't load a charset twice
    if(this.loaded_charsets[charset_name])
      continue;
       
    // Cannot load a charset that does not exist
    if(!this.raw_charsets[charset_name])
      continue;
       
    var cp      = new Glaemscribe.CharsetParser();
    var charset = cp.parse(charset_name);
    
    if(charset)
      this.loaded_charsets[charset_name] = charset;
  }
}

Glaemscribe.ResourceManager.prototype.load_modes = function(mode_list) {
 
  // Load all modes if null is passed
  if(mode_list == null)
     mode_list = Object.keys(this.raw_modes);
  
  // If passed a name, wrap into an array
  if(typeof mode_list === 'string' || mode_list instanceof String)
    mode_list = [mode_list];
    
  for(var i=0;i<mode_list.length;i++)
  {
    var mode_name = mode_list[i];
    
    // Don't load a charset twice
    if(this.loaded_modes[mode_name])
      continue;
       
    // Cannot load a charset that does not exist
    if(!this.raw_modes[mode_name])
      continue;
       
    var mp      = new Glaemscribe.ModeParser();
    var mode    = mp.parse(mode_name);
    
    if(mode)
      this.loaded_modes[mode_name] = mode;
  }
}

Glaemscribe.ResourceManager.prototype.register_pre_processor_class = function(operator_name, operator_class)
{
  this.pre_processor_operator_classes[operator_name] = operator_class;  
}

Glaemscribe.ResourceManager.prototype.register_post_processor_class = function(operator_name, operator_class)
{
  this.post_processor_operator_classes[operator_name] = operator_class;
}

Glaemscribe.ResourceManager.prototype.class_for_pre_processor_operator_name = function(operator_name)
{
  return this.pre_processor_operator_classes[operator_name]; 
}

Glaemscribe.ResourceManager.prototype.class_for_post_processor_operator_name = function(operator_name)
{
  return this.post_processor_operator_classes[operator_name]  
}

Glaemscribe.resource_manager = new Glaemscribe.ResourceManager();

