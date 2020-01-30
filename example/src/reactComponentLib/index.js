/* eslint-disable */
import React__default, { useState, createElement, Fragment, Component } from 'react';

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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".editor {\n  height: 100%;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  position: relative;\n  cursor: grab;\n  pointer-events: all;\n}\n\n.editor .editor__tree {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n}\n";
styleInject(css);

var css$1 = ".svg-layer {\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  overflow: inherit;\n}\n\n.svg-layer path {\n  pointer-events: all;\n}\n.svg-layer path:hover {\n  stroke-width: 5;\n}\n\n.svg-layer svg,\nsvg * {\n  pointer-events: none;\n  z-index: 10;\n}\n";
styleInject(css$1);

function SVGPath(_a) {
    var link = _a.link, stroke = _a.stroke, _b = _a.onClick, onClick = _b === void 0 ? function () { } : _b;
    var _c = useState(false), hover = _c[0], setHover = _c[1];
    var paths = link.paths;
    return (createElement(Fragment, null, paths &&
        paths.map(function (p) {
            return (createElement("path", { onClick: function () { return onClick(link); }, onMouseOver: function () { return setHover(true); }, onMouseOut: function () { return setHover(false); }, key: p, d: p, stroke: stroke, strokeWidth: hover ? '5' : '2', fill: "none" }));
        })));
}

var SVGLayer = /** @class */ (function (_super) {
    __extends(SVGLayer, _super);
    function SVGLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGLayer.prototype.render = function () {
        var _a = this.props, _b = _a.stroke, stroke = _b === void 0 ? 'black' : _b, style = _a.style, onPathClicked = _a.onPathClicked, links = _a.links;
        return (createElement("svg", { className: "svg-layer", style: style }, links &&
            links.map(function (link) {
                return (createElement(SVGPath, { key: link.to + link.from, link: link, stroke: stroke, onClick: onPathClicked }));
            })));
    };
    return SVGLayer;
}(Component));

var css$2 = ".tree {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n}\n\n.tree .tree__node-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.tree .tree__node-container .tree__node-container-node {\n  pointer-events: all;\n  margin: 30px;\n}\n";
styleInject(css$2);

function Tree(props) {
    var nodes = props.nodes, Node = props.Node, _a = props.headNode, headNode = _a === void 0 ? true : _a, _b = props.drawn, drawn = _b === void 0 ? {} : _b;
    var hasDrawn = function (id) {
        return Boolean(drawn[id]);
    };
    var setDrawn = function (id) {
        drawn[id] = true;
    };
    return (createElement("div", { className: "tree" }, nodes &&
        nodes
            .filter(function (node) { return !hasDrawn(node.id); })
            .map(function (node) {
            setDrawn(node.id);
            var children = node.children && node.children.filter(function (child) { return !hasDrawn(child.id); });
            return (node && (createElement("div", { key: node.id, id: headNode ? 'tree__node-head-node' : '', className: "tree__node-container" },
                createElement("div", { id: node.id, className: "tree__node-container-node" },
                    createElement(Node, __assign({}, node))),
                children && children.length !== 0 && (createElement(Tree, __assign({}, props, { nodes: children, headNode: false, drawn: drawn }))))));
        })));
}

function withDrag(WrappedComponent) {
    return /** @class */ (function (_super) {
        __extends(WithDragComponent, _super);
        function WithDragComponent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.state = {
                currentPosition: _this.props.currentPosition || { x: 0, y: 0 },
                lastDragPosition: undefined,
            };
            _this.onTranslate = function (xValue, yValue) {
                var currentPosition = _this.state.currentPosition;
                _this.setState({
                    currentPosition: {
                        x: currentPosition.x + xValue,
                        y: currentPosition.y + yValue,
                    },
                });
            };
            _this.onMouseDown = function (e) {
                if (e.nativeEvent.which === 1) {
                    var screenX_1 = e.screenX, screenY_1 = e.screenY;
                    _this.setState({
                        lastDragPosition: {
                            x: screenX_1,
                            y: screenY_1,
                        },
                    });
                }
            };
            _this.onMouseMove = function (e) {
                var _a = _this.state, lastDragPosition = _a.lastDragPosition, currentPosition = _a.currentPosition;
                var screenX = e.screenX, screenY = e.screenY;
                if (lastDragPosition) {
                    var deltaX = screenX - lastDragPosition.x;
                    var deltaY = screenY - lastDragPosition.y;
                    _this.setState({
                        currentPosition: {
                            x: currentPosition.x + deltaX,
                            y: currentPosition.y + deltaY,
                        },
                        lastDragPosition: { x: screenX, y: screenY },
                    });
                }
            };
            _this.onMouseUp = function () {
                _this.setState({
                    lastDragPosition: undefined,
                });
            };
            return _this;
        }
        WithDragComponent.prototype.componentDidUpdate = function (_prevProps, prevState) {
            if (this.state.lastDragPosition && !prevState.lastDragPosition) {
                //mouse
                document.addEventListener('mousemove', this.onMouseMove);
                document.addEventListener('mouseup', this.onMouseUp);
                //touch
                document.addEventListener('touchmove', this.onMouseMove);
                document.addEventListener('touchend', this.onMouseUp);
                document.addEventListener('touchcancel', this.onMouseUp);
            }
            else if (!this.state.lastDragPosition && prevState.lastDragPosition) {
                //mouse
                document.removeEventListener('mousemove', this.onMouseMove);
                document.removeEventListener('mouseup', this.onMouseUp);
                //touch
                document.removeEventListener('touchmove', this.onMouseMove);
                document.removeEventListener('touchend', this.onMouseUp);
                document.removeEventListener('touchcancel', this.onMouseUp);
            }
        };
        WithDragComponent.prototype.render = function () {
            return (React__default.createElement(WrappedComponent, __assign({ currentPosition: this.state.currentPosition }, this.props, { onTranslate: this.onTranslate, onDragContainerMouseDown: this.onMouseDown })));
        };
        return WithDragComponent;
    }(React__default.Component));
}

