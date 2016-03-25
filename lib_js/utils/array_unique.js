Object.defineProperty(Array.prototype, "unique", {
  enumerable: false,
  value:  function () {

    var uf = function(value, index, self) { 
      return self.indexOf(value) === index;
    }

    return this.filter(uf);
  }   
});
