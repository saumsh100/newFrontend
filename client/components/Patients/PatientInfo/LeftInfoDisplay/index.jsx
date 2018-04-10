
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Icon, Card } from '../../../library';
import { familyDataSelector } from '../../Shared/helpers';
import AppointmentsTab from './AppointmentsTab/index';
import PersonalTab from './PersonalTab';
import FamilyTab from './FamilyTab';
import styles from './styles.scss';

export default function DataDisplay(props) {
  const {
    patient,
    activeAccount,
    handleTabChange,
    tabIndex,
    openModal,
    accountViewer,
  } = props;

  const { family, familyLength } = familyDataSelector(accountViewer);

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
          { familyLength > 0 ?
            <FamilyTab
              family={family}
              patient={patient}
              activeAccount={activeAccount}
              openModal={openModal}
            /> : <div className={styles.noData}>No Family Information</div>}
        </Tab>
      </Tabs>
    </Card>
  );
}

DataDisplay.propTypes = {
  patient: PropTypes.object.isRequired,
};
