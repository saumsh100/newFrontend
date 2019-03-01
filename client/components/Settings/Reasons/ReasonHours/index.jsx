
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import moment from 'moment-timezone';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { capitalize, range, week } from '@carecru/isomorphic';
import { Button, Toggle } from '../../../library';
import EditIcon from '../EditIcon';
import FetchReasonHours from '../../../GraphQL/ReasonHours/fetchReasonHours';
import Service from '../../../../entities/models/Service';
import ReasonWeeklyHoursToggle from './ReasonWeeklyHoursToggle';
import WeeklyHoursModifiers from './WeeklyHoursModifiers';
import { updateEntity } from '../../../../reducers/entities';
import styles from './styles.scss';

const rangeStartTime = 4;
const rangeEndTime = 23;

class ReasonHours extends Component {
  constructor(props) {
    super(props);

    this.toggleReasonWeeklyHours = this.toggleReasonWeeklyHours.bind(this);
  }

  /**
   * It fires the GraphQL function for either create or delete a ReasonWeeklyHours,
   * right after the action we are updating the entity so the UI can represent the changes.
   *
   * @param checked
   * @param callback
   * @return {Promise<void>}
   */
  async toggleReasonWeeklyHours(checked, callback) {
    const { reason } = this.props;
    try {
      const variables = checked
        ? {
          accountId: reason.get('accountId'),
          reasonId: reason.get('id'),
          date: new Date(),
        }
        : { reasonWeeklyHoursId: reason.get('reasonWeeklyHoursId') };
      const { data } = await callback({ variables });
      this.props.updateEntity({
        key: 'services',
        entity: {
          entities: {
            services: {
              [reason.get('id')]: {
                ...reason.toJS(),
                reasonWeeklyHoursId: checked ? data.createReasonWeeklyHours.id : null,
              },
            },
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div className={styles.reasonHours}>
        <div className={styles.toggleWrapper}>
          <p className={styles.toggleTitle}>Availabilities Override</p>
          <div className={styles.servicesPractForm_all_toggle}>
            <ReasonWeeklyHoursToggle id={this.props.reason.get('reasonWeeklyHoursId')}>
              {commit => (
                <Toggle
                  name="allPractitioners"
                  onChange={({ target: { checked } }) =>
                    this.toggleReasonWeeklyHours(checked, commit)
                  }
                  checked={!!this.props.reason.get('reasonWeeklyHoursId')}
                />
              )}
            </ReasonWeeklyHoursToggle>
          </div>
        </div>
        <FetchReasonHours reasonWeeklyHoursId={this.props.reason.get('reasonWeeklyHoursId')}>
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return `Error!: ${error}`;
            const isClosed = weekDay => data.reasonWeeklyHours[weekDay].isClosed;
            return (
              !!this.props.reason.get('reasonWeeklyHoursId') && (
                <div className={styles.wrapper}>
                  <div className={styles.header}>
                    {week.all.map(weekDay => (
                      <div className={styles.weekDayWrapper} key={uuid()}>
                        <span className={styles.weekDay}>{capitalize(weekDay)}</span>
                        <Button className={styles.edit}>
                          <EditIcon />
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className={styles.body}>
                    <div className={styles.subHeader}>
                      <div className={styles.availabilityTitle}>Availability</div>
                      {week.all.map(weekDay => (
                        <div
                          key={uuid()}
                          className={classNames({
                            [styles.available]: true,
                            [styles.notAvailable]: isClosed(weekDay),
                          })}
                        >
                          {isClosed(weekDay) ? 'Not Available' : 'Available'}
                        </div>
                      ))}
                    </div>
                    <div className={styles.hours}>
                      {range(rangeStartTime, rangeEndTime).map(timeSlot => (
                        <div className={styles.hour} key={uuid()}>
                          <span>{moment.tz(timeSlot, 'H', this.props.timezone).format('h A')}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.daysWrapper}>
                      <div className={styles.days}>
                        {week.all.map(weekDay => (
                          <div className={styles.column} key={uuid()}>
                            {range(rangeStartTime, rangeEndTime).map(() => (
                              <div className={styles.row} key={uuid()} />
                            ))}
                            {isClosed(weekDay) ? (
                              <div className={styles.closedColumn} />
                            ) : (
                              <WeeklyHoursModifiers
                                duration={this.props.reason.get('duration')}
                                timezone={this.props.timezone}
                                rangeStartTime={rangeStartTime}
                                modifiers={{
                                  breaks: data.reasonWeeklyHours[weekDay].breaks,
                                  availabilities: data.reasonWeeklyHours[weekDay].availabilities,
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            );
          }}
        </FetchReasonHours>
      </div>
    );
  }
}

ReasonHours.propTypes = {
  reason: PropTypes.shape(Service).isRequired,
  timezone: PropTypes.string.isRequired,
  updateEntity: PropTypes.func.isRequired,
};
const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
const mapActionsToProps = dispatch => bindActionCreators({ updateEntity }, dispatch);

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(ReasonHours);
