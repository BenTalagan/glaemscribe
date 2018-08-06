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
    class Charset
      attr_reader   :name
      
      attr_accessor :errors
      attr_reader   :chars
      attr_reader   :virtual_chars
            
      class Char
        attr_accessor :line     # Line num in the sourcecode
        attr_accessor :code     # Position in unicode
        attr_accessor :names    # Names
        attr_accessor :str      # How does this char resolve as a string
        attr_accessor :charset  # Pointer to parent charset
        
        def initialize
          @names = {}
        end
        
        def virtual?
          false
        end
        
        def sequence?
          false
        end
      end
      
      class VirtualChar # Could have had inheritance here ... 
        attr_accessor :line
        attr_accessor :names
        attr_accessor :classes
        attr_accessor :charset
        attr_accessor :reversed
        attr_accessor :default
        
        class VirtualClass
          attr_accessor :target
          attr_accessor :triggers
        end
        
        def initialize
          @classes      = {} # result_char_1 => [trigger_char_1, trigger_char_2 ...] , result_char_1 => ...
          @lookup_table = {}
          @reversed     = false
          @default      = nil
        end
        
        def str
          
          # Will be called if the virtual char could not be replaced and still exists at the end of the transcription chain
          if @default
            @charset[@default].str
          else
            VIRTUAL_CHAR_OUTPUT
          end
        end
        
        def finalize
          @lookup_table = {}
          @classes.each{ |vc|
            
            result_char   = vc.target
            trigger_chars = vc.triggers
            
            trigger_chars.each{ |trigger_char|
              found = @lookup_table[trigger_char]
              if found
                @charset.errors << Glaeml::Error.new(@line, "Trigger char #{trigger_char} found twice in virtual char.")
              else
                rc = @charset[result_char]
                tc = @charset[trigger_char]
        
                if rc.nil?
                  @charset.errors << Glaeml::Error.new(@line, "Trigger char #{trigger_char} points to unknown result char #{result_char}.")
                elsif tc.nil?
                  @charset.errors << Glaeml::Error.new(@line, "Unknown trigger char #{trigger_char}.")  
                elsif rc.class == VirtualChar
                  @charset.errors << Glaeml::Error.new(@line, "Trigger char #{trigger_char} points to another virtual char #{result_char}. This is not supported!")
                else
                  tc.names.each{|trigger_char_name| # Don't forget to match all name variants for that trigger char!
                    @lookup_table[trigger_char_name] = rc
                  }              
                end  
              end              
            }
          }
          if @default
            c = @charset[@default]
            if !c
              @charset.errors << Glaeml::Error.new(@line, "Default char #{@default} does not match any real character in the charset.")             
            elsif c.virtual?
              @charset.errors << Glaeml::Error.new(@line, "Default char #{@default} is virtual, it should be real only.")
            end
          end
        end
        
        def [](trigger_char_name)
          @lookup_table[trigger_char_name]
        end
        
        def virtual?
          true
        end
        
        def sequence?
          false
        end
      end
      
      class SequenceChar
        attr_accessor :line     # Line of code
        attr_accessor :names    # Names
        attr_accessor :sequence # The sequence of chars
        attr_accessor :charset  # Pointer to parent charset
        
        def virtual?
          false
        end
        
        def sequence?
          true
        end   
        
        def str
          # A sequence char should never arrive unreplaced
          VIRTUAL_CHAR_OUTPUT
        end
        
        def finalize          
          if @sequence.count == 0
            @charset.errors << Glaeml::Error.new(@line, "Sequence for sequence char is empty.")    
          end
          
          @sequence.each{ |symbol|
            # Check that the sequence is correct
            found = @charset[symbol]
            if !found
              @charset.errors << Glaeml::Error.new(@line, "Sequence char #{symbol} cannot be found in the charset.")
            end
          }    
        end
        
      end
      
      def initialize(name)
        @name           = name
        @chars          = []
        @errors         = []
        @virtual_chars  = []
      end
      
      # Pass integer (utf8 num) and array (of strings)
      def add_char(line, code, names)
        return if names.empty? || names.include?("?") # Ignore characters with '?'
        
        c         = Char.new
        c.line    = line
        c.code    = code
        c.names   = names
        c.str     = code.chr('UTF-8')
        c.charset = self
        @chars << c
      end
      
      def add_virtual_char(line, classes, names, reversed = false, default = nil)
        return if names.empty? || names.include?("?") # Ignore characters with '?'
        
        c           = VirtualChar.new
        c.line      = line
        c.names     = names
        c.classes   = classes # We'll check errors in finalize
        c.charset   = self
        c.reversed  = reversed
        c.default   = default
        @chars << c   
      end
      
      def add_sequence_char(line, names, seq)
        return if names.empty? || names.include?("?") # Ignore characters with '?'
        
        c             = SequenceChar.new
        c.line        = line
        c.names       = names
        c.sequence    = seq.split.reject{|token| token.empty? }    
        c.charset     = self
        @chars << c
      end
      
      def finalize
        @errors         = []
        @lookup_table   = {}
        @virtual_chars  = [] # A convenient filtered array
        
        @chars.each { |c|
          c.names.each { |cname|
            found = @lookup_table[cname]
            if found
              @errors << Glaeml::Error.new(c.line, "Character #{cname} found twice.")
            else
              @lookup_table[cname] = c
            end
          }
        }
        
        @chars.each{ |c|
          if c.class == VirtualChar
            c.finalize
            @virtual_chars << c
          end
        }
        
        @chars.each{|c|
          if c.class == SequenceChar
            c.finalize
          end
        }
        
        API::Debug::log("Finalized charset '#{@name}', #{@lookup_table.count} symbols loaded.")
      end
      
      def [](symbol)
        @lookup_table[symbol]
      end
      
    end
  end
end