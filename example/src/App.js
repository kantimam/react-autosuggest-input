import React, { Component } from 'react'

import ExampleComponent from 'react-autosuggest-input'
import LoadingSpinner from './LoadingSpinner'

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
            <div style={{position: "absolute",display: 'flex', top: 0, right: "0.4rem", bottom: 0,width: "2.2rem"/* , border: "1px solid red", borderRadius: "4rem" */}}>
              <LoadingSpinner/>
            </div>
          }
          suggestions={["asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer","asd","dda","camcer",]} />
      </div>
    )
  }
}
