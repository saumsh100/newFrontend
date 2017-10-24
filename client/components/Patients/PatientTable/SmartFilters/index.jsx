import React, { Component, PropTypes } from 'react';
import { Form, Field, FormSection } from '../../../library';
import styles from './styles.scss';

class SmartFilters extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const {
      setSmartFilter,
      reinitializeState,
    } = this.props;


    const valueKeys = Object.keys(values);
    const filterArray = []
    valueKeys.map((key)=> {
      const innerObj = values[key]
      const innerKeys = Object.keys(innerObj);

      const innerValues = innerKeys.filter((innerKey) => {
        if (innerObj[innerKey]) {
          return innerKey;
        }
      });

      if (innerValues.length) {
        filterArray.push({
          id: key,
          data: innerValues,
        });
      }
    });
    reinitializeState();
    setSmartFilter({ filterData: filterArray });
  }

  render() {
    const {
      filterActive,
      smartFilters,
    } = this.props;

    if (!filterActive) {
      return null;
    }

    const initialValuesObj = {}

    smartFilters.map((filter) => {
      const key = filter.id;
      const mergeObj = {}
      const dataArray = filter.data;
      dataArray.map((dataKey) => {
        mergeObj[dataKey] = true;
      });

      initialValuesObj[key] = mergeObj;
    });


    return (
      <div className={styles.smartFilter}>
        <Form
          onSubmit={this.handleSubmit}
          form="SmartFilters"
          initialValues={initialValuesObj}
          alignSave="left"
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
}

export default SmartFilters;
