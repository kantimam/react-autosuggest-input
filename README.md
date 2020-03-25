# react-autosuggest-input

> input field with autosuggest list

[![NPM](https://img.shields.io/npm/v/react-autosuggest-input.svg)](https://www.npmjs.com/package/react-autosuggest-input) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @kantimam/react-autosuggest-input
```

## Usage

```tsx
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
          "succes","suggestions","sucked"
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
            <div style={{position: "absolute",display: 'flex', top: 0, right: "0.4rem", bottom: 0,width: "2.2rem"/* , border: "1px solid red", borderRadius: "4rem" */}}>
              <LoadingSpinner/>
            </div>
          }
          suggestions={this.state.suggestions} />
      </div>
    )
  }
}


```

## License

MIT © [https://github.com/kantimam](https://github.com/https://github.com/kantimam)
