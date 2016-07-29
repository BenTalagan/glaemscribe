#!/usr/bin/env ruby

require 'fileutils'

SCRIPT_PATH     = File.dirname(__FILE__)

Dir.chdir(SCRIPT_PATH + "/../glaemresources")

%x(find ./modes/*.glaem ./charsets/*.cst | xargs bsdtar --disable-copyfile -czv -f ../build/glaemscribe_package.tar.gz)

# %x(find ./modes/*.glaem ./charsets/*.cst | bsdtar --disable-copyfile -czv -f ../build/glaemscribe_package.tar.gz -)