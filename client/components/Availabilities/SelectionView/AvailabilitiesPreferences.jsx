
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { Grid, Row, Col, DayPicker, DropdownSelect, PractitionerAvatar } from '../../library';
import * as Actions from '../../../actions/availabilities';
import styles from '../styles.scss';

function PractitionerListItem({ option }) {
  const {
    value,
    label,
    practitioner,
    ignore,
  } = option;

  if (ignore) return <div className={styles.practitionerItem}>{label || value}</div>;
  return (
    <div className={styles.practitionerItem}>
      <PractitionerAvatar practitioner={practitioner} />
      <div className={styles.labelText}>
        {label}
      </div>
    </div>
  );
}

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

  const filteredPractitioners = practitioners.get('models').filter((prac) => {
    return prac.get('isActive');
  });

  const practitionerOptions = [
    { label: 'No Preference', value: '', ignore: true },
    ...filteredPractitioners.map(p => ({
      label: p.getPrettyName(),
      value: p.get('id'),
      practitioner: p.toJS(),
    })).toArray(),
  ];

  return (
    <Grid>
      <Row>
        <Col className={styles.dsCol} xs={6}>
          <span className={styles.label}>Service</span>
          <DropdownSelect
            className={styles.dropdown}
            options={serviceOptions}
            value={selectedServiceId}
            onChange={value => setSelectedServiceId(value)}
          />
        </Col>
        <Col className={styles.dsCol} xs={6}>
          <span className={styles.label}>Practitioner</span>
          <DropdownSelect
            align="right"
            className={styles.dropdown}
            options={practitionerOptions}
            template={PractitionerListItem}
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
            disabledDays={date => moment().isAfter(date)}
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
