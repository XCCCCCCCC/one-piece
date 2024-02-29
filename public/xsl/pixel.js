// Copyright Epic Games, Inc. All Rights Reserved.
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.adapter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    
    'use strict';
    
    var _adapter_factory = require('./adapter_factory.js');
    
    var adapter = (0, _adapter_factory.adapterFactory)({ window: typeof window === 'undefined' ? undefined : window });
    module.exports = adapter; // this is the difference from adapter_core.
    
    },{"./adapter_factory.js":2}],2:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.adapterFactory = adapterFactory;
    
    var _utils = require('./utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    var _chrome_shim = require('./chrome/chrome_shim');
    
    var chromeShim = _interopRequireWildcard(_chrome_shim);
    
    var _firefox_shim = require('./firefox/firefox_shim');
    
    var firefoxShim = _interopRequireWildcard(_firefox_shim);
    
    var _safari_shim = require('./safari/safari_shim');
    
    var safariShim = _interopRequireWildcard(_safari_shim);
    
    var _common_shim = require('./common_shim');
    
    var commonShim = _interopRequireWildcard(_common_shim);
    
    var _sdp = require('sdp');
    
    var sdp = _interopRequireWildcard(_sdp);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    // Shimming starts here.
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    function adapterFactory() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          window = _ref.window;
    
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        shimChrome: true,
        shimFirefox: true,
        shimSafari: true
      };
    
      // Utils.
      var logging = utils.log;
      var browserDetails = utils.detectBrowser(window);
    
      var adapter = {
        browserDetails: browserDetails,
        commonShim: commonShim,
        extractVersion: utils.extractVersion,
        disableLog: utils.disableLog,
        disableWarnings: utils.disableWarnings,
        // Expose sdp as a convenience. For production apps include directly.
        sdp: sdp
      };
    
      // Shim browser if found.
      switch (browserDetails.browser) {
        case 'chrome':
          if (!chromeShim || !chromeShim.shimPeerConnection || !options.shimChrome) {
            logging('Chrome shim is not included in this adapter release.');
            return adapter;
          }
          if (browserDetails.version === null) {
            logging('Chrome shim can not determine version, not shimming.');
            return adapter;
          }
          logging('adapter.js shimming chrome.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = chromeShim;
    
          // Must be called before shimPeerConnection.
          commonShim.shimAddIceCandidateNullOrEmpty(window, browserDetails);
          commonShim.shimParameterlessSetLocalDescription(window, browserDetails);
    
          chromeShim.shimGetUserMedia(window, browserDetails);
          chromeShim.shimMediaStream(window, browserDetails);
          chromeShim.shimPeerConnection(window, browserDetails);
          chromeShim.shimOnTrack(window, browserDetails);
          chromeShim.shimAddTrackRemoveTrack(window, browserDetails);
          chromeShim.shimGetSendersWithDtmf(window, browserDetails);
          chromeShim.shimGetStats(window, browserDetails);
          chromeShim.shimSenderReceiverGetStats(window, browserDetails);
          chromeShim.fixNegotiationNeeded(window, browserDetails);
    
          commonShim.shimRTCIceCandidate(window, browserDetails);
          commonShim.shimRTCIceCandidateRelayProtocol(window, browserDetails);
          commonShim.shimConnectionState(window, browserDetails);
          commonShim.shimMaxMessageSize(window, browserDetails);
          commonShim.shimSendThrowTypeError(window, browserDetails);
          commonShim.removeExtmapAllowMixed(window, browserDetails);
          break;
        case 'firefox':
          if (!firefoxShim || !firefoxShim.shimPeerConnection || !options.shimFirefox) {
            logging('Firefox shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming firefox.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = firefoxShim;
    
          // Must be called before shimPeerConnection.
          commonShim.shimAddIceCandidateNullOrEmpty(window, browserDetails);
          commonShim.shimParameterlessSetLocalDescription(window, browserDetails);
    
          firefoxShim.shimGetUserMedia(window, browserDetails);
          firefoxShim.shimPeerConnection(window, browserDetails);
          firefoxShim.shimOnTrack(window, browserDetails);
          firefoxShim.shimRemoveStream(window, browserDetails);
          firefoxShim.shimSenderGetStats(window, browserDetails);
          firefoxShim.shimReceiverGetStats(window, browserDetails);
          firefoxShim.shimRTCDataChannel(window, browserDetails);
          firefoxShim.shimAddTransceiver(window, browserDetails);
          firefoxShim.shimGetParameters(window, browserDetails);
          firefoxShim.shimCreateOffer(window, browserDetails);
          firefoxShim.shimCreateAnswer(window, browserDetails);
    
          commonShim.shimRTCIceCandidate(window, browserDetails);
          commonShim.shimConnectionState(window, browserDetails);
          commonShim.shimMaxMessageSize(window, browserDetails);
          commonShim.shimSendThrowTypeError(window, browserDetails);
          break;
        case 'safari':
          if (!safariShim || !options.shimSafari) {
            logging('Safari shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming safari.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = safariShim;
    
          // Must be called before shimCallbackAPI.
          commonShim.shimAddIceCandidateNullOrEmpty(window, browserDetails);
          commonShim.shimParameterlessSetLocalDescription(window, browserDetails);
    
          safariShim.shimRTCIceServerUrls(window, browserDetails);
          safariShim.shimCreateOfferLegacy(window, browserDetails);
          safariShim.shimCallbacksAPI(window, browserDetails);
          safariShim.shimLocalStreamsAPI(window, browserDetails);
          safariShim.shimRemoteStreamsAPI(window, browserDetails);
          safariShim.shimTrackEventTransceiver(window, browserDetails);
          safariShim.shimGetUserMedia(window, browserDetails);
          safariShim.shimAudioContext(window, browserDetails);
    
          commonShim.shimRTCIceCandidate(window, browserDetails);
          commonShim.shimRTCIceCandidateRelayProtocol(window, browserDetails);
          commonShim.shimMaxMessageSize(window, browserDetails);
          commonShim.shimSendThrowTypeError(window, browserDetails);
          commonShim.removeExtmapAllowMixed(window, browserDetails);
          break;
        default:
          logging('Unsupported browser!');
          break;
      }
    
      return adapter;
    }
    
    // Browser shims.
    
    },{"./chrome/chrome_shim":3,"./common_shim":6,"./firefox/firefox_shim":7,"./safari/safari_shim":10,"./utils":11,"sdp":12}],3:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var _getusermedia = require('./getusermedia');
    
    Object.defineProperty(exports, 'shimGetUserMedia', {
      enumerable: true,
      get: function get() {
        return _getusermedia.shimGetUserMedia;
      }
    });
    
    var _getdisplaymedia = require('./getdisplaymedia');
    
    Object.defineProperty(exports, 'shimGetDisplayMedia', {
      enumerable: true,
      get: function get() {
        return _getdisplaymedia.shimGetDisplayMedia;
      }
    });
    exports.shimMediaStream = shimMediaStream;
    exports.shimOnTrack = shimOnTrack;
    exports.shimGetSendersWithDtmf = shimGetSendersWithDtmf;
    exports.shimGetStats = shimGetStats;
    exports.shimSenderReceiverGetStats = shimSenderReceiverGetStats;
    exports.shimAddTrackRemoveTrackWithNative = shimAddTrackRemoveTrackWithNative;
    exports.shimAddTrackRemoveTrack = shimAddTrackRemoveTrack;
    exports.shimPeerConnection = shimPeerConnection;
    exports.fixNegotiationNeeded = fixNegotiationNeeded;
    
    var _utils = require('../utils.js');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    
    function shimMediaStream(window) {
      window.MediaStream = window.MediaStream || window.webkitMediaStream;
    }
    
    function shimOnTrack(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
          get: function get() {
            return this._ontrack;
          },
          set: function set(f) {
            if (this._ontrack) {
              this.removeEventListener('track', this._ontrack);
            }
            this.addEventListener('track', this._ontrack = f);
          },
    
          enumerable: true,
          configurable: true
        });
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
          var _this = this;
    
          if (!this._ontrackpoly) {
            this._ontrackpoly = function (e) {
              // onaddstream does not fire when a track is added to an existing
              // stream. But stream.onaddtrack is implemented so we use that.
              e.stream.addEventListener('addtrack', function (te) {
                var receiver = void 0;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = _this.getReceivers().find(function (r) {
                    return r.track && r.track.id === te.track.id;
                  });
                } else {
                  receiver = { track: te.track };
                }
    
                var event = new Event('track');
                event.track = te.track;
                event.receiver = receiver;
                event.transceiver = { receiver: receiver };
                event.streams = [e.stream];
                _this.dispatchEvent(event);
              });
              e.stream.getTracks().forEach(function (track) {
                var receiver = void 0;
                if (window.RTCPeerConnection.prototype.getReceivers) {
                  receiver = _this.getReceivers().find(function (r) {
                    return r.track && r.track.id === track.id;
                  });
                } else {
                  receiver = { track: track };
                }
                var event = new Event('track');
                event.track = track;
                event.receiver = receiver;
                event.transceiver = { receiver: receiver };
                event.streams = [e.stream];
                _this.dispatchEvent(event);
              });
            };
            this.addEventListener('addstream', this._ontrackpoly);
          }
          return origSetRemoteDescription.apply(this, arguments);
        };
      } else {
        // even if RTCRtpTransceiver is in window, it is only used and
        // emitted in unified-plan. Unfortunately this means we need
        // to unconditionally wrap the event.
        utils.wrapPeerConnectionEvent(window, 'track', function (e) {
          if (!e.transceiver) {
            Object.defineProperty(e, 'transceiver', { value: { receiver: e.receiver } });
          }
          return e;
        });
      }
    }
    
    function shimGetSendersWithDtmf(window) {
      // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
        var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
          return {
            track: track,
            get dtmf() {
              if (this._dtmf === undefined) {
                if (track.kind === 'audio') {
                  this._dtmf = pc.createDTMFSender(track);
                } else {
                  this._dtmf = null;
                }
              }
              return this._dtmf;
            },
            _pc: pc
          };
        };
    
        // augment addTrack when getSenders is not available.
        if (!window.RTCPeerConnection.prototype.getSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            this._senders = this._senders || [];
            return this._senders.slice(); // return a copy of the internal state.
          };
          var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
          window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
            var sender = origAddTrack.apply(this, arguments);
            if (!sender) {
              sender = shimSenderWithDtmf(this, track);
              this._senders.push(sender);
            }
            return sender;
          };
    
          var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
          window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
            origRemoveTrack.apply(this, arguments);
            var idx = this._senders.indexOf(sender);
            if (idx !== -1) {
              this._senders.splice(idx, 1);
            }
          };
        }
        var origAddStream = window.RTCPeerConnection.prototype.addStream;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          var _this2 = this;
    
          this._senders = this._senders || [];
          origAddStream.apply(this, [stream]);
          stream.getTracks().forEach(function (track) {
            _this2._senders.push(shimSenderWithDtmf(_this2, track));
          });
        };
    
        var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
          var _this3 = this;
    
          this._senders = this._senders || [];
          origRemoveStream.apply(this, [stream]);
    
          stream.getTracks().forEach(function (track) {
            var sender = _this3._senders.find(function (s) {
              return s.track === track;
            });
            if (sender) {
              // remove sender
              _this3._senders.splice(_this3._senders.indexOf(sender), 1);
            }
          });
        };
      } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          var _this4 = this;
    
          var senders = origGetSenders.apply(this, []);
          senders.forEach(function (sender) {
            return sender._pc = _this4;
          });
          return senders;
        };
    
        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
          get: function get() {
            if (this._dtmf === undefined) {
              if (this.track.kind === 'audio') {
                this._dtmf = this._pc.createDTMFSender(this.track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }
        });
      }
    }
    
    function shimGetStats(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
    
      var origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        var _this5 = this;
    
        var _arguments = Array.prototype.slice.call(arguments),
            selector = _arguments[0],
            onSucc = _arguments[1],
            onErr = _arguments[2];
    
        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.
    
    
        if (arguments.length > 0 && typeof selector === 'function') {
          return origGetStats.apply(this, arguments);
        }
    
        // When spec-style getStats is supported, return those when called with
        // either no arguments or the selector argument is null.
        if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== 'function')) {
          return origGetStats.apply(this, []);
        }
    
        var fixChromeStats_ = function fixChromeStats_(response) {
          var standardReport = {};
          var reports = response.result();
          reports.forEach(function (report) {
            var standardStats = {
              id: report.id,
              timestamp: report.timestamp,
              type: {
                localcandidate: 'local-candidate',
                remotecandidate: 'remote-candidate'
              }[report.type] || report.type
            };
            report.names().forEach(function (name) {
              standardStats[name] = report.stat(name);
            });
            standardReport[standardStats.id] = standardStats;
          });
    
          return standardReport;
        };
    
        // shim getStats with maplike support
        var makeMapStats = function makeMapStats(stats) {
          return new Map(Object.keys(stats).map(function (key) {
            return [key, stats[key]];
          }));
        };
    
        if (arguments.length >= 2) {
          var successCallbackWrapper_ = function successCallbackWrapper_(response) {
            onSucc(makeMapStats(fixChromeStats_(response)));
          };
    
          return origGetStats.apply(this, [successCallbackWrapper_, selector]);
        }
    
        // promise-support
        return new Promise(function (resolve, reject) {
          origGetStats.apply(_this5, [function (response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          }, reject]);
        }).then(onSucc, onErr);
      };
    }
    
    function shimSenderReceiverGetStats(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
        return;
      }
    
      // shim sender stats.
      if (!('getStats' in window.RTCRtpSender.prototype)) {
        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        if (origGetSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            var _this6 = this;
    
            var senders = origGetSenders.apply(this, []);
            senders.forEach(function (sender) {
              return sender._pc = _this6;
            });
            return senders;
          };
        }
    
        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        if (origAddTrack) {
          window.RTCPeerConnection.prototype.addTrack = function addTrack() {
            var sender = origAddTrack.apply(this, arguments);
            sender._pc = this;
            return sender;
          };
        }
        window.RTCRtpSender.prototype.getStats = function getStats() {
          var sender = this;
          return this._pc.getStats().then(function (result) {
            return (
              /* Note: this will include stats of all senders that
               *   send a track with the same id as sender.track as
               *   it is not possible to identify the RTCRtpSender.
               */
              utils.filterStats(result, sender.track, true)
            );
          });
        };
      }
    
      // shim receiver stats.
      if (!('getStats' in window.RTCRtpReceiver.prototype)) {
        var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
        if (origGetReceivers) {
          window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
            var _this7 = this;
    
            var receivers = origGetReceivers.apply(this, []);
            receivers.forEach(function (receiver) {
              return receiver._pc = _this7;
            });
            return receivers;
          };
        }
        utils.wrapPeerConnectionEvent(window, 'track', function (e) {
          e.receiver._pc = e.srcElement;
          return e;
        });
        window.RTCRtpReceiver.prototype.getStats = function getStats() {
          var receiver = this;
          return this._pc.getStats().then(function (result) {
            return utils.filterStats(result, receiver.track, false);
          });
        };
      }
    
      if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) {
        return;
      }
    
      // shim RTCPeerConnection.getStats(track).
      var origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
          var track = arguments[0];
          var sender = void 0;
          var receiver = void 0;
          var err = void 0;
          this.getSenders().forEach(function (s) {
            if (s.track === track) {
              if (sender) {
                err = true;
              } else {
                sender = s;
              }
            }
          });
          this.getReceivers().forEach(function (r) {
            if (r.track === track) {
              if (receiver) {
                err = true;
              } else {
                receiver = r;
              }
            }
            return r.track === track;
          });
          if (err || sender && receiver) {
            return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
          } else if (sender) {
            return sender.getStats();
          } else if (receiver) {
            return receiver.getStats();
          }
          return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
        }
        return origGetStats.apply(this, arguments);
      };
    }
    
    function shimAddTrackRemoveTrackWithNative(window) {
      // shim addTrack/removeTrack with native variants in order to make
      // the interactions with legacy getLocalStreams behave as in other browsers.
      // Keeps a mapping stream.id => [stream, rtpsenders...]
      window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        var _this8 = this;
    
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        return Object.keys(this._shimmedLocalStreams).map(function (streamId) {
          return _this8._shimmedLocalStreams[streamId][0];
        });
      };
    
      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        if (!stream) {
          return origAddTrack.apply(this, arguments);
        }
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    
        var sender = origAddTrack.apply(this, arguments);
        if (!this._shimmedLocalStreams[stream.id]) {
          this._shimmedLocalStreams[stream.id] = [stream, sender];
        } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
          this._shimmedLocalStreams[stream.id].push(sender);
        }
        return sender;
      };
    
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this9 = this;
    
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    
        stream.getTracks().forEach(function (track) {
          var alreadyExists = _this9.getSenders().find(function (s) {
            return s.track === track;
          });
          if (alreadyExists) {
            throw new DOMException('Track already exists.', 'InvalidAccessError');
          }
        });
        var existingSenders = this.getSenders();
        origAddStream.apply(this, arguments);
        var newSenders = this.getSenders().filter(function (newSender) {
          return existingSenders.indexOf(newSender) === -1;
        });
        this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
      };
    
      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        delete this._shimmedLocalStreams[stream.id];
        return origRemoveStream.apply(this, arguments);
      };
    
      var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        var _this10 = this;
    
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        if (sender) {
          Object.keys(this._shimmedLocalStreams).forEach(function (streamId) {
            var idx = _this10._shimmedLocalStreams[streamId].indexOf(sender);
            if (idx !== -1) {
              _this10._shimmedLocalStreams[streamId].splice(idx, 1);
            }
            if (_this10._shimmedLocalStreams[streamId].length === 1) {
              delete _this10._shimmedLocalStreams[streamId];
            }
          });
        }
        return origRemoveTrack.apply(this, arguments);
      };
    }
    
    function shimAddTrackRemoveTrack(window, browserDetails) {
      if (!window.RTCPeerConnection) {
        return;
      }
      // shim addTrack and removeTrack.
      if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
        return shimAddTrackRemoveTrackWithNative(window);
      }
    
      // also shim pc.getLocalStreams when addTrack is shimmed
      // to return the original streams.
      var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
      window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        var _this11 = this;
    
        var nativeStreams = origGetLocalStreams.apply(this);
        this._reverseStreams = this._reverseStreams || {};
        return nativeStreams.map(function (stream) {
          return _this11._reverseStreams[stream.id];
        });
      };
    
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this12 = this;
    
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
    
        stream.getTracks().forEach(function (track) {
          var alreadyExists = _this12.getSenders().find(function (s) {
            return s.track === track;
          });
          if (alreadyExists) {
            throw new DOMException('Track already exists.', 'InvalidAccessError');
          }
        });
        // Add identity mapping for consistency with addTrack.
        // Unless this is being used with a stream from addTrack.
        if (!this._reverseStreams[stream.id]) {
          var newStream = new window.MediaStream(stream.getTracks());
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          stream = newStream;
        }
        origAddStream.apply(this, [stream]);
      };
    
      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
    
        origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
        delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
        delete this._streams[stream.id];
      };
    
      window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        var _this13 = this;
    
        if (this.signalingState === 'closed') {
          throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        }
        var streams = [].slice.call(arguments, 1);
        if (streams.length !== 1 || !streams[0].getTracks().find(function (t) {
          return t === track;
        })) {
          // this is not fully correct but all we can manage without
          // [[associated MediaStreams]] internal slot.
          throw new DOMException('The adapter.js addTrack polyfill only supports a single ' + ' stream which is associated with the specified track.', 'NotSupportedError');
        }
    
        var alreadyExists = this.getSenders().find(function (s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.', 'InvalidAccessError');
        }
    
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        var oldStream = this._streams[stream.id];
        if (oldStream) {
          // this is using odd Chrome behaviour, use with caution:
          // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
          // Note: we rely on the high-level addTrack/dtmf shim to
          // create the sender with a dtmf sender.
          oldStream.addTrack(track);
    
          // Trigger ONN async.
          Promise.resolve().then(function () {
            _this13.dispatchEvent(new Event('negotiationneeded'));
          });
        } else {
          var newStream = new window.MediaStream([track]);
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          this.addStream(newStream);
        }
        return this.getSenders().find(function (s) {
          return s.track === track;
        });
      };
    
      // replace the internal stream id with the external one and
      // vice versa.
      function replaceInternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
          var externalStream = pc._reverseStreams[internalId];
          var internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp: sdp
        });
      }
      function replaceExternalStreamId(pc, description) {
        var sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
          var externalStream = pc._reverseStreams[internalId];
          var internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp: sdp
        });
      }
      ['createOffer', 'createAnswer'].forEach(function (method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        var methodObj = _defineProperty({}, method, function () {
          var _this14 = this;
    
          var args = arguments;
          var isLegacyCall = arguments.length && typeof arguments[0] === 'function';
          if (isLegacyCall) {
            return nativeMethod.apply(this, [function (description) {
              var desc = replaceInternalStreamId(_this14, description);
              args[0].apply(null, [desc]);
            }, function (err) {
              if (args[1]) {
                args[1].apply(null, err);
              }
            }, arguments[2]]);
          }
          return nativeMethod.apply(this, arguments).then(function (description) {
            return replaceInternalStreamId(_this14, description);
          });
        });
        window.RTCPeerConnection.prototype[method] = methodObj[method];
      });
    
      var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
      window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        if (!arguments.length || !arguments[0].type) {
          return origSetLocalDescription.apply(this, arguments);
        }
        arguments[0] = replaceExternalStreamId(this, arguments[0]);
        return origSetLocalDescription.apply(this, arguments);
      };
    
      // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier
    
      var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
      Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
        get: function get() {
          var description = origLocalDescription.get.apply(this);
          if (description.type === '') {
            return description;
          }
          return replaceInternalStreamId(this, description);
        }
      });
    
      window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        var _this15 = this;
    
        if (this.signalingState === 'closed') {
          throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        }
        // We can not yet check for sender instanceof RTCRtpSender
        // since we shim RTPSender. So we check if sender._pc is set.
        if (!sender._pc) {
          throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.', 'TypeError');
        }
        var isLocal = sender._pc === this;
        if (!isLocal) {
          throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
        }
    
        // Search for the native stream the senders track belongs to.
        this._streams = this._streams || {};
        var stream = void 0;
        Object.keys(this._streams).forEach(function (streamid) {
          var hasTrack = _this15._streams[streamid].getTracks().find(function (track) {
            return sender.track === track;
          });
          if (hasTrack) {
            stream = _this15._streams[streamid];
          }
        });
    
        if (stream) {
          if (stream.getTracks().length === 1) {
            // if this is the last track of the stream, remove the stream. This
            // takes care of any shimmed _senders.
            this.removeStream(this._reverseStreams[stream.id]);
          } else {
            // relying on the same odd chrome behaviour as above.
            stream.removeTrack(sender.track);
          }
          this.dispatchEvent(new Event('negotiationneeded'));
        }
      };
    }
    
    function shimPeerConnection(window, browserDetails) {
      if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.webkitRTCPeerConnection;
      }
      if (!window.RTCPeerConnection) {
        return;
      }
    
      // shim implicit creation of RTCSessionDescription/RTCIceCandidate
      if (browserDetails.version < 53) {
        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          var methodObj = _defineProperty({}, method, function () {
            arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          });
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
      }
    }
    
    // Attempt to fix ONN in plan-b mode.
    function fixNegotiationNeeded(window, browserDetails) {
      utils.wrapPeerConnectionEvent(window, 'negotiationneeded', function (e) {
        var pc = e.target;
        if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === 'plan-b') {
          if (pc.signalingState !== 'stable') {
            return;
          }
        }
        return e;
      });
    }
    
    },{"../utils.js":11,"./getdisplaymedia":4,"./getusermedia":5}],4:[function(require,module,exports){
    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window, getSourceId) {
      if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      // getSourceId is a function that returns a promise resolving with
      // the sourceId of the screen/window/tab to be shared.
      if (typeof getSourceId !== 'function') {
        console.error('shimGetDisplayMedia: getSourceId argument is not ' + 'a function');
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        return getSourceId(constraints).then(function (sourceId) {
          var widthSpecified = constraints.video && constraints.video.width;
          var heightSpecified = constraints.video && constraints.video.height;
          var frameRateSpecified = constraints.video && constraints.video.frameRate;
          constraints.video = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxFrameRate: frameRateSpecified || 3
            }
          };
          if (widthSpecified) {
            constraints.video.mandatory.maxWidth = widthSpecified;
          }
          if (heightSpecified) {
            constraints.video.mandatory.maxHeight = heightSpecified;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        });
      };
    }
    
    },{}],5:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.shimGetUserMedia = shimGetUserMedia;
    
    var _utils = require('../utils.js');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    var logging = utils.log;
    
    function shimGetUserMedia(window, browserDetails) {
      var navigator = window && window.navigator;
    
      if (!navigator.mediaDevices) {
        return;
      }
    
      var constraintsToChrome_ = function constraintsToChrome_(c) {
        if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
          return c;
        }
        var cc = {};
        Object.keys(c).forEach(function (key) {
          if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
            return;
          }
          var r = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
          if (r.exact !== undefined && typeof r.exact === 'number') {
            r.min = r.max = r.exact;
          }
          var oldname_ = function oldname_(prefix, name) {
            if (prefix) {
              return prefix + name.charAt(0).toUpperCase() + name.slice(1);
            }
            return name === 'deviceId' ? 'sourceId' : name;
          };
          if (r.ideal !== undefined) {
            cc.optional = cc.optional || [];
            var oc = {};
            if (typeof r.ideal === 'number') {
              oc[oldname_('min', key)] = r.ideal;
              cc.optional.push(oc);
              oc = {};
              oc[oldname_('max', key)] = r.ideal;
              cc.optional.push(oc);
            } else {
              oc[oldname_('', key)] = r.ideal;
              cc.optional.push(oc);
            }
          }
          if (r.exact !== undefined && typeof r.exact !== 'number') {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_('', key)] = r.exact;
          } else {
            ['min', 'max'].forEach(function (mix) {
              if (r[mix] !== undefined) {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_(mix, key)] = r[mix];
              }
            });
          }
        });
        if (c.advanced) {
          cc.optional = (cc.optional || []).concat(c.advanced);
        }
        return cc;
      };
    
      var shimConstraints_ = function shimConstraints_(constraints, func) {
        if (browserDetails.version >= 61) {
          return func(constraints);
        }
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && _typeof(constraints.audio) === 'object') {
          var remap = function remap(obj, a, b) {
            if (a in obj && !(b in obj)) {
              obj[b] = obj[a];
              delete obj[a];
            }
          };
          constraints = JSON.parse(JSON.stringify(constraints));
          remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
          remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
          constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && _typeof(constraints.video) === 'object') {
          // Shim facingMode for mobile & surface pro.
          var face = constraints.video.facingMode;
          face = face && ((typeof face === 'undefined' ? 'undefined' : _typeof(face)) === 'object' ? face : { ideal: face });
          var getSupportedFacingModeLies = browserDetails.version < 66;
    
          if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
            delete constraints.video.facingMode;
            var matches = void 0;
            if (face.exact === 'environment' || face.ideal === 'environment') {
              matches = ['back', 'rear'];
            } else if (face.exact === 'user' || face.ideal === 'user') {
              matches = ['front'];
            }
            if (matches) {
              // Look for matches in label, or use last cam for back (typical).
              return navigator.mediaDevices.enumerateDevices().then(function (devices) {
                devices = devices.filter(function (d) {
                  return d.kind === 'videoinput';
                });
                var dev = devices.find(function (d) {
                  return matches.some(function (match) {
                    return d.label.toLowerCase().includes(match);
                  });
                });
                if (!dev && devices.length && matches.includes('back')) {
                  dev = devices[devices.length - 1]; // more likely the back cam
                }
                if (dev) {
                  constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
                }
                constraints.video = constraintsToChrome_(constraints.video);
                logging('chrome: ' + JSON.stringify(constraints));
                return func(constraints);
              });
            }
          }
          constraints.video = constraintsToChrome_(constraints.video);
        }
        logging('chrome: ' + JSON.stringify(constraints));
        return func(constraints);
      };
    
      var shimError_ = function shimError_(e) {
        if (browserDetails.version >= 64) {
          return e;
        }
        return {
          name: {
            PermissionDeniedError: 'NotAllowedError',
            PermissionDismissedError: 'NotAllowedError',
            InvalidStateError: 'NotAllowedError',
            DevicesNotFoundError: 'NotFoundError',
            ConstraintNotSatisfiedError: 'OverconstrainedError',
            TrackStartError: 'NotReadableError',
            MediaDeviceFailedDueToShutdown: 'NotAllowedError',
            MediaDeviceKillSwitchOn: 'NotAllowedError',
            TabCaptureError: 'AbortError',
            ScreenCaptureError: 'AbortError',
            DeviceCaptureError: 'AbortError'
          }[e.name] || e.name,
          message: e.message,
          constraint: e.constraint || e.constraintName,
          toString: function toString() {
            return this.name + (this.message && ': ') + this.message;
          }
        };
      };
    
      var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
        shimConstraints_(constraints, function (c) {
          navigator.webkitGetUserMedia(c, onSuccess, function (e) {
            if (onError) {
              onError(shimError_(e));
            }
          });
        });
      };
      navigator.getUserMedia = getUserMedia_.bind(navigator);
    
      // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
      // function which returns a Promise, it does not accept spec-style
      // constraints.
      if (navigator.mediaDevices.getUserMedia) {
        var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function (cs) {
          return shimConstraints_(cs, function (c) {
            return origGetUserMedia(c).then(function (stream) {
              if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                stream.getTracks().forEach(function (track) {
                  track.stop();
                });
                throw new DOMException('', 'NotFoundError');
              }
              return stream;
            }, function (e) {
              return Promise.reject(shimError_(e));
            });
          });
        };
      }
    }
    
    },{"../utils.js":11}],6:[function(require,module,exports){
    /*
     *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.shimRTCIceCandidate = shimRTCIceCandidate;
    exports.shimRTCIceCandidateRelayProtocol = shimRTCIceCandidateRelayProtocol;
    exports.shimMaxMessageSize = shimMaxMessageSize;
    exports.shimSendThrowTypeError = shimSendThrowTypeError;
    exports.shimConnectionState = shimConnectionState;
    exports.removeExtmapAllowMixed = removeExtmapAllowMixed;
    exports.shimAddIceCandidateNullOrEmpty = shimAddIceCandidateNullOrEmpty;
    exports.shimParameterlessSetLocalDescription = shimParameterlessSetLocalDescription;
    
    var _sdp = require('sdp');
    
    var _sdp2 = _interopRequireDefault(_sdp);
    
    var _utils = require('./utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function shimRTCIceCandidate(window) {
      // foundation is arbitrarily chosen as an indicator for full support for
      // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
      if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) {
        return;
      }
    
      var NativeRTCIceCandidate = window.RTCIceCandidate;
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        // Remove the a= which shouldn't be part of the candidate string.
        if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
          args = JSON.parse(JSON.stringify(args));
          args.candidate = args.candidate.substr(2);
        }
    
        if (args.candidate && args.candidate.length) {
          // Augment the native candidate with the parsed fields.
          var nativeCandidate = new NativeRTCIceCandidate(args);
          var parsedCandidate = _sdp2.default.parseCandidate(args.candidate);
          var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate);
    
          // Add a serializer that does not serialize the extra attributes.
          augmentedCandidate.toJSON = function toJSON() {
            return {
              candidate: augmentedCandidate.candidate,
              sdpMid: augmentedCandidate.sdpMid,
              sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
              usernameFragment: augmentedCandidate.usernameFragment
            };
          };
          return augmentedCandidate;
        }
        return new NativeRTCIceCandidate(args);
      };
      window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
    
      // Hook up the augmented candidate in onicecandidate and
      // addEventListener('icecandidate', ...)
      utils.wrapPeerConnectionEvent(window, 'icecandidate', function (e) {
        if (e.candidate) {
          Object.defineProperty(e, 'candidate', {
            value: new window.RTCIceCandidate(e.candidate),
            writable: 'false'
          });
        }
        return e;
      });
    }
    
    function shimRTCIceCandidateRelayProtocol(window) {
      if (!window.RTCIceCandidate || window.RTCIceCandidate && 'relayProtocol' in window.RTCIceCandidate.prototype) {
        return;
      }
    
      // Hook up the augmented candidate in onicecandidate and
      // addEventListener('icecandidate', ...)
      utils.wrapPeerConnectionEvent(window, 'icecandidate', function (e) {
        if (e.candidate) {
          var parsedCandidate = _sdp2.default.parseCandidate(e.candidate.candidate);
          if (parsedCandidate.type === 'relay') {
            // This is a libwebrtc-specific mapping of local type preference
            // to relayProtocol.
            e.candidate.relayProtocol = {
              0: 'tls',
              1: 'tcp',
              2: 'udp'
            }[parsedCandidate.priority >> 24];
          }
        }
        return e;
      });
    }
    
    function shimMaxMessageSize(window, browserDetails) {
      if (!window.RTCPeerConnection) {
        return;
      }
    
      if (!('sctp' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
          get: function get() {
            return typeof this._sctp === 'undefined' ? null : this._sctp;
          }
        });
      }
    
      var sctpInDescription = function sctpInDescription(description) {
        if (!description || !description.sdp) {
          return false;
        }
        var sections = _sdp2.default.splitSections(description.sdp);
        sections.shift();
        return sections.some(function (mediaSection) {
          var mLine = _sdp2.default.parseMLine(mediaSection);
          return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
        });
      };
    
      var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
        // TODO: Is there a better solution for detecting Firefox?
        var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
        if (match === null || match.length < 2) {
          return -1;
        }
        var version = parseInt(match[1], 10);
        // Test for NaN (yes, this is ugly)
        return version !== version ? -1 : version;
      };
    
      var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
        // Every implementation we know can send at least 64 KiB.
        // Note: Although Chrome is technically able to send up to 256 KiB, the
        //       data does not reach the other peer reliably.
        //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
        var canSendMaxMessageSize = 65536;
        if (browserDetails.browser === 'firefox') {
          if (browserDetails.version < 57) {
            if (remoteIsFirefox === -1) {
              // FF < 57 will send in 16 KiB chunks using the deprecated PPID
              // fragmentation.
              canSendMaxMessageSize = 16384;
            } else {
              // However, other FF (and RAWRTC) can reassemble PPID-fragmented
              // messages. Thus, supporting ~2 GiB when sending.
              canSendMaxMessageSize = 2147483637;
            }
          } else if (browserDetails.version < 60) {
            // Currently, all FF >= 57 will reset the remote maximum message size
            // to the default value when a data channel is created at a later
            // stage. :(
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
            canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
          } else {
            // FF >= 60 supports sending ~2 GiB
            canSendMaxMessageSize = 2147483637;
          }
        }
        return canSendMaxMessageSize;
      };
    
      var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
        // Note: 65536 bytes is the default value from the SDP spec. Also,
        //       every implementation we know supports receiving 65536 bytes.
        var maxMessageSize = 65536;
    
        // FF 57 has a slightly incorrect default remote max message size, so
        // we need to adjust it here to avoid a failure when sending.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
        if (browserDetails.browser === 'firefox' && browserDetails.version === 57) {
          maxMessageSize = 65535;
        }
    
        var match = _sdp2.default.matchPrefix(description.sdp, 'a=max-message-size:');
        if (match.length > 0) {
          maxMessageSize = parseInt(match[0].substr(19), 10);
        } else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) {
          // If the maximum message size is not present in the remote SDP and
          // both local and remote are Firefox, the remote peer can receive
          // ~2 GiB.
          maxMessageSize = 2147483637;
        }
        return maxMessageSize;
      };
    
      var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        this._sctp = null;
        // Chrome decided to not expose .sctp in plan-b mode.
        // As usual, adapter.js has to do an 'ugly worakaround'
        // to cover up the mess.
        if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
          var _getConfiguration = this.getConfiguration(),
              sdpSemantics = _getConfiguration.sdpSemantics;
    
          if (sdpSemantics === 'plan-b') {
            Object.defineProperty(this, 'sctp', {
              get: function get() {
                return typeof this._sctp === 'undefined' ? null : this._sctp;
              },
    
              enumerable: true,
              configurable: true
            });
          }
        }
    
        if (sctpInDescription(arguments[0])) {
          // Check if the remote is FF.
          var isFirefox = getRemoteFirefoxVersion(arguments[0]);
    
          // Get the maximum message size the local peer is capable of sending
          var canSendMMS = getCanSendMaxMessageSize(isFirefox);
    
          // Get the maximum message size of the remote peer.
          var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
    
          // Determine final maximum message size
          var maxMessageSize = void 0;
          if (canSendMMS === 0 && remoteMMS === 0) {
            maxMessageSize = Number.POSITIVE_INFINITY;
          } else if (canSendMMS === 0 || remoteMMS === 0) {
            maxMessageSize = Math.max(canSendMMS, remoteMMS);
          } else {
            maxMessageSize = Math.min(canSendMMS, remoteMMS);
          }
    
          // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
          // attribute.
          var sctp = {};
          Object.defineProperty(sctp, 'maxMessageSize', {
            get: function get() {
              return maxMessageSize;
            }
          });
          this._sctp = sctp;
        }
    
        return origSetRemoteDescription.apply(this, arguments);
      };
    }
    
    function shimSendThrowTypeError(window) {
      if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) {
        return;
      }
    
      // Note: Although Firefox >= 57 has a native implementation, the maximum
      //       message size can be reset for all data channels at a later stage.
      //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
    
      function wrapDcSend(dc, pc) {
        var origDataChannelSend = dc.send;
        dc.send = function send() {
          var data = arguments[0];
          var length = data.length || data.size || data.byteLength;
          if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) {
            throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
          }
          return origDataChannelSend.apply(dc, arguments);
        };
      }
      var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
      window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
        var dataChannel = origCreateDataChannel.apply(this, arguments);
        wrapDcSend(dataChannel, this);
        return dataChannel;
      };
      utils.wrapPeerConnectionEvent(window, 'datachannel', function (e) {
        wrapDcSend(e.channel, e.target);
        return e;
      });
    }
    
    /* shims RTCConnectionState by pretending it is the same as iceConnectionState.
     * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
     * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
     * since DTLS failures would be hidden. See
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
     * for the Firefox tracking bug.
     */
    function shimConnectionState(window) {
      if (!window.RTCPeerConnection || 'connectionState' in window.RTCPeerConnection.prototype) {
        return;
      }
      var proto = window.RTCPeerConnection.prototype;
      Object.defineProperty(proto, 'connectionState', {
        get: function get() {
          return {
            completed: 'connected',
            checking: 'connecting'
          }[this.iceConnectionState] || this.iceConnectionState;
        },
    
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(proto, 'onconnectionstatechange', {
        get: function get() {
          return this._onconnectionstatechange || null;
        },
        set: function set(cb) {
          if (this._onconnectionstatechange) {
            this.removeEventListener('connectionstatechange', this._onconnectionstatechange);
            delete this._onconnectionstatechange;
          }
          if (cb) {
            this.addEventListener('connectionstatechange', this._onconnectionstatechange = cb);
          }
        },
    
        enumerable: true,
        configurable: true
      });
    
      ['setLocalDescription', 'setRemoteDescription'].forEach(function (method) {
        var origMethod = proto[method];
        proto[method] = function () {
          if (!this._connectionstatechangepoly) {
            this._connectionstatechangepoly = function (e) {
              var pc = e.target;
              if (pc._lastConnectionState !== pc.connectionState) {
                pc._lastConnectionState = pc.connectionState;
                var newEvent = new Event('connectionstatechange', e);
                pc.dispatchEvent(newEvent);
              }
              return e;
            };
            this.addEventListener('iceconnectionstatechange', this._connectionstatechangepoly);
          }
          return origMethod.apply(this, arguments);
        };
      });
    }
    
    function removeExtmapAllowMixed(window, browserDetails) {
      /* remove a=extmap-allow-mixed for webrtc.org < M71 */
      if (!window.RTCPeerConnection) {
        return;
      }
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
        return;
      }
      if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
        return;
      }
      var nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
        if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
          var sdp = desc.sdp.split('\n').filter(function (line) {
            return line.trim() !== 'a=extmap-allow-mixed';
          }).join('\n');
          // Safari enforces read-only-ness of RTCSessionDescription fields.
          if (window.RTCSessionDescription && desc instanceof window.RTCSessionDescription) {
            arguments[0] = new window.RTCSessionDescription({
              type: desc.type,
              sdp: sdp
            });
          } else {
            desc.sdp = sdp;
          }
        }
        return nativeSRD.apply(this, arguments);
      };
    }
    
    function shimAddIceCandidateNullOrEmpty(window, browserDetails) {
      // Support for addIceCandidate(null or undefined)
      // as well as addIceCandidate({candidate: "", ...})
      // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
      // Note: must be called before other polyfills which change the signature.
      if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
        return;
      }
      var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
      if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
        return;
      }
      window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
        if (!arguments[0]) {
          if (arguments[1]) {
            arguments[1].apply(null);
          }
          return Promise.resolve();
        }
        // Firefox 68+ emits and processes {candidate: "", ...}, ignore
        // in older versions.
        // Native support for ignoring exists for Chrome M77+.
        // Safari ignores as well, exact version unknown but works in the same
        // version that also ignores addIceCandidate(null).
        if ((browserDetails.browser === 'chrome' && browserDetails.version < 78 || browserDetails.browser === 'firefox' && browserDetails.version < 68 || browserDetails.browser === 'safari') && arguments[0] && arguments[0].candidate === '') {
          return Promise.resolve();
        }
        return nativeAddIceCandidate.apply(this, arguments);
      };
    }
    
    // Note: Make sure to call this ahead of APIs that modify
    // setLocalDescription.length
    function shimParameterlessSetLocalDescription(window, browserDetails) {
      if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
        return;
      }
      var nativeSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
      if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) {
        return;
      }
      window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        var _this = this;
    
        var desc = arguments[0] || {};
        if ((typeof desc === 'undefined' ? 'undefined' : _typeof(desc)) !== 'object' || desc.type && desc.sdp) {
          return nativeSetLocalDescription.apply(this, arguments);
        }
        // The remaining steps should technically happen when SLD comes off the
        // RTCPeerConnection's operations chain (not ahead of going on it), but
        // this is too difficult to shim. Instead, this shim only covers the
        // common case where the operations chain is empty. This is imperfect, but
        // should cover many cases. Rationale: Even if we can't reduce the glare
        // window to zero on imperfect implementations, there's value in tapping
        // into the perfect negotiation pattern that several browsers support.
        desc = { type: desc.type, sdp: desc.sdp };
        if (!desc.type) {
          switch (this.signalingState) {
            case 'stable':
            case 'have-local-offer':
            case 'have-remote-pranswer':
              desc.type = 'offer';
              break;
            default:
              desc.type = 'answer';
              break;
          }
        }
        if (desc.sdp || desc.type !== 'offer' && desc.type !== 'answer') {
          return nativeSetLocalDescription.apply(this, [desc]);
        }
        var func = desc.type === 'offer' ? this.createOffer : this.createAnswer;
        return func.apply(this).then(function (d) {
          return nativeSetLocalDescription.apply(_this, [d]);
        });
      };
    }
    
    },{"./utils":11,"sdp":12}],7:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var _getusermedia = require('./getusermedia');
    
    Object.defineProperty(exports, 'shimGetUserMedia', {
      enumerable: true,
      get: function get() {
        return _getusermedia.shimGetUserMedia;
      }
    });
    
    var _getdisplaymedia = require('./getdisplaymedia');
    
    Object.defineProperty(exports, 'shimGetDisplayMedia', {
      enumerable: true,
      get: function get() {
        return _getdisplaymedia.shimGetDisplayMedia;
      }
    });
    exports.shimOnTrack = shimOnTrack;
    exports.shimPeerConnection = shimPeerConnection;
    exports.shimSenderGetStats = shimSenderGetStats;
    exports.shimReceiverGetStats = shimReceiverGetStats;
    exports.shimRemoveStream = shimRemoveStream;
    exports.shimRTCDataChannel = shimRTCDataChannel;
    exports.shimAddTransceiver = shimAddTransceiver;
    exports.shimGetParameters = shimGetParameters;
    exports.shimCreateOffer = shimCreateOffer;
    exports.shimCreateAnswer = shimCreateAnswer;
    
    var _utils = require('../utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
    
    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    
    function shimOnTrack(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get: function get() {
            return { receiver: this.receiver };
          }
        });
      }
    }
    
    function shimPeerConnection(window, browserDetails) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
        return; // probably media.peerconnection.enabled=false in about:config
      }
      if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.mozRTCPeerConnection;
      }
    
      if (browserDetails.version < 53) {
        // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          var methodObj = _defineProperty({}, method, function () {
            arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          });
          window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
      }
    
      var modernStatsTypes = {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      };
    
      var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        var _arguments = Array.prototype.slice.call(arguments),
            selector = _arguments[0],
            onSucc = _arguments[1],
            onErr = _arguments[2];
    
        return nativeGetStats.apply(this, [selector || null]).then(function (stats) {
          if (browserDetails.version < 53 && !onSucc) {
            // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
              stats.forEach(function (stat) {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== 'TypeError') {
                throw e;
              }
              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
              stats.forEach(function (stat, i) {
                stats.set(i, Object.assign({}, stat, {
                  type: modernStatsTypes[stat.type] || stat.type
                }));
              });
            }
          }
          return stats;
        }).then(onSucc, onErr);
      };
    }
    
    function shimSenderGetStats(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
        return;
      }
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          var _this = this;
    
          var senders = origGetSenders.apply(this, []);
          senders.forEach(function (sender) {
            return sender._pc = _this;
          });
          return senders;
        };
      }
    
      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function addTrack() {
          var sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window.RTCRtpSender.prototype.getStats = function getStats() {
        return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
      };
    }
    
    function shimReceiverGetStats(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
        return;
      }
      var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
          var _this2 = this;
    
          var receivers = origGetReceivers.apply(this, []);
          receivers.forEach(function (receiver) {
            return receiver._pc = _this2;
          });
          return receivers;
        };
      }
      utils.wrapPeerConnectionEvent(window, 'track', function (e) {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window.RTCRtpReceiver.prototype.getStats = function getStats() {
        return this._pc.getStats(this.track);
      };
    }
    
    function shimRemoveStream(window) {
      if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) {
        return;
      }
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        var _this3 = this;
    
        utils.deprecated('removeStream', 'removeTrack');
        this.getSenders().forEach(function (sender) {
          if (sender.track && stream.getTracks().includes(sender.track)) {
            _this3.removeTrack(sender);
          }
        });
      };
    }
    
    function shimRTCDataChannel(window) {
      // rename DataChannel to RTCDataChannel (native fix in FF60):
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
      if (window.DataChannel && !window.RTCDataChannel) {
        window.RTCDataChannel = window.DataChannel;
      }
    }
    
    function shimAddTransceiver(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
        return;
      }
      var origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
      if (origAddTransceiver) {
        window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
          this.setParametersPromises = [];
          // WebIDL input coercion and validation
          var sendEncodings = arguments[1] && arguments[1].sendEncodings;
          if (sendEncodings === undefined) {
            sendEncodings = [];
          }
          sendEncodings = [].concat(_toConsumableArray(sendEncodings));
          var shouldPerformCheck = sendEncodings.length > 0;
          if (shouldPerformCheck) {
            // If sendEncodings params are provided, validate grammar
            sendEncodings.forEach(function (encodingParam) {
              if ('rid' in encodingParam) {
                var ridRegex = /^[a-z0-9]{0,16}$/i;
                if (!ridRegex.test(encodingParam.rid)) {
                  throw new TypeError('Invalid RID value provided.');
                }
              }
              if ('scaleResolutionDownBy' in encodingParam) {
                if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                  throw new RangeError('scale_resolution_down_by must be >= 1.0');
                }
              }
              if ('maxFramerate' in encodingParam) {
                if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                  throw new RangeError('max_framerate must be >= 0.0');
                }
              }
            });
          }
          var transceiver = origAddTransceiver.apply(this, arguments);
          if (shouldPerformCheck) {
            // Check if the init options were applied. If not we do this in an
            // asynchronous way and save the promise reference in a global object.
            // This is an ugly hack, but at the same time is way more robust than
            // checking the sender parameters before and after the createOffer
            // Also note that after the createoffer we are not 100% sure that
            // the params were asynchronously applied so we might miss the
            // opportunity to recreate offer.
            var sender = transceiver.sender;
    
            var params = sender.getParameters();
            if (!('encodings' in params) ||
            // Avoid being fooled by patched getParameters() below.
            params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
              params.encodings = sendEncodings;
              sender.sendEncodings = sendEncodings;
              this.setParametersPromises.push(sender.setParameters(params).then(function () {
                delete sender.sendEncodings;
              }).catch(function () {
                delete sender.sendEncodings;
              }));
            }
          }
          return transceiver;
        };
      }
    }
    
    function shimGetParameters(window) {
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCRtpSender)) {
        return;
      }
      var origGetParameters = window.RTCRtpSender.prototype.getParameters;
      if (origGetParameters) {
        window.RTCRtpSender.prototype.getParameters = function getParameters() {
          var params = origGetParameters.apply(this, arguments);
          if (!('encodings' in params)) {
            params.encodings = [].concat(this.sendEncodings || [{}]);
          }
          return params;
        };
      }
    }
    
    function shimCreateOffer(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
        return;
      }
      var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function createOffer() {
        var _this4 = this,
            _arguments2 = arguments;
    
        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises).then(function () {
            return origCreateOffer.apply(_this4, _arguments2);
          }).finally(function () {
            _this4.setParametersPromises = [];
          });
        }
        return origCreateOffer.apply(this, arguments);
      };
    }
    
    function shimCreateAnswer(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
        return;
      }
      var origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
      window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
        var _this5 = this,
            _arguments3 = arguments;
    
        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises).then(function () {
            return origCreateAnswer.apply(_this5, _arguments3);
          }).finally(function () {
            _this5.setParametersPromises = [];
          });
        }
        return origCreateAnswer.apply(this, arguments);
      };
    }
    
    },{"../utils":11,"./getdisplaymedia":8,"./getusermedia":9}],8:[function(require,module,exports){
    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.shimGetDisplayMedia = shimGetDisplayMedia;
    function shimGetDisplayMedia(window, preferredMediaSource) {
      if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!window.navigator.mediaDevices) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        if (!(constraints && constraints.video)) {
          var err = new DOMException('getDisplayMedia without video ' + 'constraints is undefined');
          err.name = 'NotFoundError';
          // from https://heycam.github.io/webidl/#idl-DOMException-error-names
          err.code = 8;
          return Promise.reject(err);
        }
        if (constraints.video === true) {
          constraints.video = { mediaSource: preferredMediaSource };
        } else {
          constraints.video.mediaSource = preferredMediaSource;
        }
        return window.navigator.mediaDevices.getUserMedia(constraints);
      };
    }
    
    },{}],9:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.shimGetUserMedia = shimGetUserMedia;
    
    var _utils = require('../utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function shimGetUserMedia(window, browserDetails) {
      var navigator = window && window.navigator;
      var MediaStreamTrack = window && window.MediaStreamTrack;
    
      navigator.getUserMedia = function (constraints, onSuccess, onError) {
        // Replace Firefox 44+'s deprecation warning with unprefixed version.
        utils.deprecated('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      };
    
      if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
        var remap = function remap(obj, a, b) {
          if (a in obj && !(b in obj)) {
            obj[b] = obj[a];
            delete obj[a];
          }
        };
    
        var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function (c) {
          if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object' && _typeof(c.audio) === 'object') {
            c = JSON.parse(JSON.stringify(c));
            remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
            remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
          }
          return nativeGetUserMedia(c);
        };
    
        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
          var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
          MediaStreamTrack.prototype.getSettings = function () {
            var obj = nativeGetSettings.apply(this, arguments);
            remap(obj, 'mozAutoGainControl', 'autoGainControl');
            remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
            return obj;
          };
        }
    
        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
          var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
          MediaStreamTrack.prototype.applyConstraints = function (c) {
            if (this.kind === 'audio' && (typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
              c = JSON.parse(JSON.stringify(c));
              remap(c, 'autoGainControl', 'mozAutoGainControl');
              remap(c, 'noiseSuppression', 'mozNoiseSuppression');
            }
            return nativeApplyConstraints.apply(this, [c]);
          };
        }
      }
    }
    
    },{"../utils":11}],10:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.shimLocalStreamsAPI = shimLocalStreamsAPI;
    exports.shimRemoteStreamsAPI = shimRemoteStreamsAPI;
    exports.shimCallbacksAPI = shimCallbacksAPI;
    exports.shimGetUserMedia = shimGetUserMedia;
    exports.shimConstraints = shimConstraints;
    exports.shimRTCIceServerUrls = shimRTCIceServerUrls;
    exports.shimTrackEventTransceiver = shimTrackEventTransceiver;
    exports.shimCreateOfferLegacy = shimCreateOfferLegacy;
    exports.shimAudioContext = shimAudioContext;
    
    var _utils = require('../utils');
    
    var utils = _interopRequireWildcard(_utils);
    
    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
    
    function shimLocalStreamsAPI(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
          if (!this._localStreams) {
            this._localStreams = [];
          }
          return this._localStreams;
        };
      }
      if (!('addStream' in window.RTCPeerConnection.prototype)) {
        var _addTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          var _this = this;
    
          if (!this._localStreams) {
            this._localStreams = [];
          }
          if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
          // Try to emulate Chrome's behaviour of adding in audio-video order.
          // Safari orders by track id.
          stream.getAudioTracks().forEach(function (track) {
            return _addTrack.call(_this, track, stream);
          });
          stream.getVideoTracks().forEach(function (track) {
            return _addTrack.call(_this, track, stream);
          });
        };
    
        window.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
          var _this2 = this;
    
          for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            streams[_key - 1] = arguments[_key];
          }
    
          if (streams) {
            streams.forEach(function (stream) {
              if (!_this2._localStreams) {
                _this2._localStreams = [stream];
              } else if (!_this2._localStreams.includes(stream)) {
                _this2._localStreams.push(stream);
              }
            });
          }
          return _addTrack.apply(this, arguments);
        };
      }
      if (!('removeStream' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
          var _this3 = this;
    
          if (!this._localStreams) {
            this._localStreams = [];
          }
          var index = this._localStreams.indexOf(stream);
          if (index === -1) {
            return;
          }
          this._localStreams.splice(index, 1);
          var tracks = stream.getTracks();
          this.getSenders().forEach(function (sender) {
            if (tracks.includes(sender.track)) {
              _this3.removeTrack(sender);
            }
          });
        };
      }
    }
    
    function shimRemoteStreamsAPI(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
          return this._remoteStreams ? this._remoteStreams : [];
        };
      }
      if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
          get: function get() {
            return this._onaddstream;
          },
          set: function set(f) {
            var _this4 = this;
    
            if (this._onaddstream) {
              this.removeEventListener('addstream', this._onaddstream);
              this.removeEventListener('track', this._onaddstreampoly);
            }
            this.addEventListener('addstream', this._onaddstream = f);
            this.addEventListener('track', this._onaddstreampoly = function (e) {
              e.streams.forEach(function (stream) {
                if (!_this4._remoteStreams) {
                  _this4._remoteStreams = [];
                }
                if (_this4._remoteStreams.includes(stream)) {
                  return;
                }
                _this4._remoteStreams.push(stream);
                var event = new Event('addstream');
                event.stream = stream;
                _this4.dispatchEvent(event);
              });
            });
          }
        });
        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
          var pc = this;
          if (!this._onaddstreampoly) {
            this.addEventListener('track', this._onaddstreampoly = function (e) {
              e.streams.forEach(function (stream) {
                if (!pc._remoteStreams) {
                  pc._remoteStreams = [];
                }
                if (pc._remoteStreams.indexOf(stream) >= 0) {
                  return;
                }
                pc._remoteStreams.push(stream);
                var event = new Event('addstream');
                event.stream = stream;
                pc.dispatchEvent(event);
              });
            });
          }
          return origSetRemoteDescription.apply(pc, arguments);
        };
      }
    }
    
    function shimCallbacksAPI(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      var prototype = window.RTCPeerConnection.prototype;
      var origCreateOffer = prototype.createOffer;
      var origCreateAnswer = prototype.createAnswer;
      var setLocalDescription = prototype.setLocalDescription;
      var setRemoteDescription = prototype.setRemoteDescription;
      var addIceCandidate = prototype.addIceCandidate;
    
      prototype.createOffer = function createOffer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateOffer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
    
      prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
        var promise = origCreateAnswer.apply(this, [options]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
    
      var withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setLocalDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setLocalDescription = withCallback;
    
      withCallback = function withCallback(description, successCallback, failureCallback) {
        var promise = setRemoteDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setRemoteDescription = withCallback;
    
      withCallback = function withCallback(candidate, successCallback, failureCallback) {
        var promise = addIceCandidate.apply(this, [candidate]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.addIceCandidate = withCallback;
    }
    
    function shimGetUserMedia(window) {
      var navigator = window && window.navigator;
    
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // shim not needed in Safari 12.1
        var mediaDevices = navigator.mediaDevices;
        var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator.mediaDevices.getUserMedia = function (constraints) {
          return _getUserMedia(shimConstraints(constraints));
        };
      }
    
      if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
        }.bind(navigator);
      }
    }
    
    function shimConstraints(constraints) {
      if (constraints && constraints.video !== undefined) {
        return Object.assign({}, constraints, { video: utils.compactObject(constraints.video) });
      }
    
      return constraints;
    }
    
    function shimRTCIceServerUrls(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
      var OrigPeerConnection = window.RTCPeerConnection;
      window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
          var newIceServers = [];
          for (var i = 0; i < pcConfig.iceServers.length; i++) {
            var server = pcConfig.iceServers[i];
            if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
              utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
              server = JSON.parse(JSON.stringify(server));
              server.urls = server.url;
              delete server.url;
              newIceServers.push(server);
            } else {
              newIceServers.push(pcConfig.iceServers[i]);
            }
          }
          pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if ('generateCertificate' in OrigPeerConnection) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function get() {
            return OrigPeerConnection.generateCertificate;
          }
        });
      }
    }
    
    function shimTrackEventTransceiver(window) {
      // Add event.transceiver member over deprecated event.receiver
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get: function get() {
            return { receiver: this.receiver };
          }
        });
      }
    }
    
    function shimCreateOfferLegacy(window) {
      var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
        if (offerOptions) {
          if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
            // support bit values
            offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
          }
          var audioTransceiver = this.getTransceivers().find(function (transceiver) {
            return transceiver.receiver.track.kind === 'audio';
          });
          if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
            if (audioTransceiver.direction === 'sendrecv') {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection('sendonly');
              } else {
                audioTransceiver.direction = 'sendonly';
              }
            } else if (audioTransceiver.direction === 'recvonly') {
              if (audioTransceiver.setDirection) {
                audioTransceiver.setDirection('inactive');
              } else {
                audioTransceiver.direction = 'inactive';
              }
            }
          } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
            this.addTransceiver('audio', { direction: 'recvonly' });
          }
    
          if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
            // support bit values
            offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
          }
          var videoTransceiver = this.getTransceivers().find(function (transceiver) {
            return transceiver.receiver.track.kind === 'video';
          });
          if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
            if (videoTransceiver.direction === 'sendrecv') {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection('sendonly');
              } else {
                videoTransceiver.direction = 'sendonly';
              }
            } else if (videoTransceiver.direction === 'recvonly') {
              if (videoTransceiver.setDirection) {
                videoTransceiver.setDirection('inactive');
              } else {
                videoTransceiver.direction = 'inactive';
              }
            }
          } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
            this.addTransceiver('video', { direction: 'recvonly' });
          }
        }
        return origCreateOffer.apply(this, arguments);
      };
    }
    
    function shimAudioContext(window) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || window.AudioContext) {
        return;
      }
      window.AudioContext = window.webkitAudioContext;
    }
    
    },{"../utils":11}],11:[function(require,module,exports){
    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    /* eslint-env node */
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    exports.extractVersion = extractVersion;
    exports.wrapPeerConnectionEvent = wrapPeerConnectionEvent;
    exports.disableLog = disableLog;
    exports.disableWarnings = disableWarnings;
    exports.log = log;
    exports.deprecated = deprecated;
    exports.detectBrowser = detectBrowser;
    exports.compactObject = compactObject;
    exports.walkStats = walkStats;
    exports.filterStats = filterStats;
    
    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    
    var logDisabled_ = true;
    var deprecationWarnings_ = true;
    
    /**
     * Extract browser version out of the provided user agent string.
     *
     * @param {!string} uastring userAgent string.
     * @param {!string} expr Regular expression used as match criteria.
     * @param {!number} pos position in the version string to be returned.
     * @return {!number} browser version.
     */
    function extractVersion(uastring, expr, pos) {
      var match = uastring.match(expr);
      return match && match.length >= pos && parseInt(match[pos], 10);
    }
    
    // Wraps the peerconnection event eventNameToWrap in a function
    // which returns the modified event object (or false to prevent
    // the event).
    function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
      if (!window.RTCPeerConnection) {
        return;
      }
      var proto = window.RTCPeerConnection.prototype;
      var nativeAddEventListener = proto.addEventListener;
      proto.addEventListener = function (nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) {
          return nativeAddEventListener.apply(this, arguments);
        }
        var wrappedCallback = function wrappedCallback(e) {
          var modifiedEvent = wrapper(e);
          if (modifiedEvent) {
            if (cb.handleEvent) {
              cb.handleEvent(modifiedEvent);
            } else {
              cb(modifiedEvent);
            }
          }
        };
        this._eventMap = this._eventMap || {};
        if (!this._eventMap[eventNameToWrap]) {
          this._eventMap[eventNameToWrap] = new Map();
        }
        this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
        return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
      };
    
      var nativeRemoveEventListener = proto.removeEventListener;
      proto.removeEventListener = function (nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        if (!this._eventMap[eventNameToWrap].has(cb)) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        var unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
        this._eventMap[eventNameToWrap].delete(cb);
        if (this._eventMap[eventNameToWrap].size === 0) {
          delete this._eventMap[eventNameToWrap];
        }
        if (Object.keys(this._eventMap).length === 0) {
          delete this._eventMap;
        }
        return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
      };
    
      Object.defineProperty(proto, 'on' + eventNameToWrap, {
        get: function get() {
          return this['_on' + eventNameToWrap];
        },
        set: function set(cb) {
          if (this['_on' + eventNameToWrap]) {
            this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
            delete this['_on' + eventNameToWrap];
          }
          if (cb) {
            this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
          }
        },
    
        enumerable: true,
        configurable: true
      });
    }
    
    function disableLog(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
      }
      logDisabled_ = bool;
      return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
    }
    
    /**
     * Disable or enable deprecation warnings
     * @param {!boolean} bool set to true to disable warnings.
     */
    function disableWarnings(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
      }
      deprecationWarnings_ = !bool;
      return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
    }
    
    function log() {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
        if (logDisabled_) {
          return;
        }
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log.apply(console, arguments);
        }
      }
    }
    
    /**
     * Shows a deprecation warning suggesting the modern and spec-compatible API.
     */
    function deprecated(oldMethod, newMethod) {
      if (!deprecationWarnings_) {
        return;
      }
      console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
    }
    
    /**
     * Browser detector.
     *
     * @return {object} result containing browser and version
     *     properties.
     */
    function detectBrowser(window) {
      // Returned result object.
      var result = { browser: null, version: null };
    
      // Fail early if it's not a browser
      if (typeof window === 'undefined' || !window.navigator) {
        result.browser = 'Not a browser.';
        return result;
      }
    
      var navigator = window.navigator;
    
    
      if (navigator.mozGetUserMedia) {
        // Firefox.
        result.browser = 'firefox';
        result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
      } else if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection) {
        // Chrome, Chromium, Webview, Opera.
        // Version matches Chrome/WebRTC version.
        // Chrome 74 removed webkitGetUserMedia on http as well so we need the
        // more complicated fallback to webkitRTCPeerConnection.
        result.browser = 'chrome';
        result.version = extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
      } else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        // Safari.
        result.browser = 'safari';
        result.version = extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
        result.supportsUnifiedPlan = window.RTCRtpTransceiver && 'currentDirection' in window.RTCRtpTransceiver.prototype;
      } else {
        // Default fallthrough: not supported.
        result.browser = 'Not a supported browser.';
        return result;
      }
    
      return result;
    }
    
    /**
     * Checks if something is an object.
     *
     * @param {*} val The something you want to check.
     * @return true if val is an object, false otherwise.
     */
    function isObject(val) {
      return Object.prototype.toString.call(val) === '[object Object]';
    }
    
    /**
     * Remove all empty objects and undefined values
     * from a nested object -- an enhanced and vanilla version
     * of Lodash's `compact`.
     */
    function compactObject(data) {
      if (!isObject(data)) {
        return data;
      }
    
      return Object.keys(data).reduce(function (accumulator, key) {
        var isObj = isObject(data[key]);
        var value = isObj ? compactObject(data[key]) : data[key];
        var isEmptyObject = isObj && !Object.keys(value).length;
        if (value === undefined || isEmptyObject) {
          return accumulator;
        }
        return Object.assign(accumulator, _defineProperty({}, key, value));
      }, {});
    }
    
    /* iterates the stats graph recursively. */
    function walkStats(stats, base, resultSet) {
      if (!base || resultSet.has(base.id)) {
        return;
      }
      resultSet.set(base.id, base);
      Object.keys(base).forEach(function (name) {
        if (name.endsWith('Id')) {
          walkStats(stats, stats.get(base[name]), resultSet);
        } else if (name.endsWith('Ids')) {
          base[name].forEach(function (id) {
            walkStats(stats, stats.get(id), resultSet);
          });
        }
      });
    }
    
    /* filter getStats for a sender/receiver track. */
    function filterStats(result, track, outbound) {
      var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
      var filteredResult = new Map();
      if (track === null) {
        return filteredResult;
      }
      var trackStats = [];
      result.forEach(function (value) {
        if (value.type === 'track' && value.trackIdentifier === track.id) {
          trackStats.push(value);
        }
      });
      trackStats.forEach(function (trackStat) {
        result.forEach(function (stats) {
          if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
            walkStats(result, stats, filteredResult);
          }
        });
      });
      return filteredResult;
    }
    
    },{}],12:[function(require,module,exports){
    /* eslint-env node */
    'use strict';
    
    // SDP helpers.
    
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    
    var SDPUtils = {};
    
    // Generate an alphanumeric identifier for cname or mids.
    // TODO: use UUIDs instead? https://gist.github.com/jed/982883
    SDPUtils.generateIdentifier = function () {
      return Math.random().toString(36).substr(2, 10);
    };
    
    // The RTCP CNAME used by all peerconnections from the same JS.
    SDPUtils.localCName = SDPUtils.generateIdentifier();
    
    // Splits SDP into lines, dealing with both CRLF and LF.
    SDPUtils.splitLines = function (blob) {
      return blob.trim().split('\n').map(function (line) {
        return line.trim();
      });
    };
    // Splits SDP into sessionpart and mediasections. Ensures CRLF.
    SDPUtils.splitSections = function (blob) {
      var parts = blob.split('\nm=');
      return parts.map(function (part, index) {
        return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
      });
    };
    
    // Returns the session description.
    SDPUtils.getDescription = function (blob) {
      var sections = SDPUtils.splitSections(blob);
      return sections && sections[0];
    };
    
    // Returns the individual media sections.
    SDPUtils.getMediaSections = function (blob) {
      var sections = SDPUtils.splitSections(blob);
      sections.shift();
      return sections;
    };
    
    // Returns lines that start with a certain prefix.
    SDPUtils.matchPrefix = function (blob, prefix) {
      return SDPUtils.splitLines(blob).filter(function (line) {
        return line.indexOf(prefix) === 0;
      });
    };
    
    // Parses an ICE candidate line. Sample input:
    // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
    // rport 55996"
    // Input can be prefixed with a=.
    SDPUtils.parseCandidate = function (line) {
      var parts = void 0;
      // Parse both variants.
      if (line.indexOf('a=candidate:') === 0) {
        parts = line.substring(12).split(' ');
      } else {
        parts = line.substring(10).split(' ');
      }
    
      var candidate = {
        foundation: parts[0],
        component: { 1: 'rtp', 2: 'rtcp' }[parts[1]] || parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4], // address is an alias for ip.
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
      };
    
      for (var i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case 'raddr':
            candidate.relatedAddress = parts[i + 1];
            break;
          case 'rport':
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case 'tcptype':
            candidate.tcpType = parts[i + 1];
            break;
          case 'ufrag':
            candidate.ufrag = parts[i + 1]; // for backward compatibility.
            candidate.usernameFragment = parts[i + 1];
            break;
          default:
            // extension handling, in particular ufrag. Don't overwrite.
            if (candidate[parts[i]] === undefined) {
              candidate[parts[i]] = parts[i + 1];
            }
            break;
        }
      }
      return candidate;
    };
    
    // Translates a candidate object into SDP candidate attribute.
    // This does not include the a= prefix!
    SDPUtils.writeCandidate = function (candidate) {
      var sdp = [];
      sdp.push(candidate.foundation);
    
      var component = candidate.component;
      if (component === 'rtp') {
        sdp.push(1);
      } else if (component === 'rtcp') {
        sdp.push(2);
      } else {
        sdp.push(component);
      }
      sdp.push(candidate.protocol.toUpperCase());
      sdp.push(candidate.priority);
      sdp.push(candidate.address || candidate.ip);
      sdp.push(candidate.port);
    
      var type = candidate.type;
      sdp.push('typ');
      sdp.push(type);
      if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
        sdp.push('raddr');
        sdp.push(candidate.relatedAddress);
        sdp.push('rport');
        sdp.push(candidate.relatedPort);
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
        sdp.push('tcptype');
        sdp.push(candidate.tcpType);
      }
      if (candidate.usernameFragment || candidate.ufrag) {
        sdp.push('ufrag');
        sdp.push(candidate.usernameFragment || candidate.ufrag);
      }
      return 'candidate:' + sdp.join(' ');
    };
    
    // Parses an ice-options line, returns an array of option tags.
    // Sample input:
    // a=ice-options:foo bar
    SDPUtils.parseIceOptions = function (line) {
      return line.substr(14).split(' ');
    };
    
    // Parses a rtpmap line, returns RTCRtpCoddecParameters. Sample input:
    // a=rtpmap:111 opus/48000/2
    SDPUtils.parseRtpMap = function (line) {
      var parts = line.substr(9).split(' ');
      var parsed = {
        payloadType: parseInt(parts.shift(), 10) // was: id
      };
    
      parts = parts[0].split('/');
    
      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
      parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      // legacy alias, got renamed back to channels in ORTC.
      parsed.numChannels = parsed.channels;
      return parsed;
    };
    
    // Generates a rtpmap line from RTCRtpCodecCapability or
    // RTCRtpCodecParameters.
    SDPUtils.writeRtpMap = function (codec) {
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      var channels = codec.channels || codec.numChannels || 1;
      return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate + (channels !== 1 ? '/' + channels : '') + '\r\n';
    };
    
    // Parses a extmap line (headerextension from RFC 5285). Sample input:
    // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
    // a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
    SDPUtils.parseExtmap = function (line) {
      var parts = line.substr(9).split(' ');
      return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
        uri: parts[1]
      };
    };
    
    // Generates an extmap line from RTCRtpHeaderExtensionParameters or
    // RTCRtpHeaderExtension.
    SDPUtils.writeExtmap = function (headerExtension) {
      return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== 'sendrecv' ? '/' + headerExtension.direction : '') + ' ' + headerExtension.uri + '\r\n';
    };
    
    // Parses a fmtp line, returns dictionary. Sample input:
    // a=fmtp:96 vbr=on;cng=on
    // Also deals with vbr=on; cng=on
    SDPUtils.parseFmtp = function (line) {
      var parsed = {};
      var kv = void 0;
      var parts = line.substr(line.indexOf(' ') + 1).split(';');
      for (var j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split('=');
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };
    
    // Generates a fmtp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeFmtp = function (codec) {
      var line = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && Object.keys(codec.parameters).length) {
        var params = [];
        Object.keys(codec.parameters).forEach(function (param) {
          if (codec.parameters[param] !== undefined) {
            params.push(param + '=' + codec.parameters[param]);
          } else {
            params.push(param);
          }
        });
        line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
      }
      return line;
    };
    
    // Parses a rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
    // a=rtcp-fb:98 nack rpsi
    SDPUtils.parseRtcpFb = function (line) {
      var parts = line.substr(line.indexOf(' ') + 1).split(' ');
      return {
        type: parts.shift(),
        parameter: parts.join(' ')
      };
    };
    
    // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeRtcpFb = function (codec) {
      var lines = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        // FIXME: special handling for trr-int?
        codec.rtcpFeedback.forEach(function (fb) {
          lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') + '\r\n';
        });
      }
      return lines;
    };
    
    // Parses a RFC 5576 ssrc media attribute. Sample input:
    // a=ssrc:3735928559 cname:something
    SDPUtils.parseSsrcMedia = function (line) {
      var sp = line.indexOf(' ');
      var parts = {
        ssrc: parseInt(line.substr(7, sp - 7), 10)
      };
      var colon = line.indexOf(':', sp);
      if (colon > -1) {
        parts.attribute = line.substr(sp + 1, colon - sp - 1);
        parts.value = line.substr(colon + 1);
      } else {
        parts.attribute = line.substr(sp + 1);
      }
      return parts;
    };
    
    // Parse a ssrc-group line (see RFC 5576). Sample input:
    // a=ssrc-group:semantics 12 34
    SDPUtils.parseSsrcGroup = function (line) {
      var parts = line.substr(13).split(' ');
      return {
        semantics: parts.shift(),
        ssrcs: parts.map(function (ssrc) {
          return parseInt(ssrc, 10);
        })
      };
    };
    
    // Extracts the MID (RFC 5888) from a media section.
    // Returns the MID or undefined if no mid line was found.
    SDPUtils.getMid = function (mediaSection) {
      var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
      if (mid) {
        return mid.substr(6);
      }
    };
    
    // Parses a fingerprint line for DTLS-SRTP.
    SDPUtils.parseFingerprint = function (line) {
      var parts = line.substr(14).split(' ');
      return {
        algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
        value: parts[1].toUpperCase() // the definition is upper-case in RFC 4572.
      };
    };
    
    // Extracts DTLS parameters from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the fingerprint line as input. See also getIceParameters.
    SDPUtils.getDtlsParameters = function (mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=fingerprint:');
      // Note: a=setup line is ignored since we use the 'auto' role in Edge.
      return {
        role: 'auto',
        fingerprints: lines.map(SDPUtils.parseFingerprint)
      };
    };
    
    // Serializes DTLS parameters to SDP.
    SDPUtils.writeDtlsParameters = function (params, setupType) {
      var sdp = 'a=setup:' + setupType + '\r\n';
      params.fingerprints.forEach(function (fp) {
        sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
      });
      return sdp;
    };
    
    // Parses a=crypto lines into
    //   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
    SDPUtils.parseCryptoLine = function (line) {
      var parts = line.substr(9).split(' ');
      return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3)
      };
    };
    
    SDPUtils.writeCryptoLine = function (parameters) {
      return 'a=crypto:' + parameters.tag + ' ' + parameters.cryptoSuite + ' ' + (_typeof(parameters.keyParams) === 'object' ? SDPUtils.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') + '\r\n';
    };
    
    // Parses the crypto key parameters into
    //   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
    SDPUtils.parseCryptoKeyParams = function (keyParams) {
      if (keyParams.indexOf('inline:') !== 0) {
        return null;
      }
      var parts = keyParams.substr(7).split('|');
      return {
        keyMethod: 'inline',
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
        mkiLength: parts[2] ? parts[2].split(':')[1] : undefined
      };
    };
    
    SDPUtils.writeCryptoKeyParams = function (keyParams) {
      return keyParams.keyMethod + ':' + keyParams.keySalt + (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') + (keyParams.mkiValue && keyParams.mkiLength ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength : '');
    };
    
    // Extracts all SDES parameters.
    SDPUtils.getCryptoParameters = function (mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=crypto:');
      return lines.map(SDPUtils.parseCryptoLine);
    };
    
    // Parses ICE information from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the ice-ufrag and ice-pwd lines as input.
    SDPUtils.getIceParameters = function (mediaSection, sessionpart) {
      var ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-ufrag:')[0];
      var pwd = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-pwd:')[0];
      if (!(ufrag && pwd)) {
        return null;
      }
      return {
        usernameFragment: ufrag.substr(12),
        password: pwd.substr(10)
      };
    };
    
    // Serializes ICE parameters to SDP.
    SDPUtils.writeIceParameters = function (params) {
      var sdp = 'a=ice-ufrag:' + params.usernameFragment + '\r\n' + 'a=ice-pwd:' + params.password + '\r\n';
      if (params.iceLite) {
        sdp += 'a=ice-lite\r\n';
      }
      return sdp;
    };
    
    // Parses the SDP media section and returns RTCRtpParameters.
    SDPUtils.parseRtpParameters = function (mediaSection) {
      var description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
      };
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      for (var i = 3; i < mline.length; i++) {
        // find all codecs from mline[3..]
        var pt = mline[i];
        var rtpmapline = SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];
        if (rtpmapline) {
          var codec = SDPUtils.parseRtpMap(rtpmapline);
          var fmtps = SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' ');
          // Only the first a=fmtp:<pt> is considered.
          codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map(SDPUtils.parseRtcpFb);
          description.codecs.push(codec);
          // parse FEC mechanisms from rtpmap lines.
          switch (codec.name.toUpperCase()) {
            case 'RED':
            case 'ULPFEC':
              description.fecMechanisms.push(codec.name.toUpperCase());
              break;
            default:
              // only RED and ULPFEC are recognized as FEC mechanisms.
              break;
          }
        }
      }
      SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function (line) {
        description.headerExtensions.push(SDPUtils.parseExtmap(line));
      });
      // FIXME: parse rtcp.
      return description;
    };
    
    // Generates parts of the SDP media section describing the capabilities /
    // parameters.
    SDPUtils.writeRtpDescription = function (kind, caps) {
      var sdp = '';
    
      // Build the mline.
      sdp += 'm=' + kind + ' ';
      sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
      sdp += ' UDP/TLS/RTP/SAVPF ';
      sdp += caps.codecs.map(function (codec) {
        if (codec.preferredPayloadType !== undefined) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(' ') + '\r\n';
    
      sdp += 'c=IN IP4 0.0.0.0\r\n';
      sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';
    
      // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
      caps.codecs.forEach(function (codec) {
        sdp += SDPUtils.writeRtpMap(codec);
        sdp += SDPUtils.writeFmtp(codec);
        sdp += SDPUtils.writeRtcpFb(codec);
      });
      var maxptime = 0;
      caps.codecs.forEach(function (codec) {
        if (codec.maxptime > maxptime) {
          maxptime = codec.maxptime;
        }
      });
      if (maxptime > 0) {
        sdp += 'a=maxptime:' + maxptime + '\r\n';
      }
    
      if (caps.headerExtensions) {
        caps.headerExtensions.forEach(function (extension) {
          sdp += SDPUtils.writeExtmap(extension);
        });
      }
      // FIXME: write fecMechanisms.
      return sdp;
    };
    
    // Parses the SDP media section and returns an array of
    // RTCRtpEncodingParameters.
    SDPUtils.parseRtpEncodingParameters = function (mediaSection) {
      var encodingParameters = [];
      var description = SDPUtils.parseRtpParameters(mediaSection);
      var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
      var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;
    
      // filter a=ssrc:... cname:, ignore PlanB-msid
      var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
        return SDPUtils.parseSsrcMedia(line);
      }).filter(function (parts) {
        return parts.attribute === 'cname';
      });
      var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
      var secondarySsrc = void 0;
    
      var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map(function (line) {
        var parts = line.substr(17).split(' ');
        return parts.map(function (part) {
          return parseInt(part, 10);
        });
      });
      if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
      }
    
      description.codecs.forEach(function (codec) {
        if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
          var encParam = {
            ssrc: primarySsrc,
            codecPayloadType: parseInt(codec.parameters.apt, 10)
          };
          if (primarySsrc && secondarySsrc) {
            encParam.rtx = { ssrc: secondarySsrc };
          }
          encodingParameters.push(encParam);
          if (hasRed) {
            encParam = JSON.parse(JSON.stringify(encParam));
            encParam.fec = {
              ssrc: primarySsrc,
              mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
            };
            encodingParameters.push(encParam);
          }
        }
      });
      if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({
          ssrc: primarySsrc
        });
      }
    
      // we support both b=AS and b=TIAS but interpret AS as TIAS.
      var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
      if (bandwidth.length) {
        if (bandwidth[0].indexOf('b=TIAS:') === 0) {
          bandwidth = parseInt(bandwidth[0].substr(7), 10);
        } else if (bandwidth[0].indexOf('b=AS:') === 0) {
          // use formula from JSEP to convert b=AS to TIAS value.
          bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95 - 50 * 40 * 8;
        } else {
          bandwidth = undefined;
        }
        encodingParameters.forEach(function (params) {
          params.maxBitrate = bandwidth;
        });
      }
      return encodingParameters;
    };
    
    // parses http://draft.ortc.org/#rtcrtcpparameters*
    SDPUtils.parseRtcpParameters = function (mediaSection) {
      var rtcpParameters = {};
    
      // Gets the first SSRC. Note that with RTX there might be multiple
      // SSRCs.
      var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
        return SDPUtils.parseSsrcMedia(line);
      }).filter(function (obj) {
        return obj.attribute === 'cname';
      })[0];
      if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
      }
    
      // Edge uses the compound attribute instead of reducedSize
      // compound is !reducedSize
      var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
      rtcpParameters.reducedSize = rsize.length > 0;
      rtcpParameters.compound = rsize.length === 0;
    
      // parses the rtcp-mux attrіbute.
      // Note that Edge does not support unmuxed RTCP.
      var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
      rtcpParameters.mux = mux.length > 0;
    
      return rtcpParameters;
    };
    
    SDPUtils.writeRtcpParameters = function (rtcpParameters) {
      var sdp = '';
      if (rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
      if (rtcpParameters.mux) {
        sdp += 'a=rtcp-mux\r\n';
      }
      if (rtcpParameters.ssrc !== undefined && rtcpParameters.cname) {
        sdp += 'a=ssrc:' + rtcpParameters.ssrc + ' cname:' + rtcpParameters.cname + '\r\n';
      }
      return sdp;
    };
    
    // parses either a=msid: or a=ssrc:... msid lines and returns
    // the id of the MediaStream and MediaStreamTrack.
    SDPUtils.parseMsid = function (mediaSection) {
      var parts = void 0;
      var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
      if (spec.length === 1) {
        parts = spec[0].substr(7).split(' ');
        return { stream: parts[0], track: parts[1] };
      }
      var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
        return SDPUtils.parseSsrcMedia(line);
      }).filter(function (msidParts) {
        return msidParts.attribute === 'msid';
      });
      if (planB.length > 0) {
        parts = planB[0].value.split(' ');
        return { stream: parts[0], track: parts[1] };
      }
    };
    
    // SCTP
    // parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
    // to draft-ietf-mmusic-sctp-sdp-05
    SDPUtils.parseSctpDescription = function (mediaSection) {
      var mline = SDPUtils.parseMLine(mediaSection);
      var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
      var maxMessageSize = void 0;
      if (maxSizeLine.length > 0) {
        maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
      }
      if (isNaN(maxMessageSize)) {
        maxMessageSize = 65536;
      }
      var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
      if (sctpPort.length > 0) {
        return {
          port: parseInt(sctpPort[0].substr(12), 10),
          protocol: mline.fmt,
          maxMessageSize: maxMessageSize
        };
      }
      var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
      if (sctpMapLines.length > 0) {
        var parts = sctpMapLines[0].substr(10).split(' ');
        return {
          port: parseInt(parts[0], 10),
          protocol: parts[1],
          maxMessageSize: maxMessageSize
        };
      }
    };
    
    // SCTP
    // outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
    // support by now receiving in this format, unless we originally parsed
    // as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
    // protocol of DTLS/SCTP -- without UDP/ or TCP/)
    SDPUtils.writeSctpDescription = function (media, sctp) {
      var output = [];
      if (media.protocol !== 'DTLS/SCTP') {
        output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctp-port:' + sctp.port + '\r\n'];
      } else {
        output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'];
      }
      if (sctp.maxMessageSize !== undefined) {
        output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
      }
      return output.join('');
    };
    
    // Generate a session ID for SDP.
    // https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
    // recommends using a cryptographically random +ve 64-bit value
    // but right now this should be acceptable and within the right range
    SDPUtils.generateSessionId = function () {
      return Math.random().toString().substr(2, 21);
    };
    
    // Write boiler plate for start of SDP
    // sessId argument is optional - if not supplied it will
    // be generated randomly
    // sessVersion is optional and defaults to 2
    // sessUser is optional and defaults to 'thisisadapterortc'
    SDPUtils.writeSessionBoilerplate = function (sessId, sessVer, sessUser) {
      var sessionId = void 0;
      var version = sessVer !== undefined ? sessVer : 2;
      if (sessId) {
        sessionId = sessId;
      } else {
        sessionId = SDPUtils.generateSessionId();
      }
      var user = sessUser || 'thisisadapterortc';
      // FIXME: sess-id should be an NTP timestamp.
      return 'v=0\r\n' + 'o=' + user + ' ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' + 's=-\r\n' + 't=0 0\r\n';
    };
    
    // Gets the direction from the mediaSection or the sessionpart.
    SDPUtils.getDirection = function (mediaSection, sessionpart) {
      // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
      var lines = SDPUtils.splitLines(mediaSection);
      for (var i = 0; i < lines.length; i++) {
        switch (lines[i]) {
          case 'a=sendrecv':
          case 'a=sendonly':
          case 'a=recvonly':
          case 'a=inactive':
            return lines[i].substr(2);
          default:
          // FIXME: What should happen here?
        }
      }
      if (sessionpart) {
        return SDPUtils.getDirection(sessionpart);
      }
      return 'sendrecv';
    };
    
    SDPUtils.getKind = function (mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      return mline[0].substr(2);
    };
    
    SDPUtils.isRejected = function (mediaSection) {
      return mediaSection.split(' ', 2)[1] === '0';
    };
    
    SDPUtils.parseMLine = function (mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var parts = lines[0].substr(2).split(' ');
      return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(' ')
      };
    };
    
    SDPUtils.parseOLine = function (mediaSection) {
      var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
      var parts = line.substr(2).split(' ');
      return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
      };
    };
    
    // a very naive interpretation of a valid SDP.
    SDPUtils.isValidSDP = function (blob) {
      if (typeof blob !== 'string' || blob.length === 0) {
        return false;
      }
      var lines = SDPUtils.splitLines(blob);
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
          return false;
        }
        // TODO: check the modifier a bit more.
      }
      return true;
    };
    
    // Expose public methods.
    if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object') {
      module.exports = SDPUtils;
    }
    },{}]},{},[1])(1)
    });


