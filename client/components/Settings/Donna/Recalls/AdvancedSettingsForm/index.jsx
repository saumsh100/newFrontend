
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Field, Grid, Row, Col } from '../../../../library';
import styles from './styles.scss';

const isNumberAndGtZero = (val) => {
  if (parseFloat(val) <= 0) {
    return 'Positive integer';
  }
};

const isValidTime = (val) => {
  if (!val || typeof val !== 'string') return true;

  const array = val.split(':');
  if (array.length !== 3 || val.length !== 8) {
    return 'HH:MM:SS';
  }

  const hh = parseInt(array[0]);
  if (hh < 0 || hh > 24) {
    return 'HH:MM:SS';
  }

  const mm = parseInt(array[1]);
  if (mm < 0 || mm >= 60) {
    return 'Minutes must be 0 or 30';
  }

  const r = mm % 30;
  if (r !== 0) {
    return 'Minutes must be 0 or 30';
  }

  const ss = parseInt(array[2]);
  if (ss !== 0) {
    return 'Seconds must be zero';
  }
};

const options = [{ value: 'days',
  label: 'Days' }, { value: 'weeks',
  label: 'Weeks' }];

class AdvancedSettingsForm extends Component {
  render() {
    const { initialValues, onSubmit } = this.props;
    return (
      <Form
        form="recallAdvancedSettings"
        onSubmit={onSubmit}
        ignoreSaveButton
        initialValues={initialValues}
        data-test-id="recallAdvancedSettings"
      >
        <Grid>
          <Row className={styles.label}>Recall Buffer</Row>
          <Row>
            <Col xs={3}>
              <Field
                required
                name="recallBufferNumber"
                data-test-id="recallBufferNumber"
                validate={[isNumberAndGtZero]}
              />
            </Col>
            <Col xs={9} className={styles.rightCol}>
              <Field
                required
                component="DropdownSelect"
                options={options}
                name="recallBufferInterval"
                data-test-id="recallBufferInterval"
              />
            </Col>
          </Row>
        </Grid>
        <Grid>
          <Row>
            <Col xs={6}>
              <Field
                required
                name="recallStartTime"
                label="Recall Start Time"
                data-test-id="recallStartTime"
                validate={[isValidTime]}
              />
            </Col>
            <Col xs={6} className={styles.rightCol}>
              <Field
                required
                name="recallEndTime"
                label="Recall End Time"
                data-test-id="recallEndTime"
                validate={[isValidTime]}
              />
            </Col>
          </Row>
        </Grid>
      </Form>
    );
  }
}

AdvancedSettingsForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AdvancedSettingsForm;
