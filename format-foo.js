var FORMATS = {
  d: function convertFromDecimal(value, conversion, length) {
    function makePositiveDropDecimals(n) { return Math.floor(Math.abs(n)) }
    function zeroPad(length) { return new Array(length+1).join('0')}
    
    var minus = value < 0 ? '-' : ''
    value = makePositiveDropDecimals(+value)
    length = +length || 0

    string = new String(value)
    return minus + zeroPad(Math.max(string.length, length) - string.length) + string
  }
  , s: function convertFromString(value, conversion, length) {
    return value ? value.toString() : 'null'
  }
  , t: function convertFromDate(value, conversion) {
    var field = conversion.charAt(1)
    switch (field) {
      case 'm' : return FORMATS.d(value.getMonth() + 1, 'd', 2) // Month 1-12
      case 'd' : return FORMATS.d(value.getDate(), 'd', 2)      // day of month 1-31
      case 'Y' : return FORMATS.d(value.getFullYear(), 'd', 0)  // full year
      case 'H' : return FORMATS.d(value.getHours(), 'd', 2)
      case 'M' : return FORMATS.d(value.getMinutes(), 'd', 2)
      case 'I' : return FORMATS.d((value.getHours() % 12), 'd', 2)
      case 'p' : return value.getHours() >= 12 ? 'PM' : 'AM'
      case 'S' : return FORMATS.d(value.getSeconds(), 'd', 2)
      case 'L' : return FORMATS.d(value.getMilliseconds(), 'd', 3)
      case 'z' : return FORMATS.d(value.getTimezoneOffset() / 60, 'd', 2)+FORMATS.d(value.getTimezoneOffset() % 60, 'd', 2)
    }
  }
}

FORMATS_REGEXP = new RegExp([ /%/                        // start*
                            , /(?:(\d+)\$)?/             // position. ex: 1$
                            , /(?:(\d+)(?:\.(\d+))?)?/   // width & precision. ex: 2.5, 4
                            , /([dst][a-zA-Z]?)/         // conversion* function with optional subconversion. ex: d, s, tM
].map(function source(regexp) {return regexp.source}).join(''), 'g')

function format(formatString) {
  var autoPosition = 1
  var args = arguments
  return formatString.replace(FORMATS_REGEXP, function(match, position, length, decimal, conversion) {
    if (typeof position === 'undefined') {
      position = autoPosition
      autoPosition = Math.max(autoPosition++, args.length-1)
    }
    var value = args[position]

    if (typeof value === 'undefined') return match

    var conversionFunction = FORMATS[conversion.charAt(0)] || FORMATS.s
    return conversionFunction(value, conversion, length, decimal, position)
  })
}

exports.format = format
