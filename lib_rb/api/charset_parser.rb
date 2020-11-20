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
    
    class CharsetParser
      
      def initialize()
        @charset = nil
      end
      
      def parse(file_path)
        @charset = Charset.new(ResourceManager::charset_name_from_file_path(file_path))  
        
        raw = File.open(file_path,"rb:utf-8").read
        doc = Glaeml::Parser.new.parse(raw)

        if(doc.errors.any?)
          @charset.errors = doc.errors
          return @charset
        end
        
        # TODO : verify charset glaeml like we do with modes
        
        doc.root_node.gpath("char").each { |char_element|
          code   = char_element.args[0].hex
          names  = char_element.args[1..-1].map{|cname| cname.strip }.reject{ |cname| cname.empty? }
          @charset.add_char(char_element.line,code,names)
        }
               
        doc.root_node.gpath("seq").each{ |seq_elemnt| 
          names       = seq_elemnt.args
          child_node  = seq_elemnt.children.first
          seq         = (child_node && child_node.text?)?(child_node.args.first):("")
          @charset.add_sequence_char(seq_elemnt.line,names,seq)
        }
        
        doc.root_node.gpath("virtual").each { |virtual_element|
          names     = virtual_element.args
          reversed  = false        
          default   = nil
          classes   = []
          
          virtual_element.gpath("class").each { |class_element|
            vc =  Charset::VirtualChar::VirtualClass.new
            vc.target    = class_element.args[0]
            vc.triggers  = class_element.args[1..-1].map{|cname| cname.strip }.reject{ |cname| cname.empty? }
            
            # Allow triggers to be defined inside the body of the class element
            text_lines      = class_element.children.select { |c| c.text? }.map{ |c| c.args.first}
            inner_triggers  = text_lines.join(" ").split(/\s/).select{ |e| e != '' }
            vc.triggers    += inner_triggers

            classes << vc
          }
          virtual_element.gpath("reversed").each { |reversed_element| 
            reversed = true
          }
          virtual_element.gpath("default").each { |default_element| 
            default  = default_element.args[0]
          }
          
          @charset.add_virtual_char(virtual_element.line,classes,names,reversed,default)
        }
        
        @charset.finalize
             
        @charset 
      end
      
    end
  end
end
