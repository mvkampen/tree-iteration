import { type Node, mapValue, singleton } from './node.js'

export type Context<T> = {
  readonly focus: T,
  readonly left: Array<Node<T>>,
  readonly right: Array<Node<T>>
}

export type Zipper<T> = {
  readonly node: Node<T>
  readonly path: Array<Context<T>>
}

export function zipper<T> (node: Node<T>): Zipper<T> {
  return { node: node, path: [] }
}

export function update<T> (fn: (value: T) => T, { node, path }: Zipper<T>): Zipper<T> {
  return { node: mapValue(fn, node), path }
}

export function replace<T> (value: T, zipper : Zipper<T>) : Zipper<T> {
  return update(() => value, zipper)
}

export function tree<T> ({ node }: Zipper<T>) : Node<T> {
  return node
}

export function value<T> ({ node }: Zipper<T>): T {
  return node.value
}

export function goUp<T> ({ node, path }: Zipper<T>): Zipper<T> | undefined {
  const [context, ...trail] = path

  if (context) {
    const { focus, left, right } = context
    const next = { value: focus, children: [...left, node, ...right] }
    return { node: next, path: trail }
  } else {
    return undefined
  }
}

export function goLeft<T> ({ node, path }: Zipper<T>): Zipper<T> | undefined {
  const [context, ...trail] = path

  if (context) {
    const { focus, left, right } = context
    const [nextNode, ...rest] = [...left].reverse()

    if (nextNode) {
      const nextContext = { focus, left: [...rest].reverse(), right: [node, ...right] }
      return { node: nextNode, path: [nextContext, ...trail] }
    } else return undefined
  } else return undefined
}

export function goRight<T> ({ node, path }: Zipper<T>): Zipper<T> | undefined {
  const [context, ...trail] = path

  if (context) {
    const { focus, left, right } = context
    const [nextNode, ...rest] = right

    if (nextNode) {
      const nextContext = { focus, left: [...left, node], right: rest }
      return { node: nextNode, path: [nextContext, ...trail] }
    } else return undefined
  } else return undefined
}

export function goToChild<T> (n: number, { node , path }: Zipper<T>): Zipper<T> | undefined {
  const { focus, left, right } = indexSplit(n, node.children)

  if (focus) {
    const context = { focus: node.value, left, right }
    return { node: focus, path: [context, ...path] }
  } else return undefined
}

export function goToFirstChild<T> (zipper: Zipper<T>): Zipper<T> | undefined {
  return goToChild(0, zipper)
}

export function goToLastChild<T> ({ node, path }: Zipper<T>): Zipper<T> | undefined {
  return goToChild(node.children.length - 1, { node, path })
}

function goToNextSiblingOfAncestor<T> (zipper: Zipper<T>): Zipper<T> | undefined {
  const ancestor = goUp(zipper)
  if (ancestor) {
    const sibling = goRight(ancestor)
    if (sibling) return sibling
    else return goToNextSiblingOfAncestor(ancestor)
  }
  else return undefined
}

export function goToLastDecendant<T> (zipper: Zipper<T>): Zipper<T> {
  const child = goToLastChild(zipper)
  if (child) return goToLastDecendant(child)
  else return zipper
}

export function goNext<T> (zipper: Zipper<T>): Zipper<T> | undefined {
  return firstOf([goToFirstChild, goRight, goToNextSiblingOfAncestor], zipper)
}

function lastDecendantOfPreviousSibling<T> (zipper: Zipper<T>): Zipper<T> | undefined {
  const previous = goLeft(zipper)
  if (previous) return goToLastDecendant(previous)
  else return undefined
}

export function goPrevious<T> (zipper: Zipper<T>): Zipper<T> | undefined {
  return firstOf([lastDecendantOfPreviousSibling, goUp], zipper)
}

function firstOf<T> (
  functions: Array<(zipper: Zipper<T>) => Zipper<T> | undefined>,
  zipper: Zipper<T>
  ): Zipper<T> | undefined {
  const [fn, ...rest] = functions

  if (fn) {
    const step = fn(zipper)
    if (step) return step
    else return firstOf(rest, zipper)
  } else return undefined
}

function indexSplit<T> (
  n: number,
  children: Array<Node<T>>
): {
  focus: Node<T>,
  left: Array<Node<T>>,
  right: Array<Node<T>>
} {
  const left = children.slice(0, n)
  const focus = children[n]
  const right = children.slice(n + 1)

  return { focus, left, right }
}

export function root<T> (zipper: Zipper<T>): Zipper<T> | undefined {
  if (zipper.path.length > 0) {
    const up = goUp(zipper)
    if (up) return root(up)
    else return undefined
  } else return zipper
}

export function find<T> (
  predicate: (p: T) => boolean,
  move: (zipper: Zipper<T>) => Zipper<T> | undefined,
  zipper: Zipper<T>
): Zipper<T> | undefined {
  const next = move(zipper)
  if (next) {
    if (predicate(value(next))) return next
    else return find(predicate, move, next)
  } else return undefined
}

export function findNext<T> (
 predicate: (p: T) => boolean,
 zipper: Zipper<T>
): Zipper<T> | undefined {
  return find(predicate, goNext, zipper)
}

export function findPrevious<T> (
  predicate: (p: T) => boolean,
  zipper: Zipper<T>
 ): Zipper<T> | undefined {
   return find(predicate, goPrevious, zipper)
 }

 export function prepend<T> (
  prepend: Node<T>,
  { node, path }: Zipper<T>
): Zipper<T> {
  const [context, ...trail] = path
  let newContext
  if (context) {
    const { focus, left, right } = context
    newContext = { focus, left: [...left, prepend], right }
  }
  else newContext = { focus: node.value, left: [prepend], right: [] }

  return { node, path: [newContext, ...trail] }
}

export function append<T> (
  append: Node<T>,
  { node, path }: Zipper<T>
): Zipper<T> {
  const [context, ...trail] = path
  let newContext
  if (context) {
    const { focus, left, right } = context
    newContext = { focus, left, right: [append, ...right] }
  }
  else newContext = { focus: node.value, left: [], right: [append] }

  return { node, path: [newContext, ...trail] }
}

export function remove<T> ({ path }: Zipper<T>):  Zipper<T> | undefined {
  const [context, ...trail] = path
  if (context) {
    const { left, right } = context
    if (right.length) {
      const [newFocus, ...newRight] = right
      const newContext = { focus: newFocus.value, left, right: newRight }

      return { node: newFocus, path: [newContext, ...trail] }
    } else if (left.length) {
      const newFocus = left[left.length - 1]
      const newLeft = left.slice(0, -1)
      const newContext = { focus: newFocus.value, left: newLeft, right }

      return { node: newFocus, path: [newContext, ...trail] }
    } else {
      return { node: singleton(trail[0].focus), path: trail }
    }
  }

  return undefined
}