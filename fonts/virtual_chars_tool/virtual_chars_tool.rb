#!/usr/bin/env ruby

require "rubygems"
require "JSON"

SCRIPT_PATH = File.dirname(__FILE__)
Dir.chdir(File.expand_path(SCRIPT_PATH))
require SCRIPT_PATH + "/../../lib_rb/glaemscribe.rb"


Glaemscribe::API::Debug.enabled = false

VIRTUALS_DS = {
  "A_TEHTA"                   => { names: ["A_TEHTA"],                                      classes: ["A_TEHTA_XS",        "A_TEHTA_S",        "A_TEHTA_L",        "A_TEHTA_XL"] },
  "A_TEHTA_DOUBLE"            => { names: ["A_TEHTA_DOUBLE"] ,                              classes: ["A_TEHTA_DOUBLE_XS", "A_TEHTA_DOUBLE_S", "A_TEHTA_DOUBLE_L", "A_TEHTA_DOUBLE_XL"]  },                           
  "A_TEHTA_CIRCUM"            => { names: ["A_TEHTA_CIRCUM"] ,                              classes: ["A_TEHTA_CIRCUM_XS", "A_TEHTA_CIRCUM_S", "A_TEHTA_CIRCUM_L", "A_TEHTA_CIRCUM_XL"] },
  "A_TEHTA_REVERSED"          => { names: ["A_TEHTA_REVERSED"],                             classes: ["A_TEHTA_INV_XS",    "A_TEHTA_INV_S",    "A_TEHTA_INV_L",    "A_TEHTA_INV_XL"] },
  "A_TEHTA_CIRCUM_REVERSED"   => { names: ["A_TEHTA_CIRCUM_REVERSED","TEHTA_BREVE"] ,       classes: ["THSUP_TICK_XS",     "THSUP_TICK_S",     "THSUP_TICK_L",     "THSUP_TICK_XL"] },
  "E_TEHTA"                   => { names: ["E_TEHTA"] ,                                     classes: ["E_TEHTA_XS",        "E_TEHTA_S",        "E_TEHTA_L",        "E_TEHTA_XL"] },
  "E_TEHTA_GRAVE"             => { names: ["E_TEHTA_GRAVE"] ,                               classes: ["E_TEHTA_GRAVE_XS",  "E_TEHTA_GRAVE_S",  "E_TEHTA_GRAVE_L",  "E_TEHTA_GRAVE_XL"] },
  "E_TEHTA_DOUBLE"            => { names: ["E_TEHTA_DOUBLE"] ,                              classes: ["E_TEHTA_DOUBLE_XS", "E_TEHTA_DOUBLE_S", "E_TEHTA_DOUBLE_L", "E_TEHTA_DOUBLE_XL"] },
  "I_TEHTA"                   => { names: ["I_TEHTA"] ,                                     classes: ["I_TEHTA_XS",        "I_TEHTA_S",        "I_TEHTA_L",        "I_TEHTA_XL"] },
  "I_TEHTA_DOUBLE"            => { names: ["I_TEHTA_DOUBLE", "Y_TEHTA"] ,                   classes: ["I_TEHTA_DOUBLE_XS", "I_TEHTA_DOUBLE_S", "I_TEHTA_DOUBLE_L", "I_TEHTA_DOUBLE_XL"] },
  "O_TEHTA"                   => { names: ["O_TEHTA"] ,                                     classes: ["O_TEHTA_XS",        "O_TEHTA_S",        "O_TEHTA_L",        "O_TEHTA_XL"] },
  "O_TEHTA_DOUBLE"            => { names: ["O_TEHTA_DOUBLE"] ,                              classes: ["O_TEHTA_DOUBLE_XS", "O_TEHTA_DOUBLE_S", "O_TEHTA_DOUBLE_L", "O_TEHTA_DOUBLE_XL"] },
  "U_TEHTA"                   => { names: ["U_TEHTA"] ,                                     classes: ["U_TEHTA_XS",        "U_TEHTA_S",        "U_TEHTA_L",        "U_TEHTA_XL"] },
  "U_TEHTA_DOUBLE"            => { names: ["U_TEHTA_DOUBLE"] ,                              classes: ["U_TEHTA_DOUBLE_XS", "U_TEHTA_DOUBLE_S", "U_TEHTA_DOUBLE_L", "U_TEHTA_DOUBLE_XL"] },
  "SEV_TEHTA"                 => { names: ["SEV_TEHTA"] ,                                   classes: ["SEV_TEHTA_XS",      "SEV_TEHTA_S",      "SEV_TEHTA_L",      "SEV_TEHTA_XL"] },
                                                            
  "A_TEHTA_INF"               => { names: ["A_TEHTA_INF"] ,                                 classes:  ["THINF_TDOT_XS", "THINF_TDOT_S", "THINF_TDOT_L", "THINF_TDOT_XL"] },
  "E_TEHTA_INF"               => { names: ["E_TEHTA_INF"] ,                                 classes:  ["THINF_ACCENT_XS", "THINF_ACCENT_S", "THINF_ACCENT_L", "THINF_ACCENT_XL"] },
  "O_TEHTA_INF"               => { names: ["O_TEHTA_INF"] ,                                 classes:  ["THINF_CURL_XS", "THINF_CURL_S", "THINF_CURL_L", "THINF_CURL_XL"] },
  "U_TEHTA_INF"               => { names: ["U_TEHTA_INF"] ,                                 classes:  ["THINF_CURL_INV_XS", "THINF_CURL_INV_S", "THINF_CURL_INV_L", "THINF_CURL_INV_XL"] },
  "CIRC_TEHTA_INF"            => { names: ["CIRC_TEHTA_INF"] ,                              classes:  ["TH_SUB_CIRC_XS", "TH_SUB_CIRC_S", "TH_SUB_CIRC_L", "TH_SUB_CIRC_XL"] },
  "THINNAS"                   => { names: ["THINNAS","SEV_TEHTA_INF","THINF_STROKE"] ,      classes:  ["THINF_STROKE_XS", "THINF_STROKE_S", "THINF_STROKE_L", "THINF_STROKE_XL"] },
                                                                      
  "PALATAL_SIGN"              => { names: ["PALATAL_SIGN", "I_TEHTA_DOUBLE_INF", "Y_TEHTA_INF" ] ,           classes: ["THINF_DDOT_XS", "THINF_DDOT_S", "THINF_DDOT_L", "THINF_DDOT_XL", "LAMBE_MARK_DDOT"] },
  "E_TEHTA_DOUBLE_INF"        => { names: ["E_TEHTA_DOUBLE_INF","GEMINATE_DOUBLE"],         classes: ["THINF_DSTROKE_XS" , "THINF_DSTROKE_S" ,"THINF_DSTROKE_L" , "THINF_DSTROKE_XL"  , "LAMBE_MARK_DSTROKE"] },
  "UNUTIXE"                   => { names: ["UNUTIXE","I_TEHTA_INF","NO_VOWEL_DOT"],         classes: ["THINF_DOT_XS" , "THINF_DOT_S" ,"THINF_DOT_L" , "THINF_DOT_XL"  , "LAMBE_MARK_DOT"] },
                                  
  "GEMINATE_SIGN"             => { names: ["GEMINATE_SIGN"] ,                               classes: ["DASH_INF_S",   "DASH_INF_L",  "LAMBE_MARK_DASH"] },
  "GEMINATE_SIGN_TILD"        => { names: ["GEMINATE_SIGN_TILD"] ,                          classes: ["TILD_INF_S",   "TILD_INF_L",  "LAMBE_MARK_TILD"] },
  "NASALIZE_SIGN"             => { names: ["NASALIZE_SIGN"] ,                               classes: ["DASH_SUP_S",   "DASH_SUP_L"] },
  "NASALIZE_SIGN_TILD"        => { names: ["NASALIZE_SIGN_TILD"],                           classes: ["TILD_SUP_S",   "TILD_SUP_L"] },
  "ALVEOLAR_SIGN"             => { names: ["ALVEOLAR_SIGN"] ,                               classes: ["SHOOK_LEFT_L", "SHOOK_RIGHT_L"] }
}

LIGATURES_ANNATAR = {
  "LAMBE"             => { :reversed => true, :default => "LAMBE_NO_LIG", names: ["LAMBE"],  classes: ["LAMBE_NO_LIG", "LAMBE_LIG"] }
}

DIACTRITICS_WITH_SIMILAR_PLACEMENT_DS = [
   ["A_TEHTA" ],
   ["A_TEHTA_CIRCUM"],
   ["A_TEHTA_REVERSED"],
   ["A_TEHTA_CIRCUM_REVERSED"],
   ["E_TEHTA"],
   ["E_TEHTA_GRAVE"],
   ["I_TEHTA"],
   ["O_TEHTA"],
   ["U_TEHTA"],
   ["SEV_TEHTA"],
   ["A_TEHTA_DOUBLE"],
   ["E_TEHTA_DOUBLE"],
   ["I_TEHTA_DOUBLE"], 
   ["O_TEHTA_DOUBLE"],
   ["U_TEHTA_DOUBLE"],
   ["A_TEHTA_INF"],
   ["E_TEHTA_INF"],
   ["CIRC_TEHTA_INF"],
   ["THINNAS"],
   ["O_TEHTA_INF"],
   ["U_TEHTA_INF"],
   ["PALATAL_SIGN"],
   ["E_TEHTA_DOUBLE_INF"],
   ["UNUTIXE"],
   ["GEMINATE_SIGN"],
   ["GEMINATE_SIGN_TILD"],
   ["NASALIZE_SIGN"],
   ["NASALIZE_SIGN_TILD"],
   ["ALVEOLAR_SIGN"],
]


