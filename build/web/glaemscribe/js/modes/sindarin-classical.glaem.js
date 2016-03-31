Glaemscribe.resource_manager.raw_modes["sindarin-classical"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Sindarin Classical mode for glaemscribe (MAY BE INCOMPLETE) **\\\n\n\\** Changelog **\\\n\\** \n\n0.0.2 : Fixed some tehtar versions which did not look quite nice for ch, dh, v, mb\n        Reworked the problem of labialized consonnants (+w), adding an option for treating the u-curl + tehta combination.\n\n**\\\n\n\n\\language \"Sindarin\"\n\\writing  \"Tengwar\"\n\\mode     \"Classical\"\n\\version  \"0.0.2\"\n\\authors  \"Talagan (Benjamin Babut)\"\n\n\\charset  tengwar_ds true\n\n\\beg      options\n  \\option reverse_numbers true\n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n    \\option labialized_consonants_accept_tehtar true\n\\end\n\n\\beg preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n\n  \\** We should do better for that one (todo) **\\\n  \\substitute œ e\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\"\n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n  \n  \\** Special case of starting \'i\' before vowels, replace i by j **\\     \n  \\rxsubstitute \"\\\\bi([aeouyáāâéēêíīîóōôúūûýȳŷ])\" \"j\\\\1\"\n  \n  \\** Preprocess numbers **\\\n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n \n\\beg processor\n\n  \\beg rules litteral\n    \n    \\** VOWELS **\\\n    {A}   === a\n    {AA}  === á\n    {E}   === e\n    {EE}  === é\n    {I}   === i\n    {II}  === í\n    {O}   === o\n    {OO}  === ó\n    {U}   === u\n    {UU}  === ú\n    {Y}   === y\n    {YY}  === ý\n\n    {AE}  === {A}{E}\n    {AI}  === {A}{I}\n    {AU}  === {A}{U}\n    {AW}  === {A}w\n    {EI}  === {E}{I}\n    {OE}  === {O}{E}\n    {UI}  === {U}{I}\n\n    \\** CONSONANTS **\\\n    {K}         === (c,k)\n\n    {VOWELS}    === {A}             * {E}             * {I}           * {O}         * {U}         * {Y} \n    {LVOWELS}   === {AA}            * {EE}            * {II}          * {OO}        * {UU}        * {YY}   \n\n    \n    {TEHTA_XS}    === A_TEHTA_XS      * E_TEHTA_XS      * I_TEHTA_XS    * O_TEHTA_XS  * U_TEHTA_XS  * Y_TEHTA_XS \n    {TEHTA__S}    === A_TEHTA_S       * E_TEHTA_S       * I_TEHTA_S     * O_TEHTA_S   * U_TEHTA_S   * Y_TEHTA_S\n    {TEHTA__L}    === A_TEHTA_L       * E_TEHTA_L       * I_TEHTA_L     * O_TEHTA_L   * U_TEHTA_L   * Y_TEHTA_L\n    {TEHTA_XL}    === A_TEHTA_XL      * E_TEHTA_XL      * I_TEHTA_XL    * O_TEHTA_XL  * U_TEHTA_XL  * Y_TEHTA_XL\n\n    {LVOWELS_IMG} === ARA A_TEHTA_XS  * ARA E_TEHTA_XS  * ARA I_TEHTA_XS * ARA O_TEHTA_XS * ARA U_TEHTA_XS * ARA Y_TEHTA_XS \n\n    {DIPHTHONGS}   === {AI}            * {AU}             * {AW}              * {EI}              * {UI}           * {AE}            * {OE}                \n    {DIPHTHENGS}   === ANNA A_TEHTA_L  * VALA A_TEHTA_S   * VALA A_TEHTA_S    * ANNA E_TEHTA_S    * ANNA U_TEHTA_L * YANTA A_TEHTA_S * YANTA O_TEHTA_S     \n\n    \\** Consonants + Vowels, we will often need these ones **\\\n    {V_D_KER}           === [ {VOWELS} ]\n    {V_D_KER_WN}        === [ {VOWELS} * {NULL} ]\n\n    {V_D_IMG_XS}        === [ {TEHTA_XS} ]\n    {V_D_IMG__S}        === [ {TEHTA__L} ]\n    {V_D_IMG__L}        === [ {TEHTA__S} ]\n    {V_D_IMG_XL}        === [ {TEHTA_XL} ]\n    {V_D_IMG_XS_WN}     === [ {TEHTA_XS} * {NULL} ]\n    {V_D_IMG__S_WN}     === [ {TEHTA__L} * {NULL} ]\n    {V_D_IMG__L_WN}     === [ {TEHTA__S} * {NULL} ]\n    {V_D_IMG_XL_WN}     === [ {TEHTA_XL} * {NULL} ]\n\n    \\** Vowel rules **\\  \n    [{VOWELS}]    -->   TELCO [{TEHTA_XS}]  \\** Replace isolated short vowels **\\\n    [{LVOWELS}]   -->   [{LVOWELS_IMG}]   \\** Replace long vowels **\\\n    [{DIPHTHONGS}]  -->   [{DIPHTHENGS}]    \\** Replace diphthongs **\\\n   \n    \\** 1ST LINE **\\\n    {LINE_1ST_KER_1}        === t     * p \n    {LINE_1ST_IMG_1}        === TINCO * PARMA\n    {LINE_1ST_KER_2}        === {K}\n    {LINE_1ST_IMG_2}        === QUESSE\n\n    {V_D_KER_WN}[{LINE_1ST_KER_1}]            --> 2,1 --> [{LINE_1ST_IMG_1}]{V_D_IMG__S_WN}\n    {V_D_KER_WN}[{LINE_1ST_KER_2}]            --> 2,1 --> [{LINE_1ST_IMG_2}]{V_D_IMG__S_WN}\n\n    {V_D_KER_WN}nt   --> TINCO DASH_SUP_S {V_D_IMG__S_WN}\n    {V_D_KER_WN}mp   --> PARMA DASH_SUP_S {V_D_IMG__S_WN}\n    {V_D_KER_WN}n{K} --> CALMA DASH_SUP_S {V_D_IMG__S_WN}\n\n    \\** 2ND LINE **\\\n    {LINE_2ND_KER}        === d     * b     * g     * ng                    \\** * g **\\\n    {LINE_2ND_IMG}        === ANDO  * UMBAR * UNGWE * UNGWE DASH_SUP_L      \\** * s **\\\n\n    {V_D_KER_WN}[{LINE_2ND_KER}] --> 2,1 --> [{LINE_2ND_IMG}]{V_D_IMG_XL_WN}\n\n    {V_D_KER_WN}mb   --> UMBAR  DASH_SUP_L {V_D_IMG_XL_WN}\n    {V_D_KER_WN}nd   --> ANDO   DASH_SUP_L {V_D_IMG_XL_WN}\n\n    \\** 3RD LINE **\\\n    {LINE_3RD_KER_1} === th     * (f,ph,ff)\n    {LINE_3RD_IMG_1} === SULE   * FORMEN\n    {LINE_3RD_KER_2} === ch \n    {LINE_3RD_IMG_2} === HWESTA\n\n    {V_D_KER_WN}[{LINE_3RD_KER_1}] --> 2,1 --> [{LINE_3RD_IMG_1}]{V_D_IMG__S_WN} \n    {V_D_KER_WN}[{LINE_3RD_KER_2}] --> 2,1 --> [{LINE_3RD_IMG_2}]{V_D_IMG_XL_WN} \\** Tengscribe uses _S **\\\n\n    {V_D_KER_WN}nth   --> SULE   DASH_SUP_S {V_D_IMG__S_WN}\n    {V_D_KER_WN}mph   --> FORMEN DASH_SUP_S {V_D_IMG__S_WN}\n    {V_D_KER_WN}nf    --> FORMEN DASH_SUP_S {V_D_IMG_XL_WN}\n    {V_D_KER_WN}nch   --> HWESTA DASH_SUP_S {V_D_IMG__S_WN}\n\n    \\** 4TH LINE **\\\n    {LINE_4TH_KER}        === (ð,ðh,dh)   * (v,bh,f_) \\** Some noldorin variants here ... **\\\n    {LINE_4TH_IMG}        === ANTO        * AMPA \n\n    {V_D_KER_WN}[{LINE_4TH_KER}] --> 2,1 --> [{LINE_4TH_IMG}]{V_D_IMG_XL_WN}\n\n    \\** 5TH LINE **\\\n    {LINE_5TH_KER}        === n * m * _ng * _mh\n    {LINE_5TH_IMG}        === NUMEN * MALTA * NWALME * MALTA_W_HOOK \n\n    {V_D_KER_WN}[{LINE_5TH_KER}] --> 2,1 --> [{LINE_5TH_IMG}]{V_D_IMG_XL_WN}\n\n    {V_D_KER_WN}nn        --> NUMEN DASH_SUP_L {V_D_IMG_XL_WN}\n    {V_D_KER_WN}mm        --> MALTA DASH_SUP_L {V_D_IMG_XL_WN}\n\n    \\** 6TH LINE **\\\n\n    \\** 7TH LINE **\\\n    {LINE_L_KER_1}        === r_    * r     \n    {LINE_L_IMG_1}        === ORE   * ROMEN\n    {LINE_L_KER_2}        === l     * ll * w\n    {LINE_L_IMG_2}        === LAMBE * LAMBE LAMBE_MARK_TILD * VALA\n        \n    {V_D_KER_WN}[{LINE_L_KER_1}] --> 2,1 --> [{LINE_L_IMG_1}]{V_D_IMG__S_WN}\n    {V_D_KER_WN}[{LINE_L_KER_2}] --> 2,1 --> [{LINE_L_IMG_2}]{V_D_IMG__S_WN} \\** Best compromise between sindarin/eldamar, but not really satisfactory **\\\n    \n    _rh --> ARDA\n    _lh --> ALDA\n\n    \\** S/Z LINE **\\\n    {LINE_8TH_KER}        === s * y * ss\n    {LINE_8TH_IMG}        === SILME_NUQUERNA * SILME_NUQUERNA_ALT * ESSE_NUQUERNA \n\n    {V_D_KER_WN}[{LINE_8TH_KER}] --> 2,1 --> [{LINE_8TH_IMG}]{V_D_IMG__S_WN}\n\n    {V_D_KER_WN}ns        --> SILME_NUQUERNA DASH_SUP_S {V_D_IMG__S_WN}\n\n    s --> SILME\n\n    \\** OTHERS **\\\n    j --> YANTA\n\n    {V_D_KER_WN}h    --> HYARMEN {V_D_IMG__S_WN}\n    {V_D_KER_WN}hw   --> HWESTA_SINDARINWA {V_D_IMG__S_WN}\n\n    \\** \n        Ok here come the labialized consonants which are really tricky\n        The fonts generally do not handle well the u curl + tehtar, this should be one more argument for\n        adopting open type anchors with which we can stack diacritics (see the sarati modes).\n        For here, we cheat. Either we don\'t have any tehta on the tengwa, and it\'s easy.\n        Or, we put the two signs in their small versions, side by side.\n        We give an option not to use that trick, if the option is not set, we simply do not use\n        the u-curl at all when there\'s a tehta on the tengwa.\n    **\\\n    \n    gw   --> UNGWE THSUP_SEV_XL  \n    dw   --> ANDO  THSUP_SEV_XS  \n    nw   --> ORE   THSUP_SEV_L   \n    rw   --> ROMEN THSUP_SEV_L   \n        \n    \\if \"labialized_consonants_accept_tehtar\"\n      {V_D_KER}gw   --> UNGWE THSUP_SEV_XS  {V_D_IMG_XL}\n      {V_D_KER}dw   --> ANDO  THSUP_SEV_XS  {V_D_IMG_XL}\n      {V_D_KER}nw   --> ORE   THSUP_SEV_XS  {V_D_IMG_XL}\n      {V_D_KER}rw   --> ROMEN THSUP_SEV_XS  {V_D_IMG_XL}\n    \\endif\n  \\end\n  \n  \\beg rules punctuation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    ... --> PUNCT_TILD\n    …   --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n    \n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> {NULL}\n\n    - --> {NULL} \n    – --> PUNCT_TILD  \n    — --> PUNCT_TILD\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n\n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n\n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R\n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n  \\end\n\n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11      \n  \\end\n\\end\n"