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

Glaemscribe.Sheaf = function(sheaf_chain, expression) {
  
  var sheaf = this;
  
  sheaf.sheaf_chain    = sheaf_chain;
  sheaf.mode           = sheaf_chain.mode;
  sheaf.rule           = sheaf_chain.rule;
  sheaf.expression     = expression;
  
  // The ruby function has -1 to tell split not to remove empty stirngs at the end
  // Javascript does not need this
  sheaf.fragment_exps  = expression.split(Glaemscribe.Sheaf.SHEAF_SEPARATOR).map(function(elt) {return elt.trim();});

  if(sheaf.fragment_exps.length == 0)
    sheaf.fragment_exps  = [""]; 
           
  sheaf.fragments = sheaf.fragment_exps.map(function(fragment_exp) { 
    return new Glaemscribe.Fragment(sheaf, fragment_exp)
  });
}
Glaemscribe.Sheaf.SHEAF_SEPARATOR = "*"

Glaemscribe.Sheaf.prototype.is_src = function() { return this.sheaf_chain.is_src; };
Glaemscribe.Sheaf.prototype.is_dst = function() { return !this.sheaf_chain.is_src };
Glaemscribe.Sheaf.prototype.mode   = function() { return this.sheaf_chain.mode(); };
