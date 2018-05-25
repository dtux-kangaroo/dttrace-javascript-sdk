# JS SDK说明

## 定位

数据采集器


## 安装
### script引入
```
<script src=".../dta.min.js"></script>
```
### npm安装
```
npm install dta --save-dev
```
## 用法

### 第一步 设置全局参数

```
Dta.options.setDefaultOptions({
  url:'http://recv.log.dtstack.com/dtas',
  params:{
    "global":"全局参数"
  }
});
```
- **url**:上传服务器的地址，需要以get接收
- **params**:这里配置的参数，每次数据采集都会带上

### 第二步 埋点
目前支持以下四种方式进行埋点：

#### 第一种：html标签自定义属性

所有带有**dta**这个类名的html标签，点击时都会触发埋点操作，并一并采集**data-dta-[参数名]**设置的值
```
<button class="dta" data-dta-[参数名]="[对应值]"></button>
```
#### 第二种：调用Dta.launchRocket
```
Dta.launchRocket();
```
Dta.launchRocket接收1个参数:params(可选)
- **params**:额外采集的数据  类型：Object

#### 第三种：利用Dta.carryRocket对方法进行改造

**html**

```
<button id="btn1">点击我</button>
```
**js**
```
var btn=document.getElementById("btn1");

btn.onclick=Dta.carryRocket(function(e){
    console.log(e.target);
});
```
所有经过Dta.carryRocket的方法都会唤起数据采集

#### 第四种：利用@DtaRocket装饰器改造方法
```
import {PureComponent} from 'react';
import {DtaRocket} from 

class App extends PureComponent{
    @DtaRocket({
        "extra":"额外参数"
    })
    add(){

    }
    render(){
        return (
            <button onClick={this.add}></button>
        )
    }
}
```
在类中被@DtaRocket装饰过的方法,被调用时都会唤起数据采集



## 默认采集数据参数

js代码中获取的用户客户端信息

| 字段 | 描述 |
| :--- | :--- |
| uuid | js生成的用户id，用于统计UV |
| url | 当前页面utl |
| title | 当前页面title |
| referrer | 来源页面地址 |
| sh | 屏幕高度 |
| sw | 屏幕宽度 |
| cd | 屏幕色深 |
| lang | 语言类型，中文为zh-CN |
| platform | 操作系统 |

## 额外API
| 字段 | 参数 | 描述 |
| :--- | :--- |:--- |
| Dta.option.getDefaultOptions|无 | 获取当前的全局配置|
| Dta.option.setDefaultOptions|Object | 修改当前的全局配置|
| Dta.option.getDefaultParams|无 | 获取当前默认的采集参数|
| Dta.option.setDefaultParams|Object | 修改当前默认的采集参数|
| Dta.option.removeDefaultParams|string | 删除当前默认的采集参数|
| Dta.cookie.get|string | 获取cookie中指定的值|
| Dta.cookie.set| string,string| 设置cookie的key-value|
| Dta.cookie.remove| string,string| 移除cookie中指定的值|
| Dta.uuid|无| 生成uuid|
