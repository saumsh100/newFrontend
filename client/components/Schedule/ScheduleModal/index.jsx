
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateFormatter } from '@carecru/isomorphic';
import classnames from 'classnames';
import {
  Button,
  Card,
  Icon,
  SBody,
  SContainer,
  SFooter,
  SHeader,
  DropdownSelect,
  Modal,
  Loading,
} from '../../library';
import appoitmentsStyle from '../AddNewAppointment/styles.scss';
import getFinalDailySchedules from './getFinalDailySchedules';
import styles from './styles.scss';

class ScheduleModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedReason: (props.reasons[0] && props.reasons[0].value) || '',
      practitionersData: {},
      error: '',
      isLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.getSchedule = this.getSchedule.bind(this);
  }

  componentDidMount() {
    this.getSchedule(this.state.selectedReason);
  }

  /**
   * Get the schedule of the practitioners related to the selected reason
   *
   * @param value
   */
  getSchedule(value) {
    this.setState({ isLoading: true });
    getFinalDailySchedules({
      accountId: this.props.accountId,
      startDate: this.props.scheduleDate,
      reasonId: value,
    })
      .then(({ data: { practitionersData } }) =>
        setTimeout(
          () =>
            this.setState({
              isLoading: false,
              practitionersData,
            }),
          500,
        ))
      .catch((error) => {
        this.setState({
          error,
          isLoading: false,
        });
        console.error('fetching finalDailySchedules request error', error);
      });
  }

  handleChange(value) {
    this.setState({ selectedReason: value });
    this.getSchedule(value);
  }

  render() {
    const { reinitializeState } = this.props;
    const { error, practitionersData, isLoading, selectedReason } = this.state;
    return (
      <Modal custom active onEscKeyDown={reinitializeState} onOverlayClick={reinitializeState}>
        <Card noBorder className={styles.debuggingModal}>
          <SContainer>
            <SHeader className={appoitmentsStyle.header}>
              <div>Schedule</div>
              <Button className={appoitmentsStyle.close} onClick={reinitializeState}>
                <Icon icon="times" />
              </Button>
            </SHeader>
            <SBody className={styles.body}>
              {error && (
                <div>
                  <h3>You still have some configuration to do.</h3>
                  <p>It looks like you did not assign a reason to any practitioner.</p>
                </div>
              )}
              {!error && (
                <DropdownSelect
                  label="Reason:"
                  value={selectedReason}
                  onChange={this.handleChange}
                  options={this.props.reasons}
                />
              )}
              <div className={styles.practitionerDebugWrapper}>
                {isLoading ? (
                  <Loading />
                ) : (
                  Object.values(practitionersData).map(({ openingsData, ...practitioner }) => {
                    const [schedule] = Object.values(openingsData);
                    return (
                      <div className={styles.practitionerDebug} key={practitioner.id}>
                        <div className={styles.practitionerTitle}>
                          {practitioner.firstName} {practitioner.lastName} -{' '}
                          {dateFormatter(
                            this.props.scheduleDate,
                            this.props.timezone,
                            'YYYY-MM-DD',
                          )}{' '}
                          ({dateFormatter(this.props.scheduleDate, this.props.timezone, 'dddd')})
                          <span className={styles.extraInfo}>
                            {`{ timezone: ${this.props.timezone}, isCustomSchedule: `}
                            {`${schedule.dailySchedule.isCustomSchedule || 'Y'} }`}
                          </span>
                        </div>
                        <div className={styles.schedule}>
                          <div className={styles.scheduleHeader}>
                            <div className={styles.baseHeader}>Status</div>
                            <div className={styles.baseHeader}>DS?</div>
                            <div className={styles.baseHeader}>TO?</div>
                            <div className={styles.oneHalf}>Start Time</div>
                            <div className={styles.oneHalf}>End Time</div>
                            <div
                              className={classnames({
                                [styles.triple]: schedule.fillers.length,
                                [styles.baseHeader]: !schedule.fillers.length,
                              })}
                            >
                              Fillers
                            </div>
                            <div
                              className={classnames({
                                [styles.double]: schedule.openings.length,
                                [styles.baseHeader]: !schedule.openings.length,
                              })}
                            >
                              Openings
                            </div>
                            <div
                              className={classnames({
                                [styles.double]: schedule.availabilities.length,
                                [styles.baseHeader]: !schedule.availabilities.length,
                              })}
                            >
                              Availabilities
                            </div>
                          </div>
                          <div className={styles.scheduleBody}>
                            <div className={styles.baseBody}>
                              {schedule.dailySchedule.isClosed ? 'Closed' : 'Open'}
                            </div>
                            <div className={styles.baseBody}>
                              {schedule.dailySchedule.isDailySchedule ? 'Y' : 'N'}
                            </div>
                            <div className={styles.baseBody}>
                              {schedule.dailySchedule.isModifiedByTimeOff ? 'Y' : 'N'}
                            </div>
                            <div className={styles.oneHalf}>
                              {dateFormatter(
                                schedule.dailySchedule.startTime,
                                this.props.timezone,
                                'h:mma',
                              )}
                            </div>
                            <div className={styles.oneHalf}>
                              {dateFormatter(
                                schedule.dailySchedule.endTime,
                                this.props.timezone,
                                'h:mma',
                              )}
                            </div>
                            <div
                              className={classnames({
                                [styles.triple]: schedule.fillers.length,
                                [styles.baseBody]: !schedule.fillers.length,
                              })}
                            >
                              {schedule.fillers.length > 0
                                ? schedule.fillers.map(({ startDate, endDate, chairId, type }) => (
                                    <div
                                      className={styles.block}
                                      key={`filler_${chairId}_${startDate}_${type}`}
                                    >
                                      <span>
                                        {dateFormatter(startDate, this.props.timezone, 'hh:mma')}
                                      </span>
                                      <span>
                                        {dateFormatter(endDate, this.props.timezone, 'hh:mma')}
                                      </span>
                                      <span>{type}</span>
                                    </div>
                                  ))
                                : 'None'}
                            </div>
                            <div
                              className={classnames({
                                [styles.double]: schedule.openings.length,
                                [styles.baseBody]: !schedule.openings.length,
                              })}
                            >
                              {schedule.openings.length > 0
                                ? schedule.openings.map(({ startDate, endDate }) => (
                                    <div className={styles.block} key={`opening_${startDate}`}>
                                      <span>
                                        {dateFormatter(startDate, this.props.timezone, 'hh:mma')}
                                      </span>
                                      <span>
                                        {dateFormatter(endDate, this.props.timezone, 'hh:mma')}
                                      </span>
                                    </div>
                                  ))
                                : 'None'}
                            </div>
                            <div
                              className={classnames({
                                [styles.double]: schedule.availabilities.length,
                                [styles.baseBody]: !schedule.availabilities.length,
                              })}
                            >
                              {schedule.availabilities.length > 0
                                ? schedule.availabilities.map(({ startDate, endDate }) => (
                                    <div
                                      className={styles.block}
                                      key={`availabilities_${startDate}`}
                                    >
                                      <span>
                                        {dateFormatter(startDate, this.props.timezone, 'hh:mma')}
                                      </span>
                                      <span>
                                        {dateFormatter(endDate, this.props.timezone, 'hh:mma')}
                                      </span>
                                    </div>
                                  ))
                                : 'None'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </SBody>
            <SFooter className={appoitmentsStyle.footer}>
              <div className={appoitmentsStyle.button_cancel}>
                <Button onClick={reinitializeState} border="blue">
                  Cancel
                </Button>
              </div>
            </SFooter>
          </SContainer>
        </Card>
      </Modal>
    );
  }
}

ScheduleModal.propTypes = {
  accountId: PropTypes.string.isRequired,
  reinitializeState: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  scheduleDate: PropTypes.string.isRequired,
  reasons: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
};

const mapStateToProps = ({ schedule, entities, auth }) => ({
  accountId: auth.get('accountId'),
  timezone: auth.get('timezone'),
  scheduleDate: schedule.get('scheduleDate'),
  reasons: Object.values(entities.getIn(['services', 'models']).toJS()).map(v => ({
    value: v.id,
    label: v.name,
  })),
});

export default connect(mapStateToProps)(ScheduleModal);
