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
    
    class PrePostProcessorOperator
      attr_reader :glaeml_element
      attr_reader :finalized_glaeml_element
      
      def initialize(mode, glaeml_element)
        @mode           = mode
        @glaeml_element = glaeml_element
      end
      
      def eval_arg(arg, trans_options)
        return nil if arg.nil?
        if arg =~ /^\\eval\s/
          to_eval = $'
          return Eval::Parser.new().parse(to_eval, trans_options)
        end
        return arg 
      end
      
      def finalize_glaeml_element(ge, trans_options)
        ge.args.map! { |arg| eval_arg(arg, trans_options) }
        ge.children.each{ |child|
          finalize_glaeml_element(child, trans_options)
        }
        ge
      end
      
      def finalize(trans_options)
        @finalized_glaeml_element = finalize_glaeml_element(@glaeml_element.clone, trans_options)
      end
      
      def apply
        raise "Pure virtual method, should be overloaded."
      end
    end
    
    class TranscriptionPrePostProcessor
      attr_reader :root_code_block
      
      attr_reader :operators
      
      def initialize(mode)
        @mode             = mode
        @root_code_block  = IfTree::CodeBlock.new 
      end
      
      def descend_if_tree(code_block, trans_options)
        code_block.terms.each{ |term|         
          if(term.is_pre_post_processor_operators?)
            term.operators.each{ |operator|
              @operators << operator
            } 
          else
            term.if_conds.each{ |if_cond|
              
              if_eval = Eval::Parser.new()
              
              if(if_eval.parse(if_cond.expression, trans_options) == true)
                descend_if_tree(if_cond.child_code_block, trans_options)
                break
              end
            }
          end
        }
      end
      
      def finalize(trans_options)
        @operators = []
        # Select operators depending on conditions
        descend_if_tree(@root_code_block, trans_options)
        # Reevaluate operator arguments
        @operators.each{ |op|
          op.finalize(trans_options)
        }
      end

    end
    
    class PreProcessorOperator < PrePostProcessorOperator  
    end
   
    class PostProcessorOperator < PrePostProcessorOperator
    end
    
    class TranscriptionPreProcessor < TranscriptionPrePostProcessor           
      # Apply all preprocessor rules consecutively
      def apply(l)
        ret = l
        @operators.each{ |operator|
          ret = operator.apply(ret)
        } 
        ret
      end
    end
    
    class TranscriptionPostProcessor < TranscriptionPrePostProcessor
      
      attr_accessor :out_space
          
      def apply(tokens, out_charset)
         
        # Apply filters
        @operators.each{ |operator|
          tokens = operator.apply(tokens,out_charset)
        } 

        out_space_str     = " "
        out_space_str     = @out_space.map{ |token| 
          out_charset[token]&.str || UNKNOWN_CHAR_OUTPUT
        }.join("") if @out_space

        # Convert output
        ret = ""
        tokens.each{ |token|
          case token 
            when ""
            when "*UNKNOWN"
               ret += UNKNOWN_CHAR_OUTPUT
            when "*SPACE"
                ret += out_space_str
            when "*LF"
               ret += "\n"
            else
              c = out_charset[token]       
              ret += (c.nil?)?(UNKNOWN_CHAR_OUTPUT):c.str
          end        
        }
        ret
      end  
    end   
    
  end
end