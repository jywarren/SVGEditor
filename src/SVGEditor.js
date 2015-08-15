SVGEditor.convert = function(_selector) {

  _selector = _selector || "path";

  var _paths = d3.selectAll(_selector)[0]

  SVGEditor.init();

  for (var i = 0; i < _paths.length; i++) {

    var _path = new SVGEditor.Path(_paths[i]);

  }

}

// Sets up an environment, which gets us zooming and such
SVGEditor.init = function(_selector) {

  _selector = _selector || "svg";

  d3.select(_selector).on('click', function() {

    // looking for base clicks to trigger deselect
    console.log('clicked on svg el');

  });

  var svgContent = d3.select(_selector).html();

  d3.select(_selector).html('');

  d3.select(_selector).append("g")
                      .attr("class", "viewport");

  d3.select("svg g").html(svgContent);

}

SVGEditor.scale = function(scale, _selector) {

  d3.selectAll("g.viewport").attr("transform", "scale(" + scale + " " + scale + ")");

  d3.selectAll("path").each(function(_path) {
    // this doesn't work:
    //_path.Editor.scale(scale);
  });
  
}

SVGEditor.save = function(_selector) {

  _selector = _selector || "svg";

  d3.select('g.control').remove();

  var _svg = d3.select(_selector)[0][0].outerHTML;

  d3.select('body').append("div")
                   .attr("class", "save")
                   .style({ 
                     "position":   "absolute",
                     "top":        "20%",
                     "left":       "25%",
                     "background": "white",
                     "padding":    "30px",
                     "width":      "50%"
                   })
                   .append("p")
                   .html("Click to save your SVG:");

  var name = prompt('Name your image', 'svg-editor.svg');

  d3.select('div.save').append("p")
                       .attr("class", "btns")
                       .style({ 
                         "text-align": "center",
                       })
                       .append("a")
                       .style({ 
                         "background": "#ccc",
                         "padding":    "10px"
                       })
                       .attr("href", "data:image/svg+xml;utf8," + _svg)
                       .attr("download", name)
                       .html("Download");

  d3.select('div.save p.btns').append("a")
                         .style({ 
                           "background": "#eee",
                           "margin":     "0 10px",
                           "padding":    "10px"
                         })
                         .html("Close")
                         .on("click", function() {
                           d3.select('div.save')
                             .remove();
                         });

}
