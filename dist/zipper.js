"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPrevious = exports.findNext = exports.append = exports.prepend = exports.replace = exports.update = exports.goToLastChild = exports.goToFirstChild = exports.goToChild = exports.goToLastDecendant = exports.goToNextSiblingOfAncestor = exports.goPrevious = exports.goNext = exports.goRight = exports.goLeft = exports.goUp = exports.zipper = exports.tree = exports.value = exports.root = void 0;
const node_1 = require("./node");
function zipper(node) {
    return { node: node, path: [] };
}
exports.zipper = zipper;
function update(fn, { node, path }) {
    return { node: (0, node_1.mapValue)(fn, node), path };
}
exports.update = update;
function replace(value, zipper) {
    return update(() => value, zipper);
}
exports.replace = replace;
function tree({ node }) {
    return node;
}
exports.tree = tree;
function value({ node }) {
    return node.value;
}
exports.value = value;
function goUp({ node, path }) {
    const [context, ...trail] = path;
    if (context) {
        const { focus, left, right } = context;
        const next = { value: focus, children: [...left, node, ...right] };
        return { node: next, path: trail };
    }
    else {
        return undefined;
    }
}
exports.goUp = goUp;
function goLeft({ node, path }) {
    const [context, ...trail] = path;
    if (context) {
        const { focus, left, right } = context;
        const [nextNode, ...rest] = [...left].reverse();
        if (nextNode) {
            const nextContext = { focus, left: [...rest].reverse(), right: [node, ...right] };
            return { node: nextNode, path: [nextContext, ...trail] };
        }
        else
            return undefined;
    }
    else
        return undefined;
}
exports.goLeft = goLeft;
function goRight({ node, path }) {
    const [context, ...trail] = path;
    if (context) {
        const { focus, left, right } = context;
        const [nextNode, ...rest] = right;
        if (nextNode) {
            const nextContext = { focus, left: [...left, node], right: rest };
            return { node: nextNode, path: [nextContext, ...trail] };
        }
        else
            return undefined;
    }
    else
        return undefined;
}
exports.goRight = goRight;
function goToChild(n, { node, path }) {
    const { focus, left, right } = indexSplit(n, node.children);
    if (focus) {
        const context = { focus: node.value, left, right };
        return { node: focus, path: [context, ...path] };
    }
    else
        return undefined;
}
exports.goToChild = goToChild;
function goToFirstChild(zipper) {
    return goToChild(0, zipper);
}
exports.goToFirstChild = goToFirstChild;
function goToLastChild({ node, path }) {
    return goToChild(node.children.length, { node, path });
}
exports.goToLastChild = goToLastChild;
function goToNextSiblingOfAncestor(zipper) {
    const ancestor = goUp(zipper);
    if (ancestor) {
        const sibling = goRight(ancestor);
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
    const child = goToLastChild(zipper);
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
    const previous = goLeft(zipper);
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
    const [fn, ...rest] = functions;
    if (fn) {
        const step = fn(zipper);
        if (step)
            return step;
        else
            return firstOf(rest, zipper);
    }
    else
        return undefined;
}
function indexSplit(n, children) {
    const left = children.slice(0, n);
    const focus = children[n];
    const right = children.slice(n + 1);
    return { focus, left, right };
}
function root(zipper) {
    if (zipper.path.length > 0) {
        const up = goUp(zipper);
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
    const next = move(zipper);
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
function prepend(prepend, { node, path }) {
    const [context, ...trail] = path;
    let newContext;
    if (context) {
        const { focus, left, right } = context;
        newContext = { focus, left: [...left, prepend], right };
    }
    else
        newContext = { focus: node.value, left: [prepend], right: [] };
    return { node, path: [newContext, ...trail] };
}
exports.prepend = prepend;
function append(append, { node, path }) {
    const [context, ...trail] = path;
    let newContext;
    if (context) {
        const { focus, left, right } = context;
        newContext = { focus, left, right: [append, ...right] };
    }
    else
        newContext = { focus: node.value, left: [], right: [append] };
    path.push(context);
    return { node, path: [newContext, ...trail] };
}
exports.append = append;
//# sourceMappingURL=zipper.js.map