# Dttrace JS SDK
## 预置采集数据
字段 | 描述
-----|-----
**$token** | Dttrace根据appKey生成的token
**$app_key** | 申请应用获得的appKey
**$dtsession_id** | 会话标识，由Dttrace自动生成
**$session_id** | 用户系统自己的sessionId
**$user_id** | 用户系统自己的userId
**$DTTID** | 用户唯一标识
**$url** | 当前页面地址
**$url_path** | 当前页面路径。如果有hash，会保留hash
**$title** | 当前页面标题
**$referrer** | 当前页面来源
**$referrer_host** | 当前页面来源的主机地址
**$screen_height** | 屏幕高度
**$screen_width** | 屏幕宽度
**$screen_colordepth** | 屏幕色深
**$lang** | 语言类型
**$user_agent** | 浏览器相关信息
**$timestamp** | 埋点日志时间（时间戳的形式）
**$trigger_type** | 触发类型（需用户自己填写，必填项）
**$stay_time** | 当前页面停留时间（多页应用自动采集，单页应用需自己手动添加）
**$element_id** | 触发事件元素的id
**$element_class_name** | 触发事件元素的类名
**$element_content** | 触发事件元素的html内容
**$element_name** | 触发事件元素的name属性
**$element_type** | 触发事件元素的节点类型
**$element_target_url** | 触发事件元素的href属性
**$screenX** | 触发事件时鼠标点击位置X轴坐标 
**$screenY** | 触发事件时鼠标点击位置Y轴坐标 


**注：默认采集参数均”$“开头，自定义参数请不要以”$“开头，以免混淆。**

## 使用说明
### 安装
#### script引入
```
<script src=".../dttrace.min.js"></script>
```
#### npm安装
```
npm install dttrace --save

import Dttrace from 'dttrace';
```
## 用法
### 第一步 初始化

```
Dttrace.init({
    appKey:<申请应用获得的appKey，必填>,
    getSessionId:function(){
        return <用户系统自己分配的sessionId>;
    },
    getUserId:function(){
        return <用户系统自己分配的userId>;
    },
    sessionExpiration:'<Dttrace.js生成的session的过期时间，非必填>',
    params:<自定义预置采集数据，会与Dttrace预置采集数据组合（Object），但不会覆盖Dttrace预置数据>
});
```


### 第二步 埋点
目前支持以下四种方式进行埋点：

#### 第一种：html标签自定义属性

所有带有<**dttrace**>这个类名的html标签，点击时都会触发埋点操作，并一并采集 **data-dttrace-[参数名]** 设置的值
```
<button class="dttrace" data-dttrace-eventid="[对应值]" data-dttrace-[参数名]="[对应值]"></button>
```
- **data-dttrace-eventid** 这个自定义属性必须要有

#### 第二种：调用Dttrace.launchRocket
```
Dttrace.launchRocket(eventid,extraParams,event);
```
- **eventid** 必选。事件id。 类型：Number
- **extraParams** 非必选。额外采集的数据。类型：Object
- **event** 非必选。JS事件对象

#### 第三种：利用Dttrace.carryRocket对方法进行改造

**html**

```
<button id="btn1">点击我</button>
```
**js**
```
var btn=document.getElementById("btn1");

btn.onclick=Dttrace.carryRocket(eventid,function(e){
    console.log(e.target);
    return extraParamsTwo;
},extraParamsOne);
```
- **eventid** 必选。事件id。 类型：Number
- **extraParamsOne** 非必选。该事件触发之后，额外采集的数据。类型：Object
- **extraParamsTwo** 非必选。return 返回的采集数据，一般用于需要事件响应函数处理过的采集数据，优先级大于extraParamsOne。类型：Object


#### 第四种：利用@DttraceRocket装饰器改造方法
```
import {PureComponent} from 'react';
import {DttraceRocket} from 'dttrace';

class App extends PureComponent{
   state={
   count:0
  }

  @DttraceRocket(eventid,extraParamsOne)
  add(){
    const {count}=this.state;
    this.setState({
      count:count+1
    });
    return extraParamsTwo;
  }

  @DttraceRocket(eventid)
  subtract(){
    const {count}=this.state;
    if(count>0){
      this.setState({
        count:count-1
      });
    }
  }
  render(){
    const {count} = this.state;
        return (
            <div>
                <button onClick={this.add.bind(this)}>加1</button>
                <button onClick={this.subtract.bind(this)}>减1</button>
                <div>结果：{count}</div>
            </div>
        )
  }s
}
```
- **eventid** 必选。事件id。 类型：Number
- **extraParamsOne** 非必选。该事件触发之后，额外采集的数据。类型：Object
- **extraParamsTwo** 非必选。return 返回的采集数据，一般用于需要事件响应函数处理过的采集数据，优先级大于extraParamsOne。类型：Object

## API说明

### init
参数名 | 参数类型 |参数说明
----|----|----
**appKey** | String|必选。申请应用获得的appKey
**getSessionId** |Function |非必选。获取用户系统的sessionId的函数
**getUserId** |Function|非必选。获取用户系统的userId的函数
**sessionExpiration** | Number|非必选。Dttrace.js生成的session的过期时间,精确到毫秒。默认30分钟
**params** | Oject |非必选。全局的额外采集数据，会与默认采集数据组合

**示例：**

```
    Dttrace.init({
        appKey:"dttrace-123456",
        getSessionId: function(){
            return Dttrace.cookie.get('SESSIONID')
        },  
        getUserId: function(){
            return window.userId;
        },  
        sessionExpiration:24*60*60*1000,
        params:{
            "realName":"隔壁老王",
            "role":["一级管理员","二级管理员"]
        }
    });
```

### launchRocket
参数名 | 参数类型 |参数说明
----|----|----
**eventid** | Number |必选。事件id
**params** | Oject |非必选。该响应函数执行时，额外采集的数据
**event** |Oject[Event]| 非必选。事件对象，Dttrace会采集其相关信息

**示例：**

**html** 
```
   <form id="form_register">
       <div class="form-group">
            <label for="exampleInputUsername">Username</label>
            <input type="text" class="form-control" id="exampleInputUsername" name="username" placeholder="Username">
        </div>
        <div class="form-group">
            <label for="exampleInputPassword">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword" name="password" placeholder="Password">
        </div>
        <button type="submit" class="btn btn-default">Send invitation</button>
    </form>
```
**js**
```
    var form=document.getElementById("form_register");
    form.onsubmit=function(e){
        Dttrace.launchRocket(3008,{
            form_type:"register",
            username:form.username.value,
            password:form.password.value
        },e);
    };
```

### carryRocket
参数名 | 参数类型 |参数说明
----|----|----
**eventid** | Number |必选。事件id
**fun** | Function| 必选。被改造事件响应函数。
**params** | Oject |非必选。该响应函数执行时，额外采集的数据

**示例：**

**html** 
```
   <form id="form_search" class="form-inline">
        <div class="form-group">
            <label for="exampleInputName2">Name</label>
            <input type="text" class="form-control" id="exampleInputName2" placeholder="Jane Doe">
        </div>
        <div class="form-group">
            <label for="exampleInputEmail2">Email</label>
            <input type="email" class="form-control" id="exampleInputEmail2" placeholder="jane.doe@example.com">
        </div>
        <button type="submit" class="btn btn-default">Send invitation</button>
    </form>
```
**js**
```
    var form=document.getElementById("form_search");
    form.onsubmit=Dttrace.carryRocket(3008,function(){
        ...
        execute your code about business
        ...
    },{
        form_type:"search"
    });
```

### Param.get
参数名 | 参数类型 |参数说明
----|----|----
**name** | String |非必选。对应数据名的预置采集数据值

- 无参数时，会获取当前全局预置采集数据,自定义预置采集数据+Dttrace预置采集数据。
- 若自定义预置采集数据和Dttrace预置采集数据存在同名字段，遵循自定义>Dttrace的原则。

**示例：**

```
   Dttrace.Param.get("realName"); //获取预置采集数据"realName"对应的值
   Dttrace.Param.get(); //获取当前全局预置采集数据
```

### Param.set
参数名 | 参数类型 |参数说明
----|----|----
**params** | Oject |非必选。自定义预置采集数据。

**示例：**

```
    //全局预置采集数据添加一条realName(隔壁老王)的预置采集数据
    Dttrace.Param.set({
        "realName":"隔壁老王"
    }); 
```

### Param.remove
参数名 | 参数类型 |参数说明
----|----|----
**name** | String |必选。需要被删除的自定义预置采集数据名称。

**示例：**

```
    Dttrace.Param.remove("realName"); //获取预置采集数据"realName"对应的值
```

### cookie.get
参数名 | 参数类型 |参数说明
----|----|----
**name** | String |必选。cookie的key

**示例：**

```
    Dttrace.cookie.get("realName"); //获取cookie中"realName"对应的值
```

### cookie.set
参数名 | 参数类型 |参数说明
----|----|----
**name** | String |必选。cookie的key
**value** |Number|String|必选。cookie的value
**time** |Number|非必选。cookie的过期时间（精确到毫秒）
**cross_subdomain** |Boolean|非必选。是否允许主域相同的域名可以共享
**is_secure** |Boolean|非必选。是否只允许cookie在https协议下才能上传到服务器

**示例：**

```
    Dttrace.cookie.set("realName","袋鼠宝宝",true,false); //设置cookie中"realName"为"袋鼠宝宝"，domain为当前主域，secure为false
```

### cookie.remove
参数名 | 参数类型 |参数说明
----|----|----
**name** |String|必选。cookie的key
**cross_subdomain** |Boolean|非必选。是否在domain为主域的cookie下删除

**示例：**

```
    Dttrace.cookie.remove("realName",true); //删除cookie中"realName"字段
```
