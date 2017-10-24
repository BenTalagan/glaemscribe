/*

Glǽmscribe (also written Glaemscribe) is a software dedicated to
the transcription of texts between writing systems, and more 
specifically dedicated to the transcription of J.R.R. Tolkien's 
invented languages to some of his devised writing systems.

Copyright (C) 2015 Benjamin Babut (Talagan).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

Glaemscribe.SheafChainIterator = function (sheaf_chain, cross_schema)
{
  var sci = this;
  
  sci.sheaf_chain = sheaf_chain;
  sci.sizes       = sheaf_chain.sheaves.map(function(sheaf) {  return sheaf.fragments.length });
   
  sci.iterators   = sci.sizes.map(function(elt) { return 0;});
  
  sci.errors      = [];

  var identity_cross_array  = []
  var sheaf_count           = sheaf_chain.sheaves.length;

  // Construct the identity array
  for(var i=0;i<sheaf_count;i++)
    identity_cross_array.push(i);
  
  // Make a list of linkable sheaves
  var iterable_idxs   = [];
  var prototype_array = [];
  sheaf_chain.sheaves.glaem_each(function(i,sheaf) {
    if(sheaf.linkable)
    {
      iterable_idxs.push(i);
      prototype_array.push(sheaf.fragments.length);
    }
  });
    
  sci.cross_array = identity_cross_array;
  sci.proto_attr  = prototype_array.join('x');
  if(sci.proto_attr == '')
    sci.proto_attr = 'CONST';

  // Construct the cross array
  if(cross_schema != null)
  {
    cross_schema    = cross_schema.split(",").map(function(i) { return parseInt(i) - 1 });

    // Verify that the number of iterables is equal to the cross schema length
    var it_count    = iterable_idxs.length;
    var ca_count    = cross_schema.length;
    
    if(ca_count != it_count)
    {
      sci.errors.push(it_count + " linkable sheaves found in right predicate, but " + ca_count + " elements in cross rule."); 
      return; 
    }
    
    // Verify that the cross schema is correct (should be a permutation of the identity)
    var it_identity_array = [];
    for(var i=0;i<it_count;i++)
      it_identity_array.push(i);
    
    var sorted = cross_schema.slice(0).sort(); // clone and sort
    
    if(!it_identity_array.equals(sorted))
    {
      sci.errors.push("Cross rule schema should be a permutation of the identity (it should contain 1,2,..,n numbers once and only once).");
      return;
    }
    
    var prototype_array_permutted = prototype_array.slice(0);
    
    // Now calculate the cross array
    cross_schema.glaem_each(function(from,to) {
      var to_permut = iterable_idxs[from];
      var permut    = iterable_idxs[to];
      sci.cross_array[to_permut] = permut;
      prototype_array_permutted[from] = prototype_array[to];
    });
    prototype_array = prototype_array_permutted;
  }

  sci.proto_attr = prototype_array.join('x');
  if(sci.proto_attr == '')
    sci.proto_attr = 'CONST';
}

// Beware, 'prototype' is a reserved keyword
Glaemscribe.SheafChainIterator.prototype.proto = function() {
  var sci = this;
  return sci.proto_attr;
}

Glaemscribe.SheafChainIterator.prototype.combinations = function()
{
  var sci = this;
  var resolved = [];
  
  for(var i=0;i<sci.iterators.length;i++)
  {
    var counter   = sci.iterators[i];
    var sheaf     = sci.sheaf_chain.sheaves[i];
    
    var fragment  = sheaf.fragments[counter];
    resolved.push(fragment.combinations); 
  }
    
  var res = resolved[0]; 
  for(var i=0;i<resolved.length-1;i++)
  {
    var prod  = res.productize(resolved[i+1]);
    res       = prod.map(function(elt) {
      var e1 = elt[0];
      var e2 = elt[1];
      return e1.concat(e2);
    }); 
  }
  return res;
}

Glaemscribe.SheafChainIterator.prototype.iterate = function()
{
  var sci = this;
  var pos = 0
  
  while(pos < sci.sizes.length)
  {
    var realpos = sci.cross_array[pos];
    sci.iterators[realpos] += 1;
    if(sci.iterators[realpos] >= sci.sizes[realpos])
    {
      sci.iterators[realpos] = 0;
      pos += 1;
    }
    else
      return true;
  }
  
  // Wrapped!
  return false  
}
