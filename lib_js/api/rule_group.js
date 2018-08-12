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
      term.macro.arg_names.glaem_each(function(i,arg_name) {
      
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
      arg_values.glaem_each(function(_,v) {
        if(v.val != null)
          rule_group.add_var(v.name,v.val,false)
      });

      rule_group.descend_if_tree(term.macro.root_code_block, options)
    
      // Remove the local vars from the scope (only if they were leggit)
      arg_values.glaem_each(function(_,v) {
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
