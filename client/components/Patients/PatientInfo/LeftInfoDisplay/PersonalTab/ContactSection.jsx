import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '../../../../../util/isomorphic';
import { Row, Col, PointOfContactBadge } from '../../../../library';
import InfoDump from '../../../Shared/InfoDump';
import { patientShape } from '../../../../library/PropTypeShapes';
import PhoneLookupComponent from '../../../../Chat/PatientInfo/About/PhoneLookupComponent';
import styles from '../styles.scss';

export default function ContactSection(props) {
  const { patient, className } = props;
  let phoneLookupObj = {};
  if (patient?.isSMSEnabled !== null && patient?.isSMSEnabled !== undefined) {
    phoneLookupObj = {
      isPhoneLookupChecked: true,
      isSMSEnabled: patient.isSMSEnabled,
      isVoiceEnabled: patient.isVoiceEnabled,
    };
  }
  return (
    <div className={className}>
      <div className={styles.subHeader}>Contact</div>
      <Row className={styles.row}>
        <Col xs={12} className={styles.cellPhoneRow}>
          <InfoDump label="Cellphone Number" data={formatPhoneNumber(patient.cellPhoneNumber)}>
            {() =>
              patient.cellPhoneNumber && (
                <PointOfContactBadge patientId={patient.id} channel="phone" />
              )
            }
          </InfoDump>
          {patient?.cellPhoneNumber && phoneLookupObj?.isPhoneLookupChecked && (
            <PhoneLookupComponent
              phoneLookupObj={phoneLookupObj}
              preferences={patient.preferences}
            />
          )}
        </Col>
        <Col xs={6} className={styles.paddingPhones}>
          <InfoDump
            label="Mobile Phone Number"
            data={formatPhoneNumber(patient.mobilePhoneNumber)}
          />
        </Col>
        <Col xs={6} className={styles.paddingPhones}>
          <InfoDump label="Other Phone Number" data={formatPhoneNumber(patient.otherPhoneNumber)} />
        </Col>
        <Col xs={6} className={styles.paddingPhones}>
          <InfoDump label="home Number" data={formatPhoneNumber(patient.homePhoneNumber)} />
        </Col>
        <Col xs={6} className={styles.paddingPhones}>
          <InfoDump label="Work Number" data={formatPhoneNumber(patient.workPhoneNumber)} />
        </Col>
        <Col xs={12} className={styles.emailRow}>
          <InfoDump label="Email" data={patient.email} type="email">
            {() => patient.email && <PointOfContactBadge patientId={patient.id} channel="email" />}
          </InfoDump>
        </Col>
      </Row>
    </div>
  );
}

ContactSection.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  className: PropTypes.string,
};

ContactSection.defaultProps = {
  className: null,
};
