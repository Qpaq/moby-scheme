var plt = plt || {};


// Depends on kernel.js.
(function() {


    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    // Types
    
    plt.types = plt.types || {};
    


    // We are reusing the built-in Javascript boolean class here.
    plt.types.Logic = {
	TRUE : true,
	FALSE : false
    };
    
    Boolean.prototype.toWrittenString = function() {
	if (this.valueOf()) { return "true"; }
	return "false";
    };
    Boolean.prototype.toDisplayedString = Boolean.prototype.toWrittenString;


    Boolean.prototype.isEqual = function(other){
	return this == other;
    };




    // Chars
    // Char: string -> Char
    plt.types.Char = function(val){
	this.val = val;
    };
    
    plt.types.Char.makeInstance = function(val){
	return new plt.types.Char(val);
    };

    plt.types.Char.prototype.toWrittenString = function() {
	return "#\\" + this.val;
    };

    plt.types.Char.prototype.toDisplayedString = function () {
        return this.val;
    };

    plt.types.Char.prototype.getValue = function() {
	return this.val;
    };

    plt.types.Char.prototype.isEqual = function(other){
	return other instanceof plt.types.Char && this.val == other.val;
    };
    
    // Symbols


    plt.types.Symbol = function(val) {
	this.val = val;
    };

    var symbolCache = {};
    
    // makeInstance: string -> Symbol.
    plt.types.Symbol.makeInstance = function(val) {
	// To ensure that we can eq? symbols with equal values.
	if (!(val in symbolCache)) {
	    symbolCache[val] = new plt.types.Symbol(val);
	}
	return symbolCache[val];
    };
    
    plt.types.Symbol.prototype.isEqual = function(other) {
	return other instanceof plt.types.Symbol &&
	    this.val == other.val;
    };
    

    plt.types.Symbol.prototype.toString = function() {
        return this.val;
    };

    plt.types.Symbol.prototype.toWrittenString = function() {
	return this.val;
    };

    plt.types.Symbol.prototype.toDisplayedString = function() {
	return this.val;
    };

    
    
    
    plt.types.Empty = function() {};
    plt.types.Empty.EMPTY = new plt.types.Empty();


    plt.types.Empty.prototype.isEqual = function(other) {
	return other instanceof plt.types.Empty;
    };

    plt.types.Empty.prototype.first = function() {
	throw new plt.Kernel.MobyRuntimeError("first can't be applied on empty.");
    };
    plt.types.Empty.prototype.rest = function() {
	throw new plt.Kernel.MobyRuntimeError("rest can't be applied on empty.");
    };
    plt.types.Empty.prototype.isEmpty = function() {
	return true;
    };
    plt.types.Empty.prototype.toWrittenString = function() { return "empty"; };
    plt.types.Empty.prototype.toDisplayedString = function() { return "empty"; };



    
    // Empty.append: (listof X) -> (listof X)
    plt.types.Empty.prototype.append = function(b){
	return b;
    }
    
    plt.types.Cons = function(f, r) {
	this.f = f;
	this.r = r;
    };
    
    plt.types.Cons.makeInstance = function(f, r) {
	return new plt.types.Cons(f, r);
    };


    plt.types.Cons.prototype.isEqual = function(other) {
	if (! (other instanceof plt.types.Cons)) {
	    return plt.types.Logic.FALSE;
	}
	return (plt.Kernel.equal_question_(this.first(), other.first()) &&
		plt.Kernel.equal_question_(this.rest(), other.rest()));
    };
    
    plt.types.Cons.prototype.first = function() {
	return this.f;
    };
    
    plt.types.Cons.prototype.rest = function() {
	return this.r;
    };
    
    plt.types.Cons.prototype.isEmpty = function() {
	return false;
    };
    
    // Cons.append: (listof X) -> (listof X)
    plt.types.Cons.prototype.append = function(b){
	if (b.isEmpty())
	    return this;
	var ret = b;
	var lst = plt.Kernel.reverse(this);
	while (!lst.isEmpty()){
	    ret = plt.types.Cons.makeInstance(lst.first(), ret);
	    lst = lst.rest();
	}
	
	return ret;
    };
    
    plt.types.Cons.prototype.toWrittenString = function() {
	var texts = [];
	var p = this;
	while (! p.isEmpty()) {
	    texts.push(p.first().toWrittenString());
	    p = p.rest();
	}
	return "(" + texts.join(" ") + ")";
    };


    plt.types.Cons.prototype.toDisplayedString = function() {
	var texts = [];
	var p = this;
	while (! p.isEmpty()) {
	    texts.push(p.first().toDisplayedString());
	    p = p.rest();
	}
	return "(" + texts.join(" ") + ")";
    };

    
    // Rationals
    
    function gcd(a, b) {
	var t;
	if (isNaN(a) || !isFinite(a)) {
	    throw new plt.Kernel.MobyRuntimeError("not a number: " + a);
	}
	if (isNaN(b) || !isFinite(b)) {
	    throw new plt.Kernel.MobyRuntimeError("not a number: " + b);
	}
	while (b != 0) {
	    t = a;
	    a = b;
	    b = t % b;
	}
	return a;
    }
    
    plt.types.Rational = function(n, d) {
	if (d == undefined) { d = 1; }
	var divisor = gcd(Math.abs(n), Math.abs(d));
	this.n = n / divisor;
	this.d = d / divisor;
    };
    
    plt.types.Rational.prototype.toWrittenString = function() {
	if (this.d == 1) {
	    return this.n + "";
	} else {
	    return this.n + "/" + this.d;
	}
    };

    plt.types.Rational.prototype.toDisplayedString = plt.types.Rational.prototype.toWrittenString;

    
    plt.types.Rational.prototype.level = function() {
	return 0;
    };
    
    
    plt.types.Rational.prototype.lift = function(target) {
	if (target.level() == 1)
	    return plt.types.FloatPoint.makeInstance(this.n / this.d);
	if (target.level() == 2)	
	    return plt.types.Complex.makeInstance(this.n / this.d, 0);
	throw new plt.Kernel.MobyRuntimeError("invalid level of Number");
    };
    
    plt.types.Rational.prototype.isEqual = function(other) {
	return other instanceof plt.types.Rational &&
	    this.n == other.n &&
	    this.d == other.d;
    };

    plt.types.Rational.prototype.isRational = function() {
        return true;
    };
    
    plt.types.Rational.prototype.isReal = function() {
	return true;
    };

    
    plt.types.Rational.prototype.add = function(other) {
	return plt.types.Rational.makeInstance(this.n * other.d + 
					       this.d * other.n,
					       this.d * other.d);
    };
    
    plt.types.Rational.prototype.subtract = function(other) {
	return plt.types.Rational.makeInstance((this.n * other.d) - 
					       (this.d * other.n),
					       (this.d * other.d));
    };
    
    plt.types.Rational.prototype.multiply = function(other) {
	return plt.types.Rational.makeInstance(this.n * other.n,
					       this.d * other.d);
    };
    
    plt.types.Rational.prototype.divide = function(other) {
	return plt.types.Rational.makeInstance(this.n * other.d,
					       this.d * other.n);
    };
    

    plt.types.Rational.prototype.toExact = function() { 
	return this;
    };

    plt.types.Rational.prototype.isExact = function() {
        return true;
    };
    
    plt.types.Rational.prototype.toInteger = function() {
	return Math.floor(this.n / this.d);  
    };
    
    plt.types.Rational.prototype.toFloat = function() {
	return this.n / this.d;
    };
    
    plt.types.Rational.prototype.toComplex = function(){
	return plt.types.Complex.makeInstance(this.n / this.d, 0);
    };
    
    plt.types.Rational.prototype.greaterThan = function(other) {
	return this.n*other.d > this.d*other.n;
    };

    plt.types.Rational.prototype.greaterThanOrEqual = function(other) {
	return this.n*other.d >= this.d*other.n;
    };
    
    plt.types.Rational.prototype.lessThan = function(other) {
	return this.n*other.d < this.d*other.n;
    };

    plt.types.Rational.prototype.lessThanOrEqual = function(other) {
	return this.n*other.d <= this.d*other.n;
    };

    
    plt.types.Rational.prototype.sqrt = function() {
	var result = Math.sqrt(this.n / this.d);
	if (result == Math.floor(result)) {
	    return plt.types.Rational.makeInstance(result, 1);
	} else {
	    return plt.types.FloatPoint.makeInstance(result);
	}
    };
    
    plt.types.Rational.prototype.abs = function() {
	return plt.types.Rational.makeInstance(Math.abs(this.n),
					       this.d);
    };
    
    plt.types.Rational.prototype.floor = function() {
	return plt.types.Rational.makeInstance(Math.floor(this.n / this.d), 1);
    };
    
    
    plt.types.Rational.prototype.ceiling = function() {
	return plt.types.Rational.makeInstance(Math.ceil(this.n / this.d), 1);
    };
    
    plt.types.Rational.prototype.conjugate = plt.types.Rational.prototype.abs;
    
    plt.types.Rational.prototype.magnitude = plt.types.Rational.prototype.abs;
    
    plt.types.Rational.prototype.log = function(){
	return plt.types.FloatPoint.makeInstance(Math.log(this.n / this.d));
    };
    
    plt.types.Rational.prototype.angle = function(){
	if (0 == this.n)
	    throw new plt.Kernel.MobyRuntimeError("angle: undefined for 0");
	if (this.n > 0)
	    return plt.types.Rational.ZERO;
	else
	    return plt.Kernel.pi;
    };
    
    plt.types.Rational.prototype.atan = function(){
	return plt.types.FloatPoint.makeInstance(Math.atan(this.n / this.d));
    };
    
    plt.types.Rational.prototype.cos = function(){
	return plt.types.FloatPoint.makeInstance(Math.cos(this.n / this.d));
    };
    
    plt.types.Rational.prototype.sin = function(){
	return plt.types.FloatPoint.makeInstance(Math.sin(this.n / this.d));
    };
    
    plt.types.Rational.prototype.expt = function(a){
	return plt.types.FloatPoint.makeInstance(Math.pow(this.n / this.d, a.n / a.d));
    };
    
    plt.types.Rational.prototype.exp = function(){
	return plt.types.FloatPoint.makeInstance(Math.exp(this.n / this.d));
    };
    
    plt.types.Rational.prototype.acos = function(){
	return plt.types.FloatPoint.makeInstance(Math.acos(this.n / this.d));
    };
    
    plt.types.Rational.prototype.asin = function(){
	return plt.types.FloatPoint.makeInstance(Math.asin(this.n / this.d));
    };
    
    plt.types.Rational.prototype.imag_dash_part = function(){
	return plt.types.Rational.ZERO;
    };
    
    plt.types.Rational.prototype.real_dash_part = function(){
	return this;
    };
    
    plt.types.Rational.prototype.round = function(){
	return this;
    };
    
    
    plt.types.Rational.prototype.half = function(){
	return plt.types.Rational.makeInstance(this.n, this.d * 2);
    };
    
    plt.types.Rational.prototype.minus = function(){
	return plt.types.Rational.makeInstance(0 - this.n, this.d);
    };
    
    
    var _rationalCache = {};
    plt.types.Rational.makeInstance = function(n, d) {
	if (n == undefined)
	    throw new plt.Kernel.MobyRuntimeError("n undefined");

	if (d == undefined) { d = 1; }

	
	if (d < 0) {
	    n = -n;
	    d = -d;
	}
	
	if (d == 1 && n in _rationalCache) {
	    return _rationalCache[n];
	}
	else {
	    return new plt.types.Rational(n, d);
	}
    };
    
    _rationalCache = {};
    (function() {
	var i;
	for(i = -500; i < 500; i++) {
	    _rationalCache[i] = new plt.types.Rational(i, 1);
	}
    })();
    plt.types.Rational.NEGATIVE_ONE = _rationalCache[-1];
    plt.types.Rational.ZERO = _rationalCache[0];
    plt.types.Rational.ONE = _rationalCache[1];
    
    
    
    
    
    
    plt.types.FloatPoint = function(n) {
	this.n = n;
    };
    
    plt.types.FloatPoint.prototype.toExact = function() {
	return plt.types.Rational.makeInstance(Math.floor(this.n), 1);
    };

    plt.types.FloatPoint.prototype.isExact = function() {
	return false;
    };


    plt.types.FloatPoint.prototype.level = function() {
	return 1;
    };
    
    plt.types.FloatPoint.prototype.lift = function(target) {
	return plt.types.Complex.makeInstance(this.n, 0);
    };
    
    plt.types.FloatPoint.prototype.toWrittenString = function() {
	return this.n.toString();
    };
    
    plt.types.FloatPoint.prototype.toDisplayedString = plt.types.FloatPoint.prototype.toWrittenString;


    plt.types.FloatPoint.prototype.isEqual = function(other) {
	return other instanceof plt.types.FloatPoint &&
	    this.n == other.n;
    };


    plt.types.FloatPoint.prototype.isRational = function() {
        return false;
    };

    plt.types.FloatPoint.prototype.isReal = function() {
	return true;
    };
    
    plt.types.FloatPoint.prototype.add = function(other) {
	return plt.types.FloatPoint.makeInstance(this.n + other.n);
    };
    
    plt.types.FloatPoint.prototype.subtract = function(other) {
	return plt.types.FloatPoint.makeInstance(this.n - other.n);
    };
    
    plt.types.FloatPoint.prototype.multiply = function(other) {
	return plt.types.FloatPoint.makeInstance(this.n * other.n);
    };
    
    plt.types.FloatPoint.prototype.divide = function(other) {
        return plt.types.FloatPoint.makeInstance(this.n / other.n);
    };
    
    
    plt.types.FloatPoint.prototype.toInteger = function() {
	return Math.floor(this.n);  
    };
    
    plt.types.FloatPoint.prototype.toFloat = function() {
	return this.n;
    };
    
    plt.types.FloatPoint.prototype.toComplex = function(){
	return plt.types.Complex.makeInstance(this.n, 0);
    };
    
    plt.types.FloatPoint.prototype.floor = function() {
	return plt.types.Rational.makeInstance(Math.floor(this.n), 1);
    };
    
    plt.types.FloatPoint.prototype.ceiling = function() {
	return plt.types.Rational.makeInstance(Math.ceil(this.n), 1);
    };
    


    plt.types.FloatPoint.prototype.greaterThan = function(other) {
	return this.n > other.n;
    };
    
    plt.types.FloatPoint.prototype.greaterThanOrEqual = function(other) {
	return this.n >= other.n;
    };
    
    plt.types.FloatPoint.prototype.lessThan = function(other) {
	return this.n < other.n;
    };
    
    plt.types.FloatPoint.prototype.lessThanOrEqual = function(other) {
	return this.n <= other.n;
    };

    
    plt.types.FloatPoint.prototype.sqrt = function() {
	if (this.n < 0)
	    return plt.types.Complex.makeInstance(0, Math.sqrt(0 - this.n));
	else
	    return plt.types.FloatPoint.makeInstance(Math.sqrt(this.n));
    };
    
    plt.types.FloatPoint.prototype.abs = function() {
	return plt.types.FloatPoint.makeInstance(Math.abs(this.n));
    };
    
    plt.types.FloatPoint.makeInstance = function(n) {
	return new plt.types.FloatPoint(n);
    };
    
    plt.types.FloatPoint.prototype.log = function(){
	if (this.n < 0)
	    return this.toComplex().log();
	else
	    return plt.types.FloatPoint.makeInstance(Math.log(this.n));
    };
    
    plt.types.FloatPoint.prototype.angle = function(){
	if (0 == this.n)
	    throw new plt.Kernel.MobyRuntimeError("angle: undefined for 0");
	if (this.n > 0)
	    return plt.types.Rational.ZERO;
	else
	    return plt.Kernel.pi;
    };
    
    plt.types.FloatPoint.prototype.atan = function(){
	return plt.types.FloatPoint.makeInstance(Math.atan(this.n));
    };
    
    plt.types.FloatPoint.prototype.cos = function(){
	return plt.types.FloatPoint.makeInstance(Math.cos(this.n));
    };
    
    plt.types.FloatPoint.prototype.sin = function(){
	return plt.types.FloatPoint.makeInstance(Math.sin(this.n));
    };
    
    plt.types.FloatPoint.prototype.expt = function(a){
	return plt.types.FloatPoint.makeInstance(Math.pow(this.n, a.n));
    };
    
    plt.types.FloatPoint.prototype.exp = function(){
	return plt.types.FloatPoint.makeInstance(Math.exp(this.n));
    };
    
    plt.types.FloatPoint.prototype.acos = function(){
	return plt.types.FloatPoint.makeInstance(Math.acos(this.n));
    };
    
    plt.types.FloatPoint.prototype.asin = function(){
	return plt.types.FloatPoint.makeInstance(Math.asin(this.n));
    };
    
    plt.types.FloatPoint.prototype.imag_dash_part = function(){
	return plt.types.Rational.ZERO;
    };
    
    plt.types.FloatPoint.prototype.real_dash_part = function(){
	return this;
    };
    
    
    plt.types.FloatPoint.prototype.round = function(){
	if (plt.types.NumberTower.lessThan(this.subtract(plt.types.FloatPoint.makeInstance(0.5)).floor(), this.floor()).valueOf())
	    return this.floor();
	else 
	    return this.ceiling();
	
    };
    
    
    plt.types.FloatPoint.prototype.conjugate = plt.types.FloatPoint.prototype.abs;
    
    plt.types.FloatPoint.prototype.magnitude = plt.types.FloatPoint.prototype.abs;
    
    plt.types.FloatPoint.prototype.minus = function(){
	return plt.types.FloatPoint.makeInstance(0 - this.n);
    };
    
    plt.types.FloatPoint.prototype.half = function(){
	return plt.types.FloatPoint.makeInstance(this.n / 2);
    };	
    
    plt.types.FloatPoint.prototype.timesI = function(){
	return plt.types.Complex.makeInstance(0, this.n);
    };
    
    
    plt.types.Complex = function(r, i){
	this.r = plt.types.FloatPoint.makeInstance(r);
	this.i = plt.types.FloatPoint.makeInstance(i);
    };
    
    plt.types.Complex.makeInstance = function(r, i){
	return new plt.types.Complex(r, i);
    };
    
    plt.types.Complex.prototype.toWrittenString = function() {
        return this.r.toWrittenString() + "+" + this.i.toWrittenString()+"i";
    };

    plt.types.Complex.prototype.toDisplayedString = plt.types.Complex.prototype.toWrittenString;


    plt.types.Complex.prototype.isRational = function() {
        return false;
    };

    plt.types.Complex.prototype.toExact = function() { 
	if (! this.isReal()) {
	    throw new plt.Kernel.MobyRuntimeError("inexact->exact: expects argument of type real number");
	}
	return this.r.toExact();
    };

    plt.types.Complex.prototype.isExact = function() { 
        // FIXME: correct this when the numerator and denominator are
        // represented as generic numbers, and not as floats.
        return false;
    };



    plt.types.Complex.prototype.level = function(){
	return 2;
    };
    
    plt.types.Complex.prototype.lift = function(target){
	throw new plt.Kernel.MobyRuntimeError("Don't know how to lift Complex number");
    };
    
    plt.types.Complex.prototype.isEqual = function(other){
	return other instanceof plt.types.Complex  && this.r.isEqual(other.r) && this.i.isEqual(other.i);
    };

    plt.types.Complex.prototype.greaterThan = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    throw new plt.Kernel.MobyRuntimeError(">: expects argument of type real number");
	}
	return this.r.greaterThan(other.r);
    };

    plt.types.Complex.prototype.greaterThanOrEqual = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    throw new plt.Kernel.MobyRuntimeError(">: expects argument of type real number");
	}
	return this.r.greaterThanOrEqual(other.r);
    };

    plt.types.Complex.prototype.lessThan = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    throw new plt.Kernel.MobyRuntimeError(">: expects argument of type real number");
	}
	return this.r.lessThan(other.r);
    };

    plt.types.Complex.prototype.lessThanOrEqual = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    throw new plt.Kernel.MobyRuntimeError(">: expects argument of type real number");
	}
	return this.r.lessThanOrEqual(other.r);
    };


    
    plt.types.Complex.prototype.abs = function(){
	if (!plt.types.NumberTower.equal(this.i, plt.types.Rational.ZERO).valueOf())
	    throw new plt.Kernel.MobyRuntimeError("abs: expects argument of type real number");
	return this.r.abs();
    };
    
    plt.types.Complex.prototype.toInteger = function(){
	if (!plt.types.NumberTower.equal(this.i, plt.types.Rational.ZERO).valueOf())
	    throw new plt.Kernel.MobyRuntimeError("toInteger: expects argument of type real number");
	return this.r.toInteger();
    };
    
    plt.types.Complex.prototype.toFloat = function(){
	if (!plt.types.NumberTower.equal(this.i, plt.types.Rational.ZERO).valueOf())
	    throw new plt.Kernel.MobyRuntimeError("toFloat: expects argument of type real number");
	return this.r.toFloat();
    };
    
    plt.types.Complex.prototype.toComplex = function(){
	return plt.types.Complex.makeInstance(this.r.n, this.i.n);
    };
    
    plt.types.Complex.prototype.add = function(other){
	return plt.types.Complex.makeInstance(this.r.n + other.r.n, this.i.n + other.i.n);
    };
    
    plt.types.Complex.prototype.subtract = function(other){
	return plt.types.Complex.makeInstance(this.r.n - other.r.n, this.i.n - other.i.n);
    };
    
    plt.types.Complex.prototype.multiply = function(other){
	var r = this.r.n * other.r.n - this.i.n * other.i.n;
	var i = this.r.n * other.i.n + this.i.n * other.r.n;
	return plt.types.Complex.makeInstance(r, i);
    };
    
    plt.types.Complex.prototype.divide = function(other){
	var con = other.conjugate();
	var up =  plt.types.NumberTower.multiply(this, con);
	var down = plt.types.NumberTower.multiply(other, con);
	return plt.types.Complex.makeInstance(up.r.n / down.r.n, up.i.n / down.r.n);
    };
    
    plt.types.Complex.prototype.conjugate = function(){
	return plt.types.Complex.makeInstance(this.r.n, 0 - this.i.n);
    };
    
    plt.types.Complex.prototype.magnitude = function(){
	var sum = plt.types.FloatPoint.makeInstance(this.r.n*this.r.n + this.i.n * this.i.n);
	return plt.types.FloatPoint.makeInstance(sum.sqrt().n);
    };
    
    plt.types.Complex.prototype.isReal = function(){
	return this.i.n == 0;
    };
    
    plt.types.Complex.prototype.sqrt = function(){
	if (this.isReal())
	    return this.r.sqrt();
	
	// http://en.wikipedia.org/wiki/Square_root#Square_roots_of_negative_and_complex_numbers	
	var r_plus_x = plt.types.NumberTower.add(this.magnitude(), this.r);

	var r = r_plus_x.half().sqrt();
	var i = plt.types.NumberTower.divide(this.i, plt.types.NumberTower.multiply(r_plus_x, plt.types.FloatPoint.makeInstance(2)).sqrt());
	
	return plt.types.Complex.makeInstance(r.toFloat(), i.toFloat());
    };
    
    plt.types.Complex.prototype.log = function(){
	return plt.types.Complex.makeInstance(this.magnitude().log().toFloat(), this.angle().toFloat());
    };
    
    plt.types.Complex.prototype.angle = function(){
	if (this.isReal())
	    return this.r.angle();
	if (0 == this.r.n){
	    var tmp = plt.Kernel.pi.half();
	    return this.i.n > 0 ? tmp : tmp.minus();
	} else {
	    var tmp = plt.types.NumberTower.divide(this.i.abs(), this.r.abs()).atan();
	    if (this.r.n > 0)
		return this.i.n > 0 ? tmp : tmp.minus();
	    else
		return this.i.n > 0 ? plt.Kernel.pi.subtract(tmp) : tmp.subtract(plt.Kernel.pi);
	}
    };
    
    plt.types.Complex.prototype.atan = function(){
	if (this.isReal())
	    return this.r.atan();
	var iz = this.timesI();
	var part1 = plt.types.Complex.makeInstance(1, iz.minus()).log();
	var part2 = plt.types.Complex.makeInstance(1, iz).log();
	return part1.subtract(part2).timesI().half();
    };
    
    plt.types.Complex.prototype.cos = function(){
	if (this.isReal())
	    return this.r.cos();
	var iz = this.timesI();
	var iz_minus = iz.minus();
	
	return plt.types.NumberTower.add(iz.exp(), iz_minus.exp()).half();
    };
    
    plt.types.Complex.prototype.sin = function(){
	if (this.isReal())
	    return this.r.sin();
	var iz = this.timesI();
	var iz_minus = iz.minus();
	var z2 = plt.types.Complex.makeInstance(0, 2);
	
	var exp_minus = plt.types.NumberTower.subtract(iz.exp(), iz_minus.exp());
	
	return plt.types.NumberTower.divide(exp_minus, z2);
    };
    
    plt.types.Complex.prototype.expt= function(y){
	var expo = y.multiply(this.log());
	return expo.exp();
    };
    
    plt.types.Complex.prototype.exp = function(){
	var part1 = this.r.exp();
	var part2 = plt.types.Complex.makeInstance(this.i.cos(), this.i.sin().timesI());
	
	return plt.types.NumberTower.multiply(part1, part2);
    };
    
    plt.types.Complex.prototype.acos = function(){
	if (this.isReal())
	    return this.r.acos();
	var pi_half = plt.Kernel.pi.half();
	var iz = this.timesI();
	var root = plt.types.NumberTower.subtract(plt.types.Rational.ONE, this.multiply(this)).sqrt();
	var l = plt.types.NumberTower.add(iz, root).log().timesI();
	return plt.types.NumberTower.add(pi_half, l);
    };
    
    plt.types.Complex.prototype.asin = function(){
	if (this.isReal())
	    return this.r.asin();
	var iz = this.timesI();
	var root = plt.types.NumberTower.subtract(plt.types.Rational.ONE, this.multiply(this)).sqrt();
	var ret = plt.types.NumberTower.add(iz, root).log().timesI().minus();
	// FIXME: missing return value!
	throw new plt.Kernel.MobyRuntimeError("");
    };
    
    plt.types.Complex.prototype.ceiling = function(){
	if (!this.isReal())
	    throw new plt.Kernel.MobyRuntimeError("ceiling: can only be applied to real number");
	return this.r.ceiling();
    };
    
    plt.types.Complex.prototype.floor = function(){
	if (!this.isReal())
	    throw new plt.Kernel.MobyRuntimeError("floor: can only be applied to real number");
	return this.r.floor();
    };
    
    plt.types.Complex.prototype.imag_dash_part = function(){
	return this.i;
    };
    
    plt.types.Complex.prototype.real_dash_part = function(){
	return this.r;
    };
    
    plt.types.Complex.prototype.round = function(){
	return this.r.round();
    };
    
    
    plt.types.Complex.prototype.timesI = function(){
	return this.multiply(plt.types.Complex.makeInstance(0, 1));
    };
    
    plt.types.Complex.prototype.minus = function(){
	return plt.types.Complex.makeInstance(0 - this.r.n, 0 - this.i.n);
    };
    
    plt.types.Complex.prototype.half = function(){
	return plt.types.Complex.makeInstance(this.r.n/2, this.i.n/2);
    };
    
    //////////////////////////////////////////////////////////////////////
    // NumberTower.
    // 
    // Currently only support Rational and Floating.
    plt.types.NumberTower = {};
    
    
    plt.types.NumberTower.toInteger = function(num) {
	return num.toInteger();
    };
    
    plt.types.NumberTower.toFloat = function(num) {
	return num.toFloat();
    };
    
    plt.types.NumberTower.abs = function(n) {
	return n.abs();
    };
    
    plt.types.NumberTower.toExact = function(x) {
	return x.toExact();
    };

    plt.types.NumberTower.add = function(x, y) {
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);
	return x.add(y);
    };
    
    plt.types.NumberTower.subtract = function(x, y) {
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);
	return x.subtract(y);
    };
    
    plt.types.NumberTower.multiply = function(x, y) {
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);
	return x.multiply(y);
    };
    
    plt.types.NumberTower.divide = function(x, y) {
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);
	return x.divide(y);
    };
    
    plt.types.NumberTower.equal = function(x, y) {
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);
	
	return x.isEqual(y);
    };
    
    plt.types.NumberTower.approxEqual = function(x, y, delta) {
	return plt.types.NumberTower.lessThan(plt.types.NumberTower.abs(plt.types.NumberTower.subtract(x, y)),
                                              delta);
    };
    
    plt.types.NumberTower.greaterThanOrEqual = function(x, y){
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);

	if (!(x.isReal() && y.isReal()))
	    throw new plt.Kernel.MobyRuntimeError("greaterThanOrEqual: couldn't be applied to complex number");
	return x.greaterThanOrEqual(y);
    };
    
    plt.types.NumberTower.lessThanOrEqual = function(x, y){
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);
	if (!(x.isReal() && y.isReal()))
	    throw new plt.Kernel.MobyRuntimeError("lessThanOrEqual: couldn't be applied to complex number");
	return x.lessThanOrEqual(y);    	
    };
    
    plt.types.NumberTower.greaterThan = function(x, y){
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);
	
	if (!(x.isReal() && y.isReal()))
	    throw new plt.Kernel.MobyRuntimeError("greaterThan: couldn't be applied to complex number");
	return x.greaterThan(y);
	
    };
    
    plt.types.NumberTower.lessThan = function(x, y){
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);

	if (!(x.isReal() && y.isReal()))
	    throw new plt.Kernel.MobyRuntimeError("lessThan: couldn't be applied to complex number");
	return x.lessThan(y);
    };
    
    plt.types.NumberTower.modulo = function(m, n) {
	var result = 
	    plt.types.Rational.makeInstance(m.toInteger() % n.toInteger(),
					    1);
	if (plt.types.NumberTower.lessThan(result, plt.types.Rational.ZERO).valueOf()) {
	    return plt.types.NumberTower.add(result, n);
	}
	return result;
    };
    
    plt.types.NumberTower.sqr = function(x) {
	return plt.types.NumberTower.multiply(x, x);
    };
    
    plt.types.NumberTower.expt = function(x, y){
	if (x.level() < y.level()) x = x.lift(y);
	if (y.level() < x.level()) y = y.lift(x);
	return x.expt(y);
    };
    






    // Strings
    // For the moment, we just reuse Javascript strings.
    plt.types.String = String;
    plt.types.String.makeInstance = function(s) {
	return s.valueOf();
    };
    
    plt.types.String.prototype.isEqual = function(other){
	return this == other;
    };
    

    plt.types.String.prototype.toWrittenString = function() {
    	return '"' + this.replace(/["\\]/g,
    	                       function(match, submatch, index) {
                                       return "\\" + match;
                                   }) + '"';
    }

    plt.types.String.prototype.toDisplayedString = function() {
        return this;
    }



})();