function webRtcPlayer(parOptions) {
	parOptions = typeof parOptions !== 'undefined' ? parOptions : {};
	
	var self = this;

	//**********************
	//Config setup
	//**********************
	this.cfg = typeof parOptions.peerConnectionOptions !== 'undefined' ? parOptions.peerConnectionOptions : {};
	this.cfg.sdpSemantics = 'unified-plan';
	// this.cfg.rtcAudioJitterBufferMaxPackets = 10;
	// this.cfg.rtcAudioJitterBufferFastAccelerate = true;
	// this.cfg.rtcAudioJitterBufferMinDelayMs = 0;

	// If this is true in Chrome 89+ SDP is sent that is incompatible with UE Pixel Streaming 4.26 and below.
	// However 4.27 Pixel Streaming does not need this set to false as it supports `offerExtmapAllowMixed`.
	// tdlr; uncomment this line for older versions of Pixel Streaming that need Chrome 89+.
	this.cfg.offerExtmapAllowMixed = false;

	//**********************
	//Variables
	//**********************
	this.pcClient = null;
	this.dcClient = null;
	this.tnClient = null;

	this.sdpConstraints = {
	  offerToReceiveAudio: 1, //Note: if you don't need audio you can get improved latency by turning this off.
	  offerToReceiveVideo: 1,
	  voiceActivityDetection: false
	};

	// See https://www.w3.org/TR/webrtc/#dom-rtcdatachannelinit for values (this is needed for Firefox to be consistent with Chrome.)
	this.dataChannelOptions = {ordered: true};

	// This is useful if the video/audio needs to autoplay (without user input) as browsers do not allow autoplay non-muted of sound sources without user interaction.
	this.startVideoMuted = typeof parOptions.startVideoMuted !== 'undefined' ? parOptions.startVideoMuted : true;
	this.autoPlayAudio = typeof parOptions.autoPlayAudio !== 'undefined' ? parOptions.autoPlayAudio : false;

	// To enable mic in browser use SSL/localhost and have ?useMic in the query string.
	const urlParams = new URLSearchParams(window.location.search);
	this.useMic = urlParams.has('useMic');
	if(!this.useMic)
	{
		console.log("Microphone access is not enabled. Pass ?useMic in the url to enable it.");
	}

	// When ?useMic check for SSL or localhost
	let isLocalhostConnection = location.hostname === "localhost" || location.hostname === "127.0.0.1";
	let isHttpsConnection = location.protocol === 'https:';
	if(this.useMic && !isLocalhostConnection && !isHttpsConnection)
	{
		this.useMic = false;
		console.error("Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access.");
		console.error("For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'");
	}

	// Latency tester
	this.latencyTestTimings = 
	{
		TestStartTimeMs: null,
		UEReceiptTimeMs: null,
		UEPreCaptureTimeMs: null,
		UEPostCaptureTimeMs: null,
		UEPreEncodeTimeMs: null,
		UEPostEncodeTimeMs: null,
		UETransmissionTimeMs: null,
		BrowserReceiptTimeMs: null,
		FrameDisplayDeltaTimeMs: null,
		Reset: function()
		{
			this.TestStartTimeMs = null;
			this.UEReceiptTimeMs = null;
			this.UEPreCaptureTimeMs = null;
			this.UEPostCaptureTimeMs = null;
			this.UEPreEncodeTimeMs = null;
			this.UEPostEncodeTimeMs = null;
			this.UETransmissionTimeMs = null;
			this.BrowserReceiptTimeMs = null;
			this.FrameDisplayDeltaTimeMs = null;
		},
		SetUETimings: function(UETimings)
		{
			this.UEReceiptTimeMs = UETimings.ReceiptTimeMs;
			this.UEPreCaptureTimeMs = UETimings.PreCaptureTimeMs;
			this.UEPostCaptureTimeMs = UETimings.PostCaptureTimeMs;
			this.UEPreEncodeTimeMs = UETimings.PreEncodeTimeMs;
			this.UEPostEncodeTimeMs = UETimings.PostEncodeTimeMs;
			this.UETransmissionTimeMs = UETimings.TransmissionTimeMs;
			this.BrowserReceiptTimeMs = Date.now();
			this.OnAllLatencyTimingsReady(this);
		},
		SetFrameDisplayDeltaTime: function(DeltaTimeMs)
		{
			if(this.FrameDisplayDeltaTimeMs == null)
			{
				this.FrameDisplayDeltaTimeMs = Math.round(DeltaTimeMs);
				this.OnAllLatencyTimingsReady(this);
			}
		},
		OnAllLatencyTimingsReady: function(Timings){}
	}

	//**********************
	//Functions
	//**********************

	//Create Video element and expose that as a parameter
	this.createWebRtcVideo = function() {
		var video = document.createElement('video');

		video.id = "streamingVideo";
		video.playsInline = true;
		video.disablepictureinpicture = true;
		video.muted = self.startVideoMuted;;
		
		video.addEventListener('loadedmetadata', function(e){
			if(self.onVideoInitialised){
				self.onVideoInitialised();
			}
		}, true);
		
		// Check if request video frame callback is supported
		if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
			// The API is supported! 
			
			const onVideoFrameReady = (now, metadata) => {
				
				if(metadata.receiveTime && metadata.expectedDisplayTime)
				{
					const receiveToCompositeMs = metadata.presentationTime - metadata.receiveTime;
					self.aggregatedStats.receiveToCompositeMs = receiveToCompositeMs;
				}
				
			  
				// Re-register the callback to be notified about the next frame.
				video.requestVideoFrameCallback(onVideoFrameReady);
			};
			
			// Initially register the callback to be notified about the first frame.
			video.requestVideoFrameCallback(onVideoFrameReady);
		}
		
		return video;
	}

	this.video = this.createWebRtcVideo();

	onsignalingstatechange = function(state) {
		console.info('signaling state change:', state)
	};

	oniceconnectionstatechange = function(state) {
		console.info('ice connection state change:', state)
	};

	onicegatheringstatechange = function(state) {
		console.info('ice gathering state change:', state)
	};

	handleOnTrack = function(e) {
		console.log('handleOnTrack', e.streams);
		
		if (e.track)
		{
			console.log('Got track - ' + e.track.kind + ' id=' + e.track.id + ' readyState=' + e.track.readyState); 
		}
		
		if(e.track.kind == "audio")
		{
			handleOnAudioTrack(e.streams[0]);
			return;
		}
		else(e.track.kind == "video" && self.video.srcObject !== e.streams[0])
		{
			self.video.srcObject = e.streams[0];
			console.log('Set video source from video track ontrack.');
			return;
		}
		
	};

	handleOnAudioTrack = function(audioMediaStream)
	{
		// do nothing the video has the same media stream as the audio track we have here (they are linked)
		if(self.video.srcObject == audioMediaStream)
		{
			return;
		}
		// video element has some other media stream that is not associated with this audio track
		else if(self.video.srcObject && self.video.srcObject !== audioMediaStream)
		{
			// create a new audio element
			let audioElem = document.createElement("Audio");
			audioElem.srcObject = audioMediaStream;
			// there is no way to autoplay audio (even muted), so we defer audio until first click
			if(!self.autoPlayAudio) {

				let clickToPlayAudio = function() {
					audioElem.play();
					self.video.removeEventListener("click", clickToPlayAudio);
				};

				self.video.addEventListener("click", clickToPlayAudio);
			}
			// we assume the user has clicked somewhere on the page and autoplaying audio will work
			else {
				audioElem.play();
			}
			console.log('Created new audio element to play seperate audio stream.');
		}

	}

	setupDataChannel = function(pc, label, options) {
		try {
			let datachannel = pc.createDataChannel(label, options);
			console.log(`Created datachannel (${label})`)

			// Inform browser we would like binary data as an ArrayBuffer (FF chooses Blob by default!)
			datachannel.binaryType = "arraybuffer";
			
			datachannel.onopen = function (e) {
			  console.log(`data channel (${label}) connect`)
			  if(self.onDataChannelConnected){
				self.onDataChannelConnected();
			  }
			}

			datachannel.onclose = function (e) {
			  console.log(`data channel (${label}) closed`)
			}

			datachannel.onmessage = function (e) {
			  //console.log(`Got message (${label})`, e.data)
			  if (self.onDataChannelMessage)
				self.onDataChannelMessage(e.data);
			}

			return datachannel;
		} catch (e) { 
			console.warn('No data channel', e);
			return null;
		}
	}

	onicecandidate = function (e) {
		console.log('ICE candidate', e)
		if (e.candidate && e.candidate.candidate) {
			self.onWebRtcCandidate(e.candidate);
		}
	};

	handleCreateOffer = function (pc) {
		pc.createOffer(self.sdpConstraints).then(function (offer) {
			
			// Munging is where we modifying the sdp string to set parameters that are not exposed to the browser's WebRTC API
			mungeSDPOffer(offer);

			// Set our munged SDP on the local peer connection so it is "set" and will be send across
			pc.setLocalDescription(offer);
			if (self.onWebRtcOffer) {
				self.onWebRtcOffer(offer);
			}
		},
		function () { console.warn("Couldn't create offer") });
	}

	mungeSDPOffer = function (offer) {

		// turn off video-timing sdp sent from browser
		//offer.sdp = offer.sdp.replace("http://www.webrtc.org/experiments/rtp-hdrext/playout-delay", "");

		// this indicate we support stereo (Chrome needs this)
		offer.sdp = offer.sdp.replace('useinbandfec=1', 'useinbandfec=1;stereo=1;sprop-maxcapturerate=48000');

	}
	
	setupPeerConnection = function (pc) {
		if (pc.SetBitrate)
			console.log("Hurray! there's RTCPeerConnection.SetBitrate function");

		//Setup peerConnection events
		pc.onsignalingstatechange = onsignalingstatechange;
		pc.oniceconnectionstatechange = oniceconnectionstatechange;
		pc.onicegatheringstatechange = onicegatheringstatechange;

		pc.ontrack = handleOnTrack;
		pc.onicecandidate = onicecandidate;
	};

	generateAggregatedStatsFunction = function(){
		if(!self.aggregatedStats)
			self.aggregatedStats = {};

		return function(stats){
			//console.log('Printing Stats');

			let newStat = {};
			
			stats.forEach(stat => {
//                    console.log(JSON.stringify(stat, undefined, 4));
				if (stat.type == 'inbound-rtp' 
					&& !stat.isRemote 
					&& (stat.mediaType == 'video' || stat.id.toLowerCase().includes('video'))) {

					newStat.timestamp = stat.timestamp;
					newStat.bytesReceived = stat.bytesReceived;
					newStat.framesDecoded = stat.framesDecoded;
					newStat.packetsLost = stat.packetsLost;
					newStat.bytesReceivedStart = self.aggregatedStats && self.aggregatedStats.bytesReceivedStart ? self.aggregatedStats.bytesReceivedStart : stat.bytesReceived;
					newStat.framesDecodedStart = self.aggregatedStats && self.aggregatedStats.framesDecodedStart ? self.aggregatedStats.framesDecodedStart : stat.framesDecoded;
					newStat.timestampStart = self.aggregatedStats && self.aggregatedStats.timestampStart ? self.aggregatedStats.timestampStart : stat.timestamp;

					if(self.aggregatedStats && self.aggregatedStats.timestamp){
						if(self.aggregatedStats.bytesReceived){
							// bitrate = bits received since last time / number of ms since last time
							//This is automatically in kbits (where k=1000) since time is in ms and stat we want is in seconds (so a '* 1000' then a '/ 1000' would negate each other)
							newStat.bitrate = 8 * (newStat.bytesReceived - self.aggregatedStats.bytesReceived) / (newStat.timestamp - self.aggregatedStats.timestamp);
							newStat.bitrate = Math.floor(newStat.bitrate);
							newStat.lowBitrate = self.aggregatedStats.lowBitrate && self.aggregatedStats.lowBitrate < newStat.bitrate ? self.aggregatedStats.lowBitrate : newStat.bitrate
							newStat.highBitrate = self.aggregatedStats.highBitrate && self.aggregatedStats.highBitrate > newStat.bitrate ? self.aggregatedStats.highBitrate : newStat.bitrate
						}

						if(self.aggregatedStats.bytesReceivedStart){
							newStat.avgBitrate = 8 * (newStat.bytesReceived - self.aggregatedStats.bytesReceivedStart) / (newStat.timestamp - self.aggregatedStats.timestampStart);
							newStat.avgBitrate = Math.floor(newStat.avgBitrate);
						}

						if(self.aggregatedStats.framesDecoded){
							// framerate = frames decoded since last time / number of seconds since last time
							newStat.framerate = (newStat.framesDecoded - self.aggregatedStats.framesDecoded) / ((newStat.timestamp - self.aggregatedStats.timestamp) / 1000);
							newStat.framerate = Math.floor(newStat.framerate);
							newStat.lowFramerate = self.aggregatedStats.lowFramerate && self.aggregatedStats.lowFramerate < newStat.framerate ? self.aggregatedStats.lowFramerate : newStat.framerate
							newStat.highFramerate = self.aggregatedStats.highFramerate && self.aggregatedStats.highFramerate > newStat.framerate ? self.aggregatedStats.highFramerate : newStat.framerate
						}

						if(self.aggregatedStats.framesDecodedStart){
							newStat.avgframerate = (newStat.framesDecoded - self.aggregatedStats.framesDecodedStart) / ((newStat.timestamp - self.aggregatedStats.timestampStart) / 1000);
							newStat.avgframerate = Math.floor(newStat.avgframerate);
						}
					}
				}

				//Read video track stats
				if(stat.type == 'track' && (stat.trackIdentifier == 'video_label' || stat.kind == 'video')) {
					newStat.framesDropped = stat.framesDropped;
					newStat.framesReceived = stat.framesReceived;
					newStat.framesDroppedPercentage = stat.framesDropped / stat.framesReceived * 100;
					newStat.frameHeight = stat.frameHeight;
					newStat.frameWidth = stat.frameWidth;
					newStat.frameHeightStart = self.aggregatedStats && self.aggregatedStats.frameHeightStart ? self.aggregatedStats.frameHeightStart : stat.frameHeight;
					newStat.frameWidthStart = self.aggregatedStats && self.aggregatedStats.frameWidthStart ? self.aggregatedStats.frameWidthStart : stat.frameWidth;
				}

				if(stat.type =='candidate-pair' && stat.hasOwnProperty('currentRoundTripTime') && stat.currentRoundTripTime != 0){
					newStat.currentRoundTripTime = stat.currentRoundTripTime;
				}
			});

			
			if(self.aggregatedStats.receiveToCompositeMs)
			{
				newStat.receiveToCompositeMs = self.aggregatedStats.receiveToCompositeMs;
				self.latencyTestTimings.SetFrameDisplayDeltaTime(self.aggregatedStats.receiveToCompositeMs);
			}
			
			self.aggregatedStats = newStat;

			if(self.onAggregatedStats)
				self.onAggregatedStats(newStat)
		}
	};

	setupTracksToSendAsync = async function(pc){
		
		// Setup a transceiver for getting UE video
		pc.addTransceiver("video", { direction: "recvonly" });

		// Setup a transceiver for sending mic audio to UE and receiving audio from UE
		if(!self.useMic)
		{
			pc.addTransceiver("audio", { direction: "recvonly" });
		}
		else
		{
			let audioSendOptions = self.useMic ? 
			{
				autoGainControl: false,
				channelCount: 1,
				echoCancellation: false,
				latency: 0,
				noiseSuppression: false,
				sampleRate: 16000,
				volume: 1.0
			} : false;

			// Note using mic on android chrome requires SSL or chrome://flags/ "unsafely-treat-insecure-origin-as-secure"
			const stream = await navigator.mediaDevices.getUserMedia({video: false, audio: audioSendOptions});
			if(stream)
			{
				for (const track of stream.getTracks()) {
					if(track.kind && track.kind == "audio")
					{
						pc.addTransceiver(track, { direction: "sendrecv" });
					}
				}
			}
			else
			{
				pc.addTransceiver("audio", { direction: "recvonly" });
			}
		}
	};


	//**********************
	//Public functions
	//**********************

	this.setVideoEnabled = function(enabled) {
		self.video.srcObject.getTracks().forEach(track => track.enabled = enabled);
	}

	this.startLatencyTest = function(onTestStarted) {
		// Can't start latency test without a video element
		if(!self.video)
		{
			return;
		}

		self.latencyTestTimings.Reset();
		self.latencyTestTimings.TestStartTimeMs = Date.now();
		onTestStarted(self.latencyTestTimings.TestStartTimeMs);            
	}

	//This is called when revceiving new ice candidates individually instead of part of the offer
	//This is currently not used but would be called externally from this class
	this.handleCandidateFromServer = function(iceCandidate) {
		console.log("ICE candidate: ", iceCandidate);
		let candidate = new RTCIceCandidate(iceCandidate);
		self.pcClient.addIceCandidate(candidate).then(_=>{
			console.log('ICE candidate successfully added');
		});
	};

	//Called externaly to create an offer for the server
	this.createOffer = function() {
		if(self.pcClient){
			console.log("Closing existing PeerConnection")
			self.pcClient.close();
			self.pcClient = null;
		}
		self.pcClient = new RTCPeerConnection(self.cfg);

		setupTracksToSendAsync(self.pcClient).finally(function()
		{
			setupPeerConnection(self.pcClient);
			self.dcClient = setupDataChannel(self.pcClient, 'cirrus', self.dataChannelOptions);
			handleCreateOffer(self.pcClient);
		});
		
	};

	//Called externaly when an answer is received from the server
	this.receiveAnswer = function(answer) {
		console.log('Received answer:');
		console.log(answer);
		var answerDesc = new RTCSessionDescription(answer);
		self.pcClient.setRemoteDescription(answerDesc);

		let receivers = self.pcClient.getReceivers();
		for(let receiver of receivers)
		{
			receiver.playoutDelayHint = 0;
		}
	};

	this.close = function(){
		if(self.pcClient){
			console.log("Closing existing peerClient")
			self.pcClient.close();
			self.pcClient = null;
		}
		if(self.aggregateStatsIntervalId)
			clearInterval(self.aggregateStatsIntervalId);
	}

	//Sends data across the datachannel
	this.send = function(data){
		if(self.dcClient && self.dcClient.readyState == 'open'){
			//console.log('Sending data on dataconnection', self.dcClient)
			self.dcClient.send(data);
		}
	};

	this.getStats = function(onStats){
		if(self.pcClient && onStats){
			self.pcClient.getStats(null).then((stats) => { 
				onStats(stats); 
			});
		}
	}

	this.aggregateStats = function(checkInterval){
		let calcAggregatedStats = generateAggregatedStatsFunction();
		let printAggregatedStats = () => { self.getStats(calcAggregatedStats); }
		self.aggregateStatsIntervalId = setInterval(printAggregatedStats, checkInterval);
	}
};

