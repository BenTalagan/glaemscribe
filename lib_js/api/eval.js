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
        thisexplore_bool();
      else
        v = explore_compare();
      break;
    case 'bool_and':
      if(!v == true)
        explore_bool(); 
      else
        v = explore_compare();
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

