#SVGEditor
====

SVGEditor is a minimal d3-based SVG editor (duh) which installs into SVG `<path>` objects to make them editable. It directly copies changes into the SVG DOM, making a downloadable well-formed SVG. 

Or it least, it will, when it's complete!

Help out at https://github.com/jywarren/SVGEditor

Crude, early, proof-of-concept demo at https://jywarren.github.io/SVGEditor/examples/

====

##Notepad

* additional tools could be added like svg.Editor.rotate() and svg.Editor.scale() which also execute svg.setPoints()
* svg.Editor.Handle could also generate and manage svg.Editor.Guide(s)
  * which could scan the svg document for snapping targets
  * provide x and y axis alignment with hotkey modifiers
  * in svg.Editor.setMode('move'), accept keyboard input for distances and <enter> for creating new nodes
* svg.Editor.setMode('drag') would make the whole path draggable

