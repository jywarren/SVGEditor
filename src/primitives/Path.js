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

            for (var j = 0; j < pointsArray.length; j += 2) {
           
              _command.points.push([+pointsArray[j], +pointsArray[j+1]]);
           
            }

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
