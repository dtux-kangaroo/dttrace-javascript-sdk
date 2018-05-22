import React,{PureComponent} from 'react';
// const  _cookie=require('../../../lib/dta')._cookie;

class App extends PureComponent{
  render(){
    return (
      <h1>{Dta._cookie.get('_ga')}</h1>
    )
  }
}
export default App;