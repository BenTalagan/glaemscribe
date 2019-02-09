#!/usr/bin/env ruby

FONTFORGE_PATH = "/Applications/FontForge.app/Contents/MacOS/FontForge"

Dir.chdir(__dir__)


puts "Building fonts, autohinting them with ttfautohint."
puts "We do this because they are unicode fonts with no latin part and ttfautohint crashes on font squirrel without the -s option"

def build_font(font)
  puts "Building #{font[:ttf]}"
  puts %x(#{FONTFORGE_PATH} --lang='ff' -c 'Open($1); Generate($2);' "./sfds/#{font[:sfd]}.sfd" "./ttfs_exports/#{font[:ttf]}-noautohint.ttf")
  puts %x(ttfautohint ./ttfs_exports/#{font[:ttf]}-noautohint.ttf ../build/ttfs/#{font[:ttf]}.ttf -s)
  puts "Done."
end

available_fonts = [
  { sfd: "SaratiEldamarRTLBarGlaemscrafu",    ttf: "sarati-eldamar-rtlb-glaemscrafu"},
  
  { sfd: "TengwarAnnatarGlaemUnicode",        ttf: "tengwar-annatar-glaemunicode"},
  { sfd: "TengwarAnnatarGlaemUnicodeBold",    ttf: "tengwar-annatar-glaemunicode-bold"},
  { sfd: "TengwarAnnatarGlaemUnicodeItalic",  ttf: "tengwar-annatar-glaemunicode-italic"},
  { sfd: "TengwarEldamarGlaemUnicode",        ttf: "tengwar-eldamar-glaemunicode"},
  { sfd: "TengwarElficaGlaemUnicode",         ttf: "tengwar-elfica-glaemunicode"},
  { sfd: "TengwarParmaiteGlaemUnicode",       ttf: "tengwar-parmaite-glaemunicode"},
  { sfd: "TengwarSindarinGlaemUnicode",       ttf: "tengwar-sindarin-glaemunicode"},

  { sfd: "legacy/TengwarAnnatarGlaemscrafu",         ttf: "legacy/tengwar-annatar-glaemscrafu"},
  { sfd: "legacy/TengwarAnnatarGlaemscrafuBold",     ttf: "legacy/tengwar-annatar-glaemscrafu-bold"},
  { sfd: "legacy/TengwarAnnatarGlaemscrafuItalic",   ttf: "legacy/tengwar-annatar-glaemscrafu-italic"},
  { sfd: "legacy/TengwarEldamarGlaemscrafu",         ttf: "legacy/tengwar-eldamar-glaemscrafu"},
  { sfd: "legacy/TengwarElficaGlaemscrafu",          ttf: "legacy/tengwar-elfica-glaemscrafu"},
  { sfd: "legacy/TengwarParmaiteGlaemscrafu",        ttf: "legacy/tengwar-parmaite-glaemscrafu"},
  { sfd: "legacy/TengwarSindarinGlaemscrafu",        ttf: "legacy/tengwar-sindarin-glaemscrafu"},
]                                             

should_build_all = false
ARGV.each { |a|
  if a == "--all"
    should_build_all = true
  end
}

if should_build_all
  puts "Building all available fonts."
  available_fonts.each{ |f|
    build_font(f)
  }
else
  missing_font = false
  has_fonts    = false
  ttf_font_lookup = {}
  available_fonts.each{ |f| ttf_font_lookup[f[:ttf]] = f }
  
  ARGV.each { |a|
    if !ttf_font_lookup[a]
      puts "*** Illegal font name #{a}"
      missing_font = true
    else
      has_fonts = true
    end
  }
  exit(2) if missing_font
  
  if !has_fonts
    puts "*** no font to build! Pass font names or --all"
    exit(3)
  end
  
  ARGV.each { |a|
    build_font(ttf_font_lookup[a])
  }
  
end

puts "... now, convert files in build/ttfs to build/webs using font squirrel."