function getLinks(_a) {
    var nodes = _a.nodes, zoom = _a.zoom, container = _a.container;
    if (!nodes)
        return [];
    var drawn = {};
    var paths = [];
    var links = _getLinks({ nodes: nodes, paths: paths, zoom: zoom, drawn: drawn, container: container });
    return links;
}
function _getLinks(_a) {
    var nodes = _a.nodes, paths = _a.paths, zoom = _a.zoom, drawn = _a.drawn, container = _a.container;
    if (!nodes)
        return paths;
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (drawn[node.id])
            continue;
        else
            drawn[node.id] = true;
        var recursiveChildrenLinks = _getLinks({
            nodes: node.children,
            paths: paths,
            zoom: zoom,
            drawn: drawn,
            container: container,
        });
        paths = recursiveChildrenLinks ? __spreadArrays(recursiveChildrenLinks) : paths;
        paths = getLinksForThisNode({ node: node, paths: paths, zoom: zoom, container: container });
    }
    return paths;
}
function getLinksForThisNode(_a) {
    var node = _a.node, paths = _a.paths, zoom = _a.zoom, container = _a.container;
    var children = node.children;
    if (children) {
        var from = getPositionFrom(container, node.id, zoom);
        for (var j = 0; j < children.length; j++) {
            var subNode = children[j];
            var to = getPositionTo(container, subNode.id, zoom);
            var pathFunction = bezierStringFromTwoPoints;
            if (to && from) {
                if (isToHigherThanFrom({ p1: from, p2: to })) {
                    pathFunction = upLink;
                }
                var nextPaths = pathFunction({
                    p1: from,
                    p2: to,
                }, paths, subNode.id, //toId
                node.id);
                paths = nextPaths;
            }
        }
    }
    return paths;
}
function adjustParamsToScale(containerElem, element, scale) {
    var parentRect = containerElem.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    var adjust = function (x, y) {
        return (x - y) / scale;
    };
    return {
        left: adjust(elementRect.left, parentRect.left),
        top: adjust(elementRect.top, parentRect.top),
        bottom: adjust(elementRect.bottom, parentRect.top),
        right: adjust(elementRect.right, parentRect.left),
    };
}
function getPositionFrom(container, id, scale) {
    var element = document.getElementById(id);
    var containerElem = document.getElementById(container);
    if (!containerElem || !element)
        return;
    var rect = adjustParamsToScale(containerElem, element, scale);
    var width = Math.abs(rect.right - rect.left);
    var halfWidth = width / 2;
    return (rect && {
        x: rect.left + halfWidth,
        y: rect.bottom,
    });
}
function getPositionTo(container, id, scale) {
    var element = document.getElementById(id);
    var containerElem = document.getElementById(container);
    if (!containerElem || !element)
        return;
    var rect = adjustParamsToScale(containerElem, element, scale);
    var width = Math.abs(rect.right - rect.left);
    var halfWidth = width / 2;
    return (rect && {
        x: rect.left + halfWidth,
        y: rect.top,
    });
}
var withComma = function (_a) {
    var x = _a.x, y = _a.y;
    return x + "," + y;
};
var bezierString = function (_a) {
    var p1 = _a.p1, p2 = _a.p2, p3 = _a.p3, p4 = _a.p4;
    return "M" + withComma(p1) + "\n      C" + withComma(p2) + "\n      " + withComma(p3) + "\n      " + withComma(p4);
};
var bezierFromTwoPoints = function (_a) {
    var p1 = _a.p1, p2 = _a.p2;
    var minY = Math.min(p1.y, p2.y);
    var distY = Math.abs(p1.y - p2.y);
    var middleY = minY + distY / 2;
    var newP2Y = { y: middleY, x: p1.x };
    var newP3Y = { y: middleY, x: p2.x };
    return { p1: p1, p2: newP2Y, p3: newP3Y, p4: p2 };
};
var bezierStringFromTwoPoints = function (points, paths, toId, fromId) {
    var path = bezierString(bezierFromTwoPoints(points));
    if (path) {
        var newPath = {
            to: toId,
            from: fromId,
            paths: [path],
        };
        return __spreadArrays(paths, [newPath]);
    }
    else {
        return paths;
    }
};
var isToHigherThanFrom = function (_a) {
    var p1 = _a.p1, p2 = _a.p2;
    return p2.y < p1.y;
};
var upLink = function (_a, paths, toId, fromId) {
    var p1 = _a.p1, p2 = _a.p2;
    var isLeft = p1.x < p2.x;
    var pad = isLeft ? -45 : 45;
    var sweep = isLeft ? 1 : 0;
    var container = document.getElementById('editor');
    var cardSize = (container && (isLeft ? container.getBoundingClientRect().left : container.getBoundingClientRect().right)) || 0;
    /**
     * Need to create a component that will own a bunch of these links
     * and handle on hover to highlight them all and give it a key
     */
    var newPath = {
        to: toId,
        from: fromId,
        paths: [
            ["M " + p1.x + " " + p1.y, "A 45 45, 0, 0, " + sweep + ", " + (p1.x + pad) + " " + (p1.y + 45)].join(''),
            ["M " + (p1.x + pad) + " " + (p1.y + 45), "L " + cardSize + " " + (p1.y + 45)].join(''),
            ["M " + cardSize + " " + (p1.y + 45), "A 45 45, 0, 0, " + sweep + ", " + (cardSize + pad) + " " + p1.y].join(''),
            ["M " + (cardSize + pad) + " " + p1.y, "L " + (cardSize + pad) + " " + p2.y].join(''),
            ["M " + (cardSize + pad) + " " + p2.y, "A 45 45, 0, 0, " + sweep + ", " + cardSize + " " + (p2.y - 45)].join(''),
            ["M " + cardSize + " " + (p2.y - 45), "L " + (p2.x + pad) + " " + (p2.y - 45)].join(''),
            ["M " + (p2.x + pad) + " " + (p2.y - 45), "A 45 45, 0, 0, " + sweep + ", " + p2.x + " " + p2.y].join(''),
        ],
    };
    return __spreadArrays(paths, [newPath]);
};

