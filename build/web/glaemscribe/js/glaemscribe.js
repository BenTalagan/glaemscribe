/*
Glǽmscribe (also written Glaemscribe) is a software dedicated to
the transcription of texts between writing systems, and more 
specifically dedicated to the transcription of J.R.R. Tolkien's 
invented languages to some of his devised writing systems.

Copyright (C) 2017 Benjamin Babut (Talagan).

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

Version : 1.2.1
*/

"use strict";

/*
  Adding utils/string_list_to_clean_array.js 
*/
function stringListToCleanArray(str,separator)
{
  return str.split(separator)
      .map(function(elt) { return elt.trim() })
      .filter(function(n){ return n != "" }); ;
}



/*
  Adding utils/string_from_code_point.js 
*/
/*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
if (!String.fromCodePoint) {
  (function() {
    var defineProperty = (function() {
      // IE 8 only supports `Object.defineProperty` on DOM elements
      try {
        var object = {};
        var $defineProperty = Object.defineProperty;
        var result = $defineProperty(object, object, object) && $defineProperty;
      } catch(error) {}
      return result;
    }());
    var stringFromCharCode = String.fromCharCode;
    var floor = Math.floor;
    var fromCodePoint = function() {
      var MAX_SIZE = 0x4000;
      var codeUnits = [];
      var highSurrogate;
      var lowSurrogate;
      var index = -1;
      var length = arguments.length;
      if (!length) {
        return '';
      }
      var result = '';
      while (++index < length) {
        var codePoint = Number(arguments[index]);
        if (
          !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
          codePoint < 0 ||              // not a valid Unicode code point
          codePoint > 0x10FFFF ||       // not a valid Unicode code point
          floor(codePoint) != codePoint // not an integer
        ) {
          throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) { // BMP code point
          codeUnits.push(codePoint);
        } else { // Astral code point; split in surrogate halves
          // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          codePoint -= 0x10000;
          highSurrogate = (codePoint >> 10) + 0xD800;
          lowSurrogate = (codePoint % 0x400) + 0xDC00;
          codeUnits.push(highSurrogate, lowSurrogate);
        }
        if (index + 1 == length || codeUnits.length > MAX_SIZE) {
          result += stringFromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }
      }
      return result;
    };
    if (defineProperty) {
      defineProperty(String, 'fromCodePoint', {
        'value': fromCodePoint,
        'configurable': true,
        'writable': true
      });
    } else {
      String.fromCodePoint = fromCodePoint;
    }
  }());
}

/*
  Adding utils/inherits_from.js 
*/
// Thank you mozilla! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
} 


/*
  Adding utils/array_productize.js 
*/
function productizeArray(array1, array2) {
	var result = new Array(array1.length * array2.length);

	for (var i = 0; i < array1.length; i++) {
		for (var j = 0; j < array2.length; j++) {
			result[i * array2.length + j] = [array1[i], array2[j]];
		}
	}

	return result;
}


/*
  Adding utils/array_equals.js 
*/
function arrayEquals(array1, array2) {
	if (!array2) {
		return false;
	}

	if (array1.length != array2.length) {
		return false;
	}

	for (var i = 0, l=array1.length; i < l; i++) {
		if (Array.isArray(array1[i]) && Array.isArray(array2[i])) {
			if (!arrayEquals(array1[i], array2[i])) {
				return false;
			}
		} else if (array1[i] != array2[i]) {
			return false;
		}
	}

	return true;
}


/*
  Adding utils/array_unique.js 
*/
function uniqueArray(array) {
  return array.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
}


/*
  Adding utils/glaem_object.js 
*/
function glaemEach(object, callback) {
	for(var o in object) {
		if(!object.hasOwnProperty(o)) continue;

		var res = callback(o, object[o])
		if (res == false) break;
	}
}

function glaemEachReversed(object, callback) {
	if(!Array.isArray(object)) {
		return glaemEach(object, callback);
	}

	for(var o = object.length - 1; o >= 0; o--) {
		if(!object.hasOwnProperty(o)) continue;

		var res = callback(o, object[o])
		if (res == false) break;
	}
}


/*
  Adding api.js 
*/


var Glaemscribe           = {};



/*
  Adding api/constants.js 
*/


Glaemscribe.WORD_BREAKER        = "|";

Glaemscribe.WORD_BOUNDARY_LANG  = "_"
Glaemscribe.WORD_BOUNDARY_TREE  = "\u0000"

Glaemscribe.UNKNOWN_CHAR_OUTPUT = "☠"      
Glaemscribe.VIRTUAL_CHAR_OUTPUT = "☢" 


/*
  Adding api/resource_manager.js 
*/


Glaemscribe.ResourceManager = function() {  
  this.raw_modes                    = {}; // name is misleading it clashes with raw mode. TODO : refactor? Maybe not it could break the js loading
  this.raw_charsets                 = {};
  this.loaded_modes                     = {};
  this.loaded_charsets                  = {};
  this.pre_processor_operator_classes   = {};
  this.post_processor_operator_classes  = {};
  return this;
}

Glaemscribe.ResourceManager.prototype.load_charsets = function(charset_list) {
  
  // Load all charsets if null is passed
  if(charset_list == null)
     charset_list = Object.keys(this.raw_charsets);
  
  // If passed a name, wrap into an array
  if(typeof charset_list === 'string' || charset_list instanceof String)
    charset_list = [charset_list];
     
  for(var i=0;i<charset_list.length;i++)
  {
    var charset_name = charset_list[i];
    
    // Don't load a charset twice
    if(this.loaded_charsets[charset_name])
      continue;
       
    // Cannot load a charset that does not exist
    if(!this.raw_charsets[charset_name])
      continue;
       
    var cp      = new Glaemscribe.CharsetParser();
    var charset = cp.parse(charset_name);
    
    if(charset)
      this.loaded_charsets[charset_name] = charset;
  }
}

Glaemscribe.ResourceManager.prototype.load_modes = function(mode_list) {
 
  // Load all modes if null is passed
  if(mode_list == null)
     mode_list = Object.keys(this.raw_modes);
  
  // If passed a name, wrap into an array
  if(typeof mode_list === 'string' || mode_list instanceof String)
    mode_list = [mode_list];
    
  for(var i=0;i<mode_list.length;i++)
  {
    var mode_name = mode_list[i];
    
    // Don't load a charset twice
    if(this.loaded_modes[mode_name])
      continue;
       
    // Cannot load a charset that does not exist
    if(!this.raw_modes[mode_name])
      continue;
       
    var mp      = new Glaemscribe.ModeParser();
    var mode    = mp.parse(mode_name);
    
    if(mode)
      this.loaded_modes[mode_name] = mode;
  }
}

Glaemscribe.ResourceManager.prototype.register_pre_processor_class = function(operator_name, operator_class)
{
  this.pre_processor_operator_classes[operator_name] = operator_class;  
}

Glaemscribe.ResourceManager.prototype.register_post_processor_class = function(operator_name, operator_class)
{
  this.post_processor_operator_classes[operator_name] = operator_class;
}

Glaemscribe.ResourceManager.prototype.class_for_pre_processor_operator_name = function(operator_name)
{
  return this.pre_processor_operator_classes[operator_name]; 
}

Glaemscribe.ResourceManager.prototype.class_for_post_processor_operator_name = function(operator_name)
{
  return this.post_processor_operator_classes[operator_name]  
}

Glaemscribe.resource_manager = new Glaemscribe.ResourceManager();



/*
  Adding api/charset.js 
*/


Glaemscribe.Char = function()
{
  return this;
}

Glaemscribe.Char.prototype.is_virtual = function()
{
  return false;
}

Glaemscribe.Char.prototype.is_sequence = function()
{
  return false;
}

Glaemscribe.Char.prototype.output = function()
{
  return this.str;
}

// ======================

Glaemscribe.VirtualChar = function()
{
  this.classes      = [];
  this.lookup_table = {};
  this.reversed     = false;
  this.default      = null;
  return this;
}

Glaemscribe.VirtualChar.VirtualClass = function()
{
  this.target   = '';
  this.triggers = [];
}

Glaemscribe.VirtualChar.prototype.is_virtual = function()
{
  return true;
}

Glaemscribe.VirtualChar.prototype.is_sequence = function()
{
  return false;
}

Glaemscribe.VirtualChar.prototype.output = function()
{
  var vc = this;
  if(vc.default)
    return vc.charset.n2c(vc.default).output();
  else
    return Glaemscribe.VIRTUAL_CHAR_OUTPUT;
}

Glaemscribe.VirtualChar.prototype.finalize = function()
{
  var vc = this;
  
  vc.lookup_table = {};
  glaemEach(vc.classes, function(_, vclass) {
    var result_char   = vclass.target;
    var trigger_chars = vclass.triggers;
    
    glaemEach(trigger_chars, function(_,trigger_char) {
      var found = vc.lookup_table[trigger_char];
      if(found != null)
      {
        vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Trigger char " + trigger_char + "found twice in virtual char."));
      }
      else
      {
        var rc = vc.charset.n2c(result_char);
        var tc = vc.charset.n2c(trigger_char);
        
        if(rc == null) {
          vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Trigger char " + trigger_char + " points to unknown result char " + result_char + "."));
        }
        else if(tc == null) {
          vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Unknown trigger char " + trigger_char + "."));
        }
        else if(rc instanceof Glaemscribe.VirtualChar) {
          vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Trigger char " + trigger_char + " points to another virtual char " + result_char + ". This is not supported!"));          
        }
        else {
          glaemEach(tc.names, function(_,trigger_char_name) {
            vc.lookup_table[trigger_char_name] = rc;
          });
        }
      }
    });
  });
  if(vc.default)
  {
    var c = vc.charset.lookup_table[vc.default];
    if(!c)
      vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Default char "+ vc.default + " does not match any real character in the charset."));
    else if(c.is_virtual())
      vc.charset.errors.push(new Glaemscribe.Glaeml.Error(vc.line, "Default char "+ vc.default + " is virtual, it should be real only."));
  }
}

Glaemscribe.VirtualChar.prototype.n2c = function(trigger_char_name) {
  return this.lookup_table[trigger_char_name];
}

// =======================

Glaemscribe.SequenceChar = function()
{
  this.sequence = [];
  return this;
}

Glaemscribe.SequenceChar.prototype.is_virtual = function()
{
  return false;
}

Glaemscribe.SequenceChar.prototype.is_sequence = function()
{
  return true;
}

Glaemscribe.SequenceChar.prototype.str = function()
{
  // A sequence char should never arrive unreplaced
  return Glaemscribe.VIRTUAL_CHAR_OUTPUT;
}
  
Glaemscribe.SequenceChar.prototype.finalize = function()
{
  var sq = this;
  if(sq.sequence.length == 0)
  {
    sq.charset.errors.push(new Glaemscribe.Glaeml.Error(sq.line, "Sequence for sequence char is empty."));
  }
  glaemEach(sq.sequence, function(_,symbol) {
    if(!sq.charset.n2c(symbol))
      sq.charset.errors.push(new Glaemscribe.Glaeml.Error(sq.line, "Sequence char " + symbol + "cannot be found in the charset."));     
  });
}
    
// =========================

Glaemscribe.Charset = function(charset_name) {
  
  this.name         = charset_name;
  this.chars        = [];
  this.errors       = [];
  return this;
}

Glaemscribe.Charset.prototype.add_char = function(line, code, names)
{
  if(names == undefined || names.length == 0 || names.indexOf("?") != -1) // Ignore characters with '?'
    return;
  
  var c     = new Glaemscribe.Char();    
  c.line    = line;
  c.code    = code;
  c.names   = names;    
  c.str     = String.fromCodePoint(code);
  c.charset = this;
  this.chars.push(c);
}

Glaemscribe.Charset.prototype.add_virtual_char = function(line, classes, names, reversed, deflt)
{
  if(names == undefined || names.length == 0 || names.indexOf("?") != -1) // Ignore characters with '?'
    return;
 
  var c      = new Glaemscribe.VirtualChar();    
  c.line     = line;
  c.names    = names;
  c.classes  = classes; // We'll check errors in finalize
  c.charset  = this;
  c.default  = deflt;
  c.reversed = reversed;
  this.chars.push(c);  
}

Glaemscribe.Charset.prototype.add_sequence_char = function(line, names, seq) {
  
  if(names == undefined || names.length == 0 || names.indexOf("?") != -1) // Ignore characters with '?'
    return;
 
  var c         = new Glaemscribe.SequenceChar();    
  c.line        = line;
  c.names       = names;
  c.sequence    = stringListToCleanArray(seq,/\s/);
  c.charset     = this;
  this.chars.push(c); 
}

Glaemscribe.Charset.prototype.finalize = function()
{
  var charset = this;
  
  charset.errors         = [];
  charset.lookup_table   = {};
  charset.virtual_chars  = []
  
  charset.chars = charset.chars.sort(function(c1,c2) {
    if(c1.is_virtual() && c2.is_virtual())
      return c1.names[0].localeCompare(c2.names[0]);
    if(c1.is_virtual())
      return 1;
    if(c2.is_virtual())
      return -1;
    
    return (c1.code - c2.code);
  });
  
  for(var i=0;i<charset.chars.length;i++)
  {
    var c = charset.chars[i];  
    for(var j=0;j<c.names.length;j++)
    {
      var cname = c.names[j];
      var found = charset.lookup_table[cname];
      if(found != null)
        charset.errors.push(new Glaemscribe.Glaeml.Error(c.line, "Character " + cname + " found twice."));
      else
        charset.lookup_table[cname] = c;
    }
  }
  
  glaemEach(charset.chars, function(_,c) {
    if(c.is_virtual()) {
      c.finalize();
      charset.virtual_chars.push(c);
    }
  });
  
  glaemEach(charset.chars, function(_,c) {
     if(c.is_sequence()) {
       c.finalize();
     }
  });
}

Glaemscribe.Charset.prototype.n2c = function(cname)
{
  return this.lookup_table[cname];
}


/*
  Adding api/charset_parser.js 
*/


Glaemscribe.CharsetParser = function()
{
  return this;
}

Glaemscribe.CharsetParser.prototype.parse_raw = function(charset_name, raw)
{
  var charset = new Glaemscribe.Charset(charset_name);
  var doc     = new Glaemscribe.Glaeml.Parser().parse(raw);

  if(doc.errors.length>0)
  {
    charset.errors = doc.errors;
    return charset;
  }
 
  var chars   = doc.root_node.gpath('char');

  for(var c=0;c<chars.length;c++)
  {
    var char    = chars[c];
    var code    = parseInt(char.args[0],16);
    var names   = char.args.slice(1);
    charset.add_char(char.line, code, names)
  }  
  
  glaemEach(doc.root_node.gpath("seq"), function(_,seq_elemnt) {
    var names       = seq_elemnt.args;
    var child_node  = seq_elemnt.children[0];   
    var seq         = (child_node && child_node.is_text())?(child_node.args[0]):("")
    charset.add_sequence_char(seq_elemnt.line,names,seq);
  });
  
  glaemEach(doc.root_node.gpath("virtual"), function(_,virtual_element) {
    var names     = virtual_element.args;
    var classes   = [];
    var reversed  = false;
    var deflt     = null;
    glaemEach(virtual_element.gpath("class"), function(_,class_element) {
      var vc        = new Glaemscribe.VirtualChar.VirtualClass();
      vc.target     = class_element.args[0];
      vc.triggers   = class_element.args.slice(1);   

      // Allow triggers to be defined inside the body of the class element
      var text_lines  = class_element.children.
        filter(function(c) { return c.is_text(); }).
        map(function(c) { return c.args[0]; });

      var inner_triggers  = text_lines.join(" ").split(/\s/).filter(function(e) { return e !== '' });
      vc.triggers         = vc.triggers.concat(inner_triggers);

      classes.push(vc);
    });
    glaemEach(virtual_element.gpath("reversed"), function(_,reversed_element) {
      reversed = true;
    });
    glaemEach(virtual_element.gpath("default"), function(_,default_element) {
      deflt = default_element.args[0];
    });
    charset.add_virtual_char(virtual_element.line,classes,names,reversed,deflt);
  });
  
  charset.finalize(); 
  return charset;  
}

