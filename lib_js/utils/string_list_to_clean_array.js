function stringListToCleanArray(str,separator)
{
  return str.split(separator)
      .map(function(elt) { return elt.trim() })
      .filter(function(n){ return n != "" }); ;
}