var webRtcPlayerObj = null;
var print_inputs = false;

var ws;
const WS_OPEN_STATE = 1;

var qualityControlOwnershipCheckBox;
var matchViewportResolution = true;
// TODO: Remove this - workaround because of bug causing UE to crash when switching resolutions too quickly
var lastTimeResized = new Date().getTime();
var resizeTimeout;

var responseEventListeners = new Map();

var shouldShowPlayOverlay = false;

// If the user focuses on a UE4 input widget then we show them a button to open
// the on-screen keyboard. JavaScript security means we can only show the
// on-screen keyboard in response to a user interaction.
var editTextButton = undefined;

// A hidden input text box which is used only for focusing and opening the
// on-screen keyboard.
var hiddenInput = undefined;

var t0 = Date.now();
function log(str) {
	console.log(`${Math.floor(Date.now() - t0)}: ` + str);
}


function setupHtmlEvents() {

    window.addEventListener('resize', resizePlayerStyle, true);
    window.addEventListener('orientationchange', onOrientationChange);

}
		
function createWebRtcOffer() {
	if (webRtcPlayerObj) {
		console.log('Creating offer');
		// showTextOverlay('Starting connection to server, please wait');
		webRtcPlayerObj.createOffer();
	} else {
		console.log('WebRTC player not setup, cannot create offer');
		// showTextOverlay('Unable to setup video');
	}
}


