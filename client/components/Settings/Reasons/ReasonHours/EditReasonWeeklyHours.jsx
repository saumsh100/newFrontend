
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../../library';
import DropdownSuggestion from '../../../library/DropdownSuggestion';
import InputGroup from '../../../library/ScheduleCalendar/InputGroup';
import renderList from './renderList';
import ActiveScheduleModifiers from './ActiveScheduleModifiers';
import { hasError } from '../../../library/ScheduleCalendar/EditSchedule';
import styles from '../../../library/ScheduleCalendar/modal.scss';
import ui from '../../../../ui-kit.scss';

const options = [
  {
    value: 'isClosed',
    label: 'None',
  },
  {
    value: 'breaks',
    label: 'All Day',
  },
  {
    value: 'availabilities',
    label: 'During Set Times',
  },
];

const theme = {
  toggleDiv: ui.dropdown__input__wrapper,
  toggleValueDiv: ui.dropdown__input,
  inputToggler: ui.dropdown__input,
  wrapper: ui.dropdown__wrapper,
  errorIcon: ui.dropdown__errorIcon,
  erroredInput: ui.dropdown__errorInput,
};

const EditReasonWeeklyHours = props => (
  <Modal
    active={props.isModalVisible}
    onEscKeyDown={props.hideModal}
    onOverlayClick={props.hideModal}
    backDropStyles={styles.backDrop}
    className={styles.modal}
  >
    {props.isModalVisible && (
      <div>
        {props.header}
        <div className={styles.content}>
          <div className={styles.groupWrapper}>
            <span className={ui.modal__label}>Availability</span>
            <div className={styles.group}>
              <DropdownSuggestion
                name="reason-weekly-hours"
                label=""
                error=""
                options={options}
                data-test-id="reason-weekly-hours"
                onChange={props.handleOverrideDropdownChange}
                renderValue={value => options.find(option => option.value === value).label}
                value={props.active}
                strict={false}
                renderList={renderList}
                theme={theme}
              />
            </div>
          </div>
          <ActiveScheduleModifiers {...props}>
            {(option, index) =>
              (props.active === 'breaks' ? (
                <InputGroup
                  isAllow
                  isRemovable
                  error={hasError(option, props.timezone)}
                  onClick={() => props.removeBreak(index)}
                  timeOptions={props.timeOptions}
                  timezone={props.timezone}
                  renderList={renderList}
                  theme={theme}
                  startTime={option.startTime}
                  endTime={option.endTime}
                  onChange={update => props.updateBreakTime(index, update)}
                />
              ) : (
                <InputGroup
                  isAllow
                  isRemovable
                  showEndTime={false}
                  onClick={() => props.removeAvailability(index)}
                  timeOptions={props.timeOptions}
                  timezone={props.timezone}
                  renderList={renderList}
                  theme={theme}
                  startTime={option.startTime}
                  endTime={option.endTime}
                  onChange={update => props.updateAvailabilities(index, update)}
                />
              ))
            }
          </ActiveScheduleModifiers>
        </div>
        {props.footer}
      </div>
    )}
  </Modal>
);

EditReasonWeeklyHours.defaultProps = { data: null };

export default EditReasonWeeklyHours;

EditReasonWeeklyHours.propTypes = {
  active: PropTypes.string.isRequired,
  data: PropTypes.shape({
    availabilities: PropTypes.array,
    breaks: PropTypes.array,
    id: PropTypes.string,
    isClosed: PropTypes.bool,
  }),
  footer: PropTypes.element.isRequired,
  handleOverrideDropdownChange: PropTypes.func.isRequired,
  header: PropTypes.element.isRequired,
  hideModal: PropTypes.func.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  removeAvailability: PropTypes.func.isRequired,
  removeBreak: PropTypes.func.isRequired,
  timeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      labe: PropTypes.string,
    }),
  ).isRequired,
  timezone: PropTypes.string.isRequired,
  timeToIsoString: PropTypes.func.isRequired,
  updateAvailabilities: PropTypes.func.isRequired,
  updateBreakTime: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
};
