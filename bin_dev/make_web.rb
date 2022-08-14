#!/usr/bin/env ruby

require 'fileutils'
require 'escape_utils'
require 'uglifier'

SCRIPT_PATH     = File.dirname(__FILE__)
BUILD_JS_PATH   = "../build/web/glaemscribe/js/"

Dir.chdir(SCRIPT_PATH)

$license      = File.open("../LICENSE.txt","rb:utf-8") { |f| f.read }
$version_info = JSON.parse(File.open("../version","rb:utf-8") { |f| f.read })
$version      = $version_info['version']

JS_FILES = [
  "utils/string_list_to_clean_array.js",
  "utils/string_from_code_point.js",
  "utils/inherits_from.js",
  "utils/array_productize.js",
  "utils/array_equals.js",
  "utils/array_unique.js",
  "utils/glaem_object.js",
  "api.js",
  "api/constants.js",
  "api/resource_manager.js",
  "api/charset.js",
  "api/charset_parser.js",
  "api/glaeml.js",
  "api/glaeml_shellwords.js",
  "api/fragment.js",
  "api/mode.js",
  "api/option.js",
  "api/macro.js",
  "api/mode_parser.js",
  "api/rule.js",
  "api/rule_group.js",
  "api/sub_rule.js",
  "api/sheaf.js",
  "api/sheaf_chain.js",
  "api/sheaf_chain_iterator.js",
  "api/if_tree.js",
  "api/eval.js",
  "api/transcription_tree_node.js",
  "api/transcription_pre_post_processor.js",
  "api/transcription_processor.js",
  "api/pre_processor/downcase.js",
  "api/pre_processor/rxsubstitute.js",
  "api/pre_processor/substitute.js",
  "api/pre_processor/up_down_tehta_split.js",
  "api/pre_processor/elvish_numbers.js",
  "api/post_processor/reverse.js",
  "api/post_processor/resolve_virtuals.js",
  "api/post_processor/outspace.js",
  "extern/object-clone.js",
  "../lib_espeak/glaemscribe_tts.js"
]

def cleanup
  FileUtils.rm_rf Dir.glob(BUILD_JS_PATH + '/modes/*.glaem.js')
  FileUtils.rm_rf Dir.glob(BUILD_JS_PATH + '/charsets/*.cst.js')
  FileUtils.mkdir_p BUILD_JS_PATH + '/modes/'
  FileUtils.mkdir_p BUILD_JS_PATH + '/charsets/'
end

def generate_js_modes
  
  modes = ["../glaemresources/modes/*.glaem"]
  modes += ["../glaemresources/modes/*.glaem.dev"] if ENV['ENV'] == 'dev'
  
  # Read modes, dump them in a JS string
  Dir.glob(modes) { |fmode|
    
    ext = (fmode =~ /\.glaem\.dev$/)?(".glaem.dev"):(".glaem")
    
    fname = File.basename(fmode,ext)
    
    File.open(fmode,"rb:utf-8") { |fin|
      File.open(BUILD_JS_PATH + "/modes/#{fname}.glaem.js","wb:utf-8") { |fjs|
        fjs << "Glaemscribe.resource_manager.raw_modes[\"#{fname}\"] = \"#{EscapeUtils.escape_javascript(fin.read)}\""      
      }
    }
  }
end

def generate_js_charsets
  # Read charsets, dump them in a JS string
  Dir.glob("../glaemresources/charsets/*.cst") { |fc|
    fname = File.basename(fc,".cst")
    File.open(fc,"rb:utf-8") { |fin|
      File.open(BUILD_JS_PATH + "/charsets/#{fname}.cst.js","wb:utf-8") { |fjs|
        fjs << "Glaemscribe.resource_manager.raw_charsets[\"#{fname}\"] = \"#{EscapeUtils.escape_javascript(fin.read)}\""      
      }
    }
  }
end

def build_engine  
  
  File.open(BUILD_JS_PATH + "/glaemscribe.js","wb:utf-8") { |fout|
    fout << "/*\n" + $license + "\nVersion : " + $version + "\n*/\n\n"

    fout << '"use strict";'
    fout << "\n\n"

    JS_FILES.each{ |fname|
      File.open("../lib_js/" + fname,"rb:utf-8") { |fin|
        fout << "/*\n  Adding #{fname} \n*/\n"
        content = fin.read
        if(fname.start_with?("api")) 
          content = content.gsub(/\/\*.*?Copyright.*?\*\//m,"")
        end
        fout << content
        fout << "\n\n"
      }
    }
  }  
end

def build_ugly_min
  File.open(BUILD_JS_PATH + "/glaemscribe.min.js","wb:utf-8") { |f|
    f << "/*\n" + $license + "\nVersion : " + $version + "\n*/\n\n"
    
    full_js  = File.read(BUILD_JS_PATH + "/glaemscribe.js")
    begin
      f << Uglifier.compile(full_js, :comments => :none)
    rescue Uglifier::Error => e
      raise "Could not assemble glaemscribe.js . There's probably a syntax error.\nMessage from uglifier:\n#{e.message}" 
=begin
      if !(e.message =~ /line: ([0-9]+), col: ([0-9]+), pos: ([0-9]+)/)
        raise "Could not assemble glaemscribe.js . I can't retrieve the line number, you should install node js for that."
        raise GlaemJSError  		
      else
        line = $1.to_i
        col  = $2.to_i

        line_content = "...\n"
        full_js.lines.each_with_index { |l,i| 
          if i > line-6 && i < line+4
            bad = (i == line-1)?(" -BAD-> "):("        ")

            line_content += "#{i+1}#{bad}: #{l}"
          end 
        }
        line_content += "...\n"

        raise "Could not assemble glaemscribe.js . There's probably a syntax error.\nMessage from uglifier:\n#{e.message.lines.first}\n#{line_content} "  
      end
=end      
    end
    
  }
end

def copy_tts_engine
  FileUtils.cp("../lib_espeak/espeakng.for.glaemscribe.nowasm.sync.js",BUILD_JS_PATH)
end

cleanup
generate_js_modes
generate_js_charsets
build_engine
build_ugly_min
copy_tts_engine
