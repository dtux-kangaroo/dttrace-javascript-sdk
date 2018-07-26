/*!
 * Dttrace.js v1.0.0
 * (c) 2018-2018 Rui Chengping
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Dttrace = factory());
}(this, (function () { 'use strict';

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _window = window,
      location$1 = _window.location;

  var DEFALUT_OPTIONS = {
    server_url: location$1.protocol + '//recvapi.md.dtstack.com/dta/',
    session_expiration: 30 * 60 * 1000,
    status: 1
  };

  var Option = {
    get: function get(name) {
      if (name) return DEFALUT_OPTIONS[name];
      return DEFALUT_OPTIONS;
    },
    set: function set(options) {
      _extends(DEFALUT_OPTIONS, options);
      return DEFALUT_OPTIONS;
    }
  };

  var T = function T() {
    var d = 1 * new Date();
    var i = 0;
    // this while loop figures how many browser ticks go by
    // before 1*new Date() returns a new number, ie the amount
    // of ticks that go by per millisecond
    while (d == 1 * new Date()) {
      i++;
    }
    return d.toString(16) + i.toString(16);
  };

  var R = function R() {
    return Math.random().toString(16).replace('.', '');
  };

  // User agent entropy
  // This function takes the user agent string, and then xors
  // together each sequence of 8 bytes.  This produces a final
  // sequence of 8 bytes which it returns as hex.
  var UA = function UA() {
    var ua = navigator.userAgent;
    var i = void 0,
        ch = void 0,
        buffer = [],
        ret = 0;

    var xor = function xor(result, byte_array) {
      var j = void 0,
          tmp = 0;
      for (j = 0; j < byte_array.length; j++) {
        tmp |= buffer[j] << j * 8;
      }
      return result ^ tmp;
    };

    for (i = 0; i < ua.length; i++) {
      ch = ua.charCodeAt(i);
      buffer.unshift(ch & 0xFF);
      if (buffer.length >= 4) {
        ret = xor(ret, buffer);
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      ret = xor(ret, buffer);
    }

    return ret.toString(16);
  };

  var uuid = (function () {
    var se = (screen.height * screen.width).toString(16);
    return T() + '-' + R() + '-' + UA() + '-' + se + '-' + T();
  });

  function setCookie(name, value, time, cross_subdomain, is_secure) {
    var cdomain = '',
        expires = '',
        secure = '';
    if (cross_subdomain) {
      var matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
          domain = matches ? matches[0] : '';
      cdomain = domain ? '; domain=.' + domain : '';
    }
    if (time) {
      var date = new Date();
      date.setTime(date.getTime() + time);
      expires = '; expires=' + date.toGMTString();
    }
    if (is_secure) {
      secure = '; secure';
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
  }
  var cookie = {
    get: function get(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
      return null;
    },
    set: setCookie,
    remove: function remove(name, cross_subdomain) {
      setCookie(name, '', -1, cross_subdomain);
    }
  };

  var _window$1 = window,
      localStorage$1 = _window$1.localStorage;


  var createDtSessionId = function createDtSessionId(sessionId) {
    var _Option$get = Option.get(),
        session_expiration = _Option$get.session_expiration;

    if (document.referrer === '' || document.referrer.indexOf(location.host) < 0) {
      cookie.set('DTTRACE_SESSIONID', sessionId, session_expiration);
      localStorage$1.setItem('DTTRACE_SESSIONID', sessionId);
      localStorage$1.setItem('DTTRACE_SESSIONID_EXPIRE', new Date().getTime() + session_expiration);
    }
  };

  var getDtSessionId = function getDtSessionId() {
    if (cookie.get('DTTRACE_SESSIONID')) return cookie.get('DTTRACE_SESSIONID');
    if (localStorage$1.getItem('DTTRACE_SESSIONID') && localStorage$1.getItem('DTTRACE_SESSIONID_EXPIRE') > new Date().getTime()) return localStorage$1.getItem('DTTRACE_SESSIONID');
    var sessionId = uuid();
    createDtSessionId(sessionId);
    return sessionId;
  };

  var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _window$2 = window,
      screen$1 = _window$2.screen,
      location$2 = _window$2.location,
      navigator$1 = _window$2.navigator;


  function getReferrerHost(referrer) {
    var REG_TEST_REFERRER_LEGALITY = /:\/\/.*\//;
    if (REG_TEST_REFERRER_LEGALITY.test(referrer)) {
      return referrer.match(REG_TEST_REFERRER_LEGALITY)[0].replace(/(:\/\/)|(\/)/g, '');
    }
  }

  function getScreenInfo() {
    return screen$1 && {
      '$screen_height': screen$1.height,
      '$screen_width': screen$1.width,
      '$screen_colordepth': screen$1.colorDepth
    };
  }

  function getLocationInfo() {
    return location$2 && {
      '$url': location$2.href,
      '$url_path': location$2.pathname + location$2.hash
    };
  }

  function getNavigatorInfo() {
    return navigator$1 && {
      '$lang': navigator$1.language,
      '$user_agent': navigator$1.userAgent
    };
  }

  function getDocumentInfo() {
    return document && {
      '$title': document.title,
      '$referrer': document.referrer,
      '$referrer_host': getReferrerHost(document.referrer),
      '$cookie': document.cookie
    };
  }

  function getDTTID() {
    var $DTTID = localStorage.getItem('$DTTID');
    if (!$DTTID) {
      $DTTID = uuid();
      localStorage.setItem('$DTTID', $DTTID);
    }
    return $DTTID;
  }

  function getPresetParams() {
    var userId = function () {
      var getUserId = Option.get('getUserId');
      if (typeof getUserId === 'function') {
        return getUserId();
      }
      return;
    }();
    var sessionId = function () {
      var getSessionId = Option.get('getSessionId');
      if (typeof getSessionId === 'function') {
        return getSessionId();
      }
      return;
    }();
    return _extends$1({}, getScreenInfo(), getLocationInfo(), getNavigatorInfo(), getDocumentInfo(), {
      '$dtsession_id': getDtSessionId(),
      '$app_key': Option.get('appKey'),
      '$DTTID': getDTTID(),
      '$user_id': userId,
      '$session_id': sessionId
    });
  }

  var DEFALUT_PARAMS = {};

  var Param = {
    get: function get(name) {
      var params = _extends$1({}, getPresetParams(), DEFALUT_PARAMS);
      if (name) return params[name];
      return params;
    },
    set: function set(params) {
      return _extends$1(DEFALUT_PARAMS, params);
    },
    remove: function remove(name) {
      var value = DEFALUT_PARAMS[name];
      delete DEFALUT_PARAMS[name];
      return value;
    }
  };

  /*
   * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
   * Digest Algorithm, as defined in RFC 1321.
   * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for more info.
   */
  var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
  var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

  /*
   * These are the functions you'll usually want to call
   * They take string arguments and return either hex or base-64 encoded strings
   */
  function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
  }
  function b64_md5(s) {
    return binl2b64(core_md5(str2binl(s), s.length * chrsz));
  }
  function str_md5(s) {
    return binl2str(core_md5(str2binl(s), s.length * chrsz));
  }
  function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data));
  }
  function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data));
  }
  function str_hmac_md5(key, data) {
    return binl2str(core_hmac_md5(key, data));
  }

  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length
   */
  function core_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;

    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
  }

  /*
   * These functions implement the four basic operations the algorithm uses.
   */
  function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
  }
  function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn(b & c | ~b & d, a, b, x, s, t);
  }
  function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn(b & d | c & ~d, a, b, x, s, t);
  }
  function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  /*
   * Calculate the HMAC-MD5, of a key and some data
   */
  function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function bit_rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  }

  /*
   * Convert a string to an array of little-endian words
   * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
   */
  function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
    }return bin;
  }

  /*
   * Convert an array of little-endian words to a string
   */
  function binl2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz) {
      str += String.fromCharCode(bin[i >> 5] >>> i % 32 & mask);
    }return str;
  }

  /*
   * Convert an array of little-endian words to a hex string.
   */
  function binl2hex(binarray) {
    var hex_tab = "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 0xF) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 0xF);
    }
    return str;
  }

  /*
   * Convert an array of little-endian words to a base-64 string
   */
  function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
      var triplet = (binarray[i >> 2] >> 8 * (i % 4) & 0xFF) << 16 | (binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4) & 0xFF) << 8 | binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4) & 0xFF;
      for (var j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;else str += tab.charAt(triplet >> 6 * (3 - j) & 0x3F);
      }
    }
    return str;
  }

  var md5 = {
    hex_md5: hex_md5,
    b64_md5: b64_md5,
    str_md5: str_md5,
    hex_hmac_md5: hex_hmac_md5,
    b64_hmac_md5: b64_hmac_md5,
    str_hmac_md5: str_hmac_md5
  };

  var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
  var hex_md5$1 = md5.hex_md5;
  //拼接字符串
  var serilize = function serilize(params) {
    var args = '';
    for (var i in params) {
      if (args != '') {
        args += '&';
      }

      if (params[i]) {
        args += i + '=' + encodeURIComponent(params[i]);
      } else {
        continue;
      }
    }
    return args;
  };
  //采集数据
  var send = function send(params) {
    var options = Option.get();
    var newParams = _extends$2({}, Param.get(), params);
    if (options.status) {
      var timestamp = new Date().getTime();
      var token = hex_md5$1(options.appKey + timestamp);
      var args = serilize(newParams);
      args += '&$timestamp=' + timestamp + '&$token=' + token;
      var img = new Image(1, 1);
      img.src = options.server_url + '?' + args;
    } else {
      console.error(new Error('Dttrace not init,please excute Dttrace.init'));
    }
  };

  //实现 $(document).ready方法的效果
  function ready() {
    var funcs = [],
        isReady = false;
    function handler(arg_event) {
      var e = arg_event || window.event;
      if (isReady) return;
      if (e.type === 'onreadystatechange' && document.readyState !== 'complete') {
        return;
      }

      funcs.forEach(function (item) {
        item.call(document);
      });

      isReady = true;
      funcs = [];
    }

    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', handler, false);
      document.addEventListener('readystatechange', handler, false); //IE9+
      window.addEventListener('load', handler, false);
    } else if (document.attachEvent) {
      document.attachEvent('onreadystatechange', handler);
      window.attachEvent('onload', handler);
    }

    return function (fn) {
      if (isReady) {
        fn.call(document);
      } else {
        funcs.push(fn);
      }
    };
  }

  var ready$1 = ready();

  var eventInfoAnalyze = function eventInfoAnalyze(event) {
      if (!event.preventDefault) return {};

      var element = event.target || event.srcElement;
      return {
          '$element_id': element.id,
          '$element_name': element.name,
          '$element_content': element.innerHTML,
          '$element_class_name': element.className,
          '$element_type': element.nodeName,
          '$element_target_url': element.href,
          '$screenX': event.screenX,
          '$screenY': event.screenY
      };
  };

  var _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  // 添加监听事件
  var addEventListener = function addEventListener(element, evType, fn, useCapture) {
    if (element.addEventListener) {
      element.addEventListener(evType, fn, useCapture); //DOM2.0
      return true;
    } else if (element.attachEvent) {
      var r = element.attachEvent('on' + evType, fn); //IE5+
      return r;
    } else {
      element['on' + evType] = fn; //DOM 0
    }
  };

  var initialize = (function () {
    ready$1(function () {
      var enter_time = new Date().getTime();
      //分配sessionId
      createDtSessionId(uuid());
      //监听页面进入
      var pageEnterHandler = function pageEnterHandler() {
        send({
          $event_id: 2001
        });
      };

      if ('onpageshow' in window) {
        addEventListener(window, 'pageshow', pageEnterHandler, false);
      } else {
        addEventListener(window, 'load', pageEnterHandler, false);
      }

      //代理所有className为dttrace的dom元素
      var element_body = document.getElementsByTagName('body')[0];
      addEventListener(element_body, 'click', function (arg_event) {
        var final_event = window.event || arg_event;
        var target_element = final_event.target || final_event.srcElement;
        if (target_element.className.indexOf('dttrace') > -1) {
          var params = {};
          Object.keys(target_element.dataset).filter(function (key) {
            if (key.indexOf('dttrace') > -1) {
              params[key.substring(7).toLocaleLowerCase()] = target_element.dataset[key];
            }
          });
          if (params.eventid) {
            params.$event_id = params.eventid;
            delete params.eventid;
          }
          send(_extends$3({}, eventInfoAnalyze(final_event), params));
        }
      }, false);

      //监听页面离开
      var pageLeaveHandler = function pageLeaveHandler() {
        var current_time = new Date().getTime();
        var $stay_time = current_time - enter_time;
        send({
          $event_id: 2002,
          $stay_time: $stay_time
        });
      };

      if ('onpagehide' in window) {
        addEventListener(window, 'pagehide', pageLeaveHandler, false);
      } else {
        addEventListener(window, 'beforeunload', pageLeaveHandler, false);
      }
    });
  });

  var _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function carryRocket(eventId, fun, params) {
    if (typeof eventId === 'number') {
      if (typeof fun === 'function') {
        var total = fun.length;
        return function () {
          var final_event = window.event ? window.event : arg0;

          for (var _len = arguments.length, argsArray = Array(_len), _key = 0; _key < _len; _key++) {
            argsArray[_key] = arguments[_key];
          }

          var result = fun.apply(this, argsArray);
          send(_extends$4({
            $event_id: eventId
          }, eventInfoAnalyze(final_event), params, result));
        };
      } else {
        console.error(new Error("the second param in Dttrace.carryRocket must be function"));
      }
    } else {
      console.error(new Error("the first param in Dttrace.carryRocket must be number"));
    }
  }

  //DtaRocket注解
  function DttraceRocket(eventId, params) {
    if (typeof eventId === 'number') {
      var final_params = _extends$4({
        $event_id: eventId
      }, params);
      return function (target, name, descriptor) {
        target[name] = carryRocket(eventId, target[name], final_params);
        return target;
      };
    } else {
      console.error(new Error("the first param in @DttraceRocket must be number"));
    }
  }

  // 初始化
  var init = function init(args) {
    var appKey = args.appKey,
        getSessionId = args.getSessionId,
        getUserId = args.getUserId,
        sessionExpiration = args.sessionExpiration,
        serverUrl = args.serverUrl,
        params = args.params;


    try {
      if (!appKey) throw new Error('appKey no exist');
    } catch (err) {
      Option.set({ status: 0 });
      console.error(err);
    }

    if (Option.get('status')) {
      var final_option = {
        appKey: appKey,
        getSessionId: getSessionId,
        getUserId: getUserId
      };
      if (sessionExpiration) _extends$4(final_option, { session_expiration: sessionExpiration });
      if (serverUrl) _extends$4(final_option, { server_url: serverUrl });
      if (typeof getSessionId === 'function') _extends$4(final_option, { getSessionId: getSessionId });
      if (typeof getUserId === 'function') _extends$4(final_option, { getUserId: getUserId });

      Option.set(final_option);
      Param.set(params);
      //初始化
      initialize();
    }
  };

  function launchRocket(eventId, params, event) {
    if (typeof eventId === 'number') {
      var final_params = _extends$4({
        $event_id: eventId
      }, params);
      if (event) {
        _extends$4(final_params, eventInfoAnalyze(event));
      }
      send(final_params);
    } else {
      console.error(new Error("the first param in Dttrace.launchRocket must be number"));
    }
  }

  var Dttrace = {
    init: init,
    launchRocket: launchRocket,
    carryRocket: carryRocket,
    DttraceRocket: DttraceRocket,
    cookie: cookie,
    Param: Param
  };

  return Dttrace;

})));