Glaemscribe.CharsetParser.prototype.parse = function(charset_name) {
  
  var raw     = Glaemscribe.resource_manager.raw_charsets[charset_name];
  
  return this.parse_raw(charset_name, raw);
}


/*
  Adding api/glaeml.js 
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
    glaemEach(this.children, function(child_index, child) {
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

/*
  Adding api/glaeml_shellwords.js 
*/


Glaemscribe.Glaeml.Shellwords = function() {
  return this;
}

Glaemscribe.Glaeml.ShellwordsEscapeMode = {};
Glaemscribe.Glaeml.ShellwordsEscapeMode.Unicode = 1;

Glaemscribe.Glaeml.Shellwords.prototype.reset_state = function() {
  var sw = this;
  
  sw.is_escaping                = false;
  sw.is_eating_arg              = false;
  sw.is_eating_arg_between_quotes  = false;
  sw.args = [];
  sw.current_arg = "";
  sw.escape_mode            = null;
  sw.unicode_escape_counter = 0;
  sw.unicode_escape_str     = '';
}
  
Glaemscribe.Glaeml.Shellwords.prototype.advance_inside_arg = function(l,i) {
  var sw = this;
  
  if(l[i] == "\\") {
    sw.is_escaping      = true;
    sw.escape_mode      = null;
  }
  else {
    sw.current_arg += l[i];
  }
}

Glaemscribe.Glaeml.Shellwords.prototype.advance_inside_escape = function(l,i) {

  var sw = this;

  if(sw.escape_mode == null) {
    // We don't now yet what to do.
    switch(l[i])
    {
    case 'n':
      {
        sw.current_arg += "\n";
        sw.is_escaping = false;
        break;
      }
    case "\\":
      {
        sw.current_arg +=  "\\";
        sw.is_escaping = false;
        break;
      }
    case "t":
      {
        sw.current_arg +=  "\t";
        sw.is_escaping = false;
        break;      
      }
    case "\"":
      {
        sw.current_arg +=  "\"";
        sw.is_escaping = false;
        break;      
      }
    case "u":
      {
        sw.escape_mode = Glaemscribe.Glaeml.ShellwordsEscapeMode.Unicode;
        sw.unicode_escape_counter = 0;
        sw.unicode_escape_str     = '';
        break;
      }
    default:
      {
        throw new Error("Unknown escapment : \\" + l[i]);
      }
    }
  }
  else
  {
    switch(sw.escape_mode)
    {
    case Glaemscribe.Glaeml.ShellwordsEscapeMode.Unicode:
      {
        var c = l[i].toLowerCase();
          
        if(!(c.match(/[0-9a-f]/))) {
          throw new Error("Wrong format for unicode escaping, should be \\u with 4 hex digits");
        }
          
        sw.unicode_escape_counter += 1
        sw.unicode_escape_str     += c
        if(sw.unicode_escape_counter == 4) {
          sw.is_escaping = false
          sw.current_arg += String.fromCodePoint(parseInt(sw.unicode_escape_str, 16));
        }
        break;
      }
    default:
      {
        throw new Error("Unimplemented escape mode")
      }
    }
  }
}

Glaemscribe.Glaeml.Shellwords.prototype.parse = function(l) {
  var sw = this;
  
  sw.reset_state();
  
  for(var i=0;i<l.length;i++) {
    
    if(!sw.is_eating_arg) {
      
      if(l[i].match(/\s/))
        continue;
      
      if(l[i] == "'")
        throw new Error("Glaeml strictly uses double quotes, not simple quotes for args") 
      
      sw.is_eating_arg                = true;
      sw.is_eating_arg_between_quotes = (l[i] == "\"");
      
      if(!sw.is_eating_arg_between_quotes)
        sw.current_arg += l[i];
    }
    else {
      
      // Eating arg
      if(sw.is_escaping) {
        sw.advance_inside_escape(l,i);
      }
      else {
        if(!sw.is_eating_arg_between_quotes) {
          
          if(l[i].match(/[\s"]/)) {
            
            sw.args.push(sw.current_arg);
            sw.current_arg    = "";
            sw.is_eating_arg  = (l[i] == "\""); // Starting a new arg directly
            sw.is_eating_arg_between_quotes = sw.is_eating_arg;
            continue;
            
          }
          else {
            sw.advance_inside_arg(l,i)
          }
        }
        else {
          
          if(l[i] == "\"") {
            sw.args.push(sw.current_arg);
            sw.current_arg    = "";
            sw.is_eating_arg  = false;
          }
          else {
            sw.advance_inside_arg(l,i);
          }
        }
      }
    }
  }

  if(sw.is_eating_arg && sw.is_eating_arg_between_quotes) {
    throw new Error("Unmatched quote.");
  }

  if(sw.current_arg.trim() != '') {
    sw.args.push(sw.current_arg)
  }

  return sw.args;
}           
           
           

/*
  Adding api/fragment.js 
*/


Glaemscribe.Fragment = function(sheaf, expression) {
  
  var fragment = this;
  
  fragment.sheaf        = sheaf;
  fragment.mode         = sheaf.mode;
  fragment.rule         = sheaf.rule;
  fragment.expression   = expression;

  // Next line : no need to filter empty strings, js does not put them
  fragment.equivalences = stringListToCleanArray(fragment.expression, Glaemscribe.Fragment.EQUIVALENCE_RX_OUT); 
  fragment.equivalences = fragment.equivalences.map(function(eq_exp) {
    var eq  = eq_exp;
    var exp = Glaemscribe.Fragment.EQUIVALENCE_RX_IN.exec(eq_exp);  

    if(exp)
    {
      eq = exp[1]; 
      eq = eq.split(Glaemscribe.Fragment.EQUIVALENCE_SEPARATOR).map(function(elt) {
        elt = elt.trim();
        return elt.split(/\s/).map(function(leaf) {return fragment.finalize_fragment_leaf(leaf)});
      });      
    }
    else
    {
      eq = [eq_exp.split(/\s/).map(function(leaf) {return fragment.finalize_fragment_leaf(leaf)})];
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
 
  for (var i = 0; i < fragment.equivalences.length - 1; i++) {
    var prod = productizeArray(res, fragment.equivalences[i+1]);
    res = prod.map(function(elt) {
  
      var x = elt[0];
      var y = elt[1];
  
      return x.concat(y);
    });
    
  }
  fragment.combinations = res; 
}

Glaemscribe.Fragment.prototype.finalize_fragment_leaf = function(leaf) {
  var fragment = this;
      
      
  if(fragment.is_src()) {
    leaf = leaf.replace(Glaemscribe.RuleGroup.UNICODE_VAR_NAME_REGEXP_OUT, function(cap_var,p1,offset,str) { 
      var new_char  = String.fromCodePoint(parseInt(p1, 16));
      if(new_char == "_")
        new_char = "\u0001"; // Temporary mem true underscore

      return new_char;
    });
    leaf = leaf.replace(new RegExp(Glaemscribe.WORD_BOUNDARY_LANG,"g"), Glaemscribe.WORD_BOUNDARY_TREE);
    leaf = leaf.replace(new RegExp("\u0001","g"),"_"); // Put true underscore back
  }

  return leaf;
}
      
Glaemscribe.Fragment.EQUIVALENCE_SEPARATOR = ","
Glaemscribe.Fragment.EQUIVALENCE_RX_OUT    = /(\(.*?\))/
Glaemscribe.Fragment.EQUIVALENCE_RX_IN     = /\((.*?)\)/

Glaemscribe.Fragment.prototype.is_src = function() {  return this.sheaf.is_src(); };
Glaemscribe.Fragment.prototype.is_dst = function() {  return this.sheaf.is_dst(); };


/*
  Adding api/mode.js 
*/


Glaemscribe.ModeDebugContext = function()
{
  this.preprocessor_output  = "";
  this.processor_pathes     = [];
  this.processor_output     = [];
  this.postprocessor_output = "";
  this.tts_output = "";
  
  return this;
}


Glaemscribe.Mode = function(mode_name) {
  this.name                 = mode_name;
  this.supported_charsets   = {};
  this.options              = {};
  this.errors               = [];
  this.warnings             = [];
  this.latest_option_values = {};
  this.has_tts              = false;
  this.current_tts_voice    = null;
  
  this.raw_mode_name        = null;

  this.pre_processor    = new Glaemscribe.TranscriptionPreProcessor(this);
  this.processor        = new Glaemscribe.TranscriptionProcessor(this);
  this.post_processor   = new Glaemscribe.TranscriptionPostProcessor(this);
  
  return this;
}

Glaemscribe.Mode.prototype.finalize = function(options) {
  
  var mode = this;
  
  if(options == null)
    options = {};
  
  // Hash: option_name => value_name
  var trans_options = {};
  
  // Build default options
  glaemEach(mode.options, function(oname, o) {
    trans_options[oname] = o.default_value_name;
  });
  
  // Push user options
  glaemEach(options, function(oname, valname) {
    // Check if option exists
    var opt = mode.options[oname];
    if(!opt)
      return true; // continue
    var val = opt.value_for_value_name(valname)
    if(val == null)
      return true; // value name is not valid
    
    trans_options[oname] = valname;
  });
    
  var trans_options_converted = {};
 
  // Do a conversion to values space
  glaemEach(trans_options, function(oname,valname) {
    trans_options_converted[oname] = mode.options[oname].value_for_value_name(valname);
  });

  // Add the option defined constants to the whole list for evaluation purposes
  glaemEach(mode.options, function(oname, o) {
    // For enums, add the values as constants for the evaluator
    if(o.type == Glaemscribe.Option.Type.ENUM )
    {
      glaemEach(o.values, function(name,val) {
        trans_options_converted[name] = val
      });
    }
  });   
  
  this.latest_option_values = trans_options_converted;
    
  this.pre_processor.finalize(this.latest_option_values);
  this.post_processor.finalize(this.latest_option_values);
  this.processor.finalize(this.latest_option_values);
  
  if(mode.get_raw_mode())
    mode.get_raw_mode().finalize(options);
  
  if(this.has_tts) {
    var espeak_option       = mode.options['espeak_voice'].value_name_for_value(mode.latest_option_values['espeak_voice'])
    this.current_tts_voice  = Glaemscribe.TTS.option_name_to_voice(espeak_option)
  }
  
  return this;
}

Glaemscribe.Mode.prototype.get_raw_mode = function() {
  var mode = this;
  
  if(mode.raw_mode != null)
    return mode.raw_mode;
  
  var loaded_raw_mode = (mode.raw_mode_name && Glaemscribe.resource_manager.loaded_modes[mode.raw_mode_name]);
  if(loaded_raw_mode == null)
    return null;
  
  mode.raw_mode = Object.glaem_clone(loaded_raw_mode);
  return mode.raw_mode;
}

// Transcribe, but with raw tengwar evacuated
Glaemscribe.Mode.prototype.strict_transcribe = function(content, charset, debug_context) {
  
  var mode = this;

  if(charset == null)
    charset = this.default_charset;
  
  if(charset == null)
    return [false, "*** No charset usable for transcription. Failed!"];

  // TTS pre-transcription
  if(mode.has_tts) {
    try {
      // Pre-ipa conversion with TTS engine
      var esp = new Glaemscribe.TTS(); 
      var res = esp.synthesize_ipa(content,{voice: mode.current_tts_voice, has_raw_mode: (mode.get_raw_mode() != null) });
      content = res['ipa'];

      debug_context.tts_output += content;
    } catch(e) {
      return [false, "TTS pre-transcription failed : " + e];
    }
  }

  var ret   = ""
  var lines = content.split(/(\n)/);
  
  for(var i=0;i<lines.length;i++)
  {
    var l = lines[i];
    var restore_lf = false;
    
    if(l[l.length-1] == "\n")
    {
      restore_lf = true;
      l = l.slice(0,-1);
    }
    
    l = this.pre_processor.apply(l);
    debug_context.preprocessor_output += l + "\n";
    
    l = this.processor.apply(l, debug_context);
    debug_context.processor_output = debug_context.processor_output.concat(l);
    
    l = this.post_processor.apply(l, charset);
    debug_context.postprocessor_output += l + "\n";

    if(restore_lf)
      l += "\n";
    
    ret += l;
  }
  
  return [true, ret, debug_context];  
}

Glaemscribe.Mode.prototype.transcribe = function(content, charset) {

  var mode          = this;
  var debug_context = new Glaemscribe.ModeDebugContext();

  var raw_mode      = mode.get_raw_mode();

  var ret = "";
  var res = true;
   
  if(raw_mode != null)
  {
    var chunks = content.split(/({{[\s\S]*?}})/);
       
    glaemEach(chunks, function(_,c) {
      var rmatch = null;
      
      var to_transcribe = c;
      var tr_mode       = mode;
      
      if(rmatch = c.match(/{{([\s\S]*?)}}/))
      {
        to_transcribe = rmatch[1];
        tr_mode       = raw_mode;
        // Don't forget to keep raw things inside tts output
        // debug_context.tts_output += "{{" + to_transcribe + "}}";
      }
      
      var rr = tr_mode.strict_transcribe(to_transcribe,charset,debug_context);
      var succ = rr[0]; var r = rr[1]; 
      
      if(!succ)
        return [false, r , debug_context];
        
      ret += r;   
    });
  }
  else
  {
    var rr = mode.strict_transcribe(content,charset,debug_context);
    var succ = rr[0]; var r = rr[1]; 

    if(!succ)
      return [false, r , debug_context];
      
    ret += r;   
  }
    
  return [res, ret, debug_context];  
}



/*
  Adding api/option.js 
*/


Glaemscribe.Option = function(mode, name, default_value_name, values, line, visibility)
{
  var option = this;
  
  this.mode               = mode;
  this.name               = name;
  this.default_value_name = default_value_name;
  this.type               = (Object.keys(values).length == 0)?(Glaemscribe.Option.Type.BOOL):(Glaemscribe.Option.Type.ENUM);
  this.values             = values;
  this.visibility         = visibility;
  this.line               = line;
  
  option.value_to_names     = {};
  glaemEach(option.values, function(vname,v) {
    option.value_to_names[v] = vname;
  });
  
  return this;
}
Glaemscribe.Option.Type = {};
Glaemscribe.Option.Type.BOOL = "BOOL";
Glaemscribe.Option.Type.ENUM = "ENUM";


Glaemscribe.Option.prototype.default_value = function()
{
  if(this.type == Glaemscribe.Option.Type.BOOL)
    return (this.default_value_name == 'true')
  else
    return this.values[this.default_value_name];
}

Glaemscribe.Option.prototype.value_for_value_name = function(val_name)
{
  if(this.type == Glaemscribe.Option.Type.BOOL)
  {
    if(val_name == 'true' || val_name == true)
      return true;
    
    if(val_name == 'false' || val_name == false)
      return false;
    
    return null;
  }
  else
  {
    return this.values[val_name];
  }
}


Glaemscribe.Option.prototype.value_name_for_value = function(value) {
  if(this.type == Glaemscribe.Option.Type.BOOL)
  {
    if(value == true  || value == "true")     return "true";
    if(value == false || value == "false")    return "false";

    return null;    
  }
  else
  {
    return this.value_to_names[value];
  }
}
  
Glaemscribe.Option.prototype.is_visible = function() {
  var if_eval = new Glaemscribe.Eval.Parser;
        
  var res = false;
  
  try
  {
    res = if_eval.parse(this.visibility || "true", this.mode.latest_option_values || {});
    return (res == true);
  }
  catch(err)
  {
    console.log(err);
    return null;
  }                
}


/*
  Adding api/macro.js 
*/


Glaemscribe.Macro = function(rule_group, name, arg_names) {
  var macro = this;
  macro.rule_group = rule_group;
  macro.module     = rule_group.mode;
  macro.name       = rule_group.name;
  macro.arg_names  = arg_names;
  macro.root_code_block = new Glaemscribe.IfTree.CodeBlock();
}


/*
  Adding api/mode_parser.js 
*/


Glaemscribe.ModeParser = function() { 
  return this;
}

Glaemscribe.ModeParser.prototype.validate_presence_of_args = function(node, arg_count)
{
  var parser  = this;
  
  if(arg_count != null)
  {
    if(node.args.length != arg_count)
      parser.mode.errors.push(new Glaemscribe.Glaeml.Error(node.line,"Element '" + node.name + "' should have " + arg_count + " arguments."));
  }
}  

Glaemscribe.ModeParser.prototype.validate_presence_of_children = function(parent_node, elt_name, elt_count, arg_count) {
  
  var parser  = this;
  var res     = parent_node.gpath(elt_name);
  
  if(elt_count)
  {
    if(res.length != elt_count)
       parser.mode.errors.push(new Glaemscribe.Glaeml.Error(parent_node.line,"Element '" + parent_node.name + "' should have exactly " + elt_count + " children of type '" + elt_name + "'."));
  }
  if(arg_count)
  {
    glaemEach(res, function(c,child_node) {
      parser.validate_presence_of_args(child_node, arg_count)
    });
  }
}

// Very simplified 'dtd' like verification
Glaemscribe.ModeParser.prototype.verify_mode_glaeml = function(doc)
{
  var parser  = this;

  parser.validate_presence_of_children(doc.root_node, "language", 1, 1);
  parser.validate_presence_of_children(doc.root_node, "writing",  1, 1);
  parser.validate_presence_of_children(doc.root_node, "mode",     1, 1);
  parser.validate_presence_of_children(doc.root_node, "authors",  1, 1);
  parser.validate_presence_of_children(doc.root_node, "version",  1, 1);
 
  glaemEach(doc.root_node.gpath("charset"), function (ce, charset_element) {
    parser.validate_presence_of_args(charset_element, 2);
  });
 
  glaemEach(doc.root_node.gpath("options.option"), function (oe, option_element) {
    parser.validate_presence_of_args(option_element, 2);
    glaemEach(option_element.gpath("value"), function (ve, value_element) {
      parser.validate_presence_of_args(value_element, 2);
    });
  });
  
  glaemEach(doc.root_node.gpath("outspace"), function (oe, outspace_element) {
    parser.validate_presence_of_args(outspace_element, 1);
  });

  glaemEach(doc.root_node.gpath("processor.rules"), function (re, rules_element) {
    parser.validate_presence_of_args(rules_element, 1);
    parser.validate_presence_of_children(rules_element,"if",null,1);
    parser.validate_presence_of_children(rules_element,"elsif",null,1);
  });

  glaemEach(doc.root_node.gpath("preprocessor.if"), function (re, rules_element) { parser.validate_presence_of_args(rules_element,  1) });
  glaemEach(doc.root_node.gpath("preprocessor.elsif"), function (re, rules_element) { parser.validate_presence_of_args(rules_element,  1) });
  glaemEach(doc.root_node.gpath("postprocessor.if"), function (re, rules_element) { parser.validate_presence_of_args(rules_element,  1) });
  glaemEach(doc.root_node.gpath("postprocessor.elsif"), function (re, rules_element) { parser.validate_presence_of_args(rules_element,  1) });
}

Glaemscribe.ModeParser.prototype.create_if_cond_for_if_term = function(line, if_term, cond)
{
  var ifcond                          = new Glaemscribe.IfTree.IfCond(line, if_term, cond);
  var child_code_block                = new Glaemscribe.IfTree.CodeBlock(ifcond);
  ifcond.child_code_block             = child_code_block;                
  if_term.if_conds.push(ifcond);   
  return ifcond;            
}

Glaemscribe.ModeParser.prototype.traverse_if_tree = function(context, text_procedure, element_procedure)
{
  var mode                      = this.mode;
  var owner                     = context.owner;
  var root_element              = context.root_element;
  var rule_group                = context.rule_group;
  var root_code_block           = owner.root_code_block;
  var current_parent_code_block = root_code_block;
  
  for(var c = 0;c<root_element.children.length;c++)
  {
    var child = root_element.children[c];
              
    if(child.is_text())
    {
      if(text_procedure != null)
        text_procedure(current_parent_code_block,child);
      
      continue;
    }
    
    if(child.is_element())
    {
      switch(child.name)
      {
      case 'if':
        
        var cond_attribute                  = child.args[0];
        var if_term                         = new Glaemscribe.IfTree.IfTerm(current_parent_code_block);
        current_parent_code_block.terms.push(if_term) ;            
        var if_cond                         = this.create_if_cond_for_if_term(child.line, if_term, cond_attribute);
        current_parent_code_block           = if_cond.child_code_block;
               
        break;
      case 'elsif':
        
        var cond_attribute                  = child.args[0];
        var if_term                         = current_parent_code_block.parent_if_cond.parent_if_term;
          
        if(if_term == null)
        {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "'elsif' without a 'if'."));
          return;
        }
        
        // TODO : check that precendent one is a if or elseif
        var if_cond                         = this.create_if_cond_for_if_term(child.line, if_term,cond_attribute);
        current_parent_code_block           = if_cond.child_code_block;
          
        break;
      case 'else':
        
        var if_term                         = current_parent_code_block.parent_if_cond.parent_if_term; 
        
        if(if_term == null)
        {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "'else' without a 'if'."));
          return;
        }
        
        // TODO : check if precendent one is a if or elsif
        var if_cond                         = this.create_if_cond_for_if_term(child.line, if_term,"true");
        current_parent_code_block           = if_cond.child_code_block;
          
        break;
      case 'endif':
        
        var if_term                         = current_parent_code_block.parent_if_cond.parent_if_term;  
      
        if(if_term == null)
        {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "'endif' without a 'if'."));
          return;
        }
        
        current_parent_code_block           = if_term.parent_code_block;
              
        break;
        
      case 'macro':
        
        // Macro definition, cannot be defined in conditional blocks
        if(current_parent_code_block.parent_if_cond || root_element.name != "rules") {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "Macros can only defined in the 'rules' scope, not in a conditional block (because they are replaced and used at parsing time) or a macro block (local macros are not handled)."));
          return;      
        }
        
        if(!child.args || child.args.length == 0) {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "Macro misses a name."));
          return;   
        }

        var macro_args = child.args.slice(0);
        var macro_name = macro_args.shift();
        glaemEach(macro_args,  function(_,arg) {
          if(!arg.match(/[0-9A-Z_]+/)) {
            mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "Macro argument name " + arg + " has wrong format."));
            return;
          }
        });
        
        if(rule_group.macros[macro_name] != null) {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "Redefining macro " + macro_name + "."));
          return;           
        }
        
        var macro         = new Glaemscribe.Macro(rule_group,macro_name,macro_args);
        var macro_context = {owner: macro, root_element: child, rule_group: rule_group};
        
        this.traverse_if_tree(macro_context, text_procedure, element_procedure);

        rule_group.macros[macro_name] = macro;
      
        break;
      case 'deploy':

        if(!rule_group) {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line,"Macros can only be deployed in a rule group."));
          return;   
        }

        var macro_args = child.args.slice(0);
        var macro_name = macro_args.shift();
        var macro      = rule_group.macros[macro_name]

        if(macro == null) {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line,"Macro '" + macro_name + "' not found in rule group '" + rule_group.name + "'."));
          return;   
        }

        var wanted_argcount = macro.arg_names.length;
        var given_argcount  = macro_args.length;
        
        if(wanted_argcount != given_argcount) {
          mode.errors.push(new Glaemscribe.Glaeml.Error(child.line,"Macro '" + macro_name + "' takes " + wanted_argcount + " arguments, not " + given_argcount + "."));
          return;          
        }

        var macro_node = new Glaemscribe.IfTree.MacroDeployTerm(macro, child.line, current_parent_code_block, macro_args);
        current_parent_code_block.terms.push(macro_node);
        
        break;
        
      default:
        
        // Do something with this child element
        if(element_procedure != null)
          element_procedure(current_parent_code_block, child);            
        
        break;
      }
    }
  }
  
  if(current_parent_code_block.parent_if_cond)
    mode.errors.push(new Glaemscribe.Glaeml.Error(child.line, "Unended 'if' at the end of this '" + root_element.name + "' element."));

}

