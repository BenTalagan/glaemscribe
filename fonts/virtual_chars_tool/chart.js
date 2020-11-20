function dump(char, similars) {
  var res = {} ; 
  
  var classes = DIACRITIC_TABLE[char]['classes'];
  
  $("input:checked[data-master='" + char + "']").each(function(i,elt) { 
 
    var bearer = $(this).data("bearer") ; 
    var val = $(this).val(); 

    if(!res[val]) 
      res[val] = []; 
    
    res[val].push(bearer); 
  });
  
  var ret = "";
  var master_classes = classes;
    
  $.each(similars,function(index, slave_name) {
    
    var slave_char = DIACRITIC_TABLE[slave_name];
    
    ret += "\\beg virtual " + slave_char['names'].join(" ") + "\n";
  
    if(slave_char['reversed'])
      ret += "  \\reversed\n";
    if(slave_char['default'])
      ret += "  \\default " + slave_char['default'] + "\n";
  
    for(var i=0;i < master_classes.length ; i++) 
    {
      var master_class_name = master_classes[i];
      var cname             = DIACRITIC_TABLE[slave_name]['classes'][i];
      
      var list = res[master_class_name] || [];
      ret += "  \\beg class " + cname + "\n    " 
      ret += list.join("\n    ") 
      ret += "\n  \\end\n";
    }
    
    ret += "\\end\n\n";  
    
  });  

  return ret;
}

$(document).ready(function() {
  $(".dumper").each(function(button) {
    $(this).click(function() {
      var b = $(this);
      var ret = "";
      $.each(SIMILARS,function(index,serie) {
        var first = serie[0];
      
        ret += dump(first, serie);
        
      });
      
      $(".dump_zone").text(ret);
      
    })
  })  
})

