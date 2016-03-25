Object.defineProperty(Object.prototype, "glaem_each", {
  enumerable: false,
  value:  function (callback) {
    
    for(var o in this)
    {
      if(!this.hasOwnProperty(o))
        continue;
      callback(o,this[o]);
    }
  }   
});

Object.defineProperty(Object.prototype, "glaem_merge", {
  enumerable: false,
  value:  function (other_object) {
    
    var ret = {};
    for(var o in this)
    {
      if(!this.hasOwnProperty(o))
        continue;      
      ret[o] = this[o];
    }    
    
    for(var o in other_object)
    {
      if(!other_object.hasOwnProperty(o))
        continue;
      ret[o] = other_object[o];
    }
    
    return ret;
  }   
});

