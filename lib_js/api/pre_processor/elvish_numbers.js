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

Glaemscribe.ElvishNumbersPreProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PreProcessorOperator.call(this, mode, glaeml_element);
  return this;
}
Glaemscribe.ElvishNumbersPreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  
Glaemscribe.ElvishNumbersPreProcessorOperator.prototype.apply = function(str)
{
  var op      = this;
  
  var base    = op.finalized_glaeml_element.args[0];
  base        = (base != null)?(parseInt(base)):(12);
  
  var reverse = op.finalized_glaeml_element.args[1]
  reverse     = (reverse != null)?(reverse == true || reverse == "true"):(true) 
  
  return str.replace(/\d+/g,function(match) {
    var inbase  = parseInt(match).toString(base);
    inbase      = inbase.toUpperCase(); // Beware, we want letters in upper case!
    
    var ret = '';
    if(reverse)
    {
      for(var i=inbase.length-1;i>=0;i--)
        ret += inbase[i];
    }
    else
    {
      ret = inbase;
    }
    
    return ret;
  });

}  

Glaemscribe.resource_manager.register_pre_processor_class("elvish_numbers", Glaemscribe.ElvishNumbersPreProcessorOperator);    
