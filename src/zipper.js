"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.findPrevious = exports.findNext = exports.append = exports.prepend = exports.replace = exports.update = exports.goToLastChild = exports.goToFirstChild = exports.goToChild = exports.goToLastDecendant = exports.goToNextSiblingOfAncestor = exports.goPrevious = exports.goNext = exports.goRight = exports.goLeft = exports.goUp = exports.zipper = exports.tree = exports.value = exports.root = void 0;
var node_1 = require("./node");
function zipper(node) {
    return { node: node, path: [] };
}
exports.zipper = zipper;
function update(fn, _a) {
    var node = _a.node, path = _a.path;
    return { node: node_1.mapValue(fn, node), path: path };
}
exports.update = update;
function replace(value, zipper) {
    return update(function () { return value; }, zipper);
}
exports.replace = replace;
function tree(_a) {
    var node = _a.node;
    return node;
}
exports.tree = tree;
function value(_a) {
    var node = _a.node;
    return node.value;
}
exports.value = value;
function goUp(_a) {
    var node = _a.node, path = _a.path;
    var context = path[0], trail = path.slice(1);
    if (context) {
        var focus_1 = context.focus, left = context.left, right = context.right;
        var next = { value: focus_1, children: __spreadArrays(left, [node], right) };
        return { node: next, path: trail };
    }
    else {
        return undefined;
    }
}
exports.goUp = goUp;
function goLeft(_a) {
    var node = _a.node, path = _a.path;
    var context = path[0], trail = path.slice(1);
    if (context) {
        var focus_2 = context.focus, left = context.left, right = context.right;
        var _b = __spreadArrays(left).reverse(), nextNode = _b[0], rest = _b.slice(1);
        if (nextNode) {
            var nextContext = { focus: focus_2, left: __spreadArrays(rest).reverse(), right: __spreadArrays([node], right) };
            return { node: nextNode, path: __spreadArrays([nextContext], trail) };
        }
        else
            return undefined;
    }
    else
        return undefined;
}
exports.goLeft = goLeft;
function goRight(_a) {
    var node = _a.node, path = _a.path;
    var context = path[0], trail = path.slice(1);
    if (context) {
        var focus_3 = context.focus, left = context.left, right = context.right;
        var nextNode = right[0], rest = right.slice(1);
        if (nextNode) {
            var nextContext = { focus: focus_3, left: __spreadArrays(left, [node]), right: rest };
            return { node: nextNode, path: __spreadArrays([nextContext], trail) };
        }
        else
            return undefined;
    }
    else
        return undefined;
}
exports.goRight = goRight;
function goToChild(n, _a) {
    var node = _a.node, path = _a.path;
    var _b = indexSplit(n, node.children), focus = _b.focus, left = _b.left, right = _b.right;
    if (focus) {
        var context = { focus: node.value, left: left, right: right };
        return { node: focus, path: __spreadArrays([context], path) };
    }
    else
        return undefined;
}
exports.goToChild = goToChild;
function goToFirstChild(zipper) {
    return goToChild(0, zipper);
}
exports.goToFirstChild = goToFirstChild;
function goToLastChild(_a) {
    var node = _a.node, path = _a.path;
    return goToChild(node.children.length, { node: node, path: path });
}
exports.goToLastChild = goToLastChild;
function goToNextSiblingOfAncestor(zipper) {
    var ancestor = goUp(zipper);
    if (ancestor) {
        var sibling = goRight(ancestor);
        if (sibling)
            return sibling;
        else
            return goToNextSiblingOfAncestor(ancestor);
    }
    else
        return undefined;
}
exports.goToNextSiblingOfAncestor = goToNextSiblingOfAncestor;
function goToLastDecendant(zipper) {
    var child = goToLastChild(zipper);
    if (child)
        return goToLastDecendant(child);
    else
        return zipper;
}
exports.goToLastDecendant = goToLastDecendant;
function goNext(zipper) {
    return firstOf([goToFirstChild, goRight, goToNextSiblingOfAncestor], zipper);
}
exports.goNext = goNext;
function lastDecendantOfPreviousSibling(zipper) {
    var previous = goLeft(zipper);
    if (previous)
        return goToLastDecendant(previous);
    else
        return undefined;
}
function goPrevious(zipper) {
    return firstOf([lastDecendantOfPreviousSibling, goUp], zipper);
}
exports.goPrevious = goPrevious;
function firstOf(functions, zipper) {
    var fn = functions[0], rest = functions.slice(1);
    if (fn) {
        var step = fn(zipper);
        if (step)
            return step;
        else
            return firstOf(rest, zipper);
    }
    else
        return undefined;
}
function indexSplit(n, children) {
    var left = children.slice(0, n);
    var focus = children[n];
    var right = children.slice(n + 1);
    return { focus: focus, left: left, right: right };
}
function root(zipper) {
    if (zipper.path.length > 0) {
        var up = goUp(zipper);
        if (up)
            return root(up);
        else
            return undefined;
    }
    else
        return zipper;
}
exports.root = root;
function find(predicate, move, zipper) {
    var next = move(zipper);
    if (next) {
        if (predicate(value(next)))
            return next;
        else
            return find(predicate, move, next);
    }
    else
        return undefined;
}
function findNext(predicate, zipper) {
    return find(predicate, goNext, zipper);
}
exports.findNext = findNext;
function findPrevious(predicate, zipper) {
    return find(predicate, goPrevious, zipper);
}
exports.findPrevious = findPrevious;
function prepend(prepend, _a) {
    var node = _a.node, path = _a.path;
    var context = path[0], trail = path.slice(1);
    var newContext;
    if (context) {
        var focus_4 = context.focus, left = context.left, right = context.right;
        newContext = { focus: focus_4, left: __spreadArrays(left, [prepend]), right: right };
    }
    else
        newContext = { focus: node.value, left: [prepend], right: [] };
    return { node: node, path: __spreadArrays([newContext], trail) };
}
exports.prepend = prepend;
function append(append, _a) {
    var node = _a.node, path = _a.path;
    var context = path[0], trail = path.slice(1);
    var newContext;
    if (context) {
        var focus_5 = context.focus, left = context.left, right = context.right;
        newContext = { focus: focus_5, left: left, right: __spreadArrays([append], right) };
    }
    else
        newContext = { focus: node.value, left: [], right: [append] };
    path.push(context);
    return { node: node, path: __spreadArrays([newContext], trail) };
}
exports.append = append;
