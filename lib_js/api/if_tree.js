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

