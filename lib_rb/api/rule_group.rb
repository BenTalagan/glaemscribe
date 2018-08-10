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
    
    class RuleGroupVar
      attr_reader :name, :value
      
      def initialize(name, value, is_pointer)
        @name       = name
        @value      = value
        @is_pointer = is_pointer
      end
      
      def pointer?
        is_pointer
      end
    end
    
    class RuleGroup
  
      VAR_NAME_REGEXP             = /{([0-9A-Z_]+)}/
      UNICODE_VAR_NAME_REGEXP_IN  = /^UNI_([0-9A-F]+)$/
      UNICODE_VAR_NAME_REGEXP_OUT = /{UNI_([0-9A-F]+)}/
      
      VAR_DECL_REGEXP             = /^\s*{([0-9A-Z_]+)}\s+===\s+(.+?)\s*$/
      POINTER_VAR_DECL_REGEXP     = /^\s*{([0-9A-Z_]+)}\s+<=>\s+(.+?)\s*$/
      RULE_REGEXP                 = /^\s*(.*?)\s+-->\s+(.+?)\s*$/
      
      CROSS_SCHEMA_REGEXP         = /[0-9]+(\s*,\s*[0-9]+)*/
      
      CROSS_RULE_REGEXP           = /^\s*(.*?)\s+-->\s+(#{CROSS_SCHEMA_REGEXP}|#{VAR_NAME_REGEXP}|identity)\s+-->\s+(.+?)\s*$/
  
      attr_reader :root_code_block, :name, :mode, :in_charset, :rules
  
      def initialize(mode,name)
        @name             = name
        @mode             = mode
        @root_code_block  = IfTree::CodeBlock.new       
      end
  
      def add_var(var_name, value, is_pointer)
        @vars[var_name] = RuleGroupVar.new(var_name, value, is_pointer)
      end
      
      # Replace all vars in expression
      def apply_vars(line, string, allow_unicode_vars=false)
        
        ret               = string
        stack_depth       = 0
        had_replacements  = true
        
        while had_replacements
          
          had_replacements = false
          ret = ret.gsub(VAR_NAME_REGEXP) { |cap_var|
            vname = $1
            v     = @vars[vname]
            if !v
              if vname =~ UNICODE_VAR_NAME_REGEXP_IN
                # A unicode variable.
                if allow_unicode_vars
                  # Just keep this variable intact, it will be replaced at the last moment of the parsing
                  rep = cap_var
                else
                  @mode.errors << Glaeml::Error.new(line, "In expression: #{string}: making wrong use of unicode variable: #{cap_var}. Unicode vars can only be used in source members of a rule or in the definition of another variable.") 
                  return nil
                end
              else
                @mode.errors << Glaeml::Error.new(line, "In expression: #{string}: failed to evaluate variable: #{cap_var}.") 
                return nil
              end
            else
              rep = v.value
              # Only count replacements on non unicode vars
              had_replacements = true
            end
            rep
          }
          stack_depth += 1
                           
          break if !had_replacements
          
          if stack_depth > 16
            @mode.errors << Glaeml::Error.new(line, "In expression: #{string}: evaluation stack overflow.") 
            return nil
          end
        end
                
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
        
        match                 = apply_vars(line, match_exp, true)
        replacement           = apply_vars(line, replacement_exp, false)
        
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
            var_value     = apply_vars(code_line.line, var_value_ex, true)
        
            if !var_value
              @mode.errors << Glaeml::Error.new(code_line.line, "Thus, variable {#{var_name}} could not be declared.")
              return
            end
        
            add_var(var_name, var_value, false)
 
          elsif code_line.expression =~ POINTER_VAR_DECL_REGEXP
            
            var_name      = $1
            var_value_ex  = $2
       
            add_var(var_name, var_value_ex, true)
            
          elsif code_line.expression =~ CROSS_RULE_REGEXP
        
            match         = $1
            cross         = $2
            var_name      = $4
            replacement   = $5      
            
            if var_name
              # This was a variable declaration           
              var_value = apply_vars(code_line.line, cross, false)
              if !var_value
                @mode.errors << Glaeml::Error.new(code_line.line, "Thus, variable {#{var_name}} could not be declared.")
                return
              end
              cross = var_value
            end
            
            if cross == "identity"
              cross = nil              
            end
      
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
        
        add_var("NULL","",false)
  
        # Characters that are not easily entered or visible in a text editor
        add_var("NBSP",           "{UNI_A0}",   false)
        add_var("WJ",             "{UNI_2060}", false)
        add_var("ZWSP",           "{UNI_200B}", false)
        add_var("ZWNJ",           "{UNI_200C}", false)        

        # The following characters are used by the mode syntax.
        # Redefine some convenient tools.
        add_var("UNDERSCORE",     "{UNI_5F}",  false)
        add_var("ASTERISK",       "{UNI_2A}",  false)
        add_var("COMMA",          "{UNI_2C}",  false)
        add_var("LPAREN",         "{UNI_28}",  false)
        add_var("RPAREN",         "{UNI_29}",  false)
        add_var("LBRACKET",       "{UNI_5B}",  false)
        add_var("RBRACKET",       "{UNI_5D}",  false)
       
        descend_if_tree(@root_code_block, trans_options)
                            
        # Now that we have selected our rules, create the in_charset of the rule_group 
        rules.each{ |r| 
          r.sub_rules.each { |sr|
            sr.src_combination.join("").split(//).each{ |inchar|
              # Add the character to the map of input characters
              # Ignore '\u0000' (bounds of word) and '|' (word breaker)
              @in_charset[inchar] = self if inchar != WORD_BREAKER && inchar != WORD_BOUNDARY_TREE
            }
          }
        }
      end
    end
  end
end