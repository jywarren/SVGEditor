SVGEditor.Line = SVGEditor.Primitive.extend({

  init: function(_element, _svg) {

    this._super(_element, _svg);

    this.el = _element;
    var _line = this;
    _svg = _line.svg = _svg || d3.select('svg');

    _line.getPoints = function() {

      var _attributes = [['x1', 'y1'], ['x2', 'y2']],
          _linePoints = [];

      // use initial Path type start code
      var _code = "M";

      for (var _attributeIndex in _attributes) {

        var px = d3.select(_line.el).attr(_attributes[_attributeIndex][0]),
            py = d3.select(_line.el).attr(_attributes[_attributeIndex][1]);
    
        var _point = { command: _code,
                       points: [[px, py]] };

        // set subsequent points to Path Line command;
        // if this is a Polygon instead of a Polyline, the final point will close the poly
        _code = "L";

        _linePoints.push(_point);

      }
      return _linePoints;

    }


    _line.setPoints = function(_linePoints) {

      var x1 = _linePoints[0].points[0][0],
          y1 = _linePoints[0].points[0][1],
          x2 = _linePoints[1].points[0][0],
          y2 = _linePoints[1].points[0][1];

      d3.select(_line.el).attr("x1", x1)
                         .attr("y1", y1)
                         .attr("x2", x2)
                         .attr("y2", y2);
      
    }


    _line.Editor.updateBbox = function() {

      // do nothing; lines have no bboxes

    }

    _line.points = _line.getPoints();
    _line.Editor.initHandles();

  }

});
