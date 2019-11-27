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
  'ent': {
    special_token_ncn: '', // no space / sign / no space
    special_token_ncs: '', // no space / sign / space
    special_token_scn: '', // space / sign / no space
    special_token_scs: '', // space / sign / space  
    
    special_token_ipa_ncn: '',
    special_token_ipa_ncs: '',
    special_token_ipa_scn: '',
    special_token_ipa_scs: '',
    // Replace by special token AND KEEP when calculating ipa
    clauseaffecting_punctuation: "!.,;:!?–—", 
    // Replace by special token but do not keep when calculating ipa
    // '’ : apostrophes should stay in the original text !!! Don't break liz's bag !!
    // This is because apostrophes shouldn't trigger a pause in the prononciation (e.g. genitives) 
    clauseunaffecting_punctuation: "·“”«»-[](){}<>≤≥$|\"" 
  },  
  'frt': {
    special_token_ncn: '', // no space / sign / no space
    special_token_ncs: '', // no space / sign / space
    special_token_scn: '', // space / sign / no space
    special_token_scs: '', // space / sign / space  
    
    special_token_ipa_ncn: '',
    special_token_ipa_ncs: '',
    special_token_ipa_scn: '',
    special_token_ipa_scs: '',
    // Replace by special token AND KEEP when calculating ipa
    clauseaffecting_punctuation: "!.,;:!?–—", 
    // Replace by special token but do not keep when calculating ipa
    // '’ : apostrophes should stay in the original text, let espeak eat them
    // This is because apostrophes shouldn't trigger a pause in the prononciation (e.g. genitives) 
    clauseunaffecting_punctuation: "·“”«»-[](){}<>≤≥$|\"",
    // Callback before reconstituing markers.
    pre_reconsitute_markers_callback: function(text) {
      // Long vowel back replacement.
      return text.replace(/-/g,"ː");
    }
  }
}

Glaemscribe.TTS.ipa_configurations['ent']         = Glaemscribe.TTS.ipa_configurations['ent'];
Glaemscribe.TTS.ipa_configurations['ent-gb']      = Glaemscribe.TTS.ipa_configurations['ent'];
Glaemscribe.TTS.ipa_configurations['ent-us']      = Glaemscribe.TTS.ipa_configurations['ent'];


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

Glaemscribe.TTS.prototype.escape_raw_mode = function(entry,full_remove) {
  
  var rawgexp   = /({{[\s\S]*?}})/g;
  var captured  = []; 
  
  var ret = entry.replace(rawgexp, function(match,p1) {
    
    captured.push(match);
    if(full_remove)
      return ' ';
    else
      return '∰∰';
  });
  
  return [ret, captured];
}

Glaemscribe.TTS.prototype.pre_ipa = function(voice,text) {
  
  var client = this;
  var config = Glaemscribe.TTS.ipa_configurations[voice];
  
  // Normalize all tabs by spaces
  text = text.replace(/\t/g," ");
  // Small hack to prevent espeak from pronouncing last dot 
  // since our tokenization may isolate it.
  text += "\n";
  
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
    
    // Is precedent char a space ?
    if(i == text.length-1)
      next_is_space = false;
    else
      next_is_space = (text[i+1] == " ");
    
    if(text[i] == "\n")
    {
      accum += config['special_token_ncn'];
      kept_signs.push(text[i]);
    }
    else if(cap[text[i]] != null)
    {
      if(!prec_is_space && !next_is_space)
      {
        // Always insert spaces, but remember how they were placed
        accum += " " + config['special_token_ncn'] + " " + text[i] + " ";     
        kept_signs.push(text[i]);
      }
      if(!prec_is_space && next_is_space)
      {
        // Always insert spaces, but remember how they were placed
        accum += " " + config['special_token_ncs'] + " " + text[i] + " "; 
        kept_signs.push(text[i] + " ");
      }
       if(prec_is_space && !next_is_space)
      {
        // Always insert spaces, but remember how they were placed
        accum += " " + config['special_token_scn'] + " " + text[i] + " "; 
        kept_signs.push(" " + text[i]);
      }
      if(prec_is_space && next_is_space)
      {
        // Always insert spaces, but remember how they were placed
        accum += " " + config['special_token_scs'] + " " + text[i] + " "; 
        kept_signs.push(" " + text[i] + " ");
      }         
    }
    else if(cup[text[i]] != null)
    {
        // The difference is that we don't keep the sign before calculating ipa.
        // Just remove them to avoid espeak spell them
      if(!prec_is_space && !next_is_space)
      {
        accum += " " + config['special_token_ncn'] + " " ;     
        kept_signs.push(text[i]);
      }
      if(!prec_is_space && next_is_space)
      {
        accum += " " + config['special_token_ncs'] + " " ; 
        kept_signs.push(text[i] + " ");
      }
       if(prec_is_space && !next_is_space)
      {
        accum += " " + config['special_token_scn'] + " " ; 
        kept_signs.push(" " + text[i]);
      }
      if(prec_is_space && next_is_space)
      {
        accum += " " + config['special_token_scs'] + " " ; 
        kept_signs.push(" " + text[i] + " ");
      }      
    }
    else
    {
      accum += text[i];
    }
  }
  
  //console.log(accum);
  //console.log(kept_signs)
  return [accum,kept_signs];
}

