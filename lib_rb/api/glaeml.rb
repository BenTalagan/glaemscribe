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
      
      class Error
        attr_accessor :text
        attr_accessor :line
        
        def initialize(line,text)
          @line = line
          @text = text
        end
      end
      
      class Document
        attr_accessor :root_node
        attr_accessor :errors
          
        def initialize
          @errors = []
        end        
      end
    
      class Node
        
        class Type
          Text            = 0
          ElementInline   = 1
          ElementBlock    = 2
        end
        
        def text?
          @type == Type::Text
        end
        
        def element?
          @type == Type::ElementInline || @type == Type::ElementBlock
        end
        
        def initialize(line, type, name)
          @line         = line
          @type         = type
          @name         = name
          @args         = []
          @children     = []
        end
        
        # Make our object clonable
        def initialize_copy(other)
          super
          @args = other.args.clone
          @children = other.children.map{|c| c.clone}
        end
        
        def pathfind_crawl(apath, found)
        
          children.each{ |c|
            if(c.name == apath[0])
              if apath.count == 1
                found << c
              else
                bpath = apath.dup
                bpath.shift
                c.pathfind_crawl(bpath, found)
              end
            end
          }
        end
        
        def gpath(path)
          apath = path.split(".")
          found = []
          pathfind_crawl(apath, found)
          found
        end
        
        attr_accessor :line
        
        attr_reader   :type
        attr_reader   :name
       
        attr_accessor :args    
        attr_reader   :children
        
        attr_accessor :parent_node
      end
      

      
      class Parser   
         
        def add_text_node(lnum, text)
          n             = Node.new(lnum, Node::Type::Text, "root")
          n.args        << text
          n.parent_node = @current_parent_node     
          @current_parent_node.children << n   
        end
      
        def parse(raw_data)
          raw_data.gsub!(/\\\*\*(.*?)\*\*\\/m) { |found|
            "\n" * found.count("\n")
          }
        
          lnum = 0   
        
          @document             = Document.new
          @document.root_node   = Node.new(lnum, Node::Type::ElementBlock, nil)
        
          @current_parent_node  = @document.root_node
           
          raw_data.lines.each{ |l|
            lnum  += 1
   
            l     = l.strip
            add_text_node(lnum, l) and next if l.empty?
                  
            if(l[0..0] == "\\")
              if(l.length == 1)
                @document.errors << Error.new(lnum, "Incomplete node.")
              else
                if(l[1..1] == "\\") # First backslash is escaped              
                
                  add_text_node(lnum, l[1..-1])              
                
                elsif l =~ /^(\\beg\s+)/
                
                  rest    = $'.strip
                  args    = []
                  name    = "???"
                  if(! (rest =~ /^([a-z_]+)/) )
                    @document.errors << Error.new(lnum, "Bad element name #{rest}.")
                  else
                    name = $1
                    args = $'.shellsplit                
                  end
                
                  n             = Node.new(lnum, Node::Type::ElementBlock, name)
                  n.args        += args
                  n.parent_node = @current_parent_node
              
                  @current_parent_node.children << n
                  @current_parent_node           = n                
                              
                elsif l =~ /^(\\end(\s|$))/              
                
                  if !@current_parent_node.parent_node
                    @document.errors << Error.new(lnum, "Element 'end' unexpected.")
                  elsif $'.strip != ""
                    @document.errors << Error.new(lnum, "Element 'end' should not have arguments.")
                  else
                    @current_parent_node = @current_parent_node.parent_node
                  end
              
                else
                
                  # Read the name of the node
                  l             = l[1..-1]         
                  l             =~ /^([a-z_]+)/
                  name          = $1
                  args          = $'.shellsplit
                
                  n             = Node.new(lnum, Node::Type::ElementInline, name)
                  n.args        += args
                  n.parent_node = @current_parent_node
                
                  @current_parent_node.children << n     
                           
                end
              end
            else
              add_text_node(lnum, l)
            end
          }
        
          if @current_parent_node != @document.root_node
            @document.errors << Error.new(lnum, "Missing 'end' element.")
          end
        
          return @document
        
        end
      end
    end
  end
end