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

module Glaemscribe
  module API

    class ElvishNumbersPreProcessorOperator < PreProcessorOperator

      def apply(l)
        base    = args[0]
        base    = (base)?(base.to_i):(12)
        
        reverse = args[1]
        reverse = (reverse != nil)?(reverse == "true" || reverse == true):(true) 

        l.gsub(/\d+/) { |f| 
          ret = f.to_i.to_s(base).upcase()
          ret = ret.reverse if(reverse) 
          ret        
        }
      end
      
      ResourceManager::register_pre_processor_class("elvish_numbers", ElvishNumbersPreProcessorOperator)    

    end
  end
end

