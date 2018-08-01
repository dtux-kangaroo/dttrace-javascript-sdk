import Option from './option';
import Param from './param';
import md5 from './md5';
const hex_md5=md5.hex_md5;
//拼接字符串
const serilize = (params) => {
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
    if((typeof DtstackData_APP_JS_Bridge === 'object') && (DtstackData_APP_JS_Bridge.sensorsdata_verify || DtstackData_APP_JS_Bridge.sensorsdata_track)){
      if(DtstackData_APP_JS_Bridge.sensorsdata_verify){
        DtstackData_APP_JS_Bridge.sensorsdata_verify(JSON.stringify(newParams));
      }else{
        SensorsData_APP_JS_Bridge.sensorsdata_track(JSON.stringify(newParams));
      }
    }else{
      const args = serilize(newParams);
      const img = new Image(1, 1);
      img.src = options.server_url+'?' + args;
    } 
  }else{
    console.error(new Error('Dttrace not init,please excute Dttrace.init'));
  }
}
export default send;