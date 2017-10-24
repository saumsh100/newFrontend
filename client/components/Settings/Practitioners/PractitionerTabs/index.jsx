
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Tab, IconButton, Header } from '../../../library';
import styles from '../styles.scss';
import PractitionerBasicData from './PractitionerBasicData';
import PractitionerOfficeHours from './PractitionerOfficeHours';
import PractitionerServices from './PractitionerServices';
import PractitionerTimeOff from './PractitionerTimeOff';
import PractitionerRecurringTimeOff from './PractitionerRecurringTimeOff';
import PractitionerActive from './PractitionerActive';

import { updateEntityRequest, deleteEntityRequest, fetchEntities } from '../../../../thunks/fetchEntities';

class PractitionerTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.updatePractitioner = this.updatePractitioner.bind(this);
    this.deletePractitioner = this.deletePractitioner.bind(this);
  }

  componentWillMount() {
    const {
      practitioner,
    } = this.props;

    this.props.fetchEntities({
      key: 'practitioners',
      url: `/api/practitioners/${practitioner.get('id')}`,
      join: ['weeklySchedule', 'services', 'recurringTimeOffs'],
    });

    this.setState({ index: 0 });
  }

  updatePractitioner(modifiedPractitioner, alert) {
    this.props.updateEntityRequest({ key: 'practitioners', model: modifiedPractitioner, alert });
  }

  deletePractitioner() {
    const { practitioner } = this.props;

    let deletePrac = confirm('Delete Practitioner?');

    if (deletePrac) {
      this.props.deleteEntityRequest({ key: 'practitioners', id: practitioner.get('id') });
      this.props.setPractitionerId({ id: null });
    }
  }

  handleTabChange(index) {
    this.setState({ index });
  }

  render() {
    const { practitioner, weeklySchedule, timeOffs, recurringTimeOffs } = this.props;

    if (!practitioner) {
      return null;
    }

    let filteredTimeOffs = null;
    if (timeOffs) {
      filteredTimeOffs = timeOffs.filter((timeOff) => {
        return timeOff.practitionerId === practitioner.get('id');
      });
    }
    let filteredRecurringTimeOffs = null;

    if (recurringTimeOffs) {
      filteredRecurringTimeOffs = recurringTimeOffs.filter((recurringTimeOff) => {
        return recurringTimeOff.practitionerId === practitioner.get('id');
      });
    }

    let serviceIds = practitioner.get('services');

    return (
      <div className={styles.practTabContainer}>
        <div className={styles.pracHeaderContainer}>
          <Header title={practitioner.getFullName()} />
          <PractitionerActive
            key={practitioner.get('id')}
            practitioner={practitioner}
            updatePractitioner={this.updatePractitioner}
          />
          <div className={styles.trashButton}>
            <IconButton icon="trash" onClick={this.deletePractitioner} data-test-id="deletePractitioner" />
          </div>
        </div>
        <Tabs className={styles.practitionerTabs} index={this.state.index} onChange={this.handleTabChange} noUnderLine >
          <Tab label="Basic" data-test-id="practitionerBasicDataTab">
            <PractitionerBasicData
              key={practitioner.get('id')}
              practitioner={practitioner}
              updatePractitioner={this.updatePractitioner}
            />
          </Tab>
          <Tab label="Practitioner Schedule" data-test-id="practitionerOfficeHoursTab">
            <PractitionerOfficeHours
              key={practitioner.get('id')}
              weeklySchedule={weeklySchedule}
              practitioner={practitioner}
              updateEntityRequest={this.props.updateEntityRequest}
              chairs={this.props.chairs}
            />
          </Tab>
          <Tab label="Services" data-test-id="practitionerServicesTab">
            <PractitionerServices
              key={practitioner.get('id')}
              serviceIds={serviceIds}
              practitioner={practitioner}
              updatePractitioner={this.updatePractitioner}
            />
          </Tab>
          <Tab label="Time Off" data-test-id="practitionerTimeOffTab">
            <PractitionerTimeOff
              key={practitioner.get('id')}
              practitioner={practitioner}
              timeOffs={filteredTimeOffs}
            />
          </Tab>
          <Tab label="Recurring Time Off">
            <PractitionerRecurringTimeOff
              key={practitioner.get('id')}
              practitioner={practitioner}
              recurringTimeOffs={filteredRecurringTimeOffs}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps({ entities }, { practitioner }) {

  const weeklyScheduleId = practitioner.get('isCustomSchedule') ? practitioner.get('weeklyScheduleId') : null;

  const weeklySchedule = entities.getIn(['weeklySchedules', 'models']).get(weeklyScheduleId);

  const allTimeOffs = entities.getIn(['practitionerRecurringTimeOffs', 'models']);

  const timeOffs = allTimeOffs.filter((timeOff) => {
    return !timeOff.toJS().interval;
  });

  const recurringTimeOffs = allTimeOffs.filter((timeOff) => {
    return timeOff.toJS().interval;
  });

  return {
    chairs: entities.getIn(['chairs', 'models']),
    timeOffs,
    recurringTimeOffs,
    weeklySchedule,
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    deleteEntityRequest,
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);


export default enhance(PractitionerTabs);
