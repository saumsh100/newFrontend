
import React, { Component, PropTypes } from 'react';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { Header, Form, Toggle } from '../../../library';
import ServicesPractList from './ServicesPractList';
import styles from '../styles.scss';

function checkValues(obj) {
  return Object.keys(obj).every(key => obj[key]);
}

function createInitialValues(practitionerIds, practitioners) {
  return practitioners
    .map(p => practitionerIds.indexOf(p.get('id')) > -1)
    .toJS();
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

    const actions = Object.keys(values).map(key =>
      change(formName, key, !allPractitioners));

    this.props.dispatch(batchActions(actions));
  }

  setCheck(e) {
    e.stopPropagation();
    this.props.allPractitioners = checkValues(this.props.values);
  }

  render() {
    const { practitioners, practitionerIds, formName } = this.props;

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
          enableReinitialize
          keepDirtyOnReinitialize
          destroyOnUnmount={false}
          data-test-id="servicePractitionersForm"
          alignSave="left"
        >
          <div className={styles.servicesPractForm_serviceList}>
            {practitioners
              .toArray()
              .map((practitioner, index) => (
                <ServicesPractList
                  key={`${practitioner.get('id')}${index}`}
                  practitioner={practitioner}
                  index={index}
                />
              ))}
          </div>
        </Form>
      );
    }

    return (
      <div>
        <Header
          className={styles.header}
          title="Practitioners Performing This Reason"
          contentHeader
        />
        <div className={styles.servicesPractForm}>
          <div className={styles.servicesPractForm_all}>
            <span className={styles.servicesPractForm_all_text}>
              {' '}
              All Practitioners
            </span>
            <div className={styles.servicesPractForm_all_toggle}>
              <Toggle
                name="allPractitioners"
                onChange={this.setAllPractitioners}
                checked={this.props.allPractitioners}
              />
            </div>
          </div>
          {showComponent}
        </div>
      </div>
    );
  }
}

ServicesPractForm.propTypes = {
  allPractitioners: PropTypes.bool,
  practitioners: PropTypes.instanceOf(Map),
  practitionerIds: PropTypes.arrayOf(PropTypes.string),
  formName: PropTypes.string,
  values: PropTypes.objectOf(PropTypes.string),
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
};

function mapStateToProps({ form }, { formName }) {
  if (!form[formName]) {
    return {
      allPractitioners: null,
      values: {},
    };
  }

  return {
    allPractitioners: checkValues(form[formName].values),
    values: form[formName].values,
  };
}

export default connect(
  mapStateToProps,
  null,
)(ServicesPractForm);
