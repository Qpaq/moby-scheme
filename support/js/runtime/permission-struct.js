// This is automatically generated by bootstrap-js-compiler.ss
// Please don't hand-edit this file.
(function(_that) {var _SHARED = {};
var permission_colon_location = function () { plt.types.Struct.call(this, "make-permission:location", []); };
permission_colon_location.prototype = new plt.types.Struct();

var make_dash_permission_colon_location = function () { return new permission_colon_location(); };


var permission_colon_location_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_location; };

var permission_colon_send_dash_sms = function () { plt.types.Struct.call(this, "make-permission:send-sms", []); };
permission_colon_send_dash_sms.prototype = new plt.types.Struct();

var make_dash_permission_colon_send_dash_sms = function () { return new permission_colon_send_dash_sms(); };


var permission_colon_send_dash_sms_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_send_dash_sms; };

var permission_colon_receive_dash_sms = function () { plt.types.Struct.call(this, "make-permission:receive-sms", []); };
permission_colon_receive_dash_sms.prototype = new plt.types.Struct();

var make_dash_permission_colon_receive_dash_sms = function () { return new permission_colon_receive_dash_sms(); };


var permission_colon_receive_dash_sms_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_receive_dash_sms; };

var permission_colon_tilt = function () { plt.types.Struct.call(this, "make-permission:tilt", []); };
permission_colon_tilt.prototype = new plt.types.Struct();

var make_dash_permission_colon_tilt = function () { return new permission_colon_tilt(); };


var permission_colon_tilt_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_tilt; };

var permission_colon_shake = function () { plt.types.Struct.call(this, "make-permission:shake", []); };
permission_colon_shake.prototype = new plt.types.Struct();

var make_dash_permission_colon_shake = function () { return new permission_colon_shake(); };


var permission_colon_shake_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_shake; };

var permission_colon_internet = function () { plt.types.Struct.call(this, "make-permission:internet", []); };
permission_colon_internet.prototype = new plt.types.Struct();

var make_dash_permission_colon_internet = function () { return new permission_colon_internet(); };


var permission_colon_internet_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_internet; };

var permission_colon_telephony = function () { plt.types.Struct.call(this, "make-permission:telephony", []); };
permission_colon_telephony.prototype = new plt.types.Struct();

var make_dash_permission_colon_telephony = function () { return new permission_colon_telephony(); };


var permission_colon_telephony_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_telephony; };

var permission_colon_wake_dash_lock = function () { plt.types.Struct.call(this, "make-permission:wake-lock", []); };
permission_colon_wake_dash_lock.prototype = new plt.types.Struct();

var make_dash_permission_colon_wake_dash_lock = function () { return new permission_colon_wake_dash_lock(); };


var permission_colon_wake_dash_lock_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_wake_dash_lock; };

var permission_colon_open_dash_image_dash_url = function (url) { plt.types.Struct.call(this, "make-permission:open-image-url", [url]);this.url = url; };
permission_colon_open_dash_image_dash_url.prototype = new plt.types.Struct();

var make_dash_permission_colon_open_dash_image_dash_url = function (id0) { return new permission_colon_open_dash_image_dash_url(id0); };
var permission_colon_open_dash_image_dash_url_dash_url = function(obj) {
     if (permission_colon_open_dash_image_dash_url_question_ (obj)) {
        return obj.url;
     } else {
        throw new plt.Kernel.MobyRuntimeError(            plt.Kernel.format('permission:open-image-url-url: not a permission:open-image-url: ~s', [obj]));
     }
};

var set_dash_permission_colon_open_dash_image_dash_url_dash_url_bang_ = function(obj,newVal) {
	 if (permission_colon_open_dash_image_dash_url_question_ (obj)) {
		obj.url = newVal;
           obj._fields[0] = newVal;     } else {
        throw new plt.Kernel.MobyRuntimeError(            plt.Kernel.format('set_dash_permission_colon_open_dash_image_dash_url_dash_url_bang_: not a permission:open-image-url: ~s', [obj]));
     }
};

