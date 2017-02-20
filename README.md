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
| 1.1.0 | 03/24/2016 | [Quenya] Added double tehtar option.<br>Added reversed virtual chars.<br>Added charset for Annatar.<br>Added ligatures.<br>Added LAMBE ligature for Annatar charset.<br> Enhanced existing charsets.<br>Merged Blackspeech modes.<br>Added support for FreeMonoTengwar.<br>Added custom, independent charset for Tengwar Parmaite. |
| 1.0.19 | 09/06/2016 | [Quenya] Removed unutixe under óre for coherency in implicit a submode.<br>[Sindarin Angerthas Daeron] Fixed h,ch,hw. |
| 1.0.18 | 09/02/2016 | Fixed 'implicit a' option for quenya mode broken in 1.0.17. Thanks to Dmitry Kourmyshov for noticing. |
| 1.0.17 | 08/26/2016 | Ported modes to virtual chars, added a dedicated charset for tengwar eldamar for better rendering of tehtar and diacritics. |
| 1.0.16 | 08/16/2016 | Introduces virtual chars in charsets for easier tehtar and diacritic variant uses. |
| 1.0.15 | ... | Unlogged (see mode changelogs) |

Prior todos
-----------

* Design a full-featured opentype Tengwar font by extending the Free Tengwar Font Project specifications.
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
* Many thanks to **_Paul Strack_** for all his suggestions and careful examinations on the tengwar modes during his integration of **_Glǽmscribe_**'s engine into his [**_eldamo_**](http://eldamo.org) project!
* **_Glǽmscribe_** would never have come to be without the ceaseless and continuously renewed work of the great family of Internet Tolkienists, both on technologies (with several generations of transcribers and typefaces) and on knowledge shared and gathered on websites and forums. Neither would it exist without the devoted labour of all those that make the publication of Tolkien's linguistic works possible. A very big thank you to them all!
* **_Glǽmscribe_**'s engine uses [**_shellwords.js_**](https://github.com/jimmycuadra/shellwords) for parsing purposes in its javascript version. Thanks to **_Jimmy Cuadra_**.
* **_Glǽmscribe_**'s IDE uses [**_CodeMirror_**](https://codemirror.net/) for its code writing widgets.
* **_Glǽmscribe_**'s IDE uses [**_d3.js_**](https://d3js.org/) for the whole SVG behaviour of its debugger UI. Thanks to **_Mike Bostock_** for D3 (truly awesome)!
* **_Glǽmscribe_**'s IDE uses [**_tipsy_**](http://onehackoranother.com/projects/jquery/tipsy/#download) for tooltips in its debugger UI. Thanks to **_Jason Frame_**!
* **_Glǽmscribe_**'s IDE uses [**_alertify.js_**](http://fabien-d.github.io/alertify.js/). Thanks to **_Fabien Doiron_**!
* **_Glǽmscribe_**'s IDE uses [**_Font Awesome_**](https://fortawesome.github.io/Font-Awesome/). Thanks to **_Dave Gandy_**!


Author
------

**_Glǽmscribe_** is written and maintained by Benjamin _Talagan_ Babut.

