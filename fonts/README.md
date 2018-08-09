# Repository of (patched) fonts used by Glǽmscribe

This is the place where are stored and tracked the fonts that have been patched specifically for **_Glǽmscribe_** . Due to the precision needed by some modes (and users!), due to the fact that a large number of them were designed at a time where the technologies were not as powerful as today, and for a lot of other reasons, not all fonts (especially Tengwar fonts) could bring the level of detail needed for pointy transcriptions. Moreover, since there had been no real strict norm to describe how they should be designed, these fonts are not always compliant one with each other.

That's why, at some point, they needed some patching ; here are these fonts, with a backlog of the modifications brought to them.

**All these fonts are the propriety of their authors. Tengwar, Sarati and Cirth are writing systems invented and designed by J.R.R. Tolkien.**

**A note on unicode** : Since Glaemscribe 1.2.0, legacy fonts with a Dan Smith layout have been deprecated. They can still be found in the build/\_legacy directory (with the \*-glaemscrafu suffix) and their charsets are still available as tengwar\_ds\_\*.cst files, these fonts had already been patched to solve some problems and add missing chars. 

Since 1.2.0, they have been renamed (with the \*-glaemunicode suffix) and remapped to unicode to be closer to the norm proposed by the Free Tengwar font project (emending itself the original proposition from Michael Everson). The main reason is a transitional one ; every new font should try to tend towards the unicode norm, cleaner, more robust. Having each character at the right place is certainly the best way to go if one wants these writings to be processable by the modern tools without problems.

So the aim was, at first, to have a first *port* of these legacy fonts. Still, part of their mechanisms are still legacy (they still contain the multiple versions of tehtar, for example) because the OpenType features to have correct diacritic placement, ligatures, stacking and so on are difficult and long to implement and to design. Thus, all these legacy variants have been mapped in far blocks of the Private Use Area of the Unicode. That chosen *hacky* and *transitional* mapping can be consulted here :

[TODO]

See also the [**comparison chart for tengwar fonts**](http://htmlpreview.github.io/?https://github.com/BenTalagan/glaemscribe/blob/master/fonts/doc/glaemscribe_tengwar_fonts.html) for an overview of all features and changes.

The complete of list of changes made from the original versions of the fonts :

**Tengwar Eldamar**, created and designed by **Måns Björkman**
--------------------------------------------------------------
 
* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* The vast majority of tengwar have been remapped to the FTF/Everson unicode points.
* Double tehtar for long _e_ have been added.
* Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara.
* Moved pustar combinations (4/4-squared/5).
* Added 4-halfed pustar combination.
* Added missing non-breaking space (U+00A0)

**Tengwar Parmaite**, created and designed by **Måns Björkman**
--------------------------------------------------------------

* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* The vast majority of tengwar have been remapped to the FTF/Everson unicode points.
* Double tehtar for long _e, o and u_ have been added.
* Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara.
* Added pustar combinations (4/4-halfed/4-squared/5)

**Tengwar Elfica**, created and designed by **Enrique Mombello**
--------------------------------------------------------------

* The vast majority of tengwar have been remapped to the FTF/Everson unicode points.
* Added pustar combinations (4-halfed @U+10FB / 4-squared @U+2E2C)
* A serie of 4 inferior tehtar has been added for the reversed, small, u-curl.
* Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara.

**Tengwar Annatar**, created and designed by **Johan Winge**
--------------------------------------------------------------

* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* The vast majority of tengwar have been remapped to the FTF/Everson unicode points.
* The circle inf tehta for Regular and Bold (XS version @ 0xA9) has been translated, it was too high.
* Added pustar combinations (4/4-halfed/4-squared/5)
* Added dash+wave / inf+sup (XS version @U+200,201,202,203 for consonant modifications for telco/halla/ara.
* Added missing non-breaking space (U+00A0)

**Tengwar Annatar Bold**, created and designed by **Johan Winge**
--------------------------------------------------------------

* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* The vast majority of tengwar have been remapped to the FTF/Everson unicode points.
* The circle inf tehta for Regular and Bold (XS version @ 0xA9) as been translated, it was too high.
* Added pustar combinations (4/4-halfed/4-squared/5)
* Added missing non-breaking space (U+00A0)

**Tengwar Annatar Italic**, created and designed by **Johan Winge**
--------------------------------------------------------------

* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* The vast majority of tengwar have been remapped to the FTF/Everson unicode points.
* Added pustar combinations (4/4-halfed/4-squared/5)
* Added missing non-breaking space (U+00A0)

**Tengwar Sindarin**, created and designed by **Dan Smith**
--------------------------------------------------------------

* The vast majority of tengwar have been remapped to the FTF/Everson unicode points.
* Added MH (@ 0x161).
* Added Beleriandic MH (@ 0x180).
* Added double tehtar for long _e, o and u_ have been added.
* Added _e grave tehtar_ . 
* Added pustar combinations (4/4-halfed/4-squared/5)
* Added num_12
* A serie of 4 inferior tehtar has been added for the reversed, small, u-curl.
  
**Sarati Eldamar**, created and designed by **Måns Björkman**
--------------------------------------------------------------

* GPOS OpenType tables and anchors have been added to manage diacritics.
* The spacing between characters has been slightly increased because it looked a bit small.


