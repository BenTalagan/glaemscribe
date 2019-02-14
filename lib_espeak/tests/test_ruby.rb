#!/usr/bin/env ruby
require "mini_racer"

require File.dirname(__FILE__) + "/../../lib_rb/glaemscribe.rb"

puts Glaemscribe::API::TTS.ipa("Hi, my name is toto!","en",false)
puts Glaemscribe::API::TTS.ipa("Hi, my \n name \"is\" toto!","en",false)
puts Glaemscribe::API::TTS.ipa("In a hole in the ground, there lived a hobbit.","en",false)

puts Glaemscribe::API::TTS.ipa("Hi, my name is toto! " * 1000,"en",false)