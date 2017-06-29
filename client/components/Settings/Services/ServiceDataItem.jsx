import React, {Component, PropTypes } from 'react';
import { Map } from 'immutable';
import {  Form, Field, IconButton, Header, } from '../../library';
import styles from './styles.scss';

const parseNum = value => value && parseInt(value);

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength45 = maxLength(45);
const notNegative = value => value && value <= 0 ? 'Must be greater than 0' : undefined;
const maxDuration = value => value && value > 180 ? 'Must be less than or equal to 180' : undefined;


class ServiceDataItem extends Component {
  constructor(props) {
    super(props)
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  updateService(values) {
    const { service } = this.props;
    values.name = values.name.trim();

    const valuesMap = Map(values);

    const alert = {
      success: {
        body: `${service.get('name')} service was updated`,
      },
      error: {
        body: `${service.get('name')} service update failed`,
      },
    };

    const modifiedService = service.merge(valuesMap);
    this.props.onSubmit(modifiedService, alert);
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

    let showComponent = null;

    if (service) {
      const initialValues = {
        name: service.get('name'),
        duration: service.get('duration'),
        bufferTime: service.get('bufferTime'),
        isHidden: service.get('isHidden'),
        isDefault: service.get('isDefault') || false,
      };

      showComponent = (
        <div>
          <div className={styles.serviceHeaderContainer}>
            <Header title={service.get('name')} />
            <div className={styles.trashButton}>
              <IconButton icon="trash" className={styles.trashButton__trashIcon} onClick={this.deleteService} />
            </div>
          </div>
          <h2 className={styles.header}>Services</h2>
          <div className={styles.servicesFormRow}>
            <Form
              form={`${service.get('id')}Form`}
              onSubmit={this.updateService}
              initialValues={initialValues}
              data-test-id="serviceDataForm"
            >
              <Field
                required
                name="name"
                label="Name"
                validate={[maxLength45]}
                data-test-id="name"
              />
              <Field
                required
                name="duration"
                label="Duration"
                type="number"
                normalize={parseNum}
                validate={[notNegative, maxDuration]}
              />
              <Field
                name="bufferTime"
                label="Buffer Time"
                type="number"
                normalize={parseNum}
                validate={[notNegative, maxDuration]}
              />
              <div className={styles.servicesPractForm_hiddentext}>
                Would you like to set this service to be hidden on the booking widget ?
                <div className={styles.servicesPractForm_hiddentext_toggle}>
                  <Field
                    name="isHidden"
                    component="Toggle"
                  />
                </div>
              </div>
              <div className={styles.servicesPractForm_hiddentext}>
                Would you like to set this service to be the default on the booking widget ?
                <div className={styles.servicesPractForm_hiddentext_toggle}>
                  <Field
                    name="isDefault"
                    component="Toggle"
                  />
                </div>
              </div>

            </Form>
          </div>
        </div>
      );
    }

    return (
      <div>
        {showComponent}
      </div>
    );
  }
}

export default ServiceDataItem;
