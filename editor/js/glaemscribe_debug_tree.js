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

// A re-architectured, augmented version of D3 demo by Mike Bostock.
// http://mbostock.github.io/d3/talk/20111018/tree.html

GlaemDebugTree = function(glaem_editor, main_element)
{
  var gt          = this;
 
  gt.glaem_editor = glaem_editor;

  // Set the main element and data
  gt.main_element = main_element;
  gt.data         = gt.build_debug_tree();
  
  // Start by cleaning our receptacle
  gt.ventilateToThe4thCornersOfParisFaçonPuzzle();
  
  gt.i            = 0;
  gt.margin       = {top: 20, right: 120, bottom: 20, left: 390};
  gt.duration     = 750;
  
  gt.recalcSizes();
 
  gt.tree         = d3.layout.tree().size([gt.innerHeight, gt.innerWidth]);
  gt.diagonal     = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
   
  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  gt.zoomListener = d3.behavior.zoom().translate([gt.margin.left,gt.margin.top]).scaleExtent([0.75, 3]).on("zoom", function() {  gt.zoom();} );
  
  gt.svg          = d3.select(main_element.get(0))
    .append("svg")
    .attr("width", gt.svgWidth)
    .attr("height", gt.svgHeight)
    .call(gt.zoomListener);
  
  gt.svg_maing    = gt.svg.append("g")
    .attr("transform", "translate(" + gt.margin.left + "," + gt.margin.top + ")");
   
  
  gt.loadData(gt.data);

  $(window).resize(function() {
    setTimeout(function() { gt.triggerResize(), 0 });
  });  
}


GlaemDebugTree.prototype.processor_tree_node_to_debug_tree_node = function(tree_node)
{
  var editor = this;
  
  var ret = {};
  
  ret['name']         = tree_node.character || "ROOT";
  ret['replacement']  = tree_node.replacement;
  ret['effective']    = tree_node.is_effective();
  ret['path']         = tree_node.path;
  ret['children']     = null;
  
  glaemEach(tree_node.siblings,function(key,sibling) {
    
    if(!ret['children'])
      ret['children'] = [];
    
    ret['children'].push(editor.processor_tree_node_to_debug_tree_node(sibling));
  }); 
  
  return ret;
}

GlaemDebugTree.prototype.build_debug_tree = function()
{
  var editor = this;
  
  return editor.processor_tree_node_to_debug_tree_node(editor.glaem_editor.mode.processor.transcription_tree);
}

GlaemDebugTree.prototype.ventilateToThe4thCornersOfParisFaçonPuzzle = function() {
  var gt = this;
  gt.main_element.html("");
}

GlaemDebugTree.prototype.zoom = function()
{
  var gt = this;
  
  var tr = d3.event.translate;
  
  gt.svg_maing.attr("transform", "translate(" + tr + ")scale(" + d3.event.scale + ")");
}


GlaemDebugTree.prototype.recalcSizes = function()
{ 
  var gt          = this;
    
  gt.innerWidth   = gt.main_element.width()  - gt.margin.right - gt.margin.left;
  gt.innerHeight  = gt.main_element.height() - gt.margin.top   - gt.margin.bottom;
  gt.svgWidth     = gt.main_element.width();
  gt.svgHeight    = gt.main_element.height();
}

GlaemDebugTree.prototype.triggerResize = function()
{
  var gt          = this;
  gt.recalcSizes();
  gt.svg.attr("width",gt.svgWidth).attr("height", gt.svgHeight);
  gt.tree.size([gt.innerHeight,gt.innerWidth])
  gt.update();
}

GlaemDebugTree.prototype.recalcMaxDepth = function(node, md)
{
  var gt = this;
 
  var res = md;
  if(node.children)
  {
    node.children.forEach(function(child) {
      var ret = gt.recalcMaxDepth(child,md+1);
      if(ret > res)
        res = ret;
    });
  }
  return res;
}

GlaemDebugTree.prototype.loadData = function(data)
{
  var gt      = this;
  
  gt.root     = data;
  gt.root.x0  = gt.innerHeight / 2;
  gt.root.y0  = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }
  
  gt.max_depth = gt.recalcMaxDepth(gt.root, 1);
  
  // Collapse at loading? no
  gt.root.children.forEach(collapse);
  gt.update(gt.root);
 /* 

  */
}

