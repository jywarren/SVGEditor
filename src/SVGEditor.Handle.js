SVGEditor.Handle = Class.extend({

  init: function(_parent, _svg, _command, index) {

    var _last = _parent._lastPoint || false, // this'll need to be recalculated if any points are added or deleted
        _handle = this;

    _handle.index = index;
    _handle.width = 7;

    var _cmd = _command.command;

    //_handle.setBezierPoints = function() {

    //}
  
    if (_cmd.toUpperCase() == "Z") {
  
      // SVG command to connect to first point again; we may not need to do anything here
  
    } else {

      // last coord pair is our base point
      var x = _command.points[_command.points.length-1][0],
          y = _command.points[_command.points.length-1][1];
  
      // converts relative positions (based on last point) to absolute
      if (_last && _cmd.toUpperCase() != _cmd) {
        x += +_last[0];
        y += +_last[1];
      }

      // detect bezier
      if (_cmd.toUpperCase() == "C" || _cmd.toUpperCase() == "Q") {
  
        var x1 = _command.points[0][0],
            y1 = _command.points[0][1];
  
        if (_cmd.toUpperCase() == "Q") {
          var x2 = _command.points[0][0],
              y2 = _command.points[0][1];
        } else {
          var x2 = _command.points[1][0],
              y2 = _command.points[1][1];
        }
    
        if (_last > 0 && _cmd.toUpperCase() != _cmd) {
          x1 += +_last[0];
          y1 += +_last[1];
          x2 += +_last[0];
          y2 += +_last[1];
        }
        
        _handle.x1 = _svg.select("g.control").append("circle")
                               .attr("class", "handle")
                               .attr("cx", x1)
                               .attr("cy", y1)
                               .attr("r", _handle.width / 2);
    
        _handle.x1Line = _svg.select("g.control").append("line")
                               .attr("class", "handle")
                               .attr("x1", x)
                               .attr("y1", y)
                               .attr("x2", x1)
                               .attr("y2", y1)
    
        _handle.x2 = _svg.select("g.control").append("circle")
                               .attr("class", "handle")
                               .attr("cx", x2)
                               .attr("cy", y2)
                               .attr("r", _handle.width / 2);
    
        _handle.x2Line = _svg.select("g.control").append("line")
                               .attr("class", "handle")
                               .attr("x1", x)
                               .attr("y1", y)
                               .attr("x2", x2)
                               .attr("y2", y2)
    
      }
  
      // store absolute positions for next relative
      // we could use a select() to be cleaner,
      // but it might be more inefficient
      _parent._lastPoint = [x,y];

      // handle rect  
      _handle.el = _svg.select("g.control").append("rect")
                             .attr("class", "handle")
                             .attr("x", x - _handle.width / 2)
                             .attr("y", y - _handle.width / 2)
                             .attr("width", _handle.width)
                             .attr("height", _handle.width);

    }

    _handle.style = function() {

      _svg.select("g.control").selectAll("circle,line")
                              .attr("stroke", "#f0f")
                              .attr("stroke-width", 1)
                              .attr("fill", "rgba(255,255,255,0.25)");
  
      _svg.select("g.control").selectAll("rect.handle")
                              .attr("stroke", "#0ff")
                              .attr("stroke-width", 1)
                              .attr("fill", "rgba(255,255,255,0.25)");

    }

    _handle.style();

    _handle.eventSetup = function() {
  
      _svg.select("g.control").selectAll("rect,circle")
                              .on("mouseover", function() {
                                d3.select(this).attr("stroke", "#22f");
                              })
                              .on("mouseout", function() {
                                d3.select(this).attr("stroke", "#0ff")
                                               .attr("stroke-width", 1);
                              });

      // drag events:

      var drag = d3.behavior.drag();

      drag.on("drag", function(d) {

        d3.select(this).attr("x", d3.event.x)
                       .attr("y", d3.event.y);

        // adjust parent point to match
        var x = d3.event.x,
            y = d3.event.y,
            _command = _parent.points[_handle.index].command,
            _points = _parent.points[_handle.index].points,
            _basePoints = _points[_points.length-1];

        // overwrite last point - base point
        _parent.points[_handle.index].points[_points.length-1] = [x + _handle.width/2,
                                                                  y + _handle.width/2];

        var adjustRelative = function(points) {
          return [ points[0] += _last[0], points[1] += _last[1] ];
        }

        // if it's lower case, add relative offsets from last point
        if (_command.toLowerCase() == _command) {
          _parent.points[_handle.index].points.map(adjustRelative);
        }

        if (_points.length > 1) {

          // update bezier handles
          var dx = x - _handle.oldPoints.points[_points.length-1][0],
              dy = y - _handle.oldPoints.points[_points.length-1][1];

          // overwrite x1,y1 point
          var old1 = _handle.oldPoints.points[0];
          _parent.points[_handle.index].points[0] = [old1[0] + d3.event.dx,
                                                     old1[1] + d3.event.dy];
 
          // overwrite x2,y2 point
          var old2 = _handle.oldPoints.points[1];
          _parent.points[_handle.index].points[1] = [old2[0] + d3.event.dx,
                                                     old2[1] + d3.event.dy];

        }

        _parent.setPoints(_parent.points);

      });

      drag.on("dragend", function(d) {
        _parent.Editor.updateBbox();
      });

      drag.on("dragstart", function(d) {
        _handle.oldPoints = _parent.points[_handle.index];
      });

      _handle.el.call(drag);

      // make whole object draggable? More complex than this. 
      // _svg.select(_parent).call(drag);

    }

    _handle.eventSetup();

  }

});
