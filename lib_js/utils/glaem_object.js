function glaemEach(object, callback) {
  for(var o in object) {
    if(!object.hasOwnProperty(o)) continue;
    if (!callback(o,object[o])) break;
  }
}

function glaemEachReversed(object, callback) {
  if(!Array.isArray(object)) {
    return glaemEach(object, callback);
  }

  for(var o = object.length - 1; o >= 0; o--) {
    if(!object.hasOwnProperty(o)) continue;
    if(!callback(o,object[o])) break;
  }
}
