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
    
    def self.u2n(point)
      U2N[point] || "uni%x" % point
    end
      
  
    def extract_info
      @content =~ REG_CHAR_ENCODING
      @encoding             = SFD::Mapping.new
      @encoding.in_font     = $1.to_i
      @encoding.in_unicode  = $2.to_i
      @encoding.gid         = $3.to_i
      
      if Char.u2n(@encoding.in_font) != @name
        "Strange char with name '#{@name}' different from canonical one '#{Char.u2n(encoding.in_font)}' "
      end
      
      @kerns = {}
      if @content =~ REG_KERN2
        kern_content = $1
        kern_args = kern_content.shellsplit
        
        while kern_args.length != 0
          new_kern = Kern.new
          new_kern.target   = kern_args.shift.to_i
          new_kern.val      = kern_args.shift.to_i
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
      @content.gsub! /AltUni2: (.*)/, '' # Remove altuni stuff
      
      ret =   "StartChar: #{@name}\n"
      ret +=  @content
      ret +=  "EndChar\n\n"
    end
  end

  class File
    attr_accessor :header, :chars, :queuer
    attr_reader :errors
    def initialize(file_path)
      @header  = ""
      @chars   = []
      @queuer  = ""
      
      read_from_file(file_path)
    end
    
    def read_from_file(file_path)
      # REALLY DIRTY PARSING!!
      ::File.open(file_path,"rb") { |ff|
        content = ff.read
        content =~ REG_HEADER
        @header	= $1
        chars  = content.scan(REG_CHAR) 

        chars.each{ |c| 
          sfdchar 		                = SFD::Char.new
          sfdchar.name	              = c[0].strip # Correct it
          sfdchar.content	            = c[1]
          sfdchar.extract_info
          @chars << sfdchar
          sfdchar.file = self
        }	
        @queuer = "EndChars\nEndSplineFont\n"
      }
      touch!
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
    
    def pull_gid
      @chars.map{|c| c.encoding.gid }.max + 1
    end
    
    def remap_char(gid, unicode_point)
      c = get_char_by_gid(gid)
      
      return false, "A character is already present at destination! If this is really what you want to do, delete it manually." if get_char_by_codepoint(unicode_point)
      
      c.name = Char.u2n(unicode_point)
      c.encoding.in_font     = unicode_point
      c.encoding.in_unicode  = unicode_point
        
      touch!
      
      return true, ''
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

    def copy_char(gid, unicode_point)
      src = get_char_by_gid(gid)
      
      return false, "A character is already present at destination! If this is really what you want to do, delete it manually." if get_char_by_codepoint(unicode_point)
  
      newc          = Char.new
      newc.file     = src.file
      newc.name     = src.name
      newc.content  = src.content
      newc.encoding = src.encoding.clone
      newc.kerns    = src.kerns.clone
      
      newc.name                = Char.u2n(unicode_point)
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
      return true, ''
    end
    
    def remap_block(unicode_point_start, unicode_point_end, new_unicode_point_start)
      shift = new_unicode_point_start - unicode_point_start
      (unicode_point_start..unicode_point_end).each{|p|
        c = get_char_by_codepoint(p)
        next if !c
        ret, msg = remap_char(c.encoding.gid, new_unicode_point_start + p - unicode_point_start)
        if !ret
          return ret, msg
        end
      }
      return true,''
    end
        
  end
  
  
  
  class Modifier
    
    attr_reader :errors
    
    class Directive
      attr_reader :command
      attr_accessor :line
    end
    
    class MoveDirective < Directive
      attr_accessor :src, :dst
      def initialize
        @command = "move"
      end
      def dump
        ":#{line}".ljust(6) + "Moving".ljust(16) + "0x%08X to 0x%08X" % [src,dst]
      end
    end
    
    class CopyDirective < Directive
      attr_accessor :src, :dst
      def initialize
        @command = "copy"
      end
      def dump
        ":#{line}".ljust(6) + "Copying".ljust(16) + "0x%08X to 0x%08X" % [src,dst]
      end
    end
    
    class DeleteDirective < Directive
      attr_accessor :dst
      def initialize
        @command = "del"
      end
      def dump
        ":#{line}".ljust(6) + "Deleting".ljust(16) + "0x%08X" % [dst]
      end
    end
    
    class RemapBlockDirective < Directive
      attr_accessor :start_point, :end_point, :new_start_point
      def initialize
        @command = "remap_block"
      end
      def dump
        ":#{line}".ljust(6) + "Remap block".ljust(16) + "(0x%08X..0x%08X) => (0x%08X..)" % [start_point, end_point, new_start_point, new_start_point+end_point-start_point]
      end
    end
    
    class ExecutePartialDirective < Directive
      attr_accessor :file_path
      def initialize
        @command = "execute_partial"
      end
      def dump
        ":#{line}".ljust(6) + "EX Partial".ljust(16) + file_path
      end
    end    
      
    def initialize(file_path)
      read_from_file(file_path)
    end
    
    def conv_point(point)
      point = point.upcase.strip
      if point.start_with? "0X"
        point = point[2..-1]
        point.hex
      else
        point.to_i
      end
    end
    
    def read_from_file(file_path)
      @directives = []
      @errors     = []
      @file_path  = file_path 
      # REALLY DIRTY PARSING!!
      ::File.open(file_path,"rb") { |ff|
        ff.read.lines.each_with_index { |l,line|
          l = l.strip
          next if l.start_with? "#"
          next if l.empty?
          l = l.split.reject{|w| w.empty?}
          case l[0]
          when 'M' #move
            if l.length != 3
              @errors << "#{line} : Move directive should have 2 params"
              next
            end
            d = MoveDirective.new
            d.src = conv_point l[1]
            d.dst = conv_point l[2] 
          when 'C'
            if l.length != 3
              @errors << "#{line} : Copy directive should have 2 params"
              next
            end        
            d = CopyDirective.new
            d.src = conv_point l[1]
            d.dst = conv_point l[2] 
          when 'D'
            if l.length != 2
              @errors << "#{line} : Delete directive should have 1 params"
              next
            end        
            d = DeleteDirective.new    
            d.dst = conv_point l[1]     
          when 'MB'
            if l.length != 4
              @errors << "#{line} : Remap Block directive should have 3 params"
              next
            end        
            d = RemapBlockDirective.new    
            d.start_point     = conv_point l[1]                 
            d.end_point       = conv_point l[2]          
            d.new_start_point = conv_point l[3]      
          when 'X'
            if l.length != 2
              @errors << "#{line} : Execute Partial directive should have 1 param"
              next
            end
            d = ExecutePartialDirective.new
            d.file_path =  ::File.dirname(@file_path) + "/" + l[1]   
          else
            @errors << "#{line}: Unknown directive."
            next

            
          end
          d.line = line
          @directives << d
        }
      }
    end 
    
    def apply(sfd_file)
      @directives.each{ |d|
        puts d.dump
        res,msg = true, ''
        case d.command
        when "move"
          c = sfd_file.get_char_by_codepoint d.src
          if !c
            perror "Src char not found!!" 
            return false
          end
          res,msg = sfd_file.remap_char(c.encoding.gid, d.dst)
        when "copy"
          c = sfd_file.get_char_by_codepoint d.src
          if !c
            perror "Src char not found!!" 
            return false
          end
          res,msg = sfd_file.copy_char(c.encoding.gid, d.dst)
        when "del"
          c = sfd_file.get_char_by_codepoint d.dst
          if !c
            perror "Target char not found!!" 
            return false
          end
          res,msg = sfd_file.destroy_char(c.encoding.gid)       
        when "remap_block"
          res,msg = sfd_file.remap_block(d.start_point, d.end_point, d.new_start_point)    
        when "execute_partial"
          inner_file = SFD::Modifier.new(d.file_path)
          res = inner_file.apply(sfd_file)
          msg = "Failed to execute partial #{d.file_path} totally" if !res
        else
          raise "WTF"
        end
        
        if !res
          perror msg
          return false
        end
      }
      true
    end
       
  end
end

def perror(msg)
  STDERR.puts "**** " + msg
end

def usage
  puts ""
  puts "sfd_remapper.rb input.sfd modifier.mod output.sfd"
  puts ""
  puts "   Apply remapping directives on a FontForge sfd file."
  puts ""
end
  
def go!
  if ARGV.count != 3
    usage
  else

    file    = SFD::File.new     ARGV[0]
    mod     = SFD::Modifier.new ARGV[1]

    if mod.errors.any?
      perror mod.errors.join("\n")
      return
    end

    res = mod.apply(file)
    if !res
      perror "Failed to reach the end without problems."
      return
    end

    file.dump(ARGV[2])
  end
end

go!
