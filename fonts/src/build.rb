#!/usr/bin/env ruby

Dir.chdir(__dir__)


puts "Building fonts, autohinting them with ttfautohint."
puts "We do this because they are unicode fonts with no latin part and ttfautohint crashes on font squirrel without the -s option"

%x(ttfautohint ./ttfs_exports/sarati-eldamar-rtlb-glaemscrafu-noautohint.ttf       ../build/ttfs/sarati-eldamar-rtlb-glaemscrafu.ttf)
%x(ttfautohint ./ttfs_exports/tengwar-annatar-glaemunicode-noautohint.ttf          ../build/ttfs/tengwar-annatar-glaemunicode.ttf -s)
%x(ttfautohint ./ttfs_exports/tengwar-annatar-glaemunicode-noautohint.ttf          ../build/ttfs/tengwar-annatar-glaemunicode.ttf -s)
%x(ttfautohint ./ttfs_exports/tengwar-annatar-glaemunicode-bold-noautohint.ttf     ../build/ttfs/tengwar-annatar-glaemunicode-bold.ttf -s)
%x(ttfautohint ./ttfs_exports/tengwar-annatar-glaemunicode-italic-noautohint.ttf   ../build/ttfs/tengwar-annatar-glaemunicode-italic.ttf -s)
%x(ttfautohint ./ttfs_exports/tengwar-eldamar-glaemunicode-noautohint.ttf          ../build/ttfs/tengwar-eldamar-glaemunicode.ttf -s)
%x(ttfautohint ./ttfs_exports/tengwar-elfica-glaemunicode-noautohint.ttf           ../build/ttfs/tengwar-elfica-glaemunicode.ttf -s)
%x(ttfautohint ./ttfs_exports/tengwar-parmaite-glaemunicode-noautohint.ttf         ../build/ttfs/tengwar-parmaite-glaemunicode.ttf -s)
%x(ttfautohint ./ttfs_exports/tengwar-sindarin-glaemunicode-noautohint.ttf         ../build/ttfs/tengwar-sindarin-glaemunicode.ttf -s)

puts "... now, convert files in build/ttfs to build/webs using font squirrel."

puts "Done."