import { node, singleton } from '../node'
import * as Zipper from '../zipper'
import { type Zipper as Zip } from '../zipper'

const tree = node(1, [
  node(2, [ singleton(3), singleton(4) ]),
  singleton(5),
  node(6, [
    node(7, [
      singleton(8),
      node(9, [ singleton(10) ])
    ])
  ])
])
const zip = Zipper.zipper(tree)

describe('zipper', () => {
  it('sets location and path', () => {
    expect(zip.node).toEqual(tree)
    expect(zip.path).toEqual([])
  })
})

describe('update', () => {
  it('changes current node value', () => {
    const updated = Zipper.update(n => n + 99, zip)
    expect(Zipper.value(updated)).toEqual(100)
  })
})

describe('replace', () => {
  it('replace current node value', () => {
    const replaced = Zipper.replace(99, zip)
    expect(Zipper.value(replaced)).toEqual(99)
  })
})

describe('tree', () => {
  it('return current focus node', () => {
    expect(Zipper.tree(zip)).toEqual(tree)
  })
})

describe('value', () => {
  it('return value of current focus node', () => {
    expect(Zipper.value(zip)).toEqual(1)
  })
})

describe('goToFirstChild', () => {
  it('move focus to last child of current node', () => {
    const move = Zipper.goToFirstChild(zip)
    if (move) expect(Zipper.value(move)).toEqual(2)
  })
})

describe('goToChild', () => {
  it('move focus node to child by index', () => {
    const move = Zipper.goToChild(1, zip)
    if (move) expect(Zipper.value(move)).toEqual(5)
  })
})

describe('goRight', () => {
  it('move focus to right sibling of current', () => {
    const move = Zipper.goToChild(1, zip)
    if (move) {
      const right = Zipper.goRight(move)
      if (right) {
        expect(Zipper.value(right)).toEqual(6)
        const end = Zipper.goRight(right)
        expect(end).toBeUndefined
      }
      else fail()
    } else fail()
  })
})

describe('goLeft', () => {
  it('move focus to left sibling of current', () => {
    const move = Zipper.goToChild(1, zip)
    if (move) {
      const left = Zipper.goLeft(move)
      if (left) {
        expect(Zipper.value(left)).toEqual(2)
        const end = Zipper.goLeft(left)
        expect(end).toBeUndefined
      }
      else fail()
    } else fail()
  })
})

describe('goToLastChild', () => {
  it('move focus to last child of current node', () => {
    const move = Zipper.goToLastChild(zip)
    if (move) expect(Zipper.value(move)).toEqual(6)
    else fail()
  })
})

describe('goNext', () => {
  it('traverses breadth first along children, siblings and ancestors', () => {
    let subject: Zip<number> | undefined = zip
    const walked: Array<number> = []

    do {
      walked.push(Zipper.value(subject))
      subject = Zipper.goNext(subject)
    } while (subject)

    expect(walked).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})

describe('root', () => {
  it('move focus to root node', () => {
    const move = Zipper.goToFirstChild(zip)
    if (move) {
      const down = Zipper.goToFirstChild(move)
      if (down) {
        const root = Zipper.root(down)
        if (root) expect(Zipper.value(root)).toEqual(1)
        else fail()
      } else fail()
    } else fail()
  })
})

describe('prepend', () => {
  it('prepend to current focus node', () => {
    const child = Zipper.goToFirstChild(zip)
    if (child) {
      const added = Zipper.prepend(singleton(12), child)
      if (added) {
        // keeps focus
        expect(Zipper.value(added)).toEqual(2)
        const left = Zipper.goLeft(added)
        // added left, even if focus was firstChild
        if (left) expect(Zipper.value(left)).toEqual(12)
        else fail()
      } else fail()
    } else fail()
  })
})

describe('append', () => {
  it('append to current focus node', () => {
    const child = Zipper.goToLastChild(zip)
    if (child) {
      const added = Zipper.prepend(singleton(12), child)
      if (added) {
        // keeps focus
        expect(Zipper.value(added)).toEqual(6)
        const right = Zipper.goLeft(added)
        // added right, even if focus was lastChild
        if (right) expect(Zipper.value(right)).toEqual(12)
        else fail()
      } else fail()
    } else fail()
  })
})

describe('findNext', () => {
  it ('walks till right most node', () => {
    const even = (v: number) => { return (v % 2) === 0 }
    const walked = Zipper.findNext(even, zip)
    if (walked) {
      expect(Zipper.value(walked)).toEqual(2)
      const next = Zipper.findNext(even, walked)
      // continues bfs from focus
      if (next) expect(Zipper.value(next)).toEqual(4)
      else fail()
    } else fail()
  })
})

describe('goToLastDecendant', () => {
  it ('walk to furthest right child', () => {
    const move = Zipper.goToLastDecendant(zip)
    if (move) {
      expect(Zipper.value(move)).toEqual(10)
    }
    else fail()
  })
})

describe('remove', () => {
  it ('moves focus to right', () => {
    const move = Zipper.goToFirstChild(zip)
    if (move) {
      const removed = Zipper.remove(move)
      if (removed) expect(Zipper.value(removed)).toEqual(5)
      else fail()
    } else fail()
  })

  it ('moves focus to the left, when right is empty', () => {
    const move = Zipper.goToLastChild(zip)
    if (move) {
      const removed = Zipper.remove(move)
      if (removed) expect(Zipper.value(removed)).toEqual(5)
      else fail()
    } else fail()
  })

  it ('moves focus back up, without siblings', () => {
    const move = Zipper.goToLastDecendant(zip)
    if (move) {
      const removed = Zipper.remove(move)
      if (removed) expect(Zipper.value(removed)).toEqual(7)
      else fail()
    } else fail()
  })
})