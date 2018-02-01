
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

  const editComponent = (
    <div className={styles.textContainer}>
      <div className={styles.hiddenText}>
        &nbsp;
      </div>
      <div className={styles.textEdit} onClick={() => openModal()}>
        <div className={styles.textEdit_icon}>
          <Icon icon="pencil" />
        </div>
        <div className={styles.textEdit_text}>Edit</div>
      </div>
    </div>
  );

  return (
    <Card className={styles.mainContainer}>
      <Tabs
        className={styles.tab}
        index={tabIndex}
        onChange={handleTabChange}
        noUnderLine
      >
        <Tab label="APPOINTMENTS" >
          <AppointmentsTab
            patient={patient}
            openModal={openModal}
            editComponent={editComponent}
          />
        </Tab>
        <Tab label="PERSONAL">
          <PersonalTab
            patient={patient}
            openModal={openModal}
            editComponent={editComponent}
          />
        </Tab>
        <Tab label="INSURANCE" index={tabIndex} />
        <Tab label="FAMILY" index={tabIndex} />
      </Tabs>
    </Card>
  );
}

DataDisplay.propTypes = {
  patient: PropTypes.object.isRequired,
};
