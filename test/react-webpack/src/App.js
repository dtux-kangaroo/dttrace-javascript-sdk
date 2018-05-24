import React,{PureComponent} from 'react';
import {cookie,uuid,DtaRocket,carryRocket,options,launchRocket} from '../../../lib/dta.js';

class App extends PureComponent{
  constructor(props){
    super(props);
    this.state={
      searchCookieValue:'',
      uuidValue:'',
      defaultOptionsStr:'',
      defaultParamsStr:''
    }
  }

  @DtaRocket({
    "DtaRocket":"测试DtaRocket"
  })
  testDtaRocket(e){
    console.log(e.target);
  }

  testCarryRocket(e){}
  testLaunchRocket(){
    launchRocket({
      "launchRocket":"测试launchRocket"
    });
  }
  searchCookie=()=>{
    this.setState({
      searchCookieValue:cookie.get(this.refs.searchCookieKey.value.trim())
    });
  }
  setCookie=()=>{
    cookie.set(this.refs.setCookieKey.value.trim(),this.refs.setCookieValue.value.trim())
  }
  testUuid=()=>{
    this.setState({
      uuidValue:uuid()
    })
  }
  // 测试options.getDefaultOptions
  testGetDefaultOptions=()=>{
    this.setState({
      defaultOptionsStr:JSON.stringify(options.getDefaultOptions())
    })
  }
  //测试options.getDefaultParams
  testGetDefaultParams=()=>{
    this.setState({
      defaultParamsStr:JSON.stringify(options.getDefaultParams())
    })
  }
  render(){
    const {searchCookieValue,uuidValue,defaultOptionsStr,defaultParamsStr}=this.state;
    return (
      <div style={{padding:'10px'}}>
        <div style={{marginTop:'20px'}}>
          <h4>测试Cookie</h4>
          <div className="row">
            <div className="col-sm-4">
              <input ref="searchCookieKey" className="form-control" placeholder="请输入查询key"/>
            </div>
            <div className="col-sm-1">
              <button className="btn btn-primary" onClick={this.searchCookie}>查询</button>
            </div>
            <div className="col-sm-4" style={{display:'flex',alignItems:'center'}}>{searchCookieValue}</div>
          </div>
          <div className="row" style={{marginTop:'10px'}}>
            <div className="col-sm-3">
              <input ref="setCookieKey" className="form-control" placeholder="请输入key"/>
            </div>
            <div className="col-sm-3">
              <input ref="setCookieValue" className="form-control" placeholder="请输入value"/>
            </div>
            <div className="col-sm-1">
              <button className="btn btn-primary" onClick={this.setCookie}>设置</button>
            </div>
          </div>
          <div className="row" style={{marginTop:'10px'}}>
            <div className="col-sm-1">cookie:</div>
            <p className="col-sm-4">{document.cookie}</p>
          </div>
        </div>
        <div style={{marginTop:'20px'}}>
          <h4>测试方法uuid</h4>
          <div className="row">
            <div className="col-sm-1">
              <button className="btn btn-primary" onClick={this.testUuid}>生成UUID</button>
             </div>
            <div className="col-sm-6" style={{display:'flex',alignItems:'center'}}>{uuidValue}</div>     
          </div>    
        </div>
        <div style={{marginTop:'20px'}}>
          <h4>测试方法options</h4>
          <div className="row">
              <div className="col-sm-2">
                <button className="btn btn-primary" onClick={this.testGetDefaultOptions}>获取默认配置</button>
              </div>
              <div className="col-sm-6">{defaultOptionsStr}</div>
          </div>
          <div className="row" style={{marginTop:'10px'}}>
              <div className="col-sm-2">
                <button className="btn btn-primary" onClick={this.testGetDefaultParams}>获取默认参数</button>
              </div>
              <div className="col-sm-6">{defaultParamsStr}</div>
          </div>
        </div>
        <div style={{padding:"10px"}}>
          <button className="btn btn-success" onClick={this.testDtaRocket}>点我测试-@DtaRocket</button> 
        </div>   
        <div style={{padding:"10px"}}>
          <button className="btn btn-info" onClick={carryRocket(this.testCarryRocket,{"carryRocket":"测试carryRocket"})}>点我测试-carryRocket</button>
        </div>     
        <div style={{padding:"10px"}}>
          <button className="btn btn-primary" onClick={this.testLaunchRocket}>点我测试-launchRocket</button>
        </div>
        <div style={{padding:"10px"}}>
          <button className="Dta btn btn-warning" data-dta-type="action" data-dta-message="带点信息上去">点我测试-自定义属性</button>          
        </div>
      </div>
    )
  }
}
export default App;