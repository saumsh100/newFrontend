import React, {Component, PropTypes } from 'react';
import { Map } from 'immutable';
import {  Form, Field, Button, Header, } from '../../library';
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

    let deleteService = confirm('Are you sure you want to delete this service?');

    if (deleteService) {
      this.props.deleteService(service.get('id'));
    }
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

    const practitionerIds = service.get('practitioners');

    return (
      <div>
        <div className={styles.serviceHeaderContainer}>
          <Header title={service.get('name')} />
          <div className={styles.trashButton}>
            <Button icon="trash" notflat raised className={styles.trashButton__trashIcon} onClick={this.deleteService}>
              Delete
            </Button>
          </div>
        </div>
        <div className={styles.servicesFormRow}>
          <Form
            form={`${service.get('id')}Form`}
            onSubmit={this.updateService}
            initialValues={initialValues}
          >
            <Field
              required
              name="name"
              label="Name"
              validate={[maxLength25]}
            />
            <Field
              required
              name="duration"
              label="Duration"
              type="number"
              normalize={parseNum}
              validate={[notNegative]}
            />
            <Field
              required
              name="bufferTime"
              label="Buffer Time"
              type="number"
              normalize={parseNum}
              validate={[notNegative]}
            />
          </Form>
        </div>
      </div>
    );
  }
}

export default ServiceItemData;
