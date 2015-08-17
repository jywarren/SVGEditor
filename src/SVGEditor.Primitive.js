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

      _primitive.Editor.handles = [];

      for (var i in _primitive.points) {

        _primitive.Editor.handles.push(new SVGEditor.Handle(_primitive, _primitive.points[i], i));

      }

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

    _primitive.nextPoint = function(index) {
      if (index == _primitive.points.length-1) return false;
      else return _primitive.points[index+1];
    }
 
    _primitive.lastPoint = function(index) {
      if (index == 0) return false;
      else return _primitive.points[index-1];
    }

    _primitive.nextHandle = function(index) {
      if (index == _primitive.Editor.handles.length-1) return false;
      else return _primitive.Editor.handles[index+1];
    }
 
    _primitive.lastHandle = function(index) {
      if (index == 0) return false;
      else return _primitive.Editor.handles[index-1];
    }

  },

});