var MIN_ZOOM = 0.01;
var MAX_ZOOM = 3;
var EDITOR_CONTAINER = 'editor-container-id';
var Editor = /** @class */ (function (_super) {
    __extends(Editor, _super);
    function Editor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            links: [],
            zoom: 1,
        };
        _this.onWindowResize = function () {
            _this.resetPaths();
        };
        _this.resetPaths = function () {
            var zoom = _this.state.zoom;
            var nodes = _this.props.nodes;
            var links = getLinks({
                nodes: nodes,
                zoom: zoom,
                container: EDITOR_CONTAINER,
            });
            _this.setState({
                links: links,
            });
        };
        _this.onZoom = function (value) {
            var zoom = _this.state.zoom;
            var nextZoom = zoom + value;
            _this.setState({
                zoom: nextZoom < MIN_ZOOM ? MIN_ZOOM : nextZoom > MAX_ZOOM ? MAX_ZOOM : nextZoom,
            });
        };
        return _this;
    }
    Editor.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.onWindowResize);
        this.resetPaths();
    };
    Editor.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.onWindowResize);
    };
    Editor.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.nodes !== prevProps.nodes) {
            this.resetPaths();
        }
    };
    Editor.prototype.render = function () {
        var _this = this;
        var _a = this.state, zoom = _a.zoom, links = _a.links;
        var _b = this.props, _c = _b.currentPosition, currentPosition = _c === void 0 ? { x: 0, y: 0 } : _c, onDragContainerMouseDown = _b.onDragContainerMouseDown, Node = _b.Node, onPathClicked = _b.onPathClicked;
        var x = currentPosition.x, y = currentPosition.y;
        return (createElement("div", { id: "editor", className: "editor", onMouseDown: onDragContainerMouseDown, onWheel: function (e) {
                // const x = e.deltaX;
                var y = e.deltaY / 1000;
                _this.onZoom(y);
            } },
            createElement(SVGLayer, { style: {
                    transform: "translate(" + x + "px, " + y + "px) scale(" + zoom + ")",
                }, onPathClicked: onPathClicked, links: links }),
            createElement("div", { id: EDITOR_CONTAINER, className: "editor__tree", style: {
                    transform: "translate(" + x + "px, " + y + "px) scale(" + zoom + ")",
                } },
                createElement(Tree, __assign({}, this.props, { Node: Node })))));
    };
    return Editor;
}(Component));
var Editor$1 = withDrag(Editor);

export { Editor$1 as Editor };
