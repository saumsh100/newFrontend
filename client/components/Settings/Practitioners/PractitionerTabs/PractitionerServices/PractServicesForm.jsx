import React, {Component, PropTypes} from 'react';
import PractServicesList from './PractServicesList';
import { Form, Field, Toggle} from '../../../../library';
import { change } from 'redux-form';
import _ from 'lodash';
import { batchActions } from 'redux-batched-actions';
import { connect } from 'react-redux';

function checkValues(obj) {
  const allTrue = Object.keys(obj).every((key) =>
  { return obj[key] });
  return allTrue;
}

class PractServicesForm extends Component {
  constructor(props) {
    super(props);
    this.setAllServices = this.setAllServices.bind(this);
    this.setCheck = this.setCheck.bind(this);
  }

  setAllServices(e) {
    e.stopPropagation();
    const { formName, values, allServices } = this.props;

    const actions = Object.keys(values).map((key) => {
        return change(formName, key, !allServices);
    });

    this.props.dispatch(batchActions(actions));
  }

  setCheck(e) {
    e.stopPropagation;
    this.props.allServices = checkValues(this.props.values);
  }
  render() {
    const { services, practitioner, initialValues, formName, values } = this.props;

    let showComponent = null;

    if (services) {
      showComponent = (
        <div>
          <div>All Services</div>
            <Toggle
              name="allServices"
              onChange={this.setAllServices}
              checked={this.props.allServices}
            />
          <Form
            form={formName}
            onSubmit={this.props.handleSubmit}
            initialValues={initialValues}
            enableReinitialize
            keepDirtyOnReinitialize
            destroyOnUnmount={false}
          >
            {services.toArray().map((service, index) => {
              return (
                <PractServicesList
                  key={`${practitioner.get('id')}${index}`}
                  service={service}
                />
              );
            })}
          </Form>
        </div>
      )
    }

    return (
      <div>
        {showComponent}
      </div>
    );
  }
}

function mapStateToProps({ form }, { formName }) {
  // form data is populated when component renders
  if (!form[formName]) {
    return {
      allServices: null,
      values: {}
    };
  }

  return {
    allServices: checkValues(form[formName].values),
    values: form[formName].values
  };
}

export default connect(mapStateToProps, null)(PractServicesForm);
