#!/usr/bin/env ruby

require "ERB"
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8
Dir.chdir(File.expand_path(File.dirname(__FILE__)))


def open_template(template_file,varname)
  begin
    File.open(template_file,"rb:UTF-8") { |f|
      return ERB.new(f.read,nil,nil,varname)
    }
  rescue Exception => e
    raise "Could not open template file #{template_file} (#{e.message})"
  end
end


@template = open_template("tracking_template.html.erb","layout")


@fonts    = ["Tengwar Annatar", "Tengwar Annatar Bold", "Tengwar Annatar Italic", "Tengwar Eldamar", "Tengwar Parmaite", "Tengwar Elfica", "Tengwar Sindarin"]

# x = available originally
# m = modified
# a = added

@sections = [
  {
    name: "General Features",
    entries: [
      ["a","a","a","a","a","x","x","Merging of Base and Alt fonts","Having a unique file for a font is more convenient for web technos, hence the merging."]
    ]
  },
  {
    name: "Bearer tengwar",
    entries: [
      ["x","x","x","x","x","x","x","Tinco",""],
      ["x","x","x","x","x","x","x","Parma",""],
      ["x","x","x","x","x","x","x","Calma",""],
      ["x","x","x","x","x","x","x","Quesse",""],
      ["x","x","x","x","x","x","x","Ando",""],
      ["x","x","x","x","x","x","x","Umbar",""],
      ["x","x","x","x","x","x","x","Anga",""],
      ["x","x","x","x","x","x","x","Ungwe",""],
      ["x","x","x","x","x","x","x","Sule",""],
      ["x","x","x","x","x","x","x","Formen",""],
      ["x","x","x","x","x","x","x","Aha",""],
      ["x","x","x","x","x","x","x","Hwesta",""],
      ["x","x","x","x","x","x","x","Anto",""],
      ["x","x","x","x","x","x","x","Ampa",""],
      ["x","x","x","x","x","x","x","Anca",""],
      ["x","x","x","x","x","x","x","Unque",""],
      ["x","x","x","x","x","x","x","Numen",""],
      ["x","x","x","x","x","x","x","Malta",""],
      ["x","x","x","x","x","x","x","Noldo",""],
      ["x","x","x","x","x","x","x","Nwalme",""],
      ["x","x","x","x","x","x","x","Ore",""],
      ["x","x","x","x","x","x","x","Vala",""],
      ["x","x","x","x","x","x","x","Anna",""],
      ["x","x","x","x","x","x","x","Vilya",""],
      ["x","x","x","x","x","x","x","Romen",""],
      ["x","x","x","x","x","x","x","Arda",""],
      ["x","x","x","x","x","x","x","Lambe",""],
      ["x","x","x","x","x","x","x","Alda",""],
      ["x","x","x","x","x","x","x","Silme",""],
      ["x","x","x","x","x","x","x","Silme Nuquerna",""],
      ["x","x","x","x","x","x","x","Esse",""],
      ["x","x","x","x","x","x","x","Esse Nuquerna",""],
      ["x","x","x","x","x","x","x","Hyarmen",""],
      ["x","x","x","x","x","x","x","Hwesta sindarinwa",""],
      ["x","x","x","x","x","x","x","Yanta",""],
      ["x","x","x","x","x","x","x","Ure",""],
      ["x","x","x","x","x","x","x","Telco",""],
      ["x","x","x","x","x","x","x","Ara",""],
      ["x","x","x","x","x","x","x","Halla",""],
      ["x","x","x","x","x","x","x","Telco Ligating",""],
      ["x","x","x","x","x","x","x","Osse",""],
      ["x","x","x","x","x","x","x","Lowdham HW",""],
      ["x","x","x","x","x","x","a","MH (malta+hook)",""],
      ["x","x","x","x","x","x","a","MH Beleriandic (vala+hook)",""],
      ["m","m","m","m","m","x","a","Vaia","Moved for obscure browser compatibility reasons."]
    ]
  },
  {
    name: "Ligatured tengwar",
    entries: [
      ["x","x","x","x","x","x","x","Harma + Tinco",""],
      ["x","x","x","x","x","x","x","Hwesta + Tinco",""],
      ["x","x","x","x","x","x","x","Harma + Silme",""]
    ]
  },
  {
    name: "Tehtar above",
    entries: [
      ["x","x","x","x","x","x","x","A [xs]",""],
      ["x","x","x","x","x","x","x","A [s]",""],
      ["x","x","x","x","x","x","x","A [l]",""],
      ["x","x","x","x","x","x","x","A [xl]",""],
      ["x","x","x","x","x","x","x","A (circumflex) [xs]",""],
      ["x","x","x","x","x","x","x","A (circumflex) [s]",""],
      ["x","x","x","x","x","x","x","A (circumflex) [l]",""],
      ["x","x","x","x","x","x","x","A (circumflex) [xl]",""],
      ["x","x","x","x","x","x","x","A (reversed) [xs]",""],
      ["x","x","x","x","x","x","x","A (reversed) [s]",""],
      ["m","m","m","m","m","x","m","A (reversed) [l]","Was mapped on soft hyphen (U+AD), which was buggy with navigators."],
      ["x","x","x","x","x","x","x","A (reversed) [xl]",""],
      ["x","x","x","x","x","x","x","A (circumflex+reversed) [xs]",""],
      ["x","x","x","x","x","x","x","A (circumflex+reversed) [s]",""],
      ["x","x","x","x","x","x","x","A (circumflex+reversed) [l]",""],
      ["x","x","x","x","x","x","x","A (circumflex+reversed) [xl]",""],
      ["x","x","x","x","x","x","x","E [xs]",""],
      ["x","x","x","x","x","x","x","E [s]",""],
      ["x","x","x","x","x","x","x","E [l]",""],
      ["x","x","x","x","x","x","x","E [xl]",""],
      ["x","x","x","m","m","x","a","E (reversed) [xs]","Was interfering with double e"],
      ["x","x","x","m","m","x","a","E (reversed) [s]","Was interfering with double e"],
      ["x","x","x","m","m","x","a","E (reversed) [l]","Was interfering with double e"],
      ["x","x","x","m","m","x","a","E (reversed) [xl]","Was interfering with double e"],
      ["x","x","x","x","x","x","x","I [xs]",""],
      ["x","x","x","x","x","x","x","I [s]",""],
      ["x","x","x","x","x","x","x","I [l]",""],
      ["x","x","x","x","x","x","x","I [xl]",""],
      ["x","x","x","x","x","x","x","O [xs]",""],
      ["x","x","x","x","x","x","x","O [s]",""],
      ["x","x","x","x","x","x","x","O [l]",""],
      ["x","x","x","x","x","x","x","O [xl]",""],
      ["x","x","x","x","x","x","x","U [xs]",""],
      ["x","x","x","x","x","x","x","U [s]",""],
      ["x","x","x","x","x","x","x","U [l]",""],
      ["x","x","x","x","x","x","x","U [xl]",""],
    ]
  },
  {
    name: "Tehtar below",
    entries: [
      ["x","x","x","x","x","x","x","A [xs]          ",""],
      ["x","x","x","x","x","x","x","A [s]           ",""],
      ["x","x","x","x","x","x","x","A [l]           ",""],
      ["x","x","x","x","x","x","x","A [xl]          ",""],
      ["x","x","x","x","x","x","x","E [xs]          ",""],
      ["x","x","x","x","x","x","x","E [s]           ",""],
      ["x","x","x","x","x","x","x","E [l]           ",""],
      ["x","x","x","x","x","x","x","E [xl]          ",""],
      ["x","x","x","x","x","x","x","I (unutixe) [xs]",""],
      ["x","x","x","x","x","x","x","I (unutixe) [s] ",""],
      ["x","x","x","x","x","x","x","I (unutixe) [l] ",""],
      ["x","x","x","x","x","x","x","I (unutixe) [xl]",""],
      ["x","x","x","x","x","x","x","O [xs]          ",""],
      ["x","x","x","x","x","x","x","O [s]           ",""],
      ["x","x","x","x","x","x","x","O [l]           ",""],
      ["x","x","x","x","x","x","x","O [xl]          ",""],
      ["x","x","x","x","x","x","x","U [xs]          ",""],
      ["x","x","x","x","x","x","x","U [s]           ",""],
      ["x","x","x","x","x","x","x","U [l]           ",""],
      ["x","x","x","x","x","x","x","U [xl]          ",""],
      ["m","m","x","x","x","x","x","LSD (circle tehta inf) [xs]          ","Modified for better placement under telco."],
      ["x","x","x","x","x","x","x","LSD (circle tehta inf) [s]           ",""],
      ["x","x","x","x","x","x","x","LSD (circle tehta inf) [l]           ",""],
      ["x","x","x","x","x","x","x","LSD (circle tehta inf) [xl]          ",""],
      ["x","x","x","x","x","x","x","Thinnas [xs]",""],
      ["x","x","x","x","x","x","x","Thinnas [s]",""],
      ["x","x","x","x","x","x","x","Thinnas [l]",""],
      ["x","x","x","x","x","x","x","Thinnas [xl]",""],
    ]
  },
  {
    name: "Double tehtar above",
    entries: [
      ["x","x","x","a","a","x","a","EE [xs]",""],
      ["x","x","x","a","a","x","a","EE [s] ",""],
      ["x","x","x","a","a","x","a","EE [l] ",""],
      ["x","x","x","a","a","x","a","EE [xl]",""],
      ["x","x","x","x","x","x","x","II [xs]",""],
      ["x","x","x","x","x","x","x","II [s] ",""],
      ["x","x","x","x","x","x","x","II [l] ",""],
      ["x","x","x","x","x","x","x","II [xl]",""],
      ["x","x","x","x","a","x","a","OO [xs]",""],
      ["x","x","x","x","a","x","a","OO [s] ",""],
      ["x","x","x","x","a","x","a","OO [l] ",""],
      ["x","x","x","x","a","x","a","OO [xl]",""],
      ["x","x","x","x","a","x","a","UU [xs]",""],
      ["x","x","x","x","a","x","a","UU [s] ",""],
      ["x","x","x","x","a","x","a","UU [l] ",""],
      ["x","x","x","x","a","x","a","UU [xl]",""]
    ]
  },
  {
    name: "Double tehtar below",
    entries: [
      ["x","x","x","x","x","x","x","EE [xs]",""],
      ["x","x","x","x","x","x","x","EE [s] ",""],
      ["x","x","x","x","x","x","x","EE [l] ",""],
      ["x","x","x","x","x","x","x","EE [xl]",""],
      ["x","x","x","x","x","x","x","II [xs]",""],
      ["x","x","x","x","x","x","x","II [s] ",""],
      ["x","x","x","x","x","x","x","II [l] ",""],
      ["x","x","x","x","x","x","x","II [xl]",""]
    ]
  },
  {
    name: "Consonant modifiers",
    entries: [
      ["x","x","x","x","x","x","x","Geminate (tild) [l]",""],
      ["x","x","x","x","x","x","x","Geminate (tild) [s]",""],
      ["a","a","a","a","a","a","a","Geminate (tild) [xs]","Added for Telco/Ara/Halla"],
      ["x","x","x","x","x","x","x","Geminate (dash) [l]",""],
      ["x","x","x","x","x","x","x","Geminate (dash) [s]",""],
      ["a","a","a","a","a","a","a","Geminate (dash) [xs]","Added for Telco/Ara/Halla"],
      ["x","x","x","x","x","x","x","Nasal (tild) [l]",""],
      ["x","x","x","x","x","x","x","Nasal (tild) [s]",""],
      ["a","a","a","a","a","a","a","Nasal (tild) [xs]","Added for Telco/Ara/Halla"],
      ["x","x","x","x","x","x","x","Nasal (dash) [l]",""],
      ["x","x","x","x","x","x","x","Nasal (dash) [s]",""],
      ["a","a","a","a","a","a","a","Nasal (dash) [xs]","Added for Telco/Ara/Halla"],
      ["x","x","x","x","x","x","x","Labial (wave) [xs]",""],
      ["x","x","x","x","x","x","x","Labial (wave) [s]",""],
      ["x","x","x","x","x","x","x","Labial (wave) [l]",""],
      ["x","x","x","x","x","x","x","Labial (wave) [xl]",""],
      
    ]
  },
  {
    name: "Sa-Rince (s curls) Variants",
    entries: [
      [" "," "," "," "," "," "," ","...","Tricky unification to do ..."]
    ]
  },
  # Annatar / A. Bold / A. italic / Eldamar / Parmaite / Elfica / Sindarin
  {
    name: "Punctuation",
    entries: [
      ["a","a","a","a","x","x","x","NBSP","Was missing in some fonts."],
      ["x","x","x","x","x","x","x","Pusta 1",""],
      ["x","x","x","x","x","x","x","Pusta 2",""],
      ["x","x","x","x","x","x","x","Pusta 3",""],
      ["a","a","a","m","a","x","a","Pusta 4",""],
      ["a","a","a","a","a","a","a","Pusta 4 (halfed)",""],
      ["a","a","a","m","a","a","a","Pusta 4 (squared)",""],
      ["a","a","a","m","a","x","a","Pusta 5",""],
      [" "," "," "," "," "," "," ","...","..."]
    ]
  }
  

=begin
  {
    name: "",
    entries: [
      ["x","x","x","x","x","x","x","",""],
    ]
  }
=end
]



File.open("glaemscribe_tengwar_fonts.html","wb:utf-8") { |f|
  f << @template.result(binding)
}

