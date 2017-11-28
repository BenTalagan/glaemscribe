# Glǽmscribe

[**_Glǽmscribe_**](https://jrrvf.com/~glaemscrafu/english/glaemscribe.html) (also written **_Glaemscribe_**) is a software dedicated to
the transcription of texts between writing systems, and more specifically dedicated to the transcription of J.R.R. Tolkien's invented languages to some of his devised writing systems.

Official integration
--------------------

Here is [**_the official integration of Glǽmscribe's engine_**](https://jrrvf.com/~glaemscrafu/english/glaemscribe.html).

Features
--------

* Handles a large variety of writings (Tengwar, Cirth, Sarati, Runes and more).
* Offers modes for a large variety of fictional languages (Quenya, Sindarin, Khuzdul, Black Speech, Adûnaic, Telerin, Noldorin, Valarin, Westron) and non-fictional languages (Old English, Old Norse).
* Extensible through a custom programmation language dedicated to the writing of modes.
* Allow modes to be designed and programmed to have conditional behaviours depending on independant, custom options.
* Separates the handling of modes and charsets, making the mode files purely 'logical' and compliant with all fonts, and pushing back font issues to charset files.
* Compliant with opentype and non-opentype fonts, so that we can handle old-gen (Parmaite, Eldamar, Annatar...) fonts as well as new-gen ones (FreeMono, Eldamar Sarati - glaemscribe version with opentype features, ...), so that have a smooth transition between technologies.
* Offers a mechanism to compensate diacritic and ligature issues for non-opentype fonts through 'virtual characters', allowing mode files to be generic and far more simple to write.
* Has support for inlined, spelled tengwar (or any other writing, respectively) for complete control on the output.
* Has an official graphical, friendly integration (see above).
* Has a graphical IDE for helping users to write mode files.
* Exists as a javascript library or a ruby library.
* Has a command-line tool implementation (in ruby).

Mode development
----------------

If you're interested in developing a mode for Glǽmscribe, please read [**_the mode development documentation_**](https://jrrvf.com/~glaemscrafu/english/glaemscribe-mode-authoring.html).

Installation and integration
----------------------------

Here is [**_the installation and integration documentation_**](http://bentalagan.github.com/glaemscribe), for advanced users.

Changelog
---------

| Version | Date | Comment |
|---------|------|---------|
| 1.1.9 | 11/26/2017 | Bug fix targetting handling of NBSP. |
| 1.1.8 | 11/25/2017 | Bug fixes and charset enhancings. |
| 1.1.7 | 07/21/2017 | Merged handling of /aw/ & /au/ in the Beleriand mode for Sindarin. |
| 1.1.6 | 07/17/2017 | Enhanced handling of /aw/ in the Beleriand mode for Sindarin. Thanks a lot to Dmitry Kourmyshov for noticing! |
| 1.1.5 | 06/14/2017 | Fixing Quenya/Sarati issues (hl/hr/qui). Adding Quenya/Sarati punctuation basic handling. Thanks a lot to Roman Rausch for noticing these bugs & missing features ! |
| 1.1.4 | 06/11/2017 | Fixing font problems and adding font features, enhancing charsets : adding some missing pustar punctuation, adding consonant modification signs for narrow bearer tengwar, refactoring the virtual charset tool, creating font repo for better tracking (thanks @Laicasaane for reporting all these issues!). |
| 1.1.3 | 05/27/2017 | [Tengwar] Added support for inlined, raw, spelled tengwar through the raw tengwar mode and the {{ ... }} syntax within any tengwar mode (thanks @Shihali for the discussion leading to that feature). <br> Major bug fix on crossrules (thanks @Laicasaane for noticing that bug!) <br> Reworked charsets and moved the reversed a tehta that was mapped on U+00AD (soft hyphen) (thanks @Laicasaane for noticing that bug too!) |
| 1.1.2 | 05/04/2017 | Npm repackaging. |
| 1.1.1 | 05/04/2017 | [Quenya] Added Vanyarin ldy, rdy, lg, rg, ff. <br> Added npm packaging. <br> Minor bug fixes. |
| 1.1.0 | 03/24/2017 | [Quenya] Added double tehtar option. <br>Added reversed virtual chars (for ligatures). <br>Added charset for Annatar. <br>Added LAMBE ligature for Annatar charset. <br>Enhanced existing charsets for better diacritic placement.<br>Merged Blackspeech modes. <br>Added support for FreeMonoTengwar. <br>Added custom, independent charset for Tengwar Parmaite. <br>Added charset for Tengwar Elfica. <br>New runic modes for Old Norse and Old English. <br>Lots of minor fixes. <br>Added small options in tengwar modes (consonant modification diacritic style, o/u curl direction, etc.) |
| 1.0.19 | 09/06/2016 | [Quenya] Removed unutixe under óre for coherency in implicit a submode.<br>[Sindarin Angerthas Daeron] Fixed h,ch,hw. |
| 1.0.18 | 09/02/2016 | Fixed 'implicit a' option for quenya mode broken in 1.0.17. Thanks to Dmitry Kourmyshov for noticing. |
| 1.0.17 | 08/26/2016 | Ported modes to virtual chars, added a dedicated charset for tengwar eldamar for better rendering of tehtar and diacritics. |
| 1.0.16 | 08/16/2016 | Introduces virtual chars in charsets for easier tehtar and diacritic variant uses. |
| 1.0.15 | ... | Unlogged (see mode changelogs) |

Prior todos
-----------

* Deeper integration/design of full-featured OpenType Tengwar fonts.
* Rewrite the charset editor which is now obsolete since the introduction of virtual chars.

License
-------

Glǽmscribe is released under the terms of the GNU Affero General Public License :

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


Acknowledgments and thanks
--------------------------

* **_Glǽmscribe_** would never have been possible without the invaluable and unconditional help and wisdom of **_Bertrand Bellet_**.
* Special thanks to **_Måns Björkman_** author of the outstanding website Amanyë Tenceli and its typefaces, a precious resource for **_Glǽmscribe_**'s development, and **_Didier Willis_** for having ignited the inspiration of this project.
* Many thanks to **_Paul Strack_** for all his suggestions and careful examinations on the Tengwar modes during his integration of **_Glǽmscribe_**'s engine into his [**_eldamo_**](http://eldamo.org) project!
* Many thanks to **_J. Mach Wust_** and **Roman Rausch** for their clever thoughts and advice on the Tengwar & Sarati modes and fonts.
* Many thanks to **Johan Winge** and **Enrique Mombello** for their incredible work on tengwar fonts ; this project would not have been possible without them
* Many thanks to **Laicasaane** for his very precise remarks on the charsets and modes.
* Many thanks to **Dmitry Kourmyshov** for his very clever remarks and glances at the elvish modes.
* Many thanks to **Leonard Wickmark** for his suggestions during his integration of **_Glǽmscribe_**'s engine into the [**_elfdict_**](http://elfict.com) project!.
* **_Glǽmscribe_** would never have come to be without the ceaseless and continuously renewed work of the great family of Internet Tolkienists, both on technologies (with several generations of transcribers and typefaces) and on knowledge shared and gathered on websites and forums. Neither would it exist without the devoted labour of all those that make the publication of Tolkien's linguistic works possible. A very big thank you to them all!
* **_Glǽmscribe_**'s IDE uses [**_CodeMirror_**](https://codemirror.net/) for its code writing widgets.
* **_Glǽmscribe_**'s IDE uses [**_d3.js_**](https://d3js.org/) for the whole SVG behaviour of its debugger UI. Thanks to **_Mike Bostock_** for D3 (truly awesome)!
* **_Glǽmscribe_**'s IDE uses [**_tipsy_**](http://onehackoranother.com/projects/jquery/tipsy/#download) for tooltips in its debugger UI. Thanks to **_Jason Frame_**!
* **_Glǽmscribe_**'s IDE uses [**_alertify.js_**](http://fabien-d.github.io/alertify.js/). Thanks to **_Fabien Doiron_**!
* **_Glǽmscribe_**'s IDE uses [**_Font Awesome_**](https://fortawesome.github.io/Font-Awesome/). Thanks to **_Dave Gandy_**!


Author
------

**_Glǽmscribe_** is written and maintained by Benjamin _Talagan_ Babut.

