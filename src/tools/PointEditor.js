SVGEditor.PointEditor = SVGEditor.Tool.extend({

  init: function() {

  },

  // add primitives
  add: function(_primitives) {

    _primitives.forEach(function(_primitive) {

      _primitive.Editor.handles.forEach(function(_handle) {

        var drag = d3.behavior.drag();

        drag.on("drag", function(d) {

          _handle.active = true;
 
          d3.select(this).attr("x", d3.event.x - _handle.width / 2)
                         .attr("y", d3.event.y - _handle.width / 2);
 
          // adjust parent point to match
          var x = d3.event.x,
              y = d3.event.y,
              _command = _primitive.points[_handle.index].command,
              _points = _primitive.points[_handle.index].points,
              _basePoints = _points[_points.length-1];
 
          // overwrite last point - base point
          _primitive.points[_handle.index].points[_points.length-1] = [x,y];
 
          var adjustRelative = function(_relativePoints) {
            return [ _relativePoints[0] + _handle.lastPoint.x, _relativePoints[1] + _handle.lastPoint.y ];
          }
 
          // adjust next point if it's relative
 
 
          if (_points.length > 1) {
 
            // DRY THIS UP & move it into SVGEditor.BezierHandle.js
 
            // update bezier handles
 
            // overwrite x1,y1 point
            var old = _handle.oldPoints.points[0];
            var bx = old[0] + d3.event.dx;
            var by = old[1] + d3.event.dy;
            _primitive.points[_handle.index].points[0] = [bx, by];
 
            // adjust for relative coords
            if (_handle.lastPoint && _cmd.toUpperCase() != _cmd) {
              bx += +_handle.lastPoint.x;
              by += +_handle.lastPoint.y;
            }
 
            if (_handle.x1El) {
              _handle.x1El.attr("cx", bx)
                          .attr("cy", by);
  
              _handle.x1Line.attr("x1", x)
                            .attr("y1", y)
                            .attr("x2", bx)
                            .attr("y2", by);
            }
  
            // overwrite x2,y2 point (and account for quadratics)
            if (_cmd.toUpperCase() != "Q") old = _handle.oldPoints.points[1],
            bx = old[0] + d3.event.dx,
            by = old[1] + d3.event.dy;
            if (_cmd.toUpperCase() != "Q") _primitive.points[_handle.index].points[1] = [bx, by];
 
            // adjust for relative coords
            if (_handle.lastPoint && _cmd.toUpperCase() != _cmd) {
              bx += +_handle.lastPoint.x;
              by += +_handle.lastPoint.y;
            }
 
            if (_handle.x1El) {
              _handle.x2El.attr("cx", bx)
                          .attr("cy", by);
             
              _handle.x2Line.attr("x1", x)
                            .attr("y1", y)
                            .attr("x2", bx)
                            .attr("y2", by);
            }
 
          }
 
          // if it's lower case, add relative offsets from last point
          if (_command.toLowerCase() == _command) {
            _primitive.points[_handle.index].points.map(adjustRelative);
          }
 
          _primitive.Editor.updateBbox();
          _primitive.setPoints(_primitive.points);
 
        });
 
        drag.on("dragend", function(d) {

          _handle.active = false;

        });
 
        drag.on("dragstart", function(d) {
          _handle.oldPoints = _primitive.points[_handle.index];
        });
 
        _handle.el.call(drag);
 
      });

    });

  }

});