var permission_colon_open_dash_image_dash_url_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_open_dash_image_dash_url; };

var permission_colon_universe = function (url) { plt.types.Struct.call(this, "make-permission:universe", [url]);this.url = url; };
permission_colon_universe.prototype = new plt.types.Struct();

var make_dash_permission_colon_universe = function (id0) { return new permission_colon_universe(id0); };
var permission_colon_universe_dash_url = function(obj) {
     if (permission_colon_universe_question_ (obj)) {
        return obj.url;
     } else {
        throw new plt.Kernel.MobyRuntimeError(            plt.Kernel.format('permission:universe-url: not a permission:universe: ~s', [obj]));
     }
};

var set_dash_permission_colon_universe_dash_url_bang_ = function(obj,newVal) {
	 if (permission_colon_universe_question_ (obj)) {
		obj.url = newVal;
           obj._fields[0] = newVal;     } else {
        throw new plt.Kernel.MobyRuntimeError(            plt.Kernel.format('set_dash_permission_colon_universe_dash_url_bang_: not a permission:universe: ~s', [obj]));
     }
};

var permission_colon_universe_question_ = function(obj) { 
              return obj != null && obj != undefined && obj instanceof permission_colon_universe; };

var permission_question_ = function(datum) { return ((plt.Kernel.setLastLoc({offset:554, line:18, span:28, id:"permission.ss"})   && permission_colon_location_question_(datum))||(plt.Kernel.setLastLoc({offset:589, line:19, span:28, id:"permission.ss"})   && permission_colon_send_dash_sms_question_(datum))||(plt.Kernel.setLastLoc({offset:624, line:20, span:31, id:"permission.ss"})   && permission_colon_receive_dash_sms_question_(datum))||(plt.Kernel.setLastLoc({offset:662, line:21, span:24, id:"permission.ss"})   && permission_colon_tilt_question_(datum))||(plt.Kernel.setLastLoc({offset:693, line:22, span:25, id:"permission.ss"})   && permission_colon_shake_question_(datum))||(plt.Kernel.setLastLoc({offset:725, line:23, span:28, id:"permission.ss"})   && permission_colon_internet_question_(datum))||(plt.Kernel.setLastLoc({offset:760, line:24, span:29, id:"permission.ss"})   && permission_colon_telephony_question_(datum))||(plt.Kernel.setLastLoc({offset:796, line:25, span:29, id:"permission.ss"})   && permission_colon_wake_dash_lock_question_(datum))||(plt.Kernel.setLastLoc({offset:832, line:26, span:34, id:"permission.ss"})   && permission_colon_open_dash_image_dash_url_question_(datum))||(plt.Kernel.setLastLoc({offset:873, line:27, span:28, id:"permission.ss"})   && permission_colon_universe_question_(datum))); };
var PERMISSION_colon_LOCATION; 
var PERMISSION_colon_SEND_dash_SMS; 
var PERMISSION_colon_RECEIVE_dash_SMS; 
var PERMISSION_colon_TILT; 
var PERMISSION_colon_SHAKE; 
var PERMISSION_colon_INTERNET; 
var PERMISSION_colon_TELEPHONY; 
var PERMISSION_colon_WAKE_dash_LOCK; 
var permission_dash__greaterthan_string = function(a_dash_permission) { return ((plt.Kernel.setLastLoc({offset:1594, line:45, span:35, id:"permission.ss"})   && permission_colon_location_question_(a_dash_permission)) ?
 _SHARED[11] :
 ((plt.Kernel.setLastLoc({offset:1663, line:47, span:35, id:"permission.ss"})   && permission_colon_send_dash_sms_question_(a_dash_permission)) ?
 _SHARED[12] :
 ((plt.Kernel.setLastLoc({offset:1732, line:49, span:38, id:"permission.ss"})   && permission_colon_receive_dash_sms_question_(a_dash_permission)) ?
 _SHARED[13] :
 ((plt.Kernel.setLastLoc({offset:1807, line:51, span:31, id:"permission.ss"})   && permission_colon_tilt_question_(a_dash_permission)) ?
 _SHARED[14] :
 ((plt.Kernel.setLastLoc({offset:1868, line:53, span:32, id:"permission.ss"})   && permission_colon_shake_question_(a_dash_permission)) ?
 _SHARED[15] :
 ((plt.Kernel.setLastLoc({offset:1931, line:55, span:35, id:"permission.ss"})   && permission_colon_internet_question_(a_dash_permission)) ?
 _SHARED[16] :
 ((plt.Kernel.setLastLoc({offset:2000, line:57, span:36, id:"permission.ss"})   && permission_colon_telephony_question_(a_dash_permission)) ?
 _SHARED[17] :
 ((plt.Kernel.setLastLoc({offset:2071, line:59, span:36, id:"permission.ss"})   && permission_colon_wake_dash_lock_question_(a_dash_permission)) ?
 _SHARED[18] :
 ((plt.Kernel.setLastLoc({offset:2142, line:61, span:41, id:"permission.ss"})   && permission_colon_open_dash_image_dash_url_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:2189, line:62, span:84, id:"permission.ss"}) && plt.Kernel.format(_SHARED[19], [(plt.Kernel.setLastLoc({offset:2228, line:62, span:44, id:"permission.ss"})   && permission_colon_open_dash_image_dash_url_dash_url(a_dash_permission))])) :
 ((plt.Kernel.setLastLoc({offset:2280, line:63, span:35, id:"permission.ss"})   && permission_colon_universe_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:2321, line:64, span:72, id:"permission.ss"}) && plt.Kernel.format(_SHARED[20], [(plt.Kernel.setLastLoc({offset:2354, line:64, span:38, id:"permission.ss"})   && permission_colon_universe_dash_url(a_dash_permission))])) :
 (plt.Kernel.setLastLoc({offset:1583, line:44, span:812, id:"permission.ss"})   && plt.Kernel.error((plt.types.Symbol.makeInstance("cond")),_SHARED[21])))))))))))); };
