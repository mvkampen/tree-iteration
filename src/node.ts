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

export {
  Node, singleton, node,
  isLeaf, hasChildren,
  appendChild, prependChild,
  mapValue, replaceValue
}