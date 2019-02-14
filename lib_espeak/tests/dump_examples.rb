#!/usr/bin/env ruby


%x(espeak-ng -v "en-gb-x-rp" --ipa -f _examples.txt > examples.rp.txt )
%x(espeak-ng -v "en" --ipa -f _examples.txt > examples.gb.txt )
%x(espeak-ng -v "en-us" --ipa -f _examples.txt > examples.us.txt )
%x(espeak-ng -v "en-jrrt-tengwar" --ipa -f _examples.txt > examples.tengwar.txt )
