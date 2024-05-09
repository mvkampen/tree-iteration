export type Node<T> = {
    readonly value: T;
    readonly children: Array<Node<T>>;
};
export declare function singleton<T>(value: T): Node<T>;
export declare function node<T>(value: T, children: Array<Node<T>>): Node<T>;
export declare function isLeaf<T>({ children }: Node<T>): boolean;
export declare function hasChildren<T>({ children }: Node<T>): boolean;
export declare function appendChild<T>(child: Node<T>, { value, children }: Node<T>): Node<T>;
export declare function prependChild<T>(child: Node<T>, { value, children }: Node<T>): Node<T>;
export declare function mapValue<T>(fn: (v: T) => T, { value, children }: Node<T>): Node<T>;
export declare function replaceValue<T>(value: T, { children }: Node<T>): Node<T>;
export declare function foldr<T, U>(fn: (value: T, acc: U) => U, acc: U, seed: Node<T>): U;
export declare function foldl<T, U>(fn: (value: T, acc: U) => U, acc: U, seed: Node<T>): U;
export declare function foldStep<T, U>(fn: (value: T, acc: U) => U, acc: U, nodes: Array<Node<T>>, sets: Array<Array<Node<T>>>): U;
export declare function count<T>(tree: Node<T>): number;
