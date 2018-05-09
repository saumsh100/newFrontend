
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Downshift from 'downshift';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { Input, InfiniteScroll } from '../library';
import Loader from '../Loader';
import RelayPatientFetcher from '../RelayPatientFetcher';
import PatientSuggestion from '../PatientSuggestion';
import { StyleExtender } from '../Utils/Themer';
import { setPatientRecentSearched } from '../../reducers/patientSearch';
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
    this.renderList = this.renderList.bind(this);
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

  /**
   * State reducer for downshift
   * @param {*} state current Downshift state
   * @param {*} changes incoming changes
   */
  handleDownshiftStateChange(state, changes) {
    console.log('downshift state', state);
    console.log('downshift changes', changes);
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
    return ({ props, error, ...data }) => {
      if (error) {
        console.error(error);
      }

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
        <div>
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
    };
  }

  /**
   * Factory function to create the footer component with the theme
   * @param {*} newTheme
   */
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
    const { onChange, inputProps, theme, recentSearchedPatients } = this.props;
    const newTheme = StyleExtender(theme, styles);

    const renderListFooter = this.renderListFooterFactory(newTheme);

    const finalInputProps = Object.assign({ theme }, inputProps, {
      classStyles: classNames(inputProps.classStyles, styles.toInput),
    });

    const { currValue } = this.state;

    return (
      <Downshift
        onChange={(patient) => {
          this.props.setPatientRecentSearched(patient);
          onChange(patient);
        }}
        stateReducer={this.handleDownshiftStateChange}
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
            <div className={newTheme.suggestionsWrapper}>
              {isOpen && typeof currValue !== 'undefined' && currValue !== '' ? (
                /**
                 * typed something and state is already updated
                 */
                <RelayPatientFetcher
                  search={currValue}
                  after={this.state.endCursor}
                  handleSearchRequest={this.clearPatientsState}
                  render={this.renderList({
                    newTheme,
                    currValue,
                    highlightedIndex,
                    getItemProps,
                    theme,
                    renderListFooter,
                    recentSearchedPatients,
                  })}
                />
              ) : (
                /**
                 * typed something but relay ain't updated the state yet
                 */
                isOpen && inputValue !== '' && renderListFooter(currValue, 'Searching...', true)
              )}
              {recentSearchedPatients.length > 0 && (
                /**
                 * render recent searches if has any in the props
                 */
                <div className={newTheme.recentPatientsWrapper}>
                  <div className={newTheme.recentPatientsTitle}>Recent patients</div>
                  {recentSearchedPatients.map((patient, index) => (
                    <PatientSuggestion
                      key={patient.id}
                      patient={patient}
                      index={index}
                      getItemProps={getItemProps}
                      theme={newTheme}
                    />
                  ))}
                </div>
              )}
            </div>
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
  recentSearchedPatients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      ccId: PropTypes.string,
      pmsId: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      birthDate: PropTypes.string,
      avatarUrl: PropTypes.string,
      lastApptDate: PropTypes.string,
    })
  ),
  setPatientRecentSearched: PropTypes.func,
};

const mapStateToProps = ({ patientSearch }) => ({
  recentSearchedPatients: patientSearch.get('recentSearchedPatients').toArray(),
});

const mapActionsToProps = dispatch => bindActionCreators({ setPatientRecentSearched }, dispatch);

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(PatientSearch);
