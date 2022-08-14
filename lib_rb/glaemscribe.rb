# encoding: UTF-8
#
# Glǽmscribe (also written Glaemscribe) is a software dedicated to
# the transcription of texts between writing systems, and more 
# specifically dedicated to the transcription of J.R.R. Tolkien's 
# invented languages to some of his devised writing systems.
# 
# Copyright (C) 2015 Benjamin Babut (Talagan).
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


# Following tools are in the standard lib
require "shellwords"
require "unicode_utils/downcase"
require "FileUtils" if !defined? FileUtils

module Glaemscribe
  module API
    API_PATH = File.dirname(__FILE__) + "/api/"
    
    require API_PATH + "debug.rb"
    require API_PATH + "constants.rb"
    require API_PATH + "object_additions.rb"
    
    require API_PATH + "fragment.rb"
    require API_PATH + "sheaf_chain_iterator.rb"
    require API_PATH + "sheaf_chain.rb"
    require API_PATH + "sheaf.rb"
  
    require API_PATH + "rule.rb"
    require API_PATH + "sub_rule.rb"
    require API_PATH + "rule_group.rb"
    require API_PATH + "macro.rb"
    
    require API_PATH + "eval.rb"
    require API_PATH + "if_tree.rb"
    
    require API_PATH + "transcription_tree_node.rb"  
    
    require API_PATH + "transcription_pre_post_processor.rb"
    require API_PATH + "transcription_processor.rb"
    
    require API_PATH + "charset.rb"
    require API_PATH + "mode.rb"
    require API_PATH + "option.rb"
    
    require API_PATH + "resource_manager.rb"
    require API_PATH + "glaeml.rb"
    require API_PATH + "glaeml_shellwords.rb"
    require API_PATH + "mode_parser.rb"
    require API_PATH + "charset_parser.rb"
    
    require API_PATH + "pre_processor/elvish_numbers.rb"
    require API_PATH + "pre_processor/downcase.rb"
    require API_PATH + "pre_processor/substitute.rb"
    require API_PATH + "pre_processor/rxsubstitute.rb"
    require API_PATH + "pre_processor/up_down_tehta_split.rb"
    
    require API_PATH + "post_processor/outspace.rb"
    require API_PATH + "post_processor/reverse.rb"
    require API_PATH + "post_processor/resolve_virtuals.rb"
    
    require API_PATH + "tts.rb"
    
  end
end
