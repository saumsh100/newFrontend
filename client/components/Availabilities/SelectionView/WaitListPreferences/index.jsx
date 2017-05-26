
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Checkbox,
  Grid,
  Row,
  Col,
  DayPicker,
} from '../../../library';
import * as Actions from '../../../../actions/availabilities';
import styles from './styles.scss';

class WaitListPreferences extends Component {
  constructor(props) {
    super(props);

    this.updatePreferencesField = this.updatePreferencesField.bind(this);
  }

  updatePreferencesField(name) {
    return () => {
      this.props.updateWaitSpot({
        preferences: Object.assign(
          {},
          this.props.waitSpot.get('preferences').toJS(),
          {
            [name]: !this.props.waitSpot.getIn(['preferences', name]),
          },
        ),
      });
    };
  }

  render() {
    const { waitSpot, updateWaitSpot } = this.props;
    const preferences = waitSpot.get('preferences');
    return (
      <Grid className={styles.gridContainer}>
        <Row>
          <Col xs={12} sm={6}>
            <Row>
              <Col xs={12}>
                <div className={styles.label}>
                  Preferences
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Checkbox
                  className={styles.prefCheckBox}
                  checked={preferences.get('mornings')}
                  label="Mornings"
                  onChange={this.updatePreferencesField('mornings')}
                />
                <Checkbox
                  className={styles.prefCheckBox}
                  checked={preferences.get('afternoons')}
                  label="Afternoons"
                  onChange={this.updatePreferencesField('afternoons')}
                />
                <Checkbox
                  className={styles.prefCheckBox}
                  checked={preferences.get('evenings')}
                  label="Evenings"
                  onChange={this.updatePreferencesField('evenings')}
                />
              </Col>
              <Col xs={6}>
                <Checkbox
                  className={styles.prefCheckBox}
                  checked={preferences.get('weekdays')}
                  label="Weekdays"
                  onChange={this.updatePreferencesField('weekdays')}
                />
                <Checkbox
                  className={styles.prefCheckBox}
                  checked={preferences.get('weekends')}
                  label="Weekends"
                  onChange={this.updatePreferencesField('weekends')}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={6}>
            <Row>
              <Col xs={12}>
                <div className={styles.label}>
                  Select Unavailable Days
                  <DayPicker
                    multiple
                    target="icon"
                    iconClassName={styles.unavailButton}
                    value={waitSpot.get('unavailableDays').toArray()}
                    onChange={dates => updateWaitSpot({ unavailableDays: dates })}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

WaitListPreferences.propTypes = {
  waitSpot: PropTypes.object,
  updateWaitSpot: PropTypes.func.isRequired,
};

function mapStateToProps({ availabilities }) {
  return {
    waitSpot: availabilities.get('waitSpot'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateWaitSpot: Actions.updateWaitSpot,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WaitListPreferences);