Glaemscribe.ModeParser.prototype.parse_pre_post_processor = function(processor_element, pre_not_post)
{
  var mode = this.mode;
  
  // Do nothing with text elements
  var text_procedure    = function(current_parent_code_block, element) {}             
  var element_procedure = function(current_parent_code_block, element) {
        
    // A block of operators. Put them in a PrePostProcessorOperatorsTerm.   
    var term = current_parent_code_block.terms[current_parent_code_block.terms.length-1];

    if(term == null || !term.is_pre_post_processor_operators() )
    {
      term = new Glaemscribe.IfTree.PrePostProcessorOperatorsTerm(current_parent_code_block);
      current_parent_code_block.terms.push(term);
    }
    
    var operator_name   = element.name; 
    var operator_class  = null;
    var procname        = "Preprocessor";
      
    if(pre_not_post)
      operator_class = Glaemscribe.resource_manager.class_for_pre_processor_operator_name(operator_name);
    else
      operator_class = Glaemscribe.resource_manager.class_for_post_processor_operator_name(operator_name);
  
    if(!operator_class)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(element.line, "Operator '" + operator_name + "' is unknown."));
    }
    else
    {         
      term.operators.push(new operator_class(mode, element.clone()));
    }     
  }  
  
  var processor_context = {
    owner:        ((pre_not_post)?(mode.pre_processor):(mode.post_processor)),
    root_element: processor_element,
    rule_group:   null
  }
  
  this.traverse_if_tree(processor_context, text_procedure, element_procedure )                       
}

Glaemscribe.ModeParser.prototype.parse_raw = function(mode_name, raw, mode_options) {

  var mode    = new Glaemscribe.Mode(mode_name);
  this.mode   = mode;
  mode.raw    = raw;
  
  if(raw == null)
  {
    mode.errors.push(new Glaemscribe.Glaeml.Error(0, "No sourcecode. Forgot to load it?"));
    return mode;
  }

  if(mode_options == null)
    mode_options = {};
 
  var doc     = new Glaemscribe.Glaeml.Parser().parse(raw);
  if(doc.errors.length > 0)
  {
    mode.errors = doc.errors
    return mode;
  }
  
  this.verify_mode_glaeml(doc);
  
  if(mode.errors.length > 0)
    return mode;
    
  mode.language    = doc.root_node.gpath('language')[0].args[0]
  mode.writing     = doc.root_node.gpath('writing')[0].args[0]
  mode.human_name  = doc.root_node.gpath('mode')[0].args[0]
  mode.authors     = doc.root_node.gpath('authors')[0].args[0]
  mode.version     = doc.root_node.gpath('version')[0].args[0]
  mode.invention   = (doc.root_node.gpath('invention')[0] || {args:[]}).args[0]
  mode.world       = (doc.root_node.gpath('world')[0] || {args:[]}).args[0]
  mode.raw_mode_name = (doc.root_node.gpath('raw_mode')[0] || {args:[]}).args[0]    
  
  glaemEach(doc.root_node.gpath('options.option'), function(_,option_element) {

    var values          = {};
    var visibility      = null;
    var is_radio        = false;
    
    glaemEach(option_element.gpath('value'), function(_, value_element) {
      var value_name                = value_element.args[0];
      values[value_name]            = parseInt(value_element.args[1]);    
    });
    glaemEach(option_element.gpath('visible_when'), function(_, visible_element) {
      visibility = visible_element.args[0];
    });    
    glaemEach(option_element.gpath('radio'), function(_,__) { is_radio = true });

    var option_name_at          = option_element.args[0];
    var option_default_val_at   = option_element.args[1];
    // TODO: check syntax of the option name
    
    if(option_default_val_at == null)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(option_element.line, "Missing option 'default' value."));
    }
    
    var option                = new Glaemscribe.Option(mode, option_name_at, option_default_val_at, values, option_element.line, visibility);
    option.is_radio           = is_radio;
    mode.options[option.name] = option;
  }); 
  
  var charset_elements   = doc.root_node.gpath('charset');
 
  for(var c=0; c<charset_elements.length; c++)
  { 
    var charset_element     = charset_elements[c];

    var charset_name        = charset_element.args[0];
    var charset             = Glaemscribe.resource_manager.loaded_charsets[charset_name];
    
    if(!charset)
    {
      Glaemscribe.resource_manager.load_charsets([charset_name]);
      charset = Glaemscribe.resource_manager.loaded_charsets[charset_name]; 
    }
    
    if(charset)
    {
      if(charset.errors.length > 0)
      {
        for(var e=0; e<charset.errors.length; e++)
        {
          var err = charset.errors[e];
          mode.errors.push(new Glaemscribe.Glaeml.Error(charset_element.line, charset_name + ":" + err.line + ":" + err.text));
        }
        return mode;
      }
      
      mode.supported_charsets[charset_name] = charset;
      var is_default = charset_element.args[1];
      if(is_default && is_default == "true")
        mode.default_charset = charset
    }
    else
    {
      mode.warnings.push(new Glaemscribe.Glaeml.Error(charset_element.line, "Failed to load charset '" + charset_name + "'."));
    }
  }
   
  if(!mode.default_charset)
  {
    mode.warnings.push(new Glaemscribe.Glaeml.Error(0, "No default charset defined!!")); 
  }
    
  // Read the preprocessor
  var preprocessor_element  = doc.root_node.gpath("preprocessor")[0];
  if(preprocessor_element)
    this.parse_pre_post_processor(preprocessor_element, true);
  
  // Read the postprocessor
  var postprocessor_element  = doc.root_node.gpath("postprocessor")[0];
  if(postprocessor_element)
    this.parse_pre_post_processor(postprocessor_element, false);
    
  var outspace_element   = doc.root_node.gpath('outspace')[0];
  if(outspace_element)
  {
    var val                        = outspace_element.args[0];
    mode.post_processor.out_space  = stringListToCleanArray(val,/\s/);   
  } 
 
  var rules_elements  = doc.root_node.gpath('processor.rules');
  
  for(var re=0; re<rules_elements.length; re++)
  {
    var rules_element = rules_elements[re];
    
    var rule_group_name                               = rules_element.args[0]; 
    var rule_group                                    = new Glaemscribe.RuleGroup(mode, rule_group_name)
    mode.processor.rule_groups[rule_group_name]       = rule_group

    var text_procedure = function(current_parent_code_block, element) {        
  
      // A block of code lines. Put them in a codelinesterm.   
      var term = current_parent_code_block.terms[current_parent_code_block.terms.length-1];
      if(term == null || !term.is_code_lines() )
      {
        term = new Glaemscribe.IfTree.CodeLinesTerm(current_parent_code_block);
        current_parent_code_block.terms.push(term);
      }
      
      var lcount          = element.line;
      var lines           = element.args[0].split("\n");
      
      for(var l=0; l < lines.length; l++)
      {
        var line        = lines[l].trim();       
        var codeline    = new Glaemscribe.IfTree.CodeLine(line, lcount);
        term.code_lines.push(codeline);  
        lcount += 1;
      }                 
    }
    
    var element_procedure = function(current_parent_code_block, element) {     
      // This is fatal.
      mode.errors.push(new Glaemscribe.Glaeml.Error(element.line, "Unknown directive " + element.name + "."));
    }  
    
    var processor_context = {
      owner:        rule_group,
      root_element: rules_element,
      rule_group:   rule_group
    }
    
    this.traverse_if_tree(processor_context, text_procedure, element_procedure );                 
  }
 
  var espeak_option = mode.options['espeak_voice'];
  if(espeak_option) {
    // IN JS, TTS ENGINE SHOULD BE LOADED SEPARATELY AND MAYBE AFTERWARDS OR ASYNCHRONOUSLY. DON'T LOAD HERE.
    // TTS::load_engine
    mode.has_tts = true;
    
    glaemEach(espeak_option.values, function(vname,_) {
      var voice = Glaemscribe.TTS.option_name_to_voice(vname);
      // Even if the TTS engine may not be loaded, the wrapper is. 
      // As such, we can check if voices are correct here.
      if(!Glaemscribe.TTS.voice_list().includes(voice)) {
        mode.errors.push(new Glaemscribe.Glaeml.Error(espeak_option.line, "Option has unhandled voice  " + voice + "."));
      }  
    });
  }
  
  if(mode.errors.length == 0)
    mode.finalize(mode_options);

  return mode;  
}

