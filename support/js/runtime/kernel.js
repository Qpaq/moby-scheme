var plt = plt || {};


//////////////////////////////////////////////////////////////////////
// Kernel
// Depends on types.js.
//
// FIXME: there's a circular dependency between types.js and
// kernel.js.  It hasn't bitten us yet only because the circular
// references are in functions, rather than toplevel expressions, but
// we need to be careful.


(function() {

    




    // Inheritance from pg 168: Javascript, the Definitive Guide.
    function heir(p) {
	function f() {}
	f.prototype = p;
	return new f();
    }


    //////////////////////////////////////////////////////////////////////

    function MobyError(msg) {
	this.msg = msg;
    }
    MobyTypeError.prototype.name= 'MobyError';
    MobyTypeError.prototype.toString = function () { return "MobyError: " + this.msg }

    

    function MobyTypeError(msg) {
	MobyError.call(this, msg);
    }
    MobyTypeError.prototype = heir(MobyError.prototype);
    MobyTypeError.prototype.name= 'MobyTypeError';
    MobyTypeError.prototype.toString = function () { return "MobyTypeError: " + this.msg }



    function MobyRuntimeError(msg) {
	MobyError.call(this, msg);
    }
    MobyRuntimeError.prototype = heir(MobyError.prototype);
    MobyRuntimeError.prototype.name= 'MobyRuntimeError';
    MobyRuntimeError.prototype.toString = function () { return "MobyRuntimeError: " + this.msg }

    //////////////////////////////////////////////////////////////////////


    // _gcd: integer integer -> integer
    function _gcd(a, b) {
	while (b != 0) {
	    var t = a;
	    a = b;
	    b = t % b;
	}
	return a;
    }

    // _lcm: integer integer -> integer
    function _lcm(a, b) {
	return a * b / _gcd(a, b);
    }


    // Returns true if x is a number.
    function isNumber(x) {
	return (x != null && x != undefined && (x instanceof plt.types.Rational || 
						x instanceof plt.types.FloatPoint ||
						x instanceof plt.types.Complex));
    }

    function isSymbol(x) {
	return (x != null && x != undefined && x instanceof plt.types.Symbol);
    }

    function isChar(x) {
	return x != null && x != undefined && x instanceof plt.types.Char;
    }

    function isString(x) {
	return typeof(x) == 'string';
	//return x != null && x != undefined && x instanceof plt.types.String;
    }

    function isBoolean(x) {
	return (x == plt.types.Logic.TRUE || x == plt.types.Logic.FALSE);
    }

    function isPair(x) {
	return x != null && x != undefined && x instanceof plt.types.Cons;
    }

    function isEmpty(x) {
	return x != null && x != undefined && x instanceof plt.types.Empty;
    }

    function isReal(x) {
	return (isNumber(x) && x.isReal());

    }

    function isRational(x) {
	return x != null && x != undefined && x instanceof plt.types.Rational;
    }


    function isComplex(x) {
	return x != null && x != undefined && (x instanceof plt.types.Complex || 
					       x instanceof plt.types.Rational ||
					       x instanceof plt.types.FloatPoint);
    }

    function isFunction(x) {
	return typeof(x) == 'function';
    }


    // Returns true if x is an integer.
    function isInteger(x) {
	return x != null && x != undefined && isNumber(x) && plt.types.NumberTower.equal(x, x.floor());
    }

    function isNatural(x) {
	return x != null && x != undefined && isNumber(x) && plt.types.NumberTower.equal(x, x.floor()) && x.toInteger() >= 0;
    }




    // isAlphabeticString: string -> boolean
    function isAlphabeticString(s) {
	for(var i = 0; i < s.length; i++) {
	    if (! ((s[i] >= "a" && s[i] <= "z") ||
		   (s[i] >= "A" && s[i] <= "Z"))) {
		return false;
	    }
	}
	return true;
    }

    // isWhitespaceString: string -> boolean
    var isWhitespaceString = (function() {
	var pat = new RegExp("^\\s*$");
	return function(s) {
	    return (s.match(pat) ? true : false);
	}
    }());



    function isImage(thing) {
	return (thing != null && thing != undefined && thing instanceof BaseImage);
    }



    // arrayEach: (arrayof X) (X -> void) -> void
    // Apply some function on each element of the array.
    function arrayEach(arr, f) {
	for (var i = 0; i < arr.length; i++) {
	    f.apply(arr[i], [arr[i]]);
	}
    }


    // Apply a chaining test on pairs of elements of the list [first, second, rest ...].
    function chainTest(test, first, second, rest) {
	if (! test(first, second).valueOf())
	    return false;
	if (rest.length == 0)
	    return true;
	if (! test(second, rest[0]).valueOf())
	    return false;
	for(var i = 0; i < rest.length - 1; i++) {
	    if (! test(rest[i], rest[i+1]).valueOf())
		return false;
	}
	return true;
    }
    

    // Apply a search on pairs of elements of the list [first, rest ...].
    function chainFind(comparator, first, rest) {
	var i;
	var best = first;
	for(i = 0; i < rest.length; i++) {
	    if (! (comparator(best, rest[i])).valueOf()) {
		best = rest[i];
	    }
	}
	return best;
    }
    

    // Returns true if x is a list.
    function isList(x) {
	return x != null && x != undefined && ((x instanceof plt.types.Cons) || (x instanceof plt.types.Empty));
    }


    // Checks if x satisfies f.  If not, a MobyTypeError of msg is thrown.
    function check(x, f, msg) {
	if (! f(x)) {
	    throw new MobyTypeError(msg);
	}
    }

    // Throws exception if x is not a list.
    function checkList(x, msg) {
	if (! isList(x)) {
	    throw new MobyTypeError(msg);
	}
    }

    // Checks if x is a list of f.  If not, throws a MobyTypeError of msg.
    function checkListof(x, f, msg) {
	if (! isList(x)) {
	    throw new MobyTypeError(msg);
	}
	while (! x.isEmpty()) {
	    if (! f(x.first())) {
		throw new MobyTypeError(msg);
	    }
	    x = x.rest();
	}
    }


    // makeChainingComparator: (X -> boolean) string (X X (arrayof X) -> boolean) -> (X X (arrayof X) -> boolean) 
    function makeChainingComparator(typeCheckF, typeName, comparisonF) {
	return function(first, second, rest) {
	    check(first, typeCheckF, "first must be a " + typeName);
	    check(second, typeCheckF, "second must be a " + typeName);
	    arrayEach(rest, 
		      function(x) { check(x, typeCheckF, 
					  "each argument must be a " + typeName) });
	    return comparisonF(first, second, rest);
	}
    }



    function makeNumericChainingComparator(test) {
	return makeChainingComparator(isNumber, "number",
				      function(first, second, rest) {
					  return chainTest(test, first, second, rest);
				      });
    }

    function makeCharChainingComparator(test) {
	return makeChainingComparator(isChar, "char",
				      function(first, second, rest) {
					  return chainTest(test, first, second, rest);
				      });
    }


    function makeStringChainingComparator(test) {
	return makeChainingComparator(isString, "string",
				      function(first, second, rest) {
					  return chainTest(test, first, second, rest);
				      });
    }




    plt.Kernel = {
	
	_heir : heir,


	pi : plt.types.FloatPoint.makeInstance(Math.PI),
	e : plt.types.FloatPoint.makeInstance(Math.E),


	Struct: function (constructorName, fields) {
	    this._constructorName = constructorName; 
	    this._fields = fields;
	},

	
	struct_question_: function(thing) {
	    return (thing != null && thing != undefined && thing instanceof plt.Kernel.Struct);
	},
	
	number_question_ : function(x){
	    return isNumber(x);
	},
	
	equal_question_ : function(x, y) {
	    if (plt.Kernel.number_question_(x).valueOf() && 
		plt.Kernel.number_question_(y).valueOf()) {
		if ("isEqual" in x) {
		    return plt.types.NumberTower.equal(x, y);
		} else if ("isEqual" in y) {
		    return plt.types.NumberTower.equal(y, x);
		} else {
		    return (x == y);
		}
	    } else {
		return x.isEqual(y);
	    }
	},


	equal_tilde__question_ : function(x, y, delta) {
	    check(delta, isNumber, "number");
	    if (plt.Kernel.number_question_(x).valueOf() && 
		plt.Kernel.number_question_(y).valueOf()) {
		if ("isEqual" in x) {
		    return plt.types.NumberTower.approxEqual(x, y, delta);
		} else if ("isEqual" in y) {
		    return plt.types.NumberTower.approxEqual(y, x, delta);
		} else {
		    return (x == y);
		}
	    } else {
		return x.isEqual(y);
	    }
	},

	
	eq_question_ : function(x, y){
	    return (x == y);
	}, 
	

	eqv_question_ : function(x, y){
	    if (isNumber(x) && isNumber(y)) {
		return plt.types.NumberTower.equal(x, y);
	    }
	    return x == y;
	},
	

	identity : function (x){
	    return x;
	},
	
	
	cons: function(x, y) {
	    checkList(y, "second argument to cons must be a list.");
	    return plt.types.Cons.makeInstance(x, y);
	},
	
	first: function(thing) {
	    checkList(thing, "first must consume a list");
	    return thing.first();
	},
	
	rest: function(thing) {
	    checkList(thing, "rest must consume a list");
	    return thing.rest();
	},
	
	
	second: function(thing) {
	    checkList(thing, "second must consume a list");
	    return thing.rest().first();
	},
	
	third: function(thing) {
	    checkList(thing, "third must consume a list");
	    return thing.rest().rest().first();
	},
	
	fourth: function(thing) {
	    checkList(thing, "fourth must consume a list");
	    return thing.rest().rest().rest().first();
	},
	
	fifth: function(thing) {
	    checkList(thing, "fifth must consume a list");
	    return thing.rest().rest().rest().rest().first();
	},
	
	
	random: function(x) {
	    check(x, isInteger, "integer");
	    return plt.types.Rational.makeInstance(Math.floor(plt.types.NumberTower.toInteger(x) * 
							      Math.random()),
						   1);
	},
	
	current_dash_seconds: function () {
	    return plt.types.Rational.makeInstance(new Date().getMilliseconds() / 1000);	    
	},


	floor: function(x) {
	    check(x, isNumber, "number");
	    return x.floor();
	},
	
	ceiling: function(x) {
	    check(x, isNumber, "number");
	    return x.ceiling();
	},
	
	sqrt: function(x) {
	    check(x, isNumber, "number");
	    return x.sqrt();
	},

	integer_dash_sqrt: function(x) {
	    check(x, isInteger, "integer");
	    return plt.types.Rational.makeInstance(x.sqrt().toInteger());
	},
	
	sqr: function(x) {
	    check(x, isNumber, "number");
	    return plt.types.NumberTower.sqr(x);
	},
	
	sin: function(x) {
	    check(x, isNumber, "number");
	    return x.sin();
	},
	
	cos: function(x) {
	    check(x, isNumber, "number");
	    return x.cos();
	},
	
	modulo: function(m, n) {
	    check(m, isNumber, "number");
	    check(n, isNumber, "number");
	    return plt.types.NumberTower.modulo(m, n);
	},
	
	zero_question_: function(m) {
	    check(m, isNumber, "number");
	    return plt.types.NumberTower.equal(m, plt.types.Rational.ZERO);
	},
	
	
	_equal__tilde_ : function(x, y, delta) {
	    check(x, isNumber, "number");
	    check(y, isNumber, "number");
	    check(delta, isNumber, "number");
	    return plt.types.NumberTower.approxEqual(x, y, delta);
	},
	
	abs: function(x) {
	    check(x, isNumber, "number");
	    return plt.types.NumberTower.abs(x);
	},
	
	add1 : function(x) {
	    check(x, isNumber, "number");
	    return plt.types.NumberTower.add(x, plt.types.Rational.ONE);
	},
	
	
	sub1 : function(x) {
	    check(x, isNumber, "number");
	    return plt.types.NumberTower.subtract(x, plt.types.Rational.ONE);
	},
	
	
	_plus_ : function(args) {
	    arrayEach(args, function(x) { check(x, isNumber, "number") });
	    var i, sum = plt.types.Rational.ZERO;
	    for(i = 0; i < args.length; i++) {
		sum = plt.types.NumberTower.add(sum, args[i]);
	    }
	    return sum;
	},
	

	_dash_ : function(first, args) {
	    check(first, isNumber, "number");
	    arrayEach(args, function(x) { check(x, isNumber, "number") });
	    if (args.length == 0) {
		return plt.types.NumberTower.subtract
		(plt.types.Rational.ZERO, first);
	    }
	    
	    var i, diff = first;
	    for(i = 0; i < args.length; i++) {
		diff = plt.types.NumberTower.subtract(diff, args[i]);
	    }
	    return diff;
	},
	
	
	_star_ : function(args) {
	    arrayEach(args, function(x) { check(x, isNumber, "number") });
	    var i, prod = plt.types.Rational.ONE;
	    for(i = 0; i < args.length; i++) {
		prod = plt.types.NumberTower.multiply(prod, args[i]);
	    }
	    return prod;    
	},
	
	
	_slash_ : function(first, args) {
	    check(first, isNumber, "number");
	    arrayEach(args, function(x) { check(x, isNumber, "number") });
	    var i, div = first;
	    for(i = 0; i < args.length; i++) {
		div = plt.types.NumberTower.divide(div, args[i]);
	    }
	    return div;    
	},
	

	_equal_ : makeNumericChainingComparator(plt.types.NumberTower.equal),
	_greaterthan__equal_: makeNumericChainingComparator(plt.types.NumberTower.greaterThanOrEqual),
	_lessthan__equal_: makeNumericChainingComparator(plt.types.NumberTower.lessThanOrEqual),
	_greaterthan_: makeNumericChainingComparator(plt.types.NumberTower.greaterThan),
	_lessthan_: makeNumericChainingComparator(plt.types.NumberTower.lessThan),

	
	min : function(first, rest) {
	    check(first, isNumber, "number");
	    arrayEach(rest, function() { check(this, isNumber, "number"); });
	    return chainFind(plt.types.NumberTower.lessThanOrEqual,
			     first, 
			     rest);
	},
	
	max : function(first, rest) {
	    check(first, isNumber, "number");
	    arrayEach(rest, function() { check(this, isNumber, "number"); });
	    return chainFind(plt.types.NumberTower.greaterThanOrEqual,
			     first, 
			     rest);
	},
	

	lcm : function(first, rest) {
	    check(first, isInteger, "number");
	    arrayEach(rest, function() { check(this, isInteger, "number"); });
	    var result = first.toInteger();
	    for (var i = 0; i < rest.length; i++) {
		result = _lcm(result, rest[i].toInteger());
	    }
	    return plt.types.Rational.makeInstance(result);
	},

	
	gcd : function(first, rest) {
	    check(first, isInteger, "number");
	    arrayEach(rest, function() { check(this, isInteger, "number"); });	    
	    var result = first.toInteger();
	    for (var i = 0; i < rest.length; i++) {
		result = _gcd(result, rest[i].toInteger());
	    }
	    return plt.types.Rational.makeInstance(result);
	},

	exact_dash__greaterthan_inexact: function(x) {
	    check(x, isNumber, "number");
	    return plt.types.FloatPoint.makeInstance(x.toFloat());
	},
	
	inexact_dash__greaterthan_exact: function(x) {
	    check(x, isNumber, "number");
	    return plt.types.NumberTower.toExact(x);
	},

	exact_question_ : function(x) {
	    check(x, isNumber, "number");
	    return x.isExact();
	},

	inexact_question_ : function(x) {
	    check(x, isNumber, "number");
	    return ! x.isExact();
	},
	
	rational_question_ : function(x) {
	    return (plt.Kernel.number_question_(x) &&
		    x.isRational());
	},

	number_dash__greaterthan_string: function(x) {
	    check(x, isNumber, "number");
	    return plt.types.String.makeInstance(plt.Kernel.toWrittenString(x));
	},
	
	conjugate: function(x){
	    check(x, isNumber, "number");
	    return x.conjugate();
	},
	
	magnitude: function(x){
	    check(x, isNumber, "number");
	    return x.magnitude();
	},
	
	log : function(x) {
	    check(x, isNumber, "number");
	    return x.log();
	},
	
	angle : function(x) {
	    check(x, isNumber, "number");
	    return x.angle();
	},
	
	atan : function(x) {
	    check(x, isNumber, "number");
	    return x.atan();
	},
	
	expt : function(x, y){
	    check(x, isNumber, "number");
	    check(y, isNumber, "number");
	    return plt.types.NumberTower.expt(x, y);
	},
	
	exp : function(x){
	    check(x, isNumber, "number");
	    return x.exp();
	},
	
	acos : function(x){
	    check(x, isNumber, "number");
	    return x.acos();
	},
	
	asin : function(x){
	    check(x, isNumber, "number");
	    return x.asin();
	},
	
	tan : function(x){
	    check(x, isNumber, "number");
	    return plt.types.NumberTower.divide(x.sin(), x.cos());
	},
	
	complex_question_ : function(x){
	    return isComplex(x);
	},
	
	cosh : function(x) {
	    check(x, isNumber, "number");
	    return this._plus_([this.exp(x), this.exp(x.minus())]).half();
	},
	
	sinh : function(x) {
	    check(x, isNumber, "number");
	    return plt.types.NumberTower.subtract(this.exp(x), this.exp(x.minus())).half();
	},
	
	denominator : function(x) {
	    check(x, isRational, "rational");
	    return plt.types.Rational.makeInstance(x.d, 1);
	},
	
	numerator : function(x){
	    check(x, isRational, "rational");
	    return plt.types.Rational.makeInstance(x.n, 1);
	},
	
	odd_question_ : function(x){
	    check(x, isNumber, "number");
	    return ((x.toInteger() % 2) == 1);
	},
	
	even_question_ : function(x) {
	    check(x, isNumber, "number");
	    return ((x.toInteger() % 2) == 0);
	},
	
	positive_question_ : function(x){
	    check(x, isNumber, "number");
	    return this._greaterthan_(x, plt.types.Rational.ZERO, []);
	},
	
	negative_question_ : function(x){
	    check(x, isNumber, "number");
	    return this._lessthan_(x, plt.types.Rational.ZERO, []);
	},
	
	imag_dash_part : function(x){
	    check(x, isNumber, "number");
	    return x.imag_dash_part();
	},
	
	real_dash_part : function(x){
	    check(x, isNumber, "number");
	    return x.real_dash_part();
	},
	

	make_dash_polar: function(r, theta) {
	    var x = r.toFloat() * Math.cos(theta.toFloat());
	    var y = r.toFloat() * Math.sin(theta.toFloat());
	    return plt.types.Complex.makeInstance(x, y);
	},

	integer_question_ : function(x){
	    check(x, isNumber, "number");
	    return this.equal_question_(x, x.floor());
	},
	
	make_dash_rectangular : function(x, y){
	    return plt.types.Complex.makeInstance(x.toFloat(), y.toFloat());
	},
	
	quotient : function(x, y){
	    check(x, isNumber, "number");
	    check(y, isNumber, "number");
	    return plt.types.Rational.makeInstance(plt.types.NumberTower.divide(x,y).floor().toInteger(),
						   1);
	},
	
	remainder : function(x, y) {
	    check(x, isNumber, "number");
	    check(y, isNumber, "number");
	    return plt.types.Rational.makeInstance(x.toInteger() % y.toInteger(), 1);
	},
	

	real_question_ : function(x){
	    return isReal(x);
	},
	
	
	round : function(x){
	    check(x, isNumber, "number");
	    return x.round();
	},
	
	sgn : function(x){
	    check(x, isNumber, "number");
	    if (this.positive_question_(x).valueOf())
		return plt.types.Rational.ONE;
	    if (this.negative_question_(x).valueOf())
		return plt.types.Rational.NEGATIVE_ONE;
	    else
		return plt.types.Rational.ZERO;
	},
	


	boolean_equal__question_ : function(x, y){
	    check(x, isBoolean, "boolean");
	    check(y, isBoolean, "boolean");
	    return x == y;
	},
	
	boolean_question_ : function(x){
	    return isBoolean(x);
	},
	
	false_question_ : function(x){
	    return (x == plt.types.Logic.FALSE);
	},
	
	not : function(x){
	    check(x, isBoolean, "boolean");
	    return (!(x.valueOf())) ? plt.types.Logic.TRUE : plt.types.Logic.FALSE;
	},
	
	symbol_dash__greaterthan_string : function(x){
	    check(x, isSymbol, "symbol");
	    return plt.types.String.makeInstance(x.val);
	},
	
	symbol_equal__question_ : function(x, y){
	    check(x, isSymbol, "symbol");
	    check(y, isSymbol, "symbol");
	    return (x.val == y.val);
	},
	
	symbol_question_ : function(x){
	    return isSymbol(x);
	},
	
	
	append : function(first, rest){
	    checkList(first, "append must consume lists");
            var ret = first;
	    var i;
	    for (i = 0; i < rest.length; i++) {
		checkList(rest[i], "append must consume lists");
		ret = ret.append(rest[i]);
	    }
	    return ret;
	},
	
	reverse : function(lst){
	    checkList(lst, "reverse must consume a list");
	    var ret = plt.types.Empty.EMPTY;
	    while (!lst.isEmpty()){
		ret = plt.types.Cons.makeInstance(lst.first(), ret);
		lst = lst.rest();
	    }
	    
	    return ret;
	}, 
	
	assq : function(x, lst){
	    checkList(lst, "assq must consume a list");
	    while (!lst.isEmpty() && !plt.Kernel.eq_question_(x, lst.first().first()))
		lst = lst.rest();
	    if (lst.isEmpty())
		return plt.types.Logic.FALSE;
	    else return lst.first();
	},
	
	caaar : function(lst){
	    checkList(lst, "caaar must consume a list");
	    return lst.first().first().first();
	},
	
	caadr : function(lst){
	    checkList(lst, "caadr must consume a list");
	    return lst.first().first().rest();
	},
	
	caar : function(lst){
	    checkList(lst, "caar must consume a list");
	    return lst.first().first();
	},
	
	cadar : function(lst){
	    checkList(lst, "cadar must consume a list");
	    return lst.first().rest().first();
	},
	
	cadddr : function(lst){
	    checkList(lst, "cadddr must consume a list");
	    return lst.rest().rest().rest().first();
	},
	
	caddr : function(lst){
	    checkList(lst, "caddr must consume a list");
	    return lst.rest().rest().first();
	},
	
	cadr : function(lst){
	    checkList(lst, "cadr must consume a list");
	    return lst.rest().first();
	},
	
	car : function(lst){
	    checkList(lst, "car must consume a list");
	    return lst.first();
	},
	
	cdaar : function(lst){
	    checkList(lst, "cdaar must consume a list");
	    return lst.first().first().rest();
	},
	
	cdadr : function(lst){
	    checkList(lst, "cdadr must consume a list");
	    return lst.rest().first().rest();
	},
	
	cdar : function(lst){
	    checkList(lst, "cdar must consume a list");
	    return lst.first().rest();
	},
	
	cddar : function(lst){
	    checkList(lst, "cddar must consume a list");
	    return lst.first().rest().rest();
	},
	
	cdddr : function(lst){
	    checkList(lst, "cdddr must consume a list");
	    return lst.rest().rest().rest();
	},
	
	cddr : function(lst){
	    checkList(lst, "cddr must consume a list");
	    return lst.rest().rest();
	},
	
	cdr : function(lst){
	    checkList(lst, "cdr must consume a list");
	    return lst.rest();
	},

	null_question_ : function(x){
	    return isEmpty(x);
	},
	
	empty_question_: function(x) {
	    return isEmpty(x);
	},
	
	pair_question_ : function(x){
	    return isPair(x);
	},
	
	cons_question_: function(x){
	    return isPair(x);
	},

	
	sixth : function(lst){
	    checkList(lst, "sixth must consume a list");
	    return lst.rest().rest().rest().rest().rest().first();
	},
	
	seventh: function(lst){
	    checkList(lst, "seventh must consume a list");
	    return lst.rest().rest().rest().rest().rest().rest().first();
	},
	
	eighth : function(lst){
	    checkList(lst, "eighth must consume a list");
	    return lst.rest().rest().rest().rest().rest().rest().rest().first();
	},
	
	length : function(lst){
	    checkList(lst, "length must consume a list");
	    var ret = plt.types.Rational.ZERO;
	    for (; !lst.isEmpty(); lst = lst.rest()) {
		ret = plt.Kernel.add1(ret);
	    }
	    return ret;
	},
	
	list : function(items){
	    var ret = plt.types.Empty.EMPTY;
	    for (var i = items.length - 1; i >=0; i--) {
		ret = plt.types.Cons.makeInstance(items[i], ret);
	    }
	    return ret;
	},
	
	list_star_ : function(items, otherItems){
	    var lastListItem = otherItems.pop();
	    if (lastListItem == undefined || ! lastListItem instanceof plt.types.Cons) {
		throw new MobyTypeError("list*: " + lastListItem + " not a list");
	    }
	    otherItems.unshift(items);
	    return plt.Kernel.append(plt.Kernel.list(otherItems), [lastListItem]);
	},
	
	list_dash_ref : function(lst, x){
	    checkList(lst, "list-ref must consume a list");
	    check(x, isNatural, "natural");
	    var i = plt.types.Rational.ZERO;
	    for (; plt.Kernel._lessthan_(i, x,[]); i = plt.Kernel.add1(i)) {
		if (lst.isEmpty()) {
		    throw new MobyRuntimeError("list-ref: index too small");
		}
		else {
		    lst = lst.rest();
		}
	    }
	    return lst.first();
	},
	
	member : function(item, lst){
	    checkList(lst, "member: must consume a list");
	    while (!lst.isEmpty()){
		if (plt.Kernel.equal_question_(item, lst.first()).valueOf())
		    return plt.types.Logic.TRUE;
		lst = lst.rest();
	    }
	    
	    return plt.types.Logic.FALSE;
	},
	
	memq : function(item, lst){
	    checkList(lst, "memq: must consume a list");
	    while (!lst.isEmpty()){
		if (plt.Kernel.eq_question_(item, lst.first()).valueOf())
		    return lst;
		lst = lst.rest();
	    }
	    
	    return plt.types.Logic.FALSE;
	},
	

	memv : function(item, lst){
	    checkList(lst, "memv: must consume a list");
	    while (!lst.isEmpty()){
		if (plt.Kernel.eqv_question_(item, lst.first()).valueOf())
		    return lst;
		lst = lst.rest();
	    }
	    
	    return plt.types.Logic.FALSE;
	},


	memf : function(testF, lst) {
	    checkList(lst, "memf: must consume a list");
	    // TODO: add contract on higher order argument testF.    
	    while (!lst.isEmpty()){
		if (testF([lst.first()])) {
		    return lst;
		}
		lst = lst.rest();
	    }
	    return plt.types.Logic.FALSE;
	},


	compose: function(functions) {
	    // TODO: add contract on higher order argument testF.
	    return function(args) {
		var resultArray = args;
		for (var i = functions.length - 1; i >= 0; i--) {
		    resultArray = [functions[i](resultArray)];
		}
		return resultArray[0];
	    }
	},
	

	string_dash__greaterthan_number : function(str){
	    check(str, isString, "string");
	    var aNum = str * 1;
	    if (isNaN(aNum))
		return plt.types.Logic.FALSE;
	    if (Math.floor(aNum) == aNum) {
		return plt.types.Rational.makeInstance(aNum);
	    }
	    return plt.types.FloatPoint.makeInstance(aNum);
	},
	

	string_dash__greaterthan_symbol : function(str){
	    check(str, isString, "string");
	    return plt.types.Symbol.makeInstance(str);
	},


	string_dash__greaterthan_int: function(str) {
	    check(str, isString, "string");
	    return plt.types.Rational.makeInstance(str.toString().charCodeAt(0), 1);
	},

	
	string_dash_append : function(arr){
	    arrayEach(arr, function(x) { check(x, isString, "string") });
            return plt.types.String.makeInstance(arr.join(""));
	},


	replicate: function(n, s) {
	    check(n, isNatural, "natural");
	    check(s, isString, "string");
	    var buffer = [];
	    for (var i = 0; i < n.toInteger(); i++) {
		buffer.push(s);
	    }
	    return plt.types.String.makeInstance(buffer.join(""));
	},

	
	string_equal__question_ : makeStringChainingComparator(
	    function(x, y){return x == y;}),
	

	string_lessthan__equal__question_: makeStringChainingComparator(
	    function(x, y){return x <= y;}),


	string_lessthan__question_: makeStringChainingComparator(
	    function(x, y){return x < y;}),
	

	string_greaterthan__equal__question_: makeStringChainingComparator(
	    function(x, y){return x >= y;}),
	

	string_greaterthan__question_: makeStringChainingComparator(
	    function(x, y){return x > y;}),
	

	string_dash_ci_equal__question_ : makeStringChainingComparator(
	    function(x, y){return x.toUpperCase() == y.toUpperCase();}),
	

	string_dash_ci_lessthan__equal__question_ : makeStringChainingComparator(
	    function(x, y){return x.toUpperCase() <= y.toUpperCase();}),
	

	string_dash_ci_lessthan__question_ : makeStringChainingComparator(
	    function(x, y){return x.toUpperCase() < y.toUpperCase();}),
	

	string_dash_ci_greaterthan__question_ : makeStringChainingComparator(
	    function(x, y){return x.toUpperCase() > y.toUpperCase();}),
	

	string_dash_ci_greaterthan__equal__question_ : makeStringChainingComparator(
	    function(x, y){return x.toUpperCase() >= y.toUpperCase();}),
	

	string_dash_copy : function(str){
	    check(str, isString, "string");
	    return str.substring(0, str.length);
	},
	
	string_dash_length : function(str){
	    check(str, isString, "string");
	    return plt.types.Rational.makeInstance(str.length, 1);
	},
	
	string_dash_ref : function(str, i){
	    check(str, isString, "string");
	    check(i, isNatural, "natural");
	    if (i.toInteger() >= str.length) {
		throw new MobyRuntimeError("string-ref: index >= length");
	    }
	    return plt.types.String.makeInstance(str.charAt(i.toInteger()));
	},

	string_dash_ith : function (str, i) {
	    check(str, isString, "string");
	    check(i, isNatural, "natural");
	    if (i.toInteger() >= str.length) {
		throw new MobyRuntimeError("string-ith: index >= string length");
	    }
	    return plt.types.String.makeInstance(str.substring(i.toInteger(), i.toInteger()+1));
	},

	int_dash__greaterthan_string: function (i) {
	    check(i, isInteger, "integer");
	    return plt.types.String.makeInstance(String.fromCharCode(i.toInteger()));
	},

	
	string_question_ : function(str){
	    return isString(str);
	},
	

	substring : function(str, begin, end){
	    check(str, isString, "string");
	    check(begin, isNatural, "natural");
	    check(end, isNatural, "natural");
	    if (begin.toInteger() > end.toInteger()) {
		throw new MobyRuntimeError("substring: begin > end");
	    }
	    if (end.toInteger() > str.length) {
		throw new MobyRuntimeError("substring: end > length");
	    }
	    return String.makeInstance(str.substring(begin.toInteger(), end.toInteger()));
	},

	char_question_: function(x) {
	    return isChar(x);
	},
	
	char_dash__greaterthan_integer : function(ch){
	    check(ch, isChar, "char");
	    var str = new String(ch.val);
	    return plt.types.Rational.makeInstance(str.charCodeAt(0), 1);
	},
	
	integer_dash__greaterthan_char : function(n){
	    check(n, isInteger, "integer");
	    var str = String.fromCharCode(n.toInteger());
	    return plt.types.Char.makeInstance(str);
	},
	
	
	char_equal__question_ : makeCharChainingComparator(
	    function(x, y) { return x.val == y.val; }),
	
	char_lessthan__question_ : makeCharChainingComparator(
	    function(x, y){ return x.val < y.val; }),
	
	
	char_lessthan__equal__question_ : makeCharChainingComparator(
	    function(x, y){ return x.val <= y.val; }),

	
	char_greaterthan__question_ : makeCharChainingComparator(
	    function(x, y){ return x.val > y.val; }),
	
	char_greaterthan__equal__question_ : makeCharChainingComparator(
	    function(x, y){ return x.val >= y.val; }),
	
	char_dash_ci_equal__question_ : makeCharChainingComparator(
	    function(x, y){ return x.val.toUpperCase() == y.val.toUpperCase(); }),

	char_dash_ci_lessthan__question_ : makeCharChainingComparator(
	    function(x, y){ return x.val.toUpperCase() < y.val.toUpperCase(); }),


	char_dash_ci_lessthan__equal__question_ : makeCharChainingComparator(
	    function(x, y){ return x.val.toUpperCase() <= y.val.toUpperCase(); }),
	
	char_dash_ci_greaterthan__question_ : makeCharChainingComparator(
	    function(x, y){ return x.val.toUpperCase() > y.val.toUpperCase(); }),

	
	char_dash_ci_greaterthan__equal__question_ : makeCharChainingComparator(
	    function(x, y){ return x.val.toUpperCase() >= y.val.toUpperCase(); }),
	
	
	char_dash_numeric_question_ : function(ch){
	    check(ch, isChar, "char");
	    var str = ch.val;
	    return (str >= "0" && str <= "9");
	},

	char_dash_alphabetic_question_ : function(ch){
	    check(ch, isChar, "char");
	    var str = ch.val;
	    return isAlphabeticString(str);
	},

	char_dash_whitespace_question_ : function(ch){
	    check(ch, isChar, "char");
	    var str = ch.val;
	    return isWhitespaceString(str);
	},

	char_dash_upper_dash_case_question_ : function(ch){
	    check(ch, isChar, "char");
	    return isAlphabeticString(ch.val) && ch.val.toUpperCase() == ch.val;
	},
	
	char_dash_lower_dash_case_question_ : function(ch){
	    check(ch, isChar, "char");
	    return isAlphabeticString(ch.val) && ch.val.toLowerCase() == ch.val;
	},


	char_dash_upcase : function(ch){
	    check(ch, isChar, "char");
	    return plt.types.Char.makeInstance(ch.val.toUpperCase());
	},

	
	char_dash_downcase : function(ch){
	    check(ch, isChar, "char");
	    return plt.types.Char.makeInstance(ch.val.toLowerCase());
	},
	

	
	// list->string: (listof char) -> string
	list_dash__greaterthan_string : function(lst){
	    checkListof(lst, isChar, "listof char");
	    var ret = "";
	    while (!lst.isEmpty()){
		ret += lst.first().val;
		lst = lst.rest();
	    }
	    return plt.types.String.makeInstance(ret);
	},

	implode: function(lst) {
	    checkListof(lst, isString, "listof string");
	    var ret = [];
	    while (!lst.isEmpty()){
		ret.push(lst.first().toString());
		lst = lst.rest();
	    }
	    return plt.types.String.makeInstance(ret.join(""));
	},
	



	string_dash_numeric_question_: function(s) {
	    check(s, isString, "string");
	    for (var i = 0 ; i < s.length; i++) {
		if (s[i] < '0' || s[i] > '9') {
		    return plt.types.Logic.FALSE;
		}
	    }
	    return plt.types.Logic.TRUE;
	},


	string_dash_alphabetic_question_: function(s) {
	    check(s, isString, "string");
	    return isAlphabeticString(s) ? plt.types.Logic.TRUE : plt.types.Logic.FALSE;
	},


	string_dash_whitespace_question_: function(s) {
	    check(s, isString, "string");
	    return isWhitespaceString(s) ? plt.types.Logic.TRUE : plt.types.Logic.FALSE;
	},


	string_dash_upper_dash_case_question_: function(s) {
	    check(s, isString, "string");
	    return isAlphabeticString(s) && s.toUpperCase() == s;
	},


	string_dash_lower_dash_case_question_: function(s) {
	    check(s, isString, "string");
	    return isAlphabeticString(s) && s.toLowerCase() == s;
	},


	string : function(chars) {
	    arrayEach(chars, function() { check(this, isChar, "char"); });
	    var buffer = [];
	    for(var i = 0; i < chars.length; i++) {
		buffer.push(chars[i].val);
	    }
	    return String.makeInstance(buffer.join(""));
	},


	make_dash_string : function(n, ch){
	    check(n, isNatural, "natural");
	    check(ch, isChar, "char");
	    var ret = "";
	    var c = ch.val;
	    var i = plt.types.Rational.ZERO;
	    for (;  plt.Kernel._lessthan_(i, n, []); i = plt.Kernel.add1(i)) {
		ret += c;
	    }
	    return plt.types.String.makeInstance(ret);
	},
	
	string_dash__greaterthan_list : function(str){
	    check(str, isString, "string");
	    var s = str;
	    var ret = plt.types.Empty.EMPTY;
	    for (var i = s.length - 1; i >= 0; i--) {
		ret = plt.types.Cons.makeInstance
		(plt.types.Char.makeInstance(s.charAt(i)),
		 ret);
	    }
	    return ret;
	},


	explode: function (str) {
	    check(str, isString, "string");
	    var s = str;
	    var ret = plt.types.Empty.EMPTY;
	    for (var i = s.length - 1; i >= 0; i--) {
		ret = plt.types.Cons.makeInstance
		(plt.types.String.makeInstance(s.charAt(i)),
		 ret);
	    }
	    return ret;	    
	}



	
    };
    






    // DEBUGGING: get out all the functions defined in the kernel.
    plt.Kernel._dumpKernelSymbols = function() {
	var result = plt.types.Empty.EMPTY;
	for (var sym in plt.Kernel) {
	    result = plt.types.Cons.makeInstance(plt.types.Symbol.makeInstance(sym),
						 result);
	}
	return result;
    };


    function HashTable(inputHash) {
	this.hash = inputHash;
    }


    // kernelMakeImmutableHashEq: list -> hash
    plt.Kernel._kernelMakeImmutableHashEq = function(pairs) {
	var myhash = {};
	while (! pairs.isEmpty()) {
	    var nextPair = pairs.first();
	    var aKey = nextPair.first(); 
	    var aVal = nextPair.rest(); 
	    myhash[aKey] = aVal;
	    pairs = pairs.rest();
	}
	return new HashTable(myhash);
    };

    // plt.Kernel._kernelHashSet: hash object value -> hash
    plt.Kernel._kernelHashSet = function(obj, key, val) {
	var newHash = {};
	var hash = obj.hash;
	for (var k in hash) {
	    newHash[k] = hash[k];
	}
	newHash[key] = val;
	return new HashTable(newHash);
    };

    plt.Kernel._kernelHashRef = function(obj, key, defaultVal) {
	if (key in obj.hash) {
	    return obj.hash[key];
	} else {
	    if (isFunction(defaultVal)) {
		return defaultVal([]);
	    }
	    return defaultVal;
	}
    };
    
    plt.Kernel._kernelHashRemove = function(obj, key) {
	var newHash = {};
	var hash = obj.hash;
    	for (var k in hash) {
	    if (k != key)
    	    	newHash[k] = hash[k];
	}
	return new HashTable(newHash);
    };

    plt.Kernel._kernelHashMap = function(ht, f) {
	var result = plt.types.Empty.EMPTY;
	var key;
	for (key in ht.hash) {
	    var val = ht.hash[key];
	    result = plt.Kernel.cons(f([key, val]),
				     result);
	}
	return result;
    };


    plt.Kernel._resolveModulePath = function(path) {
	return path;
    };

    plt.Kernel._normalizePath = function(path) {
        return path;
    };

    plt.Kernel._pathToString = function(path) {
        return path.toString();
    };


    plt.Kernel.apply = function(f, secondArg, restArgs) {
	var argList;
	var argArray = [];

	if (restArgs.length == 0) {
	    argList = secondArg;
	    checkList(argList, "apply: second argument must be a list");
	    while (! argList.isEmpty()) {
		var elt = argList.first()
		argArray.push(elt);
		argList = argList.rest();
	    }	
	} else {
	    argList = restArgs.pop();
	    checkList(argList, "apply: second argument must be a list");
	    while (! argList.isEmpty()) {
		var elt = argList.first()
		argArray.push(elt);
		argList = argList.rest();
	    }	
	    while(restArgs.length > 0) {
		argArray.unshift(restArgs.pop());
	    }
	    argArray.unshift(secondArg);

	}
	check(f, isFunction, "apply: first argument must be a function");
	return f(argArray);
    };


    plt.Kernel.map = function(f, arglists) {
	arrayEach(arglists, function(x) { 
	    checkList(x, "map: mapped arguments must be lists");});
	// TODO: add contract on higher order argument f.
	var results = plt.types.Empty.EMPTY;
	while (!arglists[0].isEmpty()) {
	    var args = [];
	    for (var i = 0; i < arglists.length; i++) {
		args.push(arglists[i].first());
		arglists[i] = arglists[i].rest();
	    }
	    results = plt.Kernel.cons(f(args), results);
	}
	return plt.Kernel.reverse(results);
    };



    plt.Kernel.andmap = function(f, arglists) {
	arrayEach(arglists, function(x) { 
	    checkList(x, "andmap: mapped arguments must be lists");});

	// TODO: add contract on higher order argument f.
	while (!arglists[0].isEmpty()) {
	    var args = [];
	    for (var i = 0; i < arglists.length; i++) {
		args.push(arglists[i].first());
		arglists[i] = arglists[i].rest();
	    }
	    if (! f(args)) {
		return plt.types.Logic.FALSE;
	    }
	}

	return plt.types.Logic.TRUE;
    };



    plt.Kernel.ormap = function(f, arglists) {
	arrayEach(arglists, function(x) { 
	    checkList(x, "ormap: mapped arguments must be lists");});
	// TODO: add contract on higher order argument f.
	while (!arglists[0].isEmpty()) {
	    var args = [];
	    for (var i = 0; i < arglists.length; i++) {
		args.push(arglists[i].first());
		arglists[i] = arglists[i].rest();
	    }
	    if (f(args)) {
		return plt.types.Logic.TRUE;
	    }
	}
	return plt.types.Logic.FALSE;
    };





    plt.Kernel.filter = function(f, elts) {
	check(elts, isList, "list");
	// TODO: add contract on higher order argument f.
	var results = plt.types.Empty.EMPTY;
	while (! elts.isEmpty()) {
	    if (f([elts.first()])) {
		results = plt.types.Cons.makeInstance(elts.first(), results);
	    }
	    elts = elts.rest();
	}
	return plt.Kernel.reverse(results);
    };


    plt.Kernel.foldl = function(f, acc, arglists) {
	arrayEach(arglists, function(x) { check(x, isList, "list")});
	// TODO: add contract on higher order argument f.
	var result = acc;
	while (!arglists[0].isEmpty()) {
	    var args = [];
	    for (var i = 0; i < arglists.length; i++) {
		args.push(arglists[i].first());
		arglists[i] = arglists[i].rest();
	    }
	    args.push(result);
	    result = f(args);
	}
	return result;
    };


    plt.Kernel.foldr = function(f, acc, arglists) {
	arrayEach(arglists, function(x) { check(x, isList, "list")});
	// TODO: add contract on higher order argument f.
	var result = acc;
	for (var i = 0; i < arglists.length; i++) {
	    arglists[i] = plt.Kernel.reverse(arglists[i]);
	}
	while (!arglists[0].isEmpty()) {
	    var args = [];
	    for (var i = 0; i < arglists.length; i++) {
		args.push(arglists[i].first());
		arglists[i] = arglists[i].rest();
	    }
	    args.push(result);
	    result = f(args);
	}
	return result;
    };



    plt.Kernel.argmin = function(f, elts) {
	check(elts, isPair, "nonempty list");
	// TODO: add contract on higher order argument f.
	var bestSoFar = elts.first();
	var bestMetric = f([elts.first()]).toFloat();
	elts = elts.rest();

	while (! elts.isEmpty()) {
	    var nextMetric = f([elts.first()]).toFloat();
	    if (nextMetric < bestMetric) {
		bestSoFar = elts.first();
		bestMetric = nextMetric;
	    }
	    elts = elts.rest();
	}
	return bestSoFar;
    };


    plt.Kernel.argmax = function(f, elts) {
	check(elts, isPair, "nonempty list");
	// TODO: add contract on higher order argument f.
	var bestSoFar = elts.first();
	var bestMetric = f([elts.first()]).toFloat();
	elts = elts.rest();

	while (! elts.isEmpty()) {
	    var nextMetric = f([elts.first()]).toFloat();
	    if (nextMetric > bestMetric) {
		bestSoFar = elts.first();
		bestMetric = nextMetric;
	    }
	    elts = elts.rest();
	}
	return bestSoFar;
    };






    plt.Kernel.sort = function(l, cmpF) {
	check(l, isList, "list");
	// TODO: add contract on higher order argument cmpF.
	var arr = [];
	while(!l.isEmpty()) {
	    arr.push(l.first());
	    l = l.rest();
	}
	arr.sort(function(x, y) { return cmpF([x, y]) ? -1 : 1; });
	return plt.Kernel.list(arr);
    };

    plt.Kernel.quicksort = plt.Kernel.sort;



    plt.Kernel.build_dash_list = function(n, f) {
	check(n, isNatural, "natural");
	// TODO: add contract on higher order argument f.
	var result = plt.types.Empty.EMPTY;
	for(var i = 0; i < n.toInteger(); i++) {
	    result = plt.Kernel.cons(f([plt.types.Rational.makeInstance(i, 1)]),
				     result);
	}
	return plt.Kernel.reverse(result);
    };


    plt.Kernel.build_dash_string = function(n, f) {
	check(n, isNatural, "natural");
	// TODO: add contract on higher order argument f.
	var chars = [];
	for(var i = 0; i < n.toInteger(); i++) {
	    var ch = f([plt.types.Rational.makeInstance(i, 1)]);
	    check(ch, isChar, "char");
	    chars.push(ch.val);
	}
	return plt.types.String.makeInstance(chars.join(""));
    };




    plt.Kernel.format = function(formatStr, args) {
	check(formatStr, isString, "string");
	var pattern = new RegExp("~[sSaAn%~]", "g");
	var buffer = args;
	function f(s) {
	    if (s == "~~") {
		return "~";
	    } else if (s == '~n' || s == '~%') {
		return "\n";
	    } else if (s == '~s' || s == "~S") {
		if (buffer.length == 0) {
		    throw new MobyRuntimeError(
			"format: fewer arguments passed than expected");
		}
		return plt.Kernel.toWrittenString(buffer.shift());
	    } else if (s == '~a' || s == "~A") {
		if (buffer.length == 0) {
		    throw new MobyRuntimeError(
			"format: fewer arguments passed than expected");
		}
		return plt.Kernel.toDisplayedString(buffer.shift());
	    } else {
		throw new MobyRuntimeError("Unimplemented format " + s);
	    }
	}
	var result = plt.types.String.makeInstance(formatStr.replace(pattern, f));
	if (buffer.length > 0) {
	    throw new MobyRuntimeError("format: More arguments passed than expected");
	}
	return result;
    }


    // args: arrayof plt.types.Char
    plt.Kernel.string = function(args) {
	var vals = [];
	for(var i = 0; i < args.length; i++) {
	    vals.push(args[i].getValue());
	}
	return plt.types.String.makeInstance(vals.join(""));
    };

    


    plt.Kernel.procedure_question_ = function(f) {
	return isFunction(f);
    };
    

    










    
    
    // Posns
    
    function posn(x,y) { 
	plt.Kernel.Struct.call(this, "make-posn", [x, y]);
	this.x = x;
	this.y = y; 
    }

    posn.prototype = heir(plt.Kernel.Struct.prototype);

    posn.prototype.isEqual = function(other) {
        if (other != null & other != undefined && other instanceof posn) {
            return (((plt.Kernel.equal_question_((posn_dash_y(this)),(posn_dash_y(other)))))&&((((plt.Kernel.equal_question_((posn_dash_x(this)),(posn_dash_x(other)))))&&(plt.types.Logic.TRUE))));
        } else {
            return plt.types.Logic.FALSE;
        }
    } 

    posn.prototype.toWrittenString = function() {
	return ("(make-posn " + plt.Kernel.toWrittenString(this.x) +
		" " + plt.Kernel.toWrittenString(this.y) + ")");
    }

    posn.prototype.toDisplayedString = function () {
	return "(make-posn " + this.x.toDisplayedString() + " " + this.y.toDisplayedString() + ")";
    }

    function make_dash_posn(id0,id1) { 
	return new posn(id0,id1); 
    }

    function posn_dash_x(obj) { 
	check(obj, posn_question_, "posn");
	return obj.x; 
    }

    function posn_dash_y(obj) { 
	check(obj, posn_question_, "posn");
	return obj.y; 
    }

    function posn_question_(obj) { 
        return obj != null && obj != undefined && obj instanceof posn ; 
    }
    
    plt.Kernel.make_dash_posn = make_dash_posn;
    plt.Kernel.posn_question_ = posn_question_;
    plt.Kernel.posn_dash_x = posn_dash_x;
    plt.Kernel.posn_dash_y = posn_dash_y;
    
    

    plt.Kernel.error = function(name, msg) {
	check(name, isSymbol, "name");
	check(msg, isString, "string");
	throw new MobyRuntimeError(plt.Kernel.format("~a: ~a", [name, msg]).toString());
    };




    // Base class for all images.
    function BaseImage(pinholeX, pinholeY) {
	this.pinholeX = pinholeX;
	this.pinholeY = pinholeY;
    }
    plt.Kernel.BaseImage = BaseImage;


    BaseImage.prototype.updatePinhole = function(x, y) {
	var aCopy = {};
	for (attr in this) {
	    aCopy[attr] = this[attr];
	}
	aCopy.pinholeX = x;
	aCopy.pinholeY = y;
	return aCopy;
    };


    BaseImage.prototype.render = function(ctx, x, y) {
	throw new MobyRuntimeError("Unimplemented method render");
    };


    BaseImage.prototype.toDomNode = function() {
	var canvas = document.createElement("canvas");
 	canvas.width = plt.world.Kernel.imageWidth(this).toInteger();
 	canvas.height = plt.world.Kernel.imageHeight(this).toInteger();
	var ctx = canvas.getContext("2d");
	this.render(ctx, 0, 0);
	return canvas;
    };
    BaseImage.prototype.toWrittenString = function() { return "<image>"; }
    BaseImage.prototype.toDisplayedString = function() { return "<image>"; }



    plt.Kernel.image_question_ = function(thing) {
	return isImage(thing);
    };


    plt.Kernel.image_equal__question_ = function(thing, other) {
	check(thing, isImage, "image");
	check(other, isImage, "image");
	return thing == other ? plt.types.Logic.TRUE : plt.types.Logic.FALSE;
    };



    plt.Kernel.toWrittenString = function(x) {
	if (x == undefined || x == null) {
	    throw new MobyRuntimeError("value must not be null or undefined");
	}
	if (typeof(x) == 'string') {
	    return x.toWrittenString();
	}
	if (typeof(x) != 'object' && typeof(x) != 'function') {
	    return x.toString();
	}
	if ('toWrittenString' in x) {
	    return x.toWrittenString();
	}
	if ('toDisplayedString' in x) {
	    return x.toDisplayedString();
	} else {
	    return x.toString();
	}
    };


    plt.Kernel.toDisplayedString = function(x) {
	if (x == undefined || x == null) {
	    throw new MobyRuntimeError("value must not be null or undefined");
	}
	if (typeof(x) == 'string') {
	    return x.toDisplayedString();
	}
	if (typeof(x) != 'object' && typeof(x) != 'function') {
	    return x.toString();
	}
	if ('toWrittenString' in x) {
	    return x.toWrittenString();
	}
	if ('toDisplayedString' in x) {
	    return x.toDisplayedString();
	} else {
	    return x.toString();
	}
    };



    // toDomNode: scheme-value -> dom-node
    plt.Kernel.toDomNode = function(x) {
	if (x == undefined || x == null) {
	    throw new MobyRuntimeError("value must not be null or undefined");
	}
	if (typeof(x) == 'string') {
	    var node = document.createTextNode(x.toWrittenString());
	    return node;
	}
	if (typeof(x) != 'object' && typeof(x) != 'function') {
	    var node = document.createTextNode(x.toString());
	    return node;
	}
	if ('toDomNode' in x) {
	    return x.toDomNode();
	}
	if ('toWrittenString' in x) {
	    var node = document.createTextNode(x.toWrittenString());
	    return node;
	}
	if ('toDisplayedString' in x) {
	    var node = document.createTextNode(x.toDisplayedString());
	    return node;
	} else {
	    var node = document.createTextNode(x.toString());
	    return node;
	}
    };




    plt.Kernel.Struct.prototype.toWrittenString = function() { 
	var buffer = [];
	buffer.push("(");
	buffer.push(this._constructorName);
	for(var i = 0; i < this._fields.length; i++) {
	    buffer.push(" ");
	    buffer.push(plt.Kernel.toWrittenString(this._fields[i]));
	}
	buffer.push(")");
	return plt.types.String.makeInstance(buffer.join(""));
    };

    plt.Kernel.Struct.prototype.toDisplayedString = plt.Kernel.Struct.prototype.toWrittenString;

    plt.Kernel.Struct.prototype.toDomNode = function() {
	var node = document.createElement("div");
	node.appendChild(document.createTextNode("("));
	node.appendChild(document.createTextNode(this._constructorName));
	for(var i = 0; i < this._fields.length; i++) {
	    node.appendChild(document.createTextNode(" "));
	    node.appendChild(plt.Kernel.toDomNode(this._fields[i]));
	}
	node.appendChild(document.createTextNode(")"));
	return node;
    }





    // Expose the predicates.
    plt.Kernel.isSymbol = isSymbol;
    plt.Kernel.isChar = isChar;
    plt.Kernel.isString = isString;
    plt.Kernel.isBoolean = isBoolean;
    plt.Kernel.isPair = isPair;
    plt.Kernel.isEmpty = isEmpty;
    plt.Kernel.isReal = isReal;
    plt.Kernel.isRational = isRational;
    plt.Kernel.isComplex = isComplex;
    plt.Kernel.isInteger = isInteger;
    plt.Kernel.isNatural = isNatural;
    plt.Kernel.isNumber = isNumber;
    plt.Kernel.isAlphabeticString = isAlphabeticString;
    plt.Kernel.isWhitespaceString = isWhitespaceString;
    plt.Kernel.isImage = isImage;
    plt.Kernel.isList = isList;
    plt.Kernel.isFunction = isFunction;
    

    plt.Kernel.arrayEach = arrayEach;

    // Expose the runtime type checkers.
    plt.Kernel.check = check;
    plt.Kernel.checkList = checkList;
    plt.Kernel.checkListof = checkListof;


    // Expose the error classes.
    plt.Kernel.MobyError = MobyError;
    plt.Kernel.MobyTypeError = MobyTypeError;
    plt.Kernel.MobyRuntimeError = MobyRuntimeError;
    
})();
