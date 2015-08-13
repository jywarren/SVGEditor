#SVGEditor
====

SVGEditor is a minimal d3-based SVG editor (duh) which installs into SVG `<path>` objects to make them editable. It directly copies changes into the SVG DOM, making a downloadable well-formed SVG. 

Or it least, it will, when it's complete!

Help out at https://github.com/jywarren/SVGEditor

Crude, early, proof-of-concept demo at https://jywarren.github.io/SVGEditor/examples/

====

##Notepad

* add a method to SVG paths called svg.Editor.getPoints() which generates an attribute containing JSON points
  * but SVG doesn't accept invalid attributes, so it'd be called <editor-points>
* a means to write the points back into the <d> attribute, like svg.Editor.setPoints()
* also a means for them to be manipulated, like svg.Editor.edit() 
* with pointer-draggable child rectangles which update their parent path's <d> attribute with parent.update()
* additional tools could be added like svg.Editor.rotate() and svg.Editor.scale() which also execute svg.setPoints()
* svg.Editor.Handle could also generate and manage svg.Editor.Guide(s)
  * which could scan the svg document for snapping targets
  * provide x and y axis alignment with hotkey modifiers
  * in svg.Editor.setMode('move'), accept keyboard input for distances and <enter> for creating new nodes
* svg.Editor.setMode('drag') would make the whole path draggable

