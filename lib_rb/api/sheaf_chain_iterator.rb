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
    class SheafChainIterator
  
      attr_accessor :sheaf_chain
      attr_accessor :cross_map
      attr_accessor :errors
  
      # If a cross schema is passed, the prototype of the chain will be permutated
      def initialize(sheaf_chain, cross_schema = nil)
        @sheaf_chain            = sheaf_chain
        # Sizes contains the number of fragments/sheaf
        @sizes                  = sheaf_chain.sheaves.map { |sheaf| sheaf.fragments.count }
        # An array of counters, one for each sheaf, to increment on fragments
        @iterators              = Array.new(@sizes.count,0)
    
        @errors                 = []
    
        # Construct the identity array
        identity_cross_array    = []
        sheaf_count             = sheaf_chain.sheaves.count
        sheaf_count.times{|i| identity_cross_array << i+1}  

        # Construct the cross array
        if cross_schema
          @cross_array          = cross_schema.split(",").map{ |i| i.to_i }
          ca_count              = @cross_array.count
          @errors << "#{sheaf_count} sheafs found in right predicate, but #{ca_count} elements in cross rule."  if ca_count != sheaf_count  
          @errors << "Cross rule should contain each element of #{identity_cross_array} once and only once."    if identity_cross_array != @cross_array.sort
        else
          @cross_array = identity_cross_array
        end    
      end
  
      # Calculate the prototype of the chain
      def prototype
        res   = @sizes.clone
        res2  = @sizes.clone 
        
        res.count.times{ |i| res2[i] = res[@cross_array[i]-1] }
        res   = res2
    
        # Remove all sheaves of size 1 (which are constant)
        res.delete(1)
        
        # Create a prototype string
        res = res.join("x")
        res = "1" if res.empty?
        res
      end
  
      def iterate
        pos = 0
        while pos < @sizes.count do
          realpos = @cross_array[pos]-1
          @iterators[realpos] += 1
          if @iterators[realpos] >= @sizes[realpos]
            @iterators[realpos] = 0
            pos += 1
          else
            return true
          end
        end
        # Wrapped!
        return false
      end
  
      # Calculate all cominations for the chain
      def combinations
        resolved = []
        @iterators.each_with_index{ |counter, index|
          sheaf     = sheaf_chain.sheaves[index]
          fragment  = sheaf.fragments[counter]
          
          resolved << fragment.combinations
        }
        res = resolved[0]
        (resolved.count-1).times { |i|
          res = res.product(resolved[i+1]).map{|e1,e2| e1+e2} 
        }
        res
      end
  
    end
  end
end