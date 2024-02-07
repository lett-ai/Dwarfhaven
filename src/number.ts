export default null

declare global {
  interface Number {
    /** Converts a number of seconds to 12-hour time (`12:34 PM`). */
    secondsToTimestring: () => string
    /** Converts a number of bytes to a human-readable bytes (power-of-2). */
    toFilesize: () => string
  }
}

Number.prototype.secondsToTimestring = function () {
  return new Date(this.valueOf() * 1000).toISOString().slice(11, 11+8)
}

Number.prototype.toFilesize = function () {
  const me = this.valueOf()
  const byte = 1
  const kilobyte = byte * 1024
  const megabyte = kilobyte * 1024
  const gigabyte = megabyte * 1024
  const terabyte = gigabyte * 1024
  const petabyte = terabyte * 1024
  if (me > petabyte) return (me / gigabyte).toFixed(2) + ' PB'
  if (me > terabyte) return (me / gigabyte).toFixed(2) + ' TB'
  if (me > gigabyte) return (me / gigabyte).toFixed(2) + ' GB'
  if (me > megabyte) return (me / megabyte).toFixed(2) + ' MB'
  if (me > kilobyte) return (me / kilobyte).toFixed(2) + ' KB'
  return this + ' bytes'
}