DIACRITICS_BEARERS = [
  "TELCO", "ARA", 
  "TINCO", "PARMA", "CALMA", "QUESSE",
  "ANDO", "UMBAR", "ANGA", "UNGWE",
  "SULE", "FORMEN", "AHA", "HWESTA",
  "ANTO", "AMPA", "ANCA", "UNQUE",
  "NUMEN", "MALTA", "NOLDO", "NWALME",
  "ORE","VALA","ANNA","VILYA",
  "TW_EXT_11","TW_EXT_12","TW_EXT_13","TW_EXT_14",
  "TW_EXT_21","TW_EXT_22","TW_EXT_23","TW_EXT_24",
  
  "ROMEN","ARDA",
  "LAMBE","ALDA",
  
  "SILME","SILME_NUQUERNA","SILME_NUQUERNA_ALT", "ESSE","ESSE_NUQUERNA",
  "HYARMEN", "HWESTA_SINDARINWA",
  "YANTA","URE",

  "OSSE",
  
  "VAIA",
  
  "MALTA_W_HOOK", "VALA_W_HOOK",
  
  "SHOOK_BEAUTIFUL",
  "ANCA_CLOSED",
  "HARP_SHAPED",
  "AHA_TINCO", "HWESTA_TINCO", 
  
  "NUM_0", "NUM_1", "NUM_2" , "NUM_3" , "NUM_4" , "NUM_5" , "NUM_6" , "NUM_7" , "NUM_8" , "NUM_9" , "NUM_10" , "NUM_11"  
]          

TENGWAR_DS_GENERIC_CONF = {
  :virtuals         => VIRTUALS_DS,
  :virtual_groups   => DIACTRITICS_WITH_SIMILAR_PLACEMENT_DS,
  :virtual_triggers => DIACRITICS_BEARERS
}

TENGWAR_ANNATAR_CONF = {
  :virtuals         => VIRTUALS_DS.clone.merge(LIGATURES_ANNATAR),
  :virtual_groups   => DIACTRITICS_WITH_SIMILAR_PLACEMENT_DS.clone + [["LAMBE"]],
  :virtual_triggers => DIACRITICS_BEARERS.clone.insert(DIACRITICS_BEARERS.index("LAMBE")+1,"LAMBE_LIG","LAMBE_NO_LIG")
}

def dump_charset_edit_page(charset, font_list, conf)
  
  puts "Dumping charset #{charset.name} : "
  
  
