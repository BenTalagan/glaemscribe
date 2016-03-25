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
    identity_cross_array.push(i+1);
  
  // Construct the cross array
  var cross_array = null;
  if(cross_schema != null)
  {
    cross_array     = cross_schema.split(",").map(function(i) { return parseInt(i) });
    var ca_count    = cross_array.length;
    
    if(ca_count != sheaf_count)
      sci.errors.push(sheaf_count + " sheaves found in right predicate, but " + ca_count + " elements in cross rule.");  
    
    var sorted = cross_array.slice(0); // clone
    if(!identity_cross_array.equals(sorted.sort()))
      sci.errors.push("Cross rule should contain each element of "+ identity_cross_array + " once and only once.");
  }
  else
  {
    cross_array = identity_cross_array;    
  }  
  
  this.cross_array = cross_array;
}

Glaemscribe.SheafChainIterator.prototype.proto = function()
{
  var sci   = this;
  
  var res   = sci.sizes.slice(0); // clone
  var res2  = sci.sizes.slice(0); // clone
  
  for(var i=0;i<res.length;i++)
    res2[i] = res[sci.cross_array[i]-1];
  
  // Remove all sheaves of size 1 (which are constant)
  res = res2.filter(function(elt) {return elt != 1})
  
  // Create a prototype string
  res = res.join("x");
  
  if(res == "")
    res = "1";
  
  return res;
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
    var realpos = sci.cross_array[pos]-1;
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
