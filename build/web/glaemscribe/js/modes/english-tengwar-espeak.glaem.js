Glaemscribe.resource_manager.raw_modes["english-tengwar-espeak"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more\nspecifically dedicated to the transcription of J.R.R. Tolkien\'s\ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\beg changelog\n  \\entry \"0.0.1\" \"First version.\"\n\\end\n\n\\language \"English\"\n\\writing  \"Tengwar\"\n\\mode     \"English Tengwar - General Use\"\n\\version  \"0.0.1\"\n\\authors  \"J.R.R. Tolkien, impl. Talagan (Benjamin Babut), advis. Corchalad (Bertrand Bellet)\"\n\n\\world      primary_related_to_arda\n\\invention  jrrt\n\n\\raw_mode \"raw-tengwar\"\n\n\\charset  tengwar_ds_sindarin false\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  true\n\\charset  tengwar_ds_elfica   false\n\n\\charset  tengwar_guni_sindarin false\n\\charset  tengwar_guni_parmaite false\n\\charset  tengwar_guni_eldamar  false\n\\charset  tengwar_guni_annatar  false\n\\charset  tengwar_guni_elfica   false\n\n\\charset  tengwar_freemono    false\n\\charset  tengwar_telcontar   false\n\n\\beg options\n\n  \\** ENGLISH accent/dialect/variant. It also controls espeak behaviour. **\\\n  \\beg option espeak_voice ESPEAK_VOICE_EN_TENGWAR\n    \\value ESPEAK_VOICE_EN_TENGWAR          0\n    \\value ESPEAK_VOICE_EN_TENGWAR_GB       1\n    \\value ESPEAK_VOICE_EN_TENGWAR_RP       2\n    \\value ESPEAK_VOICE_EN_TENGWAR_US       3\n  \\end\n\n  \\** \'the\' word **\\\n  \\beg option english_the ENGLISH_THE_EXTENDED_TENGWAR\n    \\value ENGLISH_THE_EXTENDED_TENGWAR 0\n    \\value ENGLISH_THE_SEPARATE 1\n  \\end\n\n  \\** \'of\' word **\\\n  \\beg option english_of ENGLISH_OF_EXTENDED_TENGWAR\n    \\value ENGLISH_OF_EXTENDED_TENGWAR 0\n    \\value ENGLISH_OF_SEPARATE 1\n  \\end\n\n  \\** \'to\' word (the word \'to\' may have its vowel reduced to a schwa) **\\\n  \\beg option schwa_of_to SCHWA_OF_TO_U\n    \\value SCHWA_OF_TO_U 0\n    \\value SCHWA_OF_TO_SCHWA 1\n  \\end\n\n  \\** \'wh\' in old accents/US. Sometimes called \'wine/whine\' merger. **\\\n  \\beg option ancient_voiceless_labiovelar_fricative_wh WH_VLVF_HWESTA_SINDARINWA\n    \\value WH_VLVF_HWESTA_SINDARINWA 0\n    \\value WH_VLVF_WHINE_MERGER 1\n  \\end\n\n  \\** SARINCE option when consonants are oriented left **\\\n  \\beg option s_consonants_l SCONSL_SARINCE_ALWAYS\n    \\value SCONSL_SARINCE_NEVER  0\n    \\value SCONSL_SARINCE_ALWAYS 1\n  \\end\n\n  \\** SARINCE option when consonants are oriented right **\\\n  \\beg option s_consonants_r SCONSR_SARINCE_END_OF_WORD\n    \\value SCONSR_SARINCE_NEVER  0\n    \\value SCONSR_SARINCE_ALWAYS 1\n    \\value SCONSR_SARINCE_END_OF_WORD 2\n  \\end\n\n  \\** Re-establishment of linking r in non-rhotic accent, ex : \'better life\' vs \'betteR answer\' **\\\n  \\beg option linking_r true\n    \\visible_when \"espeak_voice == ESPEAK_VOICE_EN_TENGWAR_RP || espeak_voice == ESPEAK_VOICE_EN_TENGWAR_GB\"\n  \\end\n\n  \\** Intrusive r, like in vanillaR ice **\\\n  \\beg option intrusive_r true\n    \\visible_when \"espeak_voice != ESPEAK_VOICE_EN_TENGWAR_US\"\n  \\end\n\n  \\beg option pre_consonant_n_with_same_articulation_point PRE_CONSONANT_N_WITH_SAME_ARTICULATION_POINT_MARK\n    \\value PRE_CONSONANT_N_WITH_SAME_ARTICULATION_POINT_SEPARATE 0\n    \\value PRE_CONSONANT_N_WITH_SAME_ARTICULATION_POINT_MARK 1\n  \\end\n\n  \\** **\\\n  \\beg option pre_velar_n PRE_VELAR_N_ASSIMILABLE\n    \\value PRE_VELAR_N_NON_ASSIMILABLE 0\n    \\value PRE_VELAR_N_ASSIMILABLE 1\n  \\end\n\n  \\** Common elvish / tengwar option **\\\n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_WAVE\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n\n  \\** Long a like in \'palm\' **\\\n  \\beg option long_back_a LONG_BACK_A_IMPLICIT_CARRIER\n    \\radio\n    \\value LONG_BACK_A_IMPLICIT_CARRIER 0\n    \\value LONG_BACK_A_WITH_CARRIER 1\n  \\end\n\n  \\** DISABLED : it\'s always long **\\\n  \\beg option long_front_e LONG_FRONT_E_DOUBLE_TEHTA\n    \\visible_when false\n    \\radio\n    \\value LONG_FRONT_E_DOUBLE_TEHTA 0\n    \\value LONG_FRONT_E_WITH_CARRIER 1\n  \\end\n\n  \\** DISABLED : it\'s always long **\\\n  \\beg option long_back_e LONG_BACK_E_DOUBLE_TEHTA\n    \\visible_when false\n    \\radio\n    \\value LONG_BACK_E_DOUBLE_TEHTA 0\n    \\value LONG_BACK_E_WITH_CARRIER 1\n  \\end\n\n  \\** Long i like in \'fleece\' **\\\n  \\beg option long_i LONG_I_DOUBLE_TEHTA\n    \\radio\n    \\value LONG_I_DOUBLE_TEHTA 0\n    \\value LONG_I_WITH_CARRIER 1\n    \\value LONG_I_AS_DIPHTONG  2\n  \\end\n\n  \\** long o like in \'thought\' **\\\n  \\beg option long_o LONG_O_DOUBLE_TEHTA\n    \\radio\n    \\value LONG_O_DOUBLE_TEHTA 0\n    \\value LONG_O_WITH_CARRIER 1\n  \\end\n\n  \\** long u like in \'goose\' **\\\n  \\beg option long_u LONG_U_DOUBLE_TEHTA\n    \\radio\n    \\value LONG_U_DOUBLE_TEHTA 0\n    \\value LONG_U_WITH_CARRIER 1\n    \\value LONG_U_AS_DIPHTONG  2\n  \\end\n\n  \\** \'cure\', \'cute\' diphthong **\\\n  \\beg option ju_diphthong JU_DIPHTHONG_SEPARATE\n    \\radio\n    \\value JU_DIPHTHONG_SEPARATE 0\n    \\value JU_DIPHTHONG_LIKE_IW  1\n  \\end\n\n  \\** Horse / Hoarse vowel distinction (only JRRT/US accents) **\\\n  \\beg option horse_hoarse_merger HORSE_HOARSE_SEPARATE\n    \\visible_when \"espeak_voice == ESPEAK_VOICE_EN_TENGWAR || espeak_voice == ESPEAK_VOICE_EN_TENGWAR_US\"\n    \\value HORSE_HOARSE_MERGE 0\n    \\value HORSE_HOARSE_SEPARATE 1\n  \\end\n\n  \\** Cot / Coat vowel distinction, all accents **\\\n  \\beg option cot_coat_merger COT_COAT_SEPARATE\n    \\value COT_COAT_MERGE 0\n    \\value COT_COAT_SEPARATE 1\n    \\visible_when \"espeak_voice == ESPEAK_VOICE_EN_TENGWAR_US\"\n  \\end\n\n  \\** Remove unuseful, natural schwa marks **\\\n  \\beg option implicit_schwa IMPLICIT_SCHWA_NO\n    \\value IMPLICIT_SCHWA_NO  0\n    \\value IMPLICIT_SCHWA_YES 1\n  \\end\n\n  \\** when implicit schwa is on, how to mark non-reducible schwas **\\\n  \\beg option implicit_schwa_non_reducible IMPLICIT_SCHWA_NON_REDUCIBLE_UNUTIXE_IF_POSSIBLE\n    \\value IMPLICIT_SCHWA_NON_REDUCIBLE_UNUTIXE_IF_POSSIBLE 0\n    \\value IMPLICIT_SCHWA_NON_REDUCIBLE_ALWAYS_TELCO        1\n    \\visible_when \"implicit_schwa == IMPLICIT_SCHWA_YES\"\n  \\end\n\n  \\** Schwi, in US/JRRT **\\\n  \\beg option schwi SCHWI_LIKE_I\n    \\radio\n    \\value SCHWI_LIKE_I     0\n    \\value SCHWI_LIKE_SCHWA 1\n    \\visible_when \"espeak_voice == ESPEAK_VOICE_EN_TENGWAR || espeak_voice == ESPEAK_VOICE_EN_TENGWAR_US\"\n  \\end\n\n  \\** \'strut\' vowel special case **\\\n  \\beg option open_mid_back_unrounded OMBU_THINNAS\n    \\radio\n    \\value OMBU_THINNAS    0\n    \\value OMBU_GRAVE      1\n    \\value OMBU_LIKE_SCHWA 2\n  \\end\n\n  \\** Common elvish / tengwar option **\\\n  \\beg option reverse_o_u_tehtar U_UP_O_DOWN\n    \\value O_UP_U_DOWN 1\n    \\value U_UP_O_DOWN 2\n  \\end\n\n  \\** Use english standard by default **\\\n  \\option reverse_numbers false\n  \\beg option numbers_base BASE_10\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n\n  \\option auto_spacing true\n\n\\end\n\n\\beg  preprocessor\n  \\downcase\n\n  \\** Remove phonetics accentuation marks **\\\n  \\rxsubstitute \"[ˈˌ]\" \"\"\n\n  \\** foreign words nasal a, split to \"an\" (ex: croissant) **\\\n  \\rxsubstitute \"ɑ̃\" \"ɑn\"\n\n  \\** Non rhotic schwa simplification **\\\n  \\rxsubstitute \"ɐ\" \"ə\"\n\n  \\if linking_r\n    \\rxsubstitute \"ɹ‿\" \"ɹ\"\n  \\else\n    \\rxsubstitute \"ɹ‿\" \"\"\n  \\endif\n\n  \\if intrusive_r\n    \\rxsubstitute \"ɹ̩‿\" \"ɹ\"\n  \\else\n    \\rxsubstitute \"ɹ̩‿\" \"\"\n  \\endif\n\n  \\if \"schwa_of_to == SCHWA_OF_TO_U\"\n    \\substitute \"ʊ̟\" \"ʊ\"\n  \\else\n    \\substitute \"ʊ̟\" \"ə\"\n  \\endif\n\n  \\if \"pre_velar_n == PRE_VELAR_N_ASSIMILABLE\"\n    \\rxsubstitute \"n‿\" \"ŋ\"\n  \\else\n    \\rxsubstitute \"n‿\" \"n\"\n  \\endif\n\n  \\** IMPORTANT NOTE : in all following regexps **\\\n  \\** (^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃]) stands for \'word boundary\' **\\\n\n  \\** \'the\' variations **\\\n  \\** that the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(ð[aæ]t)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n\n  \\** of the **\\\n  \\if \"english_the == ENGLISH_THE_EXTENDED_TENGWAR && english_of == ENGLISH_OF_EXTENDED_TENGWAR\"\n    \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])([ɒʌ]v)ð([əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1OFTH\\\\3\\\\4\"\n  \\else\n    \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])([ɒʌ]v)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\endif\n\n  \\** for the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(f[ɚə])(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** with the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(wɪð)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** in the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(ɪn)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** on the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])([ɒɔ]n)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** from the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(fɹʌm)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n  \\** was the **\\\n  \\rxsubstitute \"(^|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])(wʌz)(ð[əɪ])($|[^a-zA-Zæǽɑɒɐəɚɛɜɪᵻʊʌɔðŋɡɣɹɾʃʍʒʔθː̟̩̃])\" \"\\\\1\\\\2 \\\\3\\\\4\"\n\n  \\** Beware of the order of COT/COAT merger and horse/hoarse merger **\\\n  \\if \"cot_coat_merger == COT_COAT_MERGE && espeak_voice == ESPEAK_VOICE_EN_TENGWAR_US\"\n     \\substitute \"oʊ\" \"ɑː\"\n  \\endif\n\n  \\if \"horse_hoarse_merger == HORSE_HOARSE_SEPARATE\"\n    \\** Re-establish former diphtong **\\\n    \\substitute \"oːɹ\" \"oʊɹ\"\n  \\endif\n\n\n  \\** If treated as diphthong, change long i to i + schwi **\\\n  \\if \"long_i == LONG_I_AS_DIPHTONG\"\n    \\substitute \"iː\" \"iɪ\"\n  \\endif\n\n  \\** Experimental, don\'t affect ju: at beginning of words/after consonnant **\\\n  \\if \"ju_diphthong == JU_DIPHTHONG_LIKE_IW\"\n    \\rxsubstitute \"(juː|jʊ)\" \"iw\"\n  \\endif\n\n  \\if \"long_u == LONG_U_AS_DIPHTONG\"\n    \\substitute \"uː\" \"uʊ\"\n  \\endif\n\n  \\** ! Beware of the order of the following rules **\\\n  \\** ! Rhotic schwa : remove 1 level of length when superfluous and always add explicit mark **\\\n  \\rxsubstitute \"[ɜɚ]ː?\" \"ɜɹ\"\n\n  \\** ! Potentially remove superfluous added rhotic marks **\\\n  \\rxsubstitute \"ɹ+\" \"ɹ\"\n\n  \\** ! Disambiguate ɹ + vowel : ORE/ROMEN **\\\n  \\rxsubstitute \"ɹ([ɑæaeɛʌɐəɜɚiɪᵻoɒɔuʊʘ])\" \"r\\\\1\"\n\n  \\if \"implicit_schwa == IMPLICIT_SCHWA_YES\"\n    \\** All schwas at beginning of words cannot reduce **\\\n    \\** or after vowels (== not consonant) **\\\n    \\** beware of ɪ as it can appear as consonant (lawyer) **\\\n    \\** same for ʊ for sour **\\\n    \\** Mark non reducing schwa as ʘ **\\\n    \\rxsubstitute \"(^|[^bcdfghjklmnpqrstvwxyzðŋɡɣɹɾʃʍʒʔθɪʊ])([əɐɜɚ])\" \"\\\\1ʘ\"\n    \\rxsubstitute \"([əɐɜɚ])r\" \"ʘr\"\n\n    \\if \"schwi == SCHWI_LIKE_SCHWA\"\n      \\** Don\'t forget to mark schwis too **\\\n      \\rxsubstitute \"(^|[^bcdfghjklmnpqrstvwxyzðŋɡɣɹɾʃʍʒʔθɪʊ])([ᵻ])\" \"\\\\1ʘ\"\n      \\rxsubstitute \"ᵻr\" \"ʘr\"\n    \\endif\n\n    \\if \"open_mid_back_unrounded == OMBU_LIKE_SCHWA\"\n      \\** Don\'t forget to mark the ombus too **\\\n      \\rxsubstitute \"(^|[^bcdfghjklmnpqrstvwxyzðŋɡɣɹɾʃʍʒʔθɪʊ])([ʌ])\" \"\\\\1ʘ\"\n      \\rxsubstitute \"ʌr\" \"ʘr\"\n    \\endif\n  \\endif\n\n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\n  \\if \"auto_spacing == true\"\n    \\rxsubstitute \"([^\\\\s])([.,;:!?])\" \"\\\\1 \\\\2\"\n    \\rxsubstitute \"([.,;:!?])([^\\\\s])\" \"\\\\1 \\\\2\"\n  \\endif\n\\end\n\n\n\\beg  processor\n\n  \\beg rules litteral\n\n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {GEMINATE} === GEMINATE_SIGN_TILD\n      {NASAL}    === NASALIZE_SIGN_TILD\n    \\else\n      {GEMINATE} === GEMINATE_SIGN\n      {NASAL}    === NASALIZE_SIGN\n    \\endif\n\n    \\** sa-rinci for left-oriented tengwar **\\\n    \\if \"s_consonants_l == SCONSL_SARINCE_ALWAYS\"\n      {LWS}   === [{NULL} * (s,z)]\n      {_LWS_} === [{NULL} * SARINCE]\n      {__LWSX__} === 2,1,3\n    \\else\n      {LWS}   === {NULL}\n      {_LWS_} === {NULL}\n      {__LWSX__} === 2,1\n    \\endif\n\n    \\** sa-rinci for right-oriented tengwar **\\\n    \\if \"s_consonants_r == SCONSR_SARINCE_ALWAYS\"\n      {RWS}   === [{NULL} * (s,z)]\n      {_RWS_} === [{NULL} * SARINCE]\n      {__RWSX__} === 2,1,3\n    \\elsif \"s_consonants_r == SCONSR_SARINCE_END_OF_WORD\"\n      {RWS}   === [{NULL} * (s_,z_)]\n      {_RWS_} === [{NULL} * SARINCE]\n      {__RWSX__} === 2,1,3\n    \\else\n      {RWS}   === {NULL}\n      {_RWS_} === {NULL}\n      {__RWSX__} === 2,1\n    \\endif\n\n    \\if \"reverse_o_u_tehtar == U_UP_O_DOWN\"\n      {O_LOOP}        === O_TEHTA\n      {O_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n      {U_LOOP}        === U_TEHTA\n      {U_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n    \\else\n      {O_LOOP}        === U_TEHTA\n      {O_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n      {U_LOOP}        === O_TEHTA\n      {U_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n    \\endif\n\n    \\** schwas : ɐ,ə **\\\n    \\** rothic shwa : ɚ **\\\n    \\** schwi : ᵻ **\\\n    \\** schwu : ʌ **\\\n\n    {IGROUP}               === i,ɪ\n    {UGROUP}               === u,ʊ\n    {EBGROUP}              === ə,ɐ     \\** REDUCIBLE **\\\n\n    {SCHWA_NON_REDUCIBLE}  === ʘ       \\** NON REDUCIBLE **\\\n    {ESCHWA}               === (ə,ʘ)   \\** REDUCIBLE & NON REDUCIBLE E SCHWA **\\\n\n    \\if \"schwi == SCHWI_LIKE_I\"\n      {IGROUP} === {IGROUP},ᵻ\n    \\else\n      {EBGROUP} === {EBGROUP},ᵻ\n    \\endif\n\n    {W_OMBU_GROUP}    === {NULL}\n    {_W_OMBU_GROUP_}  === {NULL}\n    \\if \"open_mid_back_unrounded == OMBU_GRAVE\"\n      {W_OMBU_GROUP}   === * (ʌ)\n      {_W_OMBU_GROUP_} === * E_TEHTA_GRAVE\n    \\elsif \"open_mid_back_unrounded == OMBU_THINNAS\"\n      {W_OMBU_GROUP}   === * (ʌ)\n      {_W_OMBU_GROUP_} === * THINNAS\n    \\else\n      {EBGROUP} === {EBGROUP},ʌ\n    \\endif\n\n    {A_FRONT}             === (æ,a)       \\** Always short **\\\n    {A_BACK}              === (ɑ)         \\** Always long **\\\n    {E_FRONT}             === (e,ɛ)\n    {E_BACK}              === ({EBGROUP})\n    {E_BACK_RHOTIC}       === (ɚ,ɜ)       \\** Rhotic schwas are treated independently **\\\n    {I}                   === ({IGROUP})\n    {O}                   === (o,ɒ,ɔ)     \\** force, mock, lord **\\\n    {U}                   === ({UGROUP})\n\n\n    {AA_FRONT}        === {A_FRONT}ː    \\** long front a probably does not exist **\\\n    {AA_BACK}         === {A_BACK}ː\n    {EE_FRONT}        === {E_FRONT}ː\n    {EE_BACK}         === {E_BACK}ː     \\** long back e probably does not exist when not rhotic **\\\n    {EE_BACK_RHOTIC}  === {E_BACK_RHOTIC}ː\n    {II}              === {I}ː\n    {OO}              === {O}ː\n    {UU}              === {U}ː\n\n    {W_SCHWA_NON_REDUCIBLE}    === {NULL}\n    {_W_SCHWA_NON_REDUCIBLE_}  === {NULL}\n\n    \\if \"implicit_schwa == IMPLICIT_SCHWA_YES\"\n      {_IMPLICIT_SCHWA_} === {NULL}\n      \\if \"implicit_schwa_non_reducible == IMPLICIT_SCHWA_NON_REDUCIBLE_UNUTIXE_IF_POSSIBLE\"\n        {W_SCHWA_NON_REDUCIBLE}   === * {SCHWA_NON_REDUCIBLE}\n        {_W_SCHWA_NON_REDUCIBLE_} === * UNUTIXE\n      \\endif\n    \\else\n      {_IMPLICIT_SCHWA_} === UNUTIXE\n    \\endif\n\n    \\** GB DIPHTONGS **\\\n    \\** +dˈeɪ +skˈaɪ +bˈɔɪ +bˈiə +bˈeə +tˈʊə +ɡˌəʊ +kˈaʊ **\\\n    \\** US DIPHTONGS **\\\n    \\** =dˈeɪ =skˈaɪ =bˈɔɪ -bˈɪɹ -bˈɛɹ -tˈʊɹ +ɡˌoʊ =kˈaʊ **\\\n\n    \\** U Diphthongs **\\\n    {AW} === aʊ        \\** cow **\\\n    {OW} === oʊ        \\** US most / mˈoʊst **\\\n    {EW} === {ESCHWA}ʊ \\** GB go **\\\n    {UW} === uʊ        \\** goose if pronconced with labializing accent ... we don\'t have this in our pronunciations **\\\n\n    \\** I Diphtongues :  eɪ (day) / aɪ (sky) / ɔɪ (boy)  **\\\n    {AJ} === aɪ \\** nine / nˈaɪn **\\\n    {EJ} === eɪ \\** game / ɡˈeɪm **\\\n    {OJ} === ɔɪ \\** boy **\\\n    {IJ} === iɪ \\** fleece if prononced with palatalising accent **\\\n\n    \\** ə diphthongs : iə (GB : beer) / eə (GB: bear) / ʊə (US: tour) **\\\n    {IER} === i{ESCHWA} \\** GB Beer **\\\n    {EAR} === e{ESCHWA} \\** GB Bear **\\\n    {UER} === ʊ{ESCHWA} \\** GB Tour **\\\n\n    {VOWELS}        === {A_BACK}  * {A_FRONT}             * {E_FRONT}     * {E_BACK}           * {E_BACK_RHOTIC}    * {IER}            * {EAR}           * {UER}             * {I}         * {O}           * {U}       {W_SCHWA_NON_REDUCIBLE}    {W_OMBU_GROUP}\n    {TEHTAR}        === A_TEHTA   * A_TEHTA_REVERSED      * E_TEHTA       * {_IMPLICIT_SCHWA_} * {_IMPLICIT_SCHWA_} * UNUTIXE I_TEHTA  * UNUTIXE E_TEHTA * UNUTIXE {U_LOOP}  * I_TEHTA     * {O_LOOP}      * {U_LOOP}  {_W_SCHWA_NON_REDUCIBLE_}  {_W_OMBU_GROUP_}\n\n    {LVOWELS}       === {AA_BACK} * {AA_FRONT}            * {EE_FRONT}    * {EE_BACK}          * {EE_BACK_RHOTIC}   * {II}        * {OO}          * {UU}\n\n    {DIPHTHONGS_R}   === {AW}         * {OW}          * {EW}          * {UW}          * {AJ}         * {EJ}         * {OJ}           * {IJ}\n    {_DIPHTHONGS_R_} === VALA A_TEHTA * VALA {O_LOOP} * VALA UNUTIXE  * VALA {U_LOOP} * ANNA A_TEHTA * ANNA E_TEHTA * ANNA {O_LOOP}  * ANNA I_TEHTA\n\n    {DIPHTHONGS}    === {DIPHTHONGS_R}\n    {_DIPHTHONGS_}  === {_DIPHTHONGS_R_}\n\n    {WLONG}     === {NULL} \\** long vowels that can be used as tehtar **\\\n    {_WLONG_}   === {NULL} \\** tehtar of long vowels that can be used as tehtar **\\\n\n    \\** LV : Initialization step 1 **\\\n    {_LONG_A_BACK_}             === ARA A_TEHTA\n    {_LONG_A_FRONT_}            === ARA A_TEHTA_REVERSED  \\** Should not be possible in English **\\\n    {_LONG_E_FRONT_}            === ARA E_TEHTA\n    {_LONG_E_BACK_}             === ARA UNUTIXE \\** PROBLEM (solved) : ara and unutixe don\'t work together. But this case will not appear : long back e is not possible when not rhotic. **\\\n    {_LONG_E_BACK_RHOTIC_}      === ARA UNUTIXE \\** PROBLEM (solved) : ara and unutixe don\'t work together. But this case will not appear : simplified by prepro **\\\n    {_LONG_I_}                  === ARA I_TEHTA\n    {_LONG_O_}                  === ARA {O_LOOP}\n    {_LONG_U_}                  === ARA {U_LOOP}\n\n    \\** LV : Initialization step 2 **\\\n    {_LONE_LONG_A_BACK_}        === {_LONG_A_BACK_}\n    {_LONE_LONG_A_FRONT_}       === {_LONG_A_FRONT_}\n    {_LONE_LONG_E_FRONT_}       === {_LONG_E_FRONT_}\n    {_LONE_LONG_E_BACK_}        === {_LONG_E_BACK_}\n    {_LONE_LONG_E_BACK_RHOTIC_} === {_LONG_E_BACK_RHOTIC_}\n    {_LONE_LONG_I_}             === {_LONG_I_}\n    {_LONE_LONG_O_}             === {_LONG_O_}\n    {_LONE_LONG_U_}             === {_LONG_U_}\n\n    \\if \"long_back_a == LONG_BACK_A_IMPLICIT_CARRIER\"\n      \\** Remove carrier and use A_TEHTA as if it was a double tehta **\\\n      {_LONG_A_BACK_}         === A_TEHTA\n      {_LONE_LONG_E_FRONT_}   === TELCO {_LONG_A_BACK_}\n      {WLONG}                 === {WLONG}   * {AA_BACK}\n      {_WLONG_}               === {_WLONG_} * {_LONG_A_BACK_}\n    \\endif\n\n    \\if \"long_front_e == LONG_FRONT_E_DOUBLE_TEHTA\"\n      \\** Does not exist in standard accents **\\\n      {_LONG_E_FRONT_}        === E_TEHTA_DOUBLE\n      {_LONE_LONG_E_FRONT_}   === TELCO {_LONG_E_FRONT_}\n      {WLONG}                 === {WLONG}   * {EE_FRONT}\n      {_WLONG_}               === {_WLONG_} * {_LONG_E_FRONT_}\n    \\endif\n\n    \\if \"long_back_e == LONG_BACK_E_DOUBLE_TEHTA\"\n      \\** This case should not be possible when not rhotic. **\\\n      {_LONG_E_BACK_}         === I_TEHTA_DOUBLE_INF\n      {_LONE_LONG_E_BACK_}    === TELCO {_LONG_E_BACK_}\n      {WLONG}                 === {WLONG}   * {EE_BACK}\n      {_WLONG_}               === {_WLONG_} * {_LONG_E_BACK_}\n    \\endif\n\n    \\if \"long_i == LONG_I_DOUBLE_TEHTA\"\n      {_LONG_I_}              === I_TEHTA_DOUBLE\n      {_LONE_LONG_I_}         === TELCO {_LONG_I_}\n      {WLONG}                 === {WLONG}   * {II}\n      {_WLONG_}               === {_WLONG_} * {_LONG_I_}\n    \\endif\n\n    \\if \"long_o == LONG_O_DOUBLE_TEHTA\"\n      {_LONG_O_}              === {O_LOOP_DOUBLE}\n      {_LONE_LONG_O_}         === TELCO {_LONG_O_}\n      {WLONG}                 === {WLONG}   * {OO}\n      {_WLONG_}               === {_WLONG_} * {_LONG_O_}\n    \\endif\n\n    \\if \"long_u == LONG_U_DOUBLE_TEHTA\"\n      {_LONG_U_}              === {U_LOOP_DOUBLE}\n      {_LONE_LONG_U_}         === TELCO {_LONG_U_}\n      {WLONG}                 === {WLONG}   * {UU}\n      {_WLONG_}               === {_WLONG_} * {_LONG_U_}\n    \\endif\n\n    \\** Define a variable for the images of all long vowels **\\\n    {_LONE_LONG_VOWELS_} === {_LONE_LONG_A_BACK_} * {_LONE_LONG_A_FRONT_} * {_LONE_LONG_E_FRONT_} * {_LONE_LONG_E_BACK_} * {_LONE_LONG_E_BACK_RHOTIC_} * {_LONE_LONG_I_} * {_LONE_LONG_O_} * {_LONE_LONG_U_}\n\n    {V_D}           === [ {VOWELS} {WLONG}  ]\n    {V_D_WN}        === [ {VOWELS} {WLONG} * {NULL} ]\n\n    {_V_D_}         === [ {TEHTAR} {_WLONG_} ]\n    {_V_D_WN_}      === [ {TEHTAR} {_WLONG_} * {NULL} ]\n\n    \\** Vowel rules **\\\n    [{VOWELS}]              -->   TELCO [{TEHTAR}]  \\** Replace isolated short vowels **\\\n    [{DIPHTHONGS_R}]{RWS}   -->   [{_DIPHTHONGS_R_}]{_RWS_}  \\** Replace diphthongs **\\\n\n    \\if \"implicit_schwa_non_reducible == IMPLICIT_SCHWA_NON_REDUCIBLE_ALWAYS_TELCO\"\n      ʘ --> TELCO\n    \\endif\n\n    \\** LONE LONG VOWELS **\\\n    [{LVOWELS}]     --> [{_LONE_LONG_VOWELS_}]\n\n    {_WH_} === HWESTA_SINDARINWA\n    \\if \"ancient_voiceless_labiovelar_fricative_wh == WH_VLVF_WHINE_MERGER\"\n      {_WH_} === VALA\n    \\endif\n\n    \\beg macro serie_l ARG_SL _ARG_SL_\n      {V_D_WN}[{ARG_SL}]{LWS}  --> {__LWSX__}  --> [{_ARG_SL_}]{_V_D_WN_}{_LWS_}\n    \\end\n    \\beg macro serie_ln ARG_SLN _ARG_SLN_\n      {V_D_WN}[{ARG_SLN}]{LWS} --> {__LWSX__}  --> [{_ARG_SLN_}]{NASAL}{_V_D_WN_}{_LWS_}\n    \\end\n    \\beg macro serie_r ARG_SR _ARG_SR_\n      {V_D_WN}[{ARG_SR}]{RWS}  --> {__RWSX__}  --> [{_ARG_SR_}]{_V_D_WN_}{_RWS_}\n    \\end\n    \\beg macro serie_rn ARG_SRN _ARG_SRN_\n      {V_D_WN}[{ARG_SRN}]{RWS} --> {__RWSX__}  --> [{_ARG_SRN_}]{NASAL}{_V_D_WN_}{_RWS_}\n    \\end\n\n    \\** Nasal + Conditional macro **\\\n    \\beg macro serie_lnc ARG_SLN_COND _ARG_SLN_COND_\n      \\if \"pre_consonant_n_with_same_articulation_point == PRE_CONSONANT_N_WITH_SAME_ARTICULATION_POINT_MARK\"\n        \\deploy serie_ln {ARG_SLN_COND} {_ARG_SLN_COND_}\n      \\endif\n    \\end\n\n    \\** Nasal + Conditional macro **\\\n    \\beg macro serie_rnc ARG_SRN_COND _ARG_SRN_COND_\n      \\if \"pre_consonant_n_with_same_articulation_point == PRE_CONSONANT_N_WITH_SAME_ARTICULATION_POINT_MARK\"\n        \\deploy serie_rn {ARG_SRN_COND} {_ARG_SRN_COND_}\n      \\endif\n    \\end\n\n    \\beg macro serie ARG_L ARG_R ARG_LN ARG_RN _ARG_L_ _ARG_R_\n      \\deploy serie_l   {ARG_L}  {_ARG_L_}\n      \\deploy serie_r   {ARG_R}  {_ARG_R_}\n      \\deploy serie_lnc {ARG_LN} {_ARG_L_}\n      \\deploy serie_rnc {ARG_RN} {_ARG_R_}\n    \\end\n\n    \\** ----------------------------------------------------------- **\\\n    {L1R}            === (t,ɾ,ʔ)  * p\n    {L1L}            === tʃ       * k\n    {L1R_NASAL}      === n(t,ɾ,ʔ) * mp\n    {L1L_NASAL}      === ntʃ      * ŋk\n    {_L1R_}          === TINCO    * PARMA\n    {_L1L_}          === CALMA    * QUESSE\n\n    \\deploy serie    {L1L} {L1R} {L1L_NASAL} {L1R_NASAL} {_L1L_} {_L1R_}\n\n    \\** ----------------------------------------------------------- **\\\n    {L2R}            === d     * b\n    {L2L}            === dʒ    * (ɡ,g)\n    {L2R_NASAL}      === nd    * mb\n    {L2L_NASAL}      === ndʒ   * ŋ(ɡ,g)\n    {_L2R_}          === ANDO  * UMBAR\n    {_L2L_}          === ANGA  * UNGWE\n\n    \\deploy serie    {L2L} {L2R} {L2L_NASAL} {L2R_NASAL} {_L2L_} {_L2R_}\n\n    \\** ----------------------------------------------------------- **\\\n    {L3R}             === θ       * f      * ʃ       * x\n    {L3R_NASAL}       === nθ      * mf     * nʃ      * ŋx\n    {_L3R_}           === SULE    * FORMEN * AHA     * HWESTA\n\n    \\deploy serie_r   {L3R}          {_L3R_}\n    \\deploy serie_rnc {L3R_NASAL}    {_L3R_}\n\n    \\** ----------------------------------------------------------- **\\\n    {L4R}             === ð     * v     * ʒ     * ɣ\n    {L4R_NASAL}       === nð    * mv    * nʒ    * ŋɣ\n    {_L4R_}           === ANTO  * AMPA  * ANCA  * UNQUE\n\n    \\deploy serie_r   {L4R}          {_L4R_}\n    \\deploy serie_rnc {L4R_NASAL}    {_L4R_}\n\n    \\** ----------------------------------------------------------- **\\\n    {L5R}           === (n,n̩)    * m      * n(j,J)   * ŋ\n    {_L5R_}         === NUMEN    * MALTA  * NOLDO    * NWALME\n\n    \\** no nasals for this serie **\\\n    \\deploy serie_r  {L5R}  {_L5R_}\n\n    \\** ----------------------------------------------------------- **\\\n    {L6R}           === w\n    {L6R_NASAL}     === nw\n    {_L6R_}         === VALA\n\n    {L6R_NN}        === (j,J)\n    {_L6R_NN_}      === ANNA     \\** ORE for rhoticized schwas **\\\n\n    \\deploy serie_r   {L6R}        {_L6R_}\n    \\deploy serie_r   {L6R_NN}     {_L6R_NN_}\n    \\deploy serie_rnc {L6R_NASAL}  {_L6R_}\n\n    \\** ----------------------------------------------------------- **\\\n    {L7R}           === r     * ɹ      * l\n    {_L7R_}         === ROMEN * ORE    * LAMBE     \\** ARDA / ALDA **\\\n\n    \\deploy serie_r  {L7R}  {_L7R_}\n\n    \\** ----------------------------------------------------------- **\\\n    {L8}           === s * z\n    {L8_NASAL}     === ns * nz\n    {_L8_}         === SILME_NUQUERNA * ESSE_NUQUERNA\n\n    {V_D_WN}[{L8}] --> 2,1 --> [{_L8_}]{_V_D_WN_}\n    \\if \"s_consonants_r != SCONSR_SARINCE_ALWAYS && pre_consonant_n_with_same_articulation_point == PRE_CONSONANT_N_WITH_SAME_ARTICULATION_POINT_MARK\"\n      \\** Avoid clash between nasal sign and sa rince **\\\n      {V_D_WN}[{L8_NASAL}]  --> 2,1 --> [{_L8_}]{NASAL}{_V_D_WN_}\n    \\endif\n\n    \\** Single s/z : overload **\\\n    s   --> SILME\n    z   --> ESSE\n\n    ns  --> SILME_NUQUERNA {NASAL} \\** Explicitly redefined for clarity (already defined in the nasal rule above) **\\\n    nz  --> ESSE_NUQUERNA {NASAL}  \\** Explicitly redefined for clarity (already defined in the nasal rule above) **\\\n\n    \\** ----------------------------------------------------------- **\\\n    {L9}    === h       * ʍ\n    {_L9_}  === HYARMEN * {_WH_} \\** YANTA / URE **\\\n\n    {V_D_WN}[{L9}]  --> 2,1 --> [{_L9_}]{_V_D_WN_}\n\n    \\** -- SPECIAL TOKENS **\\\n\n    \\if \"english_the == ENGLISH_THE_EXTENDED_TENGWAR\"\n      _ð{ESCHWA}_   --> TW_EXT_21\n      _ðɪ_         --> TW_EXT_21 I_TEHTA\n    \\endif\n\n    \\if \"english_of == ENGLISH_OF_EXTENDED_TENGWAR\"\n      _(ɒ,ʌ)v_ --> TW_EXT_22\n    \\endif\n\n    \\if \"english_the == ENGLISH_THE_EXTENDED_TENGWAR && english_of == ENGLISH_OF_EXTENDED_TENGWAR\"\n      _OFTH{ESCHWA}_ --> TW_EXT_22 {GEMINATE}\n      _OFTHɪ_        --> TW_EXT_22 {GEMINATE} I_TEHTA\n    \\endif\n  \\end\n\n  \\beg rules punctuation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    ... --> PUNCT_TILD\n    …   --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> {NULL}\n\n    - --> {NULL}\n    – --> PUNCT_TILD\n    — --> PUNCT_TILD\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n\n    \\** NBSP **\\\n    {NBSP} --> NBSP\n\n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN\n    » --> DQUOT_CLOSE\n\n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R\n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n  \\end\n\n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11\n  \\end\n\\end\n\n\\beg  postprocessor\n  \\resolve_virtuals\n\\end\n"