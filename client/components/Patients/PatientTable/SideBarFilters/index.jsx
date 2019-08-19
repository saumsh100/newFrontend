
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import { Map } from 'immutable';
import { change, reset } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { Icon, Card, Button } from '../../../library';
import DemographicsForm from './Demographics';
import AppointmentsForm from './Appointments';
import PractitionersForm from './Practitioners';
import CommunicationsForm from './Communications';
import CommunicationsSettingsForm from './CommunicationsSettings';
import TouchpointsSettingsForm from './TouchpointsSettings';
import FollowUpsSettingsForm from './FollowUpsSettings';
import FilterTags from './FilterTags';
import FilterForm from './FilterForm';
import FilterBodyDisplay from './FilterBodyDisplay';
import { addFilter, removeFilter, removeAllFilters } from '../../../../reducers/patientTable';
import fetchEntities from '../../../../thunks/fetchEntities/fetchEntities';
import styles from './styles.scss';

const forms = flags => ({
  demographics: {
    validateForm: () => true,
    headerTitle: 'Demographics',
    formComponent: DemographicsForm,
    props: {},
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
    validateForm: () => true,
    headerTitle: 'Appointments',
    formComponent: AppointmentsForm,
    initialValues: {
      firstApptDate: '',
      lastApptDate: '',
      production: '',
      appointmentsCount: '',
      onlineAppointments: '',
    },
    props: {},
  },
  practitioners: {
    validateForm: () => true,
    headerTitle: 'Practitioners',
    formComponent: PractitionersForm,
    initialValues: { practitioner: '' },
  },
  communication: {
    validateForm: () => true,
    headerTitle: 'Communications',
    formComponent: flags['communication-settings-filter-form']
      ? CommunicationsSettingsForm
      : CommunicationsForm,
    initialValues: flags['communication-settings-filter-form']
      ? {
        recallCommunicationPreference: '',
        reminderCommunicationPreference: '',
        reviewCommunicationPreference: '',
        emailCommunicationPreference: '',
        smsCommunicationPreference: '',
        phoneCommunicationPreference: '',
      }
      : {
        lastReminderSent: '',
        lastRecareSent: '',
        reviews: '',
      },
    props: {},
  },
  reminders: {
    validateForm: ({ sentReminders }) => sentReminders.filter(value => !!value).length === 4,
    headerTitle: 'Reminders',
    formComponent: flags['communication-settings-filter-form'] && TouchpointsSettingsForm,
    props: { fieldName: 'sentReminders' },
    initialValues: {
      sentReminders: ['false', 'null', '', ''],
    },
  },
  recalls: {
    validateForm: ({ sentRecalls }) => sentRecalls.filter(value => !!value).length === 4,
    headerTitle: 'Recalls',
    formComponent: flags['communication-settings-filter-form'] && TouchpointsSettingsForm,
    props: { fieldName: 'sentRecalls' },
    initialValues: {
      sentRecalls: ['false', 'null', '', ''],
    },
  },
  followUps: {
    validateForm: ({ patientFollowUps }) => patientFollowUps.filter(value => !!value).length === 3,
    headerTitle: 'Follow-ups',
    formComponent: flags['communication-settings-filter-form'] && FollowUpsSettingsForm,
    props: {},
    initialValues: {
      patientFollowUps: ['false', '', ''],
    },
  },
});

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
    const { filterForms, flags } = this.props;

    const [form] = Object.entries(filterForms).find(([, value]) => {
      const hasValue = value.values && value.values[filter];
      return hasValue
        ? true
        : Object.keys(value.registeredFields)
          .map(v => v.split('.')[0])
          .includes(filter);
    });
    const selectedForm = forms(flags)[form];
    if (filterForms[form].values && filterForms[form].values[filter]) {
      this.props.change(form, filter, selectedForm.initialValues[filter]);
    }
    this.formHandler(
      {
        ...filterForms[form].values,
        [filter]: selectedForm.initialValues[filter],
      },
      selectedForm.validateForm,
    );
  }

  clearTags() {
    if (Object.keys(this.props.filters).length === 0) return;

    this.props.removeAllFilters();
    Object.keys(this.props.filterForms).map(form => this.props.reset(form));
    this.props.setFilterCallback();
  }

  formHandler(values, validateForm) {
    const parsedFilters = Object.entries(values)
      .filter(([, value]) => {
        if (Array.isArray(value)) {
          return value.filter(v => !!v).length > 1 && validateForm(values);
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
        if (!filtersToCompare[key] && key in values) {
          this.props.removeFilter(key);
        }
      });

      this.props.addFilter(parsedFilters);
      this.props.setFilterCallback(parsedFilters);
    }
  }

  render() {
    const { filters, flags, timezone } = this.props;
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
          {Object.entries(forms(flags))
            .filter(([, { formComponent }]) => formComponent)
            .map(([key, value], i) => (
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
                  formValueCallback={formValues => this.formHandler(formValues, value.validateForm)}
                >
                  <value.formComponent {...value.props} timezone={timezone} />
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
  removeAllFilters: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  flags: PropTypes.objectOf(PropTypes.any).isRequired,
  filters: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])),
  filterForms: PropTypes.objectOf(PropTypes.shape({ registeredFields: PropTypes.object }))
    .isRequired,
  timezone: PropTypes.string.isRequired,
};

SideBarFilters.defaultProps = { filters: new Map() };

const mapStateToProps = ({ patientTable, form, featureFlags, auth }) => {
  const flags = featureFlags.get('flags').toJS();
  const filterForms = Object.keys(form)
    .filter(key => Object.keys(forms(flags)).includes(key))
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: form[key],
      }),
      {},
    );

  const { limit, page, order, segment, ...filters } = patientTable.get('filters').toJS();

  return {
    timezone: auth.get('timezone'),
    filterForms,
    filters,
    flags,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addFilter,
      removeFilter,
      reset,
      removeAllFilters,
      change,
      fetchEntities,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SideBarFilters);