var string_dash__greaterthan_permission = function(a_dash_ref) { return ((function() { 

var is_dash_permission_slash_1_question_ = function(permission_dash_name, a_dash_ref) { return ((plt.Kernel.setLastLoc({offset:2795, line:75, span:78, id:"permission.ss"}) && plt.Kernel._greaterthan_((plt.Kernel.setLastLoc({offset:2798, line:75, span:21, id:"permission.ss"})   && plt.Kernel.string_dash_length(a_dash_ref)),(plt.Kernel.setLastLoc({offset:2841, line:76, span:31, id:"permission.ss"})   && plt.Kernel.string_dash_length(permission_dash_name)), []))&&(plt.Kernel.setLastLoc({offset:2892, line:77, span:106, id:"permission.ss"}) && plt.Kernel.string_equal__question_((plt.Kernel.setLastLoc({offset:2902, line:77, span:51, id:"permission.ss"})   && plt.Kernel.substring(a_dash_ref,_SHARED[23],(plt.Kernel.setLastLoc({offset:2921, line:77, span:31, id:"permission.ss"})   && plt.Kernel.string_dash_length(permission_dash_name)))),permission_dash_name, []))); };
var construct_dash_permission_slash_1 = function(permission_dash_name, a_dash_ref, make_dash_permission_colon__star_) { return (plt.Kernel.setLastLoc({offset:3258, line:83, span:183, id:"permission.ss"})  && plt.Kernel.apply(make_dash_permission_colon__star_,                        plt.Kernel.list([(plt.Kernel.setLastLoc({offset:3277, line:83, span:163, id:"permission.ss"})   && plt.Kernel.substring(a_dash_ref,(plt.Kernel.setLastLoc({offset:3337, line:84, span:38, id:"permission.ss"})   && plt.Kernel.add1((plt.Kernel.setLastLoc({offset:3343, line:84, span:31, id:"permission.ss"})   && plt.Kernel.string_dash_length(permission_dash_name)))),(plt.Kernel.setLastLoc({offset:3418, line:85, span:21, id:"permission.ss"})   && plt.Kernel.string_dash_length(a_dash_ref))))]),                       [])); };
(function (toplevel_dash_expression_dash_show22) { 

 })(plt.Kernel.identity)
return ((plt.Kernel.setLastLoc({offset:3461, line:87, span:38, id:"permission.ss"}) && plt.Kernel.string_equal__question_(a_dash_ref,_SHARED[11], [])) ?
 PERMISSION_colon_LOCATION :
 ((plt.Kernel.setLastLoc({offset:3535, line:89, span:38, id:"permission.ss"}) && plt.Kernel.string_equal__question_(a_dash_ref,_SHARED[12], [])) ?
 PERMISSION_colon_SEND_dash_SMS :
 ((plt.Kernel.setLastLoc({offset:3614, line:91, span:41, id:"permission.ss"}) && plt.Kernel.string_equal__question_(a_dash_ref,_SHARED[13], [])) ?
 PERMISSION_colon_RECEIVE_dash_SMS :
 ((plt.Kernel.setLastLoc({offset:3694, line:93, span:34, id:"permission.ss"}) && plt.Kernel.string_equal__question_(a_dash_ref,_SHARED[14], [])) ?
 PERMISSION_colon_TILT :
 ((plt.Kernel.setLastLoc({offset:3760, line:95, span:35, id:"permission.ss"}) && plt.Kernel.string_equal__question_(a_dash_ref,_SHARED[15], [])) ?
 PERMISSION_colon_SHAKE :
 ((plt.Kernel.setLastLoc({offset:3828, line:97, span:38, id:"permission.ss"}) && plt.Kernel.string_equal__question_(a_dash_ref,_SHARED[16], [])) ?
 PERMISSION_colon_INTERNET :
 ((plt.Kernel.setLastLoc({offset:3902, line:99, span:39, id:"permission.ss"}) && plt.Kernel.string_equal__question_(a_dash_ref,_SHARED[17], [])) ?
 PERMISSION_colon_TELEPHONY :
 ((plt.Kernel.setLastLoc({offset:3978, line:101, span:39, id:"permission.ss"}) && plt.Kernel.string_equal__question_(a_dash_ref,_SHARED[18], [])) ?
 PERMISSION_colon_WAKE_dash_LOCK :
 ((plt.Kernel.setLastLoc({offset:4054, line:103, span:52, id:"permission.ss"})   && is_dash_permission_slash_1_question_(_SHARED[24],a_dash_ref)) ?
 (plt.Kernel.setLastLoc({offset:4114, line:104, span:89, id:"permission.ss"})   && construct_dash_permission_slash_1(_SHARED[24],a_dash_ref,(plt.types.liftToplevelToFunctionValue(make_dash_permission_colon_open_dash_image_dash_url,(plt.types.String.makeInstance("make-permission:open-image-url")),1,(plt.types.Rational.makeInstance(1, 1)))))) :
 ((plt.Kernel.setLastLoc({offset:4212, line:105, span:46, id:"permission.ss"})   && is_dash_permission_slash_1_question_(_SHARED[25],a_dash_ref)) ?
 (plt.Kernel.setLastLoc({offset:4266, line:106, span:77, id:"permission.ss"})   && construct_dash_permission_slash_1(_SHARED[25],a_dash_ref,(plt.types.liftToplevelToFunctionValue(make_dash_permission_colon_universe,(plt.types.String.makeInstance("make-permission:universe")),1,(plt.types.Rational.makeInstance(1, 1)))))) :
 (plt.Kernel.setLastLoc({offset:3448, line:86, span:897, id:"permission.ss"})   && plt.Kernel.error((plt.types.Symbol.makeInstance("cond")),_SHARED[26]))))))))))));
              })()); };
