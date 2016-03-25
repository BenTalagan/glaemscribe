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
    class TranscriptionProcessor 
           
      attr_reader   :rule_groups
      attr_reader   :mode
      
      attr_accessor :out_space
      
      def initialize(mode)
        @mode         = mode
        @rule_groups  = {}
      end
      
      def add_subrule(sub_rule)
        path = sub_rule.src_combination.join("")
        @transcription_tree.add_subpath(path, sub_rule.dst_combination)
      end
      
      def finalize(trans_options)
        @errors = []
        
        @transcription_tree = TranscriptionTreeNode.new(nil,nil)
        
        # Add WORD_BOUNDARY and WORD_BREAKER in the tree
        @transcription_tree.add_subpath(WORD_BOUNDARY,  [""])
        @transcription_tree.add_subpath(WORD_BREAKER,   [""])
        
        rule_groups.each{ |rgname, rg| 
          rg.finalize(trans_options) 
        }
        
        # Build the input charset
        @in_charset = {}
        rule_groups.each{ |rgname, rg| 
          rg.in_charset.each{ |char, group|
            group_for_char = @in_charset[char]
            if group_for_char
              mode.errors << "Group #{rgname} uses input character #{char} which is also used by group #{group_for_char.name}. Input charsets should not intersect between groups." 
            else
              @in_charset[char] = group
            end
          }
        }
        
        # Build the transcription tree
        rule_groups.each{ |rgname, rg|
          rg.rules.each { |r|
            r.sub_rules.each{ |sr|      
              add_subrule(sr)
            }
          }
        }        
      end
      
      def apply(l, out_charset)
        ret = ""
        current_group     = nil
        accumulated_word  = ""
        
        out_space_str     = " "
        out_space_str     = @out_space.map{ |token| out_charset[token].str }.join("") if @out_space
        
        l.split("").each{ |c|
          case c
          when " ", "\t" 
            ret += transcribe_word(accumulated_word, out_charset)
            ret += out_space_str
            
            accumulated_word = ""
          when "\r", "\n"
            ret += transcribe_word(accumulated_word, out_charset)
            ret += c
            
            accumulated_word = ""
          else
            c_group = @in_charset[c]
            if c_group == current_group
              accumulated_word += c
            else
              ret += transcribe_word(accumulated_word, out_charset)
              current_group    = c_group
              accumulated_word = c
            end
          end            
        }
        # Just in case
        ret += transcribe_word(accumulated_word, out_charset)
        ret
      end
      
      def transcribe_word(word, out_charset)
        res = []
        word = WORD_BOUNDARY + word + WORD_BOUNDARY
        while word.length != 0
          r, len = @transcription_tree.transcribe(word)       
          word = word[len..-1]
          res += r
        end
        ret = ""
        res.each{ |token|
          case token 
          when ""
          when UNKNOWN_CHAR_OUTPUT
            ret += UNKNOWN_CHAR_OUTPUT
          else
            ret += out_charset[token].str
          end        
        }
        ret
      end
      
    end
  end
end