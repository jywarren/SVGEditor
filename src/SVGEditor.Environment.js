SVGEditor.Environment = Class.extend({

  // Sets up an environment, which gets us zooming and such
  init: function(_selector) {

    _selector = _selector || "svg";

    d3.select(_selector).on('click', function() {

      // looking for base clicks to trigger deselect
      // but this'll involve allowing event to bubble up through objects
      console.log('clicked on svg el');

    });

    var svgContent = d3.select(_selector).html();

    d3.select(_selector).html('');

    d3.select(_selector).append("g")
                        .attr("class", "viewport");

    d3.select("g.viewport").append("g")
                           .attr("class", "content");

    d3.select("g.viewport").append("g")
                           .attr("class", "control");

    d3.select("g.content").html(svgContent);

    d3.selectAll('line,path,polyline').on('mouseover', function() { 
      d3.select(this).attr('orig-stroke-width', d3.select(this).attr('stroke-width'))
                     .style('stroke-width', 3);
    })
    .on('mouseout', function() { 
      d3.select(this).style('stroke-width', d3.select(this).attr('orig-stroke-width'));
    })
    .on('click', function() {
      console.log(typeof this);
    });

  },

  clickable: function() {

    d3.selectAll('line').each(function(e,i){
      console.log('line');
      new SVGEditor.Line(d3.select(this)[0][0]);
    });

    d3.selectAll('path').each(function(e,i){
      console.log('path');
      new SVGEditor.Path(d3.select(this)[0][0]);
    });

    d3.selectAll('polyline').each(function(e,i){
      console.log('polyline');
      // temporary until polygon is made based on polyline
      new SVGEditor.Polyline(d3.select(this)[0][0]);
    });

    d3.selectAll('polygon').each(function(e,i){
      console.log('polygon');
      // temporary until polygon is made based on polyline
      new SVGEditor.Polyline(d3.select(this)[0][0]);
    });

  },

  // convert elements with given selector to SVGEditor primitives
  convert: function(_selector) {

    _selector = _selector || "path";
 
    var _paths = d3.selectAll(_selector)[0]
 
    var svgEditor = new SVGEditor.Environment();
 
    for (var i = 0; i < _paths.length; i++) {
 
      var _path = new SVGEditor.Path(_paths[i]);
 
    }

  },

  scale: function(scale, _selector) {

    d3.selectAll("g.viewport").attr("transform", "scale(" + scale + " " + scale + ")");
 
    d3.selectAll("path").each(function(_path) {
      // this doesn't work:
      //_path.Editor.scale(scale);
    });
  
  },

  save: function(_selector) {

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

});
