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
# A sheaf chain is a sequence of sheaves. e.g. :
#
# With a global rule of : src => res
# Where src = "[a,b,c][d,e,f]"
# and   res = "[x,y,z][1,2,3]"
#
# The generated rules is a list of 9 parallel rules: 
# ad => x1, ae => x2, af => res => x3
# bd => y1, be => y2, etc...
#
# Or, more complicated: "[m,(b|p)](h|y)[a,e]"
# Will generate the following equivalences:
# mha = mya
# mhe = mye
# bha = pha = bya = pya
# bhe = phe = bye = phe

module Glaemscribe
  module API
    class SheafChain
  
      SHEAF_REGEXP_IN    = /\[(.*?)\]/
      SHEAF_REGEXP_OUT    = /(\[.*?\])/
  
      attr_reader :is_src
      attr_reader :sheaves
      attr_reader :mode
      attr_reader :rule
      
      def src? ; is_src ; end
      def dst? ; !is_src ; end
                 
      # Pass in the whole member of a rule src => dst (src or dst)
      def initialize(rule, expression, is_src)      
        @rule       = rule
        @mode       = rule.mode
        @is_src     = is_src
        @expression = expression
                
        # Split expression with '[...]' patterns. e.g. 'b[a*c*d]e' => [b, a*c*d, e]
        sheaf_exps = expression.split(SHEAF_REGEXP_OUT).map{ |elt| elt.strip }.reject{ |elt| elt.empty? }
        sheaf_exps = sheaf_exps.map { |sheaf_exp| 
          sheaf_exp =~ SHEAF_REGEXP_IN
          sheaf_exp = $1 if $1 # Take the interior of the brackets it was a [...] expression
          sheaf_exp.strip
        }
            
        @sheaves    = sheaf_exps.map{ |sheaf_exp| Sheaf.new(self,sheaf_exp) }
        @sheaves    = [Sheaf.new(self,"")] if @sheaves.empty?         
      end
      
      def p
        ret = ("*" * 30) 
        ret += "\n"
        ret += @expression + "\n"
        @sheaves.each{ |s|
          ret += s.p
        }
        ret
      end
      
    end
  end
end