import objectHash from "object-hash";

export class ObjectSet<T> {
  protected values: Record<string, T>;

  constructor(values: Array<T> = []) {
    this.values = {};
    values.forEach((value) => {
      this.values[this.getKey(value)] = value;
    });
  }

  getKey(value: T): string {
    return objectHash(value);
  }

  get size(): number {
    return this.length;
  }

  get length(): number {
    return Object.keys(this.values).length;
  }

  add(value: T): this {
    this.values[this.getKey(value)] = value;
    return this;
  }

  clear(): void {
    this.values = {};
  }

  delete(value: T): boolean {
    if (!this.has(value)) {
      return false;
    }
    delete this.values[this.getKey(value)];
    return true;
  }

  has(value: T): boolean {
    return Object.keys(this.values).includes(this.getKey(value));
  }

  [Symbol.iterator](): Iterator<T> {
    let pointer = 0;
    let items = Object.values(this.values);

    return {
      next(): IteratorResult<T> {
        if (pointer < items.length) {
          return {
            done: false,
            value: items[pointer++],
          };
        } else {
          return {
            done: true,
            value: null,
          };
        }
      },
    };
  }

  getValues(): Array<T> {
    return Object.values(this.values);
  }

  union(other: this): this {
    return new (<any>this.constructor)([...this, ...other]);
  }

  intersection(other: this): this {
    return new (<any>this.constructor)(
      this.getValues().filter((v) => other.has(v))
    );
  }

  difference(other: this): this {
    return new (<any>this.constructor)(
      this.getValues().filter((v) => !other.has(v))
    );
  }

  symmetricDifference(other: this): this {
    const union = this.union(other);
    const intersection = this.intersection(other);
    return new (<any>this.constructor)(
      union.getValues().filter((v) => !intersection.has(v))
    );
  }

  clone(): this {
    return new (<any>this.constructor)(this.getValues());
  }
}

export interface ObjectWithKey {
  getKey(): string;
}

export class ObjectWithKeySet<T extends ObjectWithKey> extends ObjectSet<T> {
  getKey(value: T): string {
    return value.getKey();
  }
}
