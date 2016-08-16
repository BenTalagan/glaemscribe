Glaemscribe.resource_manager.raw_modes["blackspeech-annatar"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** BlackSpeech ring mode for glaemscribe (FAR FROM BEING COMPLETE!!!) **\\\n\n\\language \"Black Speech\"\n\\writing  \"Tengwar\"\n\\mode     \"Ring Style / Cursive\"\n\\version  \"0.0.1\"\n\\authors  \"Talagan (Benjamin Babut)\"\n\n\\charset  tengwar_ds true\n\n\\beg      options\n  \\option reverse_numbers true\n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \n  \\** Preprocess numbers **\\\n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n  \n\\beg processor\n\n  \\beg rules litteral\n    {A}                 === a\n    {AA}                === á\n    {E}                 === e\n    {EE}                === é\n    {I}                 === i\n    {II}                === í\n    {O}                 === o\n    {OO}                === ó\n    {U}                 === u\n    {UU}                === ú\n    \n    {AI}                === {A}{I} \\** attested **\\\n    {AU}                === {A}{U} \\** attested **\\\n    {OI}                === {O}{I} \\** Not quite sure (dushgoi) **\\\n    \n    {K}                 === (c,k)\n    \n    \\** VOWELS **\\\n    {VOWELS}            === {A}               * {E}               * {I}        * {O}                * {U}\n    {LVOWELS}           === {AA}              * {EE}              * {II}       * {OO}               * {UU}  \n    \\** Reverse o and u **\\\n    {TEHTA_XS}          === A_TEHTA_XS        * E_TEHTA_XS        * I_TEHTA_XS *  U_TEHTA_XS        * O_TEHTA_XS      \n    {TEHTA__S}          === A_TEHTA_S         * E_TEHTA_S         * I_TEHTA_S  *  U_TEHTA_S         * O_TEHTA_S     \n    {TEHTA__L}          === A_TEHTA_L         * E_TEHTA_L         * I_TEHTA_L  *  U_TEHTA_L         * O_TEHTA_L     \n    {TEHTA_XL}          === A_TEHTA_XL        * E_TEHTA_XL        * I_TEHTA_XL *  U_TEHTA_XL        * O_TEHTA_XL          \n    \\** Double tehtas **\\ \n    {DTEHTA_XS}         === A_TEHTA_DOUBLE_XS * E_TEHTA_DOUBLE_XS * Y_TEHTA_XS * U_TEHTA_DOUBLE_XS  * O_TEHTA_DOUBLE_XS \n    {DTEHTA_S}          === A_TEHTA_DOUBLE_S  * E_TEHTA_DOUBLE_S  * Y_TEHTA_S  * U_TEHTA_DOUBLE_S   * O_TEHTA_DOUBLE_S  \n    {DTEHTA_L}          === A_TEHTA_DOUBLE_L  * E_TEHTA_DOUBLE_L  * Y_TEHTA_L  * U_TEHTA_DOUBLE_L   * O_TEHTA_DOUBLE_L   \n    {DTEHTA_XL}         === A_TEHTA_DOUBLE_XL * E_TEHTA_DOUBLE_XL * Y_TEHTA_XL * U_TEHTA_DOUBLE_XL  * O_TEHTA_DOUBLE_XL\n        \n    {DIPHTHONGS}         === {AI}              * {AU}              *  {OI}              \n    {DIPHTHENGS}         === YANTA A_TEHTA_L    * URE A_TEHTA_L     * YANTA U_TEHTA_L   \n     \n    {V_D_KER}           === [ {VOWELS}   * {LVOWELS}    * {DIPHTHONGS} ]\n    {V_D_IMG_XS}        === [ {TEHTA_XS} * {DTEHTA_XS}  * {DIPHTHENGS} ]\n    {V_D_IMG__S}        === [ {TEHTA__S} * {DTEHTA_L}   * {DIPHTHENGS} ]\n    {V_D_IMG__L}        === [ {TEHTA__L} * {DTEHTA_S}   * {DIPHTHENGS} ]\n    {V_D_IMG_XL}        === [ {TEHTA_XL} * {DTEHTA_XL}  * {DIPHTHENGS} ]\n    \n    [{VOWELS}]          -->   TELCO [{TEHTA_XS}]  \\** Replace isolated short vowels **\\\n    [{LVOWELS}]         -->   ARA   [{TEHTA_XS}]  \\**  Replace long vowels **\\\n    [{DIPHTHONGS}]       -->  [{DIPHTHENGS}]  \\**  Replace diphthongs **\\\n    \n    \\** CONSONANT RULES (could be factorized with crossrules) **\\\n    \n    \\** ======================== **\\\n         \n    l               --> LAMBE\n    \\** If we look closely on the ring inscription, **\\\n    \\** we can see the offset for the tehta starting point **\\\n    \\** That\'s why we use the XL tehtas **\\\n    {V_D_KER}  l    --> LAMBE {V_D_IMG_XL}       \n    \\** when telco follows, ligature with telco **\\\n    l {V_D_KER}  _  --> LAMBE_LIG TELCO {V_D_IMG_XS}\n    \n    \\** ======================== **\\\n    \n    b                           --> UMBAR\n    {V_D_KER}   b              --> UMBAR {V_D_IMG_XL}\n    \\** Attached l to b **\\\n    l {V_D_KER}  b             --> LAMBE_LIG UMBAR {V_D_IMG_XL}\n    {V_D_KER}  l {V_D_KER}  b --> LAMBE_LIG {V_D_IMG_XL} UMBAR {V_D_IMG_XL}\n                                                    \n    d                           --> ANDO\n    {V_D_KER}   d              --> ANDO {V_D_IMG_XL}\n    \\** Attached l to d **\\\n    l {V_D_KER}  d             --> LAMBE_LIG ANDO {V_D_IMG_XL}\n    {V_D_KER}  l {V_D_KER}  d --> LAMBE_LIG {V_D_IMG_XL} ANDO {V_D_IMG_XL}\n                                          \n    f                           --> FORMEN \n    {V_D_KER}   f              --> FORMEN_EXT {V_D_IMG__S} \\** Beware. **\\ \n    \\** Attached l to f **\\\n    l {V_D_KER}  f             --> LAMBE_LIG FORMEN_EXT {V_D_IMG__S}\n    {V_D_KER}  l {V_D_KER}  f --> LAMBE_LIG {V_D_IMG_XL} FORMEN_EXT {V_D_IMG__S}\n                                           \n    g                           --> UNGWE\n    {V_D_KER}   g              --> UNGWE {V_D_IMG_XL}\n    \\** Attached l to g **\\\n    l {V_D_KER}  g             --> LAMBE_LIG UNGWE {V_D_IMG_XL}\n    {V_D_KER}  l {V_D_KER}  g --> LAMBE_LIG {V_D_IMG_XL} UNGWE {V_D_IMG_XL}\n     \n    gh                           --> UNGWE_EXT\n    {V_D_KER}   gh              --> UNGWE_EXT {V_D_IMG_XL}\n    \\** Attached l to g **\\\n    l {V_D_KER}  gh             --> LAMBE_LIG UNGWE_EXT {V_D_IMG_XL}\n    {V_D_KER}  l {V_D_KER}  gh --> LAMBE_LIG {V_D_IMG_XL} UNGWE_EXT {V_D_IMG_XL}\n    \n    h                           --> HYARMEN\n    {V_D_KER}   h              --> HYARMEN {V_D_IMG_XS}\n    \\** Attached l to g **\\\n    l {V_D_KER}  h             --> LAMBE_LIG HYARMEN {V_D_IMG_XS}\n    {V_D_KER}  l {V_D_KER}  h --> LAMBE_LIG {V_D_IMG_XL} HYARMEN {V_D_IMG_XS}\n          \n    {K}                          --> QUESSE\n    {V_D_KER}   {K}              --> QUESSE {V_D_IMG__L}\n    \\** Attached l to g **\\\n    l {V_D_KER}  {K}             --> LAMBE_LIG QUESSE {V_D_IMG__L}\n    {V_D_KER}  l {V_D_KER}  {K}  --> LAMBE_LIG {V_D_IMG_XL} QUESSE {V_D_IMG__L}\n          \n    {K}h                           --> HWESTA\n    {V_D_KER}   {K}h              --> HWESTA_EXT {V_D_IMG__L}\n    \\** Attached l to g **\\\n    l {V_D_KER}  {K}h             --> LAMBE_LIG HWESTA_EXT {V_D_IMG__L}\n    {V_D_KER}  l {V_D_KER}  {K}h --> LAMBE_LIG {V_D_IMG_XL} HWESTA_EXT {V_D_IMG__L}\n          \n    \n    m                               --> MALTA\n    {V_D_KER}  m                   --> MALTA {V_D_IMG_XL}\n    \n    mb                              --> UMBAR TILD_SUP_L\n    {V_D_KER}  mb                  --> UMBAR TILD_SUP_L {V_D_IMG_XL}\n    \n    mp                             --> PARMA TILD_SUP_S\n    {V_D_KER}  mp                  --> PARMA TILD_SUP_S {V_D_IMG__L}\n    \n    n                              --> NUMEN\n    {V_D_KER} n                    --> NUMEN {V_D_IMG_XL} \n    \n    n{K}                           --> QUESSE TILD_SUP_S\n    {V_D_KER} n{K}                 --> QUESSE TILD_SUP_S {V_D_IMG__S} \n    \n    p                               --> PARMA\n    \n    r                               --> ROMEN\n    {V_D_KER}  r                   --> ORE {V_D_IMG__L}\n    \\** Attached l to r **\\        \n    l {V_D_KER}  r                 --> LAMBE_LIG ORE {V_D_IMG__L}\n    {V_D_KER}  l {V_D_KER}  r     --> LAMBE_LIG {V_D_IMG_XL} ORE {V_D_IMG__L}\n    \n    \n    r                               --> ROMEN\n    r_                              --> ORE\n    {V_D_KER} r                    --> ORE {V_D_IMG__S}                                      \n    {V_D_KER} rb                   --> ORE {V_D_IMG__L} UMBAR                                  \n    {V_D_KER} rz                   --> ORE {V_D_IMG__L} ESSE\n    \n    s                               --> SILME\n    \n    \n    \\** Beware sh is not the same if not preceeded by vowel **\\\n    sh                              --> AHA\n    {A}sh                           --> AHA_EXT A_TEHTA_L           \n    {E}sh                           --> AHA_EXT E_TEHTA_L\n    {I}sh                           --> AHA_EXT I_TEHTA_L\n    {O}sh                           --> AHA_EXT U_TEHTA_S \n    {U}sh                           --> AHA_EXT O_TEHTA_XS \\** The best one still not satisfying... **\\\n    {AA}sh                          --> ESSE_NUQUERNA A_TEHTA_DOUBLE_L \n    {EE}sh                          --> ESSE_NUQUERNA E_TEHTA_DOUBLE_L\n    {II}sh                          --> ESSE_NUQUERNA Y_TEHTA_L\n    {OO}sh                          --> ESSE_NUQUERNA U_TEHTA_DOUBLE_S \n    {UU}sh                          --> ESSE_NUQUERNA O_TEHTA_DOUBLE_XS\n    \n    t                               --> TINCO\n    {V_D_KER} t                    --> TINCO {V_D_IMG__L}\n    \n    th                              --> SULE\n    y                               --> ANNA\n    \n    z                               --> ESSE\n    \n    \\** Need to break thisone too **\\\n    {A}z                            --> ESSE_NUQUERNA A_TEHTA_L \n    {E}z                            --> ESSE_NUQUERNA E_TEHTA_L\n    {I}z                            --> ESSE_NUQUERNA I_TEHTA_L\n    {O}z                            --> ESSE_NUQUERNA U_TEHTA_S \n    {U}z                            --> ESSE_NUQUERNA O_TEHTA_S\n    {AA}z                           --> ESSE_NUQUERNA A_TEHTA_DOUBLE_L \n    {EE}z                           --> ESSE_NUQUERNA E_TEHTA_DOUBLE_L\n    {II}z                           --> ESSE_NUQUERNA Y_TEHTA_L\n    {OO}z                           --> ESSE_NUQUERNA U_TEHTA_DOUBLE_S \n    {UU}z                           --> ESSE_NUQUERNA O_TEHTA_DOUBLE_S\n  \\end\n    \n  \\beg rules punctuation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n    \n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n\n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n\n    - --> {NULL}     \n    – --> PUNCT_TILD  \n    — --> PUNCT_TILD\n\n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R\n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n\n  \\end\n\n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11      \n  \\end\n\n\\end\n\n\n\n\n\n\n\n\n\n \n                        "