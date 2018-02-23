
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Icon, Card } from '../../../library';
import styles from './styles.scss';
import AppointmentsTab from './AppointmentsTab/index';
import PersonalTab from './PersonalTab';

export default function DataDisplay(props) {
  const {
    patient,
    handleTabChange,
    tabIndex,
    openModal,
  } = props;

  return (
    <Card className={styles.mainContainer} runAnimation loaded={patient}>
      <Tabs index={tabIndex} onChange={handleTabChange} noUnderLine >
        <Tab
          label="Appointments"
          tabCard
        >
          {patient ? <AppointmentsTab
            patient={patient}
            openModal={openModal}
          /> : null }
        </Tab>
        <Tab
          label="Personal"
          tabCard
        >
          {patient ? <PersonalTab
            patient={patient}
            openModal={openModal}
          /> : null}
        </Tab>
        <Tab
          label="Insurance" index={tabIndex}
          tabCard
        >
          <div className={styles.noData}>
            No Insurance Information
          </div>
        </Tab>
        <Tab
          label="Family"
          index={tabIndex}
          tabCard
        >
          <div className={styles.noData}>
            No Family Information
          </div>
        </Tab>
      </Tabs>
    </Card>
  );
}

DataDisplay.propTypes = {
  patient: PropTypes.object.isRequired,
};
