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
declare function count<T>(tree: Node<T>): number;
export { Node, singleton, node, isLeaf, hasChildren, appendChild, prependChild, mapValue, replaceValue, foldl, foldr, count };
