class Queue<T> {
  private readonly queue: T[];

  public constructor(size: number) {
    this.queue = new Array(size);
  }

  public peek(): T {
    if (this.queue.length === 0) {
      return null;
    }

    return this.queue[0];
  }

  public add(item: T): void {
    this.queue.push(item);
  }

  public poll(): T {
    if (this.queue.length === 0) {
      return null;
    }

    return this.queue.shift();
  }
}
