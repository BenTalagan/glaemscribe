dir     = File.absolute_path(File.dirname(__FILE__))
version = File.open(dir+ "/../../version","rb:utf-8") { |f| f.read }

Gem::Specification.new do |s|
  s.name        = 'glaemscribe'
  s.version     = version
  s.date        = '2016-07-29'
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
  s.license     = 'AGPL-3.0'
  
  s.add_runtime_dependency 'commander', '~> 4.3'
  
end