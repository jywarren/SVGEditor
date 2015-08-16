SVGEditor = {};

/* From http://ejohn.org/blog/simple-javascript-inheritance/ */

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


SVGEditor.Environment = Class.extend({

  // Sets up an environment, which gets us zooming and such
  init: function(_selector) {

    _selector = _selector || "svg";

    d3.select(_selector).on('click', function() {

      // looking for base clicks to trigger deselect
      // but this'll involve allowing event to bubble up through objects
      console.log('clicked on svg el');

    });

    var svgContent = d3.select(_selector).html();

    d3.select(_selector).html('');

    d3.select(_selector).append("g")
                        .attr("class", "viewport");

    d3.select("g.viewport").append("g")
                           .attr("class", "content");

    d3.select("g.viewport").append("g")
                           .attr("class", "control");

    d3.select("g.content").html(svgContent);

    d3.selectAll('line,path,polyline').on('mouseover', function() { 
      d3.select(this).attr('orig-stroke-width', d3.select(this).attr('stroke-width'))
                     .style('stroke-width', 3);
    })
    .on('mouseout',  function() { 
      d3.select(this).style('stroke-width', d3.select(this).attr('orig-stroke-width'));
    });

  },

  // convert elements with given selector to SVGEditor primitives
  convert: function(_selector) {

    _selector = _selector || "path";
 
    var _paths = d3.selectAll(_selector)[0]
 
    var svgEditor = new SVGEditor.Environment();
 
    for (var i = 0; i < _paths.length; i++) {
 
      var _path = new SVGEditor.Path(_paths[i]);
 
    }

  },

  scale: function(scale, _selector) {

    d3.selectAll("g.viewport").attr("transform", "scale(" + scale + " " + scale + ")");
 
    d3.selectAll("path").each(function(_path) {
      // this doesn't work:
      //_path.Editor.scale(scale);
    });
  
  },

  save: function(_selector) {

    _selector = _selector || "svg";
 
    d3.select('g.control').remove();
 
    var _svg = d3.select(_selector)[0][0].outerHTML;
 
    d3.select('body').append("div")
                     .attr("class", "save")
                     .style({ 
                       "position":   "absolute",
                       "top":        "20%",
                       "left":       "25%",
                       "background": "white",
                       "padding":    "30px",
                       "width":      "50%"
                     })
                     .append("p")
                     .html("Click to save your SVG:");
 
    var name = prompt('Name your image', 'svg-editor.svg');
 
    d3.select('div.save').append("p")
                         .attr("class", "btns")
                         .style({ 
                           "text-align": "center",
                         })
                         .append("a")
                         .style({ 
                           "background": "#ccc",
                           "padding":    "10px"
                         })
                         .attr("href", "data:image/svg+xml;utf8," + _svg)
                         .attr("download", name)
                         .html("Download");
 
    d3.select('div.save p.btns').append("a")
                           .style({ 
                             "background": "#eee",
                             "margin":     "0 10px",
                             "padding":    "10px"
                           })
                           .html("Close")
                           .on("click", function() {
                             d3.select('div.save')
                               .remove();
                           });

  }

});

SVGEditor.Handle = Class.extend({

  elements: [],
  width: 7,

  init: function(_parent, _command, index) {

    var _last = _parent._lastPoint || false, // this'll need to be recalculated if any points are added or deleted
        _handle = this,
        _svg = _parent.svg;

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
  
      // we should clean this up. Maybe it can be stored inside Handle 
      // and updated and bubbled down on getPoints 
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

SVGEditor.Primitive = Class.extend({

  init: function(_element, _svg) {

    this.el = _element;
    var _primitive = this;
 
    _primitive.svg = _svg || d3.select('svg');
    _svg = _primitive.svg;
  
    _primitive.Editor = {};

    /* add a control elements group */ 
    // check if it exists already, or unique id it for this path only
    _primitive.svg.select("g.viewport").append("g").attr("class", "control");


    // Need to standardize/abstract Handles to reference a standard upstream Object.points
    _primitive.Editor.initHandles = function() {

      _primitive.Editor.handles = _primitive.points.map(function(point, index) {
        return new SVGEditor.Handle(_primitive, point, index);
      });
      
    }

    _primitive.Editor.updateBbox = function() {
 
      _primitive.bbox = _primitive.el.getBBox();

      if (typeof _primitive.bboxEl == "undefined") {

        _primitive.bboxEl = _svg.select("g.control").append("rect")
                                               .attr("class", "bbox")
                                               .attr("stroke", "#0ff")
                                               .attr("stroke-width", 1)
                                               .attr("fill", "none");

      }

      _primitive.bboxEl.attr("x", _primitive.bbox.x)
                  .attr("y", _primitive.bbox.y)
                  .attr("width", _primitive.bbox.width)
                  .attr("height", _primitive.bbox.height);

    }

  }

});

SVGEditor.Line = SVGEditor.Primitive.extend({

  init: function(_element, _svg) {

    this._super(_element, _svg);

    this.el = _element;
    var _line = this;
    _svg = _line.svg = _svg || d3.select('svg');

    _line.getPoints = function() {

      var _attributes = [['x1', 'y1'], ['x2', 'y2']],
          _points = [];

      // use initial Path type start code
      var _code = "M";

      for (var i in _attributes) {

        var px = d3.select(_line.el).attr(_attributes[i][0]),
            py = d3.select(_line.el).attr(_attributes[i][1]);
    
        var _point = { command: _code,
                       points: [[px, py]] };

        // set subsequent points to Path Line command;
        // if this is a Polygon instead of a Polyline, the final point will close the poly
        _code = "L";

        _points.push(_point);

      }
      return _points;

    }


    _line.setPoints = function(_points) {

      var x1 = _points[0].points[0][0],
          y1 = _points[0].points[0][1],
          x2 = _points[1].points[0][0],
          y2 = _points[1].points[0][1];

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

SVGEditor.Path = SVGEditor.Primitive.extend({

  init: function(_element, _svg) {

    this._super(_element, _svg);

    this.el = _element;
    var _path = this;
    _svg = _path.svg = _svg || d3.select('svg');


    _path.getPoints = function() {

      // strip whitespace (replace with commas) and split on command letters
      // as apparently spaces and commas are interchangable in SVG???
      var _commandStrings = _path.el.attributes.d.nodeValue.replace(/\s?([A-Za-z])\s/g,"$1").replace(/,?\s+/g,',').split(/(?=[LMCQZSTZlmcqzstz])/);

      return _commandStrings.map(function(d){
    
        var _command = { command: d[0] ,
                         points: [] },
            pointsArray = d.slice(1, d.length).split(',');

        // skip Z commands, which just close a poly, but have no coords:
        if (_command.command.toUpperCase() != "Z") {
          for (var j = 0; j < pointsArray.length; j += 2) {
  
            _command.points.push([+pointsArray[j],+pointsArray[j+1]]);
  
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

    _path.Editor.updateBbox();
    _path.points = _path.getPoints();
    _path.Editor.initHandles();

  }

});

SVGEditor.Polyline = SVGEditor.Path.extend({

  init: function(_element, _svg) {

    this._super(_element, _svg);

    this.el = _element;
    var _polyline = this;
    _svg = _polyline.svg = _svg || d3.select('svg');


    // <polyline fill="none" stroke="#ED1C24" points="87.958,663.434 57.892,693.498 17.804,653.41 47.87,623.346 87.958,521.701                             
    _polyline.getPoints = function() {

      // strip whitespace (replace with commas) and split on command letters
      // as apparently spaces and commas are interchangable in SVG???
      var _points = d3.select(_polyline.el).attr("d").split(" ");

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
