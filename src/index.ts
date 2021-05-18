import objectHash from "object-hash";

export class ObjectSet<T> {
  private values: Record<string, T>;

  constructor(values: Array<T> = []) {
    this.values = {};
    values.forEach((value) => {
      this.values[objectHash(value)] = value;
    });
  }

  get size(): number {
    return Object.keys(this.values).length;
  }

  add(value: T): ObjectSet<T> {
    this.values[objectHash(value)] = value;
    return this;
  }

  clear(): void {
    this.values = {};
  }

  delete(value: T): boolean {
    if (!this.has(value)) {
      return false;
    }
    delete this.values[objectHash(value)];
    return true;
  }

  has(value: T): boolean {
    return Object.keys(this.values).includes(objectHash(value));
  }

  private index = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next(...args: [] | [undefined]): IteratorResult<T> {
    const arr = Object.values(this.values);
    return this.index < arr.length
      ? { value: arr[this.index++], done: false }
      : { value: undefined, done: true };
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }
}
