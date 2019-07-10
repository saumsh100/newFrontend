
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { Form, Field, Header } from '../../library';
import ServicePractitioners from './ServicePractitioners';
import styles from './styles.scss';

const parseNum = value => value && parseInt(value, 10);

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const maxLength45 = maxLength(45);
const notNegative = value => (value && value <= 0 ? 'Must be greater than 0' : undefined);
const maxDuration = value =>
  (value && value > 180 ? 'Must be less than or equal to 180' : undefined);

class ServiceDataItem extends Component {
  constructor(props) {
    super(props);

    this.updateService = this.updateService.bind(this);
  }

  updateService(values) {
    const { service } = this.props;

    if (values && values.name) {
      values.name = values.name.trim();
    }

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

  render() {
    const { service, practitionerIds, practitioners, onSubmit } = this.props;
    if (!service) return null;

    const initialValuesBasic = {
      name: service.get('name'),
      duration: service.get('duration'),
      description: service.get('description'),
      bufferTime: service.get('bufferTime'),
    };

    const initialValuesWidget = {
      isHidden: service.get('isHidden'),
      isDefault: service.get('isDefault') || false,
    };

    return (
      <div className={styles.servicesFormRow}>
        <Header title="Reason Details" contentHeader />
        <Form
          form={`${service.get('id')}basicForm`}
          onSubmit={this.updateService}
          initialValues={initialValuesBasic}
          data-test-id="serviceDataForm"
          alignSave="left"
        >
          <Field required name="name" label="Name" validate={[maxLength45]} data-test-id="name" />
          <Field name="description" label="Description" data-test-id="description" />
          <Field
            required
            name="duration"
            label="Duration"
            type="number"
            normalize={parseNum}
            validate={[notNegative, maxDuration]}
          />
        </Form>
        <ServicePractitioners
          service={service}
          practitionerIds={practitionerIds}
          updateService={onSubmit}
          practitioners={practitioners}
        />
        <div className={styles.servicesFormRow_widget}>
          <Header
            title="Booking Widget Settings"
            className={styles.servicesFormRow_contentHeader}
            contentHeader
          />
          <Form
            form={`${service.get('id')}WidgetForm`}
            onSubmit={this.updateService}
            initialValues={initialValuesWidget}
            alignSave="left"
          >
            <div className={styles.servicesFormRow_widget_content}>
              <div className={styles.servicesFormRow_hiddenText}>
                <span className={styles.servicesFormRow_hiddenText_text}> Set as hidden </span>
                <div className={styles.servicesFormRow_hiddenText_toggle}>
                  <Field name="isHidden" component="Toggle" />
                </div>
              </div>
              <div className={styles.servicesFormRow_hiddenText}>
                <span className={styles.servicesFormRow_hiddenText_text}> Set as default </span>
                <div className={styles.servicesFormRow_hiddenText_toggle}>
                  <Field name="isDefault" component="Toggle" />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

ServiceDataItem.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  service: PropTypes.shape({
    id: PropTypes.string,
    accountId: PropTypes.string,
    name: PropTypes.string,
    pmsId: PropTypes.string,
    duration: PropTypes.number,
    bufferTime: PropTypes.number,
    unitCost: PropTypes.number,
    isHidden: PropTypes.bool,
    isDefault: PropTypes.bool,
  }),
  practitioners: PropTypes.instanceOf(Map).isRequired,
  practitionerIds: PropTypes.oneOfType([
    PropTypes.instanceOf(List),
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

ServiceDataItem.defaultProps = {
  service: null,
};

export default ServiceDataItem;
