SVGEditor.Primitive = Class.extend({

  init: function(_element, _svg) {

    this.el = _element;
    var _primitive = this;
 
    _primitive.svg = _svg || d3.select('svg');
    _svg = _primitive.svg;
  
    _primitive.Editor = {};

    /* add a control elements group */ 
    // check if it exists already, or unique id it for this path only
    _primitive.svg.select("g.viewport").append("g").attr("class", "control");


    // Need to standardize/abstract Handles to reference a standard upstream Object.points
    _primitive.Editor.initHandles = function() {

      _primitive.Editor.handles = _primitive.points.map(function(point, index) {
        return new SVGEditor.Handle(_primitive, point, index);
      });
      
    }

    _primitive.Editor.updateBbox = function() {
 
      _primitive.bbox = _primitive.el.getBBox();

      if (typeof _primitive.bboxEl == "undefined") {

        _primitive.bboxEl = _svg.select("g.control").append("rect")
                                               .attr("class", "bbox")
                                               .attr("stroke", "#0ff")
                                               .attr("stroke-width", 1)
                                               .attr("fill", "none");

      }

      _primitive.bboxEl.attr("x", _primitive.bbox.x)
                  .attr("y", _primitive.bbox.y)
                  .attr("width", _primitive.bbox.width)
                  .attr("height", _primitive.bbox.height);

    }

  }

});
