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
Glaemscribe.RxSubstitutePreProcessorOperator = function(raw_args)  
{
  Glaemscribe.PreProcessorOperator.call(this, raw_args); //super
  // Ruby uses \1, \2, etc for captured expressions. Convert to javascript. 
  this.raw_args[1] = this.raw_args[1].replace(/(\\\d)/g,function(cap) { return "$" + cap.replace("\\","")});
  return this;
} 
Glaemscribe.RxSubstitutePreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.RxSubstitutePreProcessorOperator.prototype.apply = function(str)
{
  var what  = new RegExp(this.args[0],"g");
  var to    = this.args[1];

  return str.replace(what,to);
}  

Glaemscribe.resource_manager.register_pre_processor_class("rxsubstitute", Glaemscribe.RxSubstitutePreProcessorOperator);    
