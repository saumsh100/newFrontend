
import React, { Component } from 'react';
import PractServicesList from './PractServicesList';
import { Form, Toggle } from '../../../../library';
import { change } from 'redux-form';
import { batchActions } from 'redux-batched-actions';
import { connect } from 'react-redux';
import styles from './styles.scss';

function checkValues(obj) {
  return Object.keys(obj).every(key => obj[key]);
}

class PractServicesForm extends Component {
  constructor(props) {
    super(props);
    this.setAllServices = this.setAllServices.bind(this);
  }

  setAllServices(e) {
    e.stopPropagation();
    const { formName, values, allServices } = this.props;

    const actions = Object.keys(values).map(key => change(formName, key, !allServices));

    this.props.dispatch(batchActions(actions));
  }

  render() {
    const { services, practitioner, initialValues, formName, values } = this.props;

    let showComponent = null;

    if (services) {
      showComponent = (
        <div className={styles.formContainer}>
          <div className={styles.allContainer}>
            <div className={styles.allText}>All Reasons</div>
            <div className={styles.allToggle}>
              <Toggle
                name="allServices"
                onChange={this.setAllServices}
                checked={this.props.allServices}
              />
            </div>
          </div>
          <Form
            form={formName}
            onSubmit={this.props.handleSubmit}
            initialValues={initialValues}
            enableReinitialize
            keepDirtyOnReinitialize
            destroyOnUnmount={false}
            data-test-id="practitionerServicesForm"
            alignSave="left"
          >
            <div className={styles.formContainer_content}>
              {services.toArray().map((service, index) => (
                <PractServicesList
                  key={`${practitioner.get('id')}${index}`}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          </Form>
        </div>
      );
    }

    return <div>{showComponent}</div>;
  }
}

function mapStateToProps({ form }, { formName }) {
  // form data is populated when component renders
  if (!form[formName]) {
    return {
      allServices: null,
      values: {},
    };
  }

  return {
    allServices: checkValues(form[formName].values),
    values: form[formName].values,
  };
}

export default connect(
  mapStateToProps,
  null,
)(PractServicesForm);
