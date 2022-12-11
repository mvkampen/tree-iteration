"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.count = exports.foldr = exports.foldl = exports.replaceValue = exports.mapValue = exports.prependChild = exports.appendChild = exports.hasChildren = exports.isLeaf = exports.node = exports.singleton = void 0;
function singleton(value) {
    return { value: value, children: [] };
}
exports.singleton = singleton;
function node(value, children) {
    return { value: value, children: children };
}
exports.node = node;
function isLeaf(_a) {
    var children = _a.children;
    return children.length == 0;
}
exports.isLeaf = isLeaf;
function hasChildren(_a) {
    var children = _a.children;
    return children.length > 0;
}
exports.hasChildren = hasChildren;
function appendChild(child, _a) {
    var value = _a.value, children = _a.children;
    return { value: value, children: __spreadArrays(children, [child]) };
}
exports.appendChild = appendChild;
function prependChild(child, _a) {
    var value = _a.value, children = _a.children;
    return { value: value, children: __spreadArrays([child], children) };
}
exports.prependChild = prependChild;
function mapValue(fn, _a) {
    var value = _a.value, children = _a.children;
    return { value: fn(value), children: children };
}
exports.mapValue = mapValue;
function replaceValue(value, _a) {
    var children = _a.children;
    return { value: value, children: children };
}
exports.replaceValue = replaceValue;
function foldr(fn, acc, seed) {
    var list = foldl(function (a, b) { return __spreadArrays([a], b); }, [], seed);
    return list.reduce(function (a, v) { return fn(v, a); }, acc);
}
exports.foldr = foldr;
function foldl(fn, acc, seed) {
    return foldStep(fn, acc, [seed], []);
}
exports.foldl = foldl;
function foldStep(fn, acc, nodes, sets) {
    var cursor = nodes[0], rest = nodes.slice(1);
    if (cursor) {
        var value = cursor.value, children = cursor.children;
        if (children.length > 0)
            return foldStep(fn, fn(value, acc), children, __spreadArrays([rest], sets));
        else
            return foldStep(fn, fn(value, acc), rest, sets);
    }
    else if (sets.length > 0) {
        var head = sets[0], tails = sets.slice(1);
        return foldStep(fn, acc, head, tails);
    }
    else
        return acc;
}
function count(tree) {
    return foldl(function (_value, sum) { return sum + 1; }, 0, tree);
}
exports.count = count;
