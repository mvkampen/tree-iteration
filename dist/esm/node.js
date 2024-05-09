export function singleton(value) {
    return { value, children: [] };
}
export function node(value, children) {
    return { value, children };
}
export function isLeaf({ children }) {
    return children.length == 0;
}
export function hasChildren({ children }) {
    return children.length > 0;
}
export function appendChild(child, { value, children }) {
    return { value, children: [...children, child] };
}
export function prependChild(child, { value, children }) {
    return { value, children: [child, ...children] };
}
export function mapValue(fn, { value, children }) {
    return { value: fn(value), children };
}
export function replaceValue(value, { children }) {
    return { value, children };
}
export function foldr(fn, acc, seed) {
    const list = foldl((a, b) => [a, ...b], [], seed);
    return list.reduce((a, v) => fn(v, a), acc);
}
export function foldl(fn, acc, seed) {
    return foldStep(fn, acc, [seed], []);
}
export function foldStep(fn, acc, nodes, sets) {
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
export function count(tree) {
    return foldl((_value, sum) => sum + 1, 0, tree);
}
//# sourceMappingURL=node.js.map