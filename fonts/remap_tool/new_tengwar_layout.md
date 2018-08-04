Generate a partial modifier remapping file from charset diff (to include in a more generic one)

./cst_modifier_gen.rb ../../glaemresources/charsets/tengwar_ds_annatar.cst final_layout.cst 0x10000 > _annatar_partial.mod
./cst_modifier_gen.rb ../../glaemresources/charsets/tengwar_ds_eldamar.cst final_layout.cst 0x10000 > _eldamar_partial.mod

Generate a new remapped font using a modifier file

./sfd_remapper.rb ../sfds/TengwarAnnatarGlaemscrafu.sfd _annatar_modifier.mod ./TengwarAnnatarGlaemUnicode.sfd
./sfd_remapper.rb ../sfds/TengwarAnnatarGlaemscrafuItalic.sfd _annatar_modifier.mod ./TengwarAnnatarGlaemUnicodeItalic.sfd
./sfd_remapper.rb ../sfds/TengwarAnnatarGlaemscrafuBold.sfd _annatar_modifier.mod ./TengwarAnnatarGlaemUnicodeBold.sfd
./sfd_remapper.rb ../sfds/TengwarEldamarGlaemscrafu.sfd _eldamar_modifier.mod ./TengwarEldamarGlaemUnicode.sfd



0xE800 > 0xEBFF : Ligature solving space
----------------------------------------
0xE800
...
0xEBD0 SARINCE_LEFT                   - 0xEBD8 SARINCE_RIGHT
0xEBE0 SARINCE RIGHT SEMI ASCENDING   - 0xEBE8 SARINCE RIGHT ASCENDING
0xEBF0 SARINCE DESCENDING             - 0xEBF8 SARINCE FLOURISHED


0xEC00 > 0xEFFF : Tehtar variant space
--------------------------------------
0xEC00 GEMINATE_DASH (dash_inf)
0xEC10 GEMINATE_TILD (tild_inf)
0xEC20 NASALIZE_DASH (dash_sup)
0xEC30 NASALIZE_TILD (tild_sup)
0xEC40 A_TEHTA
0xEC50 E_TEHTA
0xEC60 I_TEHTA
0xEC70 O_TEHTA
0xEC80 U_TEHTA
0xEC90 A_TEHTA_INF
0xECA0 E_TEHTA_INF
0xECB0 I_TEHTA_INF
0xECC0 O_TEHTA_INF
0xECD0 U_TEHTA_INF
0xECE0 A_TEHTA_DOUBLE *
0xECF0 E_TEHTA_DOUBLE
0xED00 I_TEHTA_DOUBLE
0xED10 O_TEHTA_DOUBLE
0xED20 U_TEHTA_DOUBLE
0xED30 E_TEHTA_INF_DOUBLE
0xED40 I_TEHTA_INF_DOUBLE
0xED50 LABIAL_MODIFIER (sev_tehta)
0xED60 THINNAS (thinf_stroke)
0xED70 MSB (th_sub_circ)
0xED80 A_TEHTA_INV
0xED90 A_TEHTA_CIRCUM
0xEDA0 A_TEHTA_CIRCUM_INV (thsup_tick)
0xEDB0 A_TEHTA_LAMBDA (thsup_lambda)
0xEDC0 E_TEHTA_GRAVE
0xEDD0 BREVE_TEHTA
0xEDE0
0xEDF0
0xEE00
0xEE10
0xEE20
0xEE30
0xEE40
0xEE50
0xEE60
0xEE70
0xEE80
0xEE90
0xEEA0
0xEEB0
0xEEC0
0xEED0
0xEEE0
0xEEF0
0xEF00
0xEF10
0xEF20
0xEF30
0xEF40
0xEF50
0xEF60
0xEF70
0xEF80
0xEF90
0xEFA0
0xEFB0
0xEFC0
0xEFD0
0xEFE0
0xEFF0