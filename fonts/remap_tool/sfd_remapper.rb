#!/usr/bin/env ruby

require "#{__dir__}/sfd_canonical_mapping.rb"
require "shellwords"

module SFD
  REG_CHAR = /StartChar: (.*?)\n(.*?)EndChar/m
  REG_ANCHOR = /AnchorPoint: "(.*)" (.*)\n/ 
  REG_HEADER = /(.*?)StartChar/m
  REG_CHAR_ENCODING = /Encoding: (\-?[0-9]+) (\-?[0-9]+) ([0-9]+)/
  REG_KERN2 = /Kerns2: (.*)/
  
  class Mapping
    attr_accessor :in_font, :in_unicode, :gid
  end
  
  class Kern
    attr_accessor :target, :val, :lookup, :device_table
    
    def dump
      ret = "#{target} #{val} \"#{lookup}\""
      ret += " #{device_table}" if device_table
      ret
    end
  end

  class Char
    attr_accessor :file, :name, :content, :encoding, :kerns
	
    def initialize
      @name 		= ""
      @content 	= ""
    end
  
    def extract_info
      @content =~ REG_CHAR_ENCODING
      @encoding             = SFD::Mapping.new
      @encoding.in_font     = $1.to_i
      @encoding.in_unicode  = $2.to_i
      @encoding.gid         = $3.to_i
      
      if U2N[@encoding.in_font] != @name
        "Strange char with name '#{@name}' different from canonical one '#{U2N[@encoding.in_font]}' "
      end
      
      @kerns = {}
      if @content =~ REG_KERN2
        kern_content = $1
        kern_args = kern_content.shellsplit
        
        while kern_args.length != 0
          new_kern = Kern.new
          new_kern.target   =  kern_args.shift.to_i
          new_kern.val      =  kern_args.shift.to_i
          new_kern.lookup   = kern_args.shift
          if kern_args[0] && kern_args[0].start_with?("{")
            new_kern.device_table = kern_args.shift
          end
          @kerns[new_kern.target] = new_kern
        end        
      end
    end
    
    def dump_kern
      return "" if !@kerns || @kerns.count == 0
              
      "Kerns2: " + @kerns.map{|i,k| "#{k.dump}" }.join(" ")
    end
  
    def dump      
      
      # Update the content.
      @content.gsub! REG_CHAR_ENCODING, "Encoding: #{@encoding.in_font} #{@encoding.in_unicode} #{@encoding.gid}"
      @content.gsub! REG_KERN2, dump_kern
      
      ret =   "StartChar: #{@name}\n"
      ret +=  @content
      ret +=  "EndChar\n\n"
    end
  end

  class File
    attr_accessor :header, :chars, :queuer
    attr_reader :errors
    def initialize
      @header  = ""
      @chars   = []
      @queuer  = ""
    end
    
    def valid?
      lookup = {}
      
      @errors = []
      
      @chars.each{|c|
          lookup[c.encoding.in_font] ||= []
          lookup[c.encoding.in_font] << c
      }
      
      lookup.each{|k,v|
        if v.count > 1
          @errors << "At codepoint %04X : multiple char collision (gids : #{v.map{|c| c.encoding.gid }.join(', ')} )" % k
        end
      }
      return !@errors.any?
    end
    
    def rebuild_lookups
      @codepoint_lookup = {}
      @gid_lookup = {}
      @chars.each{ |c|
        @codepoint_lookup[c.encoding.in_font] = c
        @gid_lookup[c.encoding.gid] = c
      }
    end
    
    def touch!
      rebuild_lookups
    end
    
    def get_char_by_gid(gid)
      @gid_lookup[gid]
    end
    
    def get_char_by_codepoint(codepoint)
      @codepoint_lookup[codepoint]
    end
	
    def dump(file_name)
      if !valid?
        raise "Cannot dump, SFD is not valid! : \n #{@errors.join("\n")}"
      end
      ::File.open(file_name,"wb") { |t|
        t << @header
        @chars.each{ |c|
          t << c.dump
        }
        t << @queuer
      }
    end
    
    def gid_2_uni(gid)
      c = get_char_by_gid(gid)
      return nil if !c
      c.encoding.in_font
    end
    
    def uni_2_gid(unicode_point)
      c = get_char_by_codepoint(unicode_point)
      return nil if !c
      c.encoding.gid
    end
    
    def remap_char(gid, unicode_point)
      c = get_char_by_gid(gid)
      
      raise "Character already present here!!" if get_char_by_codepoint(unicode_point)
      
      c.name = U2N[unicode_point]
      c.encoding.in_font     = unicode_point
      c.encoding.in_unicode  = unicode_point
        
      touch!
    end
    
    def destroy_char(gid)
      cd = get_char_by_gid(gid)
      @chars.delete(cd)      
      # Remove all kernings pointing to this char
      @chars.each{|c|
        if c.kerns[cd.encoding.gid]
          c.kerns.delete cd.encoding.gid
        end
      }
      touch!
    end
    
    def pull_gid
      @chars.map{|c| c.encoding.gid }.max + 1
    end
    
    def copy_char(gid, unicode_point)
      src = get_char_by_gid(gid)
      
      raise "Character already present here!!" if get_char_by_codepoint(unicode_point)
  
      newc          = Char.new
      newc.file     = src.file
      newc.name     = src.name
      newc.content  = src.content
      newc.encoding = src.encoding.clone
      newc.kerns    = src.kerns.clone
      
      newc.name                = U2N[unicode_point]
      newc.encoding.gid        = pull_gid
      newc.encoding.in_unicode = unicode_point
      newc.encoding.in_font    = unicode_point
      
      @chars << newc
      
      touch!
      
      @chars.each { |c| 
        if c.kerns[src.encoding.gid]
          # If a char as a kern pair with the source, create same kern with our created char
          new_kern                  = c.kerns[src.encoding.gid].clone
          new_kern.target           = newc.encoding.gid
          c.kerns[new_kern.target]  = new_kern
        end
      }
    end
        
  end

  class Reader 
    def read(file_path)
      sfdfile		= SFD::File.new
	
      # REALLY DIRTY PARSING!!
      ::File.open(file_path,"rb") { |ff|
        content = ff.read
        content =~ REG_HEADER
        sfdfile.header	= $1
        chars  = content.scan(REG_CHAR) 

        chars.each{ |c| 
          sfdchar 		                = SFD::Char.new
          sfdchar.name	              = c[0].strip # Correct it
          sfdchar.content	            = c[1]
          sfdchar.extract_info
          sfdfile.chars << sfdchar
          sfdchar.file = sfdfile
        }	
        sfdfile.queuer = "EndChars\nEndSplineFont\n"
      }
	    sfdfile.touch!
      sfdfile
    end
  end
end

reader  = SFD::Reader.new
file    = reader.read ARGV[0]

# file.remap_char(28, 130)
file.copy_char(28,130)

file.dump('toto.sfd')
# puts file.pull_gid

# puts file.chars[0].kerns

# file.chars.each{|i,c| puts c.kerns.inspect}


