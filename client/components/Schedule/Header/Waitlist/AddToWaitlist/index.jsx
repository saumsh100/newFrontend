
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment/moment';
import omit from 'lodash/omit';
import { reset } from 'redux-form';
import { bindActionCreators } from 'redux';
import { fetchEntitiesRequest } from '../../../../../thunks/fetchEntities';
import { Form, FormSection, Field, Grid, Row, Col, Avatar, Icon } from '../../../../library/index';
import styles from './styles.scss';
import { Create as CreateWaitSpot } from '../../../../RelayWaitlist';

const autoStyles = {
  group: styles.groupStyle,
  error: styles.errorStyle,
  icon: styles.iconStyle,
};

const initialValues = {
  preferences: {
    mornings: true,
    afternoons: true,
    evenings: true,
    weekdays: true,
    weekends: true,
  },

  unavailableDays: [],
};

class AddToWaitlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patientSearched: null,
    };

    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
    this.handleCreateWaitSpot = this.handleCreateWaitSpot.bind(this);
  }

  getSuggestions(value) {
    return this.props
      .fetchEntitiesRequest({ url: '/api/patients/search', params: { patients: value } })
      .then(searchData => searchData.patients)
      .then((searchedPatients) => {
        const patientList = Object.keys(searchedPatients).length
          ? Object.keys(searchedPatients).map(key => searchedPatients[key])
          : [];

        patientList.map((patient) => {
          patient.display = (
            <div className={styles.suggestionContainer}>
              <Avatar user={patient} size="xs" />
              <div className={styles.suggestionContainer_details}>
                <div className={styles.suggestionContainer_fullName}>
                  {`${patient.firstName} ${patient.lastName}${
                    patient.birthDate ? `, ${moment().diff(patient.birthDate, 'years')}` : ''
                    }`}
                </div>
                <div className={styles.suggestionContainer_date}>
                  Last Appointment:{' '}
                  {patient.lastApptDate ? moment(patient.lastApptDate).format('MMM D YYYY') : 'n/a'}
                </div>
              </div>
            </div>
          );
          return patient;
        });

        return patientList;
      });
  }

  handleAutoSuggest(newValue) {
    if (typeof newValue === 'object') {
      this.setState({
        patientSearched: newValue,
      });
    } else if (newValue === '') {
      this.setState({
        patientSearched: '',
      });
    }
  }

  handleCreateWaitSpot(values) {
    const newValues = Object.assign(
      {
        patientId: values.patientData.id,
        endDate: moment()
          .add(1, 'days')
          .toISOString(),
        accountId: this.props.accountId,
      },
      omit(values, ['patientData']),
    );

    CreateWaitSpot.commit(newValues);
    this.props.onSubmit();
    this.props.reset(this.props.formName);

    this.setState({
      patientSearched: null,
    });
  }

  render() {
    const { formName } = this.props;
    const { patientSearched } = this.state;

    const displayField = !patientSearched ? (
      <Field
        component="AutoComplete"
        name="patientData"
        label="Enter Patient Name"
        getSuggestions={this.getSuggestions}
        placeholder="Add Patient"
        theme={autoStyles}
        onChange={(e, newValue) => this.handleAutoSuggest(newValue)}
        icon="search"
        data-test-id="patientData"
        required
      />
    ) : (
      <div
        className={styles.patientContainer}
        onClick={() => this.handleAutoSuggest('')}
        role="presentation"
      >
        <Avatar user={patientSearched} size="sm" />
        <div className={styles.patientContainer_name}>
          {patientSearched.firstName} {patientSearched.lastName}
        </div>
        <div className={styles.patientContainer_icon}>
          <Icon icon="search" />
        </div>
      </div>
    );

    return (
      <Form
        form={formName}
        onSubmit={this.handleCreateWaitSpot}
        initialValues={initialValues}
        ignoreSaveButton
        data-test-id={formName}
      >
        <Grid className={styles.addToContainer}>
          <Row className={styles.searchContainer}>
            <Col xs={12} md={12}>
              {displayField}
            </Col>
          </Row>
          <FormSection name="daysOfTheWeek">
            <Row>
              <Col xs={12} className={styles.subHeaderMargin}>
                Preferred Day of the Week
              </Col>
            </Row>
            <Row className={styles.dayContainer}>
              <div className={styles.colSpacing}>
                <Field component="CheckboxButton" name="sunday" label="Sun" />
              </div>
              <div className={styles.colSpacing}>
                <Field component="CheckboxButton" name="monday" label="Mon" data-test-id="monday" />
              </div>
              <div className={styles.colSpacing}>
                <Field component="CheckboxButton" name="tuesday" label="Tue" />
              </div>
              <div className={styles.colSpacing}>
                <Field component="CheckboxButton" name="wednesday" label="Wed" />
              </div>
              <div className={styles.colSpacing}>
                <Field component="CheckboxButton" name="thursday" label="Thur" />
              </div>
              <div className={styles.colSpacing}>
                <Field component="CheckboxButton" name="friday" label="Fri" />
              </div>
              <div className={styles.colSpacing}>
                <Field component="CheckboxButton" name="saturday" label="Sat" />
              </div>
            </Row>
          </FormSection>
          <Row className={styles.subContainer}>
            <Col xs={12} md={6}>
              <Row>
                <Col xs={12}>
                  <div className={styles.subHeaderExtended}>Preferred Timeframe</div>
                </Col>
              </Row>
              <FormSection name="preferences">
                <Row>
                  <Col xs={12} md={12}>
                    <Field name="mornings" component="Checkbox" label="Mornings" />
                    <Field name="afternoons" component="Checkbox" label="Afternoons" />
                    <Field name="evenings" component="Checkbox" label="Evenings" />
                  </Col>
                </Row>
              </FormSection>
            </Col>
          </Row>
        </Grid>
      </Form>
    );
  }
}

AddToWaitlist.propTypes = {
  formName: PropTypes.string.isRequired,
  accountId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }) => {
  const accountId = auth.get('accountId');

  return {
    accountId,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchEntitiesRequest,
      reset,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddToWaitlist);
