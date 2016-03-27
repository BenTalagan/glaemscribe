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
    res.glaem_each(function(c,child_node) {
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
 
  doc.root_node.gpath("charset").glaem_each(function (ce, charset_element) {
    parser.validate_presence_of_args(charset_element, 2);        
  });
 
  doc.root_node.gpath("options.option").glaem_each(function (oe, option_element) {
    parser.validate_presence_of_args(option_element, 2);
    option_element.gpath("value").glaem_each(function (ve, value_element) {
      parser.validate_presence_of_args(value_element, 2);
    });
  });
  
  doc.root_node.gpath("processor.outspace").glaem_each(function (oe, outspace_element) {
    parser.validate_presence_of_args(outspace_element, 1);        
  });
  
  doc.root_node.gpath("processor.rules").glaem_each(function (re, rules_element) {
    parser.validate_presence_of_args(rules_element, 1);      
    parser.validate_presence_of_children(rules_element,"if",null,1);  
    parser.validate_presence_of_children(rules_element,"elsif",null,1);      
  });  

  doc.root_node.gpath("preprocessor.if").glaem_each(function (re, rules_element) { validate_presence_of_args(e,  1) }); 
  doc.root_node.gpath("preprocessor.elsif").glaem_each(function (re, rules_element) { validate_presence_of_args(e,  1) });   
  doc.root_node.gpath("postprocessor.if").glaem_each(function (re, rules_element) { validate_presence_of_args(e,  1) });  
  doc.root_node.gpath("postprocessor.elsif").glaem_each(function (re, rules_element) { validate_presence_of_args(e,  1) }); 
}   

Glaemscribe.ModeParser.prototype.create_if_cond_for_if_term = function(line, if_term, cond)
{
  var ifcond                          = new Glaemscribe.IfTree.IfCond(line, if_term, cond);
  var child_code_block                = new Glaemscribe.IfTree.CodeBlock(ifcond);
  ifcond.child_code_block             = child_code_block;                
  if_term.if_conds.push(ifcond);   
  return ifcond;            
}

Glaemscribe.ModeParser.prototype.traverse_if_tree = function(root_code_block, root_element, text_procedure, element_procedure)
{
  var mode                      = this.mode;
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
      var arg0 = element.args[0];
      var arg1 = element.args[1];
      var arg2 = element.args[2];
      var arg3 = element.args[3];
     
      term.operators.push(new operator_class([arg0,arg1,arg2,arg3]));     
    }     
  }  
  
  var root_code_block = ((pre_not_post)?(mode.pre_processor.root_code_block):(mode.post_processor.root_code_block))
  
  this.traverse_if_tree(root_code_block, processor_element, text_procedure, element_procedure )                       
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
  
  var option_elements = doc.root_node.gpath('options.option');
  for(var o=0;o<option_elements.length;o++)
  {
    var option_element  = option_elements[o];
    var values          = {}
    var value_elements  = option_element.gpath('value');
    
    for(var ov=0; ov< value_elements.length; ov++)
    {
      var value_element             = value_elements[ov];
      
      var value_name                = value_element.args[0];
      values[value_name]            = parseInt(value_element.args[1]);    
    }
      
    var option_name_at          = option_element.args[0];
    var option_default_val_at   = option_element.args[1];
    // TODO: check syntax of the option name
    
    if(option_default_val_at == null)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(option_element.line, "Missing option 'default' value."));
    }
    
    option                    = new Glaemscribe.Option(option_name_at, option_default_val_at, values);
    mode.options[option.name] = option;
  }  
  
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
    
  var outspace_element   = doc.root_node.gpath('processor.outspace')[0];
  if(outspace_element)
  {
    var val                   = outspace_element.args[0];
    mode.processor.out_space  = stringListToCleanArray(val,/\s/);   
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
    
    this.traverse_if_tree( rule_group.root_code_block, rules_element, text_procedure, element_procedure );                 
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