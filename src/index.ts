export interface Identifiable {
  toString(): string;
}

export class ObjectSet<T extends Identifiable> {
  private values: Record<string, T>;

  constructor(values: Array<T> = []) {
    this.values = {};
    values.forEach((value) => {
      this.values[value.toString()] = value;
    });
  }

  get size(): number {
    return Object.keys(this.values).length;
  }

  add(value: T): ObjectSet<T> {
    this.values[value.toString()] = value;
    return this;
  }

  clear(): void {
    this.values = {};
  }

  delete(value: T): boolean {
    if (!this.has(value)) {
      return false;
    }
    delete this.values[value.toString()];
    return true;
  }

  has(value: T): boolean {
    return Object.keys(this.values).includes(value.toString());
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
