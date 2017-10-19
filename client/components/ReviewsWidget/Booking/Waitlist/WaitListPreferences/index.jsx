
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Checkbox,
  Grid,
  Row,
  Col,
  DayPicker,
} from '../../../../library';
import * as Actions from '../../../../../actions/availabilities';
import styles from './styles.scss';

class WaitListPreferences extends Component {
  constructor(props) {
    super(props);

    this.updatePreferencesField = this.updatePreferencesField.bind(this);
    this.updateDaysOfTheWeekField = this.updateDaysOfTheWeekField.bind(this);
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

  updateDaysOfTheWeekField(name) {
    return () => {
      this.props.updateWaitSpot({
        daysOfTheWeek: Object.assign(
          {},
          this.props.waitSpot.get('daysOfTheWeek').toJS(),
          {
            [name]: !this.props.waitSpot.getIn(['daysOfTheWeek', name]),
          },
        ),
      });
    };
  }

  render() {
    const { waitSpot } = this.props;
    const preferences = waitSpot.get('preferences');
    const daysOfTheWeek = waitSpot.get('daysOfTheWeek');

    const BigCheckbox = ({ name, label }) => {
      const classes = daysOfTheWeek.get(name) ? styles.on : styles.off;
      return (
        <div
          className={classes}
          onClick={this.updateDaysOfTheWeekField(name)}
        >
          {label}
        </div>
      );
    };

    return (
      <Grid className={styles.gridContainer}>
        <Row>
          <Col>
            <Row>
              <Col xs={12}>
                <div className={styles.label}>
                  Preferred Day Of The Week
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <BigCheckbox
                  name="sunday"
                  label="Sun"
                />
                <BigCheckbox
                  name="monday"
                  label="Mon"
                />
                <BigCheckbox
                  name="tuesday"
                  label="Tues"
                />
                <BigCheckbox
                  name="wednesday"
                  label="Wed"
                />
                <BigCheckbox
                  name="thursday"
                  label="Thurs"
                />
                <BigCheckbox
                  name="friday"
                  label="Fri"
                />
                <BigCheckbox
                  name="saturday"
                  label="Sat"
                />
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={6}>
            <Row>
              <Col xs={12}>
                <div className={styles.label}>
                  Preferred Timeframe
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
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

WaitListPreferences.propTypes = {
  waitSpot: PropTypes.object,
  account: PropTypes.object,
  updateWaitSpot: PropTypes.func.isRequired,
};

function mapStateToProps({ availabilities }) {
  const account = availabilities.get('account').toJS();
  return {
    account,
    waitSpot: availabilities.get('waitSpot'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateWaitSpot: Actions.updateWaitSpot,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WaitListPreferences);
