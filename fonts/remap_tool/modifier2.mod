
# remove strange unuseful chars notdef, null, nonmarkingreturn

D 0x10000
D 0x10001
D 0x10002

# Put everything aside
MB 0 0x5FFF 0x10000

###################################



###################################

# Put back remaining unused glyphs in a trash zone
MB 0x10000 0x15FFF 0x6000