Glaemscribe.ModeParser.prototype.parse = function(mode_name) {
  var parser  = this;
  var raw     = Glaemscribe.resource_manager.raw_modes[mode_name];
  return parser.parse_raw(mode_name, raw);
}

/*
  Adding api/rule.js 
*/


Glaemscribe.Rule = function(line, rule_group) {
  this.line       = line;
  this.rule_group = rule_group;
  this.mode       = rule_group.mode;
  this.sub_rules  = [];
  this.errors     = [];
}

Glaemscribe.Rule.prototype.finalize = function(cross_schema) {
  
  if(this.errors.length > 0)
  {
    for(var i=0; i<this.errors.length; i++)
    {
      var e = this.errors[i];
      this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, e));
    }
    return;    
  }

  var srccounter  = new Glaemscribe.SheafChainIterator(this.src_sheaf_chain)
  var dstcounter  = new Glaemscribe.SheafChainIterator(this.dst_sheaf_chain, cross_schema)
  
  if(srccounter.errors.length > 0)
  {
    for(var i=0; i<srccounter.errors.length; i++)
    {
      var e = srccounter.errors[i];
      this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, e));
    }
    return;
  }  
  if(dstcounter.errors.length > 0)
  {
    for(var i=0; i<dstcounter.errors.length; i++)
    {
      var e = dstcounter.errors[i];
      this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, e));
    }
    return;
  }  

  var srcp = srccounter.proto();
  var dstp = dstcounter.proto();
  
  if(srcp != dstp)
  {
    this.mode.errors.push(new Glaemscribe.Glaeml.Error(this.line, "Source and destination are not compatible (" + srcp + " vs " + dstp + ")"));
    return;
  }
  
  do {
    
    // All equivalent combinations ...
    var src_combinations  = srccounter.combinations(); 
    // ... should be sent to one destination
    var dst_combination   = dstcounter.combinations()[0];
    
    for(var c=0;c<src_combinations.length;c++)
    {
      var src_combination = src_combinations[c];
      this.sub_rules.push(new Glaemscribe.SubRule(this, src_combination, dst_combination));
    }

    dstcounter.iterate()
  }
  while(srccounter.iterate())
}


/*
  Adding api/rule_group.js 
*/


Glaemscribe.RuleGroupVar = function(name, value, is_pointer) {

  this.name       = name;
  this.value      = value;
  this.is_p       = is_pointer;
}

Glaemscribe.RuleGroupVar.prototype.is_pointer = function() {
  return this.is_p;
}

////////

Glaemscribe.RuleGroup = function(mode,name) {
  this.name             = name;
  this.mode             = mode;
  this.macros           = {}
  this.root_code_block  = new Glaemscribe.IfTree.CodeBlock();       
  
  return this;
}

Glaemscribe.RuleGroup.VAR_NAME_REGEXP             = /{([0-9A-Z_]+)}/g;
Glaemscribe.RuleGroup.VAR_DECL_REGEXP             = /^\s*{([0-9A-Z_]+)}\s+===\s+(.+?)\s*$/
Glaemscribe.RuleGroup.POINTER_VAR_DECL_REGEXP     = /^\s*{([0-9A-Z_]+)}\s+<=>\s+(.+?)\s*$/
Glaemscribe.RuleGroup.UNICODE_VAR_NAME_REGEXP_IN  = /^UNI_([0-9A-F]+)$/
Glaemscribe.RuleGroup.UNICODE_VAR_NAME_REGEXP_OUT = /{UNI_([0-9A-F]+)}/
Glaemscribe.RuleGroup.RULE_REGEXP                 = /^\s*(.*?)\s+-->\s+(.+?)\s*$/
Glaemscribe.RuleGroup.CROSS_SCHEMA_REGEXP         = /[0-9]+(\s*,\s*[0-9]+)*/
Glaemscribe.RuleGroup.CROSS_RULE_REGEXP           = /^\s*(.*?)\s+-->\s+([0-9]+(\s*,\s*[0-9]+)*|{([0-9A-Z_]+)}|identity)\s+-->\s+(.+?)\s*$/


Glaemscribe.RuleGroup.prototype.add_var = function(var_name, value, is_pointer) {
  this.vars[var_name] = new Glaemscribe.RuleGroupVar(var_name,value,is_pointer);
}

// Replace all vars in expression
Glaemscribe.RuleGroup.prototype.apply_vars = function(line,string,allow_unicode_vars) {
  var rule_group  = this;
  var mode        = this.mode;
  var goterror    = false;  
  
  var ret               = string;  
  var had_replacements  = true;
  var stack_depth       = 0;
  
  while(had_replacements) {
    
    had_replacements = false;
    ret = ret.replace(Glaemscribe.RuleGroup.VAR_NAME_REGEXP, function(match,p1,offset,str) { 
      var vname = p1;
      var v     = rule_group.vars[vname];
      var rep   = null;

      if(v == null)
      {
        if(Glaemscribe.RuleGroup.UNICODE_VAR_NAME_REGEXP_IN.exec(vname))
        {
          // A unicode variable.
          if(allow_unicode_vars)
          {
            // Just keep this variable intact, it will be replaced at the last moment of the parsing
            rep = match;
          }
          else
          {
            mode.errors.push(new Glaemscribe.Glaeml.Error(line, "In expression: "+ string + ": making wrong use of unicode variable: " + match + ". Unicode vars can only be used in source members of a rule or in the definition of another variable."))
            goterror = true;
            return ""; 
          }  
        }
        else
        {
          mode.errors.push(new Glaemscribe.Glaeml.Error(line, "In expression: "+ string + ": failed to evaluate variable: " + match + "."));
          goterror = true;
          return ""; 
        }      
      }
      else
      {
        rep = v.value;
        // Only count replacements on non unicode vars
        had_replacements = true;
      }
    
      return rep;
    });
    
    if(goterror)
      return null;
    
    stack_depth += 1
    
    if(!had_replacements)
      break;
    
    if(stack_depth > 16)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(line, "In expression: "+ string + ": evaluation stack overflow."));
      return nil;
    }
    
  }
    
  return ret;
}

Glaemscribe.RuleGroup.prototype.descend_if_tree = function(code_block,options)
{    
  var rule_group  = this;
  var mode        = this.mode;
  
  for(var t=0; t < code_block.terms.length; t++)
  {
    var term = code_block.terms[t];           
           
    if(term.is_code_lines())
    {
      for(var o=0; o<term.code_lines.length; o++)
      {
        var cl = term.code_lines[o];
        this.finalize_code_line(cl);
      } 
    }
    else if(term.is_macro_deploy()) 
    {      
      // Ok this is a bit dirty but I don't want to rewrite the error managamenet
      // So add an error and if it's still the last (meaning there were no error) one remove it      
      var possible_error = new Glaemscribe.Glaeml.Error(term.line,  ">> Macro backtrace : " + term.macro.name + "");
      mode.errors.push(possible_error);
    
      // First, test if variable is pushable
      var arg_values = []
      glaemEach(term.macro.arg_names, function(i,arg_name) {
        var var_value = null;
        
        if(rule_group.vars[arg_name]) {
          mode.errors.push(new Glaemscribe.Glaeml.Error(term.line, "Local variable " + arg_name + " hinders a variable with the same name in this context. Use only local variable names in macros!"));
        }
        else
        {
          // Evaluate local var
          var var_value_ex  = term.arg_value_expressions[i];
          var var_value     = rule_group.apply_vars(term.line, var_value_ex, true)      
        
          if(var_value == null) {
            mode.errors.push(new Glaemscribe.Glaeml.Error(term.line,  "Thus, variable " + var_name + " could not be declared."));
          }
        }    
        arg_values.push({name: arg_name, val: var_value});
      });
    
      // We push local vars after the whole loop to avoid interferences between them when evaluating them
      glaemEach(arg_values, function(_,v) {
        if(v.val != null)
          rule_group.add_var(v.name,v.val,false)
      });

      rule_group.descend_if_tree(term.macro.root_code_block, options)
    
      // Remove the local vars from the scope (only if they were leggit)
      glaemEach(arg_values, function(_,v) {
        if(v.val != null)
          rule_group.vars[v.name] = null;
      });
              
      if(mode.errors[mode.errors.length-1] == possible_error) {
        // Remove the error scope if there were no errors
        mode.errors.pop();
      }
      else
      {
        // Add another one to close the context
        mode.errors.push(new Glaemscribe.Glaeml.Error(term.line,  "<< Macro backtrace : " + term.macro.name + ""));
      }
    }
    else
    { 
      for(var i=0; i<term.if_conds.length; i++)
      {
        var if_cond = term.if_conds[i];
        var if_eval = new Glaemscribe.Eval.Parser;
        
        var res = false;
        
        try
        {
          res = if_eval.parse(if_cond.expression, options);
        }
        catch(err)
        {
          mode.errors.push(new Glaemscribe.Glaeml.Error(if_cond.line, "Failed to evaluate condition '" + if_cond.expression + "'."));
        }       
        
        if(res == true)
        {
          this.descend_if_tree(if_cond.child_code_block, options)
          break;
        }        
      }        
    }
  }
}

Glaemscribe.RuleGroup.prototype.finalize_rule = function(line, match_exp, replacement_exp, cross_schema)
{
  var match             = this.apply_vars(line, match_exp, true);
  var replacement       = this.apply_vars(line, replacement_exp, false);
  
  if(match == null || replacement == null) // Failed
    return;

  var rule              = new Glaemscribe.Rule(line, this);                             
  rule.src_sheaf_chain  = new Glaemscribe.SheafChain(rule, match, true);
  rule.dst_sheaf_chain  = new Glaemscribe.SheafChain(rule, replacement, false);
   
  rule.finalize(cross_schema);
  
  this.rules.push(rule);
}

Glaemscribe.RuleGroup.prototype.finalize_code_line = function(code_line) {

  var mode = this.mode;
  
  var exp = Glaemscribe.RuleGroup.VAR_DECL_REGEXP.exec(code_line.expression);
  if(exp)
  {
    var var_name      = exp[1];
    var var_value_ex  = exp[2];
    var var_value     = this.apply_vars(code_line.line, var_value_ex, true);
        
    if(var_value == null)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(code_line.line, "Thus, variable {"+ var_name + "} could not be declared."));
      return;
    }
         
    this.add_var(var_name,var_value,false);                         
  }
  else if(exp = Glaemscribe.RuleGroup.POINTER_VAR_DECL_REGEXP.exec(code_line.expression))
  {
    var var_name      = exp[1];
    var var_value_ex  = exp[2];         
    this.add_var(var_name,var_value_ex,true);    
  }
  else if(exp = Glaemscribe.RuleGroup.CROSS_RULE_REGEXP.exec(code_line.expression))
  {
    var match         = exp[1];
    var cross         = exp[2];

    var var_name      = exp[4];
    var replacement   = exp[5];      
    
    if(var_name)
    {
      // This was a variable declaration           
      var var_value = this.apply_vars(code_line.line, cross, false);
      if(!var_value)
      {
        mode.errors.push(new Glaemscribe.Glaeml.Error(code_line.line, "Thus, variable {"+ var_name + "} could not be declared."));
        return;
      }
      cross = var_value;
    }
    
    if(cross == "identity")
      cross = null;    
      
    this.finalize_rule(code_line.line, match, replacement, cross)
  }
  else if(exp = Glaemscribe.RuleGroup.RULE_REGEXP.exec(code_line.expression ))
  {
    var match         = exp[1];
    var replacement   = exp[2];

    this.finalize_rule(code_line.line, match, replacement)
  }
  else if(code_line.expression == "")
  {
    // Do nothing
  }
  else
  {
    mode.errors.push(new Glaemscribe.Glaeml.Error(code_line.line, ": Cannot understand '" + code_line.expression  + "'."));
  }
}

Glaemscribe.RuleGroup.prototype.finalize = function(options) {
  var rule_group        = this;
  
  this.vars       = {}
  this.in_charset = {}
  this.rules      = []
  
  this.add_var("NULL","",false);
 
  // Characters that are not easily entered or visible in a text editor
  this.add_var("NBSP",           "{UNI_A0}"  , false)
  this.add_var("WJ",             "{UNI_2060}", false)
  this.add_var("ZWSP",           "{UNI_200B}", false)
  this.add_var("ZWNJ",           "{UNI_200C}", false)        

  // The following characters are used by the mode syntax.
  // Redefine some convenient tools.
  this.add_var("UNDERSCORE",     "{UNI_5F}", false)
  this.add_var("ASTERISK",       "{UNI_2A}", false)
  this.add_var("COMMA",          "{UNI_2C}", false)
  this.add_var("LPAREN",         "{UNI_28}", false)
  this.add_var("RPAREN",         "{UNI_29}", false)
  this.add_var("LBRACKET",       "{UNI_5B}", false)
  this.add_var("RBRACKET",       "{UNI_5D}", false)

  this.descend_if_tree(this.root_code_block, options)
  
  // Now that we have selected our rules, create the in_charset of the rule_group 
  rule_group.in_charset = {};
  for(var r=0;r<rule_group.rules.length;r++)
  {
    var rule = rule_group.rules[r];
    for(var sr=0;sr<rule.sub_rules.length;sr++)
    {
      var sub_rule  = rule.sub_rules[sr];      
      var letters   = sub_rule.src_combination.join("").split("");
      
      for(var l=0;l<letters.length;l++)
      {
        var inchar = letters[l];
        
        // Ignore '\u0000' (bounds of word) and '|' (word breaker)
        if(inchar != Glaemscribe.WORD_BREAKER && inchar != Glaemscribe.WORD_BOUNDARY_TREE)
          rule_group.in_charset[inchar] = rule_group;      
      }
    }
  }
}


/*
  Adding api/sub_rule.js 
*/


Glaemscribe.SubRule = function(rule, src_combination, dst_combination)
{
  this.src_combination = src_combination;
  this.dst_combination = dst_combination;
}


/*
  Adding api/sheaf.js 
*/


Glaemscribe.Sheaf = function(sheaf_chain, expression, linkable) {
  
  var sheaf = this;
  
  sheaf.sheaf_chain    = sheaf_chain;
  sheaf.mode           = sheaf_chain.mode;
  sheaf.rule           = sheaf_chain.rule;
  sheaf.expression     = expression;
  sheaf.linkable       = linkable;
  
  // The ruby function has -1 to tell split not to remove empty stirngs at the end
  // Javascript does not need this
  sheaf.fragment_exps  = expression.split(Glaemscribe.Sheaf.SHEAF_SEPARATOR).map(function(elt) {return elt.trim();});

  if(sheaf.fragment_exps.length == 0)
    sheaf.fragment_exps  = [""]; 
           
  sheaf.fragments = sheaf.fragment_exps.map(function(fragment_exp) { 
    return new Glaemscribe.Fragment(sheaf, fragment_exp)
  });
}
Glaemscribe.Sheaf.SHEAF_SEPARATOR = "*"

