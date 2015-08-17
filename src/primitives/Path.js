SVGEditor.Path = SVGEditor.Primitive.extend({

  init: function(_element, _svg) {

    this._super(_element, _svg);

    this.el = _element;
    var _path = this;
    _svg = _path.svg = _svg || d3.select('svg');


    _path.getPoints = function() {

      // strip whitespace (replace with commas) and split on command letters
      // as apparently spaces and commas are interchangable in SVG???
      var _commandStrings = d3.select(_path.el).attr("d").replace(/\s?([A-Za-z])\s/g,"$1")
                                                         .replace(/(\d)-/g,"$1 -")
                                                         .replace(/(\d)\s+([A-Za-z])/g,"$1$2")
                                                         .replace(/,?\s+/g,',')
                                                         .split(/(?=[LMCQZSTZHVlmcqzstzhv])/);

      return _commandStrings.map(function(d){
    
        var _command = { command: d[0] ,
                         points: [] },
            pointsArray = d.slice(1, d.length).split(',');

        // skip Z commands, which just close a poly, but have no coords:
        if (_command.command.toUpperCase() != "Z") {

          if (_command.command.toUpperCase() == "H") {

            _command.points.push([+pointsArray[0], 0]);

          } else if (_command.command.toUpperCase() == "V") {

            _command.points.push([0, +pointsArray[0]]);

          } else {

            for (var _pointsArrayIndex = 0; _pointsArrayIndex < pointsArray.length; _pointsArrayIndex += 2) {
           
              _command.points.push([+pointsArray[_pointsArrayIndex], +pointsArray[_pointsArrayIndex+1]]);
           
            }

          }

        }
    
        return _command;
    
      });
    }


    _path.setPoints = function(_pathPoints) {

      var d = "",
          _pathPoints = _pathPoints || _path.points;

      for (var _pointIndex in _pathPoints) {

        var merged = [];
        merged = merged.concat.apply(merged, _pathPoints[_pointIndex].points);
        d += _pathPoints[_pointIndex].command + merged.join(',');

      }

      d3.select(_path.el).attr("d", d);
      
    }


    _path.destroy = function() {

      _path.el.remove();

      _path.points.map(function(_point) {
        _point.destroy();
      });

      _path.remove();

    }

    // kind of... primitive lol; know a better way? :
    if (!_path.isSubPrimitive) {
      _path.Editor.updateBbox();
      _path.points = _path.getPoints();
      _path.Editor.initHandles();
    }

  }

});