var permission_dash__greaterthan_android_dash_permissions = function(a_dash_permission) { return ((plt.Kernel.setLastLoc({offset:4584, line:115, span:35, id:"permission.ss"})   && permission_colon_location_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:4625, line:116, span:103, id:"permission.ss"}) && plt.Kernel.list([_SHARED[27],_SHARED[28]])) :
 ((plt.Kernel.setLastLoc({offset:4735, line:118, span:35, id:"permission.ss"})   && permission_colon_send_dash_sms_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:4776, line:119, span:36, id:"permission.ss"}) && plt.Kernel.list([_SHARED[29]])) :
 ((plt.Kernel.setLastLoc({offset:4819, line:120, span:38, id:"permission.ss"})   && permission_colon_receive_dash_sms_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:4863, line:121, span:39, id:"permission.ss"}) && plt.Kernel.list([_SHARED[30]])) :
 ((plt.Kernel.setLastLoc({offset:4909, line:122, span:31, id:"permission.ss"})   && permission_colon_tilt_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:4946, line:123, span:6, id:"permission.ss"}) && plt.Kernel.list([])) :
 ((plt.Kernel.setLastLoc({offset:4959, line:124, span:32, id:"permission.ss"})   && permission_colon_shake_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:4997, line:125, span:6, id:"permission.ss"}) && plt.Kernel.list([])) :
 ((plt.Kernel.setLastLoc({offset:5010, line:126, span:35, id:"permission.ss"})   && permission_colon_internet_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:5051, line:127, span:36, id:"permission.ss"}) && plt.Kernel.list([_SHARED[31]])) :
 ((plt.Kernel.setLastLoc({offset:5094, line:128, span:36, id:"permission.ss"})   && permission_colon_telephony_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:5136, line:129, span:49, id:"permission.ss"}) && plt.Kernel.list([_SHARED[32]])) :
 ((plt.Kernel.setLastLoc({offset:5192, line:130, span:36, id:"permission.ss"})   && permission_colon_wake_dash_lock_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:5234, line:131, span:37, id:"permission.ss"}) && plt.Kernel.list([_SHARED[33]])) :
 ((plt.Kernel.setLastLoc({offset:5278, line:132, span:41, id:"permission.ss"})   && permission_colon_open_dash_image_dash_url_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:5325, line:133, span:6, id:"permission.ss"}) && plt.Kernel.list([])) :
 ((plt.Kernel.setLastLoc({offset:5338, line:134, span:35, id:"permission.ss"})   && permission_colon_universe_question_(a_dash_permission)) ?
 (plt.Kernel.setLastLoc({offset:5379, line:135, span:36, id:"permission.ss"}) && plt.Kernel.list([_SHARED[31]])) :
 (plt.Kernel.setLastLoc({offset:4573, line:114, span:844, id:"permission.ss"})   && plt.Kernel.error((plt.types.Symbol.makeInstance("cond")),_SHARED[34])))))))))))); };_SHARED[15] = (plt.types.String.makeInstance("PERMISSION:SHAKE"));
