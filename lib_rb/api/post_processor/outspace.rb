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

# A post processor operator to replace the out_space on the fly.
# This has the same effect as the \outspace parameter
# But can be included in the postprocessor and benefit from the if/then logic

module Glaemscribe
  module API
    
    class OutspacePostProcessorOperator < PostProcessorOperator
      def initialize(mode, glaeml_element)
        super(mode, glaeml_element)
        @out_space = @mode.post_processor.out_space  = glaeml_element.args[0].split.reject{|token| token.empty? }   
      end
      
      def apply(tokens, charset)
        @mode.post_processor.out_space = @out_space
        tokens
      end
    end

    ResourceManager::register_post_processor_class("outspace", OutspacePostProcessorOperator)    
  end
end