function sendInputData(data) {
	if (webRtcPlayerObj) {
		webRtcPlayerObj.send(data);
	}
}


function addResponseEventListener(name, listener) {
	responseEventListeners.set(name, listener);
}


function removeResponseEventListener(name) {
	responseEventListeners.remove(name);
}


//建立连接 
const ToClientMessageType = {
	QualityControlOwnership: 0,
	Response: 1,
	Command: 2,
	FreezeFrame: 3,
	UnfreezeFrame: 4,
	VideoEncoderAvgQP: 5
};

function setupWebRtcPlayer(htmlElement, config) {
	webRtcPlayerObj = new webRtcPlayer({ peerConnectionOptions: config.peerConnectionOptions });

  webRtcPlayerObj.video.style.position = 'absolute'
  webRtcPlayerObj.video.style.width = '100%'
  webRtcPlayerObj.video.style.height = '100%'
  webRtcPlayerObj.video.style.left = '0px'
  webRtcPlayerObj.video.style.right = '0px'

	htmlElement.appendChild(webRtcPlayerObj.video);

	webRtcPlayerObj.onWebRtcOffer = function (offer) {
		if (ws && ws.readyState === WS_OPEN_STATE) {
			let offerStr = JSON.stringify(offer);
			console.log(`-> SS: offer:\n${offerStr}`);
			ws.send(offerStr);
		}
	};

	webRtcPlayerObj.onWebRtcCandidate = function (candidate) {
		if (ws && ws.readyState === WS_OPEN_STATE) {
			console.log(`-> SS: iceCandidate\n${JSON.stringify(candidate, undefined, 4)}`);
			ws.send(JSON.stringify({ type: 'iceCandidate', candidate: candidate }));
		}
	};

	webRtcPlayerObj.onVideoInitialised = function () {
		if (ws && ws.readyState === WS_OPEN_STATE) {
			if (shouldShowPlayOverlay) {
				showPlayOverlay();
				resizePlayerStyle();
			}
			webRtcPlayerObj.video.play()
		}
	};

	webRtcPlayerObj.onDataChannelConnected = function () {
		if (ws && ws.readyState === WS_OPEN_STATE) {
			// showTextOverlay('WebRTC connected, waiting for video');
		}
	};

	webRtcPlayerObj.onDataChannelMessage = function (data) {
		var view = new Uint8Array(data);
		if (view[0] === ToClientMessageType.QualityControlOwnership) {
			let ownership = view[1] === 0 ? false : true;
			// If we own the quality control, we can't relenquish it. We only loose
			// quality control when another peer asks for it
			if (qualityControlOwnershipCheckBox !== null) {
				qualityControlOwnershipCheckBox.disabled = ownership;
				qualityControlOwnershipCheckBox.checked = ownership;
			}
		} else if (view[0] === ToClientMessageType.Response) {
			let response = new TextDecoder("utf-16").decode(data.slice(1));
			for (let listener of responseEventListeners.values()) {
				listener(response);
			}
		} else if (view[0] === ToClientMessageType.Command) {
			let commandAsString = new TextDecoder("utf-16").decode(data.slice(1));
			console.log(commandAsString);
			let command = JSON.parse(commandAsString);
			if (command.command === 'onScreenKeyboard') {
				showOnScreenKeyboard(command);
			}
		} else if (view[0] === ToClientMessageType.UnfreezeFrame) {
			// invalidateFreezeFrameOverlay();
		} else if (view[0] === ToClientMessageType.VideoEncoderAvgQP) {
			VideoEncoderQP = new TextDecoder("utf-16").decode(data.slice(1));
			// console.log(`received VideoEncoderAvgQP ${VideoEncoderQP}`);
		} else {
			console.error(`unrecognized data received, packet ID ${view[0]}`);
		}
	};

	registerInputs(webRtcPlayerObj.video);

	// On a touch device we will need special ways to show the on-screen keyboard.
	if ('ontouchstart' in document.documentElement) {
		createOnScreenKeyboardHelpers(htmlElement);
	}

	createWebRtcOffer();

	return webRtcPlayerObj.video;
}



