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
            
      class Char
        attr_accessor :line
        attr_accessor :code
        attr_accessor :names
        attr_accessor :str
        
        def initialize
          @names = {}
        end
      end
      
      def initialize(name)
        @name   = name
        @chars  = []
        @errors = []
      end
      
      # Pass integer (utf8 num) and array (of strings)
      def add_char(line, code, names)
        return if names.empty? || names.include?("?") # Ignore characters with '?'
        
        c       = Char.new
        c.line  = line
        c.code  = code
        c.names = names
        c.str   = code.chr('UTF-8')
        @chars << c
      end
      
      def finalize
        @errors = []
        @lookup_table = {}
        
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
        
        API::Debug::log("Finalized charset '#{@name}', #{@lookup_table.count} symbols loaded.")
      end
      
      def [](symbol)
        @lookup_table[symbol]
      end
      
    end
  end
end