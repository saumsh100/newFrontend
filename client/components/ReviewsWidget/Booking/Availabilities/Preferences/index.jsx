
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { Grid, Row, Col, DayPicker, DropdownSelect, PractitionerAvatar } from '../../../../library';
import * as Actions from '../../../../../actions/availabilities';
import styles from './styles.scss';

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
      <PractitionerAvatar practitioner={practitioner} size="xs" />
      <div className={styles.labelText}>
        {label}
      </div>
    </div>
  );
}

function Preferences(props) {
  const {
    services,
    practitioners,
    selectedServiceId,
    selectedPractitionerId,
    setSelectedServiceId,
    setSelectedPractitionerId,
    account,
  } = props;

  const serviceOptions = services.get('models').map(s => ({ label: s.get('name'), value: s.get('id') })).toArray();

  const filteredPractitioners = practitioners.get('models').filter((prac) => {
    return prac.get('isActive') && !prac.get('isHidden');
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
    <div className={styles.preferencesWrapper}>
      {/* Couldn't use Grid here because the breakpoints are not customizable */}
      <div className={styles.fieldWrapper}>
        <DropdownSelect
          label="Reason for Appointment"
          className={styles.dropdown}
          options={serviceOptions}
          value={selectedServiceId}
          onChange={value => setSelectedServiceId(value)}
        />
      </div>
      <div className={styles.fieldWrapper}>
        <DropdownSelect
          align="right"
          label="Select a Practitioner"
          className={styles.dropdown}
          options={practitionerOptions}
          template={PractitionerListItem}
          value={selectedPractitionerId}
          onChange={value => setSelectedPractitionerId(value)}
        />
      </div>
    </div>
  );
}

Preferences.propTypes = {
  account: ImmutablePropTypes.map.isRequired,
  services: ImmutablePropTypes.map.isRequired,
  practitioners: ImmutablePropTypes.map.isRequired,
  selectedServiceId: PropTypes.string.isRequired,
  selectedPractitionerId: PropTypes.string,
  setSelectedServiceId: PropTypes.func.isRequired,
  setSelectedPractitionerId: PropTypes.func.isRequired,
};

function mapStateToProps({ entities, availabilities }) {
  const account = availabilities.get('account').toJS();
  return {
    account,
    services: entities.get('services'),
    practitioners: entities.get('practitioners'),
    selectedServiceId: availabilities.get('selectedServiceId'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setSelectedServiceId: Actions.setSelectedServiceId,
    setSelectedPractitionerId: Actions.setSelectedPractitionerId,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
