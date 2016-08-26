#!/usr/bin/env ruby
#
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


SCRIPT_PATH = File.dirname(__FILE__)
require SCRIPT_PATH + "/../lib_rb/glaemscribe.rb"

Glaemscribe::API::Debug.enabled = false

def unit_test_directory(directory)
  
  puts "Testing now test base : #{directory}"
  
  Glaemscribe::API::ResourceManager::loaded_modes.each{ |name,mode|  
    
    next if mode.errors.any?
    
    Dir.glob(directory + "/sources/" + name + "/*") { |fok|
    
      bfname = File.basename(fok)
      prefix = "#{name} : #{bfname} : "
    
      true_teng = ""
      teng      = ""
      source    = ""
    
      begin
        File.open( directory + "/sources/" + name + "/" + bfname,"rb:utf-8") { |f| source = f.read}
      rescue Exception
        puts "[    ] " + prefix + "Could not open source file."
        next
      end
    
      begin
        File.open( directory + "/expecteds/" + name + "/" + bfname,"rb:utf-8") { |f| true_teng = f.read}
      rescue Exception
        puts "[    ] " + prefix + "Could not open expected file."
        next
      end     
    
      if true_teng.strip == ""
        puts "[    ] " + prefix + "Expected file is empty!!"
        next
      end
    
      true_teng          = true_teng.lines.map{|l| l.strip }.join("\n").strip
      source             = source.lines.map{|l| l.strip }.join("\n").strip
      success, teng      = mode.transcribe(source, mode.default_charset)
   
      if !success
        puts "[****]" + teng
        next
      end
    
      teng = teng.strip
    
      if true_teng != teng
        puts "[****] " + prefix
            
        teng_lines      = teng.lines.to_a
        true_teng_lines = true_teng.lines.to_a
        source_lines    = source.lines.to_a
      
        puts "========== Diff =========="
    
        true_teng_lines.each_with_index{|true_line, index|
          break if index >= teng_lines.count
        
          diff_line   = ""
          true_line   = true_line.strip
          teng_line   = teng_lines[index].strip
          source_line = source_lines[index].strip
        
          true_line.length.times{ |i|
          
            if i >= teng_line.length || teng_line[i] != true_line[i] 
              diff_line += "o"
            else
              diff_line += "." 
            end
          }    
          next if true_line == teng_line
        
          puts "S: " + source_line.inspect
          puts "G: " + true_line.inspect
          puts "T: " + teng_line.inspect
          puts "D: " + diff_line.inspect
        
        }
        puts "=========================="        
      else
        puts "[ OK ] " + prefix + "Yay."     
      end
    }  
  }
end


def dump_test_directory(directory, dump_directory)
  
  puts "Dumping now test base : #{directory}"
  
  Glaemscribe::API::ResourceManager::loaded_modes.each{ |name,mode|  
    
    next if mode.errors.any?
    
    FileUtils.mkdir_p( dump_directory + "/sources/" + name)
    FileUtils.mkdir_p( dump_directory + "/expecteds/" + name)
  
  
    Dir.glob(directory + "/sources/" + name + "/*") { |fok|
    
      bfname = File.basename(fok)
      prefix = "#{name} : #{bfname} : "
      
      source = "" 
      begin
        File.open( directory + "/sources/" + name + "/" + bfname,"rb:utf-8") { |f| source = f.read}
      rescue Exception
        puts "[    ] " + prefix + "Could not open source file."
        next
      end
    
      File.open( dump_directory + "/sources/"   + name + "/" + bfname,"wb:utf-8") { |fw|    
        fw << source 
      }
    
      File.open( dump_directory + "/expecteds/" + name + "/" + bfname,"wb:utf-8") { |fw|    
        success, teng      = mode.transcribe(source, mode.default_charset)
        fw << teng 
      }
    }  
  }
end

puts "Launching unit tests on the whole sample knowledge base to test if all modes are still ok..."

# Load all modes
Glaemscribe::API::ResourceManager::load_modes

# Print problems if modes have errors
Glaemscribe::API::ResourceManager::loaded_modes.each{ |name,mode|  
  if(mode.errors.any?)
    mode.errors.each{ |e|
      puts "** #{mode.name}:#{e.line}: #{e.text}"
    }
    next
  end
}
 
if ARGV[0] == "--dump" 
  dump_test_directory(SCRIPT_PATH + "/../unit_tests/glaemscrafu", SCRIPT_PATH + "/../unit_tests_dumped/glaemscrafu" )
else
  unit_test_directory(SCRIPT_PATH + "/../unit_tests/glaemscrafu")
end