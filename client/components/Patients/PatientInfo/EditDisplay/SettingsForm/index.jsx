
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { Map } from 'immutable';
import classNames from 'classnames';
import { convertIntervalToMs, intervalToNumType } from '@carecru/isomorphic';
import OmitForm from '../OmitForm';
import { Grid, Row, Col, Form, Field, FormSection } from '../../../../library';
import { capitalizeText } from '../../../../../components/Utils';
import { isResponsive } from '../../../../../util/hub';
import styles from '../styles.scss';

const getId = v => v.get('id');

const sanitizeList = list =>
  list.filter(v => v.isActive).sortBy(r => -convertIntervalToMs(r.interval));

const singularType = {
  weeks: 'week',
  months: 'month',
};

const pluralType = {
  weeks: 'weeks',
  months: 'months',
};

const getTypeWord = (num, type) => {
  if (Math.abs(num) === 1) {
    return singularType[type];
  }
  return pluralType[type];
};

class SettingsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      omitReminderIds: props.patient.omitReminderIds.filter(id =>
        sanitizeList(props.reminders).get(id)),
      omitRecallIds: props.patient.omitRecallIds.filter(id => sanitizeList(props.recalls).get(id)),
    };

    this.omitFormHandler = this.omitFormHandler.bind(this);
  }

  getSettingType(key) {
    const sMap = {
      omitReminderIds: 'reminders',
      omitRecallIds: 'recalls',
    };

    return sMap[key] || sMap;
  }

  omitFormHandler(setting) {
    return toOmit =>
      this.setState({ [setting]: toOmit }, () => {
        const settingFieldName = this.getSettingType(setting);

        const settingNextState =
          this.state[setting].length !== sanitizeList(this.props[settingFieldName]).size;

        // check if all child toggles are on/off and updates the parent accordingly
        if (this.props[`${settingFieldName}Field`] !== settingNextState) {
          this.props.change(
            'Form4',
            `preferences.${this.getSettingType(setting)}`,
            settingNextState,
          );
        }
      });
  }

  render() {
    const { handleSubmit, patient, reminders, recalls } = this.props;
    const { omitReminderIds, omitRecallIds } = this.state;
    const { preferences } = patient;
    return (
      <Form
        form="Form4"
        onSubmit={values =>
          handleSubmit({
            ...values,
            ...this.state,
          })
        }
        onChange={(values) => {
          this.setState(
            prev =>
              Object.keys(this.state).reduce((acc, setting) => {
                const settingFieldName = this.getSettingType(setting);

                // if the user disables all reminders/recalls
                if (!values.preferences[settingFieldName]) {
                  acc = {
                    ...acc,
                    [setting]: sanitizeList(this.props[settingFieldName])
                      .toArray()
                      .map(getId),
                  };
                  // if the user enables all reminders/recalls
                } else if (values.preferences[settingFieldName]) {
                  acc = {
                    ...acc,
                    [setting]:
                      // check if some omit toggle was already on
                      prev[setting].length > 0 &&
                      prev[setting].length < sanitizeList(this.props[settingFieldName]).size
                        ? prev[setting]
                        : [],
                  };
                }
                return acc;
              }, prev),
            () => {
              Object.keys(this.state).map((setting) => {
                const settingFieldName = this.getSettingType(setting);
                // dispatch updates to the child form inputs
                return sanitizeList(this.props[settingFieldName])
                  .toArray()
                  .map(r =>
                    this.props.change(
                      `${setting}_${patient.id}`,
                      r.get('id'),
                      !this.state[setting].includes(r.get('id')),
                    ));
              });
            },
          );
        }}
        className={styles.formContainer}
        initialValues={{ preferences }}
        ignoreSaveButton={!isResponsive()}
      >
        <FormSection name="preferences">
          <Grid className={styles.grid}>
            <div className={styles.topPadding}>&nbsp;</div>
            <div className={styles.settingsHeader}> Subscriptions </div>
            <Row className={styles.row}>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Special/Holiday Messages</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="birthdayMessage" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Newsletter</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="newsletter" />
                  </div>
                </div>
              </Col>
            </Row>
            <div className={styles.settingsHeader}> Services </div>
            <Row className={styles.row}>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Appointment Reminders</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="reminders" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={classNames(styles.colToggle, styles.omitFormWrapper)}>
                <OmitForm
                  formName={`omitReminderIds_${patient.id}`}
                  value={omitReminderIds}
                  toggles={sanitizeList(reminders).toArray()}
                  onChange={this.omitFormHandler('omitReminderIds')}
                  renderToggles={({ toggleComponent, toggleProps }) => {
                    const text = `${toggleProps.interval} reminder`;
                    return (
                      <div className={styles.omitToggleWrapper}>
                        {toggleComponent({
                          label: capitalizeText(text),
                          name: toggleProps.id,
                        })}
                      </div>
                    );
                  }}
                />
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Patient Recalls</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="recalls" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={classNames(styles.colToggle, styles.omitFormWrapper)}>
                <OmitForm
                  formName={`omitRecallIds_${patient.id}`}
                  value={omitRecallIds}
                  toggles={sanitizeList(recalls).toArray()}
                  onChange={this.omitFormHandler('omitRecallIds')}
                  renderToggles={({ toggleComponent, toggleProps }) => {
                    const { num, type } = intervalToNumType(toggleProps.interval);
                    const text = `${Math.abs(num)} ${getTypeWord(num, type)} ${
                      num >= 0 ? 'before' : 'after'
                    } due date`;

                    return (
                      <div className={styles.omitToggleWrapper}>
                        {toggleComponent({
                          label: capitalizeText(text),
                          name: toggleProps.id,
                        })}
                      </div>
                    );
                  }}
                />
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Review Requests</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="reviews" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Referral Requests</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="referrals" />
                  </div>
                </div>
              </Col>
            </Row>
            <div className={styles.settingsHeader}> Contact Methods </div>
            <Row className={styles.row}>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Email</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="emailNotifications" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>SMS</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="sms" />
                  </div>
                </div>
              </Col>
              <Col xs={12} className={styles.colToggle}>
                <div className={styles.toggleContainer}>
                  <div className={styles.toggleContainer_label}>Phone</div>
                  <div className={styles.toggleContainer_toggle}>
                    <Field component="Toggle" name="phone" />
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>
        </FormSection>
      </Form>
    );
  }
}

const selector = formValueSelector('Form4');

const mapStateToProps = state => ({
  remindersField: selector(state, 'preferences.reminders'),
  recallsField: selector(state, 'preferences.recalls'),
});

const mapDispatchToProps = dispatch => bindActionCreators({ change }, dispatch);

SettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  patient: PropTypes.shape({
    preferences: PropTypes.objectOf(PropTypes.bool),
    omitReminderIds: PropTypes.arrayOf(PropTypes.bool),
    omitRecallIds: PropTypes.arrayOf(PropTypes.bool),
  }).isRequired,
  reminders: PropTypes.instanceOf(Map).isRequired,
  recalls: PropTypes.instanceOf(Map).isRequired,
  change: PropTypes.func.isRequired,
  // Those props are not being called by their name so they throw this lint error
  remindersField: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  recallsField: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
};

SettingsForm.defaultProps = {
  remindersField: null,
  recallsField: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsForm);
