load("support.js");


callcount = 0;
breakat = 100;
breakevery = 100;

fib_pause = function(){
	if(verbose)
		print("PAUSING at " + callcount);

	breakat = callcount + breakevery;

	if(verbose)
		print("next pause at "+ breakat);

	return Continuation.CWCC (function(cont){
								return null;});
};

// FIB FRAME 0

fib_frame0 = function(n,f,s,i){
	this.n = n;
	this.f = f;
	this.s = s;
	this.i = i;
};

fib_frame0.prototype = new ContinuationFrame;
fib_frame0.prototype.Invoke = function(return_value){
	return fib_an0(this.n,this.f,this.s,this.i);
};

// FIB_AN

fib_an = function(n,f,s,i){
	if(debug)
		print("fib_an : n = " + n + "  f = " + f + "  s = " + s + "  i = " + i);
	callcount+=1;
	if(callcount == breakat){
		try{
			fib_pause();
		}catch(sce){
			if(verbose)
				print("-- fib_an: caught a SCE!");
			sce.Extend(new fib_frame0(n,f,s,i));
			throw sce;
		}
	}
	return fib_an0(n,f,s,i);
};

// FIB FRAME 1

fib_frame1 = function(n,f,i){
	this.n = n;
	this.f = f;
	this.i = i;
};

fib_frame1.prototype = new ContinuationFrame;
fib_frame1.prototype.Invoke = function(return_value){
	return fib_an1(return_value, this.n, this.f, this.i);
};

// FIB_AN0

fib_an0 = function(n,f,s,i){
	if(debug)
		print("fib_an0 : n = " + n + "  f = " + f + "  s = " + s + "  i = " + i);
	if(n==i)
		return f;
	var temp0;
	try
	{
		temp0 = f+s;
	}catch(sce)
	{
		if(verbose)
			print("fib an0: caught!");
		sce.Extend(new fib_frame1(n,f,i));
		throw sce;
	}
	return fib_an1(temp0, n, f, i);
};

// FIB_AN1

fib_an1 = function(temp0, n, f, i){
	if(debug)
		print("fib_an1 : n = " + n + " temp0 = " + temp0 + "  f = " + f + "  i = " + i);
	var temp1;
	try
	{
		temp1 = i+1;
	}catch(sce)
	{
		if(verbose)
			print("fib an1: caught!");
		sce.Extend(new fib_frame2(n,temp0,f));
		throw sce;
	}
	return fib_an2(n,temp0,f,temp1);
};

// FIB FRAME 2

fib_frame2 = function(n, temp0, f){
	this.n = n;
	this.temp0 = temp0;
	this.f = f;
};

fib_frame2.prototype = new ContinuationFrame;
fib_frame2.prototype.Invoke = function(return_value){
	return fib_an2(this.n, this.temp0, this.f, return_value);
};

// FIB_AN2

fib_an2 = function(n,temp0,f,temp1){
	return fib_an(n,temp0,f,temp1);
};

//////////////////////////////////////////////////////////////////////
// BELOW FOR TESTING

fib = function(n){
	// resetting the control variables
	// these will be changed during the execution
	callcount = 0;
	breakat = 100;
	return Continuation.EstablishInitialContinuation(function(){return fib_an(n,1,1,2);});
};

if(verbose)
	print("--Script loaded--\nInitial CallCount: " + callcount + 
			"\nBreakAt: " + breakat + "\nLoop Verbosity: " + loopverbose);
