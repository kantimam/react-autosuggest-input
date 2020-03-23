/**
 * @class ExampleComponent
 */

import * as React from 'react'


export type Props = { text: string }

export default class ExampleComponent extends React.Component<Props> {
  private scrollRef = React.createRef<HTMLDivElement>();
  state = {
    open: false,
    selectedSuggestion: 0,
    suggestions: [
      "hello",
      "world",
      "mr",
      "kungFlu"
    ],
    inputValue: '',

  }
  styles = {
    autoSuggestInput: {
      boxSizing: 'border-box' as 'border-box',
      width: '24rem',
      maxWidth: '100%',
      margin: '2rem auto'
    },
    inputForm:{

    },
    formFlexContainer: {
      width: '100%',
      display: 'flex',
    },
    inputContainer: {
      flex: '1',
      position: 'relative' as 'relative'
    },
    input: {
      width: '100%'
    },
    autoSuggestContainer: {
      width: '100%',
      position: 'absolute' as 'absolute',
      height: '10rem',
      overflowY: 'auto' as 'auto',
      overflowX: 'hidden' as 'hidden',
      border: '1px solid black'
    },
    suggestionsList: {
      listStyle: 'none',
      boxSizing: 'border-box' as 'border-box',
      padding: '0 0.2rem'
    }

  }

  componentDidMount() {
    let randomArr = new Array(60).fill(0).map(_ => Math.random());
    const noDoubles = Array.from(new Set(randomArr));
    this.setState({ suggestions: noDoubles })
  }

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ inputValue: event.target.value })

  openSuggestions = (): void => {
    !this.state.open && this.setState({ open: true, selectedSuggestion: 0 })
  }

  closeSuggestions = (): void => {
    this.state.open && this.setState({ open: false, selectedSuggestion: 0 })
  }

  handleKeyDown = (event: React.KeyboardEvent): void => {
    switch (event.keyCode) {
      case 40:
        this.selectNextSuggestion();
        break;
      case 38:
        this.selectPrevSuggestion();
        break;
      case 27:
        this.closeSuggestions();
        break;
    }
  }

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    this.state.open ?
      this.setState({ inputValue: this.state.suggestions[this.state.selectedSuggestion], open: false }) :
      console.log(this.state.inputValue);
  }

  selectNextSuggestion = (): void => {
    this.openSuggestions();
    this.state.selectedSuggestion === this.state.suggestions.length - 1 ?
      this.setState({ open: false }) :
      this.setState({ selectedSuggestion: this.state.selectedSuggestion + 1 }, () => this.updateScroll())
  }

  selectPrevSuggestion = (): void => {
    !this.state.open && this.openSuggestions();
    this.state.selectedSuggestion === 0 ?
      this.setState({ open: false }) :
      this.setState({ selectedSuggestion: this.state.selectedSuggestion - 1 }, () => this.updateScroll())
  }

  selectSuggestion = (index: Number, value: String): void => {
    if (event) event.preventDefault();
    this.setState({ inputValue: value, selectedSuggestion: index })
  }

  handleSuggestClick = (event: React.MouseEvent, index: Number, value: String) => {
    event.preventDefault();
    event.stopPropagation();
    this.selectSuggestion(index, value);
  }

  updateScroll = () => {
    if (this.scrollRef.current && this.scrollRef.current.scrollHeight) {
      const { clientHeight, scrollHeight, scrollTop } = this.scrollRef.current;
      const itemHeight = scrollHeight / (this.state.suggestions.length + 2);

      const currentItemPos = itemHeight * this.state.selectedSuggestion;

      if (currentItemPos + 2 * itemHeight > scrollTop + clientHeight || currentItemPos - itemHeight < scrollTop) {
        this.scrollRef.current.scrollTop = currentItemPos;
      }


    }
  }

  render() {

    const {
      text
    } = this.props
    return (
      <div style={this.styles.autoSuggestInput}>
        <form
          onSubmit={this.handleSubmit}
          style={this.styles.inputForm}
        >
          <label htmlFor="searchInput">
            {text}
          </label>
          <div style={this.styles.formFlexContainer}>
            <div style={this.styles.inputContainer}>

              <input
                value={this.state.inputValue}
                onChange={this.onInputChange}
                onFocus={this.openSuggestions}
                onBlur={this.closeSuggestions}
                onKeyDown={this.handleKeyDown}
                style={this.styles.input}
                type="text" name="searchInput"
                id="searchInput"
                autoComplete="off"
              />

              {this.state.open &&
                <div ref={this.scrollRef} style={this.styles.autoSuggestContainer}>

                  <ul style={this.styles.suggestionsList}>
                    {this.state.suggestions.map((item, index) =>
                      <li
                        onClick={(event) => this.handleSuggestClick(event, index, item)}
                        onMouseDown={(event) => event.preventDefault()}
                        key={`suggestion_${item}_${Math.random()}`}
                        style={index === this.state.selectedSuggestion ? { backgroundColor: 'lightgrey' } : { backgroundColor: 'white' }}
                      >
                        {item}
                      </li>
                    )}
                  </ul>

                </div>}

            </div>
            <input type="submit" value="SEARCH" />
          </div>


        </form>

      </div>
    )
  }
}


