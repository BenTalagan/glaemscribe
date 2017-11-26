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
    class Mode
      
      attr_accessor :errors
      attr_accessor :warnings
      
      attr_accessor :name
      
      attr_accessor :language, :writing, :human_name, :authors, :version 
      attr_accessor :pre_processor, :processor, :post_processor
      
      attr_accessor :options
      
      attr_accessor :supported_charsets
      attr_accessor :default_charset
      
      attr_accessor :raw_mode_name # Read from glaeml
      
      attr_accessor :world, :invention
      
      attr_reader   :latest_option_values
         
      def initialize(name)
        @name               = name
        @errors             = []
        @warnings           = []
        @supported_charsets = {}
        @options            = {}
        @last_raw_options   = nil
       
        @pre_processor    = TranscriptionPreProcessor.new(self)
        @processor        = TranscriptionProcessor.new(self)
        @post_processor   = TranscriptionPostProcessor.new(self)
      end
      
      def to_s
        " <Mode #{name}: Language '#{language}', Writing '#{writing}', Human Name '#{human_name}', Authors '#{authors}', Version '#{version}'> "
      end
      
      def inspect
        to_s
      end
      
      def finalize(options={})
              
        if options == @last_raw_options
          # Small optimization : don't refinalize if options are the same as before
          return
        end      
              
        @last_raw_options = options      
              
        # Hash: option_name => value_name
        trans_options = {}
        
        # Build default options
        @options.each { |oname, o|
          trans_options[oname] = o.default_value_name
        }   

        # Push user options
        options.each { |oname, valname|
          # Check if option exists
          opt = @options[oname]
          next if(!opt)
            
          val = opt.value_for_value_name(valname)
          next if val == nil
            
          trans_options[oname] = valname
        }
    
        trans_options_converted = {}

        # Do a conversion to values space
        trans_options.each{ |oname,valname| 
          trans_options_converted[oname] = @options[oname].value_for_value_name(valname)
        }

        # Add the option defined constants to the whole list for evaluation purposes
        @options.each { |oname, o|
          # For enums, add the values as constants for the evaluator
          if(o.type == Option::Type::ENUM)
            o.values.each{ |name, val|
              trans_options_converted[name] = val
            }
          end
        }   
        
        @latest_option_values = trans_options_converted
           
        @pre_processor.finalize(@latest_option_values)
        @post_processor.finalize(@latest_option_values)
        @processor.finalize(@latest_option_values)
    
        raw_mode.finalize options if raw_mode
          
        self
      end
      
      def raw_mode
        return @raw_mode if @raw_mode
        loaded_raw_mode = (@raw_mode_name && Glaemscribe::API::ResourceManager.loaded_modes[@raw_mode_name])    
        return nil if !loaded_raw_mode
        @raw_mode = loaded_raw_mode.deep_clone
      end
      
      def replace_specials(l)
        l.
          gsub("_",SPECIAL_CHAR_UNDERSCORE).
          gsub("\u00a0",SPECIAL_CHAR_NBSP)
      end
      
      def strict_transcribe(content, charset = nil)
        charset = default_charset if !charset
        return false, "*** No charset usable for transcription. Failed!" if !charset
  
        # Parser works line by line
        ret = content.lines.map{ |l| 
          restore_lf = false
          if l[-1] == "\n"
            l[-1] = "" 
            restore_lf = true
          end
          l = @pre_processor.apply(l)
          l = replace_specials(l)
          l = @processor.apply(l)
          l = @post_processor.apply(l, charset)
          l += "\n" if restore_lf
          l
        }.join
        return true, ret
      end
      
      def transcribe(content, charset = nil)
        if raw_mode
          chunks = content.split(/({{.*?}})/m)
          ret = ''
          res = true
          chunks.each{ |c|
            if c =~ /{{(.*?)}}/m
              succ, r = raw_mode.strict_transcribe($1,charset)
              res = res && succ
              ret += r if succ
            else
              succ, r = strict_transcribe(c,charset)
              res = res && succ
              ret += r if succ
            end
          }
          return res,ret
        else
          strict_transcribe(content,charset)
        end
      end
      
    end
  end
end