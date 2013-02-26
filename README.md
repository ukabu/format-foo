format-foo
==========

Another String format function! You gotta be kidding me.

This format function, while very similar to sprintf, borrows from other format function/method
of various origin. While it aims to be complete in itself, it also allows you to extend it 
by provinding your own conversion functions.

IT IS NOT COMPLETE YET, so what you've just read is kinda rubbish.

Usage
-----

    var foo = require('format-foo')
    foo.format('Hello my name is %s and I\'m %d years old', 'Foo', 123) 
      => returns : Hello my name is Foo and I'm 123 years old
    // Now you can register a new format function
    foo.registerFormat('x', function(value, conversion, length, decimal, position) { return new Array(value.length+1).join('X') })

Format functions
----------------

Examples
--------

Here are some examples taken from the tests:

    Hello my name is %s
      with Foo should format to 'Hello my name is Foo'
    Hello my name is %s %s
      with Foo, Bar should format to 'Hello my name is Foo Bar'
    I am %d years old
      with 123 should format to 'I am 123 years old'
    I am %5d years old with left padded zeroes
      with 123 should format to 'I am 00123 years old with left padded zeroes'
    Today is %tY-%tm-%td
      with Wed Aug 29 2012 00:00:00 GMT-0400 (Eastern Daylight Time) should format to 'Today is 2012-08-29'
    Now it is %tI:%tM%tp
      with Wed Aug 29 2012 22:13:00 GMT-0400 (Eastern Daylight Time) should format to 'Now it is 10:13PM'

