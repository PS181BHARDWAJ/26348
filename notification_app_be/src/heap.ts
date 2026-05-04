export class MinHeap<T> {
  private readonly items: T[] = [];

  constructor(private readonly compare: (left: T, right: T) => number) {}

  get size(): number {
    return this.items.length;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  push(value: T): void {
    this.items.push(value);
    this.siftUp(this.items.length - 1);
  }

  replaceTop(value: T): void {
    if (this.items.length === 0) {
      this.items.push(value);
      return;
    }

    this.items[0] = value;
    this.siftDown(0);
  }

  toArray(): T[] {
    return [...this.items];
  }

  private siftUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.items[index], this.items[parentIndex]) >= 0) {
        break;
      }

      [this.items[index], this.items[parentIndex]] = [this.items[parentIndex], this.items[index]];
      index = parentIndex;
    }
  }

  private siftDown(index: number): void {
    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = index * 2 + 2;
      let smallestIndex = index;

      if (leftIndex < this.items.length && this.compare(this.items[leftIndex], this.items[smallestIndex]) < 0) {
        smallestIndex = leftIndex;
      }

      if (rightIndex < this.items.length && this.compare(this.items[rightIndex], this.items[smallestIndex]) < 0) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === index) {
        return;
      }

      [this.items[index], this.items[smallestIndex]] = [this.items[smallestIndex], this.items[index]];
      index = smallestIndex;
    }
  }
}