Glaemscribe.Sheaf.prototype.is_src = function() { return this.sheaf_chain.is_src; };
Glaemscribe.Sheaf.prototype.is_dst = function() { return !this.sheaf_chain.is_src };
Glaemscribe.Sheaf.prototype.mode   = function() { return this.sheaf_chain.mode(); };


/*
  Adding api/sheaf_chain.js 
*/


Glaemscribe.SheafChain = function(rule, expression, is_src)
{
  var sheaf_chain = this;
  
  sheaf_chain.rule       = rule;
  sheaf_chain.mode       = rule.mode;
  sheaf_chain.is_src     = is_src;
  sheaf_chain.expression = expression;
   
  sheaf_chain.sheaf_exps = stringListToCleanArray(expression,Glaemscribe.SheafChain.SHEAF_REGEXP_OUT)

  sheaf_chain.sheaf_exps = sheaf_chain.sheaf_exps.map(function(sheaf_exp) { 
    var exp       =  Glaemscribe.SheafChain.SHEAF_REGEXP_IN.exec(sheaf_exp);
    var linkable  = false;
    if(exp) {
      sheaf_exp   = exp[1];
      linkable    = true;
    }
    
    return { exp: sheaf_exp.trim(), linkable: linkable} ;
  });

  sheaf_chain.sheaves    = sheaf_chain.sheaf_exps.map(function(sd) { return new Glaemscribe.Sheaf(sheaf_chain, sd['exp'], sd['linkable']) });
  
  if(sheaf_chain.sheaves.length == 0)
    sheaf_chain.sheaves    = [new Glaemscribe.Sheaf(sheaf_chain, "", false)]
    
  return sheaf_chain;    
}

Glaemscribe.SheafChain.SHEAF_REGEXP_IN    = /\[(.*?)\]/;
Glaemscribe.SheafChain.SHEAF_REGEXP_OUT   = /(\[.*?\])/;

Glaemscribe.SheafChain.prototype.mode = function() { return this.rule.mode() };

/*
  Adding api/sheaf_chain_iterator.js 
*/


Glaemscribe.SheafChainIterator = function (sheaf_chain, cross_schema)
{
  var sci = this;
  
  sci.sheaf_chain = sheaf_chain;
  sci.sizes       = sheaf_chain.sheaves.map(function(sheaf) {  return sheaf.fragments.length });
   
  sci.iterators   = sci.sizes.map(function(elt) { return 0;});
  
  sci.errors      = [];

  var identity_cross_array  = []
  var sheaf_count           = sheaf_chain.sheaves.length;

  // Construct the identity array
  for(var i=0;i<sheaf_count;i++)
    identity_cross_array.push(i);
  
  // Make a list of linkable sheaves
  var iterable_idxs   = [];
  var prototype_array = [];
  glaemEach(sheaf_chain.sheaves, function(i,sheaf) {
    if(sheaf.linkable)
    {
      iterable_idxs.push(i);
      prototype_array.push(sheaf.fragments.length);
    }
  });
    
  sci.cross_array = identity_cross_array;
  sci.proto_attr  = prototype_array.join('x');
  if(sci.proto_attr == '')
    sci.proto_attr = 'CONST';

  // Construct the cross array
  if(cross_schema != null)
  {
    cross_schema    = cross_schema.split(",").map(function(i) { return parseInt(i) - 1 });

    // Verify that the number of iterables is equal to the cross schema length
    var it_count    = iterable_idxs.length;
    var ca_count    = cross_schema.length;
    
    if(ca_count != it_count)
    {
      sci.errors.push(it_count + " linkable sheaves found in right predicate, but " + ca_count + " elements in cross rule."); 
      return; 
    }
    
    // Verify that the cross schema is correct (should be a permutation of the identity)
    var it_identity_array = [];
    for(var i=0;i<it_count;i++)
      it_identity_array.push(i);
    
    var sorted = cross_schema.slice(0).sort(); // clone and sort
    
    if (!arrayEquals(it_identity_array, sorted)) {
      sci.errors.push("Cross rule schema should be a permutation of the identity (it should contain 1,2,..,n numbers once and only once).");
      return;
    }
    
    var prototype_array_permutted = prototype_array.slice(0);
    
    // Now calculate the cross array
    glaemEach(cross_schema, function(from,to) {
      var to_permut = iterable_idxs[from];
      var permut    = iterable_idxs[to];
      sci.cross_array[to_permut] = permut;
      prototype_array_permutted[from] = prototype_array[to];
    });
    prototype_array = prototype_array_permutted;
  }

  sci.proto_attr = prototype_array.join('x');
  if(sci.proto_attr == '')
    sci.proto_attr = 'CONST';
}

// Beware, 'prototype' is a reserved keyword
Glaemscribe.SheafChainIterator.prototype.proto = function() {
  var sci = this;
  return sci.proto_attr;
}

Glaemscribe.SheafChainIterator.prototype.combinations = function()
{
  var sci = this;
  var resolved = [];
  
  for(var i=0;i<sci.iterators.length;i++)
  {
    var counter   = sci.iterators[i];
    var sheaf     = sci.sheaf_chain.sheaves[i];
    
    var fragment  = sheaf.fragments[counter];
    resolved.push(fragment.combinations); 
  }
    
  var res = resolved[0]; 
  for(var i=0;i<resolved.length-1;i++)
  {
    var prod  = productizeArray(res, resolved[i+1]);
    res = prod.map(function(elt) {
      var e1 = elt[0];
      var e2 = elt[1];
      return e1.concat(e2);
    }); 
  }
  return res;
}

Glaemscribe.SheafChainIterator.prototype.iterate = function()
{
  var sci = this;
  var pos = 0
  
  while(pos < sci.sizes.length)
  {
    var realpos = sci.cross_array[pos];
    sci.iterators[realpos] += 1;
    if(sci.iterators[realpos] >= sci.sizes[realpos])
    {
      sci.iterators[realpos] = 0;
      pos += 1;
    }
    else
      return true;
  }
  
  // Wrapped!
  return false  
}


/*
  Adding api/if_tree.js 
*/


Glaemscribe.IfTree = {}

/* ================ */

Glaemscribe.IfTree.IfCond = function(line, parent_if_term, expression)
{
  this.line = line;
  this.parent_if_term = parent_if_term;
  this.expression = expression;
  return this;
}

/* ================ */

Glaemscribe.IfTree.Term = function(parent_code_block)
{
  this.parent_code_block = parent_code_block;
  return this;
}
Glaemscribe.IfTree.Term.prototype.is_code_lines = function()
{
  return false;
}
Glaemscribe.IfTree.Term.prototype.is_macro_deploy = function() {
  return false;
}
Glaemscribe.IfTree.Term.prototype.is_pre_post_processor_operators = function()
{
  return false;
}
Glaemscribe.IfTree.Term.prototype.name = function()
{
  return "TERM"
}
Glaemscribe.IfTree.Term.prototype.dump = function(level)
{
  var str = "";
  for(var i=0;i<level;i++)
    str += " ";
  str += "|-" + this.name(); 
  console.log(str);
}

/* ================ */

Glaemscribe.IfTree.IfTerm = function(parent_code_block)
{
  Glaemscribe.IfTree.Term.call(this,parent_code_block); //super
  this.if_conds = [];
  return this;
}
Glaemscribe.IfTree.IfTerm.inheritsFrom( Glaemscribe.IfTree.Term );  

Glaemscribe.IfTree.IfTerm.prototype.name = function()
{
  return "IF_TERM";
}
Glaemscribe.IfTree.IfTerm.prototype.dump = function(level)
{
  this.parent.dump.call(this,level);
  
}

/* ================ */

Glaemscribe.IfTree.CodeLine = function(expression, line)
{
  this.expression = expression;
  this.line       = line;
  return this;
}

/* ================ */

Glaemscribe.IfTree.PrePostProcessorOperatorsTerm = function(parent_code_block)
{
  Glaemscribe.IfTree.Term.call(this,parent_code_block); //super
  this.operators = []
  return this;
}
Glaemscribe.IfTree.PrePostProcessorOperatorsTerm.inheritsFrom( Glaemscribe.IfTree.Term );  

Glaemscribe.IfTree.PrePostProcessorOperatorsTerm.prototype.name = function()
{
  return "OP_TERM";
}
Glaemscribe.IfTree.PrePostProcessorOperatorsTerm.prototype.is_pre_post_processor_operators = function()
{
  return true;
}

/* ================ */

Glaemscribe.IfTree.CodeLinesTerm = function(parent_code_block)
{
  Glaemscribe.IfTree.Term.call(this,parent_code_block); //super
  this.code_lines = []
  return this;
}
Glaemscribe.IfTree.CodeLinesTerm.inheritsFrom( Glaemscribe.IfTree.Term );  

Glaemscribe.IfTree.CodeLinesTerm.prototype.name = function()
{
  return "CL_TERM";
}
Glaemscribe.IfTree.CodeLinesTerm.prototype.is_code_lines = function()
{
  return true;
}

/* ================ */

Glaemscribe.IfTree.MacroDeployTerm = function(macro, line, parent_code_block, arg_value_expressions)
{
  Glaemscribe.IfTree.Term.call(this,parent_code_block); //super
  this.line                   = line;
  this.macro                  = macro;
  this.arg_value_expressions  = arg_value_expressions
  return this;
}
Glaemscribe.IfTree.MacroDeployTerm.inheritsFrom( Glaemscribe.IfTree.Term );  

Glaemscribe.IfTree.MacroDeployTerm.prototype.name = function()
{
  return "DEPLOY_TERM";
}
Glaemscribe.IfTree.MacroDeployTerm.prototype.is_macro_deploy = function()
{
  return true;
}
      
/* ================ */

Glaemscribe.IfTree.CodeBlock = function(parent_if_cond)
{
  this.parent_if_cond = parent_if_cond;
  this.terms          = [];
  return this;
}

Glaemscribe.IfTree.CodeBlock.prototype.dump = function(level)
{
  var str = "";
  for(var i=0;i<level;i++)
    str += " ";
  str += "|-BLOCK"; 
  console.log(str);
  
  for(var t=0;t<this.terms.length; t++)
    this.terms[t].dump(level+1);
}



/*
  Adding api/eval.js 
*/


Glaemscribe.Eval = {}
Glaemscribe.Eval.Token = function(name, expression)
{
  this.name       = name;
  this.expression = expression;
}
Glaemscribe.Eval.Token.prototype.is_regexp = function()
{
  return (this.expression instanceof RegExp);
}
Glaemscribe.Eval.Token.prototype.clone = function(value)
{
  var t = new Glaemscribe.Eval.Token(this.name, this.expression);
  t.value = value;
  return t;
}

Glaemscribe.Eval.Lexer = function(exp) {
  this.exp            = exp;
  this.token_chain    = [];
  this.retain_last    = false
}
Glaemscribe.Eval.Lexer.prototype.uneat = function()
{
  this.retain_last = true;
}
Glaemscribe.Eval.Lexer.prototype.EXP_TOKENS = [
  new Glaemscribe.Eval.Token("bool_or",      "||"),
  new Glaemscribe.Eval.Token("bool_and",     "&&"),
  new Glaemscribe.Eval.Token("cond_inf_eq",  "<="),
  new Glaemscribe.Eval.Token("cond_inf",     "<"),
  new Glaemscribe.Eval.Token("cond_sup_eq",  ">="),
  new Glaemscribe.Eval.Token("cond_sup",     ">"),
  new Glaemscribe.Eval.Token("cond_eq",      "=="),
  new Glaemscribe.Eval.Token("cond_not_eq",  "!="),
  new Glaemscribe.Eval.Token("add_plus",     "+"),
  new Glaemscribe.Eval.Token("add_minus",    "-"),
  new Glaemscribe.Eval.Token("mult_times",   "*"),
  new Glaemscribe.Eval.Token("mult_div",     "/"),
  new Glaemscribe.Eval.Token("mult_modulo",  "%"),
  new Glaemscribe.Eval.Token("prim_not",     "!"),
  new Glaemscribe.Eval.Token("prim_lparen",  "("),
  new Glaemscribe.Eval.Token("prim_rparen",  ")"),
  new Glaemscribe.Eval.Token("prim_string",  /^'[^']*'/),
  new Glaemscribe.Eval.Token("prim_string",  /^"[^"]*"/),
  new Glaemscribe.Eval.Token("prim_const",   /^[a-zA-Z0-9_.]+/)
];   
Glaemscribe.Eval.Lexer.prototype.TOKEN_END = new Glaemscribe.Eval.Token("prim_end","");

Glaemscribe.Eval.Lexer.prototype.advance = function()
{
  this.exp = this.exp.trim();
    
  if(this.retain_last == true) 
  {
    this.retain_last = false
    return this.token_chain[this.token_chain.length-1];
  }
  
  if(this.exp == Glaemscribe.Eval.Lexer.prototype.TOKEN_END.expression)
  {
    var t = Glaemscribe.Eval.Lexer.prototype.TOKEN_END.clone("");
    this.token_chain.push(t);
    return t;
  }
  
  for(var t=0;t<Glaemscribe.Eval.Lexer.prototype.EXP_TOKENS.length;t++)
  {
    var token = Glaemscribe.Eval.Lexer.prototype.EXP_TOKENS[t];
    if(token.is_regexp())
    {
      var match = this.exp.match(token.expression);
      if(match)
      {
        var found = match[0];
        this.exp  = this.exp.substring(found.length);
        var t     = token.clone(found);
        this.token_chain.push(t);
        return t;
      }
    }
    else
    {
      if(this.exp.indexOf(token.expression) == 0)
      {
        this.exp = this.exp.substring(token.expression.length);
        var t    = token.clone(token.expression);
        this.token_chain.push(t);
        return t;        
      }
    }
  }
  
  throw "UnknownToken";    
}

Glaemscribe.Eval.Parser = function() {}
Glaemscribe.Eval.Parser.prototype.parse = function(exp, vars)
{  
  this.lexer  = new Glaemscribe.Eval.Lexer(exp);
  this.vars   = vars;
  return this.parse_top_level();
}

Glaemscribe.Eval.Parser.prototype.parse_top_level = function()
{
  return this.explore_bool();
}

Glaemscribe.Eval.Parser.prototype.explore_bool = function()
{
  var v     = this.explore_compare();
  var stop  = false
  while(!stop)
  {
    switch(this.lexer.advance().name)
    {
    case 'bool_or':
      if(v == true)
        this.explore_bool();
      else
        v = this.explore_compare();
      break;
    case 'bool_and':
      if(!v == true)
        this.explore_bool(); 
      else
        v = this.explore_compare();
      break;
    default:
      stop = true;
    }
  }      
  this.lexer.uneat(); // Keep the unused token for the higher level
  return v;
}

Glaemscribe.Eval.Parser.prototype.explore_compare = function()
{
  var v = this.explore_add();
  var stop = false;
  while(!stop)
  {
    switch(this.lexer.advance().name)
    {
      case 'cond_inf_eq': v = (v <= this.explore_add() ); break;
      case 'cond_inf':    v = (v <  this.explore_add() ); break;
      case 'cond_sup_eq': v = (v >= this.explore_add() ); break;
      case 'cond_sup':    v = (v >  this.explore_add() ); break;
      case 'cond_eq':     v = (v == this.explore_add() ); break;
      case 'cond_not_eq': v = (v != this.explore_add() ); break;
      default: stop = true; break;
    }
  }
  this.lexer.uneat();
  return v;
}



Glaemscribe.Eval.Parser.prototype.explore_add = function()
{
  var v = this.explore_mult();
  var stop = false;
  while(!stop) {
    switch(this.lexer.advance().name)
    {
      case 'add_plus':  v += this.explore_mult(); break;
      case 'add_minus': v -= this.explore_mult(); break;
      default: stop = true; break;
    }
  }
  this.lexer.uneat(); // Keep the unused token for the higher level
  return v;
}

