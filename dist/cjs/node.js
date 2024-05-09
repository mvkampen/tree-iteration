"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.foldStep = exports.foldl = exports.foldr = exports.replaceValue = exports.mapValue = exports.prependChild = exports.appendChild = exports.hasChildren = exports.isLeaf = exports.node = exports.singleton = void 0;
function singleton(value) {
    return { value, children: [] };
}
exports.singleton = singleton;
function node(value, children) {
    return { value, children };
}
exports.node = node;
function isLeaf({ children }) {
    return children.length == 0;
}
exports.isLeaf = isLeaf;
function hasChildren({ children }) {
    return children.length > 0;
}
exports.hasChildren = hasChildren;
function appendChild(child, { value, children }) {
    return { value, children: [...children, child] };
}
exports.appendChild = appendChild;
function prependChild(child, { value, children }) {
    return { value, children: [child, ...children] };
}
exports.prependChild = prependChild;
function mapValue(fn, { value, children }) {
    return { value: fn(value), children };
}
exports.mapValue = mapValue;
function replaceValue(value, { children }) {
    return { value, children };
}
exports.replaceValue = replaceValue;
function foldr(fn, acc, seed) {
    const list = foldl((a, b) => [a, ...b], [], seed);
    return list.reduce((a, v) => fn(v, a), acc);
}
exports.foldr = foldr;
function foldl(fn, acc, seed) {
    return foldStep(fn, acc, [seed], []);
}
exports.foldl = foldl;
function foldStep(fn, acc, nodes, sets) {
    const [cursor, ...rest] = nodes;
    if (cursor) {
        const { value, children } = cursor;
        if (children.length > 0)
            return foldStep(fn, fn(value, acc), children, [rest, ...sets]);
        else
            return foldStep(fn, fn(value, acc), rest, sets);
    }
    else if (sets.length > 0) {
        const [head, ...tails] = sets;
        return foldStep(fn, acc, head, tails);
    }
    else
        return acc;
}
exports.foldStep = foldStep;
function count(tree) {
    return foldl((_value, sum) => sum + 1, 0, tree);
}
exports.count = count;
//# sourceMappingURL=node.js.map