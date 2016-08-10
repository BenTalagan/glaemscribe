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

    class UpDownTehtaSplitPreProcessorOperator < PreProcessorOperator
           
      attr_reader :vowel_list, :consonant_list
      def finalize(trans_options)
        super(trans_options)
        
        vowel_list          = finalized_glaeml_element.args[0]
        consonant_list      = finalized_glaeml_element.args[1]
            
        vowel_list          = vowel_list.split(/,/).map{|s| s.strip}
        consonant_list      = consonant_list.split(/,/).map{|s| s.strip}  
           
        @vowel_map          = {} # Recognize vowel tokens
        @consonant_map      = {} # Recognize consonant tokens
        @splitter_tree      = TranscriptionTreeNode.new(nil,nil) # Recognize tokens
        @word_split_map     = {}
        # The word split map will help to recognize words
        # The splitter tree will help to split words into tokens
        
        vowel_list.each      { |v| @splitter_tree.add_subpath(v, v); @vowel_map[v] = v }
        consonant_list.each  { |c| @splitter_tree.add_subpath(c, c); @consonant_map[c] = c}
      
        all_letters = (vowel_list + consonant_list).join("").split(//).sort.uniq    
        all_letters.each{ |l| @word_split_map[l] = l }
      end
    
      def type_of(token)
        if @vowel_map[token]        
          return "V"
        elsif @consonant_map[token] 
          return "C"
        else                        
          return "X"
        end            
      end
      
      def apply_to_word(w)
        res = []
        
        if w.strip.empty?
          res << w
        else
          while w.length != 0
            r, len = @splitter_tree.transcribe(w)
               
            if r != [UNKNOWN_CHAR_OUTPUT]
              res << r 
            else
              res << w[0..0] # r
            end
          
            w = w[len..-1]
          end
        end
        
        res_modified = []
      
        # We replace the pattern CVC by CvVC where v is a phantom vowel.
        # This makes the pattern CVC not possible.
        i = 0
        while i < res.count - 2 do
    
          r0 = res[i]
          r1 = res[i+1]
          r2 = res[i+2]
          t0 = type_of(r0)
          t1 = type_of(r1)
          t2 = type_of(r2)
        
          if t0 == "C" && t1 == "V" && t2 == "C"
            res_modified << res[i]
            res_modified << "@"
            res_modified << res[i+1] 
            i += 2
          else
            res_modified << res[i]
            i += 1
          end
        end
      
        # Add the remaining stuff
        while i < res.count
          res_modified << res[i]
          i += 1
        end
      
        return res_modified.join("")       
      end
      
      def apply(content)
        accumulated_word = ""
        
        ret = ""
        
        content.split(//).each{ |letter|
          if @word_split_map[letter]
            accumulated_word += letter
          else
            ret += apply_to_word(accumulated_word)
            ret += letter
            accumulated_word = ""
          end        
        }
        ret += apply_to_word(accumulated_word) 
        ret   
      end
      
    end  
      
    ResourceManager::register_pre_processor_class("up_down_tehta_split", UpDownTehtaSplitPreProcessorOperator)    

  end
end