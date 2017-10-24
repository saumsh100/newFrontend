import React, { Component, PropTypes } from 'react';
import { Form, Field, FormSection } from '../../../library';
import moment from 'moment';
import styles from './styles.scss';

export default function SmartFiltersForm(props) {
  const {
    filterActive,
    handleSubmit,
    addFilterToTable,
  } = props;

  if (!filterActive) {
    return null;
  }

  const initialValuesObj = {}

  return (
    <div className={styles.smartFilter}>
      <Form
        onChange={values => handleSubmit(values)}
        form="SmartFilters"
        alignSave="left"
        initialValues={initialValuesObj}
        ignoreSaveButton
      >
        <div className={styles.formContainer}>
          <FormSection name="LastAppt" className={styles.filterSection}>
            <div className={styles.sectionHeader}> Last Appointment </div>
            <div className={styles.filterField}>
              <Field
                name="< 30 Days"
                component="Checkbox"
                label="Within 30 Days"
              />
              <Field
                name="< 1 Year"
                component="Checkbox"
                label="Within 1 Year"
              />
            </div>
          </FormSection>
          <FormSection name="NextAppt" className={styles.filterSection}>
            <div className={styles.sectionHeader}> Next Appointment </div>
            <div className={styles.filterField}>
              <Field
                name="< 30 Days"
                component="Checkbox"
                label="Within 30 Days"
                onChange={() => {
                  addFilterToTable([{
                    id: 'nextAppt',
                    filter: {
                      startDate: {
                        $gte: new Date(),
                        $lte: moment().add(30, 'days'),
                      },
                      isCancelled: false,
                      isDeleted: false,
                    },
                  }]);
                }}
              />
            </div>
          </FormSection>
          <FormSection name="Revenue" className={styles.filterSection}>
            <div className={styles.sectionHeader}> Production Revenue </div>
            <div className={styles.filterField}>
              <Field
                name="> $500"
                component="Checkbox"
                label="Greater than $500"
              />
            </div>
          </FormSection>
        </div>
      </Form>
    </div>
  );
}