function onWebRtcAnswer(webRTCData) {
	webRtcPlayerObj.receiveAnswer(webRTCData);

	let printInterval = 5 * 60 * 1000; /*Print every 5 minutes*/
	let nextPrintDuration = printInterval;

	webRtcPlayerObj.onAggregatedStats = (aggregatedStats) => {
		let numberFormat = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 0 });
		let timeFormat = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 0, minimumIntegerDigits: 2 });

		// Calculate duration of run
		let runTime = (aggregatedStats.timestamp - aggregatedStats.timestampStart) / 1000;
		let timeValues = [];
		let timeDurations = [60, 60];
		for (let timeIndex = 0; timeIndex < timeDurations.length; timeIndex++) {
			timeValues.push(runTime % timeDurations[timeIndex]);
			runTime = runTime / timeDurations[timeIndex];
		}
		timeValues.push(runTime);

		let runTimeSeconds = timeValues[0];
		let runTimeMinutes = Math.floor(timeValues[1]);
		let runTimeHours = Math.floor([timeValues[2]]);

		receivedBytesMeasurement = 'B';
		receivedBytes = aggregatedStats.hasOwnProperty('bytesReceived') ? aggregatedStats.bytesReceived : 0;
		let dataMeasurements = ['kB', 'MB', 'GB'];
		for (let index = 0; index < dataMeasurements.length; index++) {
			if (receivedBytes < 100 * 1000)
				break;
			receivedBytes = receivedBytes / 1000;
			receivedBytesMeasurement = dataMeasurements[index];
		}

	};

	webRtcPlayerObj.aggregateStats(1 * 1000 /*Check every 1 second*/);

	//let displayStats = () => { webRtcPlayerObj.getStats( (s) => { s.forEach(stat => { console.log(JSON.stringify(stat)); }); } ); }
	//var displayStatsIntervalId = setInterval(displayStats, 30 * 1000);
}

