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
# A Sheaf is a bundle of Fragments. They are used to factorize the writing process of rules, and thus represent parallel rules.
# For exemple [(a|ä),b,c] => [1,2,3] means that we send one sheaf to another, defining 4 rules:
# a => 1
# ä => 1
# b => 2
# c => 3

module Glaemscribe
  module API
    class Sheaf
      
      attr_reader :fragments
      attr_reader :sheaf_chain 
      attr_reader :mode
      attr_reader :rule
      
      attr_reader :expression
       
      SHEAF_SEPARATOR    = "*"
      
      def src?; @sheaf_chain.src?; end
      def dst?; @sheaf_chain.dst?; end
            
      # Should pass a sheaf expression, e.g. : "h, s, t"
      def initialize(sheaf_chain, expression)
        
        @sheaf_chain  = sheaf_chain
        @mode         = sheaf_chain.mode
        @rule         = sheaf_chain.rule
        @expression   = expression
        
        # Split members using "*" separator, KEEP NULL MEMBERS (this is legal)
        fragment_exps = expression.split(SHEAF_SEPARATOR,-1).map{|fragment_exp| fragment_exp.strip } 
        fragment_exps = [""] if fragment_exps.empty? # For NULL
                 
        # Build the fragments inside
        @fragments = fragment_exps.map{ |fragment_exp|  Fragment.new(self, fragment_exp) }
      end
      
      def p
        ret = "-- " + @expression + "\n"
        @fragments.each{ |l|
          ret += l.p
        }
        ret
      end
   
    end
  end
end
