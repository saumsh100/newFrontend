import React, {Component, PropTypes} from 'react';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import _ from 'lodash';

import ServicesPractList from './ServicesPractList';
import { Form, Toggle } from '../../../library';
import styles from '../styles.scss';

function checkValues(obj) {
  const allTrue = Object.keys(obj).every((key) => {
    return obj[key];
  });
  return allTrue;
}

function createInitialValues(practitionerIds, practitioners) {
  return practitioners.map(p => {
    return practitionerIds.indexOf(p.get('id')) > -1;
  }).toJS();
}

class ServicesPractForm extends Component {
  constructor(props) {
    super(props);
    this.setAllPractitioners = this.setAllPractitioners.bind(this);
    this.setCheck = this.setCheck.bind(this);
  }

  setAllPractitioners(e) {
    e.stopPropagation();
    const { formName, values, allPractitioners } = this.props;

    const actions = Object.keys(values).map((key) => {
      return change(formName, key, !allPractitioners);
    });

    this.props.dispatch(batchActions(actions));
  }

  setCheck(e) {
    e.stopPropagation;
    this.props.allPractitioners = checkValues(this.props.values);
  }

  render() {
    const { practitioners, practitionerIds, service, formName, values } = this.props;

    let showComponent = null;
    let initialValues = null;

    if (practitioners && practitionerIds) {
      initialValues = createInitialValues(practitionerIds, practitioners);
    } else {
      return null;
    }

    if (Object.keys(initialValues).length) {
      showComponent = (
        <Form
          form={formName}
          onSubmit={this.props.handleSubmit}
          initialValues={initialValues}
        >
          {practitioners.toArray().map((practitioner, index) => {
            console.log(values[practitioner.get('id')])
            return (
              <ServicesPractList
                key={`${practitioner.get('id')}${index}`}
                practitioner={practitioner}
                fieldValue={values[practitioner.get('id')]}
              />
            );
          })}
        </Form>
      );
    }

    return (
      <div className={styles.servicesPractForm}>
        <div>All Practitioners</div>
          <Toggle
            name="allPractitioners"
            onChange={this.setAllPractitioners}
            checked={this.props.allPractitioners}
          />
          {showComponent}
      </div>
    );
  }
}

function mapStateToProps({ form }, { formName }) {
  // form data is populated when component renders
  if (!form[formName]) {
    return {
      allPractitioners: null,
      values: {}
    };
  }


  return {
    allPractitioners: checkValues(form[formName].values),
    values: form[formName].values
  };
}

export default connect(mapStateToProps, null)(ServicesPractForm);
