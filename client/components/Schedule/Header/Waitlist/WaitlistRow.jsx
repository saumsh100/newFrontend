
import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from '@carecru/isomorphic';
import { Checkbox, Button, DropdownMenu } from '../../../library';
import EllipsisIcon from './EllipsisIcon';
import { patientShape } from '../../../library/PropTypeShapes';
import Tooltip from '../../../Tooltip';
import tableStyles from './tableStyles.scss';

const WaitlistRow = ({
  addedDate,
  dates,
  duration,
  nextApptDate,
  note,
  patient,
  PopOverComponent,
  checked,
  onChange,
  onEdit,
  reasonText,
  onRemove,
  times,
  id,
}) => (
  <tr className={tableStyles.row}>
    <td data-width="20" />
    <td className={tableStyles.col} data-width="xs">
      <Checkbox checked={checked} onChange={onChange} />
    </td>
    <td className={tableStyles.col}>{addedDate}</td>
    <td className={tableStyles.col}>
      <PopOverComponent patient={patient} zIndex={9999}>
        <div>{`${patient.firstName} ${patient.lastName}`}</div>
      </PopOverComponent>
    </td>
    <td className={tableStyles.col}>{capitalize(reasonText || '')}</td>
    <td className={tableStyles.col} data-width="sm">
      {duration}
    </td>
    <td className={tableStyles.col}>{dates}</td>
    <td className={tableStyles.col}>{times}</td>
    <td className={tableStyles.col} data-width="md">
      <Tooltip
        body={<div>{note}</div>}
        placement="below"
        tipSize={0.01}
        styleOverride={tableStyles.notesTooltip}
      >
        <div className={tableStyles.noteTDWrapper}>{note}</div>
      </Tooltip>
    </td>
    <td className={tableStyles.col}>{nextApptDate}</td>
    <td className={tableStyles.col} data-width="sm">
      <DropdownMenu
        labelComponent={props => (
          <Button {...props} className={tableStyles.ellipsisButton}>
            <EllipsisIcon />
          </Button>
        )}
      >
        <Button className={tableStyles.actionItem} onClick={onEdit(id)}>
          Edit
        </Button>
        <Button className={tableStyles.actionItem} onClick={onRemove}>
          Delete
        </Button>
      </DropdownMenu>
    </td>
    <td data-width="20" />
  </tr>
);

export default React.memo(WaitlistRow);

WaitlistRow.propTypes = {
  PopOverComponent: PropTypes.objectOf(PropTypes.any).isRequired,
  addedDate: PropTypes.string.isRequired,
  dates: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  duration: PropTypes.number,
  nextApptDate: PropTypes.string,
  note: PropTypes.string,
  patient: PropTypes.shape(patientShape).isRequired,
  reasonText: PropTypes.string,
  times: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

WaitlistRow.defaultProps = {
  checked: false,
  note: '',
  duration: null,
  reasonText: '',
  nextApptDate: '',
};
