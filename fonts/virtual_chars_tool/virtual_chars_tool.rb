#!/usr/bin/env ruby

require "rubygems"
require "JSON"
require "ERB"
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8

SCRIPT_PATH = File.dirname(__FILE__)
Dir.chdir(File.expand_path(File.dirname(__FILE__)))

require SCRIPT_PATH + "/../../lib_rb/glaemscribe.rb"

def open_template(template_file,varname)
  begin
    File.open(template_file,"rb:UTF-8") { |f|
      return ERB.new(f.read,nil,nil,varname)
    }
  rescue Exception => e
    raise "Could not open template file #{template_file} (#{e.message})"
  end
end


@template = open_template("virtual_chars_tool_template.html.erb","layout")

Glaemscribe::API::Debug.enabled = false

require "./tengwar.rb"
require "./cirth.rb"


def dump_charset_edit_page(charset, font_list, conf)
  
  puts "Dumping charset #{charset.name} : "
  
  File.open("#{charset.name}.html","wb") { |f|
    f << @template.result(binding)
  }
end


Glaemscribe::API::ResourceManager.load_charsets([
  "tengwar_ds_sindarin",
  "tengwar_ds_eldamar",
  "tengwar_ds_annatar",
  "tengwar_ds_parmaite", 
  "tengwar_ds_elfica",
  "tengwar_guni_sindarin",
  "tengwar_guni_eldamar",
  "tengwar_guni_annatar",
  "tengwar_guni_parmaite", 
  "tengwar_guni_elfica"
])

Glaemscribe::API::ResourceManager.load_charsets([
  "cirth_ds"
])

dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_sindarin"],["Tengwar Sindarin Glaemscrafu"], TENGWAR_DS_GENERIC_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_parmaite"],["Tengwar Parmaite Glaemscrafu"], TENGWAR_DS_GENERIC_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_eldamar"], ["Tengwar Eldamar Glaemscrafu"], TENGWAR_DS_GENERIC_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_annatar"], ["TengwarAnnatarGlaemscrafu"], TENGWAR_ANNATAR_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_elfica"], ["Tengwar Elfica Glaemscrafu"], TENGWAR_DS_GENERIC_CONF)

dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_guni_sindarin"],["TengwarSindarinGlaemUnicode"], TENGWAR_DS_GENERIC_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_guni_parmaite"],["TengwarParmaiteGlaemUnicode"], TENGWAR_DS_GENERIC_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_guni_eldamar"], ["TengwarEldamarGlaemUnicode"], TENGWAR_DS_GENERIC_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_guni_annatar"], ["TengwarAnnatarGlaemUnicode"], TENGWAR_ANNATAR_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_guni_elfica"],  ["TengwarElficaGlaemUnicode"], TENGWAR_DS_GENERIC_CONF)

dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["cirth_ds"], ["Cirth Erebor"], CIRTH_DS_GENERIC_CONF)
