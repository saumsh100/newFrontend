
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { isHub } from '../../util/hub';
import { Input, InfiniteScroll } from '../library';
import Loader from '../Loader';
import PatientSuggestion from '../PatientSuggestion';
import { StyleExtender } from '../Utils/Themer';
import composeSearchQuery from './composeSearchQuery';
import composeAddPatientSearchMutation from './composeAddPatientSearchMutation';
import FetchPatients from './fetchPatients';
import FetchPatientSearches from './fetchPatientSearches';
import AddPatientSearch from './addPatientSearch';
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

    this.suggestionsNode = createRef();
    this.inputComponent = createRef();
    this.updateStateWithData = this.updateStateWithData.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.clearPatientsState = this.clearPatientsState.bind(this);
    this.handleListKeyDown = this.handleListKeyDown.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.renderList = this.renderList.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  /**
   * set the focus to the input on mount
   */
  componentDidMount() {
    if (this.props.focusInputOnMount) {
      this.inputComponent.current.focus();
    }
  }

  /**
   * factory function to handle the list key down event
   * @param {*} highlightedIndex
   */
  handleListKeyDown(highlightedIndex) {
    const { patients } = this.state;
    const downOffset = 1;
    const upOffset = 3;
    const offsetLength = patients.length - downOffset;
    return (event) => {
      if (event.key === 'ArrowDown') {
        this.scrollTo(highlightedIndex >= offsetLength ? 0 : highlightedIndex - downOffset);
      }

      if (event.key === 'ArrowUp') {
        this.scrollTo(highlightedIndex <= 0 ? offsetLength : highlightedIndex - upOffset);
      }
    };
  }

  /**
   * scroll the list to an index with offset
   */
  scrollTo(index) {
    if (this.suggestionsNode) {
      this.suggestionsNode.current.scrollTop = index * (isHub() ? 70 : 50);
    }
  }

  /**
   * Clear the state if a new search is made
   * @param {*} search
   */
  clearPatientsState({ search }) {
    if (this.state.lastSearch !== search) {
      this.setState(() => ({
        lastSearch: search,
        currValue: '',
        patients: [],
        totalCount: 0,
        isLoading: true,
        endCursor: '',
      }));
    }
  }

  /**
   * load handler for InfiniteScroll
   */
  handleLoadMore() {
    this.setState({ isLoading: true }, () => {
      const { currValue, endCursor } = this.state;
      this.props
        .fetchPatients({
          search: currValue,
          after: endCursor,
        })
        .then(this.updateStateWithData(currValue));
    });
  }

  /**
   * factory function to update the state with the promise data return
   * @param {*} inputValue
   * @returns {function}
   */
  updateStateWithData(inputValue) {
    return ({ data }) =>
      this.setState((prevState) => {
        const { currValue } = prevState;
        if (inputValue !== currValue || !data) return null;
        const results = data.accountViewer.patients.edges.map(v => v.node);

        return {
          isLoading: false,
          hasNextPage: data.accountViewer.patients.pageInfo.hasNextPage,
          endCursor: data.accountViewer.patients.pageInfo.endCursor,
          totalCount: data.accountViewer.patients.totalCount,
          results,
          patients:
            inputValue === currValue ? uniqBy(prevState.patients.concat(results), 'id') : results,
        };
      });
  }

  /**
   * handles the state change of the downshift input
   */
  handleStateChange() {
    return debounce(({ inputValue }) => {
      if (typeof inputValue !== 'undefined') {
        if (inputValue === '') {
          this.clearPatientsState({ search: this.state.currValue });
        } else {
          this.setState(
            {
              isLoading: true,
              currValue: inputValue,
              patients: [],
            },
            () =>
              this.props
                .fetchPatients({ search: inputValue })
                .then(this.updateStateWithData(inputValue)),
          );
        }
      }
    }, 300);
  }

  /**
   * State reducer for downshift
   * @param {*} state current Downshift state
   * @param {*} changes incoming changes
   */
  handleDownshiftStateReducer(state, changes) {
    switch (changes.type) {
      /**
       * do not clear the state on blur and mouseup
       */
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.mouseUp:
        return {
          ...changes,
          inputValue: state.inputValue,
          isOpen: state.isOpen,
          highlightedIndex: state.highlightedIndex,
        };
      default:
        return changes;
    }
  }

  /**
   * Render function for the relay query renderer
   * returns a function to be used as render prop
   */
  renderList({ newTheme, currValue, highlightedIndex, getItemProps, theme, renderListFooter }) {
    const { hasNextPage, totalCount, isLoading, patients } = this.state;

    return (
      <div>
        {totalCount > 0 && (
          <div className={newTheme.suggestionsContainerOpen} ref={this.suggestionsNode}>
            <InfiniteScroll
              className={newTheme.suggestionsList}
              loadMore={this.handleLoadMore}
              loader={<Loader key={0} />}
              hasMore={!isLoading && hasNextPage}
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
                  getItemProps={getItemProps({ id: patient.id,
                    item: patient })}
                  theme={theme}
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
              : `${totalCount} Patients found for the search`,
          )}
      </div>
    );
  }

  /**
   * render the options list
   * based on the current state of the dropdown represented on the params below
   * @param {boolean} displayList typed something and state is already updated
   * @param {boolean} displaySearching typed something but relay ain't updated the state yet
   * @param {*} suggestionsListProps args needed for this.renderList
   */
  renderSuggestionList({ displayList, displaySearching, ...suggestionsListProps }) {
    const { renderListFooter, currValue } = suggestionsListProps;
    return displayList
      ? this.renderList(suggestionsListProps)
      : displaySearching && renderListFooter(currValue, 'Searching...', true);
  }

  /**
   * Factory function to create the footer component with the theme
   * @param {*} newTheme
   */
  renderListFooterFactory(newTheme) {
    return (inputValue, text, isLoading = false) => (
      <div className={newTheme.totalCount}>
        <span className={classNames(newTheme.footerText, { [newTheme.bold]: isLoading })}>
          {`${text}`}
        </span>
        {isLoading ? <Loader /> : <span className={newTheme.bold}>{` ${inputValue}`}</span>}
      </div>
    );
  }

  render() {
    const { onChange, inputProps, theme, searchedPatients, hideRecentSearch, context } = this.props;
    const newTheme = StyleExtender(theme, styles);

    const renderListFooter = this.renderListFooterFactory(newTheme);

    const finalInputProps = {
      theme,
      ...inputProps,
      classStyles: classNames(inputProps.classStyles, styles.toInput),
    };

    const { currValue } = this.state;

    return (
      <Downshift
        onChange={(patient) => {
          this.props.setPatientSearched(patient, context);
          onChange(patient);
        }}
        stateReducer={this.handleDownshiftStateReducer}
        onStateChange={this.handleStateChange()}
        onInputValueChange={this.clearList}
        itemToString={patient =>
          (patient === null ? '' : `${patient.firstName} ${patient.lastName}`)
        }
        render={({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => {
          const displayList = isOpen && typeof currValue !== 'undefined' && currValue !== '' && inputValue !== '';
          const displaySearching = isOpen && inputValue !== '';
          const suggestionsListProps = {
            newTheme,
            currValue,
            highlightedIndex,
            getItemProps,
            theme,
            renderListFooter,
            searchedPatients,
          };
          return (
            <div className={newTheme.container}>
              <Input
                {...getInputProps({
                  ...finalInputProps,
                  onKeyDown: this.handleListKeyDown(highlightedIndex),
                })}
                refCallBack={this.inputComponent}
              />
              <div className={newTheme.suggestionsWrapper}>
                {this.renderSuggestionList({
                  displayList,
                  displaySearching,
                  ...suggestionsListProps,
                })}
                {!hideRecentSearch && searchedPatients.length > 0 && inputValue === '' && (
                  // render recent searches if has any in the props
                  <div className={newTheme.recentPatientsWrapper}>
                    <div className={newTheme.recentPatientsTitle}>Recent patients</div>
                    {searchedPatients.map((patient, index) => (
                      <PatientSuggestion
                        key={patient.id}
                        patient={patient}
                        index={index}
                        getItemProps={getItemProps({ id: patient.id,
                          item: patient })}
                        theme={newTheme}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
    );
  }
}

PatientSearch.propTypes = {
  onChange: PropTypes.func.isRequired,
  focusInputOnMount: PropTypes.bool,
  resetInputOnSelection: PropTypes.bool,
  hideRecentSearch: PropTypes.bool,
  inputProps: PropTypes.shape({
    id: PropTypes.string,
    placeholder: PropTypes.string,
    onBlur: PropTypes.func,
  }),
  theme: PropTypes.shape({ container: PropTypes.string }),
  searchedPatients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      ccId: PropTypes.string,
      pmsId: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      birthDate: PropTypes.string,
      avatarUrl: PropTypes.string,
      lastApptDate: PropTypes.string,
    }),
  ),
  setPatientSearched: PropTypes.func,
  fetchPatients: PropTypes.func.isRequired,
  context: PropTypes.string,
};

PatientSearch.defaultProps = {
  context: 'topBar',
  focusInputOnMount: false,
  inputProps: null,
  resetInputOnSelection: false,
  searchedPatients: [],
  setPatientSearched: () => {},
  theme: null,
  hideRecentSearch: true,
};

const GraphQLPatientSearch = ({ context, ...props }) => {
  const setSearchData = refetch => data => refetch(composeSearchQuery(data));
  const addNewPatientSearch = update => patient =>
    update({ variables: { input: composeAddPatientSearchMutation(patient, context) } });

  return (
    <FetchPatientSearches context={context}>
      {({ data }) => {
        if (!data) return null;
        const recentSearches = data.accountViewer
          ? data.accountViewer.patientSearches.edges.map(v => v.node.patient).filter(p => !!p)
          : [];
        return (
          <FetchPatients>
            {({ refetch }) => (
              <AddPatientSearch>
                {addPatientSearch => (
                  <PatientSearch
                    {...props}
                    context={context}
                    searchedPatients={recentSearches}
                    fetchPatients={setSearchData(refetch)}
                    setPatientSearched={addNewPatientSearch(addPatientSearch)}
                  />
                )}
              </AddPatientSearch>
            )}
          </FetchPatients>
        );
      }}
    </FetchPatientSearches>
  );
};

GraphQLPatientSearch.propTypes = { context: PropTypes.string.isRequired };

export default GraphQLPatientSearch;