function onWebRtcIce(iceCandidate) {
	if (webRtcPlayerObj)
		webRtcPlayerObj.handleCandidateFromServer(iceCandidate);
}

var styleWidth;
var styleHeight;
var styleTop;
var styleLeft;
var styleCursor = 'default';
var styleAdditional;

//鼠标控制模式   
const ControlSchemeType = {
	// A mouse can lock inside the WebRTC player so the user can simply move the
	// mouse to control the orientation of the camera. The user presses the
	// Escape key to unlock the mouse.
	LockedMouse: 0,

	// A mouse can hover over the WebRTC player so the user needs to click and
	// drag to control the orientation of the camera.
	HoveringMouse: 1
};

var inputOptions = {
	// The control scheme controls the behaviour of the mouse when it interacts
	// with the WebRTC player.
	controlScheme: ControlSchemeType.HoveringMouse,

	// Browser keys are those which are typically used by the browser UI. We
	// usually want to suppress these to allow, for example, UE4 to show shader
	// complexity with the F5 key without the web page refreshing.
	suppressBrowserKeys: true,

	// UE4 has a faketouches option which fakes a single finger touch when the
	// user drags with their mouse. We may perform the reverse; a single finger
	// touch may be converted into a mouse drag UE4 side. This allows a
	// non-touch application to be controlled partially via a touch device.
	fakeMouseWithTouches: false
};