Glaemscribe.TTS.prototype.post_ipa = function(voice, ipa, kept_tokens) {
  
  var config = Glaemscribe.TTS.ipa_configurations[voice];
  ipa = ipa.replace(/\n/g," ");
  if(config['pre_reconsitute_markers_callback'])
    ipa = config['pre_reconsitute_markers_callback'](ipa);
    
  var ncnr = new RegExp("\\s*(" + config['special_token_ipa_ncn'] + ")\\s*","g");
  var scnr = new RegExp("\\s*(" + config['special_token_ipa_scn'] + ")\\s*","g");
  var ncsr = new RegExp("\\s*(" + config['special_token_ipa_ncs'] + ")\\s*","g");
  var scsr = new RegExp("\\s*(" + config['special_token_ipa_scs'] + ")\\s*","g");
  
  // console.log("=====")
  // console.log(ipa)
  // console.log(config)
  // console.log(ncsr)
  
  // Tokens have been accumulated linearly
  ipa = ipa.replace(ncnr, function(match, contents, offset, s) {return '∰∰'; });
  ipa = ipa.replace(ncsr, function(match, contents, offset, s) {return '∰∰'; });
  ipa = ipa.replace(scnr, function(match, contents, offset, s) {return '∰∰'; });
  ipa = ipa.replace(scsr, function(match, contents, offset, s) {return '∰∰'; });
    
  // console.log("=====")
  // console.log(ipa)
  var nth = -1;
  ipa = ipa.replace(/∰∰/g,function(match, contents, offset, s) {
    nth += 1;
    return kept_tokens[nth];
  });
  
  // Post-treatment of anti 'dot' pronounciation hack
  if(ipa[ipa.length-1] === "\n") 
    ipa = ipa.slice(0,-1);
  
  // console.log("=====")
  // console.log(ipa)
  return ipa
}


Glaemscribe.TTS.prototype.synthesize_ipa = function(text, args, onended) {
  
  var client = this;
  
  args            = args || {}
  var voice       = args.voice  || 'ent'
  
  var ts = new Date();
  var tp = ts;
    
  // Cache raw things
  var pre_raw_tokens = [];
  if(args.has_raw_mode) {
    var pre_raw_res    = this.escape_raw_mode(text,false);
    text               = pre_raw_res[0];
    pre_raw_tokens     = pre_raw_res[1]; 
  } 
    
  // Pre parse ipa
  var pre_ipa_tokens  = [];
  var pre_ipa_res     = client.pre_ipa(voice,text);
  text                = pre_ipa_res[0];
  pre_ipa_tokens      = pre_ipa_res[1];

  // Restitute raw things
  if(args.has_raw_mode) {
    var nth = -1;
    text = text.replace(/∰∰/g,function(match, contents, offset, s) {
      nth += 1;
      return pre_raw_tokens[nth];
    });
  }
  
  args = args || {}
  client.proxy.set_voice(args.voice  || 'ent');

  var ts = new Date();
  var ret = {};
  client.proxy.synthesize(text, false, true, true, function(result) {
       
    // Post parse ipa
    result.ipa            = client.post_ipa(voice, result.pho, pre_ipa_tokens);

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
  var voice       = args.voice  || 'ent'

  args = args || {}
  client.proxy.set_rate(args.rate    || 120);
  client.proxy.set_pitch(args.pitch  || 5);
  client.proxy.set_voice(args.voice  || 'ent');
  
  if(args.has_raw_mode) {
    var pre_raw_res    = this.escape_raw_mode(text,true);
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