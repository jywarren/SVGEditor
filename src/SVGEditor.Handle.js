SVGEditor.Handle = Class.extend({

  elements: [],
  width: 7,

  init: function(_parent, _svg, _command, index) {

    var _last = _parent._lastPoint || false, // this'll need to be recalculated if any points are added or deleted
        _handle = this;

    _handle.index = index;

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
    
        if (_last && _cmd.toUpperCase() != _cmd) {
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
        _handle.elements.push(_handle.x1);
    
        _handle.x1Line = _svg.select("g.control").append("line")
                               .attr("class", "handle")
                               .attr("x1", x)
                               .attr("y1", y)
                               .attr("x2", x1)
                               .attr("y2", y1)
        _handle.elements.push(_handle.x1Line);
    
        _handle.x2 = _svg.select("g.control").append("circle")
                               .attr("class", "handle")
                               .attr("cx", x2)
                               .attr("cy", y2)
                               .attr("r", _handle.width / 2);
        _handle.elements.push(_handle.x2);
    
        _handle.x2Line = _svg.select("g.control").append("line")
                               .attr("class", "handle")
                               .attr("x1", x)
                               .attr("y1", y)
                               .attr("x2", x2)
                               .attr("y2", y2)
        _handle.elements.push(_handle.x2Line);

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

      _handle.elements.push(_handle.el);

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
                                d3.select(this).attr("stroke", "#f0f");
                              })
                              .on("mouseout", function() {
                                d3.select(this).attr("stroke", "#0ff");
                              });

      // drag events:

      var drag = d3.behavior.drag();

      drag.on("drag", function(d) {

        d3.select(this).attr("x", d3.event.x - _handle.width / 2)
                       .attr("y", d3.event.y - _handle.width / 2);

        // adjust parent point to match
        var x = d3.event.x,
            y = d3.event.y,
            _command = _parent.points[_handle.index].command,
            _points = _parent.points[_handle.index].points,
            _basePoints = _points[_points.length-1];

        // overwrite last point - base point
        _parent.points[_handle.index].points[_points.length-1] = [x,y];

        var adjustRelative = function(points) {
          return [ points[0] + _last[0], points[1] + _last[1] ];
        }

        if (_points.length > 1) {

          // DRY THIS UP & move it into SVGEditor.BezierHandle.js

          // update bezier handles

          // overwrite x1,y1 point
          var old = _handle.oldPoints.points[0];
          var bx = old[0] + d3.event.dx;
          var by = old[1] + d3.event.dy;
          _parent.points[_handle.index].points[0] = [bx, by];

          // adjust for relative coords
          if (_last && _cmd.toUpperCase() != _cmd) {
            bx += +_last[0];
            by += +_last[1];
          }

          _handle.x1.attr("cx", bx)
                    .attr("cy", by);

          _handle.x1Line.attr("x1", x)
                        .attr("y1", y)
                        .attr("x2", bx)
                        .attr("y2", by);
 
          // overwrite x2,y2 point (and account for quadratics)
          if (_cmd.toUpperCase() != "Q") old = _handle.oldPoints.points[1],
          bx = old[0] + d3.event.dx,
          by = old[1] + d3.event.dy;
          if (_cmd.toUpperCase() != "Q") _parent.points[_handle.index].points[1] = [bx, by];

          // adjust for relative coords
          if (_last && _cmd.toUpperCase() != _cmd) {
            bx += +_last[0];
            by += +_last[1];
          }

          _handle.x2.attr("cx", bx)
                    .attr("cy", by);

          _handle.x2Line.attr("x1", x)
                        .attr("y1", y)
                        .attr("x2", bx)
                        .attr("y2", by);

        }

        // if it's lower case, add relative offsets from last point
        if (_command.toLowerCase() == _command) {
          _parent.points[_handle.index].points.map(adjustRelative);
        }

        _parent.Editor.updateBbox();
        _parent.setPoints(_parent.points);

      });

      drag.on("dragend", function(d) {
      });

      drag.on("dragstart", function(d) {
        _handle.oldPoints = _parent.points[_handle.index];
      });

      _handle.el.call(drag);

      // make whole object draggable? More complex than this. 
      // _svg.select(_parent).call(drag);

    }

    _handle.eventSetup();

    _handle.destroy = function() {

      _handle.elements.map(function(el) {

        el.remove();

      });

    }

    _handle.scale = function(scale) {

      var width = el.attr("width");
      var height = el.attr("height");

      _andle.el.attr("height", height/scale)
               .attr("width", width/scale);

    }

  }

});