Glaemscribe.Eval.Parser.prototype.explore_mult = function()
{
  var v = this.explore_primary();
  var stop = false;
  while(!stop) {
    switch(this.lexer.advance().name)
    {
      case 'mult_times':    v *= this.explore_primary(); break;
      case 'mult_div':      v /= this.explore_primary(); break;
      case 'mult_modulo':   v %= this.explore_primary(); break;
      default: stop = true; break;
    }
  }
  this.lexer.uneat(); // Keep the unused token for the higher level
  return v;
}


Glaemscribe.Eval.Parser.prototype.explore_primary = function()
{
  var token = this.lexer.advance();
  var v     = null;
  switch(token.name)
  {
    case 'prim_const':  v = this.cast_constant(token.value); break;
    case 'add_minus':   v = -this.explore_primary(); break; // Allow the use of - as primary token for negative numbers
    case 'prim_not':    v = !this.explore_primary(); break; // Allow the use of ! for booleans
    case 'prim_lparen':   
    
      v               = this.parse_top_level();
      var rtoken      = this.lexer.advance(); 
    
      if(rtoken.name != 'prim_rparen') 
        throw "Missing right parenthesis."; 
    
      break;
    default:
      throw "Cannot understand: " + token.value + ".";
      break;
  }
  return v;
}

Glaemscribe.Eval.Parser.prototype.constant_is_float = function(cst)
{
  if(isNaN(cst))
    return false;
  
  return  Number(cst) % 1 !== 0;  
}

Glaemscribe.Eval.Parser.prototype.constant_is_int = function(cst)
{
  if(isNaN(cst))
    return false;
  
  return Number(cst) % 1 === 0;
}

Glaemscribe.Eval.Parser.prototype.constant_is_string = function(cst)
{
  if(cst.length < 2)
    return false;
  
  var f = cst[0]
  var l = cst[cst.length-1]
  
  return ( f == l && (l == "'" || l == '"') );
}

Glaemscribe.Eval.Parser.prototype.cast_constant = function(cst)
{
  var match = null;
  
  if(this.constant_is_int(cst))
    return parseInt(cst);
  else if(this.constant_is_float(cst))
    return parseFloat(cst);
  else if(match = cst.match(/^\'(.*)\'$/))
    return match[0];
  else if(match = cst.match(/^\"(.*)\"$/))
    return match[0];
  else if(cst == 'true')
    return true;
  else if(cst == 'false')
    return false;
  else if(cst == 'nil')
    return null;
  else if(this.vars[cst] != null)
    return this.vars[cst];
  else
    throw "Cannot understand constant '" + cst + "'.";          
}



/*
  Adding api/transcription_tree_node.js 
*/


Glaemscribe.TranscriptionTreeNode = function(character,replacement,path) {
  var tree_node         = this;
  tree_node.character   = character;
  tree_node.replacement = replacement;
  tree_node.path        = path;
  tree_node.siblings    = {}
}

Glaemscribe.TranscriptionTreeNode.prototype.is_effective = function() {
  return this.replacement != null;
}

Glaemscribe.TranscriptionTreeNode.prototype.add_subpath = function(source, rep, path) {
  if(source == null || source == "")
    return;
  
  var tree_node     = this;
  var cc            = source[0];
  var sibling       = tree_node.siblings[cc];
  var path_to_here  = (path || "") + cc;
  
  if(sibling == null)
    sibling = new Glaemscribe.TranscriptionTreeNode(cc,null,path_to_here);
    
  tree_node.siblings[cc] = sibling;
  
  if(source.length == 1)
    sibling.replacement = rep;
  else
    sibling.add_subpath(source.substring(1),rep,path_to_here);
}

Glaemscribe.TranscriptionTreeNode.prototype.transcribe = function(string, chain) {
  
  if(chain == null)
    chain = [];
  
  chain.push(this);

  if(string != "")
  {
    var cc = string[0];
    var sibling = this.siblings[cc];
    
    if(sibling)
      return sibling.transcribe(string.substring(1), chain);
  }
  
  // We are at the end of the chain
  while(chain.length > 1) {
    var last_node = chain.pop();
    if(last_node.is_effective())
      return [last_node.replacement, chain.length] 
  }
  
  // Only the root node is in the chain, we could not find anything; return the "unknown char"
  return [["*UNKNOWN"], 1]; 
}


/*
  Adding api/transcription_pre_post_processor.js 
*/


// ====================== //
//      OPERATORS         //
// ====================== //

Glaemscribe.PrePostProcessorOperator = function(mode, glaeml_element)
{
  this.mode           = mode;
  this.glaeml_element = glaeml_element;
  
  return this;
}
Glaemscribe.PrePostProcessorOperator.prototype.apply = function(l)
{
  throw "Pure virtual method, should be overloaded.";
}
Glaemscribe.PrePostProcessorOperator.prototype.eval_arg = function(arg, trans_options) {
  if(arg == null)
    return null;
  
  var rmatch = null;
  if( rmatch = arg.match(/^\\eval\s/) )
  {
    var to_eval = arg.substring( rmatch[0].length ); 
    return new Glaemscribe.Eval.Parser().parse(to_eval, trans_options);   
  }
  return arg;
}
Glaemscribe.PrePostProcessorOperator.prototype.finalize_glaeml_element = function(ge, trans_options) {
  var op = this;
  
  for(var i=0;i<ge.args.length;i++)
    ge.args[i] = op.eval_arg(ge.args[i], trans_options);

  glaemEach(ge.children, function(idx, child) {
    op.finalize_glaeml_element(child, trans_options);
  });
  return ge;
}
Glaemscribe.PrePostProcessorOperator.prototype.finalize = function(trans_options) {
  var op = this;
  
  // Deep copy the glaeml_element so we can safely eval the inner args
  op.finalized_glaeml_element = op.finalize_glaeml_element(op.glaeml_element.clone(), trans_options);
}

// Inherit from PrePostProcessorOperator
Glaemscribe.PreProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PrePostProcessorOperator.call(this, mode, glaeml_element);
  return this;
}
Glaemscribe.PreProcessorOperator.inheritsFrom( Glaemscribe.PrePostProcessorOperator );  

// Inherit from PrePostProcessorOperator
Glaemscribe.PostProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PrePostProcessorOperator.call(this, mode, glaeml_element);
  return this;
} 
Glaemscribe.PostProcessorOperator.inheritsFrom( Glaemscribe.PrePostProcessorOperator );  


// =========================== //
//      PRE/POST PROCESSORS    //
// =========================== //

Glaemscribe.TranscriptionPrePostProcessor = function(mode)
{
  this.mode             = mode;
  this.root_code_block  = new Glaemscribe.IfTree.CodeBlock(); 
  return this;
}

Glaemscribe.TranscriptionPrePostProcessor.prototype.finalize = function(options)
{
  this.operators = []
  this.descend_if_tree(this.root_code_block, options);
  
  glaemEach(this.operators, function(op_num, op) {
    op.finalize(options);
  });
}

Glaemscribe.TranscriptionPrePostProcessor.prototype.descend_if_tree = function(code_block, options)
{
  for(var t=0; t < code_block.terms.length; t++)
  {
    var term = code_block.terms[t];
           
    if(term.is_pre_post_processor_operators())
    {
      for(var o=0; o<term.operators.length; o++)
      {
        var operator = term.operators[o];
        this.operators.push(operator);
      } 
    }
    else
    { 
      for(var i=0; i < term.if_conds.length; i++)
      {
        var if_cond = term.if_conds[i];
        var if_eval = new Glaemscribe.Eval.Parser();
        
        // TODO: CONTEXT VARS!!
        if(if_eval.parse(if_cond.expression, options) == true)
        {
          this.descend_if_tree(if_cond.child_code_block, options)
          break; // Don't try other conditions! 
        }
      }        
    }
  }
}

// PREPROCESSOR
// Inherit from TranscriptionPrePostProcessor; a bit more verbose than in ruby ...
Glaemscribe.TranscriptionPreProcessor = function(mode)  
{
  Glaemscribe.TranscriptionPrePostProcessor.call(this, mode);
  return this;
} 
Glaemscribe.TranscriptionPreProcessor.inheritsFrom( Glaemscribe.TranscriptionPrePostProcessor ); 

Glaemscribe.TranscriptionPreProcessor.prototype.apply = function(l)
{
  var ret = l
  
  for(var i=0;i<this.operators.length;i++)
  {
    var operator  = this.operators[i];
    ret       = operator.apply(ret);
  }
  
  return ret;
}   

// POSTPROCESSOR
// Inherit from TranscriptionPrePostProcessor; a bit more verbose than in ruby ...
Glaemscribe.TranscriptionPostProcessor = function(mode)  
{
  Glaemscribe.TranscriptionPrePostProcessor.call(this, mode);
  return this;
} 
Glaemscribe.TranscriptionPostProcessor.inheritsFrom( Glaemscribe.TranscriptionPrePostProcessor ); 

Glaemscribe.TranscriptionPostProcessor.prototype.apply = function(tokens, out_charset)
{
  var out_space_str     = " ";

  for(var i=0;i<this.operators.length;i++)
  {
    var operator  = this.operators[i];
    tokens        = operator.apply(tokens, out_charset);
  }

  if(this.out_space != null)
  {
    out_space_str       = this.out_space.map(function(token) { return out_charset.n2c(token).output() }).join("");
  }

  // Convert output
  var ret = "";
  for(var t=0;t<tokens.length;t++)
  {
    var token = tokens[t];
    switch(token)
    {
    case "":
      break;
    case "*UNKNOWN":
      ret += Glaemscribe.UNKNOWN_CHAR_OUTPUT;
      break;
    case "*SPACE":
      ret += out_space_str;
      break;
    case "*LF":
      ret += "\n";
    default:
      var c = out_charset.n2c(token);
      if(!c)
        ret += Glaemscribe.UNKNOWN_CHAR_OUTPUT; // Should not happen
      else
        ret += c.output();
    }    
  }
 
  return ret;
}   

 
 

/*
  Adding api/transcription_processor.js 
*/


Glaemscribe.TranscriptionProcessor = function(mode)
{
  this.mode         = mode;
  this.rule_groups  = {};
  
  return this;
}

Glaemscribe.TranscriptionProcessor.prototype.finalize = function(options) {
  
  var processor = this;
  var mode = this.mode;
    
  processor.transcription_tree = new Glaemscribe.TranscriptionTreeNode(null,null,"");
  processor.transcription_tree.add_subpath(Glaemscribe.WORD_BOUNDARY_TREE,  [""]);
  processor.transcription_tree.add_subpath(Glaemscribe.WORD_BREAKER,        [""]);
  
  glaemEach(this.rule_groups, function(gname,rg) {
    rg.finalize(options);
  });
  
  // Build the input charsets
  processor.in_charset = {}
  
  glaemEach(this.rule_groups, function(gname, rg) {
    glaemEach(rg.in_charset, function(char, group) {
      
      var group_for_char  = processor.in_charset[char];
           
      if(group_for_char != null)
        mode.errors.push(new Glaemscribe.Glaeml.Error(0, "Group " + gname + " uses input character " + char + " which is also used by group " + group_for_char.name + ". Input charsets should not intersect between groups.")); 
      else
        processor.in_charset[char] = group;
      
    })
  });
  
  glaemEach(this.rule_groups, function(gname, rg) {
    for(var r=0;r<rg.rules.length;r++)
    {
      var rule = rg.rules[r];
      
      for(var sr=0;sr<rule.sub_rules.length;sr++)
      {  
        var sub_rule = rule.sub_rules[sr];
        processor.add_subrule(sub_rule);    
      }  
    }
  });

}

Glaemscribe.TranscriptionProcessor.prototype.add_subrule = function(sub_rule) {
  var path = sub_rule.src_combination.join("");
  this.transcription_tree.add_subpath(path, sub_rule.dst_combination)
}


Glaemscribe.TranscriptionProcessor.prototype.apply = function(l, debug_context) {
      
  var ret               = [];
  var current_group     = null;
  var accumulated_word  = "";
  
  var chars             = l.split("");
  for(var i=0;i<chars.length;i++)
  {
    var c = chars[i];
    switch(c)
    {
      case " ":
      case "\t":
        ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
        ret = ret.concat("*SPACE");
            
        accumulated_word = "";
        break;
      case "\r":
        // ignore
        break;
      case "\n":
        ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
        ret = ret.concat("*LF");
        
        accumulated_word = ""
        break;
      default:
        var c_group = this.in_charset[c];
        if(c_group == current_group)
          accumulated_word += c;
        else
        {
          ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
          current_group    = c_group;
          accumulated_word = c;
        }
        break;
    }
    
  }
  // End of stirng
  ret = ret.concat(this.transcribe_word(accumulated_word, debug_context));
  return ret;
}

Glaemscribe.TranscriptionProcessor.prototype.transcribe_word = function(word, debug_context) {
  
  var processor = this;
    
  var res = [];
  var word = Glaemscribe.WORD_BOUNDARY_TREE + word + Glaemscribe.WORD_BOUNDARY_TREE;

  while(word.length != 0)
  {    
    // Explore tree
    var ttret = this.transcription_tree.transcribe(word);   
      
    // r is the replacement, len its length
    var tokens    = ttret[0];
    var len       = ttret[1];   
    var eaten     = word.substring(0,len);
    
    word          = word.substring(len); // eat len characters
    res           = res.concat(tokens);
    
    debug_context.processor_pathes.push([eaten, tokens, tokens]);
  }
  
  return res;
}
      

/*
  Adding api/pre_processor/downcase.js 
*/


Glaemscribe.DowncasePreProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PreProcessorOperator.call(this, mode, glaeml_element); //super
  return this;
} 
Glaemscribe.DowncasePreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.DowncasePreProcessorOperator.prototype.apply = function(str)
{
  return str.toLowerCase();
}  

Glaemscribe.resource_manager.register_pre_processor_class("downcase", Glaemscribe.DowncasePreProcessorOperator);    


/*
  Adding api/pre_processor/rxsubstitute.js 
*/


// Inherit from PrePostProcessorOperator
Glaemscribe.RxSubstitutePreProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PreProcessorOperator.call(this, mode, glaeml_element); //super
  return this;
} 
Glaemscribe.RxSubstitutePreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.RxSubstitutePreProcessorOperator.prototype.finalize = function(trans_options) {
  
  Glaemscribe.PreProcessorOperator.prototype.finalize.call(this, trans_options); // super
  
  // Ruby uses \1, \2, etc for captured expressions. Convert to javascript. 
  this.finalized_glaeml_element.args[1] = this.finalized_glaeml_element.args[1].replace(/(\\\d)/g,function(cap) { return "$" + cap.replace("\\","")});  
}

Glaemscribe.RxSubstitutePreProcessorOperator.prototype.apply = function(str)
{
  var what  = new RegExp(this.finalized_glaeml_element.args[0],"g");
  var to    = this.finalized_glaeml_element.args[1];

  return str.replace(what,to);
}  

Glaemscribe.resource_manager.register_pre_processor_class("rxsubstitute", Glaemscribe.RxSubstitutePreProcessorOperator);    


/*
  Adding api/pre_processor/substitute.js 
*/


// Inherit from PrePostProcessorOperator
Glaemscribe.SubstitutePreProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PreProcessorOperator.call(this, mode, glaeml_element); //super
  return this;
} 
Glaemscribe.SubstitutePreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.SubstitutePreProcessorOperator.prototype.apply = function(str)
{
  //This is bad to use a regexp if there are special chars like '*'
  //var what  = new RegExp(this.finalized_glaeml_element.args[0],"g");
  //var to    = this.finalized_glaeml_element.args[1];
  //return str.replace(what,to);

  var inSource      = str;
  var inToReplace   = this.finalized_glaeml_element.args[0];
  var inReplaceWith = this.finalized_glaeml_element.args[1];
  
  var outString = [];
  var repLen = inToReplace.length;
  var idx = inSource.indexOf(inToReplace);
  while (idx !== -1) {
    outString.push(inSource.substring(0, idx))
    outString.push(inReplaceWith);

    inSource = inSource.substring(idx + repLen);
    idx = inSource.indexOf(inToReplace);
  }
  outString.push(inSource);
  return outString.join("");
}  

