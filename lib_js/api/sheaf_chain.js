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

Glaemscribe.SheafChain = function(rule, expression, is_src)
{
  var sheaf_chain = this;
  
  sheaf_chain.rule       = rule;
  sheaf_chain.mode       = rule.mode;
  sheaf_chain.is_src     = is_src;
  sheaf_chain.expression = expression;
   
  sheaf_chain.sheaf_exps = stringListToCleanArray(expression,Glaemscribe.SheafChain.SHEAF_REGEXP_OUT)

  sheaf_chain.sheaf_exps = sheaf_chain.sheaf_exps.map(function(sheaf_exp) { 
    var exp     =  Glaemscribe.SheafChain.SHEAF_REGEXP_IN.exec(sheaf_exp);
    
    if(exp)
      sheaf_exp   = exp[1];
    
    return sheaf_exp.trim();
  });

  sheaf_chain.sheaves    = sheaf_chain.sheaf_exps.map(function(sheaf_exp) { return new Glaemscribe.Sheaf(sheaf_chain, sheaf_exp) });
  
  if(sheaf_chain.sheaves.length == 0)
    sheaf_chain.sheaves    = [new Glaemscribe.Sheaf(sheaf_chain,"")]
    
  return sheaf_chain;    
}

Glaemscribe.SheafChain.SHEAF_REGEXP_IN    = /\[(.*?)\]/;
Glaemscribe.SheafChain.SHEAF_REGEXP_OUT   = /(\[.*?\])/;

Glaemscribe.SheafChain.prototype.mode = function() { return this.rule.mode() };