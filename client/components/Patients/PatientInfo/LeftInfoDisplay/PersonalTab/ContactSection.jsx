
import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '../../../../../util/isomorphic';
import { Row, Col, PointOfContactBadge } from '../../../../library';
import InfoDump from '../../../Shared/InfoDump';
import { patientShape } from '../../../../library/PropTypeShapes';
import styles from '../styles.scss';

export default function ContactSection(props) {
  const { patient, className } = props;
  return (
    <div className={className}>
      <div className={styles.subHeader}>Contact</div>
      <Row className={styles.row}>
        <Col xs={12} className={styles.cellPhoneRow}>
          <InfoDump label="Cellphone NUMBER" data={formatPhoneNumber(patient.cellPhoneNumber)}>
            {() =>
              patient.cellPhoneNumber && (
                <PointOfContactBadge patientId={patient.id} channel="phone" />
              )
            }
          </InfoDump>
        </Col>
        <Col xs={6} className={styles.paddingPhones}>
          <InfoDump
            label="Mobile Phone NUMBER"
            data={formatPhoneNumber(patient.mobilePhoneNumber)}
          />
        </Col>
        <Col xs={6} className={styles.paddingPhones}>
          <InfoDump label="Other Phone NUMBER" data={formatPhoneNumber(patient.otherPhoneNumber)} />
        </Col>
        <Col xs={6} className={styles.paddingPhones}>
          <InfoDump label="HOME NUMBER" data={formatPhoneNumber(patient.homePhoneNumber)} />
        </Col>
        <Col xs={6} className={styles.paddingPhones}>
          <InfoDump label="WORK NUMBER" data={formatPhoneNumber(patient.workPhoneNumber)} />
        </Col>
        <Col xs={12} className={styles.emailRow}>
          <InfoDump label="EMAIL" data={patient.email} type="email">
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
