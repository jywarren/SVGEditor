SVGEditor.convert = function(_selector) {

    //svg.selectAll('path')
    var _paths = document.getElementsByTagName(_selector);
 
    for (var i = 0; i < _paths.length; i++) {

      var _path = new SVGEditor.Path(_paths[i]);
 
    }

}
