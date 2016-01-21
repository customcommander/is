(function (factory) {

    module.exports = factory();

}(function () {

    var nativeUndefined;
    var nativeNull = null;
    var nativeArray = Array;
    var nativeObject = Object;
    var nativeNumber = Number;
    var nativeBoolean = Boolean;
    var nativeString = String;
    var nativeDate = Date;
    var nativeFunction = Function;
    var nativeRegExp = RegExp;

    var getClass = Function.prototype.apply.bind(Object.prototype.toString);
    var slice = Function.prototype.apply.bind(Array.prototype.slice);

    function isUndefined(thing) {
        return typeof thing === 'undefined';
    }

    function isNull(thing) {
        return thing === null;
    }

    function isArray(thing) {
        return Array.isArray(thing);
    }

    function isObject(thing) {
        return getClass(thing) === '[object Object]';
    }

    function isNumber(thing) {
        return typeof thing === 'number';
    }

    function isBoolean(thing) {
        return typeof thing === 'boolean';
    }

    function isString(thing) {
        return typeof thing === 'string';
    }

    function isDate(thing) {
        return getClass(thing) === '[object Date]' && thing.toString() !== 'Invalid Date';
    }

    function isFunction(thing) {
        return typeof thing === 'function';
    }

    function isRegExp(thing) {
        return getClass(thing) === '[object RegExp]';
    }

    function isNative(schema) {
        return schema === nativeNull ||
            schema === nativeUndefined ||
            schema === nativeNumber ||
            schema === nativeString ||
            schema === nativeBoolean ||
            schema === nativeArray  ||
            schema === nativeObject ||
            schema === nativeDate ||
            schema === nativeRegExp ||
            schema === nativeFunction;
    }

    function nativeValidator(schema, thing) {
        if (schema === nativeNull) {
            return isNull(thing);
        } else if (schema === nativeUndefined) {
            return isUndefined(thing);
        } else if (schema === nativeNumber) {
            return isNumber(thing);
        } else if (schema === nativeString) {
            return isString(thing);
        } else if (schema === nativeBoolean) {
            return isBoolean(thing);
        } else if (schema === nativeArray) {
            return isArray(thing);
        } else if (schema === nativeObject) {
            return isObject(thing);
        } else if (schema === nativeDate) {
            return isDate(thing);
        } else if (schema === nativeRegExp) {
            return isRegExp(thing);
        } else if (schema === nativeFunction) {
            return isFunction(thing);
        }
    }

    function functionValidator(schema, thing) {
        return thing instanceof schema || schema(thing) === true;
    }

    function arrayValidator(schema, thing) {
        if (!isArray(thing) || schema.length !== thing.length) {
            return false;
        }
        return schema.every(function (schma, idx) {
            var validator = generateValidator(schma);
            return validator(thing[idx]) === true;
        });
    }

    function objectValidator(schema, thing) {
        return isObject(thing) && Object.keys(schema).every(function (key) {
            var validator = generateValidator(schema[key]);
            return validator(thing[key]) === true;
        });
    }

    function regexValidator(schema, thing) {
        return isString(thing) && schema.test(thing);
    }

    function thingValidator(schema, thing) {
        return schema === thing;
    }

    function generateValidator(schema) {
        if (isNative(schema)) {
            return nativeValidator.bind(null, schema);
        } else if (isFunction(schema)) {
            return functionValidator.bind(null, schema);
        } else if (isArray(schema)) {
            return arrayValidator.bind(null, schema);
        } else if (isObject(schema)) {
            return objectValidator.bind(null, schema);
        } else if (isRegExp(schema)) {
            return regexValidator.bind(null, schema);
        } else {
            return thingValidator.bind(null, schema);
        }
    }

    function is() {
        if (!arguments.length) {
            throw new Error('is: empty schema is not allowed');
        }
        return function isValidator(thing) {
            return this.some(function (schema) {
                var validator = generateValidator(schema);
                return validator(thing) === true;
            });
        }.bind(slice(arguments));
    }

    is.ArrayOf = function () {
        var validator = is.apply(null, slice(arguments));
        return function arrayOfValidator(thing) {
            return isArray(thing) && thing.every(function (stuff) {
                return validator(stuff) === true;
            });
        };
    };

    is.ObjectOf = function () {
        var validator = is.apply(null, slice(arguments));
        return function objectOfValidator(thing) {
            return isObject(thing) && Object.keys(thing).every(function (key) {
                return validator(thing[key]) === true;
            });
        };
    };

    return is;
}));
