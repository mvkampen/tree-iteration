import { mapValue, singleton } from './node';
export function zipper(node) {
    return { node: node, path: [] };
}
export function update(fn, { node, path }) {
    return { node: mapValue(fn, node), path };
}
export function replace(value, zipper) {
    return update(() => value, zipper);
}
export function tree({ node }) {
    return node;
}
export function value({ node }) {
    return node.value;
}
export function goUp({ node, path }) {
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
export function goLeft({ node, path }) {
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
export function goRight({ node, path }) {
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
export function goToChild(n, { node, path }) {
    const { focus, left, right } = indexSplit(n, node.children);
    if (focus) {
        const context = { focus: node.value, left, right };
        return { node: focus, path: [context, ...path] };
    }
    else
        return undefined;
}
export function goToFirstChild(zipper) {
    return goToChild(0, zipper);
}
export function goToLastChild({ node, path }) {
    return goToChild(node.children.length - 1, { node, path });
}
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
export function goToLastDecendant(zipper) {
    const child = goToLastChild(zipper);
    if (child)
        return goToLastDecendant(child);
    else
        return zipper;
}
export function goNext(zipper) {
    return firstOf([goToFirstChild, goRight, goToNextSiblingOfAncestor], zipper);
}
function lastDecendantOfPreviousSibling(zipper) {
    const previous = goLeft(zipper);
    if (previous)
        return goToLastDecendant(previous);
    else
        return undefined;
}
export function goPrevious(zipper) {
    return firstOf([lastDecendantOfPreviousSibling, goUp], zipper);
}
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
export function root(zipper) {
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
export function find(predicate, move, zipper) {
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
export function findNext(predicate, zipper) {
    return find(predicate, goNext, zipper);
}
export function findPrevious(predicate, zipper) {
    return find(predicate, goPrevious, zipper);
}
export function prepend(prepend, { node, path }) {
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
export function append(append, { node, path }) {
    const [context, ...trail] = path;
    let newContext;
    if (context) {
        const { focus, left, right } = context;
        newContext = { focus, left, right: [append, ...right] };
    }
    else
        newContext = { focus: node.value, left: [], right: [append] };
    return { node, path: [newContext, ...trail] };
}
export function remove({ path }) {
    const [context, ...trail] = path;
    if (context) {
        const { left, right } = context;
        if (right.length) {
            const [newFocus, ...newRight] = right;
            const newContext = { focus: newFocus.value, left, right: newRight };
            return { node: newFocus, path: [newContext, ...trail] };
        }
        else if (left.length) {
            const newFocus = left[left.length - 1];
            const newLeft = left.slice(0, -1);
            const newContext = { focus: newFocus.value, left: newLeft, right };
            return { node: newFocus, path: [newContext, ...trail] };
        }
        else {
            return { node: singleton(trail[0].focus), path: trail };
        }
    }
    return undefined;
}
//# sourceMappingURL=zipper.js.map