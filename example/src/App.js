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
          ,{title:"let"},{title:"us"},{title:"stop"},{title:"using"}
          ,{title:"only"},{title:"words"},{title:"that"},{title:"start"}
          ,{title:"with"},{title:"SSSSSS"},{title:"potato me"},{title:"should"}
          ,{title:"really"},{title:"find"},{title:"a"},{title:"hobby"}
          ,{title:"before"},{title:"the"},{title:"isolation"},{title:"drives"}
          ,{title:"me"},{title:"insane"}
        ]});
      }, 1200)
    })
  }

  apiSearch=()=>{
    this.fakeApiCall()
      .then(json=>this.setState({suggestions: json.results, loading: false}))
      .catch(e=>this.setState({suggestions: [], loading: false}));  
      //handle error outside of component if you want or add error prop yourself
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
          /* required */
          suggestions={this.state.suggestions}

          value={this.state.value}
          onChange={this.onChange}
          onSubmit={(val)=>console.log(val)}
          /* optional  */
          onSuggestionSelect={this.onSuggestionSelect}

          labelExtractor={(item)=>item.title} //required if the suggestions are objects
          
          className="customInput"

          loading={this.state.loading}
          loadingIndicator={<LoadingSpinner/>}
        />
      </div>
    )
  }
}

