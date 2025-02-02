export default null

declare global {
  interface StringConstructor {
    /** Generates a random hexadecimal string of specified length. */
    random: (length: number) => string
  }
  interface String {
    /** Capitalizes the first letter of a string. */
    capitalize: () => string
    /** Encodes a string to hexadecimal. */
    hexEncode: () => string
    /** Gets the domain of a URL, does not need a protocol */
    getDomain: () => string | null
    /** Gets the avatar, either from Gravatar (emails only) or from Vercel */
    getAvatar: () => Promise<string | null>
    /** Gets the logo of a company via domain, should not have a protocol */
    getLogo: () => Promise<string | null>
  }
  interface Array<T> {
    /** Joins up to `to` elements of an array with the specified separator. */
    joinTo: (to: number, separator: string) => string
  }
  const CryptoJS: any
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

// NOTE: only returns hexadecimal digits, can change radix to change base
String.random = length => {
  let str = ''
  while (str.length < length) str += Math.random().toString(16).substring(2)
  return str.substring(0, length)
}

String.prototype.hexEncode = function () {
  let hex
  let result = ''
  let i
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16)
    result += (hex).slice(-2)
  }
  return result
}

Array.prototype.joinTo = function (to, separator) {
  const toJoin = this.slice(0, to)
  if (this.length > toJoin.length) { return toJoin.join(separator || ',') + ' + ' + (this.length - toJoin.length) } else return toJoin.join(separator || ',')
}

/* Gets the domain of a URL, does not need a protocol */
String.prototype.getDomain = function () {
  try {
    let url
    if (!this.startsWith('http://') && !this.startsWith('https://')) {
      url = new window.URL('http://' + this)
    } else {
      url = new window.URL(this.valueOf())
    }
    return url.host
  } catch (e) {
    return null
  }
}

/* Gets the avatar, either from Gravatar (emails only, requires CryptoJS) or from Vercel */
String.prototype.getAvatar = async function () {
  const email = this.toString()

  try {
    const hash = CryptoJS.MD5(email)
    const s = await fetch('https://www.gravatar.com/avatar/' + hash.toString() + '?d=404')
    if (s.status != 404) return 'https://www.gravatar.com/avatar/' + hash.toString() + '?d=404'
  } catch { }

  return 'https://avatar.vercel.sh/' + email
}

/* Gets the logo of a company via domain, should not have a protocol */
String.prototype.getLogo = async function () {
  const url = this.toString()
  const s = await fetch('https://logo.clearbit.com/' + url)
  if (s.status != 200) return null
  return s.url
}