_SHARED[27] = (plt.types.String.makeInstance("android.permission.ACCESS_COARSE_LOCATION"));
_SHARED[21] = (plt.types.String.makeInstance("cond: fell out of cond around \"offset=1583 line=44 span=812 id=\\\"permission.ss\\\"\""));
_SHARED[26] = (plt.types.String.makeInstance("cond: fell out of cond around \"offset=3448 line=86 span=897 id=\\\"permission.ss\\\"\""));
_SHARED[34] = (plt.types.String.makeInstance("cond: fell out of cond around \"offset=4573 line=114 span=844 id=\\\"permission.ss\\\"\""));
_SHARED[30] = (plt.types.String.makeInstance("android.permission.RECEIVE_SMS"));
_SHARED[29] = (plt.types.String.makeInstance("android.permission.SEND_SMS"));
_SHARED[33] = (plt.types.String.makeInstance("android.permission.WAKE_LOCK"));
_SHARED[28] = (plt.types.String.makeInstance("android.permission.ACCESS_FINE_LOCATION"));
_SHARED[31] = (plt.types.String.makeInstance("android.permission.INTERNET"));
_SHARED[32] = (plt.types.String.makeInstance("android.permission.ACCESS_COARSE_UPDATES"));
_SHARED[20] = (plt.types.String.makeInstance("PERMISSION:UNIVERSE ~a"));
_SHARED[18] = (plt.types.String.makeInstance("PERMISSION:WAKE-LOCK"));
_SHARED[14] = (plt.types.String.makeInstance("PERMISSION:TILT"));
_SHARED[25] = (plt.types.String.makeInstance("PERMISSION:UNIVERSE"));
_SHARED[17] = (plt.types.String.makeInstance("PERMISSION:TELEPHONY"));
_SHARED[24] = (plt.types.String.makeInstance("PERMISSION:OPEN-IMAGE-URL"));
_SHARED[13] = (plt.types.String.makeInstance("PERMISSION:RECEIVE-SMS"));
_SHARED[12] = (plt.types.String.makeInstance("PERMISSION:SEND-SMS"));
_SHARED[19] = (plt.types.String.makeInstance("PERMISSION:OPEN-IMAGE-URL ~a"));
_SHARED[16] = (plt.types.String.makeInstance("PERMISSION:INTERNET"));
_SHARED[11] = (plt.types.String.makeInstance("PERMISSION:LOCATION"));
_SHARED[23] = (plt.types.Rational.makeInstance(0, 1));

