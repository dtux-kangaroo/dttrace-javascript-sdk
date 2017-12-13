var _maq = _maq || [];
(function () {
    var _ = {};
    var params = {};
    var api_host = 'recv.log.dtstack.com';
    var enterTime = null;

    if (!Date.prototype.toISOString) {
        (function () {

            function pad(number) {
                if (number < 10) {
                    return '0' + number;
                }
                return number;
            }

            Date.prototype.toISOString = function () {
                return this.getUTCFullYear() +
                    '-' + pad(this.getUTCMonth() + 1) +
                    '-' + pad(this.getUTCDate()) +
                    'T' + pad(this.getUTCHours()) +
                    ':' + pad(this.getUTCMinutes()) +
                    ':' + pad(this.getUTCSeconds()) +
                    '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                    'Z';
            };

        }());
    }

    //cookie操作
    _.cookie = {
        get: function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
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
    };
    // 判断是否移动端
    _.isPhone = function () {
        return navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i);
    }
    //生成用户唯一id
    _.UUID = (function () {
        // Time/ticks information
        // 1*new Date() is a cross browser version of Date.now()
        var T = function () {
            var d = 1 * new Date(),
                i = 0;
            // this while loop figures how many browser ticks go by
            // before 1*new Date() returns a new number, ie the amount
            // of ticks that go by per millisecond
            while (d == 1 * new Date()) {
                i++;
            }
            return d.toString(16) + i.toString(16);
        };
        // Math.Random entropy
        var R = function () {
            return Math.random().toString(16).replace('.', '');
        };
        // User agent entropy
        // This function takes the user agent string, and then xors
        // together each sequence of 8 bytes.  This produces a final
        // sequence of 8 bytes which it returns as hex.
        var UA = function (n) {
            var ua = navigator.userAgent,
                i, ch, buffer = [],
                ret = 0;

            function xor(result, byte_array) {
                var j, tmp = 0;
                for (j = 0; j < byte_array.length; j++) {
                    tmp |= (buffer[j] << j * 8);
                }
                return result ^ tmp;
            }
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
        return function () {
            var se = (screen.height * screen.width).toString(16);
            return (T() + "-" + R() + "-" + UA() + "-" + se + "-" + T());
        };
    })();

    //localStorage
    _.localStorage = {
        error: function (msg) {
            console.error('localStorage error: ' + msg);
        },
        get: function (name) {
            try {
                return window.localStorage.getItem(name);
            } catch (err) {
                _.localStorage.error(err);
            }
            return null;
        },
        parse: function (name) {
            try {
                return _.JSONDecode(_.localStorage.get(name)) || {};
            } catch (err) {}
            return null;
        },
        set: function (name, value) {
            try {
                window.localStorage.setItem(name, value);
            } catch (err) {
                _.localStorage.error(err);
            }
        },
        remove: function (name) {
            try {
                window.localStorage.removeItem(name);
            } catch (err) {
                _.localStorage.error(err);
            }
        }
    };

    function _init() {
        // 判断token是否存在，如果不在则结束
        params.code = 'cxKLOpJSs8OajOTXOs+ROCOQ1G8InxjrSmOQGL4lV0BeiXrgRVzb8C+q4jCNX1VI8sB1Q2hUYBBKr72hajrzHhG8tG9pegfb0MH1k2gSB3qyQCGxjoBhIRKCRCj2ziEmOm14ewVmGs2Zn4IMl2l3nXVxZ/tBznRY4FWtvkcAwfEdUG7SqSYQdol9ijNZeGvC';
        params.logtype = 'browser';
        
        // 判断uuid是否存在，如果不在则新建一个
        if (_.cookie.get('DTAUSRID') || _.localStorage.get('DTAUSRID')) {
            params.uuid = _.cookie.get('DTAUSRID') || _.localStorage.get('DTAUSRID');
        } else {
            params.uuid = _.UUID();
            _.cookie.set('DTAUSRID', params.uuid, 180, true, true);
            _.localStorage.set('DTAUSRID', params.uuid)
        }
        // 判断是不是新的session，如果是责新建一个DTASESSIONID加入存储，否则读取
        if (_isNewSession()) {
            params.dta_session_id = _.UUID();
            _.cookie.set('DTASESSIONID', params.dta_session_id, 180, true, true);
            _.localStorage.set('DTASESSIONID', params.dta_session_id)
        } else {
            params.dta_session_id = _.cookie.get('DTASESSIONID') || _.localStorage.get('DTASESSIONID');
        }
        //Document对象数据
        if (document) {
            // params.domain = document.domain || '';
            params.url = _decode(document.URL) || '';
            params.title = document.title || '';
            params.referrer = _decode(document.referrer) || '';
        }
        //Window对象数据
        if (window && window.screen) {
            params.sh = window.screen.height || 0;
            params.sw = window.screen.width || 0;
            params.cd = window.screen.colorDepth || 0;
        }
        //navigator对象数据
        if (navigator) {
            params.lang = navigator.language || '';
            params.platform = navigator.platform || '';
        }
        //解析_maq配置
        if (_maq) {
            for (var i in _maq) {
                switch (_maq[i][0]) {
                    case '_setAccount':
                        params.account = _maq[i][1];
                        break;
                    case '_setCustomVar':
                        params[_maq[i][1]] = _maq[i][2];
                        break;
                    default:
                        break;
                }
            }
        }
    }
    // 触发事件请求
    _maq.trigger = function (arr) {
		// debugger;
        switch (arr[0]) {
            case '_trackEvent':
                params.triggerType = 'action';
                var p1 = params;
                arr.shift();
                p1.event = arr.join(',');
                _send(_serilize(p1));
                break;
            case '_pageview':
				// debugger;
                var p2 = params;
                p2.triggerType = 'state_enter';
                enterTime = new Date().getTime();
                p2.stayTime = '';
                p2.referrer = p2.url;
                p2.url = location.protocol + '//' + location.host + arr[1];
				// p2.referrer = window.location.href;
                
                _send(_serilize(p2));
            default:
                break;
        }
    }
    //encode方法
    function _encode(str) {
        return encodeURIComponent(str);
    }
    //decode方法
    function _decode(str) {
        return decodeURIComponent(str);
    }
    //protocal方法
    function _protocal() {
        return location.protocol
    }
    // 判断当前是否新的session
    function _isNewSession() {
        var referrer = document.referrer

        var domain = document.domain.split('.').slice(-2).join('.');
        if (referrer != '') {
            var referrer_host = document.referrer.split('/')[2];
            if (referrer_host.indexOf(domain) > -1) {
                if (_.cookie.get('DTASESSIONID') || _.localStorage.get('DTASESSIONID')) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
    //拼接参数串
    function _serilize(params) {
        var args = '';
        for (var i in params) {
            if (args != '') {
                args += '&';
            }
            args += i + '=' + _encode(params[i]);
        }
        return args;
    }
    //通过Image对象请求后端脚本
    function _send(args, callback) {
        args += '&timestamp=' + new Date().toISOString();
        var img = new Image(1, 1);
        // img.onload = function () {
        //     if (typeof callback === 'function') {
        //         callback();
        //     }
        // }
        var schema = _protocal();
        var request = null;
        if (schema == 'http:') {
            request = schema + '//' + api_host + '/dta?' + args;
        }
        if (schema == 'https:') {
            request = schema + '//' + api_host + '/dtas?' + args;
        }
        img.src = request;
    };
    //事件处理，加载和离开的时候触发
    function _sendOnLoad() {
        _init();
        params.triggerType = 'enter';
        enterTime = new Date().getTime();
        _send(_serilize(params));
    }
    function _sendOnLeave(type){
        // _init();
        var leaveTime = new Date().getTime();
        params.triggerType = type || 'leave';
        params.stayTime = leaveTime - enterTime;
        _send(_serilize(params));
    }
    // 判断页面离开，ios下需要监听pagehide事件
    if (_isIos()) {
        _addEvent(window, 'pagehide', function () {
            var leaveTime = new Date().getTime();
            // _init();
            params.triggerType = 'leave';
            params.stayTime = leaveTime - enterTime;
            _send(_serilize(params));
        }, false);
    } else {
        _addEvent(window, 'beforeunload', function () {
            var leaveTime = new Date().getTime();
            // _init();
            params.triggerType = 'leave';
            params.stayTime = leaveTime - enterTime;
            _send(_serilize(params));
        }, false);
    }
    // 单页应用hash模式下监听事件
    // _addEvent(window,'hashchange',function(e){
    //     if(e.oldURL != e.newURL){
    //         _sendOnLeave('state_leave');
    //         params.triggerType = 'state_enter';
    //         params.url = e.newURL;
    //         params.referrer = e.oldURL;
    //         enterTime = new Date().getTime();
    //         _send(_serilize(params));
    //     }
    // });
    
    // 单页应用使用history模式的情况下需要自定义pushstate和replacestate事件
    // (function(history){
    //     var pushState = history.pushState;
    //     var replaceState = history.replaceState;
    //     history.pushState = function(state) {
    //         if (typeof history.onpushstate == "function") {
    //             history.onpushstate({state: state,url:window.location.href});
    //         }
            
    //         return pushState.apply(history, arguments);
    //     }
    //     history.replaceState = function(state) {
    //         if (typeof history.onreplacestate == "function") {
    //             history.onreplacestate({state: state,url:window.location.href});
    //         }
            
    //         return replaceState.apply(history, arguments);
    //     }
    // })(window.history);
	// 监听浏览器前进后退行为，发送leave请求，更新referrer
	// _addEvent(window,'popstate',function(e){
    //     // _sendOnLeave('state_leave');
    //     debugger
	// 	params.referrer = params.url;
	// 	enterTime = new Date().getTime();
    // })
    // window.onpopstate = function(e){
    //     debugger;

    // }
    // history api事件监听
    // _addEvent(history,'pushstate',function(e){
    //     // _sendOnLeave('state_leave');
    //     debugger;
    //     params.referrer = e.url;
    //     enterTime = new Date().getTime();
    // });
    // _addEvent(history,'replacestate',function(e){
    //         _sendOnLeave('state_leave')
            
    //         params.referrer = e.url;
    //         enterTime = new Date().getTime();
    // });

    function _addEvent(element, evType, fn, useCapture) {
        if (element.addEventListener) {
            element.addEventListener(evType, fn, useCapture); //DOM2.0
            return true;
        } else if (element.attachEvent) {
            var r = element.attachEvent('on' + evType, fn); //IE5+
            return r;
        } else {
            element['on' + evType] = fn; //DOM 0
        }
    }

    function _isIos() {
        var u = navigator.userAgent;
        return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    }
    _sendOnLoad();
})();
