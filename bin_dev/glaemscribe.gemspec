Gem::Specification.new do |s|
  s.name        = 'glaemscribe'
  s.version     = '1.0.10'
  s.date        = '2016-04-04'
  s.summary     = "Glǽmscribe"
  
  s.description = 
  "Glǽmscribe (also written Glaemscribe) is a software dedicated \
  to the transcription of texts between writing systems, and more specifically \
  dedicated to the transcription of J.R.R. Tolkien's \
  invented languages to some of his devised writing systems."
  
  s.authors     = ["Benjamin 'Talagan' Babut"]
  s.email       = 'please.visit.glaemscribe.s.website@nospam.org'
  
  s.files       =  Dir.glob("lib/**/*") + Dir.glob("glaemresources/**/*") + ["LICENSE.txt"]
  
  s.executables << "glaemscribe"
  
  s.homepage    = 'http://jrrvf.com/~glaemscrafu/english/glaemscribe.html'
  s.license     = 'AGPLv3'
  
  s.add_runtime_dependency 'commander', '~> 4.3'
  
end