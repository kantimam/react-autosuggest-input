import React, { Component } from 'react'

import ExampleComponent from 'react-autosuggest-input'

export default class App extends Component {
  state={
    value: "kantemir"
  }
  render () {
    return (
      <div>
        <ExampleComponent
          value={this.state.value} 
          onSubmit={(val)=>console.log(val)}
          onChange={(val)=>this.setState({value: val})}
          className="customInput"

          loading={true}
          loadingIndicator={
            <div style={{position: "absolute", top: 0, right: 0,bottom: 0,width: "1.2rem", border: "1px solid red", }}>
              
            </div>
          }
          suggestions={["asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer",]} />
      </div>
    )
  }
}