File.open("#{charset.name}.html","wb") { |f|
  
  f.puts "<!doctype HTML>";
  f.puts "<html>"
  f.puts "<head>"
  f.puts '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
  f.puts "<style>"
  
  font_list.each_with_index{|font,i|
    f.puts ".font#{i} { font-family: '#{font}'; font-size:1.5em }"
  }
  
  f.puts "input[type='radio']:after { width: 15px;height: 15px;border-radius: 15px;top: -2px;left: -3px;position: relative;background-color: #d1d3d1;content: '';display: inline-block;visibility: visible;border: 2px solid white;}"
  f.puts "input[type='radio']:checked:after {width: 15px;height: 15px;border-radius: 15px;top: -2px;left: -3px;position: relative;background-color: #ffa500;content: '';display: inline-block;visibility: visible;border: 2px solid white;}"
  f.puts ".check0:checked:after { background-color : #2fc1f1 !important }"
  f.puts ".check1:checked:after { background-color : red !important}"
  f.puts ".check2:checked:after { background-color : lightgreen !important}"
  f.puts ".check3:checked:after { background-color : yellow !important}"
  f.puts ".check4:checked:after { background-color : orange !important}"
  f.puts ".choice { float:left;text-align:center;display:inline-block;padding:5px;border:1px #eaeaea solid; border-collapse:collapse}"
  f.puts ".no_choice_made { background: rgb(255, 231, 231); }"
  
  f.puts ".eldamar  { font-family: 'Tengwar Eldamar Glaemscrafu'}"
  f.puts ".zetable, .zetable td  { border: solid 1px black; border-collapse: collapse; padding :5px}"
  f.puts ".trigger_is_virtual { background-color: #ffffd4}"
  f.puts "</style>"
  f.puts "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js'></script>"
  f.puts "<script src='chart.js'></script>"
  f.puts "</head>"
  f.puts "<body>"
  f.puts "<table class='zetable'>"

  f.puts "<tr>"
  f.puts "<td>TRIGGERS</td>"
  conf[:virtual_groups].each{ |group|
    # Get the first element from the "similar group"
    first = group.first
    # Get the names of the diactrictic   
    desc  = conf[:virtuals][first]
    f.puts "<td style='text-align:center;font-size:8px'>#{desc[:names].join("<br>")}</td>"
  }
  f.puts "</tr>"

  conf[:virtual_triggers].each { |b|
    
    is_trigger_virtual = '' 
    if charset[b] && charset[b].virtual?
      is_trigger_virtual = 'trigger_is_virtual'
    end
    
    # Line
    f.puts "<tr style='white-space:nowrap' class='#{is_trigger_virtual}'>"
    
    # Name of the bearer
    f.puts "<td class='#{is_trigger_virtual}'>#{b}</td>"
    conf[:virtual_groups].each{ |group|
      # Get the first element from the "similar group"
      first   = group.first
      # Get the names of the diactrictic
      desc      = conf[:virtuals][first]
      names     = desc[:names]
      # Get the versions of the virtual
      classes   = desc[:classes]
      
      reversed  = (desc[:reversed] == true)
      
      k       = names[0]
      target  = nil
      
      # Get the corresponding virtual char in the charset
      vchar   = charset[k.to_s]
      
      tnames = nil
      if vchar
        target  = vchar[b]
        tnames  = target.names if target
      end 
      tnames = tnames || []
      
      has_choice = false
      classes.each_with_index { |v,i| has_choice ||= tnames.include? v }
      
      f.puts "<td style='text-align:center' class='#{(has_choice)?(''):('no_choice_made')}'>"
      f.puts "<div class='tlist' style='display:inline-flex'>"
      classes.each_with_index { |v,i|
                       
        checked = tnames.include? v
        
        f.puts "<div class='choice'>"
        
        font_list.each_with_index { |font,i|
          
          raise "#{b} not found in charset #{charset.name}"          if(!charset[b])
          raise "#{v} not found in charset #{charset.name}"          if(!charset[v])
          
          f.puts "<div class='font#{i}'>"
          if(reversed)
            f.puts "#{charset[v].str}#{charset[b].str}"
          else
            f.puts "#{charset[b].str}#{charset[v].str}"
          end
          f.puts "</div>"
        }
        f.puts "<div>"
        f.puts "<input class='check#{i}' type='radio' name='#{k}[#{b}]' " + ((checked)?("checked"):("")) + " data-master='#{k}' data-bearer='#{b}' value='#{v}' />"
        f.puts "</div>"
        
        f.puts "</div>"
      }
      f.puts "</div>"
      f.puts "</td>"
    }
    f.puts "</tr>"
  }
  
  f.puts "</table>"
  f.puts "<div><button class='dumper'>Dump</button></div><br/><br/>"
  f.puts "<code class='dump_zone' style='white-space: pre;'></code>";
  
  f.puts "<script>"
  f.puts "var SIMILARS        = #{conf[:virtual_groups].to_json};"
  f.puts "var DIACRITIC_TABLE = #{conf[:virtuals].to_json};"
  
  f.puts "</script>"
  
  f.puts "</body>"
  f.puts "</html>"
  
}
end


Glaemscribe::API::ResourceManager.load_charsets(["tengwar_ds_sindarin","tengwar_ds_eldamar","tengwar_ds_annatar","tengwar_ds_parmaite", "tengwar_ds_elfica"])

dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_sindarin"],["Tengwar Sindarin Glaemscrafu"], TENGWAR_DS_GENERIC_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_parmaite"],["Tengwar Parmaite Glaemscrafu"], TENGWAR_DS_GENERIC_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_eldamar"], ["Tengwar Eldamar Glaemscrafu"], TENGWAR_DS_GENERIC_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_annatar"], ["Tengwar Annatar Glaemscrafu"], TENGWAR_ANNATAR_CONF)
dump_charset_edit_page(Glaemscribe::API::ResourceManager.loaded_charsets["tengwar_ds_elfica"], ["Tengwar Elfica"], TENGWAR_DS_GENERIC_CONF)
