import Option from './option';
import Param from './param';
import md5 from '../utils/md5';
const hex_md5=md5.hex_md5;
//判断是否为Android
function isAndroid(){
  return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
}
//判断是否为Ios
function isIos(){
  return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
}

//通知ios
function callIos(params,failback){
  //这边写调用ios的方法
  if((typeof window.DtstackData_APP_JS_Bridge === 'object') && (window.DtstackData_APP_JS_Bridge.dttrace_track)){
    window.DtstackData_APP_JS_Bridge.dttrace_track(params);
  }else{
    failback();
  }
}
//通知Android
function callAndroid(params,failback){
  if((typeof DtstackData_APP_JS_Bridge === 'object') && (DtstackData_APP_JS_Bridge.dttrace_verify || DtstackData_APP_JS_Bridge.dttrace_track)){
    if(DtstackData_APP_JS_Bridge.dttrace_verify){
      DtstackData_APP_JS_Bridge.dttrace_verify(JSON.stringify(params));
    }else{
      SensorsData_APP_JS_Bridge.dttrace_track(JSON.stringify(params));
    }
  }else{
    failback();
  }
}
//通知H5
function callH5(url,params){
  const args = serilize(params);
  const img = new Image(1, 1);
  img.src = url + '?' + args;
}
//拼接字符串
function serilize(params){
  let args = ''
  for (let i in params) {
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
}
//采集数据
const send = (params) => {
  const options=Option.get();
  if(options.status){
    const timestamp=new Date().getTime();
    const token=hex_md5(options.appKey+timestamp);
    const newParams=Object.assign({},Param.get(),params,{
      $timestamp:timestamp,
      $token:token
    });
    if(isAndroid()){
      callAndroid(newParams,()=>{
        callH5(options.server_url,newParams);
      });
    }else if(isIos()){
      callIos(newParams,()=>{
        callH5(options.server_url,newParams);
      });
    }else{
      callH5(options.server_url,newParams);
    }
  }else{
    console.error(new Error('Dttrace not init,please excute Dttrace.init'));
  }
}
export default send;