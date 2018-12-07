
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import { Map } from 'immutable';
import { change } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { Icon, Card, Button } from '../../../library';
import DemographicsForm from './Demographics';
import AppointmentsForm from './Appointments';
import PractitionersForm from './Practitioners';
import CommunicationsForm from './Communications';
import FilterTags from './FilterTags';
import FilterForm from './FilterForm';
import FilterBodyDisplay from './FilterBodyDisplay';
import { addFilter, removeFilter } from '../../../../reducers/patientTable';
import fetchEntities from '../../../../thunks/fetchEntities/fetchEntities';
import styles from './styles.scss';

const forms = {
  demographics: {
    headerTitle: 'Demographics',
    formComponent: DemographicsForm,
    initialValues: {
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      city: '',
      status: '',
    },
  },
  appointments: {
    headerTitle: 'Appointments',
    formComponent: AppointmentsForm,
    initialValues: {
      firstAppointment: '',
      lastAppointment: '',
      production: '',
      appointmentsCount: '',
      onlineAppointments: '',
    },
  },
  practitioners: {
    headerTitle: 'Practitioners',
    formComponent: PractitionersForm,
    initialValues: { practitioner: '' },
  },
  communication: {
    headerTitle: 'Communications',
    formComponent: CommunicationsForm,
    initialValues: {
      lastReminderSent: '',
      lastRecareSent: '',
      reviews: '',
    },
  },
};

class SideBarFilters extends Component {
  constructor(props) {
    super(props);

    this.state = { expandedForm: '' };

    this.displayFilter = this.displayFilter.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.clearTags = this.clearTags.bind(this);
    this.formHandler = debounce(this.formHandler.bind(this), 500);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'practitioners' });
  }

  displayFilter(index, isOpen) {
    this.setState(() => ({ expandedForm: isOpen ? '' : index }));
  }

  removeTag(filter) {
    const { filterForms } = this.props;

    const [form] = Object.entries(filterForms).find(([, value]) => {
      const hasValue = value.values && value.values[filter];
      return hasValue
        ? true
        : Object.keys(value.registeredFields)
          .map(v => v.split('.')[0])
          .includes(filter);
    });

    if (filterForms[form].values && filterForms[form].values[filter]) {
      this.props.change(form, filter, '');
    } else {
      this.props.setFilterCallback();
    }
  }

  clearTags() {
    if (Object.keys(this.props.filters).length === 0) return;

    Object.keys(this.props.filters).forEach(filter => this.removeTag(filter));
  }

  formHandler(values) {
    const parsedFilters = Object.entries(values)
      .filter(([, value]) => {
        if (Array.isArray(value)) {
          return value.filter(v => !!v).length > 1;
        }
        return value.trim() !== '';
      })
      .reduce(
        (parsed, [filterKey, filterValue]) => ({
          ...parsed,
          [filterKey]: Array.isArray(filterValue) ? filterValue : filterValue.trim(),
        }),
        { page: 0 },
      );
    const { page, ...filtersToCompare } = parsedFilters;
    if (!isEqual(this.props.filters, filtersToCompare)) {
      Object.keys(this.props.filters).forEach((key) => {
        if (!filtersToCompare[key]) {
          this.props.removeFilter(key);
        }
      });
      this.props.addFilter(parsedFilters);
      this.props.setFilterCallback(parsedFilters);
    }
  }

  render() {
    const { filters } = this.props;
    const { expandedForm } = this.state;
    const hasFiltersOn = filters && filters.size > 0;
    return (
      <Card className={styles.sideBar}>
        <div className={styles.header}>
          <div className={styles.header_icon}>
            <Icon icon="filter" size={1.5} />
          </div>
          <div className={styles.header_text}> Filter </div>
          <Button
            className={classnames({
              [styles.header_clearText]: true,
              [styles.header_clearTextDark]: hasFiltersOn,
            })}
            onClick={this.clearTags}
          >
            Clear All
          </Button>
        </div>

        <FilterTags filterTags={filters} removeTag={this.removeTag} />

        <div className={styles.filtersContainer}>
          {Object.entries(forms).map(([key, value], i) => (
            <FilterBodyDisplay
              key={key}
              formName={key}
              index={i}
              isOpen={expandedForm === key}
              headerTitle={value.headerTitle}
              displayFilter={this.displayFilter}
            >
              <FilterForm
                initialValues={value.initialValues}
                formName={key}
                formValueCallback={this.formHandler}
              >
                <value.formComponent />
              </FilterForm>
            </FilterBodyDisplay>
          ))}
        </div>
      </Card>
    );
  }
}

SideBarFilters.propTypes = {
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  setFilterCallback: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  filters: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])),
  filterForms: PropTypes.objectOf(PropTypes.shape({ registeredFields: PropTypes.object }))
    .isRequired,
};

SideBarFilters.defaultProps = { filters: new Map() };

const mapStateToProps = ({ patientTable, form }) => {
  const filterForms = Object.keys(form)
    .filter(key => Object.keys(forms).includes(key))
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: form[key],
      }),
      {},
    );

  const { limit, page, order, segment, ...filters } = patientTable.get('filters').toJS();

  return {
    filterForms,
    filters,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addFilter,
      removeFilter,
      change,
      fetchEntities,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SideBarFilters);
