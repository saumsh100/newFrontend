import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tabs, Tab, Card } from '../../../library';
import { familyDataSelector } from '../../Shared/helpers';
import AppointmentsTab from './AppointmentsTab/index';
import PersonalTab from './PersonalTab';
import FamilyTab from './FamilyTab';
import { isResponsive } from '../../../../util/hub';
import { patientShape, accountShape } from '../../../library/PropTypeShapes';
import CollapsibleTab from '../CollapsibleTab';
import styles from './styles.scss';

export default function LeftInfoDisplay(props) {
  const {
    patient,
    activeAccount,
    handleTabChange,
    tabIndex,
    openModal,
    accountViewer,
    isPatientInfo,
  } = props;

  const { family, familyLength } = familyDataSelector(accountViewer);

  const appointmentsTab = patient && <AppointmentsTab patient={patient} openModal={openModal} />;
  const personalTab = patient && <PersonalTab patient={patient} openModal={openModal} />;
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
      <Card
        className={`${styles.mainContainer} ${props.containerClass}`}
        runAnimation
        loaded={!!patient}
      >
        <CollapsibleTab title="Appointments">{appointmentsTab}</CollapsibleTab>
        <CollapsibleTab title="Personal">{personalTab}</CollapsibleTab>
        <CollapsibleTab title="Family">{familyTab}</CollapsibleTab>
      </Card>
    );
  }

  return (
    <Card
      className={classNames(props.containerClass, {
        [styles.mainContainer]: !isPatientInfo,
        [styles.patientTableMainContainer]: isPatientInfo,
      })}
      runAnimation
      loaded={!!patient}
    >
      <Tabs index={tabIndex} onChange={handleTabChange} contentClass={styles.content}>
        <Tab label="Appointments" tabCard activeClass={styles.activeTab}>
          {appointmentsTab}
        </Tab>
        <Tab label="Personal" tabCard activeClass={styles.activeTab}>
          {personalTab}
        </Tab>
        <Tab label="Family" index={tabIndex} tabCard activeClass={styles.activeTab}>
          {familyTab}
        </Tab>
      </Tabs>
    </Card>
  );
}

LeftInfoDisplay.propTypes = {
  patient: PropTypes.shape(patientShape),
  activeAccount: PropTypes.shape(accountShape),
  handleTabChange: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  containerClass: PropTypes.string,
  openModal: PropTypes.func.isRequired,
  accountViewer: PropTypes.shape({
    patient: PropTypes.shape({
      family: PropTypes.instanceOf(Object),
    }),
  }),
  isPatientInfo: PropTypes.bool,
};

LeftInfoDisplay.defaultProps = {
  accountViewer: null,
  activeAccount: null,
  patient: null,
  containerClass: '',
  isPatientInfo: false,
};
