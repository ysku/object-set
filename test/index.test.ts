import { ObjectSet } from "../src"

class Item {
  name: string
  price: number

  constructor({ name, price }: { name: string, price: number }) {
    this.name = name
    this.price = price
  }

  toString(): string {
    return `${this.name} - ${this.price}`
  }

  isEqual(other: Item): boolean {
    return this.name === other.name && this.price === other.price
  }
}

test('constructor w/ duplication', () => {
  const set = new ObjectSet([
    new Item({ name: 'item1', price: 100 }),
    new Item({ name: 'item1', price: 100 }),
    new Item({ name: 'item2', price: 200 })
  ])
  expect(set.size).toBe(2)
})

test('constructor w/o duplication', () => {
  const set = new ObjectSet([
    new Item({ name: 'item1', price: 100 }),
    new Item({ name: 'item2', price: 200 })
  ])
  expect(set.size).toBe(2)
})

test('size', () => {
  const count = 10
  const values = []
  for (let i = 0; i < count; i++) {
    values.push(new Item({ name: `item${i}`, price: 100 }))
  }
  const set = new ObjectSet(values)
  expect(set.size).toBe(count)
})

test('add', () => {
  const set = new ObjectSet()
  expect(set.add(new Item({ name: 'item1', price: 100 }))).toBeTruthy()
  expect(set.size).toBe(1)
  expect(set.add(new Item({ name: 'item2', price: 200 }))).toBeTruthy()
  expect(set.size).toBe(2)
  expect(set.add(new Item({ name: 'item1', price: 100 }))).toBeTruthy()
  expect(set.size).toBe(2)
})

test('clear', () => {
  const set = new ObjectSet()
  expect(set.add(new Item({ name: 'item1', price: 100 }))).toBeTruthy()
  expect(set.size).toBe(1)
  set.clear()
  expect(set.size).toBe(0)
})

test('delete', () => {
  const set = new ObjectSet()
  expect(set.add(new Item({ name: 'item1', price: 100 }))).toBeTruthy()
  expect(set.size).toBe(1)
  expect(set.delete(new Item({ name: 'item1', price: 100 }))).toBe(true)
  expect(set.size).toBe(0)
  expect(set.delete(new Item({ name: 'item1', price: 100 }))).toBe(false)
})

test('has', () => {
  const set = new ObjectSet()
  expect(set.has(new Item({ name: 'item1', price: 100 }))).toBe(false)
  expect(set.add(new Item({ name: 'item1', price: 100 }))).toBeTruthy()
  expect(set.has(new Item({ name: 'item1', price: 100 }))).toBe(true)
})

test('toArray', () => {
  const item1 = new Item({ name: 'item1', price: 100 })
  const item2 = new Item({ name: 'item2', price: 200 })
  const item3 = new Item({ name: 'item3', price: 300 })
  const set = new ObjectSet([item1, item2, item3])
  const arr = [...set]
  expect(arr.length).toBe(3)
})
