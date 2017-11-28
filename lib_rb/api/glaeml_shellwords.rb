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
    module Glaeml
      class Shellwords
  
        class Error < StandardError
        end
  
        def initialize
        end

        ESCAPE_MODE_UNICODE = 1

        def reset_state
          @is_escaping                = false
          @is_eating_arg              = false
          @is_eating_arg_between_quotes  = false   
          @args = []
          @current_arg = ""
    
          @escape_mode            = nil
          @unicode_escape_counter = 0
          @unicode_escape_str     = ''
        end
  
        def advance_inside_arg(l,i)
          if l[i] == "\\"
            @is_escaping      = true
            @escape_mode      = nil
          else
            @current_arg += l[i]
          end
        end
  
        def advance_inside_escape(l,i)
          if !@escape_mode
            # We don't now yet what to do.
            case l[i]
            when 'n'
              @current_arg << "\n"
              @is_escaping = false
              return
            when "\\"
              @current_arg << "\\"
              @is_escaping = false
            when 't'
              @current_arg << "\t"
              @is_escaping = false
            when "\""
              @current_arg << "\""
              @is_escaping = false
            when "u"
              @escape_mode            = ESCAPE_MODE_UNICODE
              @unicode_escape_counter = 0
              @unicode_escape_str     = ''
            else
              raise Error, "Unknown escapment : \\#{l[i]}"
            end
          else
            case @escape_mode
            when ESCAPE_MODE_UNICODE
              c = l[i].downcase
        
              if !(c =~ /[0-9a-f]/)
                raise Error, 'Wrong format for unicode escaping, should be \u with 4 hex digits'
              end
        
              @unicode_escape_counter += 1
              @unicode_escape_str     += c
              if @unicode_escape_counter == 4
                @is_escaping = false
                @current_arg += [@unicode_escape_str.hex].pack("U")
              end
        
            else
              raise Error, "Unimplemented escape mode"
            end
          end
    
        end

        def parse(l)
          reset_state
    
          i = 0
          l.length.times{ |i|

            if !@is_eating_arg
              next if l[i] =~ /\s/
              @is_eating_arg             = true
              @is_eating_arg_between_quotes = (l[i] == "\"")
              @current_arg << l[i] if !@is_eating_arg_between_quotes
            else
              # Eating arg
              if @is_escaping
                advance_inside_escape(l,i)
              else
                if !@is_eating_arg_between_quotes
                  if l[i] =~ /[\s"]/
                    @args << @current_arg
                    @current_arg = ""
                    @is_eating_arg             = (l[i] == "\"") # Starting a new arg directly
                    @is_eating_arg_between_quotes = @is_eating_arg
                    next
                  else
                    advance_inside_arg(l,i)
                  end
                else
                  if l[i] == "\""
                    @args << @current_arg
                    @current_arg    = ""
                    @is_eating_arg  = false
                  else
                    advance_inside_arg(l,i)
                  end
                end
              end
            end
          }
    
          if @is_eating_arg && @is_eating_arg_between_quotes
            raise Error, "Unmatched quote."
          end
  
          @args << @current_arg if !@current_arg.empty?
    
          @args
        end
  
      end
    end
  end
end

      