SVGEditor.Path = Class.extend({

  init: function(_element,_svg) {

    this.el = _element;
    var _path = this;
 
    _svg = _svg || d3.select('svg');
 
    _path.bbox = _path.el.getBBox();
  
    _path.Editor = {};
  
    // strip whitespace (replace with commas) and split on command letters
    // as apparently spaces and commas are interchangable in SVG???
    _path.Editor.commandStrings = _path.el.attributes.d.nodeValue.replace(/\s?([A-Za-z])\s/g,"$1").replace(/,?\s+/g,',').split(/(?=[LMCQZSTZlmcqzstz])/);
    _path.Editor.commands = _path.Editor.commandStrings.map(function(d){
  
      var _command = { command: d[0] ,
                       points: [] },
          pointsArray = d.slice(1, d.length).split(',');
  
      for (var j = 0; j < pointsArray.length; j += 2) {

        _command.points.push([+pointsArray[j],+pointsArray[j+1]]);

      }
  
      return _command;
  
    });
  
    _svg.append("g").attr("class", "control");
  
    var _last;
    var width = 7;
  
    for (var j = 0; j < _path.Editor.commands.length; j++) {
  
      var _command = _path.Editor.commands[j],
          x = _command.points[_command.points.length-1][0],
          y = _command.points[_command.points.length-1][1],
          _cmd = _command.command;
  
      if (_cmd.toUpperCase() == "Z") {
  
        // connect to first point again
  
      } else {
  
        // converts relative positions (based on last point) to absolute
        if (j > 0 && _cmd.toUpperCase() != _cmd) {
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
    
          if (j > 0 && _cmd.toUpperCase() != _cmd) {
            x1 += +_last[0];
            y1 += +_last[1];
            x2 += +_last[0];
            y2 += +_last[1];
          }
          
          _svg.select("g.control").append("circle")
                                 .attr("class", "handle")
                                 .attr("cx", x1)
                                 .attr("cy", y1)
                                 .attr("r", width / 2);
    
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
                                 .attr("r", width / 2);
    
          _svg.select("g.control").append("line")
                                 .attr("class", "handle")
                                 .attr("x1", x)
                                 .attr("y1", y)
                                 .attr("x2", x2)
                                 .attr("y2", y2)
    
        }
  
        // store absolute positions for next relative
        _last = [x,y];
    
        _svg.select("g.control").append("rect")
                               .attr("class", "handle")
                               .attr("x", x - width / 2)
                               .attr("y", y - width / 2)
                               .attr("width", width)
                               .attr("height", width);
  
        _svg.select("g.control").append("rect")
                               .attr("class", "bbox")
                               .attr("x", _path.bbox.x)
                               .attr("y", _path.bbox.y)
                               .attr("width", _path.bbox.width)
                               .attr("height", _path.bbox.height);
    
      }
  
    }
 
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
 
    _svg.select("g.control").selectAll("rect,circle")
                            .on("mouseover", function() {
                              d3.select(this).attr("stroke", "#22f")
                                             .attr("stroke-width", 2);
                            })
                            .on("mouseout", function() {
                              d3.select(this).attr("stroke", "#888")
                                             .attr("stroke-width", 1);
                            });
  }

});
