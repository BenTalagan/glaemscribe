#!/usr/bin/env ruby

SCRIPT_PATH     = File.dirname(__FILE__)
BUILD_GEM_PATH  = "../build/gem"
Dir.chdir(SCRIPT_PATH)

%x(./make_web.rb)
%x(./make_gem.rb)
%x(./make_npm.rb)
%x(./make_mode_pkg.rb)