import { Node } from './node';
declare type Context<T> = {
    readonly focus: T;
    readonly left: Array<Node<T>>;
    readonly right: Array<Node<T>>;
};
declare type Zipper<T> = {
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
declare function goNext<T>(zipper: Zipper<T>): Zipper<T> | undefined;
declare function root<T>(zipper: Zipper<T>): Zipper<T> | undefined;
declare function findNext<T>(predicate: (p: T) => boolean, zipper: Zipper<T>): Zipper<T> | undefined;
declare function findPrevious<T>(predicate: (p: T) => boolean, zipper: Zipper<T>): Zipper<T> | undefined;
declare function prepend<T>(prepend: Node<T>, { node, path }: Zipper<T>): Zipper<T>;
declare function append<T>(append: Node<T>, { node, path }: Zipper<T>): Zipper<T>;
export { root, value, tree, zipper, goUp, goLeft, goRight, goNext, goToChild, goToFirstChild, goToLastChild, update, replace, prepend, append, findNext, findPrevious, Zipper };
