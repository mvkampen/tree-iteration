import * as Node from '../node'

const tree = Node.node(1, [
  Node.node(2, [ Node.singleton(3), Node.singleton(4) ]),
  Node.singleton(5),
  Node.node(6, [
    Node.node(7, [
      Node.singleton(8),
      Node.node(9, [ Node.singleton(10) ])
    ])
  ])
])

describe('singleton', () => {
  const object =  { x: 5 }
  const subject = Node.singleton(object)

  it ('can hold abstract value', () => {
    expect(subject.value).toStrictEqual(object)
  })

  it ('children are empty an empty collection', () => {
    expect(subject.children).toEqual([])
  })

})

describe('node', () => {
  const object =  { x: 5 }
  const children = [Node.singleton({ x: 7 })]

  const subject = Node.node(object, children)

  it ('can hold abstract value', () => {
    expect(subject.value).toStrictEqual(object)
  })

  it ('assign collection as children', () => {
    expect(subject.children).toStrictEqual(children)
  })
})

describe('isLeaf', () => {
  it ('checks for no children', () => {
    const leaf = Node.singleton(7)
    const node = Node.node(5, [leaf])

    expect(Node.isLeaf(leaf)).toBe(true)
    expect(Node.isLeaf(node)).toBe(false)
  })
})

describe('hasChildren', () => {
  it ('checks for any children', () => {
    const leaf = Node.singleton(7)
    const node = Node.node(5, [leaf])

    expect(Node.hasChildren(leaf)).toBe(false)
    expect(Node.hasChildren(node)).toBe(true)
  })
})

describe('prependChild', () => {
  const leaf = Node.singleton(3)
  const node = Node.node(7, [leaf])

  it ('returns different node, holding the same values', () => {
    const added = Node.prependChild(Node.singleton(4), node)

    expect(added).not.toEqual(node)
    expect(added.value).toEqual(node.value)
    expect(added.children[1]).toEqual(node.children[0])
  })

  it ('adds a child at start of collection', () => {
    const one = Node.prependChild(Node.singleton(2), node)
    const two = Node.prependChild(Node.singleton(1), one)

    expect(two.children.map(child => child.value)).toEqual([1,2,3])
  })
})

describe('appendChild', () => {
  const leaf = Node.singleton(3)
  const node = Node.node(7, [leaf])

  it ('returns a different node, holding the same values', () => {
    const added = Node.appendChild(Node.singleton(4), node)

    expect(added).not.toEqual(node)
    expect(added.value).toEqual(node.value)
    expect(added.children[0]).toEqual(node.children[0])
  })

  it ('adds a child at end of collection', () => {
    const one = Node.appendChild(Node.singleton(4), node)
    const two = Node.appendChild(Node.singleton(5), one)

    expect(two.children.map(child => child.value)).toEqual([3,4,5])
  })
})

describe( 'mapValue', () => {
  const node = Node.singleton(3)

  it('return new node with mapped value', () => {
    const mapped = Node.mapValue(n => n * n, node)

    expect(mapped).not.toEqual(node)
    expect(mapped.value).toEqual(3 * 3)
    expect(mapped.children).toEqual(node.children)
  })
})


describe( 'replaceValue', () => {
  const node = Node.singleton(3)

  it('return new node with mapped value', () => {
    const replaced = Node.replaceValue(4, node)

    expect(replaced).not.toEqual(node)
    expect(replaced.value).toEqual(4)
    expect(replaced.children).toEqual(node.children)
  })
})

describe('foldl', () => {
  it('resolve equation using a function pairing from the left', () => {
    expect(Node.foldl((v, acc) => [...acc, v], [0], tree)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(Node.foldl((v, acc) => v * acc, 1, tree)).toEqual(3628800)
  })
})

describe('foldr', () => {
  it('resolve equation using a function pairing from the right', () => {
    expect(Node.foldr((v, acc) => [...acc, v], [0], tree)).toEqual([0, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
    expect(Node.foldr((v, acc) => v * acc, 1, tree)).toEqual(3628800)
  })
})

describe('count', () => {
  it('sums up node count of tree', () => {
    expect(Node.count(tree)).toEqual(10)
  })
})