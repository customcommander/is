var is = require('../lib/is');
var expect = require('chai').expect;
var sinon = require('sinon');


describe('is', function () {

    var undef;

    it('should be a function', function () {
        expect(typeof is).to.equal('function');
    });

    it('should return a function', function () {
        var validate = is(Number);
        expect(typeof validate).to.equal('function');
    });

    it('should throw an error when called without a schema', function () {
        expect(function () {
            is();
        }).to.throw(Error);
    });

    it('should allow multiple schemas to be combined', function () {
        var validate = is(Number, String, RegExp);
        expect(validate(10)).to.be.true;
        expect(validate('foo')).to.be.true;
        expect(validate(/foo/)).to.be.true;
        expect(validate([10])).to.be.false;
    });

    describe('Schema: `null`', function () {
        var isNull = is(null);

        it('returns true if the thing is null', function () {
            expect(isNull(null)).to.be.true;
        });

        it('returns false if the thing is not null', function () {
            expect(isNull(undef)).to.be.false;
        });
    });

    describe('Schema: `undefined`', function () {
        var isUndefined = is(undef);

        it('returns true if the thing is undefined', function () {
            expect(isUndefined(undef)).to.be.true;
            expect(isUndefined()).to.be.true;
        });

        it('returns false if the thing is not undefined', function () {
            expect(isUndefined(null)).to.be.false;
        });
    });

    describe('Schema: `Number`', function () {
        var isNumber = is(Number);

        it('returns true if the thing is a number', function () {
            expect(isNumber(-10)).to.be.true;
            expect(isNumber(10)).to.be.true;
            expect(isNumber(NaN)).to.be.true;
            expect(isNumber(Infinity)).to.be.true;
            expect(isNumber(-Infinity)).to.be.true;
        });

        it('returns false if the thing is not a number', function () {
            expect(isNumber('10')).to.be.false;
            expect(isNumber(new Number(10))).to.be.false;
        });
    });

    describe('Schema: `String`', function () {
        var isString = is(String);

        it('returns true if the thing is a string', function () {
            expect(isString('foo')).to.be.true;
            expect(isString('')).to.be.true;
        });

        it('returns false if the thing is not a string', function () {
            expect(isString([])).to.be.false;
            expect(isString(new String('foo'))).to.be.false;
        });
    });

    describe('Schema: `Boolean`', function () {
        var isBoolean = is(Boolean);

        it('returns true if the thing is a boolean', function () {
            expect(isBoolean(true)).to.be.true;
            expect(isBoolean(false)).to.be.true;
        });

        it('returns false if the thing is not boolean', function () {
            expect(isBoolean(1)).to.be.false;
            expect(isBoolean(0)).to.be.false;
            expect(isBoolean(new Boolean(true))).to.be.false;
        });
    });

    describe('Schema: `Array`', function () {
        var isArray = is(Array);

        it('returns true if the thing is an array', function () {
            expect(isArray([])).to.be.true;
            expect(isArray([1, 2])).to.be.true;
        });

        it('returns false if the thing is not array', function () {
            expect(isArray({})).to.be.false;
        });
    });

    describe('Schema: `Object`', function () {
        var isObject = is(Object);

        it('returns true if the thing is an object literal ', function () {
            expect(isObject({})).to.be.true;
            expect(isObject({x: 1, y: 'foo'})).to.be.true;
        });

        it('returns false if the thing is not an object literal', function () {
            expect(isObject([])).to.be.false;
            expect(isObject(null)).to.be.false;
        });
    });

    describe('Schema: `Date`', function () {
        var isDate = is(Date);

        it('returns true if the thing is valid date', function () {
            expect(isDate(new Date())).to.be.true;
        });

        it('returns false if the thing is not a date', function () {
            expect(isDate({})).to.be.false;
        });

        it('returns false if the thing is not a valid date', function () {
            expect(isDate(new Date('9999-99-99'))).to.be.false;
        });
    });

    describe('Schema: `RegExp`', function () {
        var isRegExp = is(RegExp);

        it('returns true if the thing is a regular expression', function () {
            expect(isRegExp(/foo/)).to.be.true;
            expect(isRegExp(new RegExp('foo'))).to.be.true;
        });

        it('returns false if the thing is not a regular expression', function () {
            expect(isRegExp('foo')).to.be.false;
        });
    });

    describe('Schema: `Function`', function () {
        var isFunction = is(Function);

        it('returns true if the thing is a function', function () {
            function noop() {}
            expect(isFunction(noop)).to.be.true;
        });

        it('returns false if the thing is not a function', function () {
            expect(isFunction([])).to.be.false;
        });
    });

    describe('Schema: regular expression', function () {
        var validate = is(/foo/);

        it('returns true if the thing matches the regular expression', function () {
            expect(validate('xxxfooxxx')).to.be.true;
        });

        it('returns false if the thing is not a string', function () {
            expect(validate(new String('foo'))).to.be.false;
        });

        it('returns false if the thing does not match the regular expression', function () {
            expect(validate('xxxbarxxx')).to.be.false;
        });
    });

    describe('Schema: function', function () {

        it('returns true if the thing is an instance of the function', function () {
            var isFoo;
            function Foo() {}
            isFoo = is(Foo);
            expect(isFoo(new Foo())).to.be.true;
            expect(isFoo({})).to.be.false;
        });

        it('returns true if the function returns true for the thing', function () {
            var validate = is(function () {
                return true;
            });
            expect(validate({})).to.be.true;
        });

        it('returns false if the function returns a truthy value for the thing', function () {
            var validate = is(function () {
                return 1;
            });
            expect(validate('foo')).to.be.false;
        });

        it('should pass the thing as the first argument of the function that validates the thing', function () {
            var mock;
            var validate;

            mock = sinon.mock();
            mock.withExactArgs(10);

            validate = is(mock);
            validate(10);

            mock.verify();
        });
    });

    describe('Schema: value', function () {
        var validate = is(10);

        it('returns true if the thing is equal to that value', function () {
            expect(validate(10)).to.be.true;
        });

        it('returns false if the thing is not equal to that value', function () {
            expect(validate('10')).to.be.false;
        });
    });

    describe('Schema: array', function () {

        it('returns true if each element validates against its corresponding schema', function () {
            var validate;

            validate = is([]);
            expect(validate([])).to.be.true;

            validate = is([Number, String, Boolean]);
            expect(validate([1, 'foo', true])).to.be.true;

            validate = is([[Number, Number], [Number, Number]]);
            expect(validate([[1, 2], [1, 2]])).to.be.true;
        });

        it('returns false if the thing is not an array', function () {
            var validate = is([]);
            expect(validate({})).to.be.false;
        });

        it('returns false if the length of the array is not equal to the length of the schema', function () {
            var validate = is([1, 2]);
            expect(validate([1, 2, 3])).to.be.false;
        });

        it('returns false if an element does not validate against its corresponding schema', function () {
            var validate = is([[Number, Number], [Number, Number]]);
            expect(validate([[1, 2], [1, '2']])).to.be.false;
        });

    });

    describe('Schema: object', function () {
        var validate = is({
            x: Number,
            y: {
                foo: String,
                bar: String
            }
        });

        it('returns true if the object validates against its schema', function () {
            expect(validate({
                x: 10,
                y: {
                    foo: 'xxx',
                    bar: 'xxx'
                }
            })).to.be.true;
        });

        it('returns true for a valid object with properties not described in the schema', function () {
            expect(validate({
                x: 10,
                y: {
                    foo: 'xxx',
                    bar: 'xxx',
                    baz: 'xxx'
                }
            })).to.be.true;
        });

        it('returns false if the thing is not an object', function () {
            expect(validate([])).to.be.false;
            expect(validate(null)).to.be.false;
        });

        it('returns false if the object doesn\'t validate against the schema', function () {
            expect(validate({
                x: 10,
                y: {
                    foo: 'xxx',
                    bar: 20
                }
            })).to.be.false;
        });

        it('returns false if the object doesn\'t have a property described in the schema', function () {
            expect(validate({
                x: 10,
                y: {
                    foo: 'xxx'
                }
            })).to.be.false;
        });
    });

});

describe('is.ArrayOf', function () {
    var validate = is.ArrayOf(Number);

    it('should be a function', function () {
        expect(typeof is.ArrayOf).to.equal('function');
    });

    it('should return a function', function () {
        expect(typeof validate).to.equal('function');
    });

    it('should throw an error when called without a schema', function () {
        expect(function () {
            is.ArrayOf();
        }).to.throw(Error);
    });

    it('should allow multiple schemas to be combined', function () {
        var validate = is.ArrayOf(Number, String);
        expect(validate([1, 'foo'])).to.be.true;
        expect(validate([1, 2])).to.be.true;
        expect(validate(['foo', 2])).to.be.true;
        expect(validate(['foo', 'bar'])).to.be.true;
        expect(validate(['foo', true])).to.be.false;
    });

    it('returns true for an empty array', function () {
        expect(validate([])).to.be.true;
    });

    it('returns true if each element validates against the schema', function () {
        expect(validate([1, 2])).to.be.true;
        expect(validate([1, 2, 3])).to.be.true;
    });

    it('returns false if the thing is not an array', function () {
        expect(validate({})).to.be.false;
    });

    it('returns false if an element doesn\'t validate against the schema', function () {
        expect(validate([1, '2'])).to.be.false;
        expect(validate([1, '2', 3])).to.be.false;
    });
});

describe('is.ObjectOf', function () {
    var validate = is.ObjectOf(Number);

    it('should be a function', function () {
        expect(typeof is.ObjectOf).to.equal('function');
    });

    it('should return a function', function () {
        expect(typeof validate).to.equal('function');
    });

    it('should throw an error when called without a schema', function () {
        expect(function () {
            is.ObjectOf();
        }).to.throw(Error);
    });

    it('should allow multiple schemas to be combined', function () {
        var validate = is.ObjectOf(Number, String);
        expect(validate({ x: 1, y: 'foo' })).to.be.true;
        expect(validate({ x: 1 })).to.be.true;
        expect(validate({ y: 'foo' })).to.be.true;
        expect(validate({ x: 'foo', y: 'bar' })).to.be.true;
        expect(validate({ x: true })).to.be.false;
    });

    it('returns true for an empty object', function () {
        var validate = is.ObjectOf(Number);
        expect(validate({})).to.be.true;
    });

    it('returns true for if each property validates against the schema', function () {
        expect(validate({x: 1})).to.be.true;
        expect(validate({x: 1, y: 2})).to.be.true;
    });

    it('returns false if the thing is not an object', function () {
        expect(validate(null)).to.be.false;
        expect(validate([])).to.be.false;
    });

    it('returns false if a property doesn\'t validate against the schema', function () {
        expect(validate({x: 1, y: '2' })).to.be.false;
    });
});