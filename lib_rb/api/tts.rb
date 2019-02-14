module Glaemscribe
  module API
    
    class TTS
  
      TTS_ENGINE_PATH     = File.dirname(__FILE__) + "/../../lib_espeak/espeakng.for.glaemscribe.nowasm.sync.js"
      TTS_MODULE_PATH     = File.dirname(__FILE__) + "/../../lib_espeak/glaemscribe_tts.js"
      
      def self.loaded?
        !@context.nil?
      end
      
      def self.load_engine
        return if @context
        
        @context                    = ::MiniRacer::Context.new
        
        @context.attach 'console.log',  proc{|o| puts o}
        @context.attach 'print',        proc{|o| puts o}
        
        espeak_lib                  = File.open(TTS_ENGINE_PATH,"rb").read
        @context.eval(espeak_lib)

        tts_module                  = File.open(TTS_MODULE_PATH,"rb").read    
        @context.eval(tts_module)

        @voice_list = @context.eval("Glaemscribe.TTS.voice_list()")
#        puts "TTS Engine loaded."
      end
      
      def self.voice_list
        load_engine if !@context
        @voice_list
      end
  
      def self.ipa(text, voice, has_raw_mode)
        load_engine if !@context
        @context.eval("var esp = new Glaemscribe.TTS(); esp.synthesize_ipa(#{text.inspect},{voice:'#{voice}', has_raw_mode: #{has_raw_mode}})")
      end
  
      def self.wav(text, voice, has_raw_mode)
        load_engine if !@context
        @context.eval("var esp = new Glaemscribe.TTS(); esp.synthesize_wav(#{text.inspect},{voice:'#{voice}', has_raw_mode: #{has_raw_mode}})")
      end
  
      def self.option_name_to_voice(option_name)
        option_name.downcase.gsub(/^espeak_voice_/,'').gsub('_','-')
      end
    end
  end
end
