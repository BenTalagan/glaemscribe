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
    module Eval
    
      class IfEvalError < StandardError
      end
    
      class UnknownToken < IfEvalError
      end

      class SyntaxError < IfEvalError
      end
    
      class Token
        attr_reader   :name, :expression
        attr_accessor :value
        def initialize(name, expression)
          @name        = name
          @expression  = expression
          @value       = nil
        end 
        def regexp?
          @expression.is_a? Regexp
        end
        def clone(value=nil)
          t = super()
          t.value = value
          t
        end
      end

      class Lexer 
        attr_reader :exp, :token_chain
 
        EXP_TOKENS = [
          Token.new("bool_or",      "||"),
          Token.new("bool_and",     "&&"),
          Token.new("cond_inf_eq",  "<="),
          Token.new("cond_inf",     "<"),
          Token.new("cond_sup_eq",  ">="),
          Token.new("cond_sup",     ">"),
          Token.new("cond_eq",      "=="),
          Token.new("cond_not_eq",  "!="),
          Token.new("add_plus",     "+"),
          Token.new("add_minus",    "-"),
          Token.new("mult_times",   "*"),
          Token.new("mult_div",     "/"),
          Token.new("mult_modulo",  "%"),
          Token.new("prim_not",     "!"),
          Token.new("prim_lparen",  "("),
          Token.new("prim_rparen",  ")"),
          Token.new("prim_string",  /^'[^']*'/),
          Token.new("prim_string",  /^"[^"]*"/),
          Token.new("prim_const",   /^[a-zA-Z0-9_.]+/)
        ]    
  
        TOKEN_END = Token.new("prim_end","")
  
        def initialize(exp)
          @exp            = exp
          @token_chain    = []
          @retain_last    = false
        end
  
        def uneat
          @retain_last = true
        end
  
        def advance
          @exp.strip!
    
          if @retain_last
            @retain_last = false
            return @token_chain.last
          end
    
          if(@exp == TOKEN_END.expression)
            t               = TOKEN_END.clone("")
            @token_chain    << t
            return t
          end
    
          EXP_TOKENS.each{ |token|
            if(token.regexp?) 
              if(token.expression =~ @exp)
                @exp          = $' # Eat the token
                t             = token.clone($~.to_s)
                @token_chain << t 
                return t        
              end
            else
              if(@exp.start_with?(token.expression))
                @exp          = @exp[token.expression.length..-1] 
                t             = token.clone(token.expression)
                @token_chain << t 
                return t
              end
            end
          }      
          raise UnknownToken    
        end
    
      end

      class Parser
        def parse(exp, vars)
          @lexer  = Lexer.new(exp)
          @vars   = {}; vars.each{ |k,v| @vars[k.to_s] = v } # Cast symbols
          parse_top_level
        end
  
        def parse_top_level
          explore_bool
        end
  
        def explore_bool
          v = explore_compare
          loop do
            case @lexer.advance().name
            when 'bool_or'
              if v
                explore_bool
              else
                v = explore_compare
              end
            when 'bool_and'
              if !v
                explore_bool 
              else
                v = explore_compare
              end
            else break
            end
          end      
          @lexer.uneat # Keep the unused token for the higher level
          v
        end
    
        def explore_compare
          v = explore_add
          loop do
            case @lexer.advance().name
            when 'cond_inf_eq'  then v = (v <= explore_add)
            when 'cond_inf'     then v = (v <  explore_add)
            when 'cond_sup_eq'  then v = (v >= explore_add)
            when 'cond_sup'     then v = (v >  explore_add)
            when 'cond_eq'      then v = (v == explore_add)
            when 'cond_not_eq'  then v = (v != explore_add)
            else break
            end
          end
          @lexer.uneat # Keep the unused token for the higher level
          v      
        end

        def explore_add
          v = explore_mult
          loop do
            case @lexer.advance().name
            when 'add_plus'     then v += explore_mult
            when 'add_minus'    then v -= explore_mult
            else break
            end
          end
          @lexer.uneat # Keep the unused token for the higher level
          v
        end

        def explore_mult
          v = explore_primary
          loop do
            case @lexer.advance().name
            when 'mult_times'   then v *= explore_primary
            when 'mult_div'     then v /= explore_primary
            when 'mult_modulo'  then v %= explore_primary
            else break
            end
          end
          @lexer.uneat # Keep the unused token for the higher level
          v
        end
    
        def explore_primary
          token = @lexer.advance()
          case token.name
          when 'prim_const'
            v = cast_constant(token.value)
          when 'add_minus' # Allow the use of - as primary token for negative numbers
            v = -explore_primary
          when 'prim_not' # Allow the use of ! for booleans
            v = !explore_primary
          when 'prim_lparen'
            v           = parse_top_level
            rtoken      = @lexer.advance() 
            raise SyntaxError.new("Missing right parenthesis.") if(rtoken.name != 'prim_rparen') 
          else raise SyntaxError.new("Cannot understand: #{token.value}.")
          end
          v
        end
    
        def constant_is_float?(const)
          Float(const) rescue false
        end
    
        def constant_is_int?(const)
          Integer(const) rescue false
        end
    
        def constant_is_string?(const)
          return false if const.length < 2
          f = const[0]
          l = const[-1]
          return ( f == l && (l == "'" || l == '"') )
        end
    
        def cast_constant(const)
          if constant_is_int?(const)
            const.to_i
          elsif constant_is_float?(const)
            const.to_f
          elsif const[/^\'(.*)\'$/] || const[/^\"(.*)\"$/]
            $1
          elsif const == 'true'
            true
          elsif const == 'false'
            false
          elsif const == 'nil'
            nil
          elsif(@vars[const] != nil)
            @vars[const]
          else
            raise SyntaxError.new("Cannot understand constant '#{const}'.")
          end   
        end
      end
    end
  end
end

=begin
l = Glaemscribe::API::Eval::Parser.new
puts l.parse("2+2+2", {})
puts l.parse("1>2 && 2<3",{})
puts l.parse("option == OPTION",{:option => 2, :OPTION => 2})
puts l.parse("option == (OPTION && false)",{:option => 2, :OPTION => 2})
=end