function resizePlayerStyleToFillWindow(playerElement) {

    // let videoElement = document.getElementById("streamingVideo");
	// // Fill the player display in window, keeping picture's aspect ratio.
	// let windowAspectRatio = window.innerHeight / window.innerWidth;
	// let playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth;
	// // We want to keep the video ratio correct for the video stream
	// let videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;

	// if (isNaN(videoAspectRatio)) {
	// 	//Video is not initialised yet so set playerElement to size of window
	// 	styleWidth = window.innerWidth;
	// 	styleHeight = window.innerHeight;
	// 	styleTop = 0;
	// 	styleLeft = 0;
	// 	playerElement.style = "position: absolute;" + "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
	// } else if (windowAspectRatio < playerAspectRatio) {
	// 	// Window height is the constraining factor so to keep aspect ratio change width appropriately
	// 	styleWidth = Math.floor(window.innerHeight / videoAspectRatio);
	// 	styleHeight = window.innerHeight;
	// 	styleTop = 0;
	// 	styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
	// 	//Video is now 100% of the playerElement, so set the playerElement style
	// 	playerElement.style = "position: absolute;" + "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
	// } else {
	// 	// Window width is the constraining factor so to keep aspect ratio change height appropriately
	// 	styleWidth = window.innerWidth;
	// 	styleHeight = Math.floor(window.innerWidth * videoAspectRatio);
	// 	styleTop = Math.floor((window.innerHeight - styleHeight) * 0.5);
	// 	styleLeft = 0;
	// 	//Video is now 100% of the playerElement, so set the playerElement style
	// 	playerElement.style = "position: absolute;" + "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
	// }

	//get parentnode
	let parent = playerElement.parentNode
	let videoElement = document.getElementById("streamingVideo");
	// Fill the player display in window, keeping picture's aspect ratio.
	let windowAspectRatio = parent.clientHeight / parent.clientWidth;
	let playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth;
	// We want to keep the video ratio correct for the video stream
	let videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;

  console.log( videoElement.videoHeight )
  console.log( videoElement.videoWidth )

	if (isNaN(videoAspectRatio)) {
		//Video is not initialised yet so set playerElement to size of window
		styleWidth = playerElement.clientWidth;
		styleHeight = playerElement.clientHeight;
		styleTop = 0;
		styleLeft = 0;
		playerElement.style = "position: absolute;" + "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
	} else if (windowAspectRatio < playerAspectRatio) {
		// Window height is the constraining factor so to keep aspect ratio change width appropriately
		styleWidth = Math.floor(parent.clientHeight / videoAspectRatio);
		styleHeight = parent.clientHeight;
		styleTop = 0;
		styleLeft = Math.floor((parent.clientWidth - styleWidth) * 0.5);
		//Video is now 100% of the playerElement, so set the playerElement style
		playerElement.style = "position: absolute;" + "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
	} else {
		// Window width is the constraining factor so to keep aspect ratio change height appropriately
		styleWidth = parent.clientWidth;
		styleHeight = Math.floor(parent.clientWidth * videoAspectRatio);
		styleTop = Math.floor((parent.clientHeight - styleHeight) * 0.5);
		styleLeft = 0;
		//Video is now 100% of the playerElement, so set the playerElement style
		playerElement.style = "position: absolute;" + "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
	}

}

function resizePlayerStyleToActualSize(playerElement) {
	let videoElement = playerElement.getElementsByTagName("VIDEO");

	if (videoElement.length > 0) {
		// Display image in its actual size
		styleWidth = videoElement[0].videoWidth;
		styleHeight = videoElement[0].videoHeight;
		styleTop = Math.floor((window.innerHeight - styleHeight) * 0.5);
		styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
		//Video is now 100% of the playerElement, so set the playerElement style
		playerElement.style = "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
	}
}

function resizePlayerStyleToArbitrarySize(playerElement) {
	let videoElement = playerElement.getElementsByTagName("VIDEO");
	//Video is now 100% of the playerElement, so set the playerElement style
	playerElement.style = "top: 0px; left: 0px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
}

function resizePlayerStyle(event) {

	var playerElement = document.getElementById('player');

	if (!playerElement) return

  updateVideoStreamSize();

	if (playerElement.classList.contains('fixed-size')) return;

  resizePlayerStyleToFillWindow(playerElement);

	// Calculating and normalizing positions depends on the width and height of
	// the player.
	playerElementClientRect = playerElement.getBoundingClientRect();
	setupNormalizeAndQuantize();

}


function updateVideoStreamSize() {
	if (!matchViewportResolution) {
		return;
	}

	var now = new Date().getTime();
	if (now - lastTimeResized > 1000) {
		var playerElement = document.getElementById('player');
		if (!playerElement)
			return;

		let parent = playerElement.parentNode

		let descriptor = {
			Console: 'setres ' + parent.clientWidth + 'x' + parent.clientHeight
		};
		emitUIInteraction(descriptor);
		lastTimeResized = new Date().getTime();
	}
	else {
		console.log('Resizing too often - skipping');
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(updateVideoStreamSize, 1000);
	}
}

var _orientationChangeTimeout;
function onOrientationChange(event) {
	clearTimeout(_orientationChangeTimeout);
	_orientationChangeTimeout = setTimeout(function () {
		resizePlayerStyle();
	}, 500);
}


const MessageType = {

	/**********************************************************************/

	/*
	 * Control Messages. Range = 0..49.
	 */
	IFrameRequest: 0,
	RequestQualityControl: 1,
	MaxFpsRequest: 2,
	AverageBitrateRequest: 3,
	StartStreaming: 4,
	StopStreaming: 5,

	/**********************************************************************/

	/*
	 * Input Messages. Range = 50..89.
	 */

	// Generic Input Messages. Range = 50..59.
	UIInteraction: 50,
	Command: 51,

	// Keyboard Input Message. Range = 60..69.
	KeyDown: 60,
	KeyUp: 61,
	KeyPress: 62,

	// Mouse Input Messages. Range = 70..79.
	MouseEnter: 70,
	MouseLeave: 71,
	MouseDown: 72,
	MouseUp: 73,
	MouseMove: 74,
	MouseWheel: 75,

	// Touch Input Messages. Range = 80..89.
	TouchStart: 80,
	TouchEnd: 81,
	TouchMove: 82

	/**************************************************************************/
};

// A generic message has a type and a descriptor.
function emitDescriptor(messageType, descriptor) {
	// Convert the dscriptor object into a JSON string.
	let descriptorAsString = JSON.stringify(descriptor);

	// Add the UTF-16 JSON string to the array byte buffer, going two bytes at
	// a time.
	let data = new DataView(new ArrayBuffer(1 + 2 + 2 * descriptorAsString.length));
	let byteIdx = 0;
	data.setUint8(byteIdx, messageType);
	byteIdx++;
	data.setUint16(byteIdx, descriptorAsString.length, true);
	byteIdx += 2;
	for (i = 0; i < descriptorAsString.length; i++) {
		data.setUint16(byteIdx, descriptorAsString.charCodeAt(i), true);
		byteIdx += 2;
	}
	sendInputData(data.buffer);
}

// A UI interation will occur when the user presses a button powered by
// JavaScript as opposed to pressing a button which is part of the pixel
// streamed UI from the UE4 client.
function emitUIInteraction(descriptor) {
	emitDescriptor(MessageType.UIInteraction, descriptor);
}

// A build-in command can be sent to UE4 client. The commands are defined by a
// JSON descriptor and will be executed automatically.
// The currently supported commands are:
//
// 1. A command to run any console command:
//    "{ ConsoleCommand: <string> }"
//
// 2. A command to change the resolution to the given width and height.
//    "{ Resolution: { Width: <value>, Height: <value> } }"
//
// 3. A command to change the encoder settings by reducing the bitrate by the
//    given percentage.
//    "{ Encoder: { BitrateReduction: <value> } }"
function emitCommand(descriptor) {
	emitDescriptor(MessageType.Command, descriptor);
}

function requestQualityControl() {
	sendInputData(new Uint8Array([MessageType.RequestQualityControl]).buffer);
}

var playerElementClientRect = undefined;
var normalizeAndQuantizeUnsigned = undefined;
var normalizeAndQuantizeSigned = undefined;

function setupNormalizeAndQuantize() {
	let playerElement = document.getElementById('player');
	let videoElement = playerElement.getElementsByTagName("video");

	if (playerElement && videoElement.length > 0) {
		let playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth;
		let videoAspectRatio = videoElement[0].videoHeight / videoElement[0].videoWidth;

		// Unsigned XY positions are the ratio (0.0..1.0) along a viewport axis,
		// quantized into an uint16 (0..65536).
		// Signed XY deltas are the ratio (-1.0..1.0) along a viewport axis,
		// quantized into an int16 (-32767..32767).
		// This allows the browser viewport and client viewport to have a different
		// size.
		// Hack: Currently we set an out-of-range position to an extreme (65535)
		// as we can't yet accurately detect mouse enter and leave events
		// precisely inside a video with an aspect ratio which causes mattes.
		if (playerAspectRatio > videoAspectRatio) {
			if (print_inputs) {
				console.log('Setup Normalize and Quantize for playerAspectRatio > videoAspectRatio');
			}
			let ratio = playerAspectRatio / videoAspectRatio;
			// Unsigned.
			normalizeAndQuantizeUnsigned = (x, y) => {
				let normalizedX = x / playerElement.clientWidth;
				let normalizedY = ratio * (y / playerElement.clientHeight - 0.5) + 0.5;
				if (normalizedX < 0.0 || normalizedX > 1.0 || normalizedY < 0.0 || normalizedY > 1.0) {
					return {
						inRange: false,
						x: 65535,
						y: 65535
					};
				} else {
					return {
						inRange: true,
						x: normalizedX * 65536,
						y: normalizedY * 65536
					};
				}
			};
			unquantizeAndDenormalizeUnsigned = (x, y) => {
				let normalizedX = x / 65536;
				let normalizedY = (y / 65536 - 0.5) / ratio + 0.5;
				return {
					x: normalizedX * playerElement.clientWidth,
					y: normalizedY * playerElement.clientHeight
				};
			};
			// Signed.
			normalizeAndQuantizeSigned = (x, y) => {
				let normalizedX = x / (0.5 * playerElement.clientWidth);
				let normalizedY = (ratio * y) / (0.5 * playerElement.clientHeight);
				return {
					x: normalizedX * 32767,
					y: normalizedY * 32767
				};
			};
		} else {
			if (print_inputs) {
				console.log('Setup Normalize and Quantize for playerAspectRatio <= videoAspectRatio');
			}
			let ratio = videoAspectRatio / playerAspectRatio;
			// Unsigned.
			normalizeAndQuantizeUnsigned = (x, y) => {
				let normalizedX = ratio * (x / playerElement.clientWidth - 0.5) + 0.5;
				let normalizedY = y / playerElement.clientHeight;
				if (normalizedX < 0.0 || normalizedX > 1.0 || normalizedY < 0.0 || normalizedY > 1.0) {
					return {
						inRange: false,
						x: 65535,
						y: 65535
					};
				} else {
					return {
						inRange: true,
						x: normalizedX * 65536,
						y: normalizedY * 65536
					};
				}
			};
			unquantizeAndDenormalizeUnsigned = (x, y) => {
				let normalizedX = (x / 65536 - 0.5) / ratio + 0.5;
				let normalizedY = y / 65536;
				return {
					x: normalizedX * playerElement.clientWidth,
					y: normalizedY * playerElement.clientHeight
				};
			};
			// Signed.
			normalizeAndQuantizeSigned = (x, y) => {
				let normalizedX = (ratio * x) / (0.5 * playerElement.clientWidth);
				let normalizedY = y / (0.5 * playerElement.clientHeight);
				return {
					x: normalizedX * 32767,
					y: normalizedY * 32767
				};
			};
		}
	}
}

function emitMouseMove(x, y, deltaX, deltaY) {
	if (print_inputs) {
		console.log(`x: ${x}, y:${y}, dX: ${deltaX}, dY: ${deltaY}`);
	}
	let coord = normalizeAndQuantizeUnsigned(x, y);
	let delta = normalizeAndQuantizeSigned(deltaX, deltaY);
	var Data = new DataView(new ArrayBuffer(9));
	Data.setUint8(0, MessageType.MouseMove);
	Data.setUint16(1, coord.x, true);
	Data.setUint16(3, coord.y, true);
	Data.setInt16(5, delta.x, true);
	Data.setInt16(7, delta.y, true);
	sendInputData(Data.buffer);
}

function emitMouseDown(button, x, y) {
	if (print_inputs) {
		console.log(`mouse button ${button} down at (${x}, ${y})`);
	}
	let coord = normalizeAndQuantizeUnsigned(x, y);
	var Data = new DataView(new ArrayBuffer(6));
	Data.setUint8(0, MessageType.MouseDown);
	Data.setUint8(1, button);
	Data.setUint16(2, coord.x, true);
	Data.setUint16(4, coord.y, true);
	sendInputData(Data.buffer);
}


function emitMouseUp(button, x, y) {
	if (print_inputs) {
		console.log(`mouse button ${button} up at (${x}, ${y})`);
	}
	let coord = normalizeAndQuantizeUnsigned(x, y);
	var Data = new DataView(new ArrayBuffer(6));
	Data.setUint8(0, MessageType.MouseUp);
	Data.setUint8(1, button);
	Data.setUint16(2, coord.x, true);
	Data.setUint16(4, coord.y, true);
	sendInputData(Data.buffer);
}

function emitMouseWheel(delta, x, y) {
	if (print_inputs) {
		console.log(`mouse wheel with delta ${delta} at (${x}, ${y})`);
	}
	let coord = normalizeAndQuantizeUnsigned(x, y);
	var Data = new DataView(new ArrayBuffer(7));
	Data.setUint8(0, MessageType.MouseWheel);
	Data.setInt16(1, delta, true);
	Data.setUint16(3, coord.x, true);
	Data.setUint16(5, coord.y, true);
	sendInputData(Data.buffer);
}


// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const MouseButton = {
	MainButton: 0,			// Left button.
	AuxiliaryButton: 1,		// Wheel button.
	SecondaryButton: 2,		// Right button.
	FourthButton: 3,		// Browser Back button.
	FifthButton: 4			// Browser Forward button.
};

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
const MouseButtonsMask = {
	PrimaryButton: 1,		// Left button.
	SecondaryButton: 2,		// Right button.
	AuxiliaryButton: 4,		// Wheel button.
	FourthButton: 8,		// Browser Back button.
	FifthButton: 16			// Browser Forward button.
};

