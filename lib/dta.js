/*!
 * Dta.js v1.0.0
 * (c) 2018-2018 Rui Chengping
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Dta = factory());
}(this, (function () { 'use strict';

  var _cookie = {
    get: function (name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
        if (c.indexOf(nameEQ) == 0) { return decodeURIComponent(c.substring(nameEQ.length, c.length)); }
      }
      return null;
    },
    parse: function (name) {
      var cookie;
      try {
        cookie = _.cookie.get(name) || {};
      } catch (err) {}
      return cookie;
    },
    set: function (name, value, days, cross_subdomain, is_secure) {
      var cdomain = "",
        expires = "",
        secure = "";
      if (cross_subdomain) {
        var matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
          domain = matches ? matches[0] : '';
        cdomain = ((domain) ? "; domain=." + domain : "");
      }
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      }
      if (is_secure) {
        secure = "; secure";
      }
      document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/" + cdomain + secure;
    },
    remove: function (name, cross_subdomain) {
      _.cookie.set(name, '', -1, cross_subdomain);
    }
  }

  var Dta = {
    _cookie: _cookie
  }

  var ref=[1,2,3];
  var a = ref[0];
  Dta.prototype.a=a;

  return Dta;

})));
