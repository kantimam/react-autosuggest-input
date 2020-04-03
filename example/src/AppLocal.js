import React, { Component } from 'react'

import AutoSuggest from 'react-autosuggest-input'

export default class App extends Component {
  debounceTimeOut=null;
  state={
    value: "",
    suggestions: [
      {title:"succes"},{title:"suggestions"},{title:"sucked"},{title:"a very very long title is here lets see how this works"}
      ,{title:"let"},{title:"us"},{title:"stop"},{title:"using"}
      ,{title:"only"},{title:"words"},{title:"that"},{title:"start"}
      ,{title:"with"},{title:"SSSSSS"},{title:"potato me"},{title:"should"}
      ,{title:"really"},{title:"find"},{title:"a"},{title:"hobby"}
      ,{title:"before"},{title:"the"},{title:"isolation"},{title:"drives"}
      ,{title:"me"},{title:"insane"}
    ],
  }


  filterSuggestions=(suggestionArr)=>{
    /* filter out suggestions that dont have value as part of their string */
    return suggestionArr.filter(suggestion=>this.labelExtractor(suggestion)
      .toLowerCase()
      .indexOf(this.state.value.toLowerCase())>-1
    )
  }

  labelExtractor=(suggestionObject)=>suggestionObject.title;
  
  render () {
    return (
      <div>
        <h3>EXAMPLE WITH LOCAL SUGGESTIONS</h3>

        <AutoSuggest
          /* required */
          /* filter out suggestions on the client side */
          suggestions={this.filterSuggestions(this.state.suggestions)}

          value={this.state.value}
          setValue={(value)=>this.setState({value: value})}
          onSubmit={(val)=>console.log(val)}
          
          /* optional  */
          onChange={this.onChange}
          /* labelExtractor required if the suggestions are objects 
          should return the value of an object property as string
          mostly titles or names */
          labelExtractor={this.labelExtractor} 
          
          className="customInput"
          placeholder="enter word"

          deleteIcon={<div>X</div>}
          submitLabel="SEARCH"
        />
      </div>
    )
  }
}