Glaemscribe.resource_manager.register_pre_processor_class("substitute", Glaemscribe.SubstitutePreProcessorOperator);    


/*
  Adding api/pre_processor/up_down_tehta_split.js 
*/


// Inherit from PrePostProcessorOperator
Glaemscribe.UpDownTehtaSplitPreProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PreProcessorOperator.call(this, mode, glaeml_element); //super
  return this;
} 
Glaemscribe.UpDownTehtaSplitPreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.finalize = function(trans_options) {
  Glaemscribe.PreProcessorOperator.prototype.finalize.call(this, trans_options); // super
   
  var op    = this;
  var args  = op.finalized_glaeml_element.args; 
  
  var vowel_list      = args[0];
  var consonant_list  = args[1];
      
  vowel_list          = vowel_list.split(/,/).map(function(s) {return s.trim(); });
  consonant_list      = consonant_list.split(/,/).map(function(s) {return s.trim(); });
     
  this.vowel_map          = {}; // Recognize vowel tokens
  this.consonant_map      = {};// Recognize consonant tokens
  this.splitter_tree      = new Glaemscribe.TranscriptionTreeNode(null,null,""); // Recognize tokens
  this.word_split_map     = {};
  // The word split map will help to recognize words
  // The splitter tree will help to split words into tokens
  
  for(var vi=0;vi<vowel_list.length;vi++)
  {
    var v = vowel_list[vi];
    this.splitter_tree.add_subpath(v, v); 
    this.vowel_map[v] = v;
  }
  for(var ci=0;ci<consonant_list.length;ci++)
  {
    var c = consonant_list[ci];
    this.splitter_tree.add_subpath(c, c); 
    this.consonant_map[c] = c;
  }

  var all_letters = uniqueArray(vowel_list.concat(consonant_list).join("").split("").sort());

  for(var li=0;li<all_letters.length;li++)
  {
    var l = all_letters[li];
    this.word_split_map[l] = l;
  }    
   
}

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.type_of_token = function(token)
{
  if(this.vowel_map[token] != null)          return "V";
  if(this.consonant_map[token] != null)      return "C";
  return "X";
}

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.apply_to_word = function(w)
{
  var res = [];
   
  if(w.trim() == "")
    res.push(w);
  else
  {
    while(w.length != 0)
    {
      var ret = this.splitter_tree.transcribe(w)
      var r   = ret[0];
      var len = ret[1];   
      
      if (Array.isArray(r) && arrayEquals(r, [Glaemscribe.UNKNOWN_CHAR_OUTPUT])) {
        res.push(w[0]); 
      } else {
        res.push(r); 
      }
    
      w = w.substring(len);
    }
  }
    
    
  var res_modified = [];

  // We replace the pattern CVC by CvVC where v is a phantom vowel.
  // This makes the pattern CVC not possible.
  var i = 0
  while(i < res.length - 2)
  {
    var r0 = res[i];
    var r1 = res[i+1];
    var r2 = res[i+2];;
    var t0 = this.type_of_token(r0);
    var t1 = this.type_of_token(r1);
    var t2 = this.type_of_token(r2);
   
    if(t0 == "C" && t1 == "V" && t2 == "C")
    {
      res_modified.push(res[i]);
      res_modified.push("@");
      res_modified.push(res[i+1]); 
      i += 2;
    }
    else
    {   
      res_modified.push(res[i]);
      i += 1;
    }
  }

  // Add the remaining stuff
  while(i < res.length)
  {
    res_modified.push(res[i]);
    i += 1
  }
    
  return res_modified.join("")       
}

Glaemscribe.UpDownTehtaSplitPreProcessorOperator.prototype.apply = function(content)
{
  var accumulated_word = ""  
  var ret = ""
        
  var letters = content.split("");
  for(var li=0;li<letters.length;li++)
  {
    var letter = letters[li];
    if(this.word_split_map[letter] != null)
      accumulated_word += letter;
    else
    {
      ret += this.apply_to_word(accumulated_word);
      ret += letter;
      accumulated_word = "";
    }        
  }
  ret += this.apply_to_word(accumulated_word) 
  
  return ret;         
}  

Glaemscribe.resource_manager.register_pre_processor_class("up_down_tehta_split", Glaemscribe.UpDownTehtaSplitPreProcessorOperator);    



/*
  Adding api/pre_processor/elvish_numbers.js 
*/


Glaemscribe.ElvishNumbersPreProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PreProcessorOperator.call(this, mode, glaeml_element);
  return this;
}
Glaemscribe.ElvishNumbersPreProcessorOperator.inheritsFrom( Glaemscribe.PreProcessorOperator );  
Glaemscribe.ElvishNumbersPreProcessorOperator.prototype.apply = function(str)
{
  var op      = this;
  
  var base    = op.finalized_glaeml_element.args[0];
  base        = (base != null)?(parseInt(base)):(12);
  
  var reverse = op.finalized_glaeml_element.args[1]
  reverse     = (reverse != null)?(reverse == true || reverse == "true"):(true) 
  
  return str.replace(/\d+/g,function(match) {
    var inbase  = parseInt(match).toString(base);
    inbase      = inbase.toUpperCase(); // Beware, we want letters in upper case!
    
    var ret = '';
    if(reverse)
    {
      for(var i=inbase.length-1;i>=0;i--)
        ret += inbase[i];
    }
    else
    {
      ret = inbase;
    }
    
    return ret;
  });

}  

Glaemscribe.resource_manager.register_pre_processor_class("elvish_numbers", Glaemscribe.ElvishNumbersPreProcessorOperator);    


/*
  Adding api/post_processor/reverse.js 
*/


Glaemscribe.ReversePostProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PostProcessorOperator.call(this, mode, glaeml_element); //super
  return this;
} 
Glaemscribe.ReversePostProcessorOperator.inheritsFrom( Glaemscribe.PostProcessorOperator );  

Glaemscribe.ReversePostProcessorOperator.prototype.apply = function(tokens, charset)
{
  return tokens.reverse();
}  

Glaemscribe.resource_manager.register_post_processor_class("reverse", Glaemscribe.ReversePostProcessorOperator);    


/*
  Adding api/post_processor/resolve_virtuals.js 
*/



Glaemscribe.ResolveVirtualsPostProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PostProcessorOperator.call(this, mode, glaeml_element); //super
  return this;
} 
Glaemscribe.ResolveVirtualsPostProcessorOperator.inheritsFrom( Glaemscribe.PostProcessorOperator );  


Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.finalize = function(trans_options)
{
  Glaemscribe.PostProcessorOperator.prototype.finalize.call(this, trans_options); // super
  this.last_triggers = {}; // Allocate here to optimize
}  

Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.reset_trigger_states = function(charset) {
  var op = this;
  glaemEach(charset.virtual_chars, function(idx,vc) {
    vc.object_reference                   = idx; // We cannot objects as references in hashes in js. Attribute a reference.
    op.last_triggers[vc.object_reference] = null; // Clear the state
  });
}

Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.apply_loop = function(charset, tokens, new_tokens, reversed, token, idx) {
  var op = this;
  if(token == '*SPACE' || token == '*LF') {
    op.reset_trigger_states(charset);
    return; // continue
  }
  var c = charset.n2c(token);

  if(c == null)
    return;
  
  if(c.is_virtual() && (reversed == c.reversed)) {
    
    // Try to replace
    var last_trigger = op.last_triggers[c.object_reference];
    if(last_trigger != null) {
      new_tokens[idx] = last_trigger.names[0]; // Take the first name of the non-virtual replacement.
      token = new_tokens[idx]; // Consider the token replaced, being itself a potential trigger for further virtuals (cascading virtuals)
    };
  }

  // Update states of virtual classes
  glaemEach(charset.virtual_chars, function(_,vc) {
    var rc = vc.n2c(token);
    if(rc != null)
      op.last_triggers[vc.object_reference] = rc;
  });
}


Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.apply_sequences = function(charset,tokens) {
  var ret = [];
  glaemEach(tokens, function(_, token) {
    var c = charset.n2c(token);
    if(c && c.is_sequence())
      Array.prototype.push.apply(ret,c.sequence);
    else
      ret.push(token);
  });
  return ret;
}

Glaemscribe.ResolveVirtualsPostProcessorOperator.prototype.apply = function(tokens, charset) {   
  var op = this;
  
  tokens = op.apply_sequences(charset, tokens);
  
  // Clone the array so that we can perform diacritics and ligatures without interfering
  var new_tokens = tokens.slice(0);
  
  op.reset_trigger_states(charset);
  glaemEach(tokens, function(idx,token) {
    op.apply_loop(charset,tokens,new_tokens,false,token,idx);
  });
  
  op.reset_trigger_states(charset);
  glaemEachReversed(tokens, function(idx,token) {
    op.apply_loop(charset,tokens,new_tokens,true,token,idx);    
  });
  return new_tokens;
}  

Glaemscribe.resource_manager.register_post_processor_class("resolve_virtuals", Glaemscribe.ResolveVirtualsPostProcessorOperator);    



/*
  Adding api/post_processor/outspace.js 
*/


/*
  A post processor operator to replace the out_space on the fly.
  This has the same effect as the \outspace parameter
  But can be included in the postprocessor and benefit from the if/then logic
*/

Glaemscribe.OutspacePostProcessorOperator = function(mode, glaeml_element)
{
  Glaemscribe.PostProcessorOperator.call(this, mode, glaeml_element); //super
  
  this.out_space  = stringListToCleanArray(glaeml_element.args[0], /\s/);
  
  return this;
} 
Glaemscribe.OutspacePostProcessorOperator.inheritsFrom( Glaemscribe.PostProcessorOperator );  

Glaemscribe.OutspacePostProcessorOperator.prototype.apply = function(tokens, charset)
{
  this.mode.post_processor.out_space = this.out_space;
  return tokens;
}  

Glaemscribe.resource_manager.register_post_processor_class("outspace", Glaemscribe.OutspacePostProcessorOperator);    


/*
  Adding extern/object-clone.js 
*/
/*
 * $Id: object-clone.js,v 0.41 2013/03/27 18:29:04 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 */

(function(global) {
    'use strict';
    if (!Object.freeze || typeof Object.freeze !== 'function') {
        throw Error('ES5 support required');
    }
    // from ES5
    var O = Object, OP = O.prototype,
    create = O.create,
    defineProperty = O.defineProperty,
    defineProperties = O.defineProperties,
    getOwnPropertyNames = O.getOwnPropertyNames,
    getOwnPropertyDescriptor = O.getOwnPropertyDescriptor,
    getPrototypeOf = O.getPrototypeOf,
    freeze = O.freeze,
    isFrozen = O.isFrozen,
    isSealed = O.isSealed,
    seal = O.seal,
    isExtensible = O.isExtensible,
    preventExtensions = O.preventExtensions,
    hasOwnProperty = OP.hasOwnProperty,
    toString = OP.toString,
    isArray = Array.isArray,
    slice = Array.prototype.slice;
    // Utility functions; some exported
    function defaults(dst, src) {
        getOwnPropertyNames(src).forEach(function(k) {
            if (!hasOwnProperty.call(dst, k)) defineProperty(
                dst, k, getOwnPropertyDescriptor(src, k)
            );
        });
        return dst;
    };
    var isObject = function(o) { return o === Object(o) };
    var isPrimitive = function(o) { return o !== Object(o) };
    var isFunction = function(f) { return typeof(f) === 'function' };
    var signatureOf = function(o) { return toString.call(o) };
    var HASWEAKMAP = (function() { // paranoia check
        try {
            var wm = new WeakMap();
            wm.set(wm, wm);
            return wm.get(wm) === wm;
        } catch(e) {
            return false;
        }
    })();
    // exported
    function is (x, y) {
        return x === y
            ? x !== 0 ? true
            : (1 / x === 1 / y) // +-0
        : (x !== x && y !== y); // NaN
    };
    function isnt (x, y) { return !is(x, y) };
    var defaultCK = {
        descriptors:true,
        extensibility:true,
        enumerator:getOwnPropertyNames
    };
    function equals (x, y, ck) {
        var vx, vy;
        if (HASWEAKMAP) {
            vx = new WeakMap();
            vy = new WeakMap();
        }
        ck = defaults(ck || {}, defaultCK);
        return (function _equals(x, y) {
            if (isPrimitive(x)) return is(x, y);
            if (isFunction(x))  return is(x, y);
            // check deeply
            var sx = signatureOf(x), sy = signatureOf(y);
            var i, l, px, py, sx, sy, kx, ky, dx, dy, dk, flt;
            if (sx !== sy) return false;
            switch (sx) {
            case '[object Array]':
            case '[object Object]':
                if (ck.extensibility) {
                    if (isExtensible(x) !== isExtensible(y)) return false;
                    if (isSealed(x) !== isSealed(y)) return false;
                    if (isFrozen(x) !== isFrozen(y)) return false;
                }
                if (vx) {
                    if (vx.has(x)) {
                        // console.log('circular ref found');
                        return vy.has(y);
                    }
                    vx.set(x, true);
                    vy.set(y, true);
                }
                px = ck.enumerator(x);
                py = ck.enumerator(y);
                if (ck.filter) {
                    flt = function(k) {
                        var d = getOwnPropertyDescriptor(this, k);
                        return ck.filter(d, k, this);
                    };
                    px = px.filter(flt, x);
                    py = py.filter(flt, y);
                }
                if (px.length != py.length) return false;
                px.sort(); py.sort();
                for (i = 0, l = px.length; i < l; ++i) {
                    kx = px[i];
                    ky = py[i];
                    if (kx !== ky) return false;
                    dx = getOwnPropertyDescriptor(x, ky);
                    dy = getOwnPropertyDescriptor(y, ky);
                    if ('value' in dx) {
                        if (!_equals(dx.value, dy.value)) return false;
                    } else {
                        if (dx.get && dx.get !== dy.get) return false;
                        if (dx.set && dx.set !== dy.set) return false;
                    }
                    if (ck.descriptors) {
                        if (dx.enumerable !== dy.enumerable) return false;
                        if (ck.extensibility) {
                            if (dx.writable !== dy.writable)
                                return false;
                            if (dx.configurable !== dy.configurable)
                                return false;
                        }
                    }
                }
                return true;
            case '[object RegExp]':
            case '[object Date]':
            case '[object String]':
            case '[object Number]':
            case '[object Boolean]':
                return ''+x === ''+y;
            default:
                throw TypeError(sx + ' not supported');
            }
        })(x, y);
    }
    function clone(src, deep, ck) {
        var wm;
        if (deep && HASWEAKMAP) {
            wm = new WeakMap();
        }
        ck = defaults(ck || {}, defaultCK);
        return (function _clone(src) {
            // primitives and functions
            if (isPrimitive(src)) return src;
            if (isFunction(src)) return src;
            var sig = signatureOf(src);
            switch (sig) {
            case '[object Array]':
            case '[object Object]':
                if (wm) {
                    if (wm.has(src)) {
                        // console.log('circular ref found');
                        return src;
                    }
                    wm.set(src, true);
                }
                var isarray = isArray(src);
                var dst = isarray ? [] : create(getPrototypeOf(src));
                ck.enumerator(src).forEach(function(k) {
                    // Firefox forbids defineProperty(obj, 'length' desc)
                    if (isarray && k === 'length') {
                        dst.length = src.length;
                    } else {
                        if (ck.descriptors) {
                            var desc = getOwnPropertyDescriptor(src, k);
                            if (ck.filter && !ck.filter(desc, k, src)) return;
                            if (deep && 'value' in desc)
                                desc.value = _clone(src[k]);
                            defineProperty(dst, k, desc);
                        } else {
                            dst[k] = _clone(src[k]);
                        }
                    }
                });
                if (ck.extensibility) {
                    if (!isExtensible(src)) preventExtensions(dst);
                    if (isSealed(src)) seal(dst);
                    if (isFrozen(src)) freeze(dst);
                }
                return dst;
            case '[object RegExp]':
            case '[object Date]':
            case '[object String]':
            case '[object Number]':
            case '[object Boolean]':
                return deep ? new src.constructor(src.valueOf()) : src;
            default:
                throw TypeError(sig + ' is not supported');
            }
        })(src);
    };
    //  Install
    var obj2specs = function(src) {
        var specs = create(null);
        getOwnPropertyNames(src).forEach(function(k) {
            specs[k] = {
                value: src[k],
                configurable: true,
                writable: true,
                enumerable: false
            };
        });
        return specs;
    };
    var defaultProperties = function(dst, descs) {
        getOwnPropertyNames(descs).forEach(function(k) {
            if (!hasOwnProperty.call(dst, k)) defineProperty(
                dst, k, descs[k]
            );
        });
        return dst;
    };
    (Object.installProperties || defaultProperties)(Object, obj2specs({
        // Avoid conflicts with other projects, rename glaem_clone
        glaem_clone: clone,
        // is: is,
        // isnt: isnt,
        // equals: equals
    }));
})(this);


