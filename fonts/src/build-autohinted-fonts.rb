#!/usr/bin/env ruby

Dir.chdir(__dir__)


puts "Building fonts, autohinting them with ttfautohint."
puts "We do this because they are unicode fonts with no latin part and ttfautohint crashes on font squirrel without the -s option"

def build_font(font_name)
  puts "Building #{font_name}"
  puts %x(ttfautohint ./ttfs_exports/#{font_name}-noautohint.ttf          ../build/ttfs/#{font_name}.ttf -s)
  puts "Done."
end

available_fonts = [
  "sarati-eldamar-rtlb-glaemscrafu",
  "tengwar-annatar-glaemunicode",
  "tengwar-annatar-glaemunicode-bold",
  "tengwar-annatar-glaemunicode-italic",
  "tengwar-eldamar-glaemunicode",
  "tengwar-elfica-glaemunicode",
  "tengwar-parmaite-glaemunicode",
  "tengwar-sindarin-glaemunicode",
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
  ARGV.each { |a|
    if !available_fonts.include? a
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
    build_font(a)
  }
  
end

puts "... now, convert files in build/ttfs to build/webs using font squirrel."
