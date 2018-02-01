
import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Row,
  Col,
} from '../../../library';
import PatientAvatarTitle from '../Shared/PatientAvatarTitle';
import Content from '../Shared/Content';
import styles from './styles.scss';

export default function Insurance({ patient }) {
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
                title="Insurance Carrier"
                value="n/a"
              />
              <Content
                title="Status"
                value="n/a"
              />
              <Content
                title="Telephone Number"
                value="n/a"
              />
            </Col>
            <Col xs={6}>
              <Content
                title="Member ID"
                value="n/a"
              />
              <Content
                title="Expiry"
                value="n/a"
              />
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  );
}

Insurance.propTypes = {
  patient: PropTypes.object.isRequired,
};
