import React, { Component } from 'react'

import AutoSuggest from 'react-autosuggest-input'
import LoadingSpinner from './LoadingSpinner'

export default class App extends Component {
  debounceTimeOut=null;
  state={
    value: "",
    suggestions: [],
    loading: false
  }

  fakeApiCall=()=>{
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        Math.random()>0.8? reject() : resolve({results:[
          {title:"succes"},{title:"suggestions"},{title:"sucked"}
        ]});
      }, 1200)
    })
  }

  apiSearch=()=>{
    this.fakeApiCall()
      .then(json=>this.setState({suggestions: json.results, loading: false}))
      .catch(e=>this.setState({suggestions: [], loading: false}));  
      // handle error outside of component if you want or add error prop yourself
  }

  onChange=(inputVal)=>{    
    this.setState({value: inputVal, loading: true})
    clearTimeout(this.debounceTimeOut);
    this.debounceTimeOut=setTimeout(()=>this.apiSearch(inputVal), 1200);
  }

  onSuggestionSelect=(inputVal)=>{
    this.setState({value: inputVal, loading: false})
  }

  render () {
    return (
      <div>
        <AutoSuggest
          value={this.state.value}
          labelExtractor={(item)=>item.title} 
          onSubmit={(val)=>console.log(val)}
          onChange={this.onChange}
          onSuggestionSelect={this.onSuggestionSelect}

          className="customInput"

          loading={this.state.loading}
          loadingIndicator={
            <div style={{position: "absolute",display: 'flex', top: 0, right: "0.4rem", bottom: 0,width: "2.2rem"}}>
              <LoadingSpinner/>
            </div>
          }
          suggestions={this.state.suggestions} />
      </div>
    )
  }
}
