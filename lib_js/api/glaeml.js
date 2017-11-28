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

Glaemscribe.Glaeml = {}

Glaemscribe.Glaeml.Document = function() {
  this.errors     = [];
  this.root_node  = null;
  return this;
}

Glaemscribe.Glaeml.NodeType = {}
Glaemscribe.Glaeml.NodeType.Text = 0
Glaemscribe.Glaeml.NodeType.ElementInline = 1
Glaemscribe.Glaeml.NodeType.ElementBlock = 2

Glaemscribe.Glaeml.Node = function(line, type, name) {
  this.type     = type;
  this.name     = name;
  this.line     = line;
  this.args     = [];
  this.children = [];
  
  return this
}

Glaemscribe.Glaeml.Node.prototype.clone = function() {
    var new_element  = new Glaemscribe.Glaeml.Node(this.line, this.type, this.name);
    // Clone the array of args
    new_element.args = this.args.slice(0); 
    // Clone the children
    this.children.glaem_each(function(child_index, child) {
        new_element.children.push(child.clone());
    });
    return new_element;
}

Glaemscribe.Glaeml.Node.prototype.is_text = function()
{
  return (this.type == Glaemscribe.Glaeml.NodeType.Text);
}

Glaemscribe.Glaeml.Node.prototype.is_element = function()
{
  return (this.type == Glaemscribe.Glaeml.NodeType.ElementInline || 
  this.type == Glaemscribe.Glaeml.NodeType.ElementBlock) ;
}

Glaemscribe.Glaeml.Node.prototype.pathfind_crawl = function(apath, found)
{
  var tnode = this;
  
  for(var i=0; i < tnode.children.length; i++)
  {
    var c = tnode.children[i];

    if(c.name == apath[0])
    {
      if(apath.length == 1)
      {
        found.push(c);
      }
      else
      {
        var bpath = apath.slice(0);
        bpath.shift();
        c.pathfind_crawl(bpath, found)
      }
    }
  }
}

Glaemscribe.Glaeml.Node.prototype.gpath = function(path)
{
  var apath = path.split(".");
  var found     = [];
  this.pathfind_crawl(apath,found);
  return found;
}

Glaemscribe.Glaeml.Error = function(line,text) {
  this.line = line;
  this.text = text;
  return this;
}

Glaemscribe.Glaeml.Parser = function() {}

Glaemscribe.Glaeml.Parser.prototype.add_text_node = function(lnum, text) {
  
  var n         = new Glaemscribe.Glaeml.Node(lnum, Glaemscribe.Glaeml.NodeType.Text, null);
  n.args.push(text);
  n.parent_node = this.current_parent_node     
  this.current_parent_node.children.push(n);   
}

Glaemscribe.Glaeml.Parser.prototype.parse = function(raw_data) {
  raw_data = raw_data.replace(/\r/g,"");
  raw_data = raw_data.replace(/\\\*\*([\s\S]*?)\*\*\\/mg, function(cap) {
    // Keep the good number of lines
    return new Array( (cap.match(/\n/g) || []).length + 1).join("\n");
  }) 
 
  var lnum                    = 0;
  var parser                  = this;
 
  var doc                     = new Glaemscribe.Glaeml.Document;
  doc.root_node               = new Glaemscribe.Glaeml.Node(lnum, Glaemscribe.Glaeml.NodeType.ElementBlock, "root");
  parser.current_parent_node  = doc.root_node;
 
  var lines = raw_data.split("\n")
  for(var i=0;i<lines.length;i++)
  {
    lnum += 1;
    
    var l = lines[i];
    l = l.trim();
    if(l == "")
    {
      parser.add_text_node(lnum, l);
      continue;
    }  
    
    if(l[0] == "\\")
    {
      if(l.length == 1)
      {
        doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Incomplete Node"));
      }
      else
      {
        var rmatch = null;
        
        if(l[1] == "\\") // First backslash is escaped
        {
          parser.add_text_node(lnum, l.substring(1));
        }
        else if(rmatch = l.match(/^(\\beg\s+)/)) 
        {       
          var found = rmatch[0];
          var rest  = l.substring(found.length);
   
          var args  = [];
          var name  = "???";
          
          if( !(rmatch = rest.match(/^([a-z_]+)/)) )
          {
            doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Bad element name."));
          }
          else
          {
            name    = rmatch[0];
            
            try { 
              args    = new Glaemscribe.Glaeml.Shellwords().parse(rest.substring(name.length)); 
            }
            catch(error) {
                doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Error parsing glaeml args (" + error + ")."));
            }
          }
          
          var n         = new Glaemscribe.Glaeml.Node(lnum, Glaemscribe.Glaeml.NodeType.ElementBlock, name);
          n.args        = n.args.concat(args);
          n.parent_node = parser.current_parent_node;
              
          parser.current_parent_node.children.push(n);
          parser.current_parent_node = n;
        }
        else if(rmatch = l.match(/^(\\end(\s|$))/))
        {
          if( !parser.current_parent_node.parent_node )
            doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Element 'end' unexpected."));
          else if( l.substring(rmatch[0].length).trim() != "" )
            doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Element 'end' should not have any argument."));
          else
            parser.current_parent_node = parser.current_parent_node.parent_node;
        }
        else
        {
          // Read the name of the node
          l       = l.substring(1);
          rmatch  = l.match( /^([a-z_]+)/ )   

          if(!rmatch)
            doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Cannot understand element name."));
          else
          {
            var name      = rmatch[0];
            var args      = [];
            
            try           { 
              args    = new Glaemscribe.Glaeml.Shellwords().parse(l.substring(name.length)); 
            }
            catch(error)  { 
              console.log(error.stack)
              doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Error parsing glaeml args (" + error + ").")); 
            }
                                       
            n             = new Glaemscribe.Glaeml.Node(lnum, Glaemscribe.Glaeml.NodeType.ElementInline, name);
            n.args        = n.args.concat(args);
            n.parent_node = parser.current_parent_node;
            
            parser.current_parent_node.children.push(n);
          }   
        }
      }
    }
    else
    {
      parser.add_text_node(lnum, l);
    }
  }
  
  if(parser.current_parent_node != doc.root_node)
    doc.errors.push(new Glaemscribe.Glaeml.Error(lnum, "Missing 'end' element."));
 
  return doc;
}