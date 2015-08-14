SVGEditor.Path = Class.extend({

  init: function(_element,_svg) {

    this.el = _element;
    var _path = this;
 
    _svg = _svg || d3.select('svg');
  
    _path.Editor = {};

    /* add a control elements group */ 
    // check if it exists already, or unique id it for this path only
    _svg.append("g").attr("class", "control");


    // this could be integrated into getPoints(), if each handle is not activated by default
    _path.Editor.initHandles = function() {

      _path.Editor.handles = _path.points.map(function(cmd, j) {
        return new SVGEditor.Handle(_path, _svg, cmd, j);
      });
      
    }


    _path.Editor.updateBbox = function() {
 
      _path.bbox = _path.el.getBBox();

      if (typeof _path.bboxEl == "undefined") {

        _path.bboxEl = _svg.select("g.control").append("rect")
                                               .attr("class", "bbox")
                                               .attr("stroke", "#0ff")
                                               .attr("stroke-width", 1)
                                               .attr("fill", "none");

      }

      _path.bboxEl.attr("x", _path.bbox.x)
                  .attr("y", _path.bbox.y)
                  .attr("width", _path.bbox.width)
                  .attr("height", _path.bbox.height);

    }


    _path.getPoints = function() {

      // strip whitespace (replace with commas) and split on command letters
      // as apparently spaces and commas are interchangable in SVG???
      var _commandStrings = _path.el.attributes.d.nodeValue.replace(/\s?([A-Za-z])\s/g,"$1").replace(/,?\s+/g,',').split(/(?=[LMCQZSTZlmcqzstz])/);

      return _commandStrings.map(function(d){
    
        var _command = { command: d[0] ,
                         points: [] },
            pointsArray = d.slice(1, d.length).split(',');

        // skip Z commands, which just close a poly, but have no coords:
        if (_command.command.toUpperCase() != "Z") {
          for (var j = 0; j < pointsArray.length; j += 2) {
  
            _command.points.push([+pointsArray[j],+pointsArray[j+1]]);
  
          }
        }
    
        return _command;
    
      });
    }


    _path.setPoints = function(_points) {

      var d = "",
          _points = _points || _path.points;

      for (var i in _points) {

        var merged = [];
        merged = merged.concat.apply(merged, _points[i].points);
        d += _points[i].command + merged.join(',');

      }

      d3.select(_path.el).attr("d", d);
      
    }

    _path.Editor.updateBbox();
    _path.points = _path.getPoints();
    _path.Editor.initHandles();

  }

});
