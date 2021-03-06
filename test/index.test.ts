import deepEqual from "deep-equal";
import objectHash from "object-hash";
import { sortBy } from "lodash";
import { ObjectSet, ObjectWithKeySet } from "../src";

class Item {
  name: string;
  price: number;

  constructor({ name, price }: { name: string; price: number }) {
    this.name = name;
    this.price = price;
  }

  toString(): string {
    return `${this.name} - ${this.price}`;
  }

  isEqual(other: Item): boolean {
    return this.name === other.name && this.price === other.price;
  }
}

describe("ObjectSet", () => {
  test("constructor w/ duplication", () => {
    const set = new ObjectSet([
      new Item({ name: "item1", price: 100 }),
      new Item({ name: "item1", price: 100 }),
      new Item({ name: "item2", price: 200 }),
    ]);
    expect(set.size).toBe(2);
  });

  test("constructor w/o duplication", () => {
    const set = new ObjectSet([
      new Item({ name: "item1", price: 100 }),
      new Item({ name: "item2", price: 200 }),
    ]);
    expect(set.size).toBe(2);
  });

  test("size", () => {
    const count = 10;
    const values = [];
    for (let i = 0; i < count; i++) {
      values.push(new Item({ name: `item${i}`, price: 100 }));
    }
    const set = new ObjectSet(values);
    expect(set.size).toBe(count);
  });

  test("add", () => {
    const set = new ObjectSet();
    expect(set.add(new Item({ name: "item1", price: 100 }))).toBeTruthy();
    expect(set.size).toBe(1);
    expect(set.add(new Item({ name: "item2", price: 200 }))).toBeTruthy();
    expect(set.size).toBe(2);
    expect(set.add(new Item({ name: "item1", price: 100 }))).toBeTruthy();
    expect(set.size).toBe(2);
  });

  test("clear", () => {
    const set = new ObjectSet();
    expect(set.add(new Item({ name: "item1", price: 100 }))).toBeTruthy();
    expect(set.size).toBe(1);
    set.clear();
    expect(set.size).toBe(0);
  });

  test("delete", () => {
    const set = new ObjectSet();
    expect(set.add(new Item({ name: "item1", price: 100 }))).toBeTruthy();
    expect(set.size).toBe(1);
    expect(set.delete(new Item({ name: "item1", price: 100 }))).toBe(true);
    expect(set.size).toBe(0);
    expect(set.delete(new Item({ name: "item1", price: 100 }))).toBe(false);
  });

  test("has", () => {
    const set = new ObjectSet();
    expect(set.has(new Item({ name: "item1", price: 100 }))).toBe(false);
    expect(set.add(new Item({ name: "item1", price: 100 }))).toBeTruthy();
    expect(set.has(new Item({ name: "item1", price: 100 }))).toBe(true);
  });

  test("toArray", () => {
    const item1 = new Item({ name: "item1", price: 100 });
    const item2 = new Item({ name: "item2", price: 200 });
    const item3 = new Item({ name: "item3", price: 300 });
    const set = new ObjectSet([item1, item2, item3]);
    const arr = [...set];
    expect(arr.length).toBe(3);
  });

  test("iterator", () => {
    const item1 = new Item({ name: "item1", price: 100 });
    const item2 = new Item({ name: "item2", price: 200 });
    const item3 = new Item({ name: "item3", price: 300 });
    const set = new ObjectSet([item1, item2, item3]);
    let counter = 0;
    for (const item of set) {
      counter++;
      expect(item).toBeTruthy();
    }
    expect(counter).toBe(3);

    counter = 0;
    for (const item of set) {
      counter++;
      expect(item).toBeTruthy();
    }
    expect(counter).toBe(3);
  });

  test("union", () => {
    const item1 = new Item({ name: "item1", price: 100 });
    const item2 = new Item({ name: "item2", price: 200 });
    const item3 = new Item({ name: "item3", price: 300 });
    const set1 = new ObjectSet([item1, item2, item3]);
    const item4 = new Item({ name: "item4", price: 400 });
    const item5 = new Item({ name: "item5", price: 500 });
    const set2 = new ObjectSet([item3, item4, item5]);
    expect(
      sortBy(set1.union(set2).getValues(), (obj) => objectHash(obj))
    ).toEqual(
      sortBy([item1, item2, item3, item4, item5], (obj) => objectHash(obj))
    );
  });

  test("intersection", () => {
    const item1 = new Item({ name: "item1", price: 100 });
    const item2 = new Item({ name: "item2", price: 200 });
    const item3 = new Item({ name: "item3", price: 300 });
    const set1 = new ObjectSet([item1, item2, item3]);
    const item4 = new Item({ name: "item4", price: 400 });
    const item5 = new Item({ name: "item5", price: 500 });
    const set2 = new ObjectSet([item3, item4, item5]);
    expect(
      sortBy(set1.intersection(set2).getValues(), (obj) => objectHash(obj))
    ).toEqual(sortBy([item3], (obj) => objectHash(obj)));
  });

  test("difference", () => {
    const item1 = new Item({ name: "item1", price: 100 });
    const item2 = new Item({ name: "item2", price: 200 });
    const item3 = new Item({ name: "item3", price: 300 });
    const set1 = new ObjectSet([item1, item2, item3]);
    const item4 = new Item({ name: "item4", price: 400 });
    const item5 = new Item({ name: "item5", price: 500 });
    const set2 = new ObjectSet([item3, item4, item5]);
    expect(
      sortBy(set1.difference(set2).getValues(), (obj) => objectHash(obj))
    ).toEqual(sortBy([item1, item2], (obj) => objectHash(obj)));
  });

  test("symmetricDifference", () => {
    const item1 = new Item({ name: "item1", price: 100 });
    const item2 = new Item({ name: "item2", price: 200 });
    const item3 = new Item({ name: "item3", price: 300 });
    const item4 = new Item({ name: "item4", price: 400 });
    const item5 = new Item({ name: "item5", price: 500 });
    const set1 = new ObjectSet([item1, item2, item3]);
    const set2 = new ObjectSet([item3, item4, item5]);
    expect(
      sortBy(set1.symmetricDifference(set2).getValues(), (obj) =>
        objectHash(obj)
      )
    ).toEqual(sortBy([item1, item2, item4, item5], (obj) => objectHash(obj)));
  });

  test("isSubset", () => {
    const item1 = new Item({ name: "item1", price: 100 });
    const item2 = new Item({ name: "item2", price: 200 });
    const item3 = new Item({ name: "item3", price: 300 });
    const item4 = new Item({ name: "item4", price: 400 });
    const item5 = new Item({ name: "item5", price: 500 });
    const set1 = new ObjectSet([item1, item2, item3]);
    const set2 = new ObjectSet([item1, item2, item3, item4, item5]);
    expect(set1.isSubset(set2)).toBe(true);
    expect(set2.isSubset(set1)).toBe(false);
  });

  test("isEqual", () => {
    const item1 = new Item({ name: "item1", price: 100 });
    const item2 = new Item({ name: "item2", price: 200 });
    const item3 = new Item({ name: "item3", price: 300 });
    const item4 = new Item({ name: "item4", price: 400 });
    const item5 = new Item({ name: "item5", price: 500 });
    const set1 = new ObjectSet([item1, item2, item3]);
    const set2 = new ObjectSet([item1, item2, item3]);
    const set3 = new ObjectSet([item3, item4, item5]);
    expect(set1.isEqual(set2)).toBe(true);
    expect(set2.isEqual(set3)).toBe(false);
  });

  test("clone", () => {
    const set = new ObjectSet([
      new Item({ name: "item1", price: 100 }),
      new Item({ name: "item1", price: 100 }),
      new Item({ name: "item2", price: 200 }),
    ]);
    expect(set.clone()).not.toBe(set);
    expect(set).toBeInstanceOf(ObjectSet);
  });

  test("hard private", () => {
    const item1 = new Item({ name: "item1", price: 100 });
    const item2 = new Item({ name: "item2", price: 200 });
    const set1 = new ObjectSet([item1, item2]);
    for (let item of set1) {
      console.debug(item);
    }
    const set2 = new ObjectSet([item1, item2]);
    expect(deepEqual(set1, set2)).toBeTruthy();
  });
});

