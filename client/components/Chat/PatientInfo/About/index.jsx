
import React from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumber, capitalize } from '@carecru/isomorphic';
import { connect } from 'react-redux';
import { Grid, Row, Col, PointOfContactBadge, getTodaysDate, getUTCDate } from '../../../library';
import PatientAvatarTitle from '../Shared/PatientAvatarTitle';
import Content from '../Shared/Content';
import PatientModel from '../../../../entities/models/Patient';
import styles from './styles.scss';

const About = ({ patient, timezone }) => (
  <div>
    <PatientAvatarTitle patient={patient} />
    <div className={styles.content}>
      <Grid>
        <Row>
          <Col xs={6}>
            <Content
              title="Age"
              value={
                patient.birthDate ? getTodaysDate(timezone).diff(patient.birthDate, 'years') : 'n/a'
              }
            />
            <Content
              title="Gender"
              value={(patient.gender && capitalize(patient.gender)) || 'n/a'}
            />
          </Col>
          <Col xs={6}>
            <Content
              title="Birthday"
              value={
                (patient.birthDate
                  && getUTCDate(patient.birthDate, timezone).format('MMM DD, YYYY'))
                || 'n/a'
              }
            />
            <Content title="City" value={(patient.address && patient.address.city) || 'n/a'} />
          </Col>
        </Row>
        <Row className={styles.otherSection}>
          <Col xs={12}>
            <Content
              title="Cellphone Number"
              value={formatPhoneNumber(patient.cellPhoneNumber) || 'n/a'}
            >
              {() =>
                !patient.isUnknown
                && patient.cellPhoneNumber && (
                  <PointOfContactBadge patientId={patient.id} channel="phone" />
                )
              }
            </Content>
          </Col>
          <Col xs={12}>
            <Content title="Email" value={patient.email || 'n/a'}>
              {() =>
                !patient.isUnknown
                && patient.email && <PointOfContactBadge patientId={patient.id} channel="email" />
              }
            </Content>
          </Col>
        </Row>
      </Grid>
    </div>
  </div>
);

About.propTypes = {
  patient: PropTypes.shape(PatientModel).isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(About);