GlaemDebugTree.prototype.recursive_highlight = function(node, remaining_path)
{
  var gt = this;
  
  if(remaining_path.length == 0)
    return;
  
  if(node._children)
  {
    // Deploy
    node.children = node._children;
    node._children = null;
    gt.update(node); 
  }  
    
  for(var i=0;i<node.children.length;i++)
  {
    var snode = node.children[i];
    if(snode['name'] == remaining_path[0])  
    {
      // Found!
      snode['highlighted'] = true;
      
      remaining_path = remaining_path.splice(1);
      gt.recursive_highlight(snode,remaining_path)
      return;
    }
  }  
}

GlaemDebugTree.prototype.unhighlight_all_links = function(node)
{
  var gt = this;
  
  node['highlighted'] = null;
  var children = (node.children || node._children || []);
  
  for(var i=0;i<children.length;i++)
    gt.unhighlight_all_links(children[i]);
}

GlaemDebugTree.prototype.highlight_path = function(path) {
  var gt = this;
  var ap = path.split("");
  
  gt.unhighlight_all_links(gt.root);
  gt.recursive_highlight(gt.root,ap);
  gt.update(gt.root);
}

GlaemDebugTree.prototype.installTooltips = function() {
  var gt = this;
  
  $('.tipsified').tipsy({ 
    gravity: 's', 
    html: true, 
    opacity:1.0,
    title: function() {
      
      
      var d = this.__data__;
           
      var token_list = (d.replacement || []).filter(function(n){ return n != "" });
           
      var rep  = token_list.join(" &bull; "); 
      var path = d.path;
      
      var content = "<table>";
      
      content += "<tr>"
      content += "<td>Path</td>";
      content += "<td>" + path + "</td>";
      content += "</tr>";
      
      content += "<tr>"
      content += "<td>Yields</td>";
      if(d.effective)
        content += "<td>" + rep + "</td>";
      else
        content += "<td>Non effective node</td>";
      content += "</tr>";
      
      content += "</table>"
      
         
      if(d.effective)
      {
        var font_name = $("#font_name").val();
        
        var trans = gt.glaem_editor.mode.post_processor.apply(token_list, gt.glaem_editor.charset);
                           
        content += "<div class='tip_trans' style='font-family:" + font_name + "'>" + trans + "</div>";
      }

      content += "</tr>";
            
      return content; //d.replacement.join(" "); 
    }
  });
}

GlaemDebugTree.prototype.update = function(source) {

  var gt = this;
   
  // Compute the new tree layout.
  var nodes = gt.tree.nodes(gt.root).reverse();
  var links = gt.tree.links(nodes);
  
  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    gt.update(d);
  }

  // For horizontal spacing
  var intervals   = gt.max_depth - 1;
  var spacing     = gt.innerWidth / intervals; 

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * spacing; });

  // Update the nodes…
  var node = gt.svg_maing.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++gt.i); });
    
  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .on("click", click);

  var emptycolor = "black";
  var fullcolor  = "rgb(105, 188, 226)"  

  nodeEnter.append("circle")
    .attr("visibility","hidden")
    .filter(function(d) { return d.effective;})
    .classed("tipsified",true)
    .attr("r", 1e-6)
    .style("fill", function(d) { return d._children ? fullcolor : emptycolor; });
    
  nodeEnter.append("rect")
    .attr("visibility","hidden")
    .filter(function(d) {return !d.effective;})
    .classed("tipsified",true)
    .attr("width", 1e-6)
    .attr("height", 1e-6)
    .style("fill", function(d) { return d._children ? fullcolor : emptycolor; });
    
  nodeEnter.append("text")
    .attr("x", function(d) { return d.children || d._children ? -10 : 10; } )
    .attr("dy", "0.35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);
      
  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(gt.duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
    .filter(function(d) {return d.effective;})
    .attr("r", 4.5)
    .attr("visibility","visible")
    .style("fill", function(d) { return d._children ? fullcolor : emptycolor; });

  nodeUpdate.select("rect")
    .filter(function(d) {return !d.effective;})
    .attr("x",-4.5)
    .attr("y",-4.5)
    .attr("width", 9)
    .attr("height", 9)
    .attr("visibility","visible")
    .style("fill", function(d) { return d._children ? fullcolor : emptycolor; }); 

  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(gt.duration)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // Update the links…
  var link = gt.svg_maing.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return gt.diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link.transition()
    .duration(gt.duration)
    .attr("d", gt.diagonal)
    .style("stroke", function(d) {return (d.target["highlighted"])?("red"):("")} );

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(gt.duration)
    .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return gt.diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
   
  // Let the tree being refreshed for firefox
  setTimeout(function() { gt.installTooltips();}, 1000);

}