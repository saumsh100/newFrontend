
import React, { Component } from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setDateToTimezone, sortAsc, timeOptionsWithTimezone } from '@carecru/isomorphic';
import { Modal, Button, DropdownMenu, Icon } from '../';
import EnabledFeature from '../EnabledFeature';
import MultiSelect from '../MultiSelect';
import List from '../MultiSelect/List';
import Selector from '../MultiSelect/Selector';
import { chairShape } from '../PropTypeShapes';
import InputGroup from './InputGroup';
import styles from './modal.scss';

const dayInMin = (m) => {
  const minutes = m.minutes();
  const hours = m.hours() * 60;

  return minutes + hours;
};

const PMS_MAP = {
  OPENDENTAL: 'OpenDental',
  DENTRIX: 'Dentrix',
  TRACKER: 'Tracker',
  CLEARDENT: 'Cleardent',
  EAGLESOFT: 'Eaglesoft',
  DEFAULT: 'your practice management software',
};

const getAdapterType = (adapterType) => {
  if (!adapterType) return PMS_MAP.DEFAULT;

  const [sanitizeAdapter] = adapterType.split('_');
  if (!(sanitizeAdapter in PMS_MAP)) return PMS_MAP.DEFAULT;

  return PMS_MAP[sanitizeAdapter];
};

const hasError = ({ startTime, endTime }, timezone) =>
  dayInMin(setDateToTimezone(startTime, timezone)) > dayInMin(setDateToTimezone(endTime, timezone));

class EditSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      isClosed: false,
      endTime: null,
      breaks: [],
      chairIds: [],
    };

    this.addBreak = this.addBreak.bind(this);
    this.updateBreakTime = this.updateBreakTime.bind(this);
    this.removeBreak = this.removeBreak.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.hasAnyError = this.hasAnyError.bind(this);
  }

  /**
   * Set the initial values if the provided schedule is different from the old one or
   * if the modal was not visible.
   *
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.schedule !== this.props.schedule) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ ...this.props.schedule });
    }
  }

  /**
   * Adds a new break into the breaks array.
   */
  addBreak() {
    this.setState(prevState => ({
      breaks: [
        ...prevState.breaks,
        {
          id: uuid(),
          startTime: new Date(1970, 1, 0, 8, 0).toISOString(),
          endTime: new Date(1970, 1, 0, 14, 0).toISOString(),
        },
      ],
    }));
  }

  /**
   * Update the break item based on the index, with the provided values.
   * @param index
   * @param value
   */
  updateBreakTime(index, value) {
    this.setState(prevState => ({
      breaks: prevState.breaks.map((b, i) => ({
        ...b,
        ...(i === index ? value : null),
      })),
    }));
  }

  /**
   * Remove the break item based on the index.
   *
   * @param index
   */
  removeBreak(index) {
    const breaks = [...this.state.breaks];
    breaks.splice(index, 1);
    this.setState(() => ({ breaks }));
  }

  /**
   * Reset the state (ingore changes) and close the modal.
   */
  hideModal() {
    this.setState({ ...this.props.schedule }, () => this.props.hideModal());
  }

  /**
   * Check if there's any error with the actual data.
   *
   * @return {boolean}
   */
  hasAnyError() {
    const toValidate = [
      ...(!this.state.isClosed
        ? [
          {
            startTime: this.state.startTime,
            endTime: this.state.endTime,
          },
        ]
        : []),
      ...this.state.breaks,
    ];
    return (
      toValidate.map(validate => hasError(validate, this.props.timezone)).filter(d => d).length > 0
    );
  }

  render() {
    const { timezone, isModalVisible, handleUpdateSchedule, selectedDay, chairs } = this.props;
    const timeOptions = timeOptionsWithTimezone(timezone, 30);
    const items = chairs.toJS();

    const options = Object.values(items)
      .filter(e => e.isActive)
      .map(({ id, name }) => ({
        id,
        label: name,
      }));

    const getSelectedItems = selectedItems =>
      selectedItems
        .map(id => ({ id,
          label: items[id].name }))
        .sort(({ label: a }, { label: b }) => sortAsc(a, b));

    const getAvailableOptions = selectedItems =>
      options
        .filter(({ id }) => !selectedItems.includes(id))
        .sort(({ label: a }, { label: b }) => sortAsc(a, b));

    return (
      <Modal
        active={isModalVisible}
        onEscKeyDown={this.hideModal}
        onOverlayClick={this.hideModal}
        backDropStyles={styles.backDrop}
        className={styles.modal}
      >
        {isModalVisible && (
          <div>
            <div className={styles.header}>
              <h1 className={styles.title}>{this.props.title}</h1>
              <p className={styles.helper}>
                If there are fields disabled, it is because {this.props.pmsName} does not allow
                Donna to update that information. Therefore, this needs to be edited in{' '}
                {this.props.pmsName}.
              </p>
            </div>
            <div className={styles.content}>
              {this.props.editChairs && (
                <div className={styles.groupWrapper}>
                  <span className={styles.label}>Chairs</span>
                  <div className={styles.group}>
                    <MultiSelect
                      onChange={chairIds => this.setState({ chairIds })}
                      itemToString={item => (item ? item.label : '')}
                      initialSelectedItem={this.state.chairIds}
                    >
                      {({
                        getToggleButtonProps,
                        handleSelection,
                        isOpen,
                        selectedItems,
                        getItemProps,
                        highlightedIndex,
                      }) => (
                        <div className={styles.selectWrapper}>
                          <EnabledFeature
                            predicate={() => true}
                            render={({ flags }) => (
                              <Selector
                                disabled={
                                  !flags.get('connector-update-practitioner-dailySchedule-chairIds')
                                }
                                selected={getSelectedItems(selectedItems)}
                                placeholder="Select Chair(s)"
                                selectorProps={getToggleButtonProps()}
                                handleSelection={handleSelection}
                              />
                            )}
                          />
                          <List
                            showFallback
                            isOpen={isOpen}
                            options={getAvailableOptions(selectedItems)}
                            itemProps={getItemProps}
                            selectedItems={selectedItems}
                            highlightedIndex={highlightedIndex}
                          />
                        </div>
                      )}
                    </MultiSelect>
                  </div>
                </div>
              )}
              <div className={styles.groupWrapper}>
                <span className={styles.label}>
                  Office Hours{' '}
                  <div className={styles.dropdownWrapper}>
                    <DropdownMenu
                      align="left"
                      labelComponent={props => (
                        <Button {...props} compact className={styles.labelButton}>
                          {this.state.isClosed ? 'Closed' : 'Opened'}{' '}
                          <Icon icon="chevron-down" size={0.8} className={styles.labelIcon} />
                        </Button>
                      )}
                      className={styles.optionMenu}
                    >
                      <Button
                        className={styles.optionButton}
                        onClick={() => this.setState({ isClosed: false })}
                      >
                        Opened
                      </Button>
                      <Button
                        className={styles.optionButton}
                        onClick={() => this.setState({ isClosed: true })}
                      >
                        Closed
                      </Button>
                    </DropdownMenu>
                  </div>
                </span>
                <EnabledFeature
                  predicate={() => true}
                  render={({ flags }) => {
                    const isAllow = selectedDay
                      ? flags.get('connector-update-practitioner-dailySchedules')
                      : flags.get('connector-update-practitioner-weeklySchedule');
                    return (
                      <div className={styles.group}>
                        {this.state.isClosed ? (
                          <p className={styles.closeMessage}>Open Office Hours to edit</p>
                        ) : (
                          <InputGroup
                            timeOptions={timeOptions}
                            timezone={timezone}
                            isAllow={isAllow}
                            error={hasError(this.state, timezone)}
                            startTime={this.state.startTime}
                            endTime={this.state.endTime}
                            onChange={update => this.setState(update)}
                          />
                        )}
                      </div>
                    );
                  }}
                />
              </div>
              <div className={styles.groupWrapper}>
                <span className={styles.label}>Breaks</span>
                {this.state.breaks.map((b, index) => (
                  <EnabledFeature
                    predicate={() => true}
                    render={({ flags }) => {
                      const isAllow = selectedDay
                        ? flags.get('connector-update-practitioner-dailySchedules')
                        : flags.get('connector-update-practitioner-weeklySchedule');
                      return (
                        <div className={styles.group} key={b.id}>
                          <InputGroup
                            error={hasError(b, timezone)}
                            isRemovable
                            onClick={() => this.removeBreak(index)}
                            timeOptions={timeOptions}
                            timezone={timezone}
                            isAllow={isAllow}
                            startTime={b.startTime}
                            endTime={b.endTime}
                            onChange={update => this.updateBreakTime(index, update)}
                          />
                        </div>
                      );
                    }}
                  />
                ))}
                <EnabledFeature
                  predicate={({ flags }) =>
                    (selectedDay
                      ? flags.get('connector-update-practitioner-dailySchedules')
                      : flags.get('connector-update-practitioner-weeklySchedule'))
                  }
                  render={() => (
                    <Button onClick={this.addBreak} className={styles.addBreak}>
                      Add Breaks
                    </Button>
                  )}
                  fallback={() => this.state.breaks.length === 0 && <p>N/A</p>}
                />
              </div>
            </div>
            <div className={styles.footer}>
              <EnabledFeature
                predicate={({ flags }) =>
                  flags.get('connector-update-practitioner-dailySchedule-chairIds') ||
                  flags.get('connector-update-practitioner-dailySchedules') ||
                  flags.get('connector-update-practitioner-weeklySchedule')
                }
                fallback={() => (
                  <Button className={styles.cancel} onClick={this.hideModal}>
                    Close
                  </Button>
                )}
                render={() => (
                  <div>
                    <Button className={styles.cancel} onClick={this.hideModal}>
                      Cancel
                    </Button>
                    <Button
                      className={styles.save}
                      disabled={this.hasAnyError()}
                      onClick={() => handleUpdateSchedule(this.state)}
                    >
                      Update
                    </Button>
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = ({ auth, entities }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const adapterType = getAdapterType(auth.get('adapterType'));

  return {
    timezone: activeAccount.get('timezone'),
    pmsName: adapterType,
    chairs: entities.getIn(['chairs', 'models']),
  };
};

export default connect(mapStateToProps)(EditSchedule);

EditSchedule.propTypes = {
  title: PropTypes.string.isRequired,
  editChairs: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  handleUpdateSchedule: PropTypes.func.isRequired,
  selectedDay: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  chairs: PropTypes.arrayOf(PropTypes.shape(chairShape)),
  pmsName: PropTypes.string.isRequired,
  schedule: PropTypes.shape({
    breaks: PropTypes.array,
    chairIds: PropTypes.array,
    endTime: PropTypes.string,
    isClosed: PropTypes.bool,
    isDailySchedule: PropTypes.bool,
    isFeatured: PropTypes.bool,
    startTime: PropTypes.string,
  }),
  timezone: PropTypes.string.isRequired,
};

EditSchedule.defaultProps = {
  schedule: {},
  chairs: [],
  selectedDay: null,
};
