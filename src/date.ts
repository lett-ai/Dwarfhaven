declare global {
  interface Date {
    /** Converts a numerical index (0-11) to the matching month string. */
    toMonth: () => string
    /** Converts a numerical index (0-6) to the matching day of the week. */
    toDay: () => string
    /** Adds a number of days to a date and returns the result (**immutable**). */
    addDays: (days: number) => Date
    /** Parses a JS Date to an Americanized date (`MM/DD/YYYY`) */
    toDate: () => string,
    /** Parses a JS Date to a (nice) Americanized date (`Day Mon DD`) */
    toNiceDate: () => string,
    /** Parses a JS Date to a (nicer) Americanized date (`DayOfWeek Month DD`) */
    toNicerDate: () => string,
    /** Parses a JS Date to 12-hour time (e.g. `12:34 PM`) */
    toTime: () => string,
    /** Parses a JS Date to Americanized date and 12-hour time (`MM/DD/YYYY 12:34 PM`) */
    toDateTime: () => string
    /** Converts a JS Date to a friendly representation, relative to **today**.
     *
     * e.g.
     *
     * `Today, 12:34 PM`
     *
     * `Yesterday, 12:34 PM`
     *
     * `Tomorrow, 12:34 PM`
     *
     * `Last Monday, 12:34 PM`
     *
     * `12/31/2020, 12:34 PM`
     */
    toNicerDateTime: () => string
    /** Converts a JS Date to a friendly representation, relative to **now**.
     *
     * e.g.
     *
     * `12:34 PM`
     *
     * `Mon 12:34 PM`
     *
     * `Fri 12:34 PM`
     *
     * `9/4`
     *
     * `12/31/2020`
     */
    toNiceDateTime: (n?: number) => string
  }
}

Date.prototype.toMonth = function () {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ][this.getMonth()]
}

Date.prototype.toDay = function () {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ][this.getDay()]
}

//! immutable
Date.prototype.addDays = function (days: number) {
  const date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

Date.prototype.toDate = function () {
  return `${this.getMonth() + 1}/${this.getDate()}/${this.getFullYear()}`
}

Date.prototype.toNiceDate = function () {
  return `${this.toDay().slice(0, 3)} ${this.toMonth().slice(0, 3)} ${this.getDate()}`
}

Date.prototype.toNicerDate = function () {
  return `${this.toDay()} ${this.toMonth()} ${this.getDate()}`
}

Date.prototype.toTime = function () {
  return this.toISOString().slice(11, 11+8)
}

Date.prototype.toDateTime = function () {
  return this.toDate() + ' ' + this.toTime()
}

Date.prototype.toNicerDateTime = function () {
  const now = new Date()
  const tomorrow = now.addDays(1)
  const yesterday = now.addDays(-1)
  const diff = this.valueOf() - now.valueOf()
  const days = diff / (1000 * 60 * 60 * 24)
  if (Math.abs(days) < 2) {
    if (this.getDate() == now.getDate())
      return 'Today, ' + this.toLocaleTimeString('en-us', {
        hour: 'numeric',
        minute: '2-digit'
      })
    if (this.getDate() == tomorrow.getDate())
      return 'Tomorrow, ' + this.toLocaleTimeString('en-us', {
        hour: 'numeric',
        minute: '2-digit'
      })
    if (this.getDate() == yesterday.getDate())
      return 'Yesterday, ' + this.toLocaleTimeString('en-us', {
        hour: 'numeric',
        minute: '2-digit'
      })
  }
  if (days < 0 && days > -7) {
    return 'Last ' + this.toLocaleDateString('en-us', {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit'
    })
  }
  if (days > 0 && days < 7) {
    return this.toLocaleDateString('en-us', {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit'
    })
  }
  return this.toDateTime()
}

Date.prototype.toNiceDateTime = function (n=7) {
  const now = new Date()
  const diff = this.valueOf() - now.valueOf()
  const days = diff / (1000 * 60 * 60 * 24)
  if (Math.abs(days) < 1 && this.getDate() == now.getDate()) {
    return this.toLocaleTimeString('en-us', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }
  if (Math.abs(days) < n) {
    return this.toLocaleDateString('en-us', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit'
    })
  }
  if (Math.abs(days) < 365) {
    return this.toLocaleDateString('en-us', {
      month: 'numeric',
      day: 'numeric'
    })
  }
  return this.toDate()
}

export const toNiceDateTime = (datetime: Date | number) =>
  (new Date(datetime)).toNiceDateTime()
