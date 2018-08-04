#!/usr/bin/env ruby
require 'shellwords'


module GlaemMock
  
  class Char
    attr_accessor :names, :code
  end
  
  class Charset
    attr_reader :mapping, :chars
    
    def initialize(file_path)
      parse(file_path) 
    end
    
    def parse(file_path)
      @mapping = {}
      @chars = []
      File.open(file_path, "rb") { |f|
  
        content = f.read
  
        # Remove comments
        content.gsub!(/\\\*\*(.*?)\*\*\\/m) { |found|
          "\n" * found.count("\n")
        }
  
        content.lines.each{ |l|
  
          l = l.shellsplit
          next if l[0] != "char"
          l.shift
          
          c = Char.new
          c.code = l.shift.hex
          next if l[0] == "?"
          c.names = l
          @chars << c
        }
      }
      touch!
    end
    
    def touch!
      @mapping = {}
      @chars.each { |c|
        c.names.each{|n|
          @mapping[n] = c
        }
      }
    end
    
  end
  
end

def perror(msg)
  STDERR.puts "*** " + msg
end

def modifier_builder(charset_to_move, charset_ref, offset)
  
  # Check that charset_to_move has all keys that belong to charset_ref
  charset_ref.chars.each{ |c|
    res = c.names.map{ |n| charset_to_move.mapping[n] }.compact.uniq
    
    perror "C2M does not have char #{c.names} !!!! "          if res.count == 0
    perror "C2M has multiple chars for char #{c.names} !!!!"  if res.count > 1
  }
  
  charset_to_move.chars.each{ |c|
    res = c.names.map{ |n| charset_ref.mapping[n] }.compact.uniq
    
    perror "Char #{c.names} not found in Ref Charset and will be left off !!!! "          if res.count == 0
    perror "Char #{c.names} found multiple times in Ref Charset !!!!"  if res.count > 1
  }

  charset_to_move.chars.each{ |c|
    res = c.names.map{ |n| charset_ref.mapping[n] }.compact.uniq
    next if res.count == 0
    dst = res[0]
    
    realcode = c.code+offset
    
    next if realcode == dst.code
    
    puts "# Moving #{c.names[0]}"
    puts "M 0x%08X 0x%08X" % [realcode, dst.code]
    puts ""
  }
  
end

c2m     = GlaemMock::Charset.new ARGV[0]
cref    = GlaemMock::Charset.new ARGV[1]
offset  = ARGV[2].hex || 0 

# The offset is here to take into account that the charset may have been offseted before remapping

modifier_builder(c2m,cref,offset)
