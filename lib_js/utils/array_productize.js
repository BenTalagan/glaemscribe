Object.defineProperty(Array.prototype, "productize", {
  enumerable: false,
  value: function(other_array) {
    var array = this;
    var res   = new Array(array.length * other_array.length);
  
    for(var i=0;i<array.length;i++)
    {
      for(var j=0;j<other_array.length;j++)
      {
        res[i*other_array.length+j] = [array[i],other_array[j]];
      }
    }
    return res;
  }
});