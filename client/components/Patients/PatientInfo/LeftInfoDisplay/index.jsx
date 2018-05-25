
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from '../../../library';
import { familyDataSelector } from '../../Shared/helpers';
import AppointmentsTab from './AppointmentsTab/index';
import PersonalTab from './PersonalTab';
import FamilyTab from './FamilyTab';
import { isResponsive } from '../../../../util/hub';
import CollapsibleTab from '../CollapsibleTab';
import styles from './styles.scss';

export default function DataDisplay(props) {
  const { patient, activeAccount, handleTabChange, tabIndex, openModal, accountViewer } = props;

  const { family, familyLength } = familyDataSelector(accountViewer);

  const appointmentsTab = patient && (
    <AppointmentsTab patient={patient} openModal={openModal} />
  );
  const personalTab = patient && (
    <PersonalTab patient={patient} openModal={openModal} />
  );
  const insuranceTab = <div className={styles.noData}>No Insurance Information</div>;
  const familyTab =
    familyLength > 0 ? (
      <FamilyTab
        family={family}
        patient={patient}
        activeAccount={activeAccount}
        openModal={openModal}
      />
    ) : (
      <div className={styles.noData}>No Family Information</div>
    );

  if (isResponsive()) {
    return (
      <Card className={styles.mainContainer} runAnimation loaded={patient}>
        <CollapsibleTab title={'Appointments'}>{appointmentsTab}</CollapsibleTab>
        <CollapsibleTab title={'Personal'}>{personalTab}</CollapsibleTab>
        <CollapsibleTab title={'Insurance'}>{insuranceTab}</CollapsibleTab>
        <CollapsibleTab title={'Family'}>{familyTab}</CollapsibleTab>
      </Card>
    );
  }

  return (
    <Card className={styles.mainContainer} runAnimation loaded={patient}>
      <Tabs index={tabIndex} onChange={handleTabChange} noUnderLine>
        <Tab label="Appointments" tabCard>
          {appointmentsTab}
        </Tab>
        <Tab label="Personal" tabCard>
          {personalTab}
        </Tab>
        <Tab label="Insurance" index={tabIndex} tabCard>
          {insuranceTab}
        </Tab>
        <Tab label="Family" index={tabIndex} tabCard>
          {familyTab}
        </Tab>
      </Tabs>
    </Card>
  );
}

DataDisplay.propTypes = {
  patient: PropTypes.shape({
    address: PropTypes.instanceOf(Object),
    lastRestorativeDate: PropTypes.string,
    lastRecallDate: PropTypes.string,
    lastHygieneDate: PropTypes.string,
  }).isRequired,
  activeAccount: PropTypes.instanceOf(Object),
  handleTabChange: PropTypes.func,
  tabIndex: PropTypes.number,
  openModal: PropTypes.func,
  accountViewer: PropTypes.shape({
    patient: PropTypes.shape({
      family: PropTypes.PropTypes.instanceOf(Object),
    }),
  }),
};
