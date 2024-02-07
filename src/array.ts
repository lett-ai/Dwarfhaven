export default {}

declare global {
  interface Array<T> {
    /** Returns the last n elements from an array. */
    tail: (n: number) => T
    /** Returns the very last element in an array (without popping). */
    last: () => T
    /** Returns a random element from an array. */
    random: () => T
  }
}

Array.prototype.tail = function (n) {
  return this.slice(-n)
}

Array.prototype.last = function () {
  return this.tail(1)[0]
}

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}