(function() { 
  ((function (toplevel_dash_expression_dash_show0) { 











PERMISSION_colon_LOCATION = (plt.Kernel.setLastLoc({offset:934, line:30, span:26, id:"permission.ss"})   && make_dash_permission_colon_location());
PERMISSION_colon_SEND_dash_SMS = (plt.Kernel.setLastLoc({offset:990, line:31, span:26, id:"permission.ss"})   && make_dash_permission_colon_send_dash_sms());
PERMISSION_colon_RECEIVE_dash_SMS = (plt.Kernel.setLastLoc({offset:1049, line:32, span:26, id:"permission.ss"})   && make_dash_permission_colon_send_dash_sms());
PERMISSION_colon_TILT = (plt.Kernel.setLastLoc({offset:1101, line:33, span:22, id:"permission.ss"})   && make_dash_permission_colon_tilt());
PERMISSION_colon_SHAKE = (plt.Kernel.setLastLoc({offset:1150, line:34, span:23, id:"permission.ss"})   && make_dash_permission_colon_shake());
PERMISSION_colon_INTERNET = (plt.Kernel.setLastLoc({offset:1203, line:35, span:26, id:"permission.ss"})   && make_dash_permission_colon_internet());
PERMISSION_colon_TELEPHONY = (plt.Kernel.setLastLoc({offset:1260, line:36, span:27, id:"permission.ss"})   && make_dash_permission_colon_telephony());
PERMISSION_colon_WAKE_dash_LOCK = (plt.Kernel.setLastLoc({offset:1318, line:37, span:27, id:"permission.ss"})   && make_dash_permission_colon_wake_dash_lock());


 })  )(arguments[0] || plt.Kernel.identity);
_that["permission_colon_internet_question_"] = permission_colon_internet_question_;
_that["permission_colon_shake_question_"] = permission_colon_shake_question_;
_that["permission_colon_tilt_question_"] = permission_colon_tilt_question_;
_that["permission_colon_wake_dash_lock_question_"] = permission_colon_wake_dash_lock_question_;
_that["set_dash_permission_colon_universe_dash_url_bang_"] = set_dash_permission_colon_universe_dash_url_bang_;
_that["string_dash__greaterthan_permission"] = string_dash__greaterthan_permission;
_that["set_dash_permission_colon_open_dash_image_dash_url_dash_url_bang_"] = set_dash_permission_colon_open_dash_image_dash_url_dash_url_bang_;
_that["permission_question_"] = permission_question_;
_that["permission_colon_universe_question_"] = permission_colon_universe_question_;
_that["permission_colon_wake_dash_lock"] = permission_colon_wake_dash_lock;
_that["permission_colon_universe"] = permission_colon_universe;
_that["permission_colon_universe_dash_url"] = permission_colon_universe_dash_url;
_that["permission_colon_telephony_question_"] = permission_colon_telephony_question_;
_that["permission_colon_tilt"] = permission_colon_tilt;
_that["permission_colon_telephony"] = permission_colon_telephony;
_that["permission_colon_receive_dash_sms_question_"] = permission_colon_receive_dash_sms_question_;
_that["permission_colon_send_dash_sms_question_"] = permission_colon_send_dash_sms_question_;
_that["permission_colon_shake"] = permission_colon_shake;
_that["permission_colon_send_dash_sms"] = permission_colon_send_dash_sms;
_that["permission_colon_location_question_"] = permission_colon_location_question_;
_that["permission_colon_open_dash_image_dash_url_question_"] = permission_colon_open_dash_image_dash_url_question_;
_that["permission_colon_receive_dash_sms"] = permission_colon_receive_dash_sms;
_that["permission_colon_open_dash_image_dash_url"] = permission_colon_open_dash_image_dash_url;
_that["permission_colon_open_dash_image_dash_url_dash_url"] = permission_colon_open_dash_image_dash_url_dash_url;
_that["permission_colon_location"] = permission_colon_location;
_that["make_dash_permission_colon_open_dash_image_dash_url"] = make_dash_permission_colon_open_dash_image_dash_url;
_that["make_dash_permission_colon_tilt"] = make_dash_permission_colon_tilt;
_that["make_dash_permission_colon_wake_dash_lock"] = make_dash_permission_colon_wake_dash_lock;
_that["permission_dash__greaterthan_string"] = permission_dash__greaterthan_string;
_that["permission_colon_internet"] = permission_colon_internet;
_that["permission_dash__greaterthan_android_dash_permissions"] = permission_dash__greaterthan_android_dash_permissions;
_that["make_dash_permission_colon_universe"] = make_dash_permission_colon_universe;
_that["make_dash_permission_colon_send_dash_sms"] = make_dash_permission_colon_send_dash_sms;
_that["make_dash_permission_colon_shake"] = make_dash_permission_colon_shake;
_that["make_dash_permission_colon_telephony"] = make_dash_permission_colon_telephony;
_that["make_dash_permission_colon_receive_dash_sms"] = make_dash_permission_colon_receive_dash_sms;
_that["PERMISSION_colon_SHAKE"] = PERMISSION_colon_SHAKE;
_that["make_dash_permission_colon_internet"] = make_dash_permission_colon_internet;
_that["make_dash_permission_colon_location"] = make_dash_permission_colon_location;
_that["PERMISSION_colon_TILT"] = PERMISSION_colon_TILT;
_that["PERMISSION_colon_WAKE_dash_LOCK"] = PERMISSION_colon_WAKE_dash_LOCK;
_that["PERMISSION_colon_TELEPHONY"] = PERMISSION_colon_TELEPHONY;
_that["PERMISSION_colon_RECEIVE_dash_SMS"] = PERMISSION_colon_RECEIVE_dash_SMS;
_that["PERMISSION_colon_SEND_dash_SMS"] = PERMISSION_colon_SEND_dash_SMS;
_that["PERMISSION_colon_LOCATION"] = PERMISSION_colon_LOCATION;
_that["PERMISSION_colon_INTERNET"] = PERMISSION_colon_INTERNET;
})();})(this);
