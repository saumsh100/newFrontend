
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Grid,
  Row,
  Col,
} from '../../../library';
import PatientAvatarTitle from '../Shared/PatientAvatarTitle';
import Content from '../Shared/Content';
import styles from './styles.scss';

const genderMap = {
  male: 'Male',
  female: 'Female',
};

export default function About({ patient }) {
  return (
    <div>
      <PatientAvatarTitle
        patient={patient}
      />
      <div className={styles.content}>
        <Grid>
          <Row>
            <Col xs={6}>
              <Content
                title="Age"
                value={patient.birthDate ? moment().diff(patient.birthDate, 'years') : 'n/a'}
              />
              <Content
                title="Gender"
                value={genderMap[patient.gender] || 'n/a'}
              />
              <Content
                title="City"
                value={patient.address && patient.address.city ? patient.address.city : 'n/a'}
              />
            </Col>
            <Col xs={6}>
              <Content
                title="Birthday"
                value={patient.birthDate ? moment(patient.birthDate).format('MMM DD, YYYY') : 'n/a'}
              />
              <Content
                title="Language"
                value="n/a"
              />
              <Content
                title="Family"
                value="n/a"
              />
            </Col>
          </Row>
          <Row className={styles.otherSection}>
            <Col xs={6}>
              <Content
                title="Mobile Phone"
                value={patient.mobilePhoneNumber ? patient.mobilePhoneNumber : 'n/a'}
              />
              <Content
                title="Email"
                value={patient.email ? patient.email : 'n/a'}
              />
            </Col>
            <Col xs={6}>
              <Content
                title="Home Phone"
                value={patient.homePhoneNumber ? patient.homePhoneNumber : 'n/a'}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  );
}

About.propTypes = {
  patient: PropTypes.object.isRequired,
};
