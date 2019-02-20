
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { capitalize, dateFormatter, week, range } from '@carecru/isomorphic';
import { Toggle, Button } from '../../library';
import EditIcon from './EditIcon';
import styles from './reason-hours.scss';

const now = new Date();

class ReasonHours extends Component {
  constructor(props) {
    super(props);

    this.state = { showSchedule: false };
  }

  render() {
    return (
      <div className={styles.reasonHours}>
        <div className={styles.toggleWrapper}>
          <p className={styles.toggleTitle}>Availabilities Override</p>
          <div className={styles.servicesPractForm_all_toggle}>
            <Toggle
              name="allPractitioners"
              onChange={({ target: { checked } }) => this.setState({ showSchedule: checked })}
              checked={this.state.showSchedule}
            />
          </div>
        </div>
        {this.state.showSchedule && (
          <div className={styles.wrapper}>
            <div className={styles.header}>
              {week.all.map(weekDay => (
                <div className={styles.weekDayWrapper}>
                  <span className={styles.weekDay}>{capitalize(weekDay)}</span>
                  <Button className={styles.edit}>
                    <EditIcon />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
            <div className={styles.body}>
              <div className={styles.hours}>
                {range(4, 23).map(timeSlot => (
                  <div className={styles.hour}>
                    <span>
                      {dateFormatter(
                        new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeSlot, 0),
                        this.props.timezone,
                        'h A',
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.daysWrapper}>
                <div className={styles.days}>
                  {week.all.map(() => (
                    <div className={styles.column}>
                      {range(4, 23).map(() => (
                        <div className={styles.row} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

ReasonHours.propTypes = { timezone: PropTypes.string.isRequired };

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps)(ReasonHours);
