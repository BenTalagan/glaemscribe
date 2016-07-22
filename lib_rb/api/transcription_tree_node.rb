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
    class TranscriptionTreeNode
      attr_accessor :character, :siblings, :replacement
  
      def initialize(character, replacement)
        @character    = character
        @replacement  = replacement
        @siblings     = {}
      end
  
      def _p
        puts "Node has #{@siblings.keys.count} siblings."
        @siblings.each{ |k,v|
          puts "#{k}, effective: #{v.effective?}"
        }
      end
    
      def _pchain(chain)
        "[" + chain.map{|node| node.character||"ROOT"}.join(", ") + "]"
      end
  
      def effective?
        !@replacement.nil?
      end
  
      def add_subpath(source, rep)
        return if source.nil? || source.empty?
        cc = source[0..0]
      
        sibling       = @siblings[cc]
        sibling       = TranscriptionTreeNode.new(cc, nil) if !sibling
        @siblings[cc] = sibling
    
        if source.length == 1 
          # Sibling is effective
          sibling.replacement = rep
        else
          sibling.add_subpath(source[1..-1], rep)
        end
      end
  
      def transcribe(string, chain=[])
 
        chain << self
 
        if !string.empty?
          cc = string[0..0]
          sibling = @siblings[cc]
      
          if sibling    
            return sibling.transcribe(string[1..-1], chain)
          end # Else we are at the end
        end # Else we are at the end
      
        # puts "End of chain: #{chain.count}, #{_pchain(chain)}"
      
        # We are at the end of the chain
        while chain.count > 1
          last_node = chain.pop
          return last_node.replacement, chain.count if last_node.effective?
        end
      
        # Only the root node is in the chain, we could not find anything; return the "unknown char"
        return ["*UNKNOWN"], 1    
      end
    end
  end
end