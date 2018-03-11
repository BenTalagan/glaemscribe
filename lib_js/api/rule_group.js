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

Glaemscribe.RuleGroup = function(mode,name) {
  this.name             = name;
  this.mode             = mode;
  this.root_code_block  = new Glaemscribe.IfTree.CodeBlock();

  return this;
}

Glaemscribe.RuleGroup.VAR_NAME_REGEXP = /{([0-9A-Z_]+)}/g ;

Glaemscribe.RuleGroup.prototype.add_var = function(var_name, value) {
  this.vars[var_name] = value;
}

// Replace all vars in expression
Glaemscribe.RuleGroup.prototype.apply_vars = function(line,string) {
  var rule_group  = this;
  var mode        = this.mode;
  var goterror    = false;

  var ret = string.replace(Glaemscribe.RuleGroup.VAR_NAME_REGEXP, function(match,p1,offset,str) {
    var rep = rule_group.vars[p1];

    if(rep == null)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(line, "In expression: " + string + ": failed to evaluate variable: " + p1 + "."))
      goterror = true;
      return "";
    }

    return rep;
  });

  if(goterror)
    return null;

  return ret;
}

Glaemscribe.RuleGroup.prototype.descend_if_tree = function(code_block,options)
{
  var mode = this.mode;

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

Glaemscribe.RuleGroup.VAR_DECL_REGEXP    = /^\s*{([0-9A-Z_]+)}\s+===\s+(.+?)\s*$/
Glaemscribe.RuleGroup.RULE_REGEXP        = /^\s*(.*?)\s+-->\s+(.+?)\s*$/
Glaemscribe.RuleGroup.CROSS_RULE_REGEXP  = /^\s*(.*?)\s+-->\s+([\s0-9,]+)\s+-->\s+(.+?)\s*$/


Glaemscribe.RuleGroup.prototype.finalize_rule = function(line, match_exp, replacement_exp, cross_schema)
{
  var match             = this.apply_vars(line, match_exp);
  var replacement       = this.apply_vars(line, replacement_exp);

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
  var exp = Glaemscribe.RuleGroup.VAR_DECL_REGEXP.exec(code_line.expression)
  if (exp)
  {
    var var_name      = exp[1];
    var var_value_ex  = exp[2];
    var var_value     = this.apply_vars(code_line.line, var_value_ex);

    if(var_value == null)
    {
      mode.errors.push(new Glaemscribe.Glaeml.Error(code_line.line, "Thus, variable {"+ var_name + "} could not be declared."));
      return;
    }

    this.add_var(var_name,var_value);
  }
  else if(exp = Glaemscribe.RuleGroup.CROSS_RULE_REGEXP.exec(code_line.expression ))
  {
    var match         = exp[1];
    var cross         = exp[2];
    var replacement   = exp[3];

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

  this.add_var("NULL","");

  this.add_var("UNDERSCORE",Glaemscribe.SPECIAL_CHAR_UNDERSCORE);
  this.add_var("NBSP",      Glaemscribe.SPECIAL_CHAR_NBSP);

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

        // Ignore '_' (bounds of word) and '|' (word breaker)
        if(inchar != Glaemscribe.WORD_BREAKER && inchar != Glaemscribe.WORD_BOUNDARY)
          rule_group.in_charset[inchar] = rule_group;
      }
    }
  }
}
