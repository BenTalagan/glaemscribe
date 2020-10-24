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


Glaemscribe.ResolveVirtualsPostProcessorOperator = function(args)  
{
  Glaemscribe.PostProcessorOperator.call(this,args); //super
  return this;
} 
Glaemscribe.ResolveVirtualsPostProcessorOperator.inheritsFrom( Glaemscribe.PostProcessorOperator );  


Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.finalize = function(trans_options)
{
  Glaemscribe.PostProcessorOperator.prototype.finalize.call(this, trans_options); // super
  this.last_triggers = {}; // Allocate here to optimize
}  

Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.reset_trigger_states = function(charset) {
  var op = this;
  glaemEach(charset.virtual_chars, function(idx,vc) {
    vc.object_reference                   = idx; // We cannot objects as references in hashes in js. Attribute a reference.
    op.last_triggers[vc.object_reference] = null; // Clear the state
  });
}

Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.apply_loop = function(charset, tokens, new_tokens, reversed, token, idx) {
  var op = this;
  if(token == '*SPACE' || token == '*LF') {
    op.reset_trigger_states(charset);
    return; // continue
  }
  var c = charset.n2c(token);

  if(c == null)
    return;
  
  if(c.is_virtual() && (reversed == c.reversed)) {
    
    // Try to replace
    var last_trigger = op.last_triggers[c.object_reference];
    if(last_trigger != null) {
      new_tokens[idx] = last_trigger.names[0]; // Take the first name of the non-virtual replacement.
      token = new_tokens[idx]; // Consider the token replaced, being itself a potential trigger for further virtuals (cascading virtuals)
    };
  }

  // Update states of virtual classes
  glaemEach(charset.virtual_chars, function(_,vc) {
    var rc = vc.n2c(token);
    if(rc != null)
      op.last_triggers[vc.object_reference] = rc;
  });
}


Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.apply_sequences = function(charset,tokens) {
  var ret = [];
  glaemEach(tokens, function(_, token) {
    var c = charset.n2c(token);
    if(c && c.is_sequence())
      Array.prototype.push.apply(ret,c.sequence);
    else
      ret.push(token);
  });
  return ret;
}

Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.apply = function(tokens, charset) {   
  var op = this;
  
  tokens = op.apply_sequences(charset, tokens);
  
  // Clone the array so that we can perform diacritics and ligatures without interfering
  var new_tokens = tokens.slice(0);
  
  op.reset_trigger_states(charset);
  glaemEach(tokens, function(idx,token) {
    op.apply_loop(charset,tokens,new_tokens,false,token,idx);
  });
  
  op.reset_trigger_states(charset);
  glaemEachReversed(tokens, function(idx,token) {
    op.apply_loop(charset,tokens,new_tokens,true,token,idx);    
  });
  return new_tokens;
}  

Glaemscribe.resource_manager.register_post_processor_class("resolve_virtuals", Glaemscribe.ResolveVirtualsPostProcessorOperator);    

