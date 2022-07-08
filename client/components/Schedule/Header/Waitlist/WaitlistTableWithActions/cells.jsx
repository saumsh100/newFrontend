import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import tableStyles from '../tableStyles.scss';
import styles from './reskin-styles.scss';
import { Button, DropdownMenu, Checkbox, Icon } from '../../../../library';
import EllipsisIcon from '../EllipsisIcon';
import { patientShape } from '../../../../library/PropTypeShapes';
import Tooltip from '../../../../Tooltip';
// import { Icon } from '@carecru/component-library';

export const ManageCell = ({ value }) => (
  <DropdownMenu
    labelComponent={(props) => (
      <div {...props} className={tableStyles.ellipsisButton}>
        <EllipsisIcon />
      </div>
    )}
  >
    <Button className={tableStyles.actionItem} onClick={value.onEdit(value.id)}>
      <Icon icon="edit" />
      <span className={tableStyles.text}>Edit</span>
    </Button>
    <Button className={tableStyles.actionItem} onClick={value.onRemove}>
      <Icon icon="trash" />
      Delete
    </Button>
  </DropdownMenu>
);

ManageCell.propTypes = {
  value: PropTypes.shape({
    id: PropTypes.string,
    isPatientUser: PropTypes.bool,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
  }).isRequired,
};

export const WaitSpotCheckboxCell = ({ value }) => (
  <Checkbox
    className={styles.waitSpotCheckboxWrapper}
    checked={value.checked}
    onChange={value.onChange}
  />
);

WaitSpotCheckboxCell.propTypes = {
  value: PropTypes.shape({
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  }).isRequired,
};

const namePropTypes = {
  value: PropTypes.shape({
    PopOverComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]),
    patient: PropTypes.shape(patientShape),
  }).isRequired,
};

export const FirstNameCell = ({ value }) => {
  const { PopOverComponent, patient } = value;
  return (
    patient && (
      <PopOverComponent patient={patient} zIndex={9999}>
        <div style={{ textAlign: 'center' }}>{`${patient.firstName}`}</div>
      </PopOverComponent>
    )
  );
};

FirstNameCell.propTypes = namePropTypes;

export const LastNameCell = ({ value }) => {
  const { PopOverComponent, patient } = value;
  return (
    patient && (
      <PopOverComponent patient={patient} zIndex={9999}>
        <div style={{ textAlign: 'center' }}>{`${patient.lastName}`}</div>
      </PopOverComponent>
    )
  );
};

LastNameCell.propTypes = namePropTypes;

const DivTimesText = ({ times }) => {
  const divRef = useRef(null);

  /**
   * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
   *
   * @param {String} text The text to be rendered.
   * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
   *
   * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
   */
  function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  const trimTimes = useCallback(
    (value) => {
      if (divRef.current) {
        const fontSize = parseFloat(window.getComputedStyle(divRef.current)['font-size']);
        const valueParts = value.split('; ');
        let valueTruncated = value;
        const divMaxWidth = 100;
        while (getTextWidth(valueTruncated, `${fontSize + 2}px sans-serif`) > divMaxWidth) {
          valueParts.pop();
          valueTruncated = `${valueParts.join('; ')}...`;
        }
        return valueTruncated;
      }
      return value;
    },
    [times],
  );

  return (
    <div ref={divRef} className={tableStyles.noteTDWrapper}>
      {trimTimes(times)}
    </div>
  );
};

DivTimesText.propTypes = {
  times: PropTypes.string.isRequired,
};

export const TimesCell = ({ value }) => {
  return (
    <Tooltip
      body={<div>{value.times}</div>}
      placement="below"
      tipSize={0.01}
      styleOverride={tableStyles.notesTooltip}
    >
      <DivTimesText times={value.times} />
    </Tooltip>
  );
};

TimesCell.propTypes = {
  value: PropTypes.shape({
    times: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.shape({}))]),
  }).isRequired,
};

export const DaysCell = ({ value }) => {
  return (
    <Tooltip
      body={<div>{value.dates}</div>}
      placement="below"
      tipSize={0.01}
      styleOverride={tableStyles.notesTooltip}
    >
      <div className={tableStyles.noteTDWrapper}>{value.dates}</div>
    </Tooltip>
  );
};
DaysCell.propTypes = {
  value: PropTypes.shape({
    dates: PropTypes.string,
  }).isRequired,
};

export const WaitspotNotesCell = ({ value }) => (
  <Tooltip
    body={<div>{value.note}</div>}
    placement="below"
    tipSize={0.01}
    styleOverride={tableStyles.notesTooltip}
  >
    <div className={tableStyles.noteTDWrapper}>{value.note}</div>
  </Tooltip>
);

WaitspotNotesCell.propTypes = {
  value: PropTypes.shape({
    note: PropTypes.string,
  }).isRequired,
};
