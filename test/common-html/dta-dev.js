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

  var get = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
      if (c.indexOf(nameEQ) == 0) { return decodeURIComponent(c.substring(nameEQ.length, c.length)); }
    }
    return null;
  };
  var set= function (name, value, days, cross_subdomain, is_secure) {
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
  };

  var remove=function (name, cross_subdomain) {
    set(name, '', -1, cross_subdomain);
  };

  var cookie = /*#__PURE__*/Object.freeze({
    get: get,
    set: set,
    remove: remove
  });

  var T = function () {
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

  var R = function () {
    return Math.random().toString(16).replace('.', '');
  };

  // User agent entropy
  // This function takes the user agent string, and then xors
  // together each sequence of 8 bytes.  This produces a final
  // sequence of 8 bytes which it returns as hex.
  var UA =  function () {
    var ua = navigator.userAgent;
    var i, ch, buffer = [],ret = 0;

    var xor=function (result, byte_array){
      var j, tmp = 0;
      for (j = 0; j < byte_array.length; j++) {
        tmp |= (buffer[j] << j * 8);
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


  function uuid () {
    var se = (screen.height * screen.width).toString(16);
    return T() + "-" + R() + "-" + UA() + "-" + se + "-" + T();
  }

  var getWindowInfo=function (){
    return window && window.screen&&{
      "sh":window.screen.height || 0,
      "sw":window.screen.width || 0,
      "cd":window.screen.colorDepth || 0,
    }
  };

  var getNavigatorInfo=function (){
    return navigator&&{
      "lang":navigator.language || '',
      "platform":navigator.platform || ''
    }
  };

  var getDocumentInfo=function (){
    return document&&{
      "url" : document.URL || '',
      "title" : document.title || '',
      "referrer":document.referrer || '',
      "cookie":document.cookie||''
    }
  };

  var extraInfo={
    "uuid":uuid(),
  };

  var DEFALUT_PARAMS=Object.assign({},getWindowInfo(),getNavigatorInfo(),getDocumentInfo(),extraInfo);


  var DEFALUT_OPTIONS={
    url:''
  };

  var getDefaultParams=function (){
    Object.assign(DEFALUT_PARAMS,getWindowInfo(),getNavigatorInfo(),getDocumentInfo());
    return DEFALUT_PARAMS;
  };

  var setDefaultParams=function (extraParams){
    Object.assign(DEFALUT_PARAMS,extraParams);
    return DEFALUT_PARAMS;  
  };

  var removeDefaultParams=function (name){
    var value=DEFALUT_PARAMS[name];
    delete DEFALUT_PARAMS[name];
    return value;
  };

  var getDefaultOptions=function (){
    return DEFALUT_OPTIONS;
  };

  var setDefaultOptions=function (options){
    if(options.params){
      setDefaultParams(options.params);
      delete options.params;
    }
    Object.assign(DEFALUT_OPTIONS,options);
    return DEFALUT_OPTIONS;
  };

  var options = /*#__PURE__*/Object.freeze({
    getDefaultParams: getDefaultParams,
    setDefaultParams: setDefaultParams,
    removeDefaultParams: removeDefaultParams,
    getDefaultOptions: getDefaultOptions,
    setDefaultOptions: setDefaultOptions
  });

  //格式化 1 => 01
  var pad=function (number){
    if (number < 10) {
        return '0' + number;
    }
    return number;
  };
  //生成时间戳
  var toISOString=function (){
    var date=new Date();
    return date.getUTCFullYear() +
        '-' + pad(date.getUTCMonth() + 1) +
        '-' + pad(date.getUTCDate()) +
        'T' + pad(date.getUTCHours()) +
        ':' + pad(date.getUTCMinutes()) +
        ':' + pad(date.getUTCSeconds()) +
        '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
  };
  //拼接字符串
  var serilize = function (params) {
    var args = '';
    for (var i in params) {
      if (args != '') {
        args += '&';
      }
      args += i + '=' + encodeURIComponent(params[i]);
    }
    return args;
  };
  //采集数据
  var send = function (params) {
    var options=getDefaultOptions();
    var newParams= Object.assign({},getDefaultParams(),params);
    if(options.url){
      var args = serilize(newParams);
      args += '&timestamp=' + toISOString();
      var img = new Image(1, 1);
      img.src = options.url+'?' + args;
    }else{
      console.error("未调用Dta.options.setDefaultOptions设置url参数");
    }
  };

  //实现 $(document).ready方法的效果
  function ready(){
    var funcs=[],isReady=false;
    function handler(event){
      var e=event || window.event;
      if (isReady) { return; }
      if(e.type === 'onreadystatechange' && document.readyState !== 'complete'){
        return;
      }
      
      funcs.forEach(function (item){
        item.call(document);
      });
      
      isReady=true;
      funcs=[];
    }
    
    if(document.addEventListener){
      document.addEventListener('DOMContentLoaded',handler,false);
      document.addEventListener('readystatechange',handler,false); //IE9+
      window.addEventListener('load',handler,false);
    }else if(document.attachEvent){
      document.attachEvent('onreadystatechange', handler);
      window.attachEvent('onload', handler);
    }

    return function(fn){
      if(isReady){
        fn.call(document);
      }else{
        funcs.push(fn);
      }
    } 
  }

  var ready$1 = ready();

  // 添加监听事件
  var addEventListener = function (element, evType, fn, useCapture) {
    if (element.addEventListener) {
      element.addEventListener(evType, fn, useCapture); //DOM2.0
      return true;
    } else if (element.attachEvent) {
      var r = element.attachEvent('on' + evType, fn);//IE5+
      return r;
    } else {
      element['on' + evType] = fn; //DOM 0
    }
  };
  function initialize () {
    ready$1(function (){
      var enterTime=new Date().getTime();
      var element_body = document.getElementsByTagName('body')[0];
      addEventListener(element_body, 'click', function (event) {
        var e = window.event || event;
        if (e.target.className.indexOf('Dta') > -1) {
          var params = {};
          Object.keys(e.target.dataset).filter(function (key) {
            if (key.indexOf("dta") > -1) {
              params[key.substring(3).toLocaleLowerCase()] = e.target.dataset[key];
            }
          });
          send(params);
        }
      },false);
    });
  }

  //给事件进行埋点
  var carryRocket=function (fun,params){
    var total=fun.length;
    return function (){
      var argsArray = [], len = arguments.length;
      while ( len-- ) argsArray[ len ] = arguments[ len ];

      fun.apply(void 0, argsArray);
      send(params);    
    }
  };

  //DtaRocket注解
  function DtaRocket(params){
    return function(target,name,descriptor){
      target[name]=carryRocket(target[name],params);    
      return target;
    }
  }
  //初始化
  initialize();
  var index = {
    cookie: cookie,
    options: options,
    uuid: uuid,
    launchRocket:send,
    carryRocket: carryRocket,
    DtaRocket: DtaRocket
  }

  return index;

})));
