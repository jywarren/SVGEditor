#SVGEditor
====

SVGEditor is a minimal JavaScript, d3-based SVG editor (duh) which installs into SVG `<path>`, `<line>`, and other objects to make them editable. It directly copies changes into the SVG DOM, making a downloadable well-formed SVG in the browser. 

Or it least, it will, when it's complete!

Help out at https://github.com/jywarren/SVGEditor

Crude, early, proof-of-concept demos at https://jywarren.github.io/SVGEditor/examples/

====

##Notepad

* additional tools could be added like `SVGEditor.Rotate` and `SVGEditor.Scale` which also execute `path.setPoints()`
* `SVGEditor.Handle` could also generate and manage `SVGEditor.Guide`
  * which could scan the svg document for snapping targets using svgeditor.snap()
  * provide x and y axis alignment with hotkey modifiers
  * in svg.Editor.setTool('Move'), accept keyboard input for distances and <enter> for creating new nodes
* svg.Editor.setTool('Drag') would make the whole path draggable

