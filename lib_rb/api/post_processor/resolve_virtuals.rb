# encoding: UTF-8
#
# Glǽmscribe (also written Glaemscribe) is a software dedicated to
# the transcription of texts between writing systems, and more 
# specifically dedicated to the transcription of J.R.R. Tolkien's 
# invented languages to some of his devised writing systems.
# 
# Copyright (C) 2015 Benjamin Babut (Talagan).
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

module Glaemscribe
  module API

    class ResolveVirtualsPostProcessorOperator < PostProcessorOperator
      
      def finalize(trans_options)
        super(trans_options)
        @last_triggers = {} # Allocate the lookup here to optimize
      end
      
      def reset_trigger_states(charset)
        # For each virtual char in charset, maintain a state.
        charset.virtual_chars.each{ |vc|
          @last_triggers[vc] = nil # Clear the state
        }
      end
      
      def apply_loop(charset, tokens, new_tokens, reversed, token, idx)
        if token == '*SPACE' || token =='*LF'
          reset_trigger_states(charset)
          return
        end
        
        # Check if token is a virtual char
        c = charset[token]
        return if c.nil? # May happen for empty tokens
        if c.virtual? && (reversed == c.reversed)
          # Try to replace
          last_trigger = @last_triggers[c]
          if last_trigger != nil
            new_tokens[idx] = last_trigger.names.first # Take the first name of the non-virtual replacement.
          end
        else
          # Update states of virtual classes
          charset.virtual_chars.each{|vc|
            rc                  = vc[token]
            @last_triggers[vc]  = rc if rc != nil 
          }
        end        
      end
      
      def apply(tokens,charset)
        
        # Clone the tokens so that we can perform ligatures AND diacritics without interferences
        new_tokens = tokens.clone
        
        # Handle l to r virtuals (diacritics ?)
        reset_trigger_states(charset)       
        tokens.each_with_index{ |token,idx|
          apply_loop(charset,tokens,new_tokens,false,token,idx)
        }
        # Handle r to l virtuals (ligatures ?)
        reset_trigger_states(charset)       
        tokens.reverse_each.with_index{ |token,idx|
          apply_loop(charset,tokens,new_tokens,true,token,tokens.count - 1 - idx)
        }
        new_tokens
      end
    end

    ResourceManager::register_post_processor_class("resolve_virtuals", ResolveVirtualsPostProcessorOperator)    

  end
end