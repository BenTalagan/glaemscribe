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
    class Rule
      
      attr_accessor :line
      attr_accessor :src_sheaf_chain, :dst_sheaf_chain
      attr_reader   :sub_rules
      attr_reader   :mode
      attr_reader   :errors
      
      def initialize(line, rule_group)
        @line       = line
        @rule_group = rule_group
        @mode       = @rule_group.mode
        @sub_rules  = []
        @errors     = []
      end

      def finalize(cross_schema)
        
        if(@errors.any?)
          @errors.each { |e|
            @mode.errors << Glaeml::Error.new(@line, e)
          }
          return         
        end
        
        srccounter  = SheafChainIterator.new(@src_sheaf_chain)
        dstcounter  = SheafChainIterator.new(@dst_sheaf_chain, cross_schema)
        
        if(srccounter.errors.any?)
          srccounter.errors.each{ |e| @mode.errors << Glaeml::Error.new(@line, e) }
          return
        end
        
        if(dstcounter.errors.any?)
          dstcounter.errors.each{ |e| @mode.errors << Glaeml::Error.new(@line, e) }
          return
        end     
      
        srcp = srccounter.prototype
        dstp = dstcounter.prototype
            
        if srcp != dstp
          @mode.errors << Glaeml::Error.new(@line, "Source and destination are not compatible (#{srcp} vs #{dstp})")
          return
        end
        
        begin 
   
          # All equivalent combinations ...
          src_combinations  = srccounter.combinations 
   
          # ... should be sent to one destination
          dst_combination   = dstcounter.combinations.first
       
          src_combinations.each{ |src_combination|
            @sub_rules << SubRule.new(self, src_combination, dst_combination)
          }
      
          dstcounter.iterate()
        end while srccounter.iterate()
        
      end
      
      def p
        ret = ("=" * 30) + "\n"
        @sub_rules.each{ |sr|
          ret += sr.p
        }
        ret
      end
      
    end
  end
end

