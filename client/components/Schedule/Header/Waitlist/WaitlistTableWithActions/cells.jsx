
import React from 'react';
import PropTypes from 'prop-types';
import tableStyles from '../tableStyles.scss';
import styles from './styles.scss';
import { Button, DropdownMenu, Checkbox } from '../../../../library';
import EllipsisIcon from '../EllipsisIcon';
import { patientShape } from '../../../../library/PropTypeShapes';
import Tooltip from '../../../../Tooltip';

export const ManageCell = ({ value }) => (
  <DropdownMenu
    labelComponent={props => (
      <Button {...props} className={tableStyles.ellipsisButton}>
        <EllipsisIcon />
      </Button>
    )}
  >
    {!value.isPatientUser && (
      <Button className={tableStyles.actionItem} onClick={value.onEdit(value.id)}>
        Edit
      </Button>
    )}
    <Button className={tableStyles.actionItem} onClick={value.onRemove}>
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
        <div>{`${patient.firstName}`}</div>
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
        <div>{`${patient.lastName}`}</div>
      </PopOverComponent>
    )
  );
};

LastNameCell.propTypes = namePropTypes;

export const TimesCell = ({ value }) => (
  <Tooltip
    body={<div>{value.times}</div>}
    placement="below"
    tipSize={0.01}
    styleOverride={tableStyles.notesTooltip}
  >
    <div className={tableStyles.noteTDWrapper}>{value.times}</div>
  </Tooltip>
);

TimesCell.propTypes = {
  value: PropTypes.shape({
    times: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.shape({}))]),
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
