
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
      <Tabs className={styles.tab} index={tabIndex} onChange={handleTabChange} noUnderLine >
        <Tab label="APPOINTMENTS" >
          {patient ? <AppointmentsTab
            patient={patient}
            openModal={openModal}
          /> : null }
        </Tab>
        <Tab label="PERSONAL">
          {patient ? <PersonalTab
            patient={patient}
            openModal={openModal}
          /> : null}
        </Tab>
        <Tab label="INSURANCE" index={tabIndex} >
          <div className={styles.noData}>
            No Insurance Information
          </div>
        </Tab>
        <Tab label="FAMILY" index={tabIndex} >
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
