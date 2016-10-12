Object.defineProperty(Object.prototype, "glaem_each", {
  enumerable: false,
  value:  function (callback) {
    
    for(var o in this)
    {
      if(!this.hasOwnProperty(o))
        continue;
      var res = callback(o,this[o]);
      if(res == false)
        break;
    }
  }   
});

Object.defineProperty(Object.prototype, "glaem_each_reversed", {
  enumerable: false,
  value:  function (callback) {
    if(!this instanceof Array)
      return this.glaem_each(callback);
      
    for(var o = this.length-1;o>=0;o--)
    {
      if(!this.hasOwnProperty(o))
        continue;
      var res = callback(o,this[o]);
      if(res == false)
        break;
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

