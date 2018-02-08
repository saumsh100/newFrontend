
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Icon, Card } from '../../../library';
import Demographics from './Demographics';
import Appointments from './Appointments';
import Practitioners from './Practitioners';
import Communications from './Communications';
import FilterTags from './FilterTags';
import SearchPatientTable from './SearchPatientTable/index';
import styles from './styles.scss';

class SideBarFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openFilters: [false, false, false, false],
    };

    this.displayFilter = this.displayFilter.bind(this);
    this.handleDemographics = this.handleDemographics.bind(this);
    this.handleAppointments = this.handleAppointments.bind(this);
    this.handlePractitioners = this.handlePractitioners.bind(this);
    this.handleCommunications = this.handleCommunications.bind(this);
    this.removeTag = this.removeTag.bind(this);
    this.clearTags = this.clearTags.bind(this);
  }

  displayFilter(index) {
    const {
      openFilters,
    } = this.state;

    const newState = openFilters.map((filter, filterIndex) => {
      if (filterIndex !== index) {
        return false;
      }
      return !filter;
    });

    this.setState({
      openFilters: newState,
    });
  }

  removeTag(filter) {
    const {
      arrayRemoveAll,
      removeFilter,
    } = this.props;

    arrayRemoveAll(filter.formName, filter.formSection);

    removeFilter(filter.indexFunc);
  }

  clearTags() {
    this.props.clearFilters();
    this.setState({
      filterTags: Map(),
    });
  }

  handleDemographics(values) {
    const {
      addFilter,
      removeFilter
    } = this.props;

    let keys = Object.keys(values);

    let setFilter = 0;
    const batchFilters = [];

    keys = keys.filter((key) => {
      if (key === 'firstName' && values[key].length === 0) {
        removeFilter(0);
      } else if (key === 'lastName' && values[key].length === 0) {
        removeFilter(1);
      }

      if (values[key] && values[key].length !== 0) {
        return key;
      }
    });

    keys.forEach((key) => {
      if (key === 'firstName' && values[key].length === 1 && values[key] !== '') {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 0,
          formName: 'demographics',
          formSection: key,
          key,
          data: values[key],
          tag: 'Search First Name',
        });
      }

      if (key === 'lastName' && values[key].length === 1 && values[key] !== '') {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 1,
          formName: 'demographics',
          formSection: key,
          key,
          data: values[key],
          tag: 'Search Last Name',
        });
      }

      if (key === 'age' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 2,
          formName: 'demographics',
          formSection: key,
          key,
          data: values[key],
          tag: 'Age',
          intensive: true,
        });
      }
      if (key === 'gender' && values[key].length === 1) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 3,
          data: values[key],
          formName: 'demographics',
          formSection: key,
          key,
          tag: 'Gender',
          intensive: true,
        });
      }
      if (key === 'city' && values[key].length === 1) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 4,
          formName: 'demographics',
          formSection: key,
          data: values[key],
          key,
          tag: 'City',
          intensive: true,
        });
      }
    });

    if (keys.length === setFilter && keys.length > 0) {
      batchFilters.forEach((filter) => {
        addFilter(filter);
      });
    }
  }

  handleAppointments(values) {
    const {
      addFilter,
    } = this.props;

    let keys = Object.keys(values);

    let setFilter = 0;
    const batchFilters = [];

    keys = keys.filter((key) => {
      if (values[key] && values[key].length !== 0) {
        return key;
      }
    });

    keys.forEach((key) => {
      if (key === 'firstAppointment' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 5,
          formName: 'appointments',
          formSection: key,
          data: values[key],
          key: 'firstApptDate',
          tag: 'First Appt',
          intensive: false,
        });
      }
      if (key === 'lastAppointment' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 6,
          data: values[key],
          formName: 'appointments',
          formSection: key,
          key: 'lastApptDate',
          tag: 'Last Appt',
          intensive: false,
        });
      }
      if (key === 'appointmentsCount' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 7,
          formName: 'appointments',
          formSection: key,
          data: values[key],
          tag: 'No of Appts',
          intensive: true,
        });
      }
      if (key === 'production' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 8,
          formName: 'appointments',
          formSection: key,
          data: values[key],
          tag: 'Production',
          intensive: true,
        });
      }
      if (key === 'onlineAppointments' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 9,
          formName: 'appointments',
          formSection: key,
          data: values[key],
          tag: 'Online Appts',
          intensive: true,
        });
      }
    });

    if (keys.length === setFilter && keys.length > 0) {
      batchFilters.forEach((filter) => {
        addFilter(filter);
      });
    }
  }

  handlePractitioners(values) {
    const {
      addFilter,
    } = this.props;

    let keys = Object.keys(values);
    keys = keys.filter((key) => {
      if (values[key] && values[key].length !== 0) {
        return key;
      }
    });
    keys.forEach((key) => {
      if (key && values[key].length === 1) {
        const pracObj = {
          indexFunc: 10,
          data: values[key],
          formName: 'practitioners',
          formSection: 'practitioners',
          tag: 'Practitioners',
          intensive: true,
        };
        addFilter(pracObj);
      }
    });
  }

  handleCommunications(values) {
    const {
      addFilter,
    } = this.props;

    let setFilter = 0;
    let keys = Object.keys(values);

    const batchFilters = [];

    keys = keys.filter((key) => {
      if (values[key] && values[key].length !== 0) {
        return key;
      }
    });

    keys.forEach((key) => {
      if (key === 'remindersEmail' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 11,
          data: values[key],
          formName: 'communications',
          formSection: key,
          tag: 'Reminders Email',
          key: 'phone',
        });
      }
      if (key === 'remindersSMS' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 12,
          data: values[key],
          formName: 'communications',
          formSection: key,
          tag: 'Reminders SMS',
          key: 'sms',
        });
      }
      if (key === 'remindersPhone' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 13,
          data: values[key],
          formName: 'communications',
          formSection: key,
          tag: 'Reminders Phone',
          key: 'phone',
        });
      }
      if (key === 'recaresEmail' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 14,
          data: values[key],
          formName: 'communications',
          formSection: key,
          tag: 'Recares Email',
          key: 'phone',
        });
      }
      if (key === 'recaresSMS' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 15,
          data: values[key],
          formName: 'communications',
          formSection: key,
          tag: 'Recares SMS',
          key: 'sms',
        });
      }
      if (key === 'recaresPhone' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 16,
          data: values[key],
          formName: 'communications',
          formSection: key,
          tag: 'Recares Phone',
          key: 'phone',
        });
      }
      if (key === 'lastReminderSent' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 17,
          data: values[key],
          formName: 'communications',
          formSection: key,
          tag: 'Last Reminder Sent',
          intensive: true,
        });
      }
      if (key === 'lastRecareSent' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 18,
          data: values[key],
          formName: 'communications',
          formSection: key,
          tag: 'Last Recare Sent',
          intensive: true,
        });
      }
      if (key === 'reviews' && values[key].length === 2) {
        setFilter += 1;
        batchFilters.push({
          indexFunc: 19,
          data: values[key],
          formName: 'communications',
          formSection: key,
          tag: 'Reviews',
          intensive: true,
        });
      }
    });

    if (keys.length === setFilter && keys.length > 0){
      batchFilters.forEach((filter) => {
        addFilter(filter);
      });
    }
  }

  render() {
    const {
      practitioners,
      filters,
    } = this.props;

    const {
      openFilters,
    } = this.state;

    if (!practitioners) {
      return null;
    }

    const inputStyles = {
      group: styles.groupInputStyle,
    };

    const filterBodyDisplay = ({ index, component, headerTitle }) => {
      return (
        <div className={styles.filterBody}>
          <div
            className={styles.filterHeader}
            onClick={() => this.displayFilter(index)}
          >
            {headerTitle}
            <span className={styles.filterHeader_icon}> <Icon icon="caret-down" type="solid" /> </span>
          </div>
          {openFilters[index] ? <div className={styles.collapsible}>
            {component}
          </div> : null}
        </div>
      );
    };

    return (
      <Card className={styles.sideBar}>
        <div className={styles.header}>
          <div className={styles.header_icon}> <Icon icon="filter" type="solid" /> </div>
          <div className={styles.header_text}> Filters </div>
          <div
            className={styles.header_clearText}
            onClick={this.clearTags}
          >
            Clear All
          </div>
        </div>

        {/*<SearchPatientTable
          handleSearchPatient={this.props.searchPatients}
        />*/}

        <FilterTags
          filterTags={filters}
          removeTag={this.removeTag}
        />

        <div className={styles.filtersContainer}>
          {filterBodyDisplay({
            index: 0,
            component: Demographics({
              handleDemographics: this.handleDemographics,
              searchPatients: this.props.searchPatients,
            }),
            headerTitle: 'Demographics',
          })}
          {filterBodyDisplay({
            index: 1,
            component: <Appointments
              handleAppointments={this.handleAppointments}
              theme={inputStyles}
            />,
            headerTitle: 'Appointments',
          })}
          {filterBodyDisplay({
            index: 2,
            component: <Practitioners
              handlePractitioners={this.handlePractitioners}
              practitioners={practitioners}
            />,
            headerTitle: 'Appointments',
          })}
          {filterBodyDisplay({
            index: 3,
            component: <Communications
              handleCommunications={this.handleCommunications}
              practitioners={practitioners}
              theme={inputStyles}
            />,
            headerTitle: 'Communications',
          })}
        </div>
      </Card>
    );
  }
}

SideBarFilters.propTypes = {
  practitioners: PropTypes.object.isRequired,
  clearFilters: PropTypes.func.isRequired,
  arrayRemoveAll: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  searchPatients: PropTypes.func.isRequired,
};

export default SideBarFilters;
