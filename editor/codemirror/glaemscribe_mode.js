
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("glaemscribe", function(config) {

    return {
      
      startState: function() {
        return {inbegin: false, inelement:false};
      },
      
      tryCommentStart: function(stream, state) {
        var m = stream.match(/\\\*\*/);
        if(m)
        {
          state.incomment = true;
          return 'comment';
        }
        return null;
      },
      
      tryCommentEnd: function(stream, state) {
        var m = stream.match(/\*\*\\/);
        if(m)
          state.incomment = false;
        else
          stream.next();
        return 'comment'
      },
      
      tryNodeName: function(stream, state) {
        var m = stream.match(/([a-z_]+)\s*(.*)/,false);
        if(m)
        {
          var eaten = stream.match(/([a-z_]+)\s*/);
          state.inelement = true;
          state.inbegin   = 2;
          return 'string';
        }  
        return null;
      },
      
      token: function(stream, state) 
      {
        var cm    = this;
        var m     = null;
        var token = null;
        
        // Always reset inbegin and inelement when starting a new line
        if(stream.sol())
        {
          state.inbegin   = 0;
          state.inelement = false;
        }
        
        // If we're in a comment, eat until we're not
        if(state.incomment)
        {
          if(token = cm.tryCommentEnd(stream, state))
            return token;
        }
        else
        {
          if(token = cm.tryCommentStart(stream, state))
            return token;
  
          if(state.inelement == true)
          {
            stream.next();
            return 'def';
          }
        
          if(state.inbegin == 1)
          {
            // eat the begin name
            if(token = cm.tryNodeName(stream, state))
              return token;
            
            // Begin name not good advance
            stream.next();
            return 'unknown';
          }
          else
          {
            // Try to find begin                                       
            m = stream.match(/\s*(\\beg)\s+([a-z_]*)\s*(.*)/, false);
            if(m)
            {
              var eaten = stream.match(/\s*\\beg\s+/);
              state.inbegin = 1;
              return 'keyword';
            }
            
            // Try to find end
            m = stream.match(/\s*(\\end)\s*$/,false);
            if(m)
            {
              stream.skipToEnd();
              return 'keyword'; 
            }
            
            // Try to find \something
            m = stream.match(/\s*(\\[a-z_]+)\s*(.*)/,false)
            if(m)
            {
              var eaten = stream.match(/\s*(\\[a-z_]+)\s*/);
              state.inelement = true;
              return 'string';
            }         
            
            stream.next();
            return 'unknown';
          }
        }
      },
    };
});

CodeMirror.defineMIME("text/glaemscribe", "glaemscribe");

});

