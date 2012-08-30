var vows   = require('vows')
var assert = require('assert')
var foo    = require('./format-foo')



function withValues() {
  var args = Array.prototype.slice.call(arguments);
  args.formatTo = function formatTo(target) {
    var context = {
      topic: function() {
        return this.context.name
      }
    }
    context['with '+args.join(', ')+' should format to \''+target+'\''] = function(formatString) {
      return assert.equal(foo.format.apply(null, [formatString].concat(args)), target)
    }
    return context
  }
  return args
}

vows.describe('format-foo').addBatch({
  'Hello my name is %s' : withValues('Foo').formatTo('Hello my name is Foo')
  , 'Hello my name is %s %s' : withValues('Foo', 'Bar').formatTo('Hello my name is Foo Bar')
  , 'I am %d years old' : withValues(123).formatTo('I am 123 years old')
  , 'I am %5d years old with left padded zeroes': withValues(123).formatTo('I am 00123 years old with left padded zeroes')
  , 'Today is %tY-%tm-%td': withValues(new Date('August 29, 2012')).formatTo('Today is 2012-08-29')
  , 'Now it is %tI:%tM%tp': withValues(new Date(2012, 8-1, 29, 22, 13)).formatTo('Now it is 10:13PM')
}).export(module)