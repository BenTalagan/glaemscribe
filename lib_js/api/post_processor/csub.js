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

Glaemscribe.CSubPostProcessorOperator = function(args)  
{
  Glaemscribe.PostProcessorOperator.call(this,args); //super
  return this;
} 
Glaemscribe.CSubPostProcessorOperator.inheritsFrom( Glaemscribe.PostProcessorOperator );  

Glaemscribe.CSubPostProcessorOperator.prototype.finalize = function(trans_options) {
  
  Glaemscribe.PostProcessorOperator.prototype.finalize.call(this,trans_options); //super
  
  // Build our operator
  var op         = this;
  
  op.matcher     = op.finalized_glaeml_element.args[0];
  op.triggers    = {};
  
  op.finalized_glaeml_element.children.glaem_each(function(idx, child) {
    var args      = child.args.slice(0);
    var replacer  = args.shift();
    
    for(var t=0;t<args.length;t++)
      op.triggers[args[t]] = replacer;
  });
    
  return this;
}

Glaemscribe.CSubPostProcessorOperator.prototype.apply = function(tokens)
{
  var op = this;
  
  var last_trigger_replacer = null;
  for(var t=0;t<tokens.length;t++)
  {
    var token = tokens[t];
    if(token == op.matcher && last_trigger_replacer != null)
    {
      tokens[t] = last_trigger_replacer
    }
    else if(op.triggers[token] != null)
    {
      last_trigger_replacer = op.triggers[token];
    }
  }
  
  return tokens;
}  

Glaemscribe.resource_manager.register_post_processor_class("csub", Glaemscribe.CSubPostProcessorOperator);    
