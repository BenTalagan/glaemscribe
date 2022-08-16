Glaemscribe.resource_manager.raw_modes["english-cirth-espeak"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more\nspecifically dedicated to the transcription of J.R.R. Tolkien\'s\ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.1\" \"First version.\"\n\\end\n\n\\language \"English\"\n\\writing  \"Cirth\"\n\\mode     \"English Angerthas based on Angerthas Daeron\"\n\\version  \"0.0.1\"\n\\authors  \"Talagan (Benjamin Babut), based on J.R.R. Tolkien\"\n\n\\world      primary_related_to_arda\n\\invention  experimental\n\n\\charset  cirth_ds true\n\n\\outspace CIRTH_SPACE\n\n\\beg options\n\n  \\** ENGLISH accent/dialect/variant. It also controls espeak behaviour. **\\\n  \\beg option espeak_voice ESPEAK_VOICE_EN_TENGWAR\n    \\value ESPEAK_VOICE_EN_TENGWAR          0\n    \\value ESPEAK_VOICE_EN_TENGWAR_GB       1\n    \\value ESPEAK_VOICE_EN_TENGWAR_RP       2\n    \\value ESPEAK_VOICE_EN_TENGWAR_US       3\n  \\end\n\n  \\** ----------Special words ---------- **\\\n\n  \\** \'the\' word **\\\n  \\beg option english_the ENGLISH_THE_EXTENDED_CIRTH\n    \\value ENGLISH_THE_EXTENDED_CIRTH 0\n    \\value ENGLISH_THE_FULL_WRITING   1\n    \\radio\n  \\end\n\n  \\** \'and\' word may be represented by a special cirth **\\\n  \\beg option english_and ENGLISH_AND_EXTENDED_CIRTH\n    \\value ENGLISH_AND_EXTENDED_CIRTH 0\n    \\value ENGLISH_AND_FULL_WRITING   1\n    \\radio\n  \\end\n\n  \\** \'to\' word (the word \'to\' may have its vowel reduced to a schwa) **\\\n  \\beg option schwa_of_to SCHWA_OF_TO_U\n    \\value SCHWA_OF_TO_U 0\n    \\value SCHWA_OF_TO_SCHWA 1\n  \\end\n\n\n  \\** ---------- Vowel options ---------- **\\\n\n  \\** Long i like in \'fleece\' **\\\n  \\beg option long_i LONG_I_DOUBLE_CIRTH\n    \\radio\n    \\value LONG_I_DOUBLE_CIRTH 0\n    \\value LONG_I_AS_DIPHTONG  1\n  \\end\n\n  \\** long u like in \'goose\' **\\\n  \\beg option long_u LONG_U_AS_LONG_VOWEL\n    \\radio\n    \\value LONG_U_AS_LONG_VOWEL 0\n    \\value LONG_U_AS_DIPHTONG   1\n  \\end\n\n  \\** ---------- Schwa options -------------- **\\\n\n  \\** Remove unuseful, natural schwa marks **\\\n  \\option implicit_schwa false\n\n  \\beg option non_implicit_schwa_method NON_IMPLICIT_SCHWA_DIFFERENCIATE_REDUCIBLE\n    \\value NON_IMPLICIT_SCHWA_DIFFERENCIATE_REDUCIBLE 0\n    \\value NON_IMPLICIT_SCHWA_ALL_WITH_VERTICAL_BAR   1\n    \\value NON_IMPLICIT_SCHWA_ALL_AS_ACCENTS          2\n    \\visible_when \"implicit_schwa == false\"\n  \\end\n\n  \\beg option non_reducible_schwa_remaining NON_REDUCIBLE_SCHWA_REMAINING_AS_VERTICAL_BARS\n    \\visible_when implicit_schwa\n    \\value NON_REDUCIBLE_SCHWA_REMAINING_AS_VERTICAL_BARS 0\n    \\value NON_REDUCIBLE_SCHWA_REMAINING_AS_ACCENTS 1\n  \\end\n\n  \\** Schwi, in US/JRRT **\\\n  \\beg option schwi SCHWI_LIKE_I\n    \\radio\n    \\value SCHWI_LIKE_I     0\n    \\value SCHWI_LIKE_SCHWA 1\n    \\visible_when \"espeak_voice == ESPEAK_VOICE_EN_TENGWAR || espeak_voice == ESPEAK_VOICE_EN_TENGWAR_US\"\n  \\end\n\n  \\** \'strut\' vowel special case **\\\n  \\beg option open_mid_back_unrounded OMBU_USE_LEFT_ORIENTED_CIRTH\n    \\radio\n    \\value OMBU_USE_LEFT_ORIENTED_CIRTH    0\n    \\value OMBU_LIKE_SCHWA                 1\n  \\end\n\n  \\** ---------- Diphthong options ---------- **\\\n\n  \\** \'cure\', \'cute\' diphthong **\\\n  \\beg option ju_diphthong JU_DIPHTHONG_SEPARATE\n    \\radio\n    \\value JU_DIPHTHONG_SEPARATE 0\n    \\value JU_DIPHTHONG_LIKE_IW  1\n  \\end\n\n  \\** Horse / Hoarse vowel distinction (only JRRT/US accents) **\\\n  \\beg option horse_hoarse_merger HORSE_HOARSE_MERGE\n    \\visible_when \"espeak_voice == ESPEAK_VOICE_EN_TENGWAR || espeak_voice == ESPEAK_VOICE_EN_TENGWAR_US\"\n    \\value HORSE_HOARSE_MERGE 0\n    \\value HORSE_HOARSE_SEPARATE 1\n  \\end\n\n  \\** ---------- Consonant options ---------- **\\\n\n  \\** \'wh\' in old accents/US. Sometimes called \'wine/whine\' merger. **\\\n  \\beg option ancient_voiceless_labiovelar_fricative_wh WH_VLVF_AS_IN_SINDARIN\n    \\value WH_VLVF_AS_IN_SINDARIN 0\n    \\value WH_VLVF_WHINE_MERGER 1\n  \\end\n\n  \\** Re-establishment of linking r in non-rhotic accent, ex : \'better life\' vs \'betteR answer\' **\\\n  \\beg option linking_r LINKING_R_SHOW\n    \\value LINKING_R_HIDE 0\n    \\value LINKING_R_SHOW 1\n    \\visible_when \"espeak_voice == ESPEAK_VOICE_EN_TENGWAR_RP || espeak_voice == ESPEAK_VOICE_EN_TENGWAR_GB\"\n  \\end\n\n  \\** Intrusive r, like in vanillaR ice **\\\n  \\beg option intrusive_r INTRUSIVE_R_SHOW\n    \\value INTRUSIVE_R_HIDE 0\n    \\value INTRUSIVE_R_SHOW 1\n    \\visible_when \"espeak_voice != ESPEAK_VOICE_EN_TENGWAR_US\"\n  \\end\n\n  \\** This option is disabled, it cannot cover all cases : ink, incoming, mankind, etc **\\\n  \\beg option velar_linking_n VELAR_LINKING_N_VELAR\n    \\visible_when false\n    \\value VELAR_LINKING_N_NOT_VELAR 0\n    \\value VELAR_LINKING_N_VELAR 1\n  \\end\n\n  \\beg option english_nw ENGLISH_NW_TREAT_NORMALLY\n    \\value ENGLISH_NW_TREAT_NORMALLY     0\n    \\value ENGLISH_NW_USE_CIRTH_48      1\n  \\end\n\n  \\beg option cirth_for_s USE_CIRTH_34\n    \\value USE_CIRTH_34 0\n    \\value USE_CIRTH_35 1\n    \\radio\n  \\end\n\n  \\beg option nasal_consonants NASAL_CONSONANTS_USE_CIRCUMFLEX\n     \\value NASAL_CONSONANTS_USE_CIRCUMFLEX 0\n     \\value NASAL_CONSONANTS_SEPARATE       1\n  \\end\n\n  \\** ---------- Styling options ---------- **\\\n\n  \\beg option space_character USE_NON_BREAKING_SPACE_SMALL\n    \\value USE_NORMAL_SPACE 0\n    \\value USE_NON_BREAKING_SPACE_SMALL 1\n    \\value USE_NON_BREAKING_SPACE_BIG 2\n    \\value USE_MIDDLE_DOT 3\n  \\end\n\n  \\option auto_spacing true\n\n\\end\n\n\\beg  preprocessor\n  \\downcase\n\n  \\** Remove phonetics accentuation marks **\\\n  \\rxsubstitute \"[ˈˌ]\" \"\"\n\n  \\** foreign words nasal a, split to \"an\" (ex: croissant) **\\\n  \\rxsubstitute \"ɑ̃\" \"ɑn\"\n\n  \\** Non rhotic schwa simplification **\\\n  \\rxsubstitute \"ɐ\" \"ə\"\n\n  \\if \"linking_r == LINKING_R_HIDE\"\n    \\rxsubstitute \"ɹ‿\" \"\"\n  \\else\n    \\rxsubstitute \"ɹ‿\" \"ɹ\"\n  \\endif\n\n  \\if \"intrusive_r == INTRUSIVE_R_HIDE\"\n    \\rxsubstitute \"ɹ̩‿\" \"\"\n  \\else\n    \\rxsubstitute \"ɹ̩‿\" \"ɹ\"\n  \\endif\n\n  \\if \"schwa_of_to == SCHWA_OF_TO_U\"\n    \\substitute \"ʊ̟\" \"ʊ\"\n  \\else\n    \\substitute \"ʊ̟\" \"ə\"\n  \\endif\n\n  \\if \"velar_linking_n == VELAR_LINKING_N_NOT_VELAR\"\n    \\rxsubstitute \"n‿\" \"n\"\n  \\else\n    \\rxsubstitute \"n‿\" \"ŋ\"\n  \\endif\n\n  \\** IMPORTANT NOTE : in all following regexps **\\\n  \\** (^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃]) stands for \'word boundary\' **\\\n\n  \\** \'the\' variations **\\\n  \\** that the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(ð[aæ]t)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** of the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])([ɒʌ]v)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** for the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(f[ɚə])(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** with the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(wɪð)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** in the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(ɪn)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** on the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])([ɒɔ]n)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** from the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(fɹʌm)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** was the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(wʌz)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n\n  \\if \"horse_hoarse_merger == HORSE_HOARSE_SEPARATE\"\n    \\** Re-establish former diphtong **\\\n    \\substitute \"oːɹ\" \"oʊɹ\"\n  \\endif\n\n  \\** If treated as diphthong, change long i to i + schwi **\\\n  \\if \"long_i == LONG_I_AS_DIPHTONG\"\n    \\substitute \"iː\" \"iɪ\"\n  \\endif\n\n  \\** Experimental, don\'t affect ju: at beginning of words/after consonnant **\\\n  \\if \"ju_diphthong == JU_DIPHTHONG_LIKE_IW\"\n    \\rxsubstitute \"(juː|jʊ)\" \"iw\"\n  \\endif\n\n  \\if \"long_u == LONG_U_AS_DIPHTONG\"\n    \\substitute \"uː\" \"uʊ\"\n  \\endif\n\n  \\** ! Beware of the order of the following rules **\\\n  \\** ! Rhotic schwa : remove 1 level of length when superfluous and always add explicit mark **\\\n  \\rxsubstitute \"[ɜɚ]ː?\" \"ɜɹ\"\n\n  \\** ! Potentially remove superfluous added rhotic marks **\\\n  \\rxsubstitute \"ɹ+\" \"ɹ\"\n  \\** ! Disambiguate ɹ + vowel : ORE/ROMEN **\\\n  \\rxsubstitute \"ɹ([ɑæaeɛʌɐəɜɚiɪᵻoɒɔuʊʘ])\" \"r\\\\1\"\n\n  \\** Convention : for non reducing schwas we will use ɤ̞ for ʌ and ʘ for all other cases  **\\\n\n  \\** All schwas at beginning or end of words cannot reduce **\\\n  \\** or after vowels (== not consonant) **\\\n  \\** beware of ɪ as it can appear as consonant (lawyer) **\\\n  \\** same for ʊ for sour **\\\n  \\** Handling is not exactly the same as in the tengwar mode **\\\n  \\** Because letters are treated independently, not with a VC pattern **\\\n  \\** We thus need to add ending of words, that would be handled by telco otherwise **\\\n\n  \\** Mark non reducing schwa as ʘ **\\\n  \\rxsubstitute \"(^|[^bcdfghjklmnpqrstvwxyzðŋɡɣɹɾʃʍʒʔθɪʊ])([əɐɜɚ])\" \"\\\\1ʘ\"\n  \\rxsubstitute \"([əɐɜɚ])(r|$)\" \"ʘ\\\\2\"\n\n  \\if \"schwi == SCHWI_LIKE_SCHWA\"\n    \\** Don\'t forget to mark schwis too **\\\n    \\rxsubstitute \"(^|[^bcdfghjklmnpqrstvwxyzðŋɡɣɹɾʃʍʒʔθɪʊ])([ᵻ])\" \"\\\\1ʘ\"\n    \\rxsubstitute \"ᵻ(r|$)\" \"ʘ\\\\2\"\n  \\endif\n\n  \\** Don\'t forget to mark the ombus too **\\\n  \\if \"open_mid_back_unrounded == OMBU_LIKE_SCHWA\"\n    \\rxsubstitute \"(^|[^bcdfghjklmnpqrstvwxyzðŋɡɣɹɾʃʍʒʔθɪʊ])([ʌ])\" \"\\\\1ɤ̞\"\n    \\rxsubstitute \"ʌ(r|$)\" \"ɤ̞\\\\2\"\n  \\else\n    \\rxsubstitute \"(^|[^bcdfghjklmnpqrstvwxyzðŋɡɣɹɾʃʍʒʔθɪʊ])([ʌ])\" \"\\\\1ʘ\"\n    \\rxsubstitute \"ʌ(r|$)\" \"ʘ\\\\2\"\n  \\endif\n\n  \\if \"auto_spacing == true\"\n    \\rxsubstitute \"([^\\\\s])([.,;:!?])\" \"\\\\1 \\\\2\"\n    \\rxsubstitute \"([.,;:!?])([^\\\\s])\" \"\\\\1 \\\\2\"\n  \\endif\n\\end\n\n\\beg processor\n  \\beg rules litteral\n\n    {SCHWA_NON_REDUCIBLE}  === ʘ       \\** NON REDUCIBLE **\\\n    {SCHWU_NON_REDUCIBLE}  === ɤ̞       \\** NON REDUCIBLE **\\\n\n    \\** Very long logic here for schwa/schwu reducible/non reducible **\\\n    \\** Could be shorter ? **\\\n    \\if implicit_schwa\n      {_REDUCIBLE_SCHWA_} === {NULL}\n      {_REDUCIBLE_SCHWU_} === {NULL}\n\n      \\if \"non_reducible_schwa_remaining == NON_REDUCIBLE_SCHWA_REMAINING_AS_VERTICAL_BARS\"\n        {_NON_REDUCIBLE_SCHWA_} === CIRTH_55\n        {_NON_REDUCIBLE_SCHWU_} === {_NON_REDUCIBLE_SCHWA_}\n\n        \\if \"open_mid_back_unrounded != OMBU_LIKE_SCHWA\"\n          {_NON_REDUCIBLE_SCHWU_} === CIRTH_56\n        \\endif\n      \\else\n        {_NON_REDUCIBLE_SCHWA_} === CIRTH_55_ALT\n        {_NON_REDUCIBLE_SCHWU_} === {_NON_REDUCIBLE_SCHWA_}\n\n        \\if \"open_mid_back_unrounded != OMBU_LIKE_SCHWA\"\n          {_NON_REDUCIBLE_SCHWU_} === CIRTH_56_ALT\n        \\endif\n      \\endif\n    \\else\n      \\if \"non_implicit_schwa_method == NON_IMPLICIT_SCHWA_DIFFERENCIATE_REDUCIBLE\"\n        {_NON_REDUCIBLE_SCHWA_} === CIRTH_55\n        {_REDUCIBLE_SCHWA_}     === CIRTH_55_ALT\n        {_NON_REDUCIBLE_SCHWU_} === {_NON_REDUCIBLE_SCHWA_}\n        {_REDUCIBLE_SCHWU_}     === {_REDUCIBLE_SCHWA_}\n        \\if \"open_mid_back_unrounded != OMBU_LIKE_SCHWA\"\n          {_NON_REDUCIBLE_SCHWU_} === CIRTH_56\n          {_REDUCIBLE_SCHWU_}     === CIRTH_56_ALT\n        \\endif\n      \\elsif \"non_implicit_schwa_method == NON_IMPLICIT_SCHWA_ALL_WITH_VERTICAL_BAR\"\n        {_NON_REDUCIBLE_SCHWA_} === CIRTH_55\n        {_REDUCIBLE_SCHWA_}     === CIRTH_55\n        {_NON_REDUCIBLE_SCHWU_} === {_NON_REDUCIBLE_SCHWA_}\n        {_REDUCIBLE_SCHWU_}     === {_REDUCIBLE_SCHWA_}\n        \\if \"open_mid_back_unrounded != OMBU_LIKE_SCHWA\"\n          {_NON_REDUCIBLE_SCHWU_} === CIRTH_56\n          {_REDUCIBLE_SCHWU_}     === CIRTH_56\n        \\endif\n      \\else\n        {_NON_REDUCIBLE_SCHWA_} === CIRTH_55_ALT\n        {_REDUCIBLE_SCHWA_}     === CIRTH_55_ALT\n        {_NON_REDUCIBLE_SCHWU_} === {_NON_REDUCIBLE_SCHWA_}\n        {_REDUCIBLE_SCHWU_}     === {_REDUCIBLE_SCHWA_}\n        \\if \"open_mid_back_unrounded != OMBU_LIKE_SCHWA\"\n          {_NON_REDUCIBLE_SCHWU_} === CIRTH_56_ALT\n          {_REDUCIBLE_SCHWU_}     === CIRTH_56_ALT\n        \\endif\n      \\endif\n    \\endif\n\n\n    {IGROUP}               === i,ɪ\n    {UGROUP}               === u,ʊ\n    {EBGROUP}              === ə,ɐ     \\** REDUCIBLE **\\\n    {ESCHWA}               === ə       \\** REDUCIBLE E SCHWA **\\\n    {OMBU}                 === ʌ\n\n    {SCHWA_NON_REDUCIBLE}  === ʘ\n    {SCHWU_NON_REDUCIBLE}  === ɤ̞\n    {ALL_ESCHWA}           === (ə,ʘ)\n\n    \\if \"schwi == SCHWI_LIKE_I\"\n      {IGROUP} === {IGROUP},ᵻ\n    \\else\n      {EBGROUP} === {EBGROUP},ᵻ\n    \\endif\n\n    {A_FRONT}             === (æ,a)  \\** Always short **\\\n    {A_BACK}              === (ɑ)    \\** Always long **\\\n    {E_FRONT}             === (e,ɛ)\n    {E_BACK}              === ({EBGROUP})\n    {E_BACK_RHOTIC}       === (ɚ,ɜ)       \\** Rhotic schwas are treated independently **\\\n    {I}                   === ({IGROUP})\n    {O}                   === (o,ɒ,ɔ)     \\** force, mock, lord **\\\n    {U}                   === ({UGROUP})\n\n    {AA_FRONT}        === {A_FRONT}ː    \\** long front a probably does not exist **\\\n    {AA_BACK}         === {A_BACK}ː\n    {EE_FRONT}        === {E_FRONT}ː\n    {EE_BACK}         === {E_BACK}ː     \\** long back e probably does not exist when not rhotic **\\\n    {EE_BACK_RHOTIC}  === {E_BACK_RHOTIC}ː\n    {II}              === {I}ː\n    {OO}              === {O}ː\n    {UU}              === {U}ː\n\n    \\** GB DIPHTONGS **\\\n    \\** +dˈeɪ +skˈaɪ +bˈɔɪ +bˈiə +bˈeə +tˈʊə +ɡˌəʊ +kˈaʊ **\\\n    \\** US DIPHTONGS **\\\n    \\** =dˈeɪ =skˈaɪ =bˈɔɪ -bˈɪɹ -bˈɛɹ -tˈʊɹ +ɡˌoʊ =kˈaʊ **\\\n\n    \\** U Diphthongs **\\\n    {AW} === aʊ        \\** cow **\\\n    {OW} === oʊ        \\** US most / mˈoʊst **\\\n    {EW} === {ALL_ESCHWA}ʊ \\** GB go **\\\n    {UW} === uʊ        \\** goose if pronconced with labializing accent ... we do not have this in our pronunciations **\\\n\n    \\** I Diphtongues :  eɪ (day) / aɪ (sky) / ɔɪ (boy)  **\\\n    {AJ} === aɪ \\** nine / nˈaɪn **\\\n    {EJ} === eɪ \\** game / ɡˈeɪm **\\\n    {OJ} === ɔɪ \\** boy **\\\n    {IJ} === iɪ \\** fleece if prononced with palatalising accent **\\\n\n    \\** ə diphthongs : iə (GB : beer) / eə (GB: bear) / ʊə (US: tour) **\\\n    {IER} === i{ALL_ESCHWA} \\** GB Beer **\\\n    {EAR} === e{ALL_ESCHWA} \\** GB Bear **\\\n    {UER} === ʊ{ALL_ESCHWA} \\** GB Tour **\\\n\n    {VOWELS}        === {A_BACK}  * {A_FRONT}     * {E_FRONT}     * {E_BACK}                * {E_BACK_RHOTIC}     * {IER}                            * {EAR}                             * {UER}                             * {I}         * {O}           * {U}      * {OMBU}              * {ESCHWA}\n    {_VOWELS_}      === CIRTH_49  * CIRTH_48      * CIRTH_46      * {_REDUCIBLE_SCHWA_}     * {_REDUCIBLE_SCHWA_} * CIRTH_39 {_NON_REDUCIBLE_SCHWA_} * CIRTH_46 {_NON_REDUCIBLE_SCHWA_}  * CIRTH_42 {_NON_REDUCIBLE_SCHWA_}  * CIRTH_39    * CIRTH_50      * CIRTH_42 * {_REDUCIBLE_SCHWU_} * {_REDUCIBLE_SCHWA_}\n\n    \\** Since in english back /a/ (trap) is always short and front /a/ (calm) is always long **\\\n    \\** we reuse the same cirth without risking a clash. **\\\n    \\** Long back e is probably not possible **\\\n\n    {LVOWELS}       === {AA_BACK} * {AA_FRONT}    * {EE_FRONT}    * {EE_BACK}               * {EE_BACK_RHOTIC}    * {II}               * {OO}     * {UU}\n    {_LVOWELS_}     === CIRTH_49  * CIRTH_48      * CIRTH_47      * {_REDUCIBLE_SCHWA_}     * {_REDUCIBLE_SCHWA_} * CIRTH_39 CIRTH_39  * CIRTH_52 * CIRTH_45\n\n    {DIPHTHONGS_R}    === {AW}         * {OW}     * {EW}          * {UW}         * {AJ}         * {EJ}              * {OJ}              * {IJ}\n    {_DIPHTHONGS_R_}  === CIRTH_EREB_5 * CIRTH_38 * CIRTH_EREB_1  * CIRTH_45_ALT * CIRTH_EREB_4 * CIRTH_46 CIRTH_59 * CIRTH_50 CIRTH_59 * CIRTH_39 CIRTH_59\n\n    {DIPHTHONGS}    === {DIPHTHONGS_R}\n    {_DIPHTHONGS_}  === {_DIPHTHONGS_R_}\n\n    {SCHWA_NON_REDUCIBLE} --> {_NON_REDUCIBLE_SCHWA_}\n    {SCHWU_NON_REDUCIBLE} --> {_NON_REDUCIBLE_SCHWU_}\n\n    {VOWELS} --> {_VOWELS_}\n    {LVOWELS} --> {_LVOWELS_}\n    {DIPHTHONGS} --> {_DIPHTHONGS_}\n\n    {L1}   === (t,ɾ,ʔ) * p * tʃ * k\n    {_L1_} === CIRTH_8 * CIRTH_1 * CIRTH_13 * CIRTH_18\n    {L1}   --> {_L1_}\n\n    \\if \"nasal_consonants == NASAL_CONSONANTS_USE_CIRCUMFLEX\"\n      {L1_NASAL} === n(t,ɾ,ʔ) * mp * ntʃ      * ŋk\n      [{L1_NASAL}] --> [{_L1_}] TEHTA_CIRCUM\n    \\endif\n\n    \\** ------------- **\\\n\n    {L2}   === d * b * dʒ * ɡ\n    {_L2_} === CIRTH_9 * CIRTH_2 * CIRTH_14 * CIRTH_19\n    {L2}   --> {_L2_}\n    \\if \"nasal_consonants == NASAL_CONSONANTS_USE_CIRCUMFLEX\"\n      {L2_NASAL}   === nd    * mb * ndʒ   * ŋɡ\n      [{L2_NASAL}] --> [{_L2_}] TEHTA_CIRCUM\n    \\endif\n\n    \\** ------------- **\\\n\n    {L3}   === θ        * f       * ʃ         * x\n    {_L3_} === CIRTH_10 * CIRTH_3 * CIRTH_15  * CIRTH_20\n    {L3}   --> {_L3_}\n    \\if \"nasal_consonants == NASAL_CONSONANTS_USE_CIRCUMFLEX\"\n      {L3_NASAL} === nθ      * mf     * nʃ      * ŋx\n      [{L3_NASAL}] --> [{_L3_}] TEHTA_CIRCUM\n    \\endif\n\n    \\** ------------- **\\\n\n    {L4}     === ð        * v       * ʒ         * ɣ\n    {_L4_}   === CIRTH_11 * CIRTH_4 * CIRTH_16  * CIRTH_21\n    {L4}     --> {_L4_}\n    \\if \"nasal_consonants == NASAL_CONSONANTS_USE_CIRCUMFLEX\"\n      {L4_NASAL}   === nð    * mv    * nʒ    * ŋɣ\n      [{L4_NASAL}] --> [{_L4_}] TEHTA_CIRCUM\n    \\endif\n\n    \\** ------------- **\\\n\n    {L5}     === (n,n̩)    * m       * n(j,J)     * ŋ\n    {_L5_}   === CIRTH_12 * CIRTH_6 * CIRTH_17   * CIRTH_22\n    {L5}     --> {_L5_}\n\n    \\** ------------- **\\\n\n    {L6}       === w\n    {_L6_}     === CIRTH_44\n    {L6}       --> {_L6_}\n\n    {L6_NASAL}   === nw\n    \\if \"english_nw == ENGLISH_NW_TREAT_NORMALLY\"\n      \\if \"nasal_consonants == NASAL_CONSONANTS_USE_CIRCUMFLEX\"\n        [{L6_NASAL}]  --> [{_L6_}] TEHTA_CIRCUM\n      \\endif\n    \\else\n      {_L6_NASAL_} === CIRTH_28\n      {L6_NASAL}   --> {_L6_NASAL_}\n    \\endif\n\n    {L6_NN}   === (j,J)\n    {_L6_NN_} === CIRTH_40 \\** TODO : DOCUMENT and ADD OPTION WITH alternative CIRTH_39 **\\\n    {L6_NN}   --> {_L6_NN_}\n\n    \\** ------------- **\\\n\n    \\** CIRTH_30 (rh in angerthas daeron) is not used and is a good choice for ɹ **\\\n    \\** since it is an alternate r and graphically reversed **\\\n    {L7}    === r        * ɹ        * l\n    {_L7_}  === CIRTH_29 * CIRTH_30 * CIRTH_31\n    {L7}    --> {_L7_}\n\n    \\** ------------- **\\\n\n    \\if \"cirth_for_s == USE_CIRTH_34\"\n      {_S_} === CIRTH_34\n    \\else\n      {_S_} === CIRTH_35\n    \\endif\n\n    {L8}   === s * z\n    {_L8_} === {_S_} * CIRTH_36\n    {L8}   --> {_L8_}\n    \\if \"nasal_consonants == NASAL_CONSONANTS_USE_CIRCUMFLEX\"\n      {L8_NASAL}   === ns * nz\n      [{L8_NASAL}] --> [{_L8_}] TEHTA_CIRCUM\n    \\endif\n\n    \\** ------------- **\\\n\n    \\** Use same character as in sindarin **\\\n    {_WH_} === CIRTH_5\n    \\if \"ancient_voiceless_labiovelar_fricative_wh == WH_VLVF_WHINE_MERGER\"\n      {_WH_} === CIRTH_26\n    \\endif\n\n    {L9}    === h        * ʍ\n    {_L9_}  === CIRTH_54 * {_WH_}\n    {L9} --> {_L9_}\n\n    \\** ------------- **\\\n    \\** -- SPECIAL TOKENS **\\\n\n    \\if \"english_the == ENGLISH_THE_EXTENDED_CIRTH\"\n      _ð{ALL_ESCHWA}_  --> CIRTH_EREB_3\n      _ðɪ_             --> CIRTH_EREB_3 CIRTH_59 \\** or CIRTH_39 (long vcrtical bar) **\\\n    \\endif\n\n    \\if \"english_and == ENGLISH_AND_EXTENDED_CIRTH\"\n      _{A_FRONT}nd_ --> CIRTH_60\n    \\endif\n\n  \\end\n\n  \\beg rules punctuation\n    . --> CIRTH_PUNCT_THREE_DOTS\n    .. --> CIRTH_PUNCT_THREE_DOTS\n    ... --> CIRTH_PUNCT_THREE_DOTS\n    …   --> CIRTH_PUNCT_THREE_DOTS\n    .... --> CIRTH_PUNCT_FOUR_DOTS\n    ..... --> CIRTH_PUNCT_FOUR_DOTS\n    ...... --> CIRTH_PUNCT_FOUR_DOTS\n    ....... --> CIRTH_PUNCT_FOUR_DOTS\n\n    , --> CIRTH_PUNCT_MID_DOT\n    : --> CIRTH_PUNCT_TWO_DOTS\n    ; --> CIRTH_PUNCT_TWO_DOTS\n    ! --> CIRTH_PUNCT_THREE_DOTS\n    ? --> CIRTH_PUNCT_THREE_DOTS\n    · --> {NULL}\n\n    - --> {NULL}\n    – --> CIRTH_PUNCT_TWO_DOTS\n    — --> CIRTH_PUNCT_TWO_DOTS\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n\n    \\** NBSP **\\\n    {NBSP} --> NBSP\n\n    \\** Quotes **\\\n\n    “ --> CIRTH_PUNCT_DOUBLE_VBAR\n    ” --> CIRTH_PUNCT_DOUBLE_VBAR\n    « --> CIRTH_PUNCT_DOUBLE_VBAR\n    » --> CIRTH_PUNCT_DOUBLE_VBAR\n\n    [ --> CIRTH_PUNCT_DOUBLE_VBAR\n    ] --> CIRTH_PUNCT_DOUBLE_VBAR\n    ( --> CIRTH_PUNCT_DOUBLE_VBAR\n    ) --> CIRTH_PUNCT_DOUBLE_VBAR\n    { --> CIRTH_PUNCT_DOUBLE_VBAR\n    } --> CIRTH_PUNCT_DOUBLE_VBAR\n    ⟨ --> CIRTH_PUNCT_DOUBLE_VBAR\n    ⟩ --> CIRTH_PUNCT_DOUBLE_VBAR\n    < --> CIRTH_PUNCT_DOUBLE_VBAR\n    > --> CIRTH_PUNCT_DOUBLE_VBAR\n\n    \\** Not universal between fonts ... **\\\n    $ --> CIRTH_PUNCT_STAR\n\n  \\end\n\n  \\beg rules numbers\n    \\** Completely invented pentimal system based on the number of strokes **\\\n    0 --> CIRTH_31 TEHTA_SUB_DOT\n    6 --> CIRTH_8 TEHTA_SUB_DOT\n    7 --> CIRTH_1 TEHTA_SUB_DOT\n    8 --> CIRTH_2 TEHTA_SUB_DOT\n    9 --> CIRTH_6 TEHTA_SUB_DOT\n    5 --> CIRTH_39 TEHTA_SUB_DOT\n    1 --> CIRTH_10 TEHTA_SUB_DOT\n    2 --> CIRTH_3 TEHTA_SUB_DOT\n    3 --> CIRTH_4 TEHTA_SUB_DOT\n    4 --> CIRTH_7 TEHTA_SUB_DOT\n  \\end\n\n\\end\n\n\\beg  postprocessor\n  \\if \"space_character == USE_NON_BREAKING_SPACE_SMALL\"\n    \\outspace CIRTH_SPACE\n  \\elsif \"space_character == USE_NON_BREAKING_SPACE_BIG\"\n    \\outspace CIRTH_SPACE_BIG\n  \\elsif \"space_character == USE_MIDDLE_DOT\"\n    \\outspace \"CIRTH_SPACE CIRTH_PUNCT_MID_DOT CIRTH_SPACE\"\n  \\else\n    \\outspace SPACE\n  \\endif\n\n  \\resolve_virtuals\n\\end\n"