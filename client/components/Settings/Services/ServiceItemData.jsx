import React, {Component, PropTypes } from 'react';
import { Map } from 'immutable';
import {  Form, Field, IconButton, CardHeader } from '../../library';
import styles from './styles.scss';

const parseNum = value => value && parseInt(value);

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(25);

const notNegative = value => value && value <= 0 ? 'Must be greater than 0' : undefined;


class ServiceItemData extends Component {
  constructor(props) {
    super(props)
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  updateService(values) {
    const { service } = this.props;
    values.name = values.name.trim();

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
      <div>
        <div className={styles.serviceHeaderContainer}>
          <div className={styles.serviceHeader}>
            {service.get('name')}
          </div>
          <div className={styles.trashButton}>
            <IconButton
              icon="trash"
              className={styles.trashButton__trashIcon}
              onClick={this.deleteService}
            />
          </div>
        </div>
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
                    validate={[maxLength25]}
                  />
                </div>
                <div className={styles.servicesFormField}>
                  <Field
                    required
                    name="duration"
                    label="Duration"
                    type="number"
                    normalize={parseNum}
                    validate={[notNegative]}
                  />
                </div>
                <div className={styles.servicesFormField}>
                  <Field
                    required
                    name="bufferTime"
                    label="Buffer Time"
                    type="number"
                    normalize={parseNum}
                    validate={[notNegative]}
                  />
                </div>
              </div>
            </Form>
          </div>

        </div>
      </div>
    );
  }
}

export default ServiceItemData;
