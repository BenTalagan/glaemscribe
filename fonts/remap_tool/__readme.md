Generate a partial modifier remapping file from charset diff (to include in a more generic one)

./cst_modifier_gen.rb ../../glaemresources/charsets/tengwar_ds_annatar.cst final_layout.cst 0x10000   > _annatar_partial.mod
./cst_modifier_gen.rb ../../glaemresources/charsets/tengwar_ds_eldamar.cst final_layout.cst 0x10000   > _eldamar_partial.mod
./cst_modifier_gen.rb ../../glaemresources/charsets/tengwar_ds_sindarin.cst final_layout.cst 0x10000  > _sindarin_partial.mod
./cst_modifier_gen.rb ../../glaemresources/charsets/tengwar_ds_parmaite.cst final_layout.cst 0x10000  > _parmaite_partial.mod
./cst_modifier_gen.rb ../../glaemresources/charsets/tengwar_ds_elfica.cst final_layout.cst 0x10000    > _elfica_partial.mod

Generate a new remapped font using a modifier file

./sfd_remapper.rb ../src/sfds/legacy/TengwarAnnatarGlaemscrafu.sfd        _annatar_modifier.mod         ../src/sfds/TengwarAnnatarGlaemUnicode.sfd
./sfd_remapper.rb ../src/sfds/legacy/TengwarAnnatarGlaemscrafuItalic.sfd  _annatar_modifier_italic.mod  ../src/sfds/TengwarAnnatarGlaemUnicodeItalic.sfd
./sfd_remapper.rb ../src/sfds/legacy/TengwarAnnatarGlaemscrafuBold.sfd    _annatar_modifier_bold.mod    ../src/sfds/TengwarAnnatarGlaemUnicodeBold.sfd
./sfd_remapper.rb ../src/sfds/legacy/TengwarEldamarGlaemscrafu.sfd        _eldamar_modifier.mod         ../src/sfds/TengwarEldamarGlaemUnicode.sfd
./sfd_remapper.rb ../src/sfds/legacy/TengwarSindarinGlaemscrafu.sfd       _sindarin_modifier.mod        ../src/sfds/TengwarSindarinGlaemUnicode.sfd
./sfd_remapper.rb ../src/sfds/legacy/TengwarParmaiteGlaemscrafu.sfd       _parmaite_modifier.mod        ../src/sfds/TengwarParmaiteGlaemUnicode.sfd
./sfd_remapper.rb ../src/sfds/legacy/TengwarElficaGlaemscrafu.sfd         _elfica_modifier.mod          ../src/sfds/TengwarElficaGlaemUnicode.sfd
