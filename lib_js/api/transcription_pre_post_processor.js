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

// ====================== //
//      OPERATORS         //
// ====================== //

Glaemscribe.PrePostProcessorOperator = function(glaeml_element)
{
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

  ge.children.glaem_each(function(idx, child) {
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
Glaemscribe.PreProcessorOperator = function(raw_args)
{
  Glaemscribe.PrePostProcessorOperator.call(this,raw_args);
  return this;
}
Glaemscribe.PreProcessorOperator.inheritsFrom( Glaemscribe.PrePostProcessorOperator );

// Inherit from PrePostProcessorOperator
Glaemscribe.PostProcessorOperator = function(raw_args)
{
  Glaemscribe.PrePostProcessorOperator.call(this,raw_args);
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

  this.operators.glaem_each(function(op_num, op) {
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
  Glaemscribe.TranscriptionPrePostProcessor.call(this,mode);
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
  Glaemscribe.TranscriptionPrePostProcessor.call(this,mode);
  return this;
}
Glaemscribe.TranscriptionPostProcessor.inheritsFrom( Glaemscribe.TranscriptionPrePostProcessor );

Glaemscribe.TranscriptionPostProcessor.prototype.apply = function(tokens, out_charset)
{
  var out_space_str     = " ";
  if(this.out_space != null)
  {
    out_space_str       = this.out_space.map(function(token) { return out_charset.n2c(token).output() }).join("");
  }

  for(var i=0;i<this.operators.length;i++)
  {
    var operator  = this.operators[i];
    tokens        = operator.apply(tokens, out_charset);
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