/*
  Adding ../lib_espeak/glaemscribe_tts.js 
*/
/*

Glǽmscribe (also written Glaemscribe) is a software dedicated to
the transcription of texts between writing systems, and more
specifically dedicated to the transcription of J.R.R. Tolkien's
invented languages to some of his devised writing systems.

Copyright (C) 2015-2020 Benjamin Babut (Talagan).

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


// A wrapper around espeak to perform various TTS tasks,
// and generate IPA and/or WAV while keeping punctuation signs or cleaning them up.
//
// Espeak does not have this feature, so this is a significantly dirty hack.
//
// Additionally we perform a few glaemscribe-specific tasks, such as preserving raw tengwar
// or numbers which are treated independently.

// For the ruby loader, define the Glaemscribe module.
Glaemscribe = (typeof(Glaemscribe) === 'undefined')?({}):(Glaemscribe);

Glaemscribe.TTS = function() {

  var client = this;
  client.proxy = new ESpeakNGGlue();
}

Glaemscribe.TTS.ipa_configurations = {
  'en-tengwar': {

    punct_token: '', // Invariant, for punctuation
    block_token: '', // Invariant, for special blocks (nums / raw tengwar)

    // Replace by special token AND KEEP when calculating ipa
    clauseaffecting_punctuation: "!.,;:!?–—",
    // Replace by special token but do not keep when calculating ipa
    // '’ : apostrophes should stay in the original text !!! Don't break liz's bag !!
    // This is because apostrophes shouldn't trigger a pause in the prononciation (e.g. genitives)
    clauseunaffecting_punctuation: "·“”«»-[](){}<>≤≥$|\""
  }
}

Glaemscribe.TTS.ipa_configurations['en-tengwar']         = Glaemscribe.TTS.ipa_configurations['en-tengwar'];
Glaemscribe.TTS.ipa_configurations['en-tengwar-rp']      = Glaemscribe.TTS.ipa_configurations['en-tengwar'];
Glaemscribe.TTS.ipa_configurations['en-tengwar-gb']      = Glaemscribe.TTS.ipa_configurations['en-tengwar'];
Glaemscribe.TTS.ipa_configurations['en-tengwar-us']      = Glaemscribe.TTS.ipa_configurations['en-tengwar'];


Glaemscribe.TTS.voice_list = function(voice) {
  return Object.keys(Glaemscribe.TTS.ipa_configurations);
}

// Static helper. To be used in pure js (not ruby).
Glaemscribe.TTS.option_name_to_voice = function(oname) {

  if(!oname)
    return null;

  return oname.toLowerCase().replace(/^espeak_voice_/,'').replace(/_/g,'-');
}


Glaemscribe.TTS.prototype.make_char_checker = function(string){
  var cc = {};
  for(var i=0;i<string.length;i++)
  {
    cc[string[i]] = string[i];
  }
  return cc;
}

Glaemscribe.TTS.prototype.isSpace = function(a) {
  return (a == ' ' || a == '\t');
}

Glaemscribe.TTS.prototype.read_cap_token = function(text, starti, cap_checker) {
  
  var client = this
  var i   = starti;
  var tok = "" 
  
  if(cap_checker[text[i]] == null)
    return null;

  i++;

  // Advance the sequence
  for(; i<text.length; i++) {
    if( (cap_checker[text[i]] == null) && !client.isSpace(text[i])) {
      break;
    }
  }
  
  // Rewind trailing spaces
  var toklen = i - starti;
  
  for(i = starti + toklen - 1; i>=starti ; i--) {
    if(client.isSpace(text[i]))
      toklen--;
    else
      break;
  }
  
  return text.substring(starti,starti+toklen);
};

Glaemscribe.TTS.prototype.preceded_by_space = function(text,i) {
  var client = this;
  
  if(i <= 0)
    return false;
  else
    return client.isSpace(text[i-1]);
}

Glaemscribe.TTS.prototype.succeeded_by_space = function(text,i) {
  var client = this;
  
  if(i >= text.length-1)
    return false;
  else
    return client.isSpace(text[i+1]);
}

// Escapes raw mode AND numbers
Glaemscribe.TTS.prototype.escape_special_blocks = function(voice, entry, for_ipa) {

  var config  = Glaemscribe.TTS.ipa_configurations[voice];

  // TODO : make this configurable
  var ipaexpr = /(\s*)({{[\s\S]*?}}|\b[0-9]+\b)(\s*)/g; // Tonekize raw + numbers, we don't want them to be converted in IPA
  var wavexpr = /(\s*)({{[\s\S]*?}})(\s*)/g;                      // Keep numbers
  var rawgexp = (for_ipa)?(ipaexpr):(wavexpr);

  var captured = [];

  var ret = entry.replace(rawgexp, function(match,p1,p2,p3) {

    captured.push(match);
    if(!for_ipa)
      return ' '; // For wav, just replace by empty space.
    else
      return p1 + config['block_token'] + p3;
  });

  return [ret, captured];
}

Glaemscribe.TTS.prototype.ipa_instrument_punct = function(voice, text) {

  var client = this;
  var config = Glaemscribe.TTS.ipa_configurations[voice];

  var cap = client.make_char_checker(config['clauseaffecting_punctuation']);
  var cup = client.make_char_checker(config['clauseunaffecting_punctuation']);

  var accum = "";
  var kept_signs = [];
  
  var rescap = null;
  	
	for(var i=0;i<text.length;i++)
  {
    if(text[i] == "\n")
    {
      accum += config['punct_token'];
      kept_signs.push(text[i]);
    }
    else if(cup[text[i]] != null || (text[i] == "'" && text[i+1] != "s")) 
    {
      // Clause non affecting sign : dirty hack for single quote apostrophes ...
      // Same thing but the difference is that we REMOVE the sign before calculating the IPA.
      // We will restore it after IPA calculation.
      accum += " " + config['punct_token'] + " " ;
      kept_signs.push( 
        ((client.preceded_by_space(text,i))?(" "):("")) + 
        text[i] + 
        ((client.succeeded_by_space(text,i))?(" "):("")) 
      );
    }
    else if(rescap = client.read_cap_token(text,i,cap)) // Clause affecting sign
    {      
      // Replace the sign by a special "word" / token AND keep the sign
      // Always insert spaces, but remember how they were placed
      accum += " " + config['punct_token'] + " " + text[i] + " ";
      kept_signs.push( 
        ((client.preceded_by_space(text, i))?(" "):("")) + 
        rescap + 
        ((client.succeeded_by_space(text, i + rescap.length - 1))?(" "):("")) 
      );
      i += rescap.length - 1;
    }
    else
    {
      accum += text[i];
    }
  }

  return [accum, kept_signs];
}

Glaemscribe.TTS.prototype.wav_instrument_punct = function(voice, text) {

  var client  = this;
  var config  = Glaemscribe.TTS.ipa_configurations[voice];
  var cap     =  client.make_char_checker(config['clauseaffecting_punctuation']);
  var accum   = "";
  var rescap  = null;
  	
	for(var i=0;i<text.length;i++)
  {
    if(rescap = client.read_cap_token(text,i,cap))
    {      
      accum += text[i]; // Just keep the first sign, ignore the others
      i += rescap.length - 1;
    }
    else
    {
      accum += text[i];
    }
  }

  return accum;
}

Glaemscribe.TTS.prototype.ipa_instrument_blocks = function(voice, text)
{
  var client = this;
  var config = Glaemscribe.TTS.ipa_configurations[voice];

  return this.escape_special_blocks(voice, text, true);
}

Glaemscribe.TTS.prototype.ipa_restore_tokens = function(text, token, kept_tokens) {
  
  var rx = new RegExp("\\s*(" + token + ")\\s*","g");

  var nth = -1;
  text = text.replace(rx,function(match, contents, offset, s) {
    nth += 1;
    return kept_tokens[nth];
  });
  
  return text;
}

Glaemscribe.TTS.prototype.post_ipa = function(voice, ipa, pre_ipa_res) {

  var client = this;
  var config = Glaemscribe.TTS.ipa_configurations[voice];
  ipa = ipa.replace(/\n/g," ");

  ipa = client.ipa_restore_tokens(ipa, config.punct_token, pre_ipa_res.punct_tokens);
  ipa = client.ipa_restore_tokens(ipa, config.block_token, pre_ipa_res.block_tokens);

  // Post-treatment of anti 'dot' pronounciation hack
  if(ipa[ipa.length-1] === "\n")
    ipa = ipa.slice(0,-1);

  return ipa
}


Glaemscribe.TTS.prototype.pre_ipa = function(args, voice, text) {

  var client = this;
  var config = Glaemscribe.TTS.ipa_configurations[voice];

  if(!config)
    throw "Trying to use unsupported voice '" + voice + "'!";

  // Normalize all tabs by spaces
  text = text.replace(/\t/g," ");
  // Small hack to prevent espeak from pronouncing last dot
  // since our tokenization may isolate it.
  text += "\n";

  // Instrument blocks first (they may contain punctuation)
  var bi            = client.ipa_instrument_blocks(voice,text);
  text              = bi[0];
    
  // Instrument punctuation, then
  var pi            = client.ipa_instrument_punct(voice,text);
  text              = pi[0];
  
  return {
    text: text,
    block_tokens: bi[1],
    punct_tokens: pi[1]
  }
}

Glaemscribe.TTS.prototype.pre_wav = function(args, voice, text) {
  var client = this;
  var config = Glaemscribe.TTS.ipa_configurations[voice];

  if(!config)
    throw "Trying to use unsupported voice '" + voice + "'!";
  
  // First, escape the special blocks. Just ignore them.
  if(args.has_raw_mode) {
    var pre_raw_res    = this.escape_special_blocks(voice, text, false);
    text               = pre_raw_res[0];
  }
  
  // Now simplify the punctuation to avoid problems.
  text = this.wav_instrument_punct(voice, text);
  
  return {
    text: text
  }
}

//////////////////
//  SYNTHESIZE  //
//////////////////


Glaemscribe.TTS.prototype.synthesize_ipa = function(text, args, onended) {

  var client      = this;
  args            = args || {};
  var voice       = args.voice  || 'en-tengwar'

  // Pre parse text and find raw mode things {{ ... }}
  // Cache them. This will also the pre-instrumentation
  // To treat each block as one word
  var pipa = client.pre_ipa(args, voice, text);
  text     = pipa['text'];

  // Now the IPA is instrumented.
  // Prepare client
  client.proxy.set_voice(voice);

  var ts = new Date();
  var ret = {};
  client.proxy.synthesize(text, false, true, true, function(result) {

    // Post parse ipa
    result.ipa            = client.post_ipa(voice, result.pho, pipa);

    var te = new Date();
    result.synthesis_time = (te - ts);
    delete result.pho;

    if(onended)
      onended(result);

    ret = result;
  });
  
  return ret;
}

// Should be kept separated from IPA, because we do not work on the same text
Glaemscribe.TTS.prototype.synthesize_wav = function(text, args, onended) {

  var client      = this;
  args            = args || {}
  var voice       = args.voice  || 'en-tengwar'

  // Pre-trandform text
  var pwav = client.pre_wav(args, voice, text);
  text = pwav['text'];

  // Prepare client
  client.proxy.set_rate(args.rate    || 120);
  client.proxy.set_pitch(args.pitch  || 5);
  client.proxy.set_voice(voice);

  var ts = new Date();
  var ret = {};
  client.proxy.synthesize(text, true, false, false, function(result) {
    var te = new Date();
    result.synthesis_time = (te - ts);
    delete result.pho;

    // Uint8Array > Array conversion, for ruby?
    // ret.wav = [].slice.call(ret.wav);

    if(onended)
      onended(result);

    ret = result;
  });

  return ret;
}

Glaemscribe.TTS.TokenType = {};
Glaemscribe.TTS.TokenType.WORD      = 'WORD';
Glaemscribe.TTS.TokenType.NON_WORD  = 'NON_WORD';
Glaemscribe.TTS.TokenType.NUM       = 'NUM';
Glaemscribe.TTS.TokenType.SPACE     = 'SPACE';
Glaemscribe.TTS.TokenType.PUNCT     = 'PUNCT';

Glaemscribe.TTS.prototype.orthographic_disambiguator_en = function(text) {
    
  var client = this;

  var uwmatcher = /(\p{L}+)/u;
  var spl       = text.split(uwmatcher);
  
  var tokens = spl.map(function(s) {
    var t       = {};
    var is_word = s.match(uwmatcher)
    
    t.type    = (is_word)?(Glaemscribe.TTS.TokenType.WORD):(Glaemscribe.TTS.TokenType.NON_WORD);
    t.content = s; 
    return t;
  }); 
  
  var tokens2 = [];

  // Handle apostrophe
  for(var i=0;i<tokens.length;i++) {
    if( i == 0 || i == tokens.length-1 || tokens[i].type == Glaemscribe.TTS.TokenType.WORD ) {
      tokens2.push(tokens[i]);      
      continue;
    }
    
    if(tokens[i].content == "'" && 
      tokens[i-1].type == Glaemscribe.TTS.TokenType.WORD && 
      tokens[i+1].type == Glaemscribe.TTS.TokenType.WORD ) 
    {
      tokens2.pop();
      var tok     = {};
      tok.type    = Glaemscribe.TTS.TokenType.WORD;
      tok.content = tokens[i-1].content + tokens[i].content + tokens[i+1].content;
      tokens2.push(tok);
      i += 1;
    }
    else {
      tokens2.push(tokens[i]);
    }
  }
  tokens = tokens2;
  
  // Numerize tokens
  var i = 0;
  tokens.forEach(function(t) {
    t.num = i;
    i += 1;
  });
  
  // Remove non-speechable tokens
  var stokens = tokens.filter(function(t) {
    return (t.type == Glaemscribe.TTS.TokenType.WORD);
  });
  
  // Join speachable tokens
  var r = stokens.map(function(t) { return t.content}).join('  ');
  
  var args  = {};
  var voice = args.voice  || 'en-tengwar';
  
  client.proxy.set_voice(voice);
  client.proxy.synthesize(r, false, true, true, function(result) {
    r = result.pho;
  });
  r = r.split('').map(function(t) { return t.trim() });

  var j = 0;
  r.forEach(function(w) {
    tokens[stokens[j].num].ipa = r[j];
    j += 1;
  });
  
  return tokens;
}

Glaemscribe.TTS.is_engine_loaded = function() {
  return (typeof(ESpeakNGGlue) !== 'undefined');
};

