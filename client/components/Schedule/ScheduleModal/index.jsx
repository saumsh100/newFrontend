
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { dateFormatter } from '@carecru/isomorphic';
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
    this.getPractitionerIds = this.getPractitionerIds.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getSchedule = this.getSchedule.bind(this);
  }

  componentDidMount() {
    this.getSchedule(this.state.selectedReason);
  }

  /**
   * Get the practitioners associated to a specific reason.
   *
   * @param selectedReason
   * @returns {Array<any>}
   */
  getPractitionerIds(selectedReason) {
    return this.props.practitioners
      .filter(p => p.services.includes(selectedReason))
      .keySeq()
      .toArray();
  }

  /**
   * Get the schedule of the practitioners related to the selected reason
   *
   * @param value
   */
  getSchedule(value) {
    this.setState({ isLoading: true });

    getFinalDailySchedules({
      fromDate: this.props.scheduleDate,
      practitionerIds: this.getPractitionerIds(value),
    })
      .then(({ data }) =>
        setTimeout(
          () =>
            this.setState({
              isLoading: false,
              practitionersData: Object.values(data)[0],
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
    const { practitioners, reinitializeState } = this.props;
    const { error, practitionersData, isLoading, selectedReason } = this.state;
    return (
      <Modal custom active onEscKeyDown={reinitializeState} onOverlayClick={reinitializeState}>
        <Card noBorder className={styles.debuggingModal}>
          <SContainer>
            <SHeader className={appoitmentsStyle.header}>
              <div>Availabilities</div>
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
                  Object.entries(practitionersData).map(([practitionerId, schedule]) => {
                    const practitioner = practitioners.get(practitionerId);
                    return (
                      <div className={styles.practitionerDebug} key={practitioner.getPrettyName()}>
                        <div className={styles.practitionerTitle}>
                          {practitioner.getPrettyName()} -{' '}
                          {dateFormatter(
                            this.props.scheduleDate,
                            this.props.timezone,
                            'YYYY-MM-DD',
                          )}{' '}
                          ({dateFormatter(this.props.scheduleDate, this.props.timezone, 'dddd')})
                          <span className={styles.extraInfo}>
                            {`{ timezone: ${
                              this.props.timezone
                            }, isCustomSchedule: ${practitioner.get('isCustomSchedule')} }`}
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
                              className={
                                schedule.fillers.length > 0 ? styles.triple : styles.baseHeader
                              }
                            >
                              Fillers
                            </div>
                            <div
                              className={
                                schedule.openings.length > 0 ? styles.double : styles.baseHeader
                              }
                            >
                              Openings
                            </div>
                          </div>
                          <div className={styles.scheduleBody}>
                            <div className={styles.baseBody}>
                              {schedule.isClosed ? 'Closed' : 'Open'}
                            </div>
                            <div className={styles.baseBody}>
                              {schedule.isDailySchedule ? 'Y' : 'N'}
                            </div>
                            <div className={styles.baseBody}>
                              {schedule.isModifiedByTimeOff ? 'Y' : 'N'}
                            </div>
                            <div className={styles.oneHalf}>
                              {dateFormatter(schedule.startTime, this.props.timezone, 'h:mma')}
                            </div>
                            <div className={styles.oneHalf}>
                              {dateFormatter(schedule.endTime, this.props.timezone, 'h:mma')}
                            </div>
                            <div
                              className={
                                schedule.fillers.length > 0 ? styles.triple : styles.baseBody
                              }
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
                              className={
                                schedule.openings.length > 0 ? styles.double : styles.baseBody
                              }
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
  reinitializeState: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  scheduleDate: PropTypes.string.isRequired,
  reasons: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
};

const mapStateToProps = ({ schedule, entities, auth }) => ({
  timezone: auth.get('timezone'),
  scheduleDate: schedule.get('scheduleDate').toISOString(),
  reasons: Object.values(entities.getIn(['services', 'models']).toJS()).map(v => ({
    value: v.id,
    label: v.name,
  })),
  practitioners: entities
    .getIn(['practitioners', 'models'])
    .filter(prac => prac.get('isActive') && !prac.get('isHidden') && prac.get('services').size),
});

export default connect(mapStateToProps)(ScheduleModal);
