#lang s-exp "../js-vm/base.rkt"

(require "../js-vm/permissions/require-permission.rkt")
(require "../js-vm/ffi/ffi.rkt")
(require "../js-vm/jsworld/jsworld.rkt")


(require "in-phone.rkt")


(provide on-sms-receive!
	 on-sms-receive)


(require-permission "PERMISSION:SEND-SMS"
		    "PERMISSION:RECEIVE-SMS")


(define (on-sms-receive! world-updater effect-updater)
  (let ([sms (js-new (js-get-field (js-get-global-value "phonegap") "Sms"))])
    (make-world-config (lambda (handler)
                         (js-call (js-get-field sms "addListener")
                                  sms
                                  handler))
                       void ;; FIXME: We need some sort of shutdown here!
                       (lambda (w sender-js-str msg-js-str)
                         (let ([sender (prim-js->scheme sender-js-str)]
                               [msg (prim-js->scheme msg-js-str)])
                         (world-with-effects (effect-updater w sender msg)))))))



(define (on-sms-receive world-updater)
  (let ([sms (js-new (js-get-field (js-get-global-value "phonegap") "Sms"))])
    (make-world-config (lambda (handler)
                         (js-call (js-get-field sms "addListener")
                                  sms
                                  handler))
                       void ;; FIXME: We need some sort of shutdown here!
                       (lambda (w sender-js-str msg-js-str)
                         (let ([sender (prim-js->scheme sender-js-str)]
                               [msg (prim-js->scheme msg-js-str)])
                         (world-updater w sender msg))))))
