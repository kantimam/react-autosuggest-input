/**
 * @class AutoSuggestInput
 */

import * as React from 'react'
import './index.css'

export type Props = {
  value: string,
  label?: string,
  className?: string,
  suggestions: Array<object | string>,
  labelExtractor(item: object | string): string,
  onOpen(): any,
  onClose(): any,
  onSubmit(inputString: string): void,
  onChange(inputString: string): void,
  onSuggestionSelect?(inputString: string): void,  // using onChange to fire api calls usually but dont want to call api again after picking suggestion
  loading: boolean,
  loadingIndicator: React.ReactElement
}

export type StateTypes = {
  open: boolean,
  selectedSuggestion: number,
}

export default class ExampleComponent extends React.Component<Props> {
  static defaultProps = {
    labelExtractor: (_: object): string =>"labelExtractor required",
    suggestions: [],
  }

  

  private inputValueRestore: string = ""
  private scrollRef = React.createRef<HTMLDivElement>();
  readonly state: StateTypes = {
    open: false,
    selectedSuggestion: 0,

  }

  componentDidUpdate(prevProps: any) {
    /* if it was loading before and no longer is chances are there are new suggestions to see :) */
    if (!this.props.loading && prevProps.loading) {
      this.openSuggestions();
    }
  }


  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange && this.props.onChange(event.target.value);
  }

  openSuggestions = (): void => {
    if (!this.state.open && this.props.suggestions.length) {
      this.setState({ open: true })
      this.props.onOpen && this.props.onOpen();
    }
  }

  closeSuggestions = (): void => {
    if (this.state.open) {
      this.setState({ open: false })
      this.inputValueRestore = "";
      this.props.onClose && this.props.onClose();
    }
  }

  handleKeyDown = (event: React.KeyboardEvent): void => {
    switch (event.keyCode) {
      case 40:
        /* DOWN ARROW */
        event.preventDefault();
        this.selectNextSuggestion();
        break;
      case 38:
        /* UP ARROW */
        event.preventDefault();
        this.selectPrevSuggestion();
        break;
      case 27:
        if (!this.state.open) return;
        /* close if ESC is pressed */
        event.preventDefault();
        this.restorePrev();
        this.closeSuggestions();
        break;
      case 13:
        if (!this.state.open) return;
        /* if enter is pressed and suggestions are open dont submit yet */
        event.preventDefault();
        this.closeSuggestions();
        break;


    }
  }


  handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    this.props.onSubmit(this.props.value);
  }

  selectedSuggestionLabel = (id: number) => this.extractLabel(this.props.suggestions[id])

  restorePrev = () => {
    /* if there is a restore value you can go back to your initial input */
    if (!this.inputValueRestore) return
    this.props.onSuggestionSelect ?
      this.props.onSuggestionSelect(this.inputValueRestore) :
      this.props.onChange(this.inputValueRestore);
  }

  selectNextSuggestion = (): void => {
    if(!this.state.open) return this.openSuggestions();
    this.state.selectedSuggestion === this.props.suggestions.length - 1 ?
      this.setState({ open: false }) :
      (
        this.selectSuggestion(
          this.state.selectedSuggestion,
          this.selectedSuggestionLabel(this.state.selectedSuggestion + 1)
        )
        , this.setState({ selectedSuggestion: this.state.selectedSuggestion + 1 }, () => this.updateScroll())
      )
  }

  selectPrevSuggestion = (): void => {
    if(!this.state.open) return this.openSuggestions();
    this.openSuggestions();
    this.state.selectedSuggestion === 0 ?
      this.setState({ open: false }) :
      (
        this.selectSuggestion(
          this.state.selectedSuggestion,
          this.selectedSuggestionLabel(this.state.selectedSuggestion - 1)
        ),
        this.setState({ selectedSuggestion: this.state.selectedSuggestion - 1 }, () => this.updateScroll())
      )
  }


  selectSuggestion = (index: number, value: string): void => {
    if (event) event.preventDefault();
    this.setState({ selectedSuggestion: index })
    /* store prev value for the case that user pushes esc for restore */
    if (this.inputValueRestore === "") this.inputValueRestore = this.props.value;
    /* if special onSuggestionSelect function was providid to not colide with onChange use it */
    this.props.onSuggestionSelect ?
      this.props.onSuggestionSelect(value) :
      this.props.onChange(value);
  }

  handleSuggestClick = (event: React.MouseEvent, index: number, value: string) => {
    event.preventDefault();
    event.stopPropagation();
    this.selectSuggestion(index, value);
    this.closeSuggestions();
  }

  updateScroll = (): void => {
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

  extractLabel = (item: object | string): string => {
    if (typeof item === 'string') return item;
    return this.props.labelExtractor(item);
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
                onClick={this.openSuggestions}
                type="text" name="searchInput"
                id="searchInput"
                autoComplete="off"
              />

              {this.props.loading && this.props.loadingIndicator && this.props.loadingIndicator}

              {(this.state.open && this.props.suggestions.length > 0) &&
                <div className="ASI_SuggestionContainer" ref={this.scrollRef}>

                  <ul className="ASI_UL" >
                    {this.props.suggestions.map((item, index) => { /* extract label if the array items are not just strings for exameple (item)=>item.title */
                      const label: string = this.extractLabel(item);
                      return <li
                        className={`ASI_SuggestionItem ${index === this.state.selectedSuggestion ? 'ASI_Active' : ''}`}
                        onClick={(event) => this.handleSuggestClick(event, index, label)}
                        onMouseDown={(event) => event.preventDefault()}
                        key={`suggestion_${label}_${Math.random()}`}
                      >
                        {label}
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


