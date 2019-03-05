(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var Vec2 = (function () {
        function Vec2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vec2.prototype.addScalar = function (scalar) { return new Vec2(this.x + scalar, this.y + scalar); };
        Vec2.prototype.subScalar = function (scalar) { return new Vec2(this.x - scalar, this.y - scalar); };
        Vec2.prototype.multiplyScalar = function (scalar) { return new Vec2(this.x * scalar, this.y * scalar); };
        Vec2.prototype.divideScalar = function (scalar) { return new Vec2(this.x / scalar, this.y / scalar); };
        Vec2.prototype.add = function (other) { return new Vec2(this.x + other.x, this.y + other.y); };
        Vec2.prototype.sub = function (other) { return new Vec2(this.x - other.x, this.y - other.y); };
        Vec2.prototype.multiply = function (other) { return new Vec2(this.x * other.x, this.y * other.y); };
        Vec2.prototype.divide = function (other) { return new Vec2(this.x / other.x, this.y / other.y); };
        Vec2.prototype.dot = function (other) { return this.x * other.x + this.y * other.y; };
        Vec2.prototype.distance = function (other) { return this.sub(other).length(); };
        Vec2.prototype.length = function () { return Math.sqrt(this.x * this.x + this.y * this.y); };
        Vec2.prototype.negate = function () { return new Vec2(-this.x, -this.y); };
        Vec2.prototype.normalized = function () {
            var length = this.length();
            return new Vec2(this.x / length, this.y / length);
        };
        return Vec2;
    }());

    var Line = (function () {
        function Line(points) {
            if (points === void 0) { points = []; }
            this.points = points;
        }
        Object.defineProperty(Line.prototype, "firstPoint", {
            get: function () {
                return this.points[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "lastPoint", {
            get: function () {
                return this.points[this.points.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "length", {
            get: function () {
                return this.points.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "segments", {
            get: function () {
                if (this.points.length <= 1) {
                    return [];
                }
                var result = [];
                for (var i = 0; i < this.points.length - 1; i++) {
                    var p1 = this.points[i];
                    var p2 = this.points[i + 1];
                    result.push(p2.sub(p1));
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.normalized = function () {
            var minPoint = new Vec2(Infinity, Infinity);
            var maxPoint = new Vec2(0, 0);
            this.points.forEach(function (p) {
                if (p.x < minPoint.x) {
                    minPoint.x = p.x;
                }
                if (p.y < minPoint.y) {
                    minPoint.y = p.y;
                }
                if (p.x > maxPoint.x) {
                    maxPoint.x = p.x;
                }
                if (p.y > maxPoint.y) {
                    maxPoint.y = p.y;
                }
            });
            var difference = maxPoint.sub(minPoint);
            var maxGap = Math.max(difference.x, difference.y);
            var normalizedPoints = this.points.map(function (_a) {
                var x = _a.x, y = _a.y;
                return new Vec2((x - minPoint.x) / maxGap, (y - minPoint.y) / maxGap);
            });
            return new Line(normalizedPoints);
        };
        Line.prototype.scaled = function (factor) {
            return new Line(this.points.map(function (p) { return p.multiplyScalar(factor); }));
        };
        return Line;
    }());

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var eventemitter3 = createCommonjsModule(function (module) {

    var has = Object.prototype.hasOwnProperty
      , prefix = '~';

    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @private
     */
    function Events() {}

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
      Events.prototype = Object.create(null);

      //
      // This hack is needed because the `__proto__` property is still inherited in
      // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
      //
      if (!new Events().__proto__) prefix = false;
    }

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @private
     */
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }

    /**
     * Add a listener for a given event.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} once Specify if the listener is a one-time listener.
     * @returns {EventEmitter}
     * @private
     */
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
      }

      var listener = new EE(fn, context || emitter, once)
        , evt = prefix ? prefix + event : event;

      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];

      return emitter;
    }

    /**
     * Clear event by name.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} evt The Event name.
     * @private
     */
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @public
     */
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @public
     */
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = []
        , events
        , name;

      if (this._eventsCount === 0) return names;

      for (name in (events = this._events)) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }

      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }

      return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Array} The registered listeners.
     * @public
     */
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event
        , handlers = this._events[evt];

      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];

      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }

      return ee;
    };

    /**
     * Return the number of listeners listening to a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Number} The number of listeners.
     * @public
     */
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event
        , listeners = this._events[evt];

      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return false;

      var listeners = this._events[evt]
        , len = arguments.length
        , args
        , i;

      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

        switch (len) {
          case 1: return listeners.fn.call(listeners.context), true;
          case 2: return listeners.fn.call(listeners.context, a1), true;
          case 3: return listeners.fn.call(listeners.context, a1, a2), true;
          case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }

        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length
          , j;

        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

          switch (len) {
            case 1: listeners[i].fn.call(listeners[i].context); break;
            case 2: listeners[i].fn.call(listeners[i].context, a1); break;
            case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
            case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
            default:
              if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                args[j - 1] = arguments[j];
              }

              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }

      return true;
    };

    /**
     * Add a listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;

      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }

      var listeners = this._events[evt];

      if (listeners.fn) {
        if (
          listeners.fn === fn &&
          (!once || listeners.once) &&
          (!context || listeners.context === context)
        ) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (
            listeners[i].fn !== fn ||
            (once && !listeners[i].once) ||
            (context && listeners[i].context !== context)
          ) {
            events.push(listeners[i]);
          }
        }

        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }

      return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;

      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }

      return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    //
    // Expose the prefix.
    //
    EventEmitter.prefixed = prefix;

    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;

    //
    // Expose the module.
    //
    {
      module.exports = EventEmitter;
    }
    });

    var DrawInteractionEvents;
    (function (DrawInteractionEvents) {
        DrawInteractionEvents["LINE_DRAWN"] = "LINE_DRAWN";
    })(DrawInteractionEvents || (DrawInteractionEvents = {}));
    var DrawInteraction = (function (_super) {
        __extends(DrawInteraction, _super);
        function DrawInteraction(canvas, minimumStrokeLength) {
            if (minimumStrokeLength === void 0) { minimumStrokeLength = 5; }
            var _this = _super.call(this) || this;
            _this.minimumStrokeLength = minimumStrokeLength;
            _this.line = new Line();
            _this.isDrawing = false;
            canvas.addEventListener("touchstart", _this.onTouchStart.bind(_this));
            canvas.addEventListener("mousedown", _this.onDown.bind(_this));
            canvas.addEventListener("mousemove", _this.onMove.bind(_this));
            canvas.addEventListener("touchmove", _this.onTouchMove.bind(_this));
            canvas.addEventListener("touchend", _this.end.bind(_this));
            canvas.addEventListener("mouseup", _this.end.bind(_this));
            canvas.addEventListener("mouseleave", _this.end.bind(_this));
            return _this;
        }
        DrawInteraction.prototype.clearLine = function () {
            this.line = new Line();
        };
        DrawInteraction.prototype.onDown = function (evt) {
            evt.preventDefault();
            this.start(evt.x, evt.y);
        };
        DrawInteraction.prototype.onTouchStart = function (evt) {
            evt.preventDefault();
            var _a = evt.touches[0], clientX = _a.clientX, clientY = _a.clientY;
            this.start(clientX, clientY);
        };
        DrawInteraction.prototype.onTouchMove = function (evt) {
            evt.preventDefault();
            var _a = evt.touches[0], clientX = _a.clientX, clientY = _a.clientY;
            this.move(clientX, clientY);
        };
        DrawInteraction.prototype.onMove = function (evt) {
            evt.preventDefault();
            this.move(evt.x, evt.y);
        };
        DrawInteraction.prototype.start = function (x, y) {
            this.clearLine();
            this.line.points.push(new Vec2(x, y));
            this.isDrawing = true;
        };
        DrawInteraction.prototype.move = function (x, y) {
            if (!this.isDrawing) {
                return;
            }
            var lastPoint = this.line.lastPoint;
            var newPoint = new Vec2(x, y);
            if (lastPoint && lastPoint.distance(newPoint) >= this.minimumStrokeLength) {
                this.line.points.push(newPoint);
            }
        };
        DrawInteraction.prototype.end = function () {
            this.emit(DrawInteractionEvents.LINE_DRAWN, this.line);
            this.isDrawing = false;
        };
        return DrawInteraction;
    }(eventemitter3));

    var LineRenderer = (function () {
        function LineRenderer(canvas) {
            this.canvas = canvas;
            this.height = 0;
            this.width = 0;
            var provisionalCtx = canvas.getContext("2d");
            if (provisionalCtx) {
                this.ctx = provisionalCtx;
            }
            else {
                throw new Error("2d context not found");
            }
            this.canvas.addEventListener("resize", this.onResize.bind(this));
            this.onResize();
        }
        LineRenderer.prototype.clear = function () {
            this.ctx.clearRect(0, 0, this.width, this.height);
        };
        LineRenderer.prototype.renderLine = function (line, options) {
            if (options === void 0) { options = {}; }
            if (line.points.length <= 1) {
                return;
            }
            var position = options.position || new Vec2();
            this.ctx.strokeStyle = options.color || "#000";
            this.ctx.fillStyle = options.color || "#000";
            this.ctx.lineWidth = options.width || 5;
            this.ctx.beginPath();
            var firstPoint = line.firstPoint.add(position);
            this.ctx.arc(firstPoint.x, firstPoint.y, this.ctx.lineWidth * 2, 0, 2 * Math.PI, false);
            this.ctx.fill();
            for (var i = 0; i < line.points.length - 1; i++) {
                var p1 = line.points[i].add(position);
                var p2 = line.points[i + 1].add(position);
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
            }
            this.ctx.stroke();
        };
        LineRenderer.prototype.onResize = function () {
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        };
        return LineRenderer;
    }());

    function matcher(line1, line2) {
        var l1 = line1.normalized().segments.map(function (s) { return s.normalized(); });
        var l2 = line2.normalized().segments.map(function (s) { return s.normalized(); });
        if (l1.length > l2.length) {
            var t = l1;
            l1 = l2;
            l2 = t;
        }
        var cost = 0;
        var costPerSegment = 1 / l1.length;
        l1.forEach(function (s1, i) {
            var l2Index = Math.floor(i * l2.length / l1.length);
            var s2 = l2[l2Index];
            var newCost = 1 - Math.abs(s1.dot(s2));
            cost += newCost * costPerSegment;
        });
        return cost;
    }

    var UI = (function () {
        function UI() {
            this.canvas = document.createElement("canvas");
            this.addButton = document.createElement("button");
            this.addButton.textContent = "+";
            this.removeButton = document.createElement("button");
            this.removeButton.textContent = "-";
            document.body.appendChild(this.canvas);
            document.body.appendChild(this.addButton);
            document.body.appendChild(this.removeButton);
            window.addEventListener("resize", this.resize.bind(this));
            this.resize();
        }
        UI.prototype.resize = function () {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        return UI;
    }());

    var Example = (function () {
        function Example() {
            this.ui = new UI();
            this.lineRenderer = new LineRenderer(this.ui.canvas);
            this.drawInteraction = new DrawInteraction(this.ui.canvas);
            this.sampledLines = [];
            this.matchingLine = null;
            var lineDrawEvent = DrawInteractionEvents.LINE_DRAWN;
            this.drawInteraction.on(lineDrawEvent, this.executeMatching.bind(this));
            this.ui.addButton.addEventListener("click", this.addSample.bind(this));
            this.ui.removeButton.addEventListener("click", this.removeSample.bind(this));
        }
        Example.prototype.render = function () {
            var _this = this;
            this.lineRenderer.clear();
            this.renderSamples();
            this.lineRenderer.renderLine(this.drawInteraction.line);
            requestAnimationFrame(function () { return _this.render(); });
        };
        Example.prototype.renderSamples = function () {
            var _this = this;
            var padding = 10;
            var size = 50;
            var totalSize = padding + size;
            var getXPosition = function (i) { return padding + i * totalSize; };
            this.sampledLines.forEach(function (line, i) {
                var sampleLine = line.normalized().scaled(size);
                var position = new Vec2(getXPosition(i), padding);
                var color = (_this.matchingLine === line) ? "#f00" : "#000";
                _this.lineRenderer.renderLine(sampleLine, { position: position, color: color, width: 2 });
            });
            this.ui.addButton.style.left = getXPosition(this.sampledLines.length) + "px";
            this.ui.removeButton.style.left = getXPosition(this.sampledLines.length + 1) + "px";
        };
        Example.prototype.executeMatching = function (line) {
            if (!this.sampledLines.length) {
                return;
            }
            var scores = this.sampledLines.map(function (sampleLine) { return matcher(sampleLine, line); });
            var mathingIndex = scores.indexOf(Math.min.apply(Math, __spread(scores)));
            this.matchingLine = this.sampledLines[mathingIndex];
        };
        Example.prototype.addSample = function () {
            var line = this.drawInteraction.line;
            if (!line || !line.points.length) {
                return;
            }
            this.sampledLines.push(line);
            this.drawInteraction.clearLine();
        };
        Example.prototype.removeSample = function () {
            if (!this.sampledLines.length) {
                return;
            }
            var indexToDelete = (this.matchingLine)
                ? this.sampledLines.indexOf(this.matchingLine)
                : this.sampledLines.length - 1;
            this.matchingLine = null;
            this.sampledLines.splice(indexToDelete, 1);
        };
        return Example;
    }());
    window.onload = function () {
        var example = new Example();
        example.render();
    };

}));
