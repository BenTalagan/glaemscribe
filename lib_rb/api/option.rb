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
    
    class Option
      attr_reader   :mode
      attr_reader   :line
      attr_reader   :name
      attr_reader   :type
      attr_reader   :default_value_name      
      attr_reader   :values
      
      attr_accessor :is_radio

      class Type
        ENUM = "ENUM"
        BOOL = "BOOL"
      end
         
      def initialize(mode,  name, default_value_name, values, line, visibility = nil)
        @mode               = mode
        @name               = name
        @default_value_name = default_value_name
        @type               = (values.keys.count == 0)?(Type::BOOL):(Type::ENUM)
        @values             = values
        @visibility         = visibility
        @line               = line
        @value_to_names = {}
        @values.each { |vname, val| @value_to_names[val] = vname }
      end
      
      def default_value
        if @type == Type::BOOL
          (@default_value_name == 'true')
        else
          @values[@default_value_name]
        end
      end      
      
      def value_for_value_name(val_name)
        if @type == Type::BOOL
          return true   if(val_name == 'true' || val_name == true)
          return false  if(val_name == 'false' || val_name == false)
          return nil
        else
          return @values[val_name]
        end
      end
      
      def value_name_for_value(value)
        if @type == Type::BOOL
          return "true"  if value == true  || value == "true"
          return "false" if value == false || value == "false"
          return nil
        else
          return @value_to_names[value]
        end
      end
      
      def visible?
        if_eval = Eval::Parser.new()
        
        begin
          (if_eval.parse(@visibility || "true", @mode.latest_option_values || {}) == true)
        rescue Eval::IfEvalError => e
          nil
        end       
      end
      
    end
  end
end