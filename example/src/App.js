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
          {title:"succes"},{title:"suggestions"},{title:"sucked"},{title:"a very long title is here lets see how this works"}
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
    this.setState({loading: true})
    this.fakeApiCall()
      .then(json=>this.setState({suggestions: json.results, loading: false}))
      .catch(e=>this.setState({suggestions: [], loading: false}));  
      //handle error outside of component if you want or add error prop yourself
  }

  onChange=(inputVal)=>{        
    clearTimeout(this.debounceTimeOut);
    this.debounceTimeOut=setTimeout(()=>this.apiSearch(inputVal), 1200);
  }

  onSuggestionSelect=(inputVal)=>{
    /* maybe do a real api call here */
    this.apiSearch(inputVal)
  }

  render () {
    return (
      <div>
        <h3>EXAMPLE WITH API CALLS</h3>
        <AutoSuggest
          /* required */
          suggestions={this.state.suggestions}

          value={this.state.value}
          setValue={(value)=>this.setState({value: value})}
          onSubmit={(val)=>console.log(val)}
          /* optional  */
          onChange={this.onChange}
          onSuggestionSelect={this.onSuggestionSelect}
          /* labelExtractor required if the suggestions are objects 
          should return the value of an object property as string
          mostly titles or names */
          labelExtractor={(item)=>item.title} 
          
          className="customInput"
          placeholder="search api"

          loading={this.state.loading}
          loadingIndicator={<LoadingSpinner/>}
          deleteIcon={<div>X</div>}
        />
      </div>
    )
  }
}

