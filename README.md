# tree-iteration

Contains methods for non-binary tree structure formation, manipulation, and Zipper-based navigation.

The package consists of two modules:

- **Node tree creation**: structurally create and transform trees from immutable nodes.
- **Zipper navigation**: navigate and edit a focused location using the Zipper algorithm.

## Installation

```sh
npm install tree-iteration
```

# Imports

Subpath imports are useful when you want to keep tree creation and zipper navigation visually separate in your code:

```ts
import { node, singleton } from 'tree-iteration/node'
import { zipper, goNext } from 'tree-iteration/zipper'
```

You can also import everything from the package root:

```ts
import { node, singleton, zipper, goNext } from 'tree-iteration'
```

## Node Tree formation

Use the `node` module when you want to build or transform the tree itself.

```ts
import {
  appendChild,
  count,
  foldl,
  node,
  singleton
} from 'tree-iteration/node'

const tree = node('root', [
  node('docs', [
    singleton('README.md'),
    singleton('API.md')
  ]),
  singleton('package.json')
])

const withLicense = appendChild(singleton('LICENSE'), tree)

const names = foldl((value, acc) => [...acc, value], [] as string[], withLicense)

console.log(count(withLicense)) // 6
console.log(names) // ['root', 'docs', 'README.md', 'API.md', 'package.json', 'LICENSE']
```

### Creating Nodes

```ts
import { node, singleton } from 'tree-iteration/node'

const leaf = singleton('README.md')
const parent = node('docs', [leaf])
```

- `singleton(value)` creates a leaf node with no children.
- `node(value, children)` creates a node with the given children.

### Transforming Nodes

```ts
import {
  appendChild,
  mapValue,
  prependChild,
  replaceValue,
  singleton
} from 'tree-iteration/node'

const original = singleton('draft')
const renamed = replaceValue('README.md', original)
const upper = mapValue(value => value.toUpperCase(), renamed)
const withIntro = prependChild(singleton('intro.md'), upper)
const withApi = appendChild(singleton('api.md'), withIntro)
```

Node helpers return new nodes instead of mutating the original node.

### Inspecting And Folding

```ts
import { count, foldl, foldr, hasChildren, isLeaf } from 'tree-iteration/node'

isLeaf(tree)
hasChildren(tree)
count(tree)

const preorder = foldl((value, acc) => [...acc, value], [] as string[], tree)
const reversePreorder = foldr((value, acc) => [...acc, value], [] as string[], tree)
```

- `foldl` walks the tree from left to right in pre-order.
- `foldr` visits the same tree in the reverse order.

## Zipper Navigation

Use the `zipper` module when you want to navigate a tree while keeping track of the current focus.

```ts
import { node, singleton } from 'tree-iteration/node'
import {
  goNext,
  goToFirstChild,
  goRight,
  tree,
  value,
  zipper
} from 'tree-iteration/zipper'

const source = node('root', [
  node('docs', [
    singleton('README.md'),
    singleton('API.md')
  ]),
  singleton('package.json')
])

const rootCursor = zipper(source)
const docs = goToFirstChild(rootCursor)
const packageJson = docs && goRight(docs)

if (packageJson) {
  console.log(value(packageJson)) // 'package.json'
}

let cursor = rootCursor
const walked: string[] = []

while (cursor) {
  walked.push(value(cursor))
  cursor = goNext(cursor)
}

console.log(walked) // ['root', 'docs', 'README.md', 'API.md', 'package.json']
console.log(tree(rootCursor)) // returns the focused node
```

### Creating A Zipper

```ts
import { zipper } from 'tree-iteration/zipper'

const cursor = zipper(tree)
```

A zipper stores:

- `node`: the node currently in focus.
- `path`: the contexts needed to move back to ancestors and rebuild the tree.

### Moving The Focus

```ts
import {
  goLeft,
  goNext,
  goPrevious,
  goRight,
  goToChild,
  goToFirstChild,
  goToLastChild,
  goToLastDecendant,
  goUp,
  root
} from 'tree-iteration/zipper'

const firstChild = goToFirstChild(cursor)
const secondChild = goToChild(1, cursor)
const lastChild = goToLastChild(cursor)
const parent = firstChild && goUp(firstChild)
const rightSibling = firstChild && goRight(firstChild)
const leftSibling = rightSibling && goLeft(rightSibling)
const next = goNext(cursor)
const previous = next && goPrevious(next)
const last = goToLastDecendant(cursor)
const backAtRoot = firstChild && root(firstChild)
```

Movement functions return `undefined` when the requested move is not possible.

`goNext` and `goPrevious` walk the tree in depth-first pre-order.

### Reading And Updating The Focus

```ts
import { replace, tree, update, value } from 'tree-iteration/zipper'

const currentValue = value(cursor)
const renamed = replace('README.md', cursor)
const upper = update(value => value.toUpperCase(), renamed)
const focusedNode = tree(upper)
```

- `value(zipper)` reads the value at the current focus.
- `tree(zipper)` returns the node at the current focus.
- `replace(value, zipper)` replaces the focused value.
- `update(fn, zipper)` maps the focused value.

### Searching

```ts
import { findNext, findPrevious } from 'tree-iteration/zipper'

const api = findNext(value => value === 'API.md', cursor)
const docs = api && findPrevious(value => value === 'docs', api)
```

### Editing Around The Focus

```ts
import { append, prepend, remove, root, tree } from 'tree-iteration/zipper'
import { singleton } from 'tree-iteration/node'

const withLeftSibling = prepend(singleton('CONTRIBUTING.md'), cursor)
const withRightSibling = append(singleton('CHANGELOG.md'), withLeftSibling)
const withoutFocus = remove(withRightSibling)
const rootCursor = withoutFocus && root(withoutFocus)
const updatedTree = rootCursor && tree(rootCursor)
```

- `prepend(node, zipper)` inserts a sibling to the left of the focus.
- `append(node, zipper)` inserts a sibling to the right of the focus.
- `remove(zipper)` removes the focused node and moves the focus to a nearby node.
