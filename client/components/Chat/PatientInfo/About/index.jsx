
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatPhoneNumber } from '@carecru/isomorphic';
import { Grid, Row, Col, PointOfContactBadge } from '../../../library';
import PatientAvatarTitle from '../Shared/PatientAvatarTitle';
import Content from '../Shared/Content';
import PatientModel from '../../../../entities/models/Patient';
import styles from './styles.scss';

const genderMap = {
  male: 'Male',
  female: 'Female',
};

export default function About({ patient }) {
  return (
    <div>
      <PatientAvatarTitle patient={patient} />
      <div className={styles.content}>
        <Grid>
          <Row>
            <Col xs={6}>
              <Content
                title="Age"
                value={patient.birthDate ? moment().diff(patient.birthDate, 'years') : 'n/a'}
              />
              <Content title="Gender" value={genderMap[patient.gender] || 'n/a'} />
              <Content title="City" value={(patient.address && patient.address.city) || 'n/a'} />
            </Col>
            <Col xs={6}>
              <Content
                title="Birthday"
                value={
                  (patient.birthDate && moment(patient.birthDate).format('MMM DD, YYYY')) || 'n/a'
                }
              />
              <Content title="Language" value="n/a" />
              <Content title="Family" value="n/a" />
            </Col>
          </Row>
          <Row className={styles.otherSection}>
            <Col xs={12}>
              <Content
                title="Cellphone Number"
                value={formatPhoneNumber(patient.cellPhoneNumber) || 'n/a'}
              >
                {() =>
                  patient.cellPhoneNumber && (
                    <PointOfContactBadge patientId={patient.id} channel="phone" />
                  )
                }
              </Content>
            </Col>
            <Col xs={12}>
              <Content title="Email" value={patient.email || 'n/a'}>
                {() =>
                  patient.email && <PointOfContactBadge patientId={patient.id} channel="email" />
                }
              </Content>
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  );
}

About.propTypes = { patient: PropTypes.shape(PatientModel).isRequired };
