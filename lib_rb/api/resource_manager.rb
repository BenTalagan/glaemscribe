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
    module ResourceManager
        
      MODE_PATH     = File.dirname(__FILE__) + "/../../glaemresources/modes/"
      MODE_EXT      = "glaem"
    
      CHARSET_PATH  = File.dirname(__FILE__) + "/../../glaemresources/charsets/"
      CHARSET_EXT   = "cst"
      
      ALL           = ["*"]
    
      @loaded_modes                     = {}
      @loaded_charsets                  = {}
      
      @pre_processor_operator_classes   = {}
      @post_processor_operator_classes  = {}
      
      def self.available_mode_names
        Dir.glob(MODE_PATH + "*.#{MODE_EXT}").map { |mode_file|     
          self.mode_name_from_file_path(mode_file)
        }
      end
      
      def self.loaded_modes
        @loaded_modes
      end
      
      def self.loaded_charsets
        @loaded_charsets
      end
      
      def self.register_pre_processor_class(operator_name, operator_class)
        @pre_processor_operator_classes[operator_name] = operator_class
      end
      
      def self.register_post_processor_class(operator_name, operator_class)
        @post_processor_operator_classes[operator_name] = operator_class
      end
    
      def self.class_for_pre_processor_operator_name(operator_name)
        @pre_processor_operator_classes[operator_name]
      end
      
      def self.class_for_post_processor_operator_name(operator_name)
        @post_processor_operator_classes[operator_name]
      end
      
      def self.p
        puts @pre_processor_operator_classes.inspect
        puts @post_processor_operator_classes.inspect        
      end
        
      def self.mode_name_from_file_path(file_path)
        File.basename(file_path,".*")
      end
    
      def self.charset_name_from_file_path(file_path)
        File.basename(file_path,".*")
      end
    
      def self.load_modes(which_ones = ALL)
        
        which_ones = [which_ones] if(which_ones.is_a?(String))  
          
        Dir.glob(MODE_PATH + "*.#{MODE_EXT}") { |mode_file|
      
          mode_name = self.mode_name_from_file_path(mode_file)
         
          next if(which_ones != ALL && !which_ones.include?(mode_name))
          next if(@loaded_modes.include? mode_name) # Don't load a charset twice
    
          API::Debug::log("*" * 20)
          API::Debug::log("Parsing Mode : #{mode_name}")
          API::Debug::log("*" * 20)
        
          mode = API::ModeParser.new().parse(mode_file)
          @loaded_modes[mode.name] = mode if mode 
        }  
      end
    
      def self.load_charsets(which_ones = ALL)
      
        which_ones = [which_ones] if(which_ones.is_a?(String))  
          
        Dir.glob(CHARSET_PATH + "*.#{CHARSET_EXT}") { |charset_file|
      
          charset_name = self.charset_name_from_file_path(charset_file)
    
          next if(which_ones != ALL && !which_ones.include?(charset_name))
          next if(@loaded_charsets.include? charset_name) # Don't load a charset twice
        
          API::Debug::log("*" * 20)
          API::Debug::log("Parsing Charset : #{charset_name}")
          API::Debug::log("*" * 20)
        
          charset = API::CharsetParser.new().parse(charset_file)
          
          @loaded_charsets[charset.name] = charset if charset 
        } 
      end
    
      def self.charset(name)
        @loaded_charsets[name]
      end
      
    end
  end
end
