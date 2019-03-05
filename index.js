(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

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
            if (line.points.length <= 1)
                return;
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

    var Interaction = (function () {
        function Interaction(canvas, minimumStrokeLength) {
            if (minimumStrokeLength === void 0) { minimumStrokeLength = 5; }
            this.minimumStrokeLength = minimumStrokeLength;
            this.line = new Line();
            this.matchingLine = new Line();
            this.storedLines = [];
            this.isDrawing = false;
            this.interactionTimeout = null;
            canvas.addEventListener("touchstart", this.onTouchStart.bind(this));
            canvas.addEventListener("mousedown", this.onDown.bind(this));
            canvas.addEventListener("mousemove", this.onMove.bind(this));
            canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
            canvas.addEventListener("touchend", this.end.bind(this));
            canvas.addEventListener("mouseup", this.end.bind(this));
            canvas.addEventListener("mouseleave", this.end.bind(this));
            window.addEventListener("keypress", this.onKeyPress.bind(this));
        }
        Interaction.prototype.onDown = function (evt) {
            evt.preventDefault();
            this.start(evt.x, evt.y);
        };
        Interaction.prototype.onTouchStart = function (evt) {
            evt.preventDefault();
            var _a = evt.touches[0], clientX = _a.clientX, clientY = _a.clientY;
            this.start(clientX, clientY);
        };
        Interaction.prototype.onTouchMove = function (evt) {
            evt.preventDefault();
            var _a = evt.touches[0], clientX = _a.clientX, clientY = _a.clientY;
            this.move(clientX, clientY);
        };
        Interaction.prototype.onMove = function (evt) {
            evt.preventDefault();
            this.move(evt.x, evt.y);
        };
        Interaction.prototype.start = function (x, y) {
            var newPoint = new Vec2(x, y);
            this.line = new Line([newPoint]);
            this.isDrawing = true;
            this.startLongPressTimeout();
        };
        Interaction.prototype.move = function (x, y) {
            if (!this.isDrawing) {
                return;
            }
            var lastPoint = this.line.lastPoint;
            var newPoint = new Vec2(x, y);
            if (lastPoint && lastPoint.distance(newPoint) >= this.minimumStrokeLength) {
                this.startLongPressTimeout();
                this.line.points.push(newPoint);
            }
        };
        Interaction.prototype.end = function () {
            var _this = this;
            this.stopLongPressTimeout();
            if (this.storedLines.length > 0) {
                var scores = this.storedLines.map(function (referenceLine) {
                    return matcher(referenceLine, _this.line);
                });
                var mathingIndex = scores.indexOf(Math.min.apply(Math, __spread(scores)));
                this.matchingLine = this.storedLines[mathingIndex];
            }
            this.isDrawing = false;
        };
        Interaction.prototype.onKeyPress = function (evt) {
            if (evt.key !== "Enter") {
                return;
            }
            this.storeLine();
        };
        Interaction.prototype.storeLine = function () {
            this.storedLines.push(this.line);
        };
        Interaction.prototype.startLongPressTimeout = function () {
            this.stopLongPressTimeout();
            this.interactionTimeout = setTimeout(this.storeLine.bind(this), 1000);
        };
        Interaction.prototype.stopLongPressTimeout = function () {
            if (this.interactionTimeout) {
                clearTimeout(this.interactionTimeout);
            }
        };
        return Interaction;
    }());

    function start() {
        var canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        var resize = function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();
        var interaction = new Interaction(canvas);
        var lineRenderer = new LineRenderer(canvas);
        function render() {
            lineRenderer.clear();
            interaction.storedLines.forEach(function (line, i) {
                var padding = 10;
                var sampleSize = 50;
                var isMatching = interaction.matchingLine === line;
                lineRenderer.renderLine(line.normalized().scaled(50), {
                    position: new Vec2(padding + i * (sampleSize + padding), padding),
                    width: 2,
                    color: isMatching ? "#f00" : "#000"
                });
            });
            lineRenderer.renderLine(interaction.line);
            requestAnimationFrame(render);
        }
        render();
    }
    window.onload = start;

}));