// If the user has any mouse buttons pressed then release them.
function releaseMouseButtons(buttons, x, y) {
	if (buttons & MouseButtonsMask.PrimaryButton) {
		emitMouseUp(MouseButton.MainButton, x, y);
	}
	if (buttons & MouseButtonsMask.SecondaryButton) {
		emitMouseUp(MouseButton.SecondaryButton, x, y);
	}
	if (buttons & MouseButtonsMask.AuxiliaryButton) {
		emitMouseUp(MouseButton.AuxiliaryButton, x, y);
	}
	if (buttons & MouseButtonsMask.FourthButton) {
		emitMouseUp(MouseButton.FourthButton, x, y);
	}
	if (buttons & MouseButtonsMask.FifthButton) {
		emitMouseUp(MouseButton.FifthButton, x, y);
	}
}

// If the user has any mouse buttons pressed then press them again.
function pressMouseButtons(buttons, x, y) {
	if (buttons & MouseButtonsMask.PrimaryButton) {
		emitMouseDown(MouseButton.MainButton, x, y);
	}
	if (buttons & MouseButtonsMask.SecondaryButton) {
		emitMouseDown(MouseButton.SecondaryButton, x, y);
	}
	if (buttons & MouseButtonsMask.AuxiliaryButton) {
		emitMouseDown(MouseButton.AuxiliaryButton, x, y);
	}
	if (buttons & MouseButtonsMask.FourthButton) {
		emitMouseDown(MouseButton.FourthButton, x, y);
	}
	if (buttons & MouseButtonsMask.FifthButton) {
		emitMouseDown(MouseButton.FifthButton, x, y);
	}
}

function registerInputs(playerElement) {
	if (!playerElement)
		return;

	registerMouseEnterAndLeaveEvents(playerElement);
	registerTouchEvents(playerElement);
}

function createOnScreenKeyboardHelpers(htmlElement) {
	if (document.getElementById('hiddenInput') === null) {
		hiddenInput = document.createElement('input');
		hiddenInput.id = 'hiddenInput';
		hiddenInput.maxLength = 0;
		htmlElement.appendChild(hiddenInput);
	}

	if (document.getElementById('editTextButton') === null) {
		editTextButton = document.createElement('button');
		editTextButton.id = 'editTextButton';
		editTextButton.innerHTML = 'edit text';
		htmlElement.appendChild(editTextButton);

		// Hide the 'edit text' button.
		editTextButton.classList.add('hiddenState');

		editTextButton.addEventListener('click', function () {
			// Show the on-screen keyboard.
			hiddenInput.focus();
		});
	}
}

function showOnScreenKeyboard(command) {
	if (command.showOnScreenKeyboard) {
		// Show the 'edit text' button.
		editTextButton.classList.remove('hiddenState');
		// Place the 'edit text' button near the UE4 input widget.
		let pos = unquantizeAndDenormalizeUnsigned(command.x, command.y);
		editTextButton.style.top = pos.y.toString() + 'px';
		editTextButton.style.left = (pos.x - 40).toString() + 'px';
	} else {
		// Hide the 'edit text' button.
		editTextButton.classList.add('hiddenState');
		// Hide the on-screen keyboard.
		hiddenInput.blur();
	}
}


function registerMouseEnterAndLeaveEvents(playerElement) {

	playerElement.onmouseenter = function (e) {
		if (print_inputs) {
			console.log('mouse enter');
		}
		var Data = new DataView(new ArrayBuffer(1));
		Data.setUint8(0, MessageType.MouseEnter);
		sendInputData(Data.buffer);
		playerElement.pressMouseButtons(e);
		// emitUIInteraction( 'showCusor' )
	};

	playerElement.onmouseleave = function (e) {
		if (print_inputs) {
			console.log('mouse leave');
		}
		var Data = new DataView(new ArrayBuffer(1));
		Data.setUint8(0, MessageType.MouseLeave);
		sendInputData(Data.buffer);
		playerElement.releaseMouseButtons(e);
		// emitUIInteraction( 'hideCusor' )
	};
}


// A locked mouse works by the user clicking in the browser player and the
// cursor disappears and is locked. The user moves the cursor and the camera
// moves, for example. The user presses escape to free the mouse.
function registerLockedMouseEvents(playerElement) {
	var x = playerElement.width / 2;
	var y = playerElement.height / 2;

	playerElement.requestPointerLock = playerElement.requestPointerLock || playerElement.mozRequestPointerLock;
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

	playerElement.onclick = function () {
		playerElement.requestPointerLock();
	};

	// Respond to lock state change events
	document.addEventListener('pointerlockchange', lockStateChange, false);
	document.addEventListener('mozpointerlockchange', lockStateChange, false);

	function lockStateChange() {
		if (document.pointerLockElement === playerElement ||
			document.mozPointerLockElement === playerElement) {
			console.log('Pointer locked');
			document.addEventListener("mousemove", updatePosition, false);
		} else {
			console.log('The pointer lock status is now unlocked');
			document.removeEventListener("mousemove", updatePosition, false);
		}
	}

	function updatePosition(e) {
		x += e.movementX;
		y += e.movementY;
		if (x > styleWidth) {
			x -= styleWidth;
		}
		if (y > styleHeight) {
			y -= styleHeight;
		}
		if (x < 0) {
			x = styleWidth + x;
		}
		if (y < 0) {
			y = styleHeight - y;
		}
        
		emitMouseMove(x, y, e.movementX, e.movementY);
	}

	playerElement.onmousedown = function (e) {
		emitMouseDown(e.button, x, y);
	};

	playerElement.onmouseup = function (e) {
		emitMouseUp(e.button, x, y);
	};

	playerElement.onmousewheel = function (e) {
		emitMouseWheel(e.wheelDelta, x, y);
	};

	playerElement.pressMouseButtons = function (e) {
		pressMouseButtons(e.buttons, x, y);
	};

	playerElement.releaseMouseButtons = function (e) {
		releaseMouseButtons(e.buttons, x, y);
	};
}


// A hovering mouse works by the user clicking the mouse button when they want
// the cursor to have an effect over the video. Otherwise the cursor just
// passes over the browser.
function registerHoveringMouseEvents(playerElement) {
	// styleCursor = 'none';   // We will rely on UE4 client's software cursor.
	styleCursor = 'default';  // Showing cursor
	playerElement.onmousemove = function (e) {

        emitMouseMove(e.offsetX, e.offsetY, e.movementX, e.movementY);

		e.preventDefault();
	};

	playerElement.onmousedown = function (e) {
		emitMouseDown(e.button, e.offsetX, e.offsetY);
		e.preventDefault();
	};

	playerElement.onmouseup = function (e) {
		emitMouseUp(e.button, e.offsetX, e.offsetY);
		e.preventDefault();
	};

	// When the context menu is shown then it is safest to release the button
	// which was pressed when the event happened. This will guarantee we will
	// get at least one mouse up corresponding to a mouse down event. Otherwise
	// the mouse can get stuck.
	// https://github.com/facebook/react/issues/5531
	playerElement.oncontextmenu = function (e) {
		emitMouseUp(e.button, e.offsetX, e.offsetY);
		e.preventDefault();
	};

	if ('onmousewheel' in playerElement) {
		playerElement.onmousewheel = function (e) {
			emitMouseWheel(e.wheelDelta, e.offsetX, e.offsetY);
			e.preventDefault();
		};
	} else {
		playerElement.addEventListener('DOMMouseScroll', function (e) {
			emitMouseWheel(e.detail * -120, e.offsetX, e.offsetY);
			e.preventDefault();
		}, false);
	}

	playerElement.pressMouseButtons = function (e) {
		pressMouseButtons(e.buttons, e.offsetX, e.offsetY);
	};

	playerElement.releaseMouseButtons = function (e) {
		releaseMouseButtons(e.buttons, e.offsetX, e.offsetY);
	};
}

function registerTouchEvents(playerElement) {

	// We need to assign a unique identifier to each finger.
	// We do this by mapping each Touch object to the identifier.
	var fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
	var fingerIds = {};

	function rememberTouch(touch) {
		let finger = fingers.pop();
		if (finger === undefined) {
			console.log('exhausted touch indentifiers');
		}
		fingerIds[touch.identifier] = finger;
	}

	function forgetTouch(touch) {
		fingers.push(fingerIds[touch.identifier]);
		delete fingerIds[touch.identifier];
	}

	function emitTouchData(type, touches) {
		let data = new DataView(new ArrayBuffer(2 + 6 * touches.length));
		data.setUint8(0, type);
		data.setUint8(1, touches.length);
		let byte = 2;
		for (let t = 0; t < touches.length; t++) {
			let touch = touches[t];
			let x = touch.clientX - playerElement.offsetLeft;
			let y = touch.clientY - playerElement.offsetTop;
			if (print_inputs) {
				console.log(`F${fingerIds[touch.identifier]}=(${x}, ${y})`);
			}
			let coord = normalizeAndQuantizeUnsigned(x, y);
			data.setUint16(byte, coord.x, true);
			byte += 2;
			data.setUint16(byte, coord.y, true);
			byte += 2;
			data.setUint8(byte, fingerIds[touch.identifier], true);
			byte += 1;
			data.setUint8(byte, 255 * touch.force, true);   // force is between 0.0 and 1.0 so quantize into byte.
			byte += 1;
		}
		sendInputData(data.buffer);
	}

	if (inputOptions.fakeMouseWithTouches) {

		var finger = undefined;

		playerElement.ontouchstart = function (e) {
			if (finger === undefined) {
				let firstTouch = e.changedTouches[0];
				finger = {
					id: firstTouch.identifier,
					x: firstTouch.clientX - playerElementClientRect.left,
					y: firstTouch.clientY - playerElementClientRect.top
				};
				// Hack: Mouse events require an enter and leave so we just
				// enter and leave manually with each touch as this event
				// is not fired with a touch device.
				playerElement.onmouseenter(e);
				emitMouseDown(MouseButton.MainButton, finger.x, finger.y);
			}
			e.preventDefault();
		};

		playerElement.ontouchend = function (e) {
			for (let t = 0; t < e.changedTouches.length; t++) {
				let touch = e.changedTouches[t];
				if (touch.identifier === finger.id) {
					let x = touch.clientX - playerElementClientRect.left;
					let y = touch.clientY - playerElementClientRect.top;
					emitMouseUp(MouseButton.MainButton, x, y);
					// Hack: Manual mouse leave event.
					playerElement.onmouseleave(e);
					finger = undefined;
					break;
				}
			}
			e.preventDefault();
		};

		playerElement.ontouchmove = function (e) {
			for (let t = 0; t < e.touches.length; t++) {
				let touch = e.touches[t];
				if (touch.identifier === finger.id) {
					let x = touch.clientX - playerElementClientRect.left;
					let y = touch.clientY - playerElementClientRect.top;
					emitMouseMove(x, y, x - finger.x, y - finger.y);
					finger.x = x;
					finger.y = y;
					break;
				}
			}
			e.preventDefault();
		};
	} else {
		playerElement.ontouchstart = function (e) {
			// Assign a unique identifier to each touch.
			for (let t = 0; t < e.changedTouches.length; t++) {
				rememberTouch(e.changedTouches[t]);
			}

			if (print_inputs) {
				console.log('touch start');
			}
			emitTouchData(MessageType.TouchStart, e.changedTouches);
			e.preventDefault();
		};

		playerElement.ontouchend = function (e) {
			if (print_inputs) {
				console.log('touch end');
			}
			emitTouchData(MessageType.TouchEnd, e.changedTouches);

			// Re-cycle unique identifiers previously assigned to each touch.
			for (let t = 0; t < e.changedTouches.length; t++) {
				forgetTouch(e.changedTouches[t]);
			}
			e.preventDefault();
		};

		playerElement.ontouchmove = function (e) {
			if (print_inputs) {
				console.log('touch move');
			}
			emitTouchData(MessageType.TouchMove, e.touches);
			e.preventDefault();
		};
	}
}

// Browser keys do not have a charCode so we only need to test keyCode.
function isKeyCodeBrowserKey(keyCode) {
	// Function keys or tab key.
    // if( keyCode == 122 ) return false

	return keyCode >= 112 && keyCode <= 123 || keyCode === 9;
}

// Must be kept in sync with JavaScriptKeyCodeToFKey C++ array. The index of the
// entry in the array is the special key code given below.
const SpecialKeyCodes = {
	BackSpace: 8,
	Shift: 16,
	Control: 17,
	Alt: 18,
	RightShift: 253,
	RightControl: 254,
	RightAlt: 255
};

// We want to be able to differentiate between left and right versions of some
// keys.
function getKeyCode(e) {
	if (e.keyCode === SpecialKeyCodes.Shift && e.code === 'ShiftRight') return SpecialKeyCodes.RightShift;
	else if (e.keyCode === SpecialKeyCodes.Control && e.code === 'ControlRight') return SpecialKeyCodes.RightControl;
	else if (e.keyCode === SpecialKeyCodes.Alt && e.code === 'AltRight') return SpecialKeyCodes.RightAlt;
	else return e.keyCode;
}

function registerKeyboardEvents() {
    document.onkeydown = function(e) {
        if (print_inputs) {
            console.log(`key down ${e.keyCode}, repeat = ${e.repeat}`);
        }
        // sendInputData(new Uint8Array([MessageType.KeyDown, getKeyCode(e), e.repeat]).buffer);
        // Backspace is not considered a keypress in JavaScript but we need it
        // to be so characters may be deleted in a UE4 text entry field.
        if (e.keyCode === SpecialKeyCodes.BackSpace) {
            document.onkeypress({
                charCode: SpecialKeyCodes.BackSpace
            });
        }

		if (inputOptions.suppressBrowserKeys && isKeyCodeBrowserKey(e.keyCode) && e.keyCode != 122 ) {
            e.preventDefault();
        }

		if ( !( inputOptions.suppressBrowserKeys && isKeyCodeBrowserKey(e.keyCode) ) ) {
            sendInputData(new Uint8Array([MessageType.KeyDown, getKeyCode(e), e.repeat]).buffer);
        }



    };

    document.onkeyup = function(e) {
        if (print_inputs) {
            console.log(`key up ${e.keyCode}`);
        }
        // sendInputData(new Uint8Array([MessageType.KeyUp, getKeyCode(e)]).buffer);

		if (inputOptions.suppressBrowserKeys && isKeyCodeBrowserKey(e.keyCode) && e.keyCode != 122 ) {
            e.preventDefault();
        }

		if ( !( inputOptions.suppressBrowserKeys && isKeyCodeBrowserKey(e.keyCode) ) ) {
            sendInputData(new Uint8Array([MessageType.KeyUp, getKeyCode(e)]).buffer);
        }



    };

    document.onkeypress = function(e) {
        if (print_inputs) {
            console.log(`key press ${e.charCode}`);
        }
        let data = new DataView(new ArrayBuffer(3));
        data.setUint8(0, MessageType.KeyPress);
        data.setUint16(1, e.charCode, true);
        // sendInputData(data.buffer);

        if (inputOptions.suppressBrowserKeys && isKeyCodeBrowserKey(e.keyCode)) {
            e.preventDefault();
        } else {
            sendInputData(data.buffer);

        }

    };
}

function onExpandOverlay_Click(/* e */) {
	let overlay = document.getElementById('overlay');
	overlay.classList.toggle("overlay-shown");
}

function start( ipAddress ) {
	connect( ipAddress );
}

function connect( ipAddress ) {
	"use strict";

	window.WebSocket = window.WebSocket || window.MozWebSocket;

	if (!window.WebSocket) {
		alert('Your browser doesn\'t support WebSocket');
		return;
	}

  const address = 'ws://'+ ipAddress + ':5173' 
  ws = new WebSocket( address )
  
	ws.onmessage = function (event) {
		console.log(`<- SS: ${event.data}`);
		var msg = JSON.parse(event.data);
		if (msg.type === 'config') {
			onConfig(msg);
		} else if (msg.type === 'playerCount') {
			// updateKickButton(msg.count - 1);
		} else if (msg.type === 'answer') {
			onWebRtcAnswer(msg);
		} else if (msg.type === 'iceCandidate') {
			onWebRtcIce(msg.candidate);
		} else {
			console.log(`invalid SS message type: ${msg.type}`);
		}
	};

	ws.onerror = function (event) {
		console.log(`WS error: ${JSON.stringify(event)}`);
	};

	ws.onclose = function (event) {
		console.log(`WS closed: ${JSON.stringify(event.code)} - ${event.reason}`);
		ws = undefined;
		is_reconnection = true;

		// destroy `webRtcPlayerObj` if any
		let playerDiv = document.getElementById('player');
		if (webRtcPlayerObj) {
			playerDiv.removeChild(webRtcPlayerObj.video);
			webRtcPlayerObj.close();
			webRtcPlayerObj = undefined;
		}

		// showTextOverlay(`Disconnected: ${event.reason}`);
		var reclickToStart = setTimeout(start, 4000);
	};
}

// Config data received from WebRTC sender via the Cirrus web server
function onConfig(config) {
	let playerDiv = document.getElementById('player');
	let playerElement = setupWebRtcPlayer(playerDiv, config);
	resizePlayerStyle();

	switch (inputOptions.controlScheme) {
		case ControlSchemeType.HoveringMouse:
			registerHoveringMouseEvents(playerElement);
			break;
		case ControlSchemeType.LockedMouse:
			registerLockedMouseEvents(playerElement);
			break;
		default:
			console.log(`ERROR: Unknown control scheme ${inputOptions.controlScheme}`);
			registerLockedMouseEvents(playerElement);
			break;
	}
}

function load( ipAddress ) {

	setupHtmlEvents();
	registerKeyboardEvents();
	start( ipAddress );

  setTimeout(() => {
    emitUIInteraction( 'reset' )
  }, 300);

}

//主动事件   
function callPixelEvents( eventName, params ) {

  if( params ) {

    params.functionName = eventName
    emitUIInteraction( params )

  } else {

    emitUIInteraction( eventName )

  }

}

//监听事件
const callBackMap = new Map()

function listenPixelEvents( eventName, callback ) {

  callBackMap.set( eventName, callback )

}

function myHandleResponseFunction( data ) {

  params = ''
  isJson = false

  try {
    
    params = JSON.parse( data )
    isJson = true

  } catch (error) {

    params = data

  }

  func = ''

  if( isJson ) {

    func = data.functionName
    const fn = callBackMap.get( func )
    fn( data )

  } else {

    func = params
    const fn = callBackMap.get( func )
    fn()

  }

}

addResponseEventListener( 'handle', myHandleResponseFunction )


