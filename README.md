[![Build Status](https://travis-ci.org/customcommander/is.svg?branch=master)](https://travis-ci.org/customcommander/is)

## TL; DR

0.  `is` compiles a schema into a function:

    ```javascript
    var validate = is({
        firstName: String,           // required, must be a string
        birth: Date,                 // required, must be a date
        address: is.ArrayOf(String), // required, must be an array of strings
        gender: is('M', 'F')         // required, must be either 'M' or 'F'
    });

    // true
    validate({
        firstName: 'Tim',
        birth: new Date('1981-05-25'),
        address: [
            '23 Meteor Street',
            'Tuffnell Park',
            'N7Z 0XQ',
            'London'
        ],
        gender: 'M'
    });

    // false: value is not an object
    validate('Tim');

    // false: `address` is missing
    validate({
        firstName: 'Tim',
        birth: new Date('1981-05-25'),
        gender: 'M'
    });
    ```

0.  It can also validate single values and arrays:

    ```javascript
    var validate;

    validate = is(Number);
    validate(42);   // true
    validate('42'); // false

    validate = is([Number, Number]);
    validate([10, 20]);    // true
    validate([10, 'foo']); // false: second element is not a number
    validate(10);          // false: value is not an array
    ```

0.  And combines schemas:

    ```javascript
    var validate;

    // Value must be either an array or an object
    validate = is(Array, Object);

    validate([10, 20]);     // true
    validate({foo: 'bar'}); // true
    validate(42);           // false

    // Value must be either an array of two numbers
    // or an object with `x` and `y` properties both set to numbers
    validate = is([Number, Number], {x: Number, y: Number});

    validate([10, 20]);          // true
    validate({x: 10, y: 20});    // true
    validate([10, 'foo']);       // false: second element is not an array
    validate({x: 10});           // false: `y` is missing
    validate({x: 10, y: 'foo'}); // false: `y` is not a number
    ```

## Reference

#### `typeof` Check

You can use some native JS functions/values in your schema to validate the type of a value:

```javascript
var validate;

validate = is(Date);
validate(new Date('1981-05-25')); // true
validate(new Date('9999-99-99')); // false
validate([]); // false

validate = is({birth: Date});
validate({birth: new Date('1981-05-25')}); // true
validate({birth: 1981}); // false

validate = is([Date]);
validate([new Date('1981-05-25')]); // true
validate([]); // false
```

Here are the native bits that you can use:

|             | Description                                                        |
|-------------|:-------------------------------------------------------------------|
| `undefined` | value must be undefined                                            |
| `null`      | value must be null                                                 |
| `Array`     | value must be an array                                             |
| `Object`    | value must be an object                                            |
| `Number`    | value must be a number (validates `NaN` too)                       |
| `Boolean`   | value must be either `true` or `false`                             |
| `String`    | value must be a string                                             |
| `Date`      | value must be a valid date (e.g. rejects `new Date('9999-99-99')`) |
| `Function`  | value must be a function                                           |
| `RegExp`    | value must be a regular expression                                 |


#### `instanceof` Check

You can use a constructor in your schema to make sure that a value is an instance of that constructor:

```javascript
var validate;

function Dude() {
    //...
}

function Bloke() {
    //...
}

validate = is(Bloke);

validate(new Bloke()); // true
validate({}); // false

validate = is({x: Bloke y: Number});
validate({x: new Bloke(), y: 42}); // true
validate({x: {}, y: 42); // false


validate = is([Bloke, Bloke]);
validate([new Bloke(), new Bloke()]); // true
validate([new Bloke(), new Dude()]); // false
```

#### Custom Check

You can use a function in your schema to implement a custom validation.

The value is passed as the first parameter of the function which must return `true` to indicate that the value is valid:


```javascript
var validate;

function isEven(value) {
    return typeof value === 'number' && value % 2 === 0;
}

validate = is(isEven);
validate(10);   // true
validate(7);    // false
validate('10'); // false

validate = is({x: isEven, y: isEven});
validate({x: 10, y: 20});   // true
validate({x: 10, y: 21});   // false
validate({x: 10, y: '21'}); // false

validate = is([isEven, isEven]);
validate([10, 20]);   // true
validate([10, 21]);   // false
validate([10, '20']); // false
```

#### Regular Expression Check

You can use a regular expression in your schema to make sure that a value matches that expression:

```javascript
var validate;

validate = is(/foo/);
validate('foobar'); // true
validate('barbaz'); // false
validate(['fooo']); // false

validate = is([/foo/]);
validate(['foo']); // true
validate(['bar']); // false
validate('foo'); // false

validate = is({x: /foo/});
validate({x: 'foobar'}); // true
validate({x: 'hello'}); // false
validate('foobar'); // false
```