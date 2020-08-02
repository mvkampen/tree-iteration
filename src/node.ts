type Node<T> = { 
  readonly value: T,
  readonly children: Array<Node<T>>
}

function singleton<T> (value: T): Node<T> {
  return { value, children: [] }
}

function node<T> (value: T, children: Array<Node<T>>): Node<T> {
  return { value, children }
}

function isLeaf<T> ({ children }: Node<T>): boolean {
  return children.length == 0
}

function hasChildren<T> ({ children }: Node<T>) : boolean {
  return children.length > 0
}

function appendChild<T> (child: Node<T>, { value, children }: Node<T>) : Node<T> {
  return { value, children: [...children, child] }
}

function prependChild<T> (child: Node<T>, { value, children }: Node<T>) : Node<T> {
  return { value, children: [child, ...children] }
}

function mapValue<T> (
  fn: (v: T) => T,
  { value, children }: Node<T>
): Node<T> {
  return { value: fn(value), children }
}

function replaceValue<T> (value: T, { children }: Node<T>): Node<T> {
  return { value, children }
}

function foldr<T,U> (
  fn: (value: T, acc: U) => U,
  acc: U,
  seed: Node<T>
): U {
  const list = foldl((a: T, b: Array<T>) => [a, ...b], [], seed)
  return list.reduce((a, v) => fn(v, a), acc)
}

function foldl<T, U> (
  fn: (value: T, acc: U) => U,
  acc: U,
  seed: Node<T>
): U {

  return foldStep(fn, acc, [seed], [])
}

function foldStep<T, U> (
  fn: (value: T, acc: U) => U,
  acc: U,
  nodes: Array<Node<T>>,
  sets: Array<Array<Node<T>>>
): U {
  const [cursor, ...rest] = nodes
  if (cursor) {
    const { value, children } = cursor
    if (children.length > 0) return foldStep(fn, fn(value, acc), children, [rest, ...sets])
    else return foldStep(fn, fn(value, acc), rest, sets)
  }
  else if (sets.length > 0) {
    const [head , ...tails] = sets
    return foldStep(fn, acc, head, tails)
  }
  else return acc
}

function count<T> (tree: Node<T>): number {
  return foldl((_value, sum) => sum + 1, 0, tree)
}

export {
  Node, singleton, node,
  isLeaf, hasChildren,
  appendChild, prependChild,
  mapValue, replaceValue,
  foldl, foldr, count
}