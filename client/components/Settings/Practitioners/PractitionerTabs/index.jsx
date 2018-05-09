
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Tab, IconButton, Header } from '../../../library';
import PractitionerBasicData from './PractitionerBasicData';
import PractitionerOfficeHours from './PractitionerOfficeHours';
import PractitionerServices from './PractitionerServices';
import PractitionerTimeOff from './PractitionerTimeOff';
import PractitionerRecurringTimeOff from './PractitionerRecurringTimeOff';
import PractitionerActive from './PractitionerActive';
import SettingsCard from '../../Shared/SettingsCard';
import styles from '../styles.scss';

import {
  updateEntityRequest,
  deleteEntityRequest,
  fetchEntities,
} from '../../../../thunks/fetchEntities';

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
    const { practitioner } = this.props;

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

    const deletePrac = confirm('Delete Practitioner?');

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
      filteredTimeOffs = timeOffs.filter(timeOff => timeOff.practitionerId === practitioner.get('id'));
    }
    let filteredRecurringTimeOffs = null;

    if (recurringTimeOffs) {
      filteredRecurringTimeOffs = recurringTimeOffs.filter(recurringTimeOff => recurringTimeOff.practitionerId === practitioner.get('id'));
    }

    const serviceIds = practitioner.get('services');

    return (
      <SettingsCard
        title={practitioner.getFullName()}
        headerClass={styles.pracHeaderClass}
        bodyClass={styles.pracBodyClass}
        rightActions={
          <div className={styles.rightActions}>
            <PractitionerActive
              key={practitioner.get('id')}
              practitioner={practitioner}
              updatePractitioner={this.updatePractitioner}
            />
            <div className={styles.trashButton}>
              <IconButton
                iconType="solid"
                icon="trash"
                onClick={this.deletePractitioner}
                data-test-id="deletePractitioner"
              />
            </div>
          </div>
        }
        subHeader={
          <Tabs index={this.state.index} onChange={this.handleTabChange}>
            <Tab label="Basic" data-test-id="tab_practitionerBasicData" />
            <Tab label="Practitioner Schedule" data-test-id="tab_practitionerOfficeHours" />
            <Tab label="Services" data-test-id="tab_practitionerServices" />
            <Tab label="Time Off" data-test-id="tab_practitionerTimeOff" />
            <Tab label="Recurring Time Off" />
          </Tabs>
        }
      >
        <Tabs index={this.state.index} noHeaders>
          <Tab label=" ">
            <PractitionerBasicData
              key={practitioner.get('id')}
              practitioner={practitioner}
              updatePractitioner={this.updatePractitioner}
            />
          </Tab>
          <Tab label=" ">
            <PractitionerOfficeHours
              key={practitioner.get('id')}
              weeklySchedule={weeklySchedule}
              practitioner={practitioner}
              updateEntityRequest={this.props.updateEntityRequest}
              chairs={this.props.chairs}
            />
          </Tab>
          <Tab label=" ">
            <PractitionerServices
              key={practitioner.get('id')}
              serviceIds={serviceIds}
              practitioner={practitioner}
              updatePractitioner={this.updatePractitioner}
            />
          </Tab>
          <Tab label=" ">
            <PractitionerTimeOff
              key={practitioner.get('id')}
              practitioner={practitioner}
              timeOffs={filteredTimeOffs}
            />
          </Tab>
          <Tab label=" ">
            <PractitionerRecurringTimeOff
              key={practitioner.get('id')}
              practitioner={practitioner}
              recurringTimeOffs={filteredRecurringTimeOffs}
            />
          </Tab>
        </Tabs>
      </SettingsCard>
    );
  }
}

function mapStateToProps({ entities }, { practitioner }) {
  const weeklyScheduleId = practitioner.get('isCustomSchedule')
    ? practitioner.get('weeklyScheduleId')
    : null;
  const weeklySchedule = entities.getIn(['weeklySchedules', 'models']).get(weeklyScheduleId);
  const allTimeOffs = entities.getIn(['practitionerRecurringTimeOffs', 'models']);
  const timeOffs = allTimeOffs.filter(timeOff => !timeOff.toJS().interval);

  const recurringTimeOffs = allTimeOffs.filter(timeOff => timeOff.toJS().interval);

  return {
    chairs: entities.getIn(['chairs', 'models']),
    timeOffs,
    recurringTimeOffs,
    weeklySchedule,
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
      deleteEntityRequest,
      fetchEntities,
    },
    dispatch
  );
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(PractitionerTabs);
