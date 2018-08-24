//事件信息采集器
export const eventInfoAnalyze=(event)=>{
  if(!event.preventDefault) return {};

  const element = event.target||event.srcElement;
  return {
      '$element_id':element.id,
      '$element_name':element.name,
      '$element_content':element.innerHTML,
      '$element_class_name':element.className,
      '$element_type':element.nodeName,
      '$element_target_url':element.href,
      '$screenX':event.screenX,
      '$screenY':event.screenY
  }

}