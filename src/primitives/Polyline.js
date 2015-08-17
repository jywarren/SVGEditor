SVGEditor.Polyline = SVGEditor.Path.extend({

  init: function(_element, _svg) {

    this.isSubPrimitive = true;

    this._super(_element, _svg);

    this.el = _element;
    var _polyline = this;
    _svg = _polyline.svg = _svg || d3.select('svg');


    // <polyline fill="none" stroke="#ED1C24" points="87.958,663.434 57.892,693.498 17.804,653.41 47.87,623.346 87.958,521.701                             
    _polyline.getPoints = function() {

      // strip whitespace (replace with commas) and split on command letters
      // as apparently spaces and commas are interchangable in SVG???
      var _points = d3.select(_polyline.el).attr("points")
                                           .replace(/(\d)-/g,"$1 -")
                                           .replace(/,?\s+/g,',')
                                           .split(" ");

      // use initial Path type start code
      var _code = "M";

      return _points.map(function(p){
    
        var _point = { command: _code,
                       points: [p.split(',')] };

        // set subsequent points to Path Line command;
        // if this is a Polygon instead of a Polyline, the final point will close the poly
        _code = "L";

        return _point;

      });
    }


    _polyline.setPoints = function(_points) {

      var _attr = "",
          _points = _points || _polyline.points;

      for (var i in _points) {

        if (i > 0) _attr += " ";
        _attr += _points.points[0].join(',');

      }

      d3.select(_polyline.el).attr("points", _attr);
      
    }


    _polyline.Editor.updateBbox();
    _polyline.points = _polyline.getPoints();
    _polyline.Editor.initHandles();

  }

});
