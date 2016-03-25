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

Glaemscribe.Fragment = function(sheaf, expression) {
  
  var fragment = this;
  
  fragment.sheaf        = sheaf;
  fragment.mode         = sheaf.mode;
  fragment.rule         = sheaf.rule;
  fragment.expression   = expression;

  fragment.equivalences = stringListToCleanArray(fragment.expression, Glaemscribe.Fragment.EQUIVALENCE_RX_OUT);
  fragment.equivalences = fragment.equivalences.map(function(eq_exp) {
    var eq  = eq_exp;
    var exp = Glaemscribe.Fragment.EQUIVALENCE_RX_IN.exec(eq_exp);  

    if(exp)
    {
      eq = exp[1]; 
      eq = eq.split(Glaemscribe.Fragment.EQUIVALENCE_SEPARATOR).map(function(elt) {
        elt = elt.trim();
        if(elt == "")
        {
          fragment.rule.errors.push("Null members are not allowed in equivalences!");
          return;
        }
        return elt.split(/\s/);
      });      
    }
    else
    {
      eq = [eq_exp.split(/\s/)];
    }
    return eq;
  });
  
  if(fragment.equivalences.length == 0)
    fragment.equivalences = [[[""]]];

  // Verify all symbols used are known in all charsets
  if(fragment.is_dst())
  {
    var mode = fragment.sheaf.mode;   
    for(var i=0;i<fragment.equivalences.length;i++)
    {
      var eq = fragment.equivalences[i];
      for(var j=0;j<eq.length;j++)
      {
        var member = eq[j];
        for(var k=0;k<member.length;k++)
        {
          var token = member[k];
          if(token == "") // Case of NULL
            continue;
           
          for(var charset_name in mode.supported_charsets)
          {           
            var charset     = mode.supported_charsets[charset_name];
            var symbol      = charset.n2c(token);
            if(symbol == null)
            {
               fragment.rule.errors.push("Symbol '" + token + "' not found in charset '"+ charset.name + "'!");   
               return;  
            }      
          }
        }
      }
    }
  }
  
  // Calculate all combinations
  var res = fragment.equivalences[0];
 
  for(var i=0;i<fragment.equivalences.length-1;i++)
  {
    var prod = res.productize(fragment.equivalences[i+1]);
    res = prod.map(function(elt) {
  
      var x = elt[0];
      var y = elt[1];
  
      return x.concat(y);
    });
    
  }
  fragment.combinations = res; 
}

Glaemscribe.Fragment.EQUIVALENCE_SEPARATOR = ","
Glaemscribe.Fragment.EQUIVALENCE_RX_OUT    = /(\(.*?\))/
Glaemscribe.Fragment.EQUIVALENCE_RX_IN     = /\((.*?)\)/

Glaemscribe.Fragment.prototype.is_src = function() {  return this.sheaf.is_src(); };
Glaemscribe.Fragment.prototype.is_dst = function() {  return this.sheaf.is_dst(); };
