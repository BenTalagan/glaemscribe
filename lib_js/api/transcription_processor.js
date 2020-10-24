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

Glaemscribe.TranscriptionProcessor = function(mode)
{
  this.mode         = mode;
  this.rule_groups  = {};
  
  return this;
}

Glaemscribe.TranscriptionProcessor.prototype.finalize = function(options) {
  
  var processor = this;
  var mode = this.mode;
    
  processor.transcription_tree = new Glaemscribe.TranscriptionTreeNode(null,null,"");
  processor.transcription_tree.add_subpath(Glaemscribe.WORD_BOUNDARY_TREE,  [""]);
  processor.transcription_tree.add_subpath(Glaemscribe.WORD_BREAKER,        [""]);
  
  glaemEach(this.rule_groups, function(gname,rg) {
    rg.finalize(options);
  });
  
  // Build the input charsets
  processor.in_charset = {}
  
  glaemEach(this.rule_groups, function(gname, rg) {
    glaemEach(rg.in_charset, function(char, group) {
      
      var group_for_char  = processor.in_charset[char];
           
      if(group_for_char != null)
        mode.errors.push(new Glaemscribe.Glaeml.Error(0, "Group " + gname + " uses input character " + char + " which is also used by group " + group_for_char.name + ". Input charsets should not intersect between groups.")); 
      else
        processor.in_charset[char] = group;
      
    })
  });
  
  glaemEach(this.rule_groups, function(gname, rg) {
    for(var r=0;r<rg.rules.length;r++)
    {
      var rule = rg.rules[r];
      
      for(var sr=0;sr<rule.sub_rules.length;sr++)
      {  
        var sub_rule = rule.sub_rules[sr];
        processor.add_subrule(sub_rule);    
      }  
    }
  });

}

Glaemscribe.TranscriptionProcessor.prototype.add_subrule = function(sub_rule) {
  var path = sub_rule.src_combination.join("");
  this.transcription_tree.add_subpath(path, sub_rule.dst_combination)
}


Glaemscribe.TranscriptionProcessor.prototype.apply = function(l, debug_context) {
      
  var ret               = [];
  var current_group     = null;
  var accumulated_word  = "";
  
  var chars             = l.split("");
  for(var i=0;i<chars.length;i++)
  {
    var c = chars[i];
    switch(c)
    {
      case " ":
      case "\t":
        ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
        ret = ret.concat("*SPACE");
            
        accumulated_word = "";
        break;
      case "\r":
        // ignore
        break;
      case "\n":
        ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
        ret = ret.concat("*LF");
        
        accumulated_word = ""
        break;
      default:
        var c_group = this.in_charset[c];
        if(c_group == current_group)
          accumulated_word += c;
        else
        {
          ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
          current_group    = c_group;
          accumulated_word = c;
        }
        break;
    }
    
  }
  // End of stirng
  ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
  return ret;
}

Glaemscribe.TranscriptionProcessor.prototype.transcribe_word = function(word, debug_context) {
  
  var processor = this;
    
  var res = [];
  var word = Glaemscribe.WORD_BOUNDARY_TREE + word + Glaemscribe.WORD_BOUNDARY_TREE;

  while(word.length != 0)
  {    
    // Explore tree
    var ttret = this.transcription_tree.transcribe(word);   
      
    // r is the replacement, len its length
    var tokens    = ttret[0];
    var len       = ttret[1];   
    var eaten     = word.substring(0,len);
    
    word          = word.substring(len); // eat len characters
    res           = res.concat(tokens);
    
    debug_context.processor_pathes.push([eaten, tokens, tokens]);
  }
  
  return res;
}
      