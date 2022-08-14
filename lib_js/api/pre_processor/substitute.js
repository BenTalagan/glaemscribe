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

// Inherit from PrePostProcessorOperator
Glaemscribe.SubstitutePreProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PreProcessorOperator.call(this, mode, glaeml_element); //super
  return this;
} 
Glaemscribe.SubstitutePreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.SubstitutePreProcessorOperator.prototype.apply = function(str)
{
  //This is bad to use a regexp if there are special chars like '*'
  //var what  = new RegExp(this.finalized_glaeml_element.args[0],"g");
  //var to    = this.finalized_glaeml_element.args[1];
  //return str.replace(what,to);

  var inSource      = str;
  var inToReplace   = this.finalized_glaeml_element.args[0];
  var inReplaceWith = this.finalized_glaeml_element.args[1];
  
  var outString = [];
  var repLen = inToReplace.length;
  var idx = inSource.indexOf(inToReplace);
  while (idx !== -1) {
    outString.push(inSource.substring(0, idx))
    outString.push(inReplaceWith);

    inSource = inSource.substring(idx + repLen);
    idx = inSource.indexOf(inToReplace);
  }
  outString.push(inSource);
  return outString.join("");
}  

Glaemscribe.resource_manager.register_pre_processor_class("substitute", Glaemscribe.SubstitutePreProcessorOperator);    
