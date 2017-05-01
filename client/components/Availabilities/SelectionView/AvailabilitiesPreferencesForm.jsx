
import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Form, Field, Grid, Row, Col } from '../../library';
import styles from '../styles.scss';

function AvailabilitiesPreferencesForm(props) {
  const {
    services,
    practitioners,
    onChange,
  } = props;

  if (!services.get('models').size) {
    return null;
  }

  // Default service and practitioner selection and date
  const initialValues = {
    serviceId: services.get('models').first().get('id'),
    practitionerId: '',
    startDate: (new Date()).toISOString(),
  };

  const serviceOptions = services.get('models').map(s => ({ label: s.get('name'), value: s.get('id') })).toArray();

  const practitionerOptions = [
    { label: 'No Preference', value: '' },
    ...practitioners.get('models').map(p => ({ label: p.getFullName(), value: p.get('id') })).toArray(),
  ];

  return (
    <Form
      initialValues={initialValues}
      form="availabilitiesPreferences"
      onChange={onChange}
      onSubmit={onChange}
      ignoreSaveButton
    >
      <Grid>
        <Row>
          <Col className={styles.dsCol} xs={6}>
            <span className={styles.label}>Service</span>
            <Field
              component="DropdownSelect"
              name="serviceId"
              label="Select Service"
              options={serviceOptions}
            />
          </Col>
          <Col className={styles.dsCol} xs={6}>
            <span className={styles.label}>Practitioner</span>
            <Field
              component="DropdownSelect"
              name="practitionerId"
              label="Select Practitioner"
              options={practitionerOptions}
            />
          </Col>
        </Row>
        <Row>
          <Col className={styles.dsCol} xs={12}>
            <span className={styles.label}>Date Range</span>
            <Field
              component="DayPicker"
              name="startDate"
              target="icon"
              label="Select Service"
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

AvailabilitiesPreferencesForm.propTypes = {
  services: ImmutablePropTypes.map.isRequired,
  practitioners: ImmutablePropTypes.map.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AvailabilitiesPreferencesForm;
