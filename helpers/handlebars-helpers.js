module.exports = {
  ifCondAnd: function (a, b, options) {
    return a && b ? options.fn(this) : options.inverse(this)
  },
  ifCondOnlyA: function (a, b, c, options) {
    if (a && !b && !c) {
      return options.fn(this)
    } else return options.inverse(this)
  },
  ifEqual: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } else return options.inverse(this)
  },
  ifIncludes: function (a, b, options) {
    if (a.includes(b)) {
      return options.fn(this)
    } else return options.inverse(this)
  }
}
