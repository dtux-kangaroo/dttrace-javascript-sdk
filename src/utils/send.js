import {getDefaultOptions,getDefaultParams} from './options';
//格式化 1 => 01
const pad=(number)=>{
  if (number < 10) {
      return '0' + number;
  }
  return number;
}
//生成时间戳
const toISOString=()=>{
  const date=new Date()
  return date.getUTCFullYear() +
      '-' + pad(date.getUTCMonth() + 1) +
      '-' + pad(date.getUTCDate()) +
      'T' + pad(date.getUTCHours()) +
      ':' + pad(date.getUTCMinutes()) +
      ':' + pad(date.getUTCSeconds()) +
      '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
      'Z';
}
//拼接字符串
const serilize = (params) => {
  let args = ''
  for (let i in params) {
    if (args != '') {
      args += '&';
    }
    switch (i) {
      case 'code':
        args += i + '=' + _encode(params[i]);
        break
      default:
        args += i + '=' + params[i];
    }
  }
  return args;
}
const send = (params,options) => {
  const newOptions= Object.assign(getDefaultOptions(),options);
  const newParams= Object.assign(getDefaultParams(),params);
  let args = serilize(newParams);
  args += '&timestamp=' + toISOString();
  const img = new Image(1, 1);
  img.src = newOptions.url+'?' + args;
}
export default send