
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Card, Avatar, Icon, Grid, Row, Col, } from '../../../library';
import InfoDump from './InfoDump';
import styles from './styles.scss';

export default function TopDisplay(props) {
  const {
    patient
  } = props;

  const age = patient && patient.birthDate ? moment().diff(patient.birthDate, 'years') : '';

  return (
    <Card className={styles.card}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          &nbsp;
        </div>
        <div className={styles.dataContainer}>

          <div className={styles.avatarContainer}>
            <Avatar user={patient} className={styles.avatarContainer_avatar} />
            <div className={styles.avatarContainer_data}>
              <div className={styles.avatarContainer_data_name}>
                {patient.getFullName()}, {age}
              </div>
              <div className={styles.displayFlex}>
                <span className={styles.avatarContainer_data_icon}> <Icon icon="envelope" /> </span>
                <div className={styles.avatarContainer_data_email}>
                  {patient.email}
                </div>
              </div>
              <div className={styles.displayFlex}>
                <span className={styles.avatarContainer_data_icon}> <Icon icon="phone" /> </span>
                <div className={styles.avatarContainer_data_phone}>
                  {patient.mobilePhoneNumber}
                </div>
              </div>
              <div className={styles.avatarContainer_data_active}>
                {patient.status}
              </div>
            </div>
          </div>

          <Grid className={styles.rightContainer}>
            <Row className={styles.rightContainer_content}>
              <Col xs={4}>
                <InfoDump
                  label="PATIENT DUE FOR HYGIENE"
                  data="OCT 16, 2017"
                />
              </Col>
              <Col xs={4}>
                <InfoDump
                  label="INSURANCE"
                  data="Sun Life (123-123-123)"
                />
              </Col>
              <Col xs={4}>
                <InfoDump
                  label="MEDICAL ALERT"
                  data="None"
                />
              </Col>
            </Row>
            <Row className={styles.rightContainer_content}>
              <Col xs={4}>
                <InfoDump
                  label="PATIENT DUE FOR RECALL"
                  data="March 21, 2017"
                />
              </Col>
              <Col xs={4}>
                <InfoDump
                  label="UNITS LEFT FOR COVERAGE"
                  data="7"
                />
              </Col>
              <Col xs={4}>
                <InfoDump
                  label="PRODUCTION IN CALENDAR YEAR"
                  data="$850"
                />
              </Col>
            </Row>
          </Grid>

        </div>
      </div>
    </Card>
  );
}
