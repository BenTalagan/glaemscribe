#!/usr/bin/env ruby

require 'fileutils'
require 'escape_utils'
require 'uglifier'

SCRIPT_PATH     = File.dirname(__FILE__)
BUILD_JS_PATH   = "../build/web/glaemscribe/js/"

Dir.chdir(SCRIPT_PATH)

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
  "api/fragment.js",
  "api/mode.js",
  "api/option.js",
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
  "extern/shellwords.js",
]

def cleanup
  FileUtils.rm_rf Dir.glob(BUILD_JS_PATH + '/modes/*.glaem.js')
  FileUtils.rm_rf Dir.glob(BUILD_JS_PATH + '/charsets/*.cst.js')
  FileUtils.mkdir_p BUILD_JS_PATH + '/modes/'
  FileUtils.mkdir_p BUILD_JS_PATH + '/charsets/'
end

def generate_js_modes
  # Read modes, dump them in a JS string
  Dir.glob("../glaemresources/modes/*.glaem") { |fmode|
    fname = File.basename(fmode,".glaem")
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
  license = File.open("../LICENSE.txt","rb:utf-8") { |f| f.read }
  
  File.open(BUILD_JS_PATH + "/glaemscribe.js","wb:utf-8") { |fout|
    fout << "/*\n" + license + "\n*/\n"
    JS_FILES.each{ |fname|
      File.open("../lib_js/" + fname,"rb:utf-8") { |fin|
        fout << "// Adding #{fname} \n\n"
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
    f << Uglifier.new.compile(File.read(BUILD_JS_PATH + "/glaemscribe.js"))
  }
end

cleanup
generate_js_modes
generate_js_charsets
build_engine
build_ugly_min


