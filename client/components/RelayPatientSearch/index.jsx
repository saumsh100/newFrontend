
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { Input, InfiniteScroll } from '../library';
import Loader from '../Loader';
import RelayPatientFetcher from '../RelayPatientFetcher';
import PatientSuggestion from '../PatientSuggestion';
import { StyleExtender } from '../Utils/Themer';
import styles from './styles.scss';

const defaultState = {
  limit: 15,
  endCursor: '',
  lastSearch: '',
  totalCount: -1,
  isLoading: true,
  currValue: '',
  patients: [],
};

class PatientSearch extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.clearPatientsState = this.clearPatientsState.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
  }

  componentDidMount() {
    if (this.props.focusInputOnMount) {
      this.inputComponent.focus();
    }
  }

  clearPatientsState(props) {
    if (this.state.lastSearch !== props.search) {
      this.setState(prevState => ({
        patients: prevState.patients.length > 0 ? [] : prevState.patients,
        lastSearch: props.search,
        totalCount: 0,
        isLoading: true,
        endCursor: '',
      }));
    }
  }

  handleLoadMore(endCursor, patients, totalCount) {
    return () => {
      this.setState(prevState => ({
        endCursor,
        totalCount,
        isLoading: true,
        patients: uniqBy(prevState.patients.concat(patients), 'id'),
      }));
    };
  }

  scrollTo(index) {
    if (this.suggestionsNode) {
      this.suggestionsNode.scrollTop = index * 50;
    }
  }

  renderListFooterFactory(newTheme) {
    return (inputValue, text, isLoading = false) => (
      <div className={newTheme.totalCount}>
        <span
          className={classNames(newTheme.footerText, { [newTheme.bold]: isLoading })}
        >{`${text}`}</span>
        {isLoading ? <Loader /> : <span className={newTheme.bold}>{` ${inputValue}`}</span>}
      </div>
    );
  }

  render() {
    const { onChange, inputProps, theme } = this.props;
    const newTheme = StyleExtender(theme, styles);

    const renderListFooter = this.renderListFooterFactory(newTheme);

    const finalInputProps = Object.assign({ theme }, inputProps, {
      classStyles: classNames(inputProps.classStyles, styles.toInput),
    });

    const { currValue } = this.state;

    return (
      <Downshift
        onChange={onChange}
        onStateChange={debounce(({ inputValue }) => {
          if (typeof inputValue !== 'undefined') {
            this.setState({
              currValue: inputValue,
            });
          }
        }, 300)}
        onInputValueChange={this.clearList}
        itemToString={patient =>
          (patient === null ? '' : `${patient.firstName} ${patient.lastName}`)
        }
        render={({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
          <div className={newTheme.container}>
            <Input
              {...getInputProps({
                ...finalInputProps,
                onKeyDown: (event) => {
                  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    const offset = 1;
                    if (highlightedIndex - offset > 0) {
                      this.scrollTo(highlightedIndex - offset);
                    }
                  }
                },
              })}
              refCallBack={(node) => {
                this.inputComponent = node;
              }}
            />
            {isOpen && typeof currValue !== 'undefined' && currValue !== '' ? (
              <RelayPatientFetcher
                search={currValue}
                after={this.state.endCursor}
                handleSearchRequest={this.clearPatientsState}
                render={({ props, ...data }) => {
                  let hasNextPage = false;
                  let totalCount = this.state.totalCount;
                  let isLoading = this.state.isLoading;
                  let endCursor = '';
                  let results = [];

                  if (props !== null) {
                    ({ hasNextPage, endCursor } = props.accountViewer.patients.pageInfo);
                    results = props.accountViewer.patients.edges.map(v => v.node);
                    totalCount = props.accountViewer.patients.totalCount;
                    isLoading = false;
                  } else {
                    isLoading = true;
                  }

                  const patients = this.state.patients.concat(results);

                  return (
                    <div className={newTheme.suggestionsWrapper}>
                      {totalCount > 0 && (
                        <div
                          className={newTheme.suggestionsContainerOpen}
                          ref={(node) => {
                            this.suggestionsNode = node;
                          }}
                        >
                          <InfiniteScroll
                            className={newTheme.suggestionsList}
                            loadMore={this.handleLoadMore(endCursor, patients, totalCount)}
                            loader={<Loader />}
                            hasMore={hasNextPage}
                            initialLoad
                            useWindow={false}
                            threshold={50}
                            pageStart={0}
                          >
                            {patients.map((patient, index) => (
                              <PatientSuggestion
                                key={patient.id}
                                onKeyDown={this.handleKeyDown}
                                patient={patient}
                                index={index}
                                inputValue={currValue}
                                highlightedIndex={highlightedIndex}
                                getItemProps={getItemProps}
                                theme={theme}
                                {...data}
                              />
                            ))}
                          </InfiniteScroll>
                        </div>
                      )}
                      {isLoading
                        ? renderListFooter(currValue, 'Searching...', isLoading)
                        : renderListFooter(
                          currValue,
                          totalCount === 0
                            ? 'No results found for'
                            : `${totalCount} Patients found for the search`
                        )}
                    </div>
                  );
                }}
              />
            ) : (
              isOpen &&
              inputValue !== '' && (
                <div className={newTheme.suggestionsWrapper}>
                  {renderListFooter(currValue, 'Searching...', true)}{' '}
                </div>
              )
            )}
          </div>
        )}
      />
    );
  }
}

PatientSearch.propTypes = {
  onChange: PropTypes.func.isRequired,
  focusInputOnMount: PropTypes.bool,
  resetInputOnSelection: PropTypes.bool,
  inputProps: PropTypes.shape({
    id: PropTypes.string,
    placeholder: PropTypes.string,
    onBlur: PropTypes.func,
  }),
  theme: PropTypes.shape({
    container: PropTypes.string,
  }),
};

export default PatientSearch;
