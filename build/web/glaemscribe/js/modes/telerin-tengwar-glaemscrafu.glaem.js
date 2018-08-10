Glaemscribe.resource_manager.raw_modes["telerin-tengwar-glaemscrafu"] = "\\**\n\nGlǽmscribe (also written Glaemscribe) is a software dedicated to\nthe transcription of texts between writing systems, and more \nspecifically dedicated to the transcription of J.R.R. Tolkien\'s \ninvented languages to some of his devised writing systems.\n\nCopyright (C) 2015 Benjamin Babut (Talagan).\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU Affero General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\nany later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU Affero General Public License for more details.\n\nYou should have received a copy of the GNU Affero General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n**\\\n\n\\** Telerin mode for glaemscribe (MAY BE INCOMPLETE) - Derived from Quenya **\\\n\n\\beg changelog\n  \\entry \"0.0.2\" \"Correcting ts/ps sequences to work better with eldamar\"\n  \\entry \"0.0.3\" \"Porting to virtual chars\"\n  \\entry \"0.0.4\" \"Added charset support for Annatar\"\n  \\entry \"0.0.5\" \"Added support for the FreeMonoTengwar font\" \n  \\entry \"0.0.6\" \"Ported some options from the quenya mode\"\n  \\entry \"0.1.0\" \"Added support for the Tengwar Elfica font\"\n  \\entry \"0.1.1\" \"Added support for inlined raw tengwar\"  \n  \\entry \"0.1.2\" \"Added support for non-breaking spaces\"   \n  \\entry \"0.1.3\" \"Correcting visibility options to conform to new glaeml args strict syntax\"  \n  \\entry \"0.1.4\" \"Added support for new unicode charsets\"   \n  \\entry \"0.1.5\" \"Added support for the Tengwar Telcontar font\"\n\\end\n\n\\language \"Telerin\"\n\\writing  \"Tengwar\"\n\\mode     \"Telerin Tengwar - G*\"\n\\version  \"0.1.5\"\n\\authors  \"Talagan (Benjamin Babut), based on J.R.R Tolkien\"\n\n\\world      arda\n\\invention  experimental\n\n\\charset  tengwar_ds_sindarin true\n\\charset  tengwar_ds_parmaite false\n\\charset  tengwar_ds_eldamar  false\n\\charset  tengwar_ds_annatar  false\n\\charset  tengwar_ds_elfica   false\n\n\\charset  tengwar_guni_sindarin false\n\\charset  tengwar_guni_parmaite false\n\\charset  tengwar_guni_eldamar  false\n\\charset  tengwar_guni_annatar  false\n\\charset  tengwar_guni_elfica   false\n\n\\charset  tengwar_freemono    false\n\\charset  tengwar_telcontar   false\n\n\\raw_mode \"raw-tengwar\"\n\n\\beg      options\n\n  \\beg option reverse_o_u_tehtar U_UP_O_DOWN\n    \\value O_UP_U_DOWN 1\n    \\value U_UP_O_DOWN 2\n  \\end\n\n  \\beg option long_vowels_format LONG_VOWELS_USE_LONG_CARRIER\n    \\value LONG_VOWELS_USE_LONG_CARRIER 1\n    \\value LONG_VOWELS_USE_DOUBLE_TEHTAR 2\n  \\end  \n\n  \\beg option double_tehta_e false\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_i false\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_o true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \\beg option double_tehta_u true\n    \\visible_when \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n  \\end\n  \n  \\beg option consonant_modification_style CONSONANT_MODIFICATION_STYLE_BAR\n    \\value CONSONANT_MODIFICATION_STYLE_WAVE 0\n    \\value CONSONANT_MODIFICATION_STYLE_BAR 1\n  \\end\n\n  \\option reverse_numbers true\n  \\beg option numbers_base BASE_12\n    \\value    BASE_10 10\n    \\value    BASE_12 12\n  \\end\n\\end\n\n\\beg      preprocessor\n  \\** Work exclusively downcase **\\\n  \\downcase\n  \n  \\** Simplify trema vowels **\\\n  \\substitute ä a\n  \\substitute ë e\n  \\substitute ï i\n  \\substitute ö o\n  \\substitute ü u\n  \\substitute ÿ y\n  \n  \\** Dis-ambiguate long vowels **\\\n  \\rxsubstitute \"(ā|â|aa)\" \"á\"\n  \\rxsubstitute \"(ē|ê|ee)\" \"é\" \n  \\rxsubstitute \"(ī|î|ii)\" \"í\"\n  \\rxsubstitute \"(ō|ô|oo)\" \"ó\"\n  \\rxsubstitute \"(ū|û|uu)\" \"ú\"\n  \\rxsubstitute \"(ȳ|ŷ|yy)\" \"ý\"\n\n  \\substitute   \"qu\" \"q\" \\** Dis-ambiguate qu **\\\n  \n  \\elvish_numbers \"\\\\eval numbers_base\" \"\\\\eval reverse_numbers\"\n\\end\n  \n\\beg processor\n\n  \\beg rules litteral\n                       \n    {K}                 === (c,k)\n    {W}                 === (v,w)\n    {SS}                === (z,ss)\n    \n    \\if \"consonant_modification_style == CONSONANT_MODIFICATION_STYLE_WAVE\"\n      {GEMINATE} === GEMINATE_SIGN_TILD\n    \\else\n      {GEMINATE} === GEMINATE_SIGN\n    \\endif\n    \n    {VOWELS}            === a               *  e              * i              * o              *  u\n    {LVOWELS}           === á               *  é              * í              * ó              *  ú\n\n    \\if \"reverse_o_u_tehtar == U_UP_O_DOWN\"\n      {O_LOOP}        === O_TEHTA\n      {O_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n      {U_LOOP}        === U_TEHTA\n      {U_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n    \\else\n      {O_LOOP}        === U_TEHTA\n      {O_LOOP_DOUBLE} === U_TEHTA_DOUBLE\n      {U_LOOP}        === O_TEHTA\n      {U_LOOP_DOUBLE} === O_TEHTA_DOUBLE\n    \\endif\n\n    \\** Shape of the a, option removed from quenya, may be readded later **\\\n    {A_SHAPE}         === A_TEHTA\n\n    \\** Implicit a, option removed from quenya, may be readded later **\\\n    {_A_}              === {A_SHAPE}\n    {_NVOWEL_}         === {NULL}\n  \n    {_TEHTAR_}          === {_A_}      *  E_TEHTA     *  I_TEHTA    * {O_LOOP}    *  {U_LOOP}\n\n    \\** Split diphtongs option removed from quenya, may be readded later **\\\n    {DIPHTHONGS}      === ai            * au            * eu            * iu             * oi               * ui\n    {_DIPHTHONGS_}    === YANTA {_A_}   * URE {_A_}     * URE E_TEHTA   * URE I_TEHTA    * YANTA {O_LOOP}   * YANTA {U_LOOP}\n    {WDIPHTHONGS}     === * {DIPHTHONGS}   \\** groovy! **\\\n    {_WDIPHTHONGS_}   === * {_DIPHTHONGS_} \\** same thing **\\\n    \n		{_LONG_A_}      === ARA {A_SHAPE}\n		{_LONG_E_}      === ARA E_TEHTA	\n		{_LONG_I_}      === ARA I_TEHTA\n		{_LONG_O_}      === ARA {O_LOOP}	\n		{_LONG_U_}      === ARA {U_LOOP}\n		{_LONE_LONG_A_} === {_LONG_A_}\n		{_LONE_LONG_E_} === {_LONG_E_}\n		{_LONE_LONG_I_} === {_LONG_I_}\n		{_LONE_LONG_O_} === {_LONG_O_}\n		{_LONE_LONG_U_} === {_LONG_U_}\n    \n    {LTEHTAR}       === {NULL}\n    {_LTEHTAR_}     === {NULL} 				\n 		\n		\\if \"long_vowels_format == LONG_VOWELS_USE_DOUBLE_TEHTAR\"\n	    \\if double_tehta_e\n		    {_LONG_E_}       === E_TEHTA_DOUBLE\n		    {_LONE_LONG_E_}  === TELCO {_LONG_E_}\n        {LTEHTAR}        === {LTEHTAR}   * é\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_E_}\n			\\endif\n		  \\if double_tehta_i\n		    {_LONG_I_}       === I_TEHTA_DOUBLE\n		    {_LONE_LONG_I_}  === TELCO {_LONG_I_}\n        {LTEHTAR}        === {LTEHTAR}   * í\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_I_}\n		  \\endif\n		  \\if double_tehta_o\n		    {_LONG_O_}       === {O_LOOP_DOUBLE}\n		    {_LONE_LONG_O_}  === TELCO {_LONG_O_}\n        {LTEHTAR}        === {LTEHTAR}   * ó\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_O_}\n		  \\endif\n		  \\if double_tehta_u\n		    {_LONG_U_}       === {U_LOOP_DOUBLE}\n		    {_LONE_LONG_U_}  === TELCO {_LONG_U_}\n        {LTEHTAR}        === {LTEHTAR}   * ú\n        {_LTEHTAR_}      === {_LTEHTAR_} * {_LONG_U_}\n		  \\endif\n    \\endif  \n       		\n    \\** images of long vowels, either tehtar or ara versions **\\\n    {_LVOWELS_}     === {_LONG_A_} * {_LONG_E_} * {_LONG_I_} * {_LONG_O_} * {_LONG_U_}      \n\n		{WLONG}         === * {LVOWELS} \n		{_WLONG_}       === * {_LVOWELS_}\n\n    {V_D}           === [ {VOWELS} {WLONG} {WDIPHTHONGS} ]\n    {V_D_WN}        === [ {VOWELS} {WLONG} {WDIPHTHONGS} * {NULL} ]\n\n    {_V_D_}         === [ {_TEHTAR_} {_WLONG_} {_WDIPHTHONGS_} ]\n    {_V_D_WN_}      === [ {_TEHTAR_} {_WLONG_} {_WDIPHTHONGS_} * {_NVOWEL_} ]\n		\n		\\** LONE SHORT VOWELS **\\\n    [{VOWELS}]    --> TELCO [{_TEHTAR_}]  \\** Replace isolated short vowels **\\\n    \n		\\** LONE LONG VOWELS **\\	\n		[{LVOWELS}]   --> [{_LONE_LONG_A_} * {_LONE_LONG_E_} * {_LONE_LONG_I_} * {_LONE_LONG_O_} * {_LONE_LONG_U_}]\n\n    [{DIPHTHONGS}]    -->   [{_DIPHTHONGS_}]     \\**  Replace diphthongs **\\\n    \n  \n    \\** TELERIN: changed v/w, removed all y rules **\\\n    \n    \\** ===================== **\\\n    \\** 1ST LINE RULES **\\\n    \\** ===================== **\\\n    {L1}          === {K}   * q      * t       * p \n    {_L1_}        === CALMA * QUESSE * TINCO   * PARMA\n    \n    {L1_GEMS}     === {K}{K}              * tt                     * pp\n    {_L1_GEMS_}   === CALMA {GEMINATE} * TINCO {GEMINATE}    * PARMA {GEMINATE}\n\n    \\** NORMAL **\\\n    [ {L1} ] {V_D_WN}         --> [ {_L1_} ] {_V_D_WN_}\n    [ {L1_GEMS} ] {V_D_WN}    --> [ {_L1_GEMS_} ] {_V_D_WN_}\n                            \n    ts{V_D_WN}          --> TINCO SARINCE {_V_D_WN_} \n    ps{V_D_WN}          --> PARMA SARINCE {_V_D_WN_}\n    {K}s{V_D_WN}        --> CALMA SARINCE {_V_D_WN_}   \n    x{V_D_WN}           --> CALMA SARINCE {_V_D_WN_}   \\** render ks for x **\\\n                            \n    \\** ===================== **\\\n    \\** 2ND LINE RULES **\\\n    \\** ===================== **\\\n    {L2}        === nd      * mb        * ng      *  ngw    * d      * b        * g\n    {_L2_}      === ANDO    * UMBAR     * ANGA    *  UNGWE  * ORE    * VALA     * ANNA\n    \n    \\** STANDARD **\\\n    [{L2}]{V_D_WN}  --> [{_L2_}]{_V_D_WN_}\n\n    \\** ===================== **\\\n    \\** 3RD LINE RULES **\\\n    \\** ===================== **\\\n    {L3}    === th     * f      * h      * hw\n    {_L3_}  === SULE   * FORMEN * AHA    * HWESTA\n\n    \\** NORMAL **\\\n    [{L3}]{V_D_WN}  --> [{_L3_}]{_V_D_WN_}\n      \n    \\** Override h with vowels (descendent) **\\\n    _h{V_D}         --> HYARMEN {_V_D_}\n    \\** Starting voiced h before long vowels **\\\n    _h[{LVOWELS}]   --> HYARMEN [{_LVOWELS_}]\n\n    (h,χ)           --> AHA\n\n    \\** ===================== **\\\n    \\** 4TH LINE RULES **\\\n    \\** ===================== **\\\n    {L4}    === nt    * mp    * nc    * nq      \\** Not nqu, due to preprocessor **\\\n    {_L4_}  === ANTO  * AMPA  * ANCA  * UNQUE\n \n    \\** NORMAL **\\\n    [{L4}]{V_D_WN}    --> [{_L4_}]{_V_D_WN_}\n\n    \\** ===================== **\\\n    \\** 5TH LINE RULES **\\\n    \\** ===================== **\\\n    {L5}    === n     * m     * ñ     * ñw      * _nw \n    {_L5_}  === NUMEN * MALTA * NOLDO * NWALME  * NWALME\n\n    [{L5}]{V_D_WN}  --> [{_L5_}]{_V_D_WN_}\n\n    nn{V_D_WN}          --> NUMEN {GEMINATE} {_V_D_WN_}\n    mm{V_D_WN}          --> MALTA {GEMINATE} {_V_D_WN_}\n\n    \\** ===================== **\\\n    \\** 6TH LINE RULES **\\\n    \\** ===================== **\\\n    {L6}        === r     * {W}  \n    {_L6_}      === ROMEN * VILYA \n\n    [{L6}]{V_D_WN} --> [{_L6_}]{_V_D_WN_}\n\n    rr{V_D_WN}        --> ROMEN {GEMINATE} {_V_D_WN_}\n    rd{V_D_WN}        --> ARDA {_V_D_WN_}\n\n    \\** ===================== **\\\n    \\** L   LINE RULES **\\\n    \\** ===================== **\\\n    {LINE_L}          === l     * ld      * ll\n    {_LINE_L_}        === LAMBE * ALDA    * LAMBE {GEMINATE}\n\n    [{LINE_L}]{V_D_WN}    --> [{_LINE_L_}]{_V_D_WN_}\n\n    hl{V_D_WN}            --> HALLA LAMBE {_V_D_WN_}\n    hr{V_D_WN}            --> HALLA ROMEN {_V_D_WN_}\n    \n    \\** ===================== **\\\n    \\** S/Z LINE RULES **\\\n    \\** ===================== **\\\n    {L8}              === s               * {SS}\n    {_L8_TEHTAR_}     === SILME_NUQUERNA  * ESSE_NUQUERNA\n    {_L8_NO_TEHTAR_}  === SILME           * ESSE\n\n    [{L8}][{VOWELS}]   --> [{_L8_TEHTAR_}][{_TEHTAR_}]\n    [{L8}][{LTEHTAR}]  --> [{_L8_TEHTAR_}][{_LTEHTAR_}]\n    \n    {L8}               --> {_L8_NO_TEHTAR_}\n    {L8}[{DIPHTHONGS}] --> {_L8_NO_TEHTAR_}[{_DIPHTHONGS_}]\n  \\end\n  \n  \\beg rules punctuation\n    . --> PUNCT_DDOT\n    .. --> PUNCT_DOT PUNCT_DDOT PUNCT_DOT\n    …  --> PUNCT_TILD\n    ... --> PUNCT_TILD\n    .... --> PUNCT_TILD\n    ..... --> PUNCT_TILD\n    ...... --> PUNCT_TILD\n    ....... --> PUNCT_TILD\n\n    , --> PUNCT_DOT\n    : --> PUNCT_DOT\n    ; --> PUNCT_DOT\n    ! --> PUNCT_EXCLAM\n    ? --> PUNCT_INTERR\n    · --> PUNCT_DOT\n\n    \\** Apostrophe **\\\n\n    \' --> {NULL}\n    ’ --> {NULL}\n    \n    \\** NBSP **\\\n    {NBSP} --> NBSP\n    \n    \\** Quotes **\\\n\n    “ --> DQUOT_OPEN\n    ” --> DQUOT_CLOSE\n    « --> DQUOT_OPEN \n    » --> DQUOT_CLOSE \n    \n    - --> {NULL}\n    – --> PUNCT_TILD  \n    — --> PUNCT_TILD\n\n    [ --> PUNCT_PAREN_L\n    ] --> PUNCT_PAREN_R\n    ( --> PUNCT_PAREN_L\n    ) --> PUNCT_PAREN_R\n    { --> PUNCT_PAREN_L\n    } --> PUNCT_PAREN_R\n    < --> PUNCT_PAREN_L\n    > --> PUNCT_PAREN_R  \n\n    \\** Not universal between fonts ... **\\\n    $ --> BOOKMARK_SIGN\n    ≤ --> RING_MARK_L \\** Ring inscription left beautiful stuff **\\\n    ≥ --> RING_MARK_R \\** Ring inscription right beautiful stuff **\\\n \n  \\end\n  \n  \\beg rules numbers\n    0 --> NUM_0\n    1 --> NUM_1\n    2 --> NUM_2\n    3 --> NUM_3\n    4 --> NUM_4\n    5 --> NUM_5\n    6 --> NUM_6\n    7 --> NUM_7\n    8 --> NUM_8\n    9 --> NUM_9\n    A --> NUM_10\n    B --> NUM_11      \n  \\end\n\\end\n\n\\beg postprocessor\n  \\resolve_virtuals\n\\end  \n"