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


// A wrapper around espeak to perform handle various TTS tasks,
// and generate IPA and/or WAV while keeping punctuations.
//
// Espeak does not have this feature, so this is a significantly dirty hack.
//
// Additionally we perform a few glaemscribe-specific tasks, such as preserving raw tengwar


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
      return ' ';
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

  var prec_is_space = false;
  var next_is_space = false;
  for(var i=0;i<text.length;i++)
  {
    // Is precedent char a space ?
    if(i == 0)
      prec_is_space = false;
    else
      prec_is_space = (text[i-1] == " ");

    // Is next char a space ?
    if(i == text.length-1)
      next_is_space = false;
    else
      next_is_space = (text[i+1] == " ");

    if(text[i] == "\n")
    {
      accum += config['punct_token'];
      kept_signs.push(text[i]);
    }
    else if(cap[text[i]] != null) // Clause affecting sign
    {
      // Replace the sign by a special "word" / token AND keep the sign
      // Always insert spaces, but remember how they were placed
      accum += " " + config['punct_token'] + " " + text[i] + " ";
      kept_signs.push( ((prec_is_space)?(" "):("")) + text[i] + ((next_is_space)?(" "):("")) )
    }
    else if(cup[text[i]] != null) // Clause non affecting sign
    {
      // Same thing but the difference is that we REMOVE the sign before calculating the IPA.
      // We will restore it after IPA calculation.
      accum += " " + config['punct_token'] + " " ;
      kept_signs.push( ((prec_is_space)?(" "):("")) + text[i] + ((next_is_space)?(" "):("")) )
    }
    else
    {
      accum += text[i];
    }
  }

  return [accum, kept_signs];
}

Glaemscribe.TTS.prototype.ipa_instrument_blocks = function(voice, text)
{
  var client = this;
  var config = Glaemscribe.TTS.ipa_configurations[voice];

  return this.escape_special_blocks(voice, text, true);
}


Glaemscribe.TTS.prototype.pre_ipa = function(voice,text) {

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

Glaemscribe.TTS.prototype.restore_tokens = function(text, token, kept_tokens) {
  
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

  ipa = client.restore_tokens(ipa, config.punct_token, pre_ipa_res.punct_tokens);
  ipa = client.restore_tokens(ipa, config.block_token, pre_ipa_res.block_tokens);

  // Post-treatment of anti 'dot' pronounciation hack
  if(ipa[ipa.length-1] === "\n")
    ipa = ipa.slice(0,-1);

  return ipa
}


Glaemscribe.TTS.prototype.synthesize_ipa = function(text, args, onended) {

  var client = this;

  args            = args || {}
  var voice       = args.voice  || 'en-tengwar'

  var ts = new Date();
  var tp = ts;

  // Pre parse text and find raw mode things {{ ... }}
  // Cache them. This will also the pre-instrumentation
  // To treat each block as one word
  
  var pipa = client.pre_ipa(voice, text);
  text     = pipa['text'];

  // Now the IPA is instrumented.
  args = args || {}
  client.proxy.set_voice(args.voice  || 'en-tengwar');

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

  var client = this;

  args            = args || {}
  var voice       = args.voice  || 'en-tengwar'

  args = args || {}
  client.proxy.set_rate(args.rate    || 120);
  client.proxy.set_pitch(args.pitch  || 5);
  client.proxy.set_voice(args.voice  || 'en-tengwar');

  if(args.has_raw_mode) {
    var pre_raw_res    = this.escape_special_blocks(voice, text, false);
    text               = pre_raw_res[0];
  }

  var ret = {};
  var ts = new Date();
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

Glaemscribe.TTS.is_engine_loaded = function() {
  return (typeof(ESpeakNGGlue) !== 'undefined');
};