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
      
      attr_reader   :prototype
  
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
        sheaf_count.times { |i| identity_cross_array << i }  

        # Make a list of iterable sheaves
        iterable_idxs     = []
        prototype_array   = []
        sheaf_chain.sheaves.each_with_index { |sheaf,i| 
          if sheaf.linkable 
            iterable_idxs.push(i) 
            prototype_array.push(sheaf.fragments.count)
          end
        }

        @cross_array = identity_cross_array
        @prototype   = prototype_array.join('x')
        @prototype   = 'CONST'  if @prototype.empty?
 
        # Construct the cross array
        if cross_schema
        
          cross_schema          = cross_schema.split(",").map{ |i| i.to_i - 1 }
              
          # Verify that the number of iterables is equal to the cross schema length
          it_count              = iterable_idxs.count
          ca_count              = cross_schema.count
          @errors << "#{it_count} linkable sheaves found in right predicate, but #{ca_count} elements in cross rule." and return  if ca_count != it_count
          
          # Verify that the cross schema is correct (should be a permutation of the identity)
          it_identity_array = []
          it_count.times { |i| it_identity_array << i }     
          @errors << "Cross rule schema should be a permutation of the identity (it should contain 1,2,..,n numbers once and only once)." and return  if it_identity_array != cross_schema.sort
  
          proto_array_permutted = prototype_array.clone
          
          # Now calculate the cross array
          cross_schema.each_with_index{ |to,from|
            to_permut = iterable_idxs[from]
            permut    = iterable_idxs[to]
            @cross_array[to_permut] = permut
 
            proto_array_permutted[from] = prototype_array[to] 
          }  
          prototype_array = proto_array_permutted
        end  
        
        # Recalculate prototype
        @prototype = prototype_array.join('x')
        @prototype   = 'CONST'  if @prototype.empty?
      end
  
      def iterate
        pos = 0
        while pos < @sizes.count do
          realpos = @cross_array[pos]
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