
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import classNames from 'classnames';
import _ from 'lodash';
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
  patients: [],
};

class PatientSearch extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.clearPatientsState = this.clearPatientsState.bind(this);
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
        endCursor: '',
      }));
    }
  }

  handleLoadMore(endCursor, patients) {
    return () => {
      this.setState(prevState => ({
        endCursor,
        patients: _.uniqBy(prevState.patients.concat(patients), 'id'),
      }));
    };
  }

  render() {
    const { onChange, inputProps, theme } = this.props;
    const newTheme = StyleExtender(theme, styles);

    const finalInputProps = Object.assign({ theme }, inputProps, {
      classStyles: classNames(inputProps.classStyles, styles.toInput),
    });

    return (
      <Downshift
        onChange={onChange}
        onInputValueChange={this.clearList}
        itemToString={patient =>
          (patient === null ? '' : `${patient.firstName} ${patient.lastName}`)
        }
        render={({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
          <div className={newTheme.container}>
            <Input
              {...getInputProps({
                ...finalInputProps,
              })}
              refCallBack={(node) => {
                this.inputComponent = node;
              }}
            />
            {isOpen &&
              inputValue !== '' && (
              <RelayPatientFetcher
                search={inputValue}
                after={this.state.endCursor}
                handleSearchRequest={this.clearPatientsState}
                render={({ props, ...data }) => {
                  let hasNextPage = false;
                  let endCursor = '';
                  let results = [];

                  if (props !== null) {
                    ({ hasNextPage, endCursor } = props.accountViewer.patients.pageInfo);
                    results = props.accountViewer.patients.edges.map(v => v.node);
                  }

                  const patients = this.state.patients.concat(results);

                  return (
                    <div className={newTheme.suggestionsContainerOpen}>
                      <InfiniteScroll
                        className={newTheme.suggestionsList}
                        loadMore={this.handleLoadMore(endCursor, patients)}
                        loader={<Loader />}
                        hasMore={hasNextPage}
                        initialLoad
                        useWindow={false}
                        threshold={1}
                        pageStart={0}
                      >
                        {patients.map((patient, index) => (
                          <PatientSuggestion
                            key={patient.id}
                            patient={patient}
                            index={index}
                            inputValue={inputValue}
                            highlightedIndex={highlightedIndex}
                            getItemProps={getItemProps}
                            theme={theme}
                            {...data}
                          />
                        ))}
                      </InfiniteScroll>
                    </div>
                  );
                }}
              />
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
