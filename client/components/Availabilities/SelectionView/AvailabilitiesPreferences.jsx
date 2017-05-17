
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Grid, Row, Col, DayPicker, DropdownSelect } from '../../library';
import * as Actions from '../../../actions/availabilities';
import styles from '../styles.scss';

function AvailabilitiesPreferences(props) {
  const {
    services,
    practitioners,
    selectedServiceId,
    selectedPractitionerId,
    selectedStartDate,
    setSelectedServiceId,
    setSelectedPractitionerId,
    setSelectedStartDate,
  } = props;

  const serviceOptions = services.get('models').map(s => ({ label: s.get('name'), value: s.get('id') })).toArray();

  const practitionerOptions = [
    { label: 'No Preference', value: '' },
    ...practitioners.get('models').map(p => ({ label: p.getFullName(), value: p.get('id') })).toArray(),
  ];

  return (
    <Grid>
      <Row>
        <Col className={styles.dsCol} xs={6}>
          <span className={styles.label}>Service</span>
          <DropdownSelect
            options={serviceOptions}
            value={selectedServiceId}
            onChange={value => setSelectedServiceId(value)}
          />
        </Col>
        <Col className={styles.dsCol} xs={6}>
          <span className={styles.label}>Practitioner</span>
          <DropdownSelect
            options={practitionerOptions}
            value={selectedPractitionerId}
            onChange={value => setSelectedPractitionerId(value)}
          />
        </Col>
      </Row>
      <Row>
        <Col className={styles.dsCol} xs={12}>
          <span className={styles.label}>Date Range</span>
          <DayPicker
            target="icon"
            iconClassName={styles.dayPickerIcon}
            value={selectedStartDate}
            onChange={value => setSelectedStartDate(value)}
          />
        </Col>
      </Row>
    </Grid>
  );
}

AvailabilitiesPreferences.propTypes = {
  services: ImmutablePropTypes.map.isRequired,
  practitioners: ImmutablePropTypes.map.isRequired,
  selectedServiceId: PropTypes.string.isRequired,
  selectedPractitionerId: PropTypes.string,
  selectedStartDate: PropTypes.string.isRequired,
  setSelectedServiceId: PropTypes.func.isRequired,
  setSelectedPractitionerId: PropTypes.func.isRequired,
  setSelectedStartDate: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setSelectedServiceId: Actions.setSelectedServiceId,
    setSelectedPractitionerId: Actions.setSelectedPractitionerId,
    setSelectedStartDate: Actions.setSelectedStartDate,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(AvailabilitiesPreferences);
