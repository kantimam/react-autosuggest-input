# react-autosuggest-input

> input field with autosuggest list

[![NPM](https://img.shields.io/npm/v/react-autosuggest-input.svg)](https://www.npmjs.com/package/react-autosuggest-input) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @kantimam/react-autosuggest
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
        <AutoSuggest
          /* required */
          suggestions={this.state.suggestions}

          value={this.state.value}
          setValue={(value)=>this.setState({value: value})}
          onSubmit={(val)=>console.log(val)}
          /* optional  */
          onChange={this.onChange}
          onSuggestionSelect={this.onSuggestionSelect}

          labelExtractor={(item)=>item.title} //required if the suggestions are objects
          
          className="customInput"

          loading={this.state.loading}
          loadingIndicator={<LoadingSpinner/>}
          deleteIcon={<div>X</div>}
        />
      </div>
    )
  }
}

```


## Props

| Prop               | Type         | Required | Description                                                                                                                       |
|:-------------------|:-------------|:--------:|:----------------------------------------------------------------------------------------------------------------------------------|
| suggestions        | Array        |    ✓     | These are the suggestions that will be displayed.                                                                                 |
| value              | String       |    ✓     | Value of the input field                                                                                                          |
| setValue           | Function     |    ✓     | Required to change the input value usually (value)=>this.setState({value: value})                                                 |
| onSubmit           | Function     |    ✓     | Required to submit the value. could be handled outside of component but submit on enter key needs to be intercepted in some cases |
| label              | String       |          | Can be used to give your input a label                                                                                            |
| className          | String       |          | Can be used to add your own className to parent component                                                                         |
| onSuggestionSelect | Function     |          | If provided this will be called when a suggestion is forcefully filled by selecting a suggestion or reseting the field            |
| onChange           | Function     |          | If provided this will be called when the input field fires the onChange event usually by typing                                   |
| onClose            | Function     |          | Function that will be fired when suggestion list closes                                                                           |
| loading            | Boolean      |          | Should loading indicator be displayed also is used to open suggestions after loading prop changes                                 |
| loadingIndicator   | ReactElement |          | ReactElement that will be rendered if loading is true                                                                             |
| onOpen             | Function     |          | Function that will be fired when suggestion list opens                                                                            |
| onClose            | Function     |          | Function that will be fired when suggestion list closes                                                                           |


## License

MIT © [https://github.com/kantimam](https://github.com/https://github.com/kantimam)
