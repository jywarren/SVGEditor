SVGEditor.Handle = Class.extend({

  init: function(_parent, _svg, _command, index) {

    var _last = _parent._lastPoint || false, // this'll need to be recalculated if any points are added or deleted
        _handle = this;

    _handle.index = index;
    _handle.width = 7;

    var _cmd = _command.command;
  
    if (_cmd.toUpperCase() == "Z") {
  
      // connect to first point again; we may not need to do anything here
  
    } else {

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
        
        _svg.select("g.control").append("circle")
                               .attr("class", "handle")
                               .attr("cx", x1)
                               .attr("cy", y1)
                               .attr("r", _handle.width / 2);
    
        _svg.select("g.control").append("line")
                               .attr("class", "handle")
                               .attr("x1", x)
                               .attr("y1", y)
                               .attr("x2", x1)
                               .attr("y2", y1)
    
        _svg.select("g.control").append("circle")
                               .attr("class", "handle")
                               .attr("cx", x2)
                               .attr("cy", y2)
                               .attr("r", _handle.width / 2);
    
        _svg.select("g.control").append("line")
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
  
      _svg.select("g.control").selectAll("rect.bbox")
                              .attr("stroke", "#0ff")
                              .attr("stroke-width", 1)
                              .attr("fill", "none");

    }

    _handle.style();

    _handle.eventSetup = function() {
  
      _svg.select("g.control").selectAll("rect,circle")
                              .on("mouseover", function() {
                                d3.select(this).attr("stroke", "#22f")
                                               .attr("stroke-width", 2);
                              })
                              .on("mouseout", function() {
                                d3.select(this).attr("stroke", "#888")
                                               .attr("stroke-width", 1);
                              });

      // drag events:

      var drag = d3.behavior.drag();

      drag.on("drag", function(d) {

        d3.select(this).attr("x", d3.event.x)
                       .attr("y", d3.event.y);

        // adjust parent point to match
        var x = d3.event.x,
            y = d3.event.y;

        _parent.points[_handle.index].points[0] = [x + _handle.width/2,
                                                   y + _handle.width/2];

        // if it's lower case, add relative offsets from last point
        if (_parent.points[_handle.index].command.toLowerCase() == _parent.points[_handle.index].command) {
          _parent.points[_handle.index].points[0][0] += _last[0];
          _parent.points[_handle.index].points[0][1] += _last[1];
        }

        // convert to absolute; if not preferred, then we could use _last
        //_parent.points[_handle.index].command = _parent.points[_handle.index].command.toUpperCase();

        _parent.setPoints();

      });

      _handle.el.call(drag);

      // make whole object draggable? More complex than this. 
      // _svg.select(_parent).call(drag);

    }

    _handle.eventSetup();

  }

});
