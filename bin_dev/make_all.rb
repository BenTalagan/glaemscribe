#!/usr/bin/env ruby

SCRIPT_PATH     = File.dirname(__FILE__)
BUILD_GEM_PATH  = "../build/gem"
Dir.chdir(SCRIPT_PATH)

puts %x(./make_web.rb)
puts %x(./make_gem.rb)
puts %x(./make_npm.rb)
puts %x(./make_mode_pkg.rb)