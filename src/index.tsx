/**
 * @class ExampleComponent
 */

import * as React from 'react'
import './index.css'

export type Props = { 
  value:string, 
  label?: string, 
  className?: string, 
  suggestions: Array<object | string>, 
  labelExtractor(item: object | string):string, 
  onOpen():any, 
  onClose():any, 
  onSubmit(inputString: string): void,
  onChange(inputString: string): void, 
  loading: boolean,
  loadingIndicator: React.ReactElement
}

export type StateTypes={
  open: boolean,
  selectedSuggestion: number,
}

export default class ExampleComponent extends React.Component<Props> {
  static defaultProps={
    labelExtractor: (label: string):string=>label,
    suggestions: [],
  }
  private scrollRef = React.createRef<HTMLDivElement>();
  readonly state:StateTypes = {
    open: false,
    selectedSuggestion: 0,

  }
  



  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    this.setState({ inputValue: event.target.value })
    this.props.onChange && this.props.onChange(event.target.value);
  } 

  openSuggestions = (): void => {
    (!this.state.open && this.props.suggestions.length) && this.setState({ open: true, selectedSuggestion: 0 })
    this.props.onOpen && this.props.onOpen();
  }

  closeSuggestions = (): void => {
    this.state.open && this.setState({ open: false, selectedSuggestion: 0 })
    this.props.onClose && this.props.onClose();
  }

  handleKeyDown = (event: React.KeyboardEvent): void => {
    switch (event.keyCode) {
      case 40:
        /* DOWN ARROW */
        this.selectNextSuggestion();
        break;
      case 38:
        /* UP ARROW */
        this.selectPrevSuggestion();
        break;
      case 27:
        /* close if ESC is pressed */
        this.closeSuggestions();
        break;
    }
  }

  handleSubmit = (event: React.FormEvent):void => {
    event.preventDefault();
    this.state.open ?
      this.setState({open: false }) :
      this.props.onSubmit && this.props.onSubmit(this.props.value);
  }

  selectNextSuggestion = (): void => {
    this.openSuggestions();
    this.state.selectedSuggestion === this.props.suggestions.length - 1 ?
      this.setState({ open: false }) :
      this.setState({ selectedSuggestion: this.state.selectedSuggestion + 1 }, () => this.updateScroll())
  }

  selectPrevSuggestion = (): void => {
    !this.state.open && this.openSuggestions();
    this.state.selectedSuggestion === 0 ?
      this.setState({ open: false }) :
      this.setState({ selectedSuggestion: this.state.selectedSuggestion - 1 }, () => this.updateScroll())
  }

  selectSuggestion = (index: Number, value: string): void => {
    if (event) event.preventDefault();
    this.setState({selectedSuggestion: index })
    this.props.onChange(value);
  }

  handleSuggestClick = (event: React.MouseEvent, index: Number, value: string) => {
    event.preventDefault();
    event.stopPropagation();
    this.selectSuggestion(index, value);
  }

  updateScroll = ():void => {
    /* only do stuff if the container is scrollable */
    if (this.scrollRef.current && this.scrollRef.current.scrollHeight) {
      const { clientHeight, scrollHeight, scrollTop } = this.scrollRef.current;
      /* ul adds 1 item padding at the top and 1 item padding at the bottom so 2 extra fake items */
      const itemHeight = scrollHeight / (this.props.suggestions.length + 2);

      /* current position of the selected item */
      const currentItemPos = itemHeight * this.state.selectedSuggestion;

      /* adjust scroll if the item overflows the container */
      if (currentItemPos + 2 * itemHeight > scrollTop + clientHeight || currentItemPos - itemHeight < scrollTop) {
        this.scrollRef.current.scrollTop = currentItemPos;
      }


    }
  }

  render() {
    return (
      <div className={`autoSuggestInput ${this.props.className}`}>
        <form
          className="ASI_Form"
          onSubmit={this.handleSubmit}
        >
          <label htmlFor="searchInput" className="ASI_Label">
            {this.props.label}
          </label>
          <div className="ASI_FlexContainer">
            <div className="ASI_InputContainer">

              <input
                className="ASI_Field"
                value={this.props.value}
                onChange={this.onInputChange}
                onFocus={this.openSuggestions}
                onBlur={this.closeSuggestions}
                onKeyDown={this.handleKeyDown}
                type="text" name="searchInput"
                id="searchInput"
                autoComplete="off"
              />

              {this.props.loading && this.props.loadingIndicator && this.props.loadingIndicator}

              {this.state.open &&
                <div className="ASI_SuggestionContainer" ref={this.scrollRef}>

                  <ul className="ASI_UL" >
                    {this.props.suggestions.map((item, index) =>
                      { /* extract label if the array items are not just strings for exameple (item)=>item.title */
                        const label=this.props.labelExtractor(item);
                        return<li 
                          className="ASI_SuggestionItem"
                          onClick={(event) => this.handleSuggestClick(event, index, label)}
                          onMouseDown={(event) => event.preventDefault()}
                          key={`suggestion_${label}_${Math.random()}`}
                          style={index === this.state.selectedSuggestion ? { backgroundColor: 'lightgrey' } : { backgroundColor: 'white' }}
                        >
                          {item}
                        </li>
                      }
                    )}
                  </ul>

                </div>
              }

            </div>
            <input className="ASI_Submit" type="submit" value="SEARCH" />
          </div>


        </form>
      </div>
    )
  }
}


