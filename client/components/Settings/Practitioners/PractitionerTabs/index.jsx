import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Tabs, Tab, StandardButton, Divider } from '../../../library';
import PractitionerBasicData from './PractitionerBasicData';
import PractitionerOfficeHours from './PractitionerOfficeHours';
import PractitionerServices from './PractitionerServices';
import PractitionerTimeOff from './PractitionerTimeOff';
import PractitionerRecurringTimeOff from './PractitionerRecurringTimeOff';
import PractitionerActive from './PractitionerActive';
import WeeklyScheduleModel from '../../../../entities/models/WeeklySchedule';
import SettingsCard from '../../Shared/SettingsCard';
import EnabledFeature from '../../../library/EnabledFeature';
import Practitioner from '../../../../entities/collections/practitioners';
import styles from '../styles.scss';

import {
  updateEntityRequest,
  deleteEntityRequest,
  fetchEntities,
} from '../../../../thunks/fetchEntities';

class PractitionerTabs extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0 };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.updatePractitioner = this.updatePractitioner.bind(this);
    this.deletePractitioner = this.deletePractitioner.bind(this);
  }

  componentDidMount() {
    const { practitioner } = this.props;
    this.props.fetchEntities({
      key: 'practitioners',
      url: `/api/practitioners/${practitioner.get('id')}`,
      join: ['weeklySchedule', 'services', 'recurringTimeOffs'],
    });
  }

  handleTabChange(index) {
    this.setState({ index });
  }

  deletePractitioner() {
    const { practitioner } = this.props;

    const deletePrac = window.confirm('Delete Practitioner?');

    if (deletePrac) {
      this.props.deleteEntityRequest({
        key: 'practitioners',
        id: practitioner.get('id'),
      });
      this.props.setPractitionerId({ id: null });
    }
  }

  updatePractitioner(modifiedPractitioner, alert) {
    this.props.updateEntityRequest({
      key: 'practitioners',
      model: modifiedPractitioner,
      alert,
    });
    if (!modifiedPractitioner.isActive) {
      this.props.setPractitionerId({ id: null });
    }
  }

  render() {
    const { practitioner, weeklySchedule, timeOffs, recurringTimeOffs, role } = this.props;

    if (!practitioner) {
      return null;
    }

    let filteredTimeOffs = null;
    if (timeOffs) {
      filteredTimeOffs = timeOffs.filter(
        (timeOff) => timeOff.practitionerId === practitioner.get('id'),
      );
    }
    let filteredRecurringTimeOffs = null;

    if (recurringTimeOffs) {
      filteredRecurringTimeOffs = recurringTimeOffs.filter(
        (recurringTimeOff) => recurringTimeOff.practitionerId === practitioner.get('id'),
      );
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
            <Divider vertical className={styles.divider} />
            {role === 'SUPERADMIN' && (
              <StandardButton
                iconType="light"
                icon="trash"
                onClick={this.deletePractitioner}
                data-test-id="deletePractitioner"
                variant="danger"
                className={styles.trashButton}
              />
            )}
          </div>
        }
        subHeader={
          <EnabledFeature
            predicate={({ userRole }) => userRole === 'SUPERADMIN'}
            render={() => (
              <Tabs index={this.state.index} onChange={this.handleTabChange}>
                <Tab
                  label="Basic"
                  data-test-id="tab_practitionerBasicData"
                  className={classNames(styles.tab, {
                    [styles.tab_active]: this.state.index === 0,
                  })}
                />
                <Tab
                  label="Practitioner Schedule"
                  data-test-id="tab_practitionerOfficeHours"
                  className={classNames(styles.tab, {
                    [styles.tab_active]: this.state.index === 1,
                  })}
                />
                <Tab
                  label="Reasons"
                  data-test-id="tab_practitionerServices"
                  className={classNames(styles.tab, {
                    [styles.tab_active]: this.state.index === 2,
                  })}
                />
                <Tab
                  label="Time Off"
                  data-test-id="tab_practitionerTimeOff"
                  className={classNames(styles.tab, {
                    [styles.tab_active]: this.state.index === 3,
                  })}
                />
                <Tab
                  label="Recurring Time Off"
                  data-test-id="tab_practitionerRecurringTimeOff"
                  className={classNames(styles.tab, {
                    [styles.tab_active]: this.state.index === 4,
                  })}
                />
              </Tabs>
            )}
            fallback={() => (
              <Tabs index={this.state.index} onChange={this.handleTabChange}>
                <Tab label="Basic" data-test-id="tab_practitionerBasicData" />
                <Tab label="Practitioner Schedule" data-test-id="tab_practitionerOfficeHours" />
                <Tab label="Reasons" data-test-id="tab_practitionerServices" />
              </Tabs>
            )}
          />
        }
      >
        <Tabs index={this.state.index} noHeaders contentClass={styles.content}>
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

function mapStateToProps({ auth, entities }, { practitioner }) {
  const weeklyScheduleId = practitioner.get('isCustomSchedule')
    ? practitioner.get('weeklyScheduleId')
    : null;
  const weeklySchedule = entities.getIn(['weeklySchedules', 'models']).get(weeklyScheduleId);
  const allTimeOffs = entities.getIn(['practitionerRecurringTimeOffs', 'models']);
  const timeOffs = allTimeOffs.filter((timeOff) => !timeOff.toJS().interval);

  const recurringTimeOffs = allTimeOffs.filter((timeOff) => timeOff.toJS().interval);

  return {
    chairs: entities.getIn(['chairs', 'models']),
    timeOffs,
    recurringTimeOffs,
    weeklySchedule,
    role: auth.get('role'),
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
      deleteEntityRequest,
      fetchEntities,
    },
    dispatch,
  );
}

PractitionerTabs.propTypes = {
  practitioner: PropTypes.instanceOf(Practitioner).isRequired,
  fetchEntities: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  setPractitionerId: PropTypes.func.isRequired,
  chairs: PropTypes.instanceOf(Map),
  timeOffs: PropTypes.instanceOf(Map),
  recurringTimeOffs: PropTypes.instanceOf(Map),
  weeklySchedule: PropTypes.instanceOf(WeeklyScheduleModel),
  role: PropTypes.string.isRequired,
};

PractitionerTabs.defaultProps = {
  chairs: null,
  timeOffs: null,
  recurringTimeOffs: null,
  weeklySchedule: null,
};

export default connect(mapStateToProps, mapActionsToProps)(PractitionerTabs);
