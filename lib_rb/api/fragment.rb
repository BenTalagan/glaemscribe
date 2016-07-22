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
#
# A Fragment is a sequence of equivalences 
# For example h(a|ä)(i|ï) represents the four combinations:
# hai, haï, häi, häï

module Glaemscribe
  module API
    class Fragment
            
      attr_reader :sheaf
      attr_reader :rule
      attr_reader :mode
      attr_reader :combinations
      
      def src?; @sheaf.src?; end
      def dst?; @sheaf.dst?; end
      
      EQUIVALENCE_SEPARATOR = ","
      
      EQUIVALENCE_RX_OUT    = /(\(.*?\))/
      EQUIVALENCE_RX_IN     = /\((.*?)\)/
    
      # Should pass a fragment expression, e.g. : "h(a|ä)(i|ï)"
      def initialize(sheaf, expression)
        @sheaf      = sheaf
        @mode       = sheaf.mode
        @rule       = sheaf.rule
        @expression = expression
        
        # Split the fragment, turn it into an array of arrays, e.g. [[h],[a,ä],[i,ï]]
        equivalences = expression.split(EQUIVALENCE_RX_OUT).map{ |eq| eq.strip }
        equivalences = equivalences.map{ |eq|           
          eq =~ EQUIVALENCE_RX_IN
          if $1
            eq = $1.split(EQUIVALENCE_SEPARATOR,-1).map{ |elt| 
              elt = elt.strip 
              if elt.empty?
                @rule.errors << "Null members are not allowed in equivalences!" 
                return
              end
              elt.split(/\s/)
            } 
          else
            eq = [eq.split(/\s/)] # This equivalence has only one possibility
          end
        }   
          
        equivalences = [[[""]]] if equivalences.empty?
             
        # In the case of a destination fragment, check that all symbols used are found 
        # in the charsets used by the mode
        if dst?
          mode = @sheaf.mode
          equivalences.each{ |eq|
            eq.each{ |member|
              member.each{ |token|
                next if token.empty? # NULL case
                mode.supported_charsets.each{ |charset_name, charset|
                  symbol = charset[token]
                  if !symbol
                    @rule.errors << "Symbol #{token} not found in charset '#{charset.name}'!" 
                    return
                  end
                } 
              }
            }
          }
        end
                        
        # Calculate all combinations for this fragment (productize the array of arrays)
        res = equivalences[0]
    
        (equivalences.length-1).times { |i|
          prod  = res.product(equivalences[i+1]).map{ |x,y| x+y}
          res   = prod
        }
        
        @combinations = res
      end   
      
      
      def p
        ret = "---- " + @expression + "\n"
        @combinations.each{ |c|
          ret += "------ " + c.inspect + "\n"
        }
        ret
      end
   
    end
  end
end