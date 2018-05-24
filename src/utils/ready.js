//实现 $(document).ready方法的效果
function ready(){
  let funcs=[],isReady=false;
  function handler(event){
    const e=event || window.event;
    if (isReady) return;
    if(e.type === 'onreadystatechange' && document.readyState !== 'complete'){
      return;
    }
    
    funcs.forEach((item)=>{
      item.call(document);
    });
    
    isReady=true;
    funcs=[];
  }
  
  if(document.addEventListener){
    document.addEventListener('DOMContentLoaded',handler,false);
    document.addEventListener('readystatechange',handler,false); //IE9+
    window.addEventListener('load',handler,false);
  }else if(document.attachEvent){
    document.attachEvent('onreadystatechange', handler);
    window.attachEvent('onload', handler);
  }

  return function(fn){
    if(isReady){
      fn.call(document);
    }else{
      funcs.push(fn);
    }
  } 
}

export default ready();