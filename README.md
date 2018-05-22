# JS SDK说明

登录云日志，选择日志上传-&gt;流量统计-&gt;js统计后，即可看到js sdk代码生成页面，输入应用名和Tag，点击生成代码即可，应用名和Tag可在搜索中用于日志筛选的条件。

![](/assets/js_sdk_upload.png)

## 浏览器统计参数

js代码中获取的用户客户端信息

| 字段 | 描述 |
| :--- | :--- |
| code | 用户token |
| logtype | 日志类型，js sdk设置为browser |
| tag | 日志tag |
| appname | 日志的应用名称 |
| uuid | js生成的用户id，用于统计UV |
| url | 当前页面utl |
| title | 当前页面title |
| referrer | 来源页面地址 |
| sh | 屏幕高度 |
| sw | 屏幕宽度 |
| cd | 屏幕色深 |
| lang | 语言类型，中文为zh-CN |
| platform | 操作系统 |
| triggerType | 出发类型：enter\(进入网站\),leave\(离开网站\),action\(用户行为\) |
| stayTime | 停留时间，单位毫秒 |

referrer可以通过解析规则做进一步解析

## 后台统计部分

接收js统计请求的后台获取的数据

| 字段 | 描述 |
| :--- | :--- |
| agent | 用户的user agent |
| clientip | 用户的ip地址 |
| @timestamp/timestamp | 日志接收时间 |

user agent和clientip可以通过解析规则做进一步解析

## 添加自定义参数

js sdk支持用户在统计中添加自定义的参数，参数添加在全局变量\_maq数组中:

```
_maq[['_setAccount','username'],['_setCustomVar','param name','param value'],['_setCustomVar', ...]]
```

参数分别为账户参数\(\_setAccount\)和其他参数\(\_setCustomVar\)，账户参数可以添加一个，其他参数可以添加多个。例如：

```
<script>
var _maq = _maq || [];
_maq = [['_setAccount','testuser'],['_setCustomVar','page','home']];
(function() {
var ma = document.createElement('script'); ma.type = 'text/javascript'; ma.async = true;
ma.src = "https://logapi.dtstack.com/dta.js?t=lOZVMROz1R1luHyRU9AKNO6aOR8BHV6WhHc6sI3XJaz6IXQ0qyxg1KAsDvLeALZDNwSV4ozGtSXWS1rYWzk90LKkMIrqtJ9rZLdBJQZohiVOgHVhO3JJ45SvYL0z5svjci2MNWGk7MqRxmQ80Duz0A%3D%3D";
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ma, s);
})();
</script>
```

## 自主事件统计

用户页面特定事件的统计，例如：按钮点击

```
<button onclick="_maq.trigger(['_trackEvent','登录按钮点击',...])">登录</button>
```

# SPA单页应用

由于单页应用http页面只加载一次，跳转通过前端模拟，因此单页面应用需要在路由里面\(例如:browserHistory.listen中\)通过trigger方法将跳转地址传递到sdk，注意：单页应用trigger传递的类型是"\_pageview"，例如：

```
if(window._maq){
    window._maq.trigger(['_pageview','跳转地址'])
}
```

## 设置自定义参数

单页面跳转页面不刷新，因此上面的自定义参数设置方法将导致跳转后自定义参数无法修改，这时就可以使用modifyCustomVar方法来改变自定义参数达到更新自定义参数的目的：

```
// 参数采用json的kv结构
window._maq.modifyCustomVar({
    key1:value1,
    key2:value2,
    ...
});
```

自定义参数修改最好放到路由跳转逻辑触发请求之前设置，这样可以保证数据的准确性：

```
if(window._maq){
    // 设置将要跳转到的页面对应的自定义参数
    window._maq.modifyCustomVar({
        key1:value1,
        key2:value2,
        ...
    });
    window._maq.trigger(['_pageview','跳转地址'])
}
```

设置过后即全局生效，之后的统计日志中都将包含这些参数，直到下次路由跳转将这些参数重新设置。

