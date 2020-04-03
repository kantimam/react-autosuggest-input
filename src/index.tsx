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
  onOpen?(): any,
  onClose?(): any,
  setValue(InputString: string): void,
  onSubmit(inputString: string): any,
  onChange?(inputString: string): any,
  onSuggestionSelect?(inputString: string): any,  // using onChange to fire api calls usually but dont want to call api again after picking suggestion
  onRestore?(inputString: string): any,
  onReset?(): any,
  loading?: boolean,
  loadingIndicator?: React.ReactElement,
  deleteIcon?: React.ReactElement,
  forceClosed?: boolean,
  placeholder: string
}

export type StateTypes = {
  tempValue: string,
  open: boolean,
  selectedSuggestion: number,
}

export default class AutoSuggestInput extends React.Component<Props> {
  static defaultProps = {
    labelExtractor: (_: object): string => "labelExtractor required",
    suggestions: [],
    placeholder: ""
  }

  private scrollRef = React.createRef<HTMLDivElement>();
  private inputRef = React.createRef<HTMLInputElement>();
  readonly state: StateTypes = {
    tempValue: "",
    open: false,
    selectedSuggestion: -1,

  }

  componentDidUpdate(prevProps: any) {
    /* if it was loading before and no longer is chances are there are new suggestions to see :) */
    if (!this.props.loading && this.props.suggestions !== prevProps.suggestions) {
      this.setState({ selectedSuggestion: -1 })
      this.openSuggestions();
    }
  }


  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ tempValue: "", selectedSuggestion: -1 });
    this.props.setValue(event.target.value);
    this.props.onChange && this.props.onChange(event.target.value);
  }

  openSuggestions = (): void => {
    if (!this.props.forceClosed && !this.state.open && this.props.suggestions.length) {
      this.setState({ open: true }, () => {
        this.inputRef.current!.focus()
        this.updateScroll();
      })
      this.props.onOpen && this.props.onOpen();
    }
  }

  closeSuggestions = (): void => {
    if (this.state.open) {
      this.setState({ open: false, tempValue: "", selectedSuggestion: -1 })
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
        if (!this.state.open || !this.state.tempValue) return;
        /* if enter is pressed and suggestions are open dont submit yet */
        event.preventDefault();
        /* key down and up only hovers the selected and stores it in tempValue. By hitting
        enter the tempValue will finally be set the value */
        this.props.setValue(this.state.tempValue);
        this.setState({ tempValue: "" });
        this.props.onSuggestionSelect && this.props.onSuggestionSelect(this.props.value);
        this.closeSuggestions();
        break;


    }
  }


  handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    this.props.onSubmit(this.props.value);
  }


  restorePrev = () => {
    /* if there is a restore value you can go back to your initial input */
    if (!this.state.tempValue) return
    this.setState({ tempValue: "" });
    this.props.onRestore && this.props.onRestore(this.props.value);
  }

  setInputValue = (value: string): void => {
    /* used when the value was forcefully filled not by just typing */
    this.props.setValue(value)
  }

  resetInputValue = (): void => {
    this.setState({ tempValue: "" });
    this.setInputValue("");
    this.props.onReset && this.props.onReset();
    this.closeSuggestions();
  }

  selectNextSuggestion = (): void => {
    if (!this.state.open) return this.openSuggestions();

    const nextSuggestion = (this.state.selectedSuggestion + 1) % this.props.suggestions.length;

    const suggestionData = this.props.suggestions[nextSuggestion];
    if (suggestionData) this.setState({ selectedSuggestion: nextSuggestion, tempValue: this.extractLabel(suggestionData) }, () => this.updateScroll())
  }

  selectPrevSuggestion = (): void => {
    if (!this.state.open) return this.openSuggestions();

    const prevSuggestion = this.state.selectedSuggestion <= 0 ?
      this.props.suggestions.length - 1 :
      this.state.selectedSuggestion - 1;

    const suggestionData = this.props.suggestions[prevSuggestion];
    if (suggestionData) this.setState({ selectedSuggestion: prevSuggestion, tempValue: this.extractLabel(suggestionData) }, () => this.updateScroll())

  }


  selectSuggestion = (index: number, value: string): void => {
    if (event) event.preventDefault();
    this.setState({ selectedSuggestion: index })
    /* store prev value for the case that user pushes esc for restore */
    this.setInputValue(value)
  }

  handleSuggestClick = (event: React.MouseEvent, index: number, value: string) => {
    event.preventDefault();
    event.stopPropagation();
    this.selectSuggestion(index, value);
    this.props.onSuggestionSelect && this.props.onSuggestionSelect(value);
    this.closeSuggestions();
  }

  updateScroll = (): void => {
    /* only do stuff if the container is scrollable */
    if (this.scrollRef.current && this.scrollRef.current.scrollHeight) {
      const { clientHeight, scrollHeight, scrollTop } = this.scrollRef.current;
      const itemHeight = scrollHeight / (this.props.suggestions.length);

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
    else if (typeof item === 'object') return this.props.labelExtractor(item) || "undefined";
    else return "invalid type";
  }

  render() {
    return (
      <form
        className={`autoSuggestInput ${this.state.open ? 'ASI_Open' : ''} ${this.props.className ? this.props.className : ''}`}
        onSubmit={this.handleSubmit}
      >
        {this.props.label ?
          <label htmlFor="searchInput" className="ASI_Label">
            {this.props.label}
          </label> :
          null
        }

        <div className="ASI_FlexContainer  ASI_Border">
          <div className="ASI_InputContainer">

            <input
              ref={this.inputRef}
              className="ASI_Field"
              value={this.state.tempValue || this.props.value}
              onChange={this.onInputChange}
              onFocus={this.openSuggestions}
              onBlur={this.closeSuggestions}
              onKeyDown={this.handleKeyDown}
              onClick={this.openSuggestions}
              type="text" name="searchInput"
              id="searchInput"
              autoComplete="off"
              placeholder={this.props.placeholder}
            />

            {(this.props.loading && this.props.loadingIndicator) ?
              <SquareWrapper>
                {this.props.loadingIndicator}
              </SquareWrapper> :

              (this.props.value && this.props.deleteIcon) &&
              <SquareWrapper onClick={this.resetInputValue}>
                {this.props.deleteIcon}
              </SquareWrapper>
            }

          </div>
          <input className="ASI_Submit" type="submit" value="SEARCH" />
        </div>
        {(this.state.open && this.props.suggestions.length > 0) &&
          <div className="ASI_SuggestionContainer ASI_Border">
            <div className="ASI_SuggestionInner" ref={this.scrollRef}>

              <ul className="ASI_UL" >
                {this.props.suggestions.map((item, index) => {
                  /* extract label if the array items are not just strings for exameple (item)=>item.title */
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
          </div>
        }
      </form>
    )
  }
}


export type WrapperProps = {
  children: React.ReactElement | undefined
  onClick?(): void
}

export type LoadingState = {
  size: number
}

export class SquareWrapper extends React.Component<WrapperProps, LoadingState> {
  readonly state: LoadingState = {
    size: 0
  }
  onRef = (element: HTMLDivElement): void => {
    if (element) {
      const height: number = element.clientHeight;
      this.setState({ size: height })
    }
  }
  onClick = (): void => {
    this.props.onClick && this.props.onClick();
  }

  render() {
    return (
      <div
        ref={this.onRef}
        onClick={this.onClick}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: `${this.state.size}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'default'
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
