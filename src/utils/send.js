import Option from './option';
import Param from './param';

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
  const newParams=Object.assign({},Param.get(),params)
  if(options.status){
    let args = serilize(newParams);
    args += '&$timestamp=' + new Date().getTime();
    const img = new Image(1, 1);
    img.src = options.url+'?' + args;
  }else{
    console.error(new Error("Dttrace not init,please excute Dttrace.init"));
  }
}
export default send