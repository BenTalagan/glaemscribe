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
    class RuleGroup
  
      VAR_NAME_REGEXP     = /{([0-9A-Z_]+)}/
      VAR_DECL_REGEXP     = /^\s*{([0-9A-Z_]+)}\s+===\s+(.+?)\s*$/
      RULE_REGEXP         = /^\s*(.*?)\s+-->\s+(.+?)\s*$/
      CROSS_RULE_REGEXP   = /^\s*(.*?)\s+-->\s+([\s0-9,]+)\s+-->\s+(.+?)\s*$/
  
      attr_reader :root_code_block, :name, :mode, :in_charset, :rules
  
      def initialize(mode,name)
        @name             = name
        @mode             = mode
        @root_code_block  = IfTree::CodeBlock.new       
      end
  
      def add_var(var_name, value)
        @vars[var_name] = value
      end
  
      # Replace all vars in expression
      def apply_vars(line, string)
        ret = string.gsub(VAR_NAME_REGEXP) { |cap_var|
          rep = @vars[$1]
          if !rep
            @mode.errors << Glaeml::Error.new(line, "In expression: #{string}: failed to evaluate variable: #{cap_var}.") 
            return nil
          end
          rep
        }
        ret
      end
      
      def descend_if_tree(code_block, trans_options)
        code_block.terms.each{ |term|         
          if(term.is_code_lines?)
            term.code_lines.each{ |cl|
              finalize_code_line(cl) 
            } 
          else
            term.if_conds.each{ |if_cond|
              
              if_eval = Eval::Parser.new()
              
              begin
                if(if_eval.parse(if_cond.expression,trans_options) == true)
                  descend_if_tree(if_cond.child_code_block, trans_options)
                  break
                end
              rescue Eval::IfEvalError => e
                @mode.errors << Glaeml::Error.new(if_cond.line, "Failed to evaluate condition '#{if_cond.expression}' (#{e})")
              end 
                
            }
          end
        }
      end
            
      def finalize_rule(line, match_exp, replacement_exp, cross_schema = nil)
        
        match                 = apply_vars(line, match_exp)
        replacement           = apply_vars(line, replacement_exp)
        
        return if !match || !replacement # Failed
              
        rule                  = Rule.new(line, self)                             
        rule.src_sheaf_chain  = SheafChain.new(rule,match,true)
        rule.dst_sheaf_chain  = SheafChain.new(rule,replacement,false)
              
        rule.finalize(cross_schema)
      
        self.rules << rule
      end
      
      def finalize_code_line(code_line)
        begin
          
          if code_line.expression =~ VAR_DECL_REGEXP

            var_name      = $1
            var_value_ex  = $2
            var_value     = apply_vars(code_line.line, var_value_ex)
        
            if !var_value
              @mode.errors << Glaeml::Error.new(code_line.line, "Thus, variable {#{var_name}} could not be declared.")
              return
            end
        
            add_var(var_name,var_value)
 
          elsif code_line.expression =~ CROSS_RULE_REGEXP
        
            match         = $1
            cross         = $2
            replacement   = $3      
      
            finalize_rule(code_line.line, match, replacement, cross)
      
          elsif code_line.expression =~ RULE_REGEXP
  
            match         = $1
            replacement   = $2

            finalize_rule(code_line.line, match, replacement)
         
          elsif code_line.expression.empty?
            # puts "Empty"
          else
            @mode.errors << Glaeml::Error.new(code_line.line,"Cannot understand: #{code_line.expression}")
          end  
        end
      end 
    
      def finalize(trans_options)
        @vars             = {}       
        @in_charset       = {}
        @rules            = []
        
        add_var("NULL","")
        add_var("UNDERSCORE",SPECIAL_CHAR_UNDERSCORE)
        
        descend_if_tree(@root_code_block, trans_options)
                            
        # Now that we have selected our rules, create the in_charset of the rule_group 
        rules.each{ |r| 
          r.sub_rules.each { |sr|
            sr.src_combination.join("").split(//).each{ |inchar|
              # Add the character to the map of input characters
              # Ignore '_' (bounds of word) and '|' (word breaker)
              @in_charset[inchar] = self if inchar != WORD_BREAKER && inchar != WORD_BOUNDARY
            }
          }
        }
      end
    end
  end
end