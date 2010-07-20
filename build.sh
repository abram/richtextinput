#!/bin/sh
cat src/richtext.js src/charrange.js src/formatter.js src/input.js src/upgradedinput.js > richtextinput.js

# Send to closure
#curl --data-urlencode "js_code@richtextinput.js" --data-urlencode "compilation_level=SIMPLE_OPTIMIZATIONS" --data-urlencode "output_format=text" --data-urlencode "output_info=compiled_code" http://closure-compiler.appspot.com/compile > richtextinput.min.js