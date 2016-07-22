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

Glaemscribe.TranscriptionTreeNode = function(character,replacement,path) {
  var tree_node         = this;
  tree_node.character   = character;
  tree_node.replacement = replacement;
  tree_node.path        = path;
  tree_node.siblings    = {}
}

Glaemscribe.TranscriptionTreeNode.prototype.is_effective = function() {
  return this.replacement != null;
}

Glaemscribe.TranscriptionTreeNode.prototype.add_subpath = function(source, rep, path) {
  if(source == null || source == "")
    return;
  
  var tree_node     = this;
  var cc            = source[0];
  var sibling       = tree_node.siblings[cc];
  var path_to_here  = (path || "") + cc;
  
  if(sibling == null)
    sibling = new Glaemscribe.TranscriptionTreeNode(cc,null,path_to_here);
    
  tree_node.siblings[cc] = sibling;
  
  if(source.length == 1)
    sibling.replacement = rep;
  else
    sibling.add_subpath(source.substring(1),rep,path_to_here);
}

Glaemscribe.TranscriptionTreeNode.prototype.transcribe = function(string, chain) {
  
  if(chain == null)
    chain = [];
  
  chain.push(this);

  if(string != "")
  {
    var cc = string[0];
    var sibling = this.siblings[cc];
    
    if(sibling)
      return sibling.transcribe(string.substring(1), chain);
  }
  
  // We are at the end of the chain
  while(chain.length > 1) {
    var last_node = chain.pop();
    if(last_node.is_effective())
      return [last_node.replacement, chain.length] 
  }
  
  // Only the root node is in the chain, we could not find anything; return the "unknown char"
  return [["*UNKNOWN"], 1]; 
}
