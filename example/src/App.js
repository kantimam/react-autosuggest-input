import React, { Component } from 'react'

import ExampleComponent from 'react-autosuggest-input'
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
        Math.random()>0.6? reject() : resolve({results:[
          "succes","suggestions","sucked"
        ]});
      }, 3000)
    })
  }

  apiSearch=(query)=>{
    /* maybe do this if you actually have a working api */
    /* query && fetch(this.SEARCH_URL(query)).
      then(response=>response.json()).
      then(json=>this.setState({suggestions: json.results, loading: false})); */

    this.fakeApiCall().
      then(json=>this.setState({suggestions: json.results, loading: false})).
      catch(e=>this.setState({suggestions: [], loading: false}));  // handle error outside of component if you want or add error prop yourself
  }

  onChange=(inputVal)=>{
    console.log("fired");
    
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
        <ExampleComponent
          value={this.state.value}
          labelExtractor={(item)=>item.title} 
          onSubmit={(val)=>console.log(val)}
          onChange={this.onChange}
          onSuggestionSelect={this.onSuggestionSelect}

          className="customInput"

          loading={this.state.loading}
          loadingIndicator={
            <div style={{position: "absolute",display: 'flex', top: 0, right: "0.4rem", bottom: 0,width: "2.2rem"/* , border: "1px solid red", borderRadius: "4rem" */}}>
              <LoadingSpinner/>
            </div>
          }
          suggestions={this.state.suggestions} />
      </div>
    )
  }
}
