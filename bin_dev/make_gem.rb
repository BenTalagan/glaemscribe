#!/usr/bin/env ruby

require 'fileutils'
include FileUtils

SCRIPT_PATH     = File.dirname(__FILE__)
BUILD_GEM_PATH  = "../build/gem"

Dir.chdir(SCRIPT_PATH)

def cleanup
  rm_rf Dir.glob(BUILD_GEM_PATH + '/*')
  
  mkdir_p BUILD_GEM_PATH
  mkdir_p BUILD_GEM_PATH + "/bin"  
  mkdir_p BUILD_GEM_PATH + "/lib"  
  mkdir_p BUILD_GEM_PATH + "/glaemresources"  
  mkdir_p BUILD_GEM_PATH + "/glaemresources/modes"  
  mkdir_p BUILD_GEM_PATH + "/glaemresources/charsets"  
  mkdir_p BUILD_GEM_PATH + "/lib_espeak"
end

def copy_files
  # API sourcecode
  cp_r      Dir.glob("../lib_rb/*"),                                  BUILD_GEM_PATH + "/lib"

  # Resources (charsets+modes)
  cp_r      Dir.glob("../glaemresources/modes/*.glaem"),              BUILD_GEM_PATH + "/glaemresources/modes"
  cp_r      Dir.glob("../glaemresources/charsets/*.cst"),             BUILD_GEM_PATH + "/glaemresources/charsets"

  # The TTS library
  cp_r      "../lib_espeak/espeakng.for.glaemscribe.nowasm.sync.js",  BUILD_GEM_PATH + "/lib_espeak"
  cp_r      "../lib_espeak/glaemscribe_tts.js",                       BUILD_GEM_PATH + "/lib_espeak"

  # The executable
  cp_r      "../bin/glaemscribe",                                     BUILD_GEM_PATH + "/bin/" 

  # The GEM specification
  cp_r      "../bin_dev/glaemscribe.gemspec",                         BUILD_GEM_PATH

  # The license
  cp_r      "../LICENSE.txt",                                         BUILD_GEM_PATH
end


def build_gem
  puts %x(gem build glaemscribe.gemspec)
end

def clean_gem
  rm_rf(Dir.glob("*.gemspec"))
  rm_rf("lib")
  rm_rf("bin")
  rm_rf("glaemresources")
  rm_rf("lib_espeak")
  rm_rf("LICENSE.txt")
end

cleanup
copy_files

Dir.chdir(BUILD_GEM_PATH)

build_gem
clean_gem

# ./make_gem.rb; cd ../build/gem ; gem install glaemscribe-1.0.0.gem ; cd ../../bin_dev