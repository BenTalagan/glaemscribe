#!/usr/bin/env ruby

require 'fileutils'

SCRIPT_PATH     = File.dirname(__FILE__)

Dir.chdir(SCRIPT_PATH)

%x(bsdtar --disable-copyfile -czv -f ../build/glaemscribe_package.tar.gz -C ../glaemresources .)