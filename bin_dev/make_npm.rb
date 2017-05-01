#!/usr/bin/env ruby

require 'fileutils'
require 'json'
include FileUtils

SCRIPT_PATH     = File.dirname(__FILE__)
BUILD_NPM_PATH  = "../build/npm"
Dir.chdir(SCRIPT_PATH)
VERSION_INFO  = JSON.parse(File.open("../version","rb:utf-8") { |f| f.read })

def cleanup
  rm_rf Dir.glob(BUILD_NPM_PATH + '/*')
  
  mkdir_p BUILD_NPM_PATH
end

def copy_files
  cp_r      Dir.glob("../build/web/glaemscribe/*"),           BUILD_NPM_PATH
  cp_r      "../LICENSE.txt",            BUILD_NPM_PATH
end

def copy_pkg_json
  File.open("package.json","rb:utf-8") { |pkj|
    json = JSON.parse(pkj.read)
    json['version'] = VERSION_INFO['version']
    File.open(BUILD_NPM_PATH + "/package.json","wb:utf-8") { |f| f << JSON.pretty_generate(json) }
  }
end

def build_npm_pkg
  %x(npm pack)
end

def clean_npm_pkg
  rm_rf("js")
  rm_rf("package.json")
  rm_rf("LICENSE.txt")
end

cleanup
copy_files
copy_pkg_json

Dir.chdir(BUILD_NPM_PATH)

build_npm_pkg
clean_npm_pkg

