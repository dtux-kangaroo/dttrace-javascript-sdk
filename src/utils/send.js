import {getDefaultOptions,getDefaultParams} from './options';
//格式化 1 => 01
const pad=(number)=>{
  if (number < 10) {
      return '0' + number;
  }
  return number;
}
//拼接字符串
const serilize = (params) => {
  let args = ''
  for (let i in params) {
    if (args != '') {
      args += '&';
    }
    args += i + '=' + encodeURIComponent(params[i]);
  }
  return args;
}
//采集数据
const send = (params) => {
  const options=getDefaultOptions();
  const newParams= Object.assign({},getDefaultParams(),params);
  if(options.url){
    let args = serilize(newParams);
    args += '&timestamp=' + toISOString();
    const img = new Image(1, 1);
    img.src = options.url+'?' + args;
  }else{
    console.error('未调用Dta.options.setDefaultOptions设置url参数');
  }
}
export default send