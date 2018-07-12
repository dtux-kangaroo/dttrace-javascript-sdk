# Dttrace JS SDK
## 预置采集数据
字段 | 描述
-----|-----
**$token** | 申请应用获得的token
**$app_type**| 申请应用获得的appType
**$app_key** | 申请应用获得的appKey
**$session_id** | 会话标识，由Dttrace自动生成
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
    appType:<申请应用获得的app类型，必填>,
    token:<申请应用获得的token，必填>,
    sessionExpiration:'<Dttrace.js生成的session的过期时间，非必填>',
    params:<自定义预置采集数据，会与Dttrace预置采集数据组合（Object），但不会覆盖Dttrace预置数据>
});
```


### 第二步 埋点
目前支持以下四种方式进行埋点：

#### 第一种：html标签自定义属性

所有带有<**dttrace**>这个类名的html标签，点击时都会触发埋点操作，并一并采集 **data-dttrace-[参数名]** 设置的值
```
<button class="dttrace" data-dttrace-[参数名]="[对应值]"></button>
```
- 传$trigger_type这个参数时，需写成<**data-dttrace-triggertype=[对应值]**>，Dttrace会处理成$trigger_type

#### 第二种：调用Dttrace.launchRocket
```
Dttrace.launchRocket(extraParams);
```

- **extraParams** &nbsp;&nbsp;&nbsp; 额外采集的数据。类型：Object

#### 第三种：利用Dttrace.carryRocket对方法进行改造

**html**

```
<button id="btn1">点击我</button>
```
**js**
```
var btn=document.getElementById("btn1");

btn.onclick=Dttrace.carryRocket(function(e){
    console.log(e.target);
    return extraParamsTwo;
},extraParamsOne,true);
```
- **extraParamsOne** &nbsp;&nbsp;&nbsp; 非必选。该事件触发之后，额外采集的数据。类型：Object
- **extraParamsTwo** &nbsp;&nbsp;&nbsp; 非必选。return 返回的采集数据，一般用于需要事件响应函数处理过的采集数据，优先级大于extraParamsOne。类型：Object


#### 第四种：利用@DttraceRocket装饰器改造方法
```
import {PureComponent} from 'react';
import {DttraceRocket} from 'dttrace';

class App extends PureComponent{
   state={
   count:0
  }

  @DttraceRocket(extraParamsOne)
  add(){
    const {count}=this.state;
    this.setState({
      count:count+1
    });
    return extraParamsTwo;
  }

  @DttraceRocket()
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
- **extraParamsOne** &nbsp;&nbsp;&nbsp; 非必选。该事件触发之后，额外采集的数据。类型：Object
- **extraParamsTwo** &nbsp;&nbsp;&nbsp; 非必选。return 返回的采集数据，一般用于需要事件响应函数处理过的采集数据，优先级大于extraParamsOne。类型：Object

## API说明

### init
参数：

参数名 | 参数类型 |参数说明
----|----|----
**appKey** | String|必选。申请应用获得的appKey
**appType** |String |必选。申请应用获得的appType
**token** |String|必选。申请应用获得的token
**sessionExpiration** | Number|非必选。Dttrace.js生成的session的过期时间,精确到毫秒。默认30分钟
**params** | Oject |非必选。全局的额外采集数据，会与默认采集数据组合

**示例：**

```
    Dttrace.init({
        appKey:"dttrace-123456",
        appType:"Web",
        token:"a6dsewqg7sfi2y334s",
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
**params** | Oject |非必选。该响应函数执行时，额外采集的数据

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
    form.onsubmit=function(){
        Dttrace.launchRocket({
            form_type:"register",
            username:form.username.value,
            password:form.password.value
        });
    };
```
### carryRocket

参数名 | 参数类型 |参数说明
----|----|----
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
    form.onsubmit=Dttrace.carryRocket(function(){
        ...
        execute your code about business
        ...
    },{
        form_type:"search"
    });
```
### getDefaultParams

参数名 | 参数类型 |参数说明
----|----|----
**name** | String |非必选。对应数据名的预置采集数据值

无参数时，会获取当前全局预置采集数据,自定义预置采集数据+Dttrace预置采集数据。

**示例：**

```
   Dttrace.getDefaultParams("realName"); //获取预置采集数据"realName"对应的值
   Dttrace.getDefaultParams(); //获取当前全局预置采集数据
```

### setDefaultParams
参数名 | 参数类型 |参数说明
----|----|----
**params** | Oject |非必选。自定义预置采集数据，会与Dttrace预置采集数据组合，并覆盖Dttrace预置采集数据。

**示例：**

```
    //全局预置采集数据添加一条realName(隔壁老王)的预置采集数据
    Dttrace.setDefaultParams({
        "realName":"隔壁老王"
    }); 
```
### removeDefaultParams
参数名 | 参数类型 |参数说明
----|----|----
**name** | String |必选。需要被删除的预置采集数据（自定义或者Dttrace）名称。

**示例：**

```
    Dttrace.removeDefaultParams("realName"); //获取预置采集数据"realName"对应的值
```