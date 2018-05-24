import React,{PureComponent} from 'react';
import {cookie,uuid,DtaRocket,carryRocket,options} from '../../common-html/dta-dev';

class App extends PureComponent{

  @DtaRocket({
    "DtaRocket":"测试"
  })
  add(e){
    console.log(e.target);
  }

  subtract(e){
    options.setDefaultParams({
      "hello":"厉害的不行"
    });
  }
  render(){
    return (
      <div>
        <h1>{cookie.get('_ga')}</h1>
        <h2>{uuid()}</h2>
        <button onClick={this.add}>点我测试-add</button>
        <button onClick={carryRocket(this.subtract)}>点我测试-subtract</button>
        
      </div>
    )
  }
}
export default App;