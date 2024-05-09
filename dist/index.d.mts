type Node<T> = {
    readonly value: T;
    readonly children: Array<Node<T>>;
};
declare function singleton<T>(value: T): Node<T>;
declare function node<T>(value: T, children: Array<Node<T>>): Node<T>;
declare function isLeaf<T>({ children }: Node<T>): boolean;
declare function hasChildren<T>({ children }: Node<T>): boolean;
declare function appendChild<T>(child: Node<T>, { value, children }: Node<T>): Node<T>;
declare function prependChild<T>(child: Node<T>, { value, children }: Node<T>): Node<T>;
declare function mapValue<T>(fn: (v: T) => T, { value, children }: Node<T>): Node<T>;
declare function replaceValue<T>(value: T, { children }: Node<T>): Node<T>;
declare function foldr<T, U>(fn: (value: T, acc: U) => U, acc: U, seed: Node<T>): U;
declare function foldl<T, U>(fn: (value: T, acc: U) => U, acc: U, seed: Node<T>): U;
declare function foldStep<T, U>(fn: (value: T, acc: U) => U, acc: U, nodes: Array<Node<T>>, sets: Array<Array<Node<T>>>): U;
declare function count<T>(tree: Node<T>): number;

type Context<T> = {
    readonly focus: T;
    readonly left: Array<Node<T>>;
    readonly right: Array<Node<T>>;
};
type Zipper<T> = {
    readonly node: Node<T>;
    readonly path: Array<Context<T>>;
};
declare function zipper<T>(node: Node<T>): Zipper<T>;
declare function update<T>(fn: (value: T) => T, { node, path }: Zipper<T>): Zipper<T>;
declare function replace<T>(value: T, zipper: Zipper<T>): Zipper<T>;
declare function tree<T>({ node }: Zipper<T>): Node<T>;
declare function value<T>({ node }: Zipper<T>): T;
declare function goUp<T>({ node, path }: Zipper<T>): Zipper<T> | undefined;
declare function goLeft<T>({ node, path }: Zipper<T>): Zipper<T> | undefined;
declare function goRight<T>({ node, path }: Zipper<T>): Zipper<T> | undefined;
declare function goToChild<T>(n: number, { node, path }: Zipper<T>): Zipper<T> | undefined;
declare function goToFirstChild<T>(zipper: Zipper<T>): Zipper<T> | undefined;
declare function goToLastChild<T>({ node, path }: Zipper<T>): Zipper<T> | undefined;
declare function goToLastDecendant<T>(zipper: Zipper<T>): Zipper<T>;
declare function goNext<T>(zipper: Zipper<T>): Zipper<T> | undefined;
declare function goPrevious<T>(zipper: Zipper<T>): Zipper<T> | undefined;
declare function root<T>(zipper: Zipper<T>): Zipper<T> | undefined;
declare function find<T>(predicate: (p: T) => boolean, move: (zipper: Zipper<T>) => Zipper<T> | undefined, zipper: Zipper<T>): Zipper<T> | undefined;
declare function findNext<T>(predicate: (p: T) => boolean, zipper: Zipper<T>): Zipper<T> | undefined;
declare function findPrevious<T>(predicate: (p: T) => boolean, zipper: Zipper<T>): Zipper<T> | undefined;
declare function prepend<T>(prepend: Node<T>, { node, path }: Zipper<T>): Zipper<T>;
declare function append<T>(append: Node<T>, { node, path }: Zipper<T>): Zipper<T>;
declare function remove<T>({ path }: Zipper<T>): Zipper<T> | undefined;

export { type Context, type Node, type Zipper, append, appendChild, count, find, findNext, findPrevious, foldStep, foldl, foldr, goLeft, goNext, goPrevious, goRight, goToChild, goToFirstChild, goToLastChild, goToLastDecendant, goUp, hasChildren, isLeaf, mapValue, node, prepend, prependChild, remove, replace, replaceValue, root, singleton, tree, update, value, zipper };
