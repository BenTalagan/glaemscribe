#!/usr/bin/env ruby

require 'fileutils'
require 'json'

SCRIPT_PATH     = File.dirname(__FILE__)
Dir.chdir(SCRIPT_PATH + "/../glaemresources")

VERSION_INFO  = JSON.parse(File.open("../version","rb:utf-8") { |f| f.read })

%x(rm ../build/pkg/*.tar.gz)
%x(find ./modes/*.glaem ./charsets/*.cst | xargs bsdtar --disable-copyfile -czv -f ../build/pkg/glaemscribe_package_#{VERSION_INFO['version']}.tar.gz)

# %x(find ./modes/*.glaem ./charsets/*.cst | bsdtar --disable-copyfile -czv -f ../build/glaemscribe_package.tar.gz -)