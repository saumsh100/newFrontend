
import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { Provider } from 'react-redux';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import { Input, Icon } from '../';
import theme from './theme.scss';


const renderSuggestion = suggestion => {
  const display = suggestion.display || `${suggestion.firstName} ${suggestion.lastName}` || suggestion.name;
  return (<div data-test-id={`${suggestion.name}Suggestion`}>
    {display}
  </div>);
};

class AutoCompleteForm extends Component {
  constructor() {
    super();

    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.displayField = this.displayField.bind(this);
    this.state = {
      suggestions: [],
    };

    this.getSuggestions = debounce(this.onSuggestionsFetchRequested, 300);
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this);
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
    return this.props.getSuggestions(value)
      .then((value2) => {
        this.setState({
          suggestions: value2,
        });
      });
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  displayField(props) {
    delete props.className;

    if (props.className) {
      props.className = this.props.className;
    }

    props.label = this.props.label;
    props.classStyles = this.props.classStyles;
    props.theme = this.props.theme;

    props.value = this.props.value;
    props.ref = this.props.refCallBack;


    return (
      <Input {...props} ref={null} refCallBack={this.props.refCallBack} />
    );
  }

  renderSuggestionsContainer({ containerProps, children }) {
    const RenderComponent = this.props.suggestionsContainerComponent;

    return RenderComponent ? (
      <div {... containerProps}>
        {children}
        <RenderComponent />
      </div>) : <div {...containerProps}>{children}</div>
  }

  render() {
    const { suggestions } = this.state;

    const newProps = omit(this.props, ['value', 'theme', 'suggestionsContainerComponent']);
    // Autosuggest will pass through all these props to the input element.
    // Finally, render it!

    return (
      <div className={theme.outerContainer}>
        <Autosuggest
          theme={theme}
          suggestions={suggestions}
          renderInputComponent={this.displayField}
          onSuggestionsFetchRequested={this.getSuggestions}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          renderSuggestion={renderSuggestion}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          {...newProps}
        />
      </div>
    );
  }
}


AutoCompleteForm.propTypes = {
  label: PropTypes.string,
  classStyles: PropTypes.object,
  className: PropTypes.object,
  theme: PropTypes.object,
  suggestionsContainerComponent: PropTypes.component,
};

export default AutoCompleteForm;
