#lang planet dyoo/js-vm:1:=7/base
(require (prefix-in base: (planet dyoo/js-vm:1:=7/lang/base)))
(base:require (planet dyoo/js-vm:1:=7/lang/js-impl/js-impl))
(base:provide (base:all-from-out (planet dyoo/js-vm:1:=7/lang/js-impl/js-impl)))

