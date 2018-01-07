# Repository of (patched) fonts used by Glǽmscribe

This is the place where are stored and tracked the fonts that have been patched specifically for **_Glǽmscribe_** . Due to the precision needed by some modes (and users!), due to the fact that a large number of them were designed at a time where the technologies were not as powerful as today, and for a lot of other reasons, not all fonts (especially Tengwar fonts) could bring the level of detail needed for pointy transcriptions. Moreover, since there had been no real strict norm to describe how they should be designed, these fonts are not always compliant one with each other.

That's why, at some point, they needed some patching ; here are these fonts, with a backlog of the modifications brought to them.

**All these fonts are the propriety of their authors. Tengwar, Sarati and Cirth are writing systems invented and designed by J.R.R. Tolkien.**

See also the [**comparison chart for tengwar fonts**](http://htmlpreview.github.io/?https://github.com/BenTalagan/glaemscribe/blob/master/fonts/doc/glaemscribe_tengwar_fonts.html) for an overview of all features and changes.


**Tengwar Eldamar**, created and designed by **Måns Björkman**
--------------------------------------------------------------
 
* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* ~~The alternate font has been shifted and added at position 0x3000 of the regular font.~~
* Alternate font chars have been merged and aligned on the Tengwar Elfica layout.
* Double tehtar for long _e_ have been added, and _e grave tehtar_ have been moved.
* The _a_ theta at U+00AD (soft hyphen) has been moved to U+0109 (for browser compatibility issues).
* The _vaia_ tengwa has been moved to U+0125 (for browser compatibility issues).
* Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara.
* Moved pustar combinations (4/4-squared/5).
* Added 4-halfed pustar combination.
* Added missing non-breaking space (U+00A0)

**Tengwar Parmaite**, created and designed by **Måns Björkman**
--------------------------------------------------------------

* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* ~~The alternate font has been shifted and added at position 0x3000 of the regular font.~~
* Alternate font chars have been merged and aligned on the Tengwar Elfica layout.
* Double tehtar for long _e, o and u_ have been added.
* The _a_ theta at U+00AD (soft hyphen) has been moved to U+0109 (for browser compatibility issues).
* The _vaia_ tengwa has been moved to U+0125 (for browser compatibility issues).
* Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara.
* Added pustar combinations (4/4-halfed/4-squared/5)

**Tengwar Elfica**, created and designed by **Enrique Mombello**
--------------------------------------------------------------

* Added pustar combinations (4-halfed @U+10FB / 4-squared @U+2E2C)
* A serie of 4 inferior tehtar has been added for the reversed, small, u-curl.
* Superior and inferior dash and tild consonant modification signs have been added for halla, telco and ara.
* Double stroke inferior tehtar versions have been moved for compatibility reasons.

**Tengwar Annatar**, created and designed by **Johan Winge**
--------------------------------------------------------------

* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* ~~The alternate font has been shifted and added at position 0x3000 of the regular font.~~
* Alternate font chars have been merged and aligned on the Tengwar Elfica layout.
* The _a_ theta at U+00AD (soft hyphen) has been moved to U+0109 (for browser compatibility issues).
* The _vaia_ tengwa has been moved to U+0125 (for browser compatibility issues).
* The circle inf tehta for Regular and Bold (XS version @ 0xA9) as been translated, it was too high.
* Added pustar combinations (4/4-halfed/4-squared/5)
* Added dash+wave / inf+sup (XS version @U+200,201,202,203 for consonant modifications for telco/halla/ara.
* Added missing non-breaking space (U+00A0)

**Tengwar Annatar Bold**, created and designed by **Johan Winge**
--------------------------------------------------------------

* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* ~~The alternate font has been shifted and added at position 0x3000 of the regular font.~~
* Alternate font chars have been merged and aligned on the Tengwar Elfica layout.
* The _a_ theta at U+00AD (soft hyphen) has been moved to U+0109 (for browser compatibility issues).
* The _vaia_ tengwa has been moved to U+0125 (for browser compatibility issues).
* The circle inf tehta for Regular and Bold (XS version @ 0xA9) as been translated, it was too high.
* Added pustar combinations (4/4-halfed/4-squared/5)
* Added missing non-breaking space (U+00A0)

**Tengwar Annatar Italic**, created and designed by **Johan Winge**
--------------------------------------------------------------

* The regular and alternate fonts have been merged into a single file so as to simplify its use as a WebFont.
* ~~The alternate font has been shifted and added at position 0x3000 of the regular font.~~
* Alternate font chars have been merged and aligned on the Tengwar Elfica layout.
* The _a_ theta at U+00AD (soft hyphen) has been moved to U+0109 (for browser compatibility issues).
* The _vaia_ tengwa has been moved to U+0125 (for browser compatibility issues).
* Added pustar combinations (4/4-halfed/4-squared/5)
* Added missing non-breaking space (U+00A0)

**Tengwar Sindarin**, created and designed by **Dan Smith**
--------------------------------------------------------------

* Added MH (@ 0x161).
* Added Beleriandic MH (@ 0x180).
* Added double tehtar for long _e, o and u_ have been added.
* The _a_ theta at U+00AD (soft hyphen) has been moved to U+0109 (for browser compatibility issues).
* The _vaia_ tengwa has been added and moved to U+0125 (for browser compatibility issues).
* Added _e grave tehtar_ . 
* Added pustar combinations (4/4-halfed/4-squared/5)
* A serie of 4 inferior tehtar has been added for the reversed, small, u-curl.
  
**Sarati Eldamar**, created and designed by **Måns Björkman**
--------------------------------------------------------------

* GPOS OpenType tables and anchors have been added to manage diacritics.
* The spacing between characters has been slightly increased because it looked a bit small.


