import { ObjectSet } from "../src";

class MyItem {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const set1 = new ObjectSet([new MyItem("item1"), new MyItem("item2")]);
const set2 = new ObjectSet([new MyItem("item3")]);
const set3 = set1.union(set2);
set3.size; // => 3
