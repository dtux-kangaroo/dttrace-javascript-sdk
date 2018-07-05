import React,{PureComponent} from 'react';
import {DttraceRocket,carryRocket,launchRocket} from '../dttrace';

class App extends PureComponent{
  state={
   count:0
  }

  @DttraceRocket({type:"add"})
  add(){
    const {count}=this.state;
    this.setState({
      count:count+1
    });
    return {
      type:"add-add"
    }
  }

  @DttraceRocket()
  subtract(){
    const {count}=this.state;
    if(count>0){
      this.setState({
        count:count-1
      });
    }
  }
  reset(){
    this.setState({
      count:0
    });
  }
  render(){
    const {count} = this.state;
        return (
            <div>
                <button onClick={this.add.bind(this)}>加1</button>
                <button onClick={this.subtract.bind(this)}>减1</button>
                <button onClick={carryRocket(this.reset.bind(this),{type:'reset'})}>清零</button>
                <div>结果：{count}</div>
                
            </div>
        )
  }
}
export default App;