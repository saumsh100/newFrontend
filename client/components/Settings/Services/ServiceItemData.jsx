import React, {Component, PropTypes } from 'react';
import { Map } from 'immutable';
import {  Form, Field, IconButton } from '../../library';
import styles from './styles.scss';

function isNumber(value){
  return value && !/\D/.test(value) ? undefined : 'Please enter a number.';
}

class ServiceItemData extends Component {
  constructor(props) {
    super(props)
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  updateService(values) {
    const { service } = this.props;
    const valuesMap = Map(values);
    const modifiedService = service.merge(valuesMap);
    this.props.onSubmit(modifiedService);
  }

  deleteService() {
    const { service } = this.props;
    this.props.deleteService(service.get('id'));
  }

  render() {
    const { service } = this.props;

    if(!service) {
      return null;
    }

    const initialValues = {
      name: service.get('name'),
      duration: service.get('duration'),
      bufferTime: service.get('bufferTime'),
    };

    return (
      <div className={styles.formContainer}>
        <div className={styles.servicesForm}>
          <Form
            form={`${service.get('id')}Form`}
            onSubmit={this.updateService}
            initialValues={initialValues}
          >
            <div className={styles.servicesFormRow}>
              <div className={styles.servicesFormField}>
                <Field
                  required
                  name="name"
                  label="Name"
                />
              </div>
              <div className={styles.servicesFormField}>
                <Field
                  required
                  name="duration"
                  label="Duration"
                  validate={[isNumber]}
                />
              </div>
              <div className={styles.servicesFormField}>
                <Field
                  required
                  name="bufferTime"
                  label="Buffer Time"
                  validate={[isNumber]}
                />
              </div>
            </div>
          </Form>
        </div>
        <div className={styles.trashButton}>
          <IconButton
            icon="trash-o"
            className={styles.trashButton__trashIcon}
            onClick={this.deleteService}
          />
        </div>
      </div>
    );
  }
}

export default ServiceItemData;
