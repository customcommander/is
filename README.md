# is

[![Build Status](https://travis-ci.org/customcommander/is.svg?branch=master)](https://travis-ci.org/customcommander/is)

`is` compiles a schema into a validation function:

```javascript
var isValid = is(/* schema */);

isValid(/* any value */);
//=> true or false
```

A schema is a set of rules for validating **any data type**.

###### Available Rules 

| Rule        | Valid if value                                                               |
|:------------|:-----------------------------------------------------------------------------|
| `undefined` | is undefined                                                                 |
| `null`      | is null                                                                      |
| `Array`     | is an array                                                                  |
| `Object`    | is an object                                                                 |
| `Number`    | is a number (validates `NaN` too)                                            |
| `Boolean`   | is a boolean                                                                 |
| `String`    | is a string                                                                  |
| `Date`      | is a valid instance of `Date` (e.g. rejects `new Date('2016-99-99');`)       |
| `Function`  | is a function                                                                |
| `RegExp`    | is a regular expression                                                      |
| a function  | is an instance of the function or the function returns `true` for that value |
| a regex     | is a string that matches the regular expression                              |
| a value     | both values are strictly equal                                               |

###### Single Rule Schema

A schema made of only one rule:

```javascript
var isNumber = is(Number);

isNumber('10'); // false
isNumber(10); // true
```

###### Object Schema

A schema made for validating objects.

Each key of the schema maps to a property of an object.
All properties in the schema must be correctly implemented in the object for it to be valid.
All other properties in the object are ignored:

```javascript
var isUser = is({name: String, age: Number});

isUser('john'); // false (not an object)
isUser({name: 'john'}); // false (missing age property)
isUser({name: 'john', age: '34'}); // false (age is not a number)
isUser({name: 'john', age: 34}); // true
isUser({name: 'john', age: 34, email: 'john@example.com'}); // true (there is no rule for email)
```

A schema can embed other schemas:
(You can have as many nested schemas as you like 😎)

```javascript
var isXY = is({
    x: {top: Number, left: Number},
    y: {top: Number, left: Number}
});

isXY({
    x: {top: 100, left: 50},
    y: {top: 500, left: 1000}
});
// true

isXY({
    x: {top: 100, left: 50},
    y: {top: 500, left: 'foo'}
});
// false
```

If you need to validate all the properties of an object use `is.ObjectOf()` instead:

```javascript
var isValid = is.ObjectOf(Number);

isValid({}); // true
isValid({top: 100}); // true
isValid({top: 100, left: 200}); // true
isValid({top: 100, left: 200, bottom: 300}); // true
isValid({top: 100, left: 200, bottom: 300, right: 'foo'}); // false
```

###### Array Schema

A schema made for validating arrays. 

Each element in the schema is a rule. To be valid an array must have the same length than the schema
and each element in the array complies with its corresponding rule in the schema:

```javascript
/* Valid if a value is an array of two numbers */
var isPair = is([Number, Number]);

isPair(10); // false (not an array)
isPair([10]); // false (not the same length)
isPair([10, '20']); // false (second element is not a number)
isPair([10, 20]); // true
isPair([10, 20, 30]); // false (not the same length)
```

You can also have nested schemas:

```javascript
var isValid = is([Number, {x: String, y: Boolean}]);

isValid([10, {x: 'foo'}]); // false (missing property y)
isValid([10, {x: 'foo', y: true}]); // true
```

If you need to validate arrays of any length, use `is.ArrayOf()` instead:

```javascript
var isValid = is.ArrayOf(Number);

isValid([]); // true
isValid([1]); // true
isValid([1, 2]); // true
isValid([1, 2, 3]); // true
isValid([1, 2, '3', 4]); // false
```

```javascript
var isValid = is.ArrayOf({x: Number, y: Number});

isValid([]); // true
isValid([{x: 10, y: 50}]); // true
isValid([{x: 10, y: 50}, {x: 100, y: 150}]); // true
isValid([{x: 10, y: 50}, {x: 'foo', y: 150}]); // false
```

###### Function as a rule

The value must either be an instance of the function:

```javascript
function Person() {
    // ...
}

var isCouple = is([Person, Person]);

var user1 = new Person();
var user2 = new Person();
var user3 = 'john';

isCouple([user1, user2]); // true
isCouple([user1, user3]); // false
```

Or the function must return `true` for that value:

```javascript
function isEven(value) {
    return typeof value === 'number' && value % 2 === 0;
}

var isValid = is({x: isEven, y: isEven });

isValid({x: 8, y: 10}); // true
isValid({x: 7, y: 10}); // false
```

###### Regular expression as a rule

The value must be a string and match the regular expression:

```javascript
var isFoo = is(/^foo.*$/i);

isFoo('foobar'); // true
isFoo('foo'); // true
isFoo('hello world'); // false
isFoo(['foo']); // false
```

###### Value as a rule

The value must be set to exactly that one:

```javascript
var isAnwser = is(42);

isAnwser(42); // true
isAnwser('42'); // false
isAnwser([42]); // false
```
