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
Glaemscribe.UpDownTehtaSplitPreProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PreProcessorOperator.call(this, mode, glaeml_element); //super
  return this;
} 
Glaemscribe.UpDownTehtaSplitPreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.finalize = function(trans_options) {
  Glaemscribe.PreProcessorOperator.prototype.finalize.call(this, trans_options); // super
   
  var op    = this;
  var args  = op.finalized_glaeml_element.args; 
  
  var vowel_list      = args[0];
  var consonant_list  = args[1];
      
  vowel_list          = vowel_list.split(/,/).map(function(s) {return s.trim(); });
  consonant_list      = consonant_list.split(/,/).map(function(s) {return s.trim(); });
     
  this.vowel_map          = {}; // Recognize vowel tokens
  this.consonant_map      = {};// Recognize consonant tokens
  this.splitter_tree      = new Glaemscribe.TranscriptionTreeNode(null,null,""); // Recognize tokens
  this.word_split_map     = {};
  // The word split map will help to recognize words
  // The splitter tree will help to split words into tokens
  
  for(var vi=0;vi<vowel_list.length;vi++)
  {
    var v = vowel_list[vi];
    this.splitter_tree.add_subpath(v, v); 
    this.vowel_map[v] = v;
  }
  for(var ci=0;ci<consonant_list.length;ci++)
  {
    var c = consonant_list[ci];
    this.splitter_tree.add_subpath(c, c); 
    this.consonant_map[c] = c;
  }

  var all_letters = uniqueArray(vowel_list.concat(consonant_list).join("").split("").sort());

  for(var li=0;li<all_letters.length;li++)
  {
    var l = all_letters[li];
    this.word_split_map[l] = l;
  }    
   
}

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.type_of_token = function(token)
{
  if(this.vowel_map[token] != null)          return "V";
  if(this.consonant_map[token] != null)      return "C";
  return "X";
}

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.apply_to_word = function(w)
{
  var res = [];
   
  if(w.trim() == "")
    res.push(w);
  else
  {
    while(w.length != 0)
    {
      var ret = this.splitter_tree.transcribe(w)
      var r   = ret[0];
      var len = ret[1];   
      
      if (Array.isArray(r) && arrayEquals(r, [Glaemscribe.UNKNOWN_CHAR_OUTPUT])) {
        res.push(w[0]); 
      } else {
        res.push(r); 
      }
    
      w = w.substring(len);
    }
  }
    
    
  var res_modified = [];

  // We replace the pattern CVC by CvVC where v is a phantom vowel.
  // This makes the pattern CVC not possible.
  var i = 0
  while(i < res.length - 2)
  {
    var r0 = res[i];
    var r1 = res[i+1];
    var r2 = res[i+2];;
    var t0 = this.type_of_token(r0);
    var t1 = this.type_of_token(r1);
    var t2 = this.type_of_token(r2);
   
    if(t0 == "C" && t1 == "V" && t2 == "C")
    {
      res_modified.push(res[i]);
      res_modified.push("@");
      res_modified.push(res[i+1]); 
      i += 2;
    }
    else
    {   
      res_modified.push(res[i]);
      i += 1;
    }
  }

  // Add the remaining stuff
  while(i < res.length)
  {
    res_modified.push(res[i]);
    i += 1
  }
    
  return res_modified.join("")       
}

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.apply = function(content)
{
  var accumulated_word = ""  
  var ret = ""
        
  var letters = content.split("");
  for(var li=0;li<letters.length;li++)
  {
    var letter = letters[li];
    if(this.word_split_map[letter] != null)
      accumulated_word += letter;
    else
    {
      ret += this.apply_to_word(accumulated_word);
      ret += letter;
      accumulated_word = "";
    }        
  }
  ret += this.apply_to_word(accumulated_word) 
  
  return ret;         
}  

Glaemscribe.resource_manager.register_pre_processor_class("up_down_tehta_split", Glaemscribe.UpDownTehtaSplitPreProcessorOperator);    

