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

    class CSubPostProcessorOperator < PostProcessorOperator
      attr_reader :matcher
      attr_reader :triggers
      
      def initialize(args)
        super(args)
        
        # Build our operator
        @matcher     = self.raw_args[0]
        @triggers    = Hash.new
  
        self.raw_args.each{ |arg|

          splitted  = arg.split()   
          replacer  = splitted.shift()
    
          splitted.each{ |token|
            @triggers[token] = replacer
          }
        }
      end
    
      def apply(tokens)
        last_trigger_replacer = nil
        tokens.each_with_index{ |token,idx|
          if token == @matcher && last_trigger_replacer != nil
            tokens[idx] = last_trigger_replacer
          elsif @triggers[token] != nil
            last_trigger_replacer = @triggers[token]
          end
        }
        tokens
      end
    end

    ResourceManager::register_post_processor_class("csub", CSubPostProcessorOperator)    

  end
end