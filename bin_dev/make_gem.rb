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
end

def copy_files
  cp_r      Dir.glob("../lib_rb/*"),           BUILD_GEM_PATH + "/lib"
  cp_r      Dir.glob("../glaemresources/*"),   BUILD_GEM_PATH + "/glaemresources"
  cp_r      "../bin_dev/glaemscribe.gemspec",  BUILD_GEM_PATH
  cp_r      "../bin/glaemscribe",              BUILD_GEM_PATH + "/bin/" 
  cp_r      "../LICENSE.txt",                  BUILD_GEM_PATH
end


def build_gem
  puts %x(gem build glaemscribe.gemspec)
end

def clean_gem
  rm_rf(Dir.glob("*.gemspec"))
  rm_rf("lib")
  rm_rf("bin")
  rm_rf("glaemresources")
  rm_rf("LICENSE.txt")
end

cleanup
copy_files

Dir.chdir(BUILD_GEM_PATH)

build_gem
clean_gem

# ./make_gem.rb; cd ../build/gem ; gem install glaemscribe-1.0.0.gem ; cd ../../bin_dev