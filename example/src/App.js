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

  SEARCH_URL=(query)=>`${"https://api.themoviedb.org/3/"}search/movie?api_key=${"f3a05026119d09f84c9aaef927a18ac2"}&query=${query}`

  apiSearch=(query)=>{
    query && fetch(this.SEARCH_URL(query)).then(response=>response.json()).then(json=>this.setState({suggestions: json.results, loading: false}));
  }

  onChange=(inputVal)=>{
    this.setState({value: inputVal, loading: true})
    clearTimeout(this.debounceTimeOut);
    this.debounceTimeOut=setTimeout(()=>this.apiSearch(inputVal), 1200);
  }

  render () {
    return (
      <div>
        <ExampleComponent
          value={this.state.value}
          labelExtractor={(item)=>item.title} 
          onSubmit={(val)=>console.log(val)}
          onChange={this.onChange}
          
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
