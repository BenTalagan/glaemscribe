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
    module IfTree
      
      class IfCond
        attr_accessor :line, :expression, :parent_if_term, :child_code_block
        def initialize(line, parent_if_term, expression)
          @parent_if_term     = parent_if_term
          @expression         = expression
        end
      end
      
      class Term
        attr_accessor :parent_code_block
        def initialize(parent_code_block)
          @parent_code_block = parent_code_block  
        end
        def is_code_lines?
          false
        end
        def is_pre_post_processor_operators?
          false
        end
      end
 
      class IfTerm < Term
        attr_accessor :if_conds
        def initialize(parent_code_block)
          super(parent_code_block)  
          @if_conds = []
        end
      end
      
      class CodeLine
        attr_accessor :expression, :line
        def initialize(expression, line)
          @expression   = expression
          @line         = line
        end
      end
      
      class PrePostProcessorOperatorsTerm < Term
        attr_accessor :operators
        def initialize(parent_code_block)
          super(parent_code_block)
          @operators = []
        end
        def is_pre_post_processor_operators?
          true
        end
      end
      
      class CodeLinesTerm < Term
        attr_accessor :code_lines
        def initialize(parent_code_block)
          super(parent_code_block)
          @code_lines      = []
        end
        def is_code_lines?
          true
        end
      end
      
      class CodeBlock
        attr_accessor :terms, :parent_if_cond
        def initialize(parent_if_cond = nil)
          @parent_if_cond = parent_if_cond
          @terms          = []
        end
      end

    end
  end
end