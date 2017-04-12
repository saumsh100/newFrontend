
import React, { PropTypes } from 'react';
import { Form, Field, Grid, Row, Col } from '../library';
import styles from './styles.scss';

function AvailabilitiesPreferencesForm(props) {
  const {
    services,
    practitioners,
    onChange,
  } = props;

  if (!services.length) {
    return null;
  }

  const initialValues = {
    serviceId: services[0].id,
    practitionerId: '',
  };

  const serviceOptions = services.map(s => ({ label: s.get('name'), value: s.get('id') }));

  const practitionerOptions = [
    { label: 'No Preference', value: '' },
    ...practitioners.map(p => ({ label: p.getFullName(), value: p.get('id') })),
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
              component="DropdownSelect"
              name="serviceId"
              label="Select Service"
              options={serviceOptions}
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

AvailabilitiesPreferencesForm.propTypes = {
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
  practitioners: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AvailabilitiesPreferencesForm;
