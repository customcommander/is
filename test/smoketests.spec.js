var is = require('../lib/is.js');
var expect = require('chai').expect;

describe('Smoke tests', function () {

    it('can validate an object against a complicated schema', function () {
        var validate = is({
            a: is(Number, String),
            b: {
                c: {
                    d: {
                        e: is.ArrayOf(Date)
                    },
                    f: is.ObjectOf([Number, Number])
                },
                g: [Boolean, Boolean]
            },
            h: is.ArrayOf({ foo: /bar/})
        });

        expect(validate({
            a: 10,
            b: {
                c: {
                    d: {
                        e: [new Date(), new Date(), new Date()]
                    },
                    f: {
                        x: [10, 20],
                        y: [10, 20]
                    }
                },
                g: [true, true]
            },
            h: [
                {foo: 'bar'},
                {foo: 'foobar'},
                {foo: 'foobarbaz', xxx: 'yyy'}
            ]
        })).to.be.true;

        expect(validate({
            a: 10,
            b: {
                c: {
                    d: {
                        e: [new Date(), new Date(), new Date()]
                    },
                    f: {
                        x: [10, 20],
                        y: [10, '20'] // <-- ERROR
                    }
                },
                g: [true, true]
            },
            h: [
                {foo: 'bar'},
                {foo: 'foobar'},
                {foo: 'foobarbaz', xxx: 'yyy'}
            ]
        })).to.be.false;
    });
});