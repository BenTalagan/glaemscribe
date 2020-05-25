#!/usr/bin/env node

// ======================
// === ENV LOADING ======
// ======================

Fs       = require("fs")
Vm       = require("vm")
Glob     = require("Glob") // npm install glob
Path     = require("path")
Util     = require("util")
print    = console.log;

// Use the following trick to load the javascript that we would use normally in a web browser
function include(path) { var code = Fs.readFileSync(path, 'utf-8'); Vm.runInThisContext(code, path); }

global.require    = require;
global.__dirname  = __dirname;

// Load separately the espeakng library
include(__dirname + "/../espeakng.for.glaemscribe.nowasm.sync.js")
include(__dirname + "/../glaemscribe_tts.js")

client = new Glaemscribe.TTS();

var boro = `Through Rohan over fen and field where the long grass grows,
The West Wind comes walking, and about the walls it goes.
'What news from the West, O wandering wind, do you bring to me tonight?
Have you seen Boromir the Tall by moon or by starlight?'
'I saw him ride over seven streams, over waters wide and grey.
I saw him walk in empty lands, until he passed away
Into the shadows of the North. I saw him then no more.
The North Wind may have heard the horn of the son of Denethor.'
'O Boromir! From the high walls westward I looked afar,
But you came not from the empty lands where no men are.'

From the mouths of the sea the South Wind flies, from the sandhills and the stones;
The wailing of the gulls it hears, and at the gate it moans.
'What news from the South, O sighing wind, do you bring to me at eve?
Where now is Boromir the fair? He tarries and I grieve!'
'Ask me not of where he doth dwell--so many bones there lie
On the white shores and the dark shores under the stormy sky;
So many have passed down Anduin to find the flowing Sea.
Ask of the North Wind news of them the North Wind sends to me!'
'O Boromir! Beyond the gate the seaward road runs south,
But you came not with the wailing gulls from the grey sea's mouth.'

From the Gate of Kings the North Wind rides, and past the roaring falls;
And clear and cold about the tower its loud horn calls.
'What news from the North, O mighty wind, do you bring to me today?
What news of Boromir the Bold? For he is long away.'
'Beneath Amon Hen I heard his cry. There many foes he fought.
His cloven sheild, his broken sword, they to the water brought.
His head so proud, his face so fair, his limbs they laid to rest;
And Rauros, golden Rauros-falls, bore him upon its breast.'
'O Boromir! The Tower of Guard shall ever northward gaze
To Rauros, golden Rauros-falls, until the end of days.'`

function debugit(text) {
  var test = client.orthographic_disambiguator_en(text);
  console.dir(test, { maxArrayLength: null});
}

debugit(boro)
debugit("test you've done bad things with liz's bag, at the age of5")
debugit("asshole ashes michael marching king ingame bayou accurate page celt cell herein hope edinburgh baghorn fkd")

// sh -> (ʃ)
// h -> (h)
// s -> (s / z)
// ss -> (s)
// ch -> (k,tʃ)
// ng -> (ng,n‿ɡ,ŋ)
// j -> (j)
// k -> (k)
// c -> (s,k)

