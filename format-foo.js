var foo = { formats: {}
          , get formatRegexp() {
            if (!this._formatRegexp) {
              conversions = Object.keys(this.formats).join('')
              this._formatRegexp = new RegExp([ /%/                        // start*
                                              , /(?:(\d+)\$)?/             // position. ex: 1
                                              , /(?:(\d+)(?:\.(\d+))?)?/   // width & precision. ex: 2.5, 4
                                              , new RegExp('(['+conversions+'][a-zA-Z]?)') // conversion* function with optional subconversion. ex: d, s, tM
                                              ].map(function source(regexp) {return regexp.source}).join(''), 'g')
            }
            return this._formatRegexp
          }
          , resetFormatRegexp: function () {this._formatRegexp = null}
}

var registerFormat = function(format, formatFunction) {
  foo.formats[format] = formatFunction
  foo.resetFormatRegexp()
}

var format = function(formatString) {
  var autoPosition = 1
  var args = arguments
  return formatString.replace(foo.formatRegexp, function(match, position, length, decimal, conversion) {
    if (typeof position === 'undefined') {
      position = autoPosition
      autoPosition = Math.max(autoPosition++, args.length-1)
    }
    var value = args[position]

    if (typeof value === 'undefined') return match

    var conversionFunction = foo.formats[conversion.charAt(0)] || convertFromString
    return conversionFunction(value, conversion, length, decimal, position)
  })
}

function convertFromDecimal(value, conversion, length) {
  function makePositiveDropDecimals(n) { return Math.floor(Math.abs(n)) }
  function zeroPad(length) { return new Array(length+1).join('0')}
  
  var minus = value < 0 ? '-' : ''
  value = makePositiveDropDecimals(+value)
  length = +length || 0

  string = new String(value)
  return minus + zeroPad(Math.max(string.length, length) - string.length) + string
}

function convertFromString(value, conversion, length) {
    return value ? value.toString() : 'null'
}

function convertFromDate(value, conversion) {
  var field = conversion.charAt(1)
  switch (field) {
    case 'm' : return convertFromDecimal(value.getMonth() + 1, 'd', 2) // Month 1-12
    case 'd' : return convertFromDecimal(value.getDate(), 'd', 2)      // day of month 1-31
    case 'Y' : return convertFromDecimal(value.getFullYear(), 'd', 0)  // full year
    case 'H' : return convertFromDecimal(value.getHours(), 'd', 2)
    case 'M' : return convertFromDecimal(value.getMinutes(), 'd', 2)
    case 'I' : return convertFromDecimal((value.getHours() % 12), 'd', 2)
    case 'p' : return value.getHours() >= 12 ? 'PM' : 'AM'
    case 'S' : return convertFromDecimal(value.getSeconds(), 'd', 2)
    case 'L' : return convertFromDecimal(value.getMilliseconds(), 'd', 3)
    case 'z' : return convertFromDecimal(value.getTimezoneOffset() / 60, 'd', 2)+convertFromDecimal(value.getTimezoneOffset() % 60, 'd', 2)
  }
}

registerFormat('d', convertFromDecimal)
registerFormat('s', convertFromString)
registerFormat('t', convertFromDate)

exports.format = format
exports.registerFormat = registerFormat