class ItemWithKey extends Item {
  getKey(): string {
    return `${this.name}-${this.price}`;
  }
}

describe("ObjectWithKeySet", () => {
  test("constructor w/ duplication", () => {
    const set = new ObjectWithKeySet([
      new ItemWithKey({ name: "item1", price: 100 }),
      new ItemWithKey({ name: "item1", price: 100 }),
      new ItemWithKey({ name: "item2", price: 200 }),
    ]);
    expect(set.size).toBe(2);
  });

  test("constructor w/o duplication", () => {
    const set = new ObjectWithKeySet([
      new ItemWithKey({ name: "item1", price: 100 }),
      new ItemWithKey({ name: "item2", price: 200 }),
    ]);
    expect(set.size).toBe(2);
  });

  test("size", () => {
    const count = 10;
    const values = [];
    for (let i = 0; i < count; i++) {
      values.push(new ItemWithKey({ name: `item${i}`, price: 100 }));
    }
    const set = new ObjectWithKeySet(values);
    expect(set.size).toBe(count);
  });

  test("add", () => {
    const set = new ObjectWithKeySet();
    expect(
      set.add(new ItemWithKey({ name: "item1", price: 100 }))
    ).toBeTruthy();
    expect(set.size).toBe(1);
    expect(
      set.add(new ItemWithKey({ name: "item2", price: 200 }))
    ).toBeTruthy();
    expect(set.size).toBe(2);
    expect(
      set.add(new ItemWithKey({ name: "item1", price: 100 }))
    ).toBeTruthy();
    expect(set.size).toBe(2);
  });

  test("getByKey", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const item3 = new ItemWithKey({ name: "item1", price: 100 });
    const set = new ObjectWithKeySet([item1, item2, item3]);
    expect(set.getByKey(item1.getKey())).toEqual(item1);
    expect(set.getByKey("key")).toEqual(null);
  });

  test("clear", () => {
    const set = new ObjectWithKeySet();
    expect(
      set.add(new ItemWithKey({ name: "item1", price: 100 }))
    ).toBeTruthy();
    expect(set.size).toBe(1);
    set.clear();
    expect(set.size).toBe(0);
  });

  test("delete", () => {
    const set = new ObjectWithKeySet();
    expect(
      set.add(new ItemWithKey({ name: "item1", price: 100 }))
    ).toBeTruthy();
    expect(set.size).toBe(1);
    expect(set.delete(new ItemWithKey({ name: "item1", price: 100 }))).toBe(
      true
    );
    expect(set.size).toBe(0);
    expect(set.delete(new ItemWithKey({ name: "item1", price: 100 }))).toBe(
      false
    );
  });

  test("has", () => {
    const set = new ObjectWithKeySet();
    expect(set.has(new ItemWithKey({ name: "item1", price: 100 }))).toBe(false);
    expect(
      set.add(new ItemWithKey({ name: "item1", price: 100 }))
    ).toBeTruthy();
    expect(set.has(new ItemWithKey({ name: "item1", price: 100 }))).toBe(true);
  });

  test("toArray", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const item3 = new ItemWithKey({ name: "item3", price: 300 });
    const set = new ObjectWithKeySet([item1, item2, item3]);
    const arr = [...set];
    expect(arr.length).toBe(3);
  });

  test("iterator", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const item3 = new ItemWithKey({ name: "item3", price: 300 });
    const set = new ObjectWithKeySet([item1, item2, item3]);
    let counter = 0;
    for (const item of set) {
      counter++;
      expect(item).toBeTruthy();
    }
    expect(counter).toBe(3);

    counter = 0;
    for (const item of set) {
      counter++;
      expect(item).toBeTruthy();
    }
    expect(counter).toBe(3);
  });

  test("union", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const item3 = new ItemWithKey({ name: "item3", price: 300 });
    const set1 = new ObjectWithKeySet([item1, item2, item3]);
    const item4 = new ItemWithKey({ name: "item4", price: 400 });
    const item5 = new ItemWithKey({ name: "item5", price: 500 });
    const set2 = new ObjectWithKeySet([item3, item4, item5]);
    expect(
      sortBy(set1.union(set2).getValues(), (obj) => objectHash(obj))
    ).toEqual(
      sortBy([item1, item2, item3, item4, item5], (obj) => objectHash(obj))
    );
  });

  test("intersection", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const item3 = new ItemWithKey({ name: "item3", price: 300 });
    const set1 = new ObjectWithKeySet([item1, item2, item3]);
    const item4 = new ItemWithKey({ name: "item4", price: 400 });
    const item5 = new ItemWithKey({ name: "item5", price: 500 });
    const set2 = new ObjectWithKeySet([item3, item4, item5]);
    expect(
      sortBy(set1.intersection(set2).getValues(), (obj) => objectHash(obj))
    ).toEqual(sortBy([item3], (obj) => objectHash(obj)));
  });

  test("difference", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const item3 = new ItemWithKey({ name: "item3", price: 300 });
    const set1 = new ObjectWithKeySet([item1, item2, item3]);
    const item4 = new ItemWithKey({ name: "item4", price: 400 });
    const item5 = new ItemWithKey({ name: "item5", price: 500 });
    const set2 = new ObjectWithKeySet([item3, item4, item5]);
    expect(
      sortBy(set1.difference(set2).getValues(), (obj) => objectHash(obj))
    ).toEqual(sortBy([item1, item2], (obj) => objectHash(obj)));
  });

  test("symmetricDifference", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const item3 = new ItemWithKey({ name: "item3", price: 300 });
    const item4 = new ItemWithKey({ name: "item4", price: 400 });
    const item5 = new ItemWithKey({ name: "item5", price: 500 });
    const set1 = new ObjectWithKeySet([item1, item2, item3]);
    const set2 = new ObjectWithKeySet([item3, item4, item5]);
    expect(
      sortBy(set1.symmetricDifference(set2).getValues(), (obj) =>
        objectHash(obj)
      )
    ).toEqual(sortBy([item1, item2, item4, item5], (obj) => objectHash(obj)));
  });

  test("isSubset", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const item3 = new ItemWithKey({ name: "item3", price: 300 });
    const item4 = new ItemWithKey({ name: "item4", price: 400 });
    const item5 = new ItemWithKey({ name: "item5", price: 500 });
    const set1 = new ObjectWithKeySet([item1, item2, item3]);
    const set2 = new ObjectWithKeySet([item1, item2, item3, item4, item5]);
    expect(set1.isSubset(set2)).toBe(true);
    expect(set2.isSubset(set1)).toBe(false);
  });

  test("isEqual", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const item3 = new ItemWithKey({ name: "item3", price: 300 });
    const item4 = new ItemWithKey({ name: "item4", price: 400 });
    const item5 = new ItemWithKey({ name: "item5", price: 500 });
    const set1 = new ObjectWithKeySet([item1, item2, item3]);
    const set2 = new ObjectWithKeySet([item1, item2, item3]);
    const set3 = new ObjectWithKeySet([item3, item4, item5]);
    expect(set1.isEqual(set2)).toBe(true);
    expect(set2.isEqual(set3)).toBe(false);
  });

  test("clone", () => {
    const set = new ObjectWithKeySet([
      new ItemWithKey({ name: "item1", price: 100 }),
      new ItemWithKey({ name: "item1", price: 100 }),
      new ItemWithKey({ name: "item2", price: 200 }),
    ]);
    expect(set.clone()).not.toBe(set);
    expect(set).toBeInstanceOf(ObjectWithKeySet);
  });

  test("hard private", () => {
    const item1 = new ItemWithKey({ name: "item1", price: 100 });
    const item2 = new ItemWithKey({ name: "item2", price: 200 });
    const set1 = new ObjectWithKeySet([item1, item2]);
    for (let item of set1) {
      console.debug(item);
    }
    const set2 = new ObjectWithKeySet([item1, item2]);
    expect(deepEqual(set1, set2)).toBeTruthy();
  });
});
