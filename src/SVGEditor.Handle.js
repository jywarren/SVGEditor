SVGEditor.Handle = Class.extend({

  elements: [],
  width: 7,

  init: function(_parent, _command, index) {

    var _handle = this,
        _svg = _parent.svg;

    _handle.index = index;
    _handle.lastPoint = _parent.lastHandle(index) || false; // this'll need to be recalculated if any points are added or deleted

    var _cmd = _command.command;

    _handle.setPoints = function() {
  
      if (_cmd.toUpperCase() == "Z") {
    
        // SVG command to connect to first point again; we may not need to do anything here
    
      } else {
 
        // last coord pair is our base point
        _handle.x = _command.points[_command.points.length-1][0],
        _handle.y = _command.points[_command.points.length-1][1];
    
        // converts relative positions (based on last point) to absolute
        if (_handle.lastPoint && _cmd.toUpperCase() != _cmd) {
          _handle.x += _handle.lastPoint.x;
          _handle.y += _handle.lastPoint.y;
        }
 
        // detect bezier
        if (_cmd.toUpperCase() == "C" || _cmd.toUpperCase() == "Q") {
    
          _handle.x1 = _command.points[0][0];
          _handle.y1 = _command.points[0][1];
    
          if (_cmd.toUpperCase() == "Q") {
            _handle.x2 = _command.points[0][0];
            _handle.y2 = _command.points[0][1];
          } else {
            _handle.x2 = _command.points[1][0];
            _handle.y2 = _command.points[1][1];
          }
 
          // converts additional bezier points from relative to absolute 
          if (_handle.lastPoint && _cmd.toUpperCase() != _cmd) {
            _handle.x1 += +_handle.lastPoint.x;
            _handle.y1 += +_handle.lastPoint.y;
            _handle.x2 += +_handle.lastPoint.x;
            _handle.y2 += +_handle.lastPoint.y;
          }
          
          _handle.x1El = _svg.select("g.control").append("circle")
                                 .attr("class", "handle")
                                 .attr("cx", _handle.x1)
                                 .attr("cy", _handle.y1)
                                 .attr("r", _handle.width / 2);
          _handle.elements.push(_handle.x1El);
      
          _handle.x1Line = _svg.select("g.control").append("line")
                                 .attr("class", "handle")
                                 .attr("x1", _handle.x)
                                 .attr("y1", _handle.y)
                                 .attr("x2", _handle.x1)
                                 .attr("y2", _handle.y1)
          _handle.elements.push(_handle.x1Line);
      
          _handle.x2El = _svg.select("g.control").append("circle")
                                 .attr("class", "handle")
                                 .attr("cx", _handle.x2)
                                 .attr("cy", _handle.y2)
                                 .attr("r", _handle.width / 2);
          _handle.elements.push(_handle.x2El);
      
          _handle.x2Line = _svg.select("g.control").append("line")
                                 .attr("class", "handle")
                                 .attr("x1", _handle.x)
                                 .attr("y1", _handle.y)
                                 .attr("x2", _handle.x2)
                                 .attr("y2", _handle.y2)
          _handle.elements.push(_handle.x2Line);
 
        }
 
        // handle rect  
        _handle.el = _svg.select("g.control").append("rect")
                               .attr("class", "handle")
                               .attr("x", _handle.x - _handle.width / 2)
                               .attr("y", _handle.y - _handle.width / 2)
                               .attr("width", _handle.width)
                               .attr("height", _handle.width);
 
        _handle.elements.push(_handle.el);
 
      }

    }

    _handle.setPoints();

    _handle.style = function() {

      _svg.select("g.control").selectAll("circle,line")
                              .attr("stroke", "#f0f")
                              .attr("stroke-width", 1)
                              .attr("fill", "rgba(255,255,255,0.25)");
  
      _svg.select("g.control").selectAll("rect.handle")
                              .attr("stroke", "#0ff")
                              .attr("stroke-width", 1)
                              .attr("fill", "rgba(255,255,255,0.25)");

      // hovers make lines easier to click on 
      _svg.select("g.control").selectAll("rect,circle")
                              .on("mouseover", function() {
                                d3.select(this).attr("stroke", "#f0f");
                              })
                              .on("mouseout", function() {
                                d3.select(this).attr("stroke", "#0ff");
                              });

    }

    _handle.style();


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
