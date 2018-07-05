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

  var get = function (name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
      if (c.indexOf(nameEQ) == 0) { return decodeURIComponent(c.substring(nameEQ.length, c.length)); }
    }
    return null;
  };
  var set= function (name, value, time, cross_subdomain, is_secure) {
    var cdomain = '',
      expires = '',
      secure = '';
    if (cross_subdomain) {
      var matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i),
        domain = matches ? matches[0] : '';
      cdomain = ((domain) ? '; domain=.' + domain : '');
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
  };

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
    return T() + '-' + R() + '-' + UA() + '-' + se + '-' + T();
  }

  var localStorage = window.localStorage;

  var createSessionId = function (){
   
    var ref = getDefaultOptions();
    var session_expiration = ref.session_expiration;
    if(document.referrer===''||document.referrer.indexOf(location.host)<0){
      var sessionId =uuid();
      set('DTTRACE_SESSIONID',sessionId,session_expiration);
      localStorage.setItem('DTTRACE_SESSIONID',sessionId);
    }
  };

  var getSessionId=function (){
    if(get('DTTRACE_SESSIONID')) { return get('DTTRACE_SESSIONID'); }
    if(localStorage.getItem('DTTRACE_SESSIONID')) { return localStorage.getItem('DTTRACE_SESSIONID'); }
  };

  var screen$1 = window.screen;
  var location$1 = window.location;
  var navigator$1 = window.navigator;

  var getReferrerHost=function (referrer){
    var REG_TEST_REFERRER_LEGALITY=/:\/\/.*\//;
    if(REG_TEST_REFERRER_LEGALITY.test(referrer)){
      return referrer.match(REG_TEST_REFERRER_LEGALITY)[0].replace(/(:\/\/)|(\/)/g,'')
    }
  };


  var getScreenInfo=function (){
    return screen$1&&{
      '$screen_height':screen$1.height,
      '$screen_width':screen$1.width,
      '$screen_colordepth':screen$1.colorDepth
    }
  };

  var getLocationInfo=function (){
    return location$1&&{
      '$url':location$1.href,
      '$url_path':location$1.pathname+location$1.hash
    }
  };

  var getNavigatorInfo=function (){
    return navigator$1&&{
      '$lang':navigator$1.language,
      '$user_agent':navigator$1.userAgent
    }
  };

  var getDocumentInfo=function (){
    return document&&{
      '$title' : document.title,
      '$referrer':document.referrer,
      '$referrer_host':getReferrerHost(document.referrer),
      '$cookie':document.cookie
    }
  };

  var getAllInfo=function (){
    return Object.assign({},getScreenInfo(),getLocationInfo(),getNavigatorInfo(),getDocumentInfo(),{
      '$session_id':getSessionId()
    });
  };

  var DEFALUT_PARAMS=Object.assign({},getAllInfo(),{
    '$DTTID':uuid()
  });


  var DEFALUT_OPTIONS={
    url:'https://recvapi.md.dtstack.com/dta/',
    session_expiration:30*60*1000,
    status:0
  };

  var getDefaultParams=function (){
    Object.assign(DEFALUT_PARAMS,getAllInfo());
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
    Object.assign(DEFALUT_OPTIONS,options);
    return DEFALUT_OPTIONS;
  };

  //拼接字符串
  var serilize = function (params) {
    var args = '';
    for (var i in params) {
      if (args != '') {
        args += '&';
      }

      if(params[i]){
        args += i + '=' + encodeURIComponent(params[i]);
      }else{
        continue;
      }
    }
    return args;
  };
  //采集数据
  var send = function (params) {
    var options=getDefaultOptions();
    var newParams= Object.assign({},getDefaultParams(),params);
    if(options.status){
      var args = serilize(newParams);
      args += '&$timestamp=' + new Date().getTime();
      var img = new Image(1, 1);
      img.src = options.url+'?' + args;
    }else{
      console.error("Dttrace not init,please excute Dttrace.init");
    }
  };

  //实现 $(document).ready方法的效果
  function ready(){
    var funcs=[],isReady=false;
    function handler(arg_event){
      var e=arg_event || window.event;
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

  var eventInfoAnalyze=function (event){
    if(!event.preventDefault) { return {}; }

    var element = event.target||event.srcElement;
    return {
        '$element_id':element.id,
        '$element_name':element.name,
        '$element_content':element.innerHTML,
        '$element_class_name':element.className,
        '$element_type':element.nodeName,
        '$element_target_url':element.href,
        '$screenX':event.screenX,
        '$screenY':event.screenY
    }

  };

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
      var enter_time=new Date().getTime();
      //分配sessionId
      createSessionId();
      //监听页面进入
      var pageEnterHandler=function (){
        send({
          $trigger_type:'enter',
        }); 
      };

      if('onpageshow' in window){
        addEventListener(window,'pageshow',pageEnterHandler,false);
      }else{
        addEventListener(window,'load',pageEnterHandler,false);
      }

    
      //代理所有className为dttrace的dom元素
      var element_body = document.getElementsByTagName('body')[0];
      addEventListener(element_body, 'click',function (arg_event){
        var final_event = window.event || arg_event;
        var target_element =final_event.target||final_event.srcElement;
        if (target_element.className.indexOf('dttrace') > -1) {
          var params = {};
          Object.keys(target_element.dataset).filter(function (key) {
            if (key.indexOf('dttrace') > -1) {
              params[key.substring(7).toLocaleLowerCase()] = target_element.dataset[key];
            }
          });
          send(Object.assign({
            $trigger_type:'action'
          },eventInfoAnalyze(final_event),params));
        }
      },false);

      //监听页面离开
      var pageLeaveHandler=function (){
        var current_time = new Date().getTime(); 
        var $stay_time = current_time - enter_time;
        send({
          $trigger_type:'leave',
          $stay_time: $stay_time
        });
      };

      if('onpagehide' in window){
        addEventListener(window,'pagehide',pageLeaveHandler,false);
      }else{
        addEventListener(window,'beforeunload',pageLeaveHandler,false);
      } 

      setDefaultOptions({
        status:1
      });
    });
  }

  //给事件进行埋点
  var carryRocket =function(fun,params){
    if(typeof fun === 'function'){
      var total = fun.length;
      return function(){
        var argsArray = [], len = arguments.length;
        while ( len-- ) argsArray[ len ] = arguments[ len ];

        var final_event = window.event ? window.event : arg0;
        var result=fun.apply(this,argsArray);
        send(Object.assign({}, eventInfoAnalyze(final_event), Object.assign({$trigger_type:'action'},params),result));
      }
    }
    console.error("Dttrace.carryRocket参数传递错误");
  };

  //DtaRocket注解
  function DttraceRocket(params) {
    return function (target, name, descriptor) { 
      target[name]=carryRocket(target[name],params);
      return target;
    }
  }

  // 初始化
  var init = function (args) {
    var appKey = args.appKey;
    var appType = args.appType;
    var token = args.token;
    var sessionExpiration = args.sessionExpiration;
    var params = args.params;

    if (checkArgsIntegrity(args).length > 0) {
      console.error('Dttrace initialize unsuccessfully,some required params no exist!');
      checkArgsIntegrity(args).forEach(function (item) {
        console.error(item);
      });
    } else {
      if(sessionExpiration) { setDefaultOptions({session_expiration:sessionExpiration}); }
      setDefaultParams(Object.assign({},{
        $app_key:appKey,
        $app_type:appType,
        $token:token
      },params));
      //初始化
      initialize();
    }

    function checkArgsIntegrity(args) {
      var appKey = args.appKey;
      var appType = args.appType;
      var token = args.token;
      var errorList = [];
      if (!appKey) { errorList.push('appKey no exist'); }
      if (!appType) { errorList.push('appType no exist'); }
      if (!token) { errorList.push('token no exist'); }
      return errorList;
    }
  };

  var launchRocket = function (params,event) {
    var final_params= params;
    if(event){
      Object.assign(final_params,eventInfoAnalyze(event));
    }
    send(final_params);
  };


  var Dttrace={
    init: init,
    launchRocket: launchRocket,
    carryRocket: carryRocket,
    DttraceRocket: DttraceRocket,
    setDefaultParams: setDefaultParams,
    removeDefaultParams: removeDefaultParams
  };

  return Dttrace;

})));
