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

Glaemscribe.Rule = function(line, rule_group) {
  this.line       = line;
  this.rule_group = rule_group;
  this.mode       = rule_group.mode;
  this.sub_rules  = [];
  this.errors     = [];
}

Glaemscribe.Rule.prototype.finalize = function(cross_schema) {
  
  if(this.errors.length > 0)
  {
    for(var i=0; i<this.errors.length; i++)
    {
      var e = this.errors[i];
      this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, e));
    }
    return;    
  }

  var srccounter  = new Glaemscribe.SheafChainIterator(this.src_sheaf_chain)
  var dstcounter  = new Glaemscribe.SheafChainIterator(this.dst_sheaf_chain, cross_schema)
  
  if(srccounter.errors.length > 0)
  {
    for(var i=0; i<srccounter.errors.length; i++)
    {
      var e = srccounter.errors[i];
      this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, e));
    }
    return;
  }  
  if(dstcounter.errors.length > 0)
  {
    for(var i=0; i<dstcounter.errors.length; i++)
    {
      var e = dstcounter.errors[i];
      this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, e));
    }
    return;
  }  

  var srcp = srccounter.proto();
  var dstp = dstcounter.proto();
  
  if(srcp != dstp)
  {
    this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, "Source and destination are not compatible (" + srcp + " vs " + dstp + ")"));
    return;
  }
  
  do {
    
    // All equivalent combinations ...
    var src_combinations  = srccounter.combinations(); 
    // ... should be sent to one destination
    var dst_combination   = dstcounter.combinations()[0];
    
    for(var c=0;c<src_combinations.length;c++)
    {
      var src_combination = src_combinations[c];
      this.sub_rules.push(new Glaemscribe.SubRule(this, src_combination, dst_combination));
    }

    dstcounter.iterate()
  }
  while(srccounter.iterate